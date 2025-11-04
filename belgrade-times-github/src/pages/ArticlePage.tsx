import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, Article, Category, Comment } from '../lib/supabase'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Clock, User, Share2, MessageCircle, Bookmark } from 'lucide-react'
import { format } from 'date-fns'
import { sr } from 'date-fns/locale'
import { useAuth } from '../contexts/AuthContext'

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    loadData()
  }, [slug])

  async function loadData() {
    try {
      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      setCategories(categoriesData || [])

      // Load article
      const { data: articleData } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()

      setArticle(articleData)

      if (articleData) {
        // Load comments
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*')
          .eq('article_id', articleData.id)
          .is('parent_id', null)
          .order('created_at', { ascending: false })

        setComments(commentsData || [])

        // Record article view
        if (user) {
          await supabase.from('article_views').insert({
            article_id: articleData.id,
            user_id: user.id
          })
        }
      }
    } catch (error) {
      console.error('Error loading article:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !article || !commentText.trim()) return

    setSubmittingComment(true)
    try {
      const { error } = await supabase.from('comments').insert({
        article_id: article.id,
        user_id: user.id,
        content: commentText.trim()
      })

      if (!error) {
        setCommentText('')
        await loadData()
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  async function handleBookmark() {
    if (!user || !article) return

    try {
      // Check if already bookmarked
      const { data: existing } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('article_id', article.id)
        .maybeSingle()

      if (existing) {
        await supabase.from('bookmarks').delete().eq('id', existing.id)
      } else {
        await supabase.from('bookmarks').insert({
          user_id: user.id,
          article_id: article.id
        })
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  const getCategoryColor = (categorySlug: string | null) => {
    const category = categories.find(c => c.slug === categorySlug)
    return category?.color || '#dc2626'
  }

  const getCategoryName = (categorySlug: string | null) => {
    const category = categories.find(c => c.slug === categorySlug)
    return category?.name || categorySlug
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header categories={categories} />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vest nije pronađena</h1>
          <Link to="/" className="text-red-600 hover:underline">
            Vrati se na početnu stranu
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} />

      <main className="flex-1">
        <article className="bg-white">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Category Badge */}
            <div className="mb-4">
              <Link
                to={`/category/${article.category}`}
                className="inline-block px-3 py-1 text-sm font-semibold text-white rounded hover:opacity-80"
                style={{ backgroundColor: getCategoryColor(article.category) }}
              >
                {getCategoryName(article.category)}
              </Link>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              {article.author_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author_name}</span>
                </div>
              )}
              {article.published_at && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(article.published_at), 'dd. MMMM yyyy. HH:mm', { locale: sr })}
                  </span>
                </div>
              )}
              {article.reading_time && (
                <span>{article.reading_time} min čitanja</span>
              )}
            </div>

            {/* Article Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleBookmark}
                disabled={!user}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <Bookmark className="h-4 w-4" />
                Sačuvaj
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                Podeli
              </button>
            </div>

            {/* Featured Image */}
            {article.featured_image_url && (
              <div className="mb-8">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="h-6 w-6" />
                Komentari ({comments.length})
              </h2>

              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Napiši komentar..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={4}
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || submittingComment}
                    className="mt-3 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {submittingComment ? 'Šalje se...' : 'Objavi komentar'}
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600">
                    <Link to="/admin/login" className="text-red-600 hover:underline">
                      Prijavite se
                    </Link>{' '}
                    da biste ostavili komentar
                  </p>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            Korisnik
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(comment.created_at), 'dd. MMM yyyy. HH:mm', { locale: sr })}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    Još nema komentara. Budite prvi koji će komentarisati!
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
