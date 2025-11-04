import { Link } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Category {
  id: string
  name: string
  slug: string
  color: string | null
}

interface HeaderProps {
  categories?: Category[]
}

export function Header({ categories = [] }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="font-medium text-gray-900">
              {new Date().toLocaleDateString('sr-RS', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="hidden md:flex gap-4">
              <Link to="/about" className="hover:text-gray-900">O nama</Link>
              <Link to="/contact" className="hover:text-gray-900">Kontakt</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-gray-900">
            Belgrade Times
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži vesti..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto py-3">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-red-600 whitespace-nowrap"
            >
              Sve vesti
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="text-sm font-medium text-gray-700 hover:text-red-600 whitespace-nowrap"
                style={{ color: category.color || undefined }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pretraži vesti..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            {/* Mobile Categories */}
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-gray-700 hover:text-red-600 py-2"
              >
                Sve vesti
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 py-2"
                >
                  {category.name}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 py-2 block"
                >
                  O nama
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 py-2 block"
                >
                  Kontakt
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
