import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Article, Category, BreakingNews } from '../lib/supabase'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Clock, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sr } from 'date-fns/locale'

export function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [breakingNews, setBreakingNews] = useState<BreakingNews | null>(null)
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Load breaking news
      const { data: breakingData } = await supabase
        .from('breaking_news')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .maybeSingle()

      setBreakingNews(breakingData)

      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      setCategories(categoriesData || [])

      // Load articles
      const { data: articlesData } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(20)

      if (articlesData && articlesData.length > 0) {
        setFeaturedArticle(articlesData[0])
        setArticles(articlesData.slice(1))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} />

      <main className="flex-1">
        {/* Breaking News Banner */}
        {breakingNews && (
          <div className="bg-red-600 text-white py-3">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 flex-shrink-0" />
                <span className="font-bold uppercase text-sm">Najnovije:</span>
                <div className="flex-1 overflow-hidden">
                  <a 
                    href={breakingNews.link_url || '#'} 
                    className="hover:underline truncate block"
                  >
                    {breakingNews.title}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-12">
              <Link to={`/article/${featuredArticle.slug}`} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredArticle.featured_image_url && (
                      <div className="h-96 md:h-full overflow-hidden">
                        <img
                          src={featuredArticle.featured_image_url}
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className={`p-8 flex flex-col justify-center ${!featuredArticle.featured_image_url ? 'md:col-span-2' : ''}`}>
                      <div className="mb-3">
                        <span 
                          className="inline-block px-3 py-1 text-sm font-semibold text-white rounded"
                          style={{ backgroundColor: getCategoryColor(featuredArticle.category) }}
                        >
                          {getCategoryName(featuredArticle.category)}
                        </span>
                      </div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                        {featuredArticle.title}
                      </h1>
                      {featuredArticle.excerpt && (
                        <p className="text-lg text-gray-600 mb-4 line-clamp-3">
                          {featuredArticle.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {featuredArticle.author_name && (
                          <span>Autor: {featuredArticle.author_name}</span>
                        )}
                        {featuredArticle.published_at && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDistanceToNow(new Date(featuredArticle.published_at), { 
                              addSuffix: true, 
                              locale: sr 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Latest Articles Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2 inline-block">
              Najnovije vesti
            </h2>
          </div>

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
                  <div className="mb-2">
                    <span 
                      className="inline-block px-2 py-1 text-xs font-semibold text-white rounded"
                      style={{ backgroundColor: getCategoryColor(article.category) }}
                    >
                      {getCategoryName(article.category)}
                    </span>
                  </div>
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

          {articles.length === 0 && !featuredArticle && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Trenutno nema objavljenih vesti.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
