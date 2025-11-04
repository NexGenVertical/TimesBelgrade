import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase, Article, Category } from '../lib/supabase'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Search, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { sr } from 'date-fns/locale'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    loadCategories()
    const searchQuery = searchParams.get('q')
    if (searchQuery) {
      setQuery(searchQuery)
      performSearch(searchQuery)
    }
  }, [searchParams])

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    setCategories(data || [])
  }

  async function performSearch(searchQuery: string) {
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const { data } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .order('published_at', { ascending: false })
        .limit(50)

      setArticles(data || [])
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query })
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Pretraga vesti</h1>
            
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pretražite vesti po ključnim rečima..."
                  className="w-full px-6 py-4 pl-14 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg"
                />
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Pretraži
                </button>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : searched ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Pronađeno <strong>{articles.length}</strong> rezultata za "{searchParams.get('q')}"
                </p>
              </div>

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
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">
                    Nisu pronađeni rezultati za vašu pretragu.
                  </p>
                  <p className="text-gray-400">
                    Pokušajte sa drugim ključnim rečima.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Unesite ključne reči za pretragu vesti.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
