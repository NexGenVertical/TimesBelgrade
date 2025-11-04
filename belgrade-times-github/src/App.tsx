import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { HomePage } from './pages/HomePage'
import { ArticlePage } from './pages/ArticlePage'
import { CategoryPage } from './pages/CategoryPage'
import { SearchPage } from './pages/SearchPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminArticles } from './pages/admin/AdminArticles'
import { AdminArticleEdit } from './pages/admin/AdminArticleEdit'
import { AdminCategories } from './pages/admin/AdminCategories'
import { AdminComments } from './pages/admin/AdminComments'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminSettings } from './pages/admin/AdminSettings'
import { AdminLogin } from './pages/admin/AdminLogin'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/new" element={<AdminArticleEdit />} />
            <Route path="articles/edit/:id" element={<AdminArticleEdit />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
