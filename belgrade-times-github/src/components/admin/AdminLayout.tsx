import { useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

export function AdminLayout() {
  const { user, profile, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login')
    }
  }, [user, loading, navigate])

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/articles', label: 'Articles', icon: FileText },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { path: '/admin/comments', label: 'Comments', icon: MessageSquare },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="text-xl font-bold text-gray-900">
              Belgrade Times <span className="text-sm font-normal text-gray-500">Admin</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{profile?.role || 'user'}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-red-50 text-red-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
            <aside className="w-64 bg-white h-full" onClick={(e) => e.stopPropagation()}>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
