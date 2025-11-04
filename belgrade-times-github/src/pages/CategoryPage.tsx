import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, Article, Category } from '../lib/supabase'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sr } from 'date-fns/locale'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

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

      const category = categoriesData?.find(c => c.slug === slug)
      setCurrentCategory(category || null)

      // Load articles for this category
      const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .eq('category', slug)
        .order('published_at', { ascending: false })

      setArticles(articlesData || [])
    } catch (error) {
      console.error('Error loading category:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-1 h-8 rounded"
                style={{ backgroundColor: currentCategory?.color || '#dc2626' }}
              />
              <h1 className="text-4xl font-bold text-gray-900">
                {currentCategory?.name || slug}
              </h1>
            </div>
            {currentCategory?.description && (
              <p className="text-gray-600 text-lg ml-5">
                {currentCategory.description}
              </p>
            )}
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
                >
                  {article.featured_image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {article.author_name && (
                        <span>{article.author_name}</span>
                      )}
                      {article.published_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(article.published_at), { 
                            addSuffix: true, 
                            locale: sr 
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg mb-4">
                Trenutno nema vesti u ovoj kategoriji.
              </p>
              <Link to="/" className="text-red-600 hover:underline">
                Vrati se na početnu stranu
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
