import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Belgrade Times</h3>
            <p className="text-sm mb-4">
              Vaš izvor za najnovije vesti iz Beograda i sveta. Pouzdane, pravovremene i sveobuhvatne informacije.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:contact@belgradetimes.rs" className="hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase">Brzi linkovi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Početna</Link></li>
              <li><Link to="/about" className="hover:text-white">O nama</Link></li>
              <li><Link to="/contact" className="hover:text-white">Kontakt</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase">Kategorije</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/politics" className="hover:text-white">Politika</Link></li>
              <li><Link to="/category/sports" className="hover:text-white">Sport</Link></li>
              <li><Link to="/category/culture" className="hover:text-white">Kultura</Link></li>
              <li><Link to="/category/technology" className="hover:text-white">Tehnologija</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase">Kontakt</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: contact@belgradetimes.rs</li>
              <li>Podrška: support@belgradetimes.rs</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Belgrade Times. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  )
}
