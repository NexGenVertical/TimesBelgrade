import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { FileText, Users, MessageCircle, Eye } from 'lucide-react'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalComments: 0,
    totalUsers: 0,
    totalViews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const [articlesRes, publishedRes, draftsRes, commentsRes, usersRes, viewsRes] = await Promise.all([
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('article_views').select('*', { count: 'exact', head: true })
      ])

      setStats({
        totalArticles: articlesRes.count || 0,
        publishedArticles: publishedRes.count || 0,
        draftArticles: draftsRes.count || 0,
        totalComments: commentsRes.count || 0,
        totalUsers: usersRes.count || 0,
        totalViews: viewsRes.count || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Articles', value: stats.totalArticles, icon: FileText, color: 'bg-blue-500' },
    { label: 'Published', value: stats.publishedArticles, icon: FileText, color: 'bg-green-500' },
    { label: 'Drafts', value: stats.draftArticles, icon: FileText, color: 'bg-yellow-500' },
    { label: 'Comments', value: stats.totalComments, icon: MessageCircle, color: 'bg-purple-500' },
    { label: 'Users', value: stats.totalUsers, icon: Users, color: 'bg-red-500' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'bg-indigo-500' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to Belgrade Times Admin</h2>
        <p className="text-gray-600">
          Use the navigation menu to manage articles, categories, comments, users, and site settings.
        </p>
      </div>
    </div>
  )
}
