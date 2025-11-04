import { useEffect, useState } from 'react'
import { supabase, Category } from '../lib/supabase'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Mail, MapPin, Send } from 'lucide-react'

export function ContactPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    setCategories(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setSubmitting(false)

    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} />

      <main className="flex-1">
        <div className="bg-red-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Kontaktirajte nas</h1>
            <p className="text-xl opacity-90">
              Rado ćemo odgovoriti na sva vaša pitanja i sugestije
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pošaljite nam poruku</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">
                    Hvala vam! Vaša poruka je uspešno poslata. Odgovorićemo vam uskoro.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ime i prezime *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email adresa *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Naslov *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Poruka *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                  {submitting ? 'Šalje se...' : 'Pošalji poruku'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Kontakt informacije</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Mail className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href="mailto:contact@belgradetimes.rs" className="text-red-600 hover:underline">
                        contact@belgradetimes.rs
                      </a>
                      <br />
                      <a href="mailto:support@belgradetimes.rs" className="text-gray-600 hover:underline text-sm">
                        support@belgradetimes.rs
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Adresa</p>
                      <p className="text-gray-600">
                        Beograd, Srbija
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-6 border border-red-100">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Radno vreme</h3>
                <p className="text-gray-600">
                  Naš tim je dostupan radnim danima od 9:00 do 17:00 časova.
                  Odgovaraćemo na vašu poruku u najkraćem mogućem roku.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
