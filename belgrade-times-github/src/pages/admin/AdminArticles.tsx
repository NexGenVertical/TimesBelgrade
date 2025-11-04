import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Article } from '../../lib/supabase'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'

export function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    loadArticles()
  }, [filter])

  async function loadArticles() {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data } = await query
      setArticles(data || [])
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      await supabase.from('articles').delete().eq('id', id)
      await loadArticles()
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <Link
          to="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="h-5 w-5" />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All ({articles.length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'published' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'draft' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Drafts
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {article.featured_image_url && (
                      <img
                        src={article.featured_image_url}
                        alt=""
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {article.excerpt}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {article.author_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {article.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(article.status)}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(article.created_at), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {article.status === 'published' && (
                      <a
                        href={`/article/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    )}
                    <Link
                      to={`/admin/articles/edit/${article.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
