import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2 } from 'lucide-react'
import { format } from 'date-fns'

interface CommentWithArticle {
  id: string
  content: string
  created_at: string
  article_id: string
  articles?: { title: string }
}

export function AdminComments() {
  const [comments, setComments] = useState<CommentWithArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadComments()
  }, [])

  async function loadComments() {
    try {
      const { data } = await supabase
        .from('comments')
        .select('id, content, created_at, article_id')
        .order('created_at', { ascending: false })
        .limit(100)

      if (data) {
        const articleIds = [...new Set(data.map(c => c.article_id))]
        const { data: articles } = await supabase
          .from('articles')
          .select('id, title')
          .in('id', articleIds)

        const commentsWithArticles = data.map(comment => ({
          ...comment,
          articles: articles?.find(a => a.id === comment.article_id)
        }))

        setComments(commentsWithArticles as CommentWithArticle[])
      }
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await supabase.from('comments').delete().eq('id', id)
      await loadComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Comments</h1>

      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {comments.map((comment) => (
            <div key={comment.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.articles?.title || 'Unknown Article'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="ml-4 text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No comments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
