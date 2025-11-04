import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase, Category } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Save, ArrowLeft } from 'lucide-react'

export function AdminArticleEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image_url: '',
    category: '',
    status: 'draft' as 'draft' | 'published',
    language: 'sr'
  })

  useEffect(() => {
    loadCategories()
    if (id) {
      loadArticle()
    }
  }, [id])

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    setCategories(data || [])
  }

  async function loadArticle() {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || '',
        featured_image_url: data.featured_image_url || '',
        category: data.category || '',
        status: data.status as 'draft' | 'published',
        language: data.language || 'sr'
      })
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from title
    if (name === 'title' && !id) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const articleData = {
        ...formData,
        author_id: user.id,
        author_name: profile?.full_name || 'Unknown',
        reading_time: Math.ceil(formData.content.split(' ').length / 200),
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }

      if (id) {
        await supabase.from('articles').update(articleData).eq('id', id)
      } else {
        await supabase.from('articles').insert(articleData)
      }

      navigate('/admin/articles')
    } catch (error) {
      console.error('Error saving article:', error)
      alert('Error saving article')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/articles')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Article' : 'New Article'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
            />
          </div>

          {/* Featured Image URL */}
          <div>
            <label htmlFor="featured_image_url" className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image URL
            </label>
            <input
              type="url"
              id="featured_image_url"
              name="featured_image_url"
              value={formData.featured_image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Category and Status Row */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language *
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="sr">Serbian</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {loading ? 'Saving...' : 'Save Article'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/articles')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
