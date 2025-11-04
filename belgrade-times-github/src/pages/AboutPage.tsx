import { useEffect, useState } from 'react'
import { supabase, Category } from '../lib/supabase'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Users, Target, Award, Heart } from 'lucide-react'

export function AboutPage() {
  const [categories, setCategories] = useState<Category[]>([])

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header categories={categories} />

      <main className="flex-1">
        <div className="bg-red-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">O nama</h1>
            <p className="text-xl opacity-90">
              Vaš pouzdan izvor za vesti iz Beograda i sveta
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-lg">
                <Target className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Naša Misija</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Belgrade Times je posvećen pružanju pravovremenih, tačnih i sveobuhvatnih vesti za građane Beograda i šire. 
                  Naša misija je da informišemo, edukujemo i povežemo našu zajednicu kroz kvalitetan novinarski sadržaj.
                </p>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integritet</h3>
              <p className="text-gray-600">
                Posvećeni smo novinarskomintegritu i etičkim standardima u svim našim izveštajima.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Zajednica</h3>
              <p className="text-gray-600">
                Služimo našoj zajednici pružajući lokalne vesti koje su važne za svakodnevni život.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Posvećenost</h3>
              <p className="text-gray-600">
                Posvećeni smo visokim standardima novinarstva i služenju javnom interesu.
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Naša Priča</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                Belgrade Times osnovan je sa vizijom da postane vodeći izvor vesti za građane Beograda. 
                Naš tim iskusnih novinara i urednika radi neumoreno kako bi vam doneo najnovije vesti 
                iz politike, ekonomije, kulture, sporta i drugih oblasti.
              </p>
              <p className="mb-4">
                Verujemo u snagu informisane javnosti i nastojimo da pružimo vesti koje su objektivne, 
                tačne i relevantne za vaš svakodnevni život. Naša redakcija prati stroge etičke 
                standarde i posvećena je istini i transparentnosti.
              </p>
              <p>
                Zahvaljujemo vam što ste deo Belgrade Times zajednice. Vaše poverenje je naša 
                najveća motivacija da nastavimo sa kvalitetnim novinarstvom.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
