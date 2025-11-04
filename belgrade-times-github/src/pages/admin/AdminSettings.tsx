import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Save } from 'lucide-react'

interface Setting {
  id: string
  setting_key: string
  setting_value: string
  setting_type: string
  description: string | null
}

export function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key', { ascending: true })

      setSettings(data || [])
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      for (const setting of settings) {
        await supabase
          .from('site_settings')
          .update({ setting_value: setting.setting_value })
          .eq('id', setting.id)
      }
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (id: string, value: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, setting_value: value } : s
    ))
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
        <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {settings.slice(0, 10).map((setting) => (
          <div key={setting.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {setting.setting_key.replace(/_/g, ' ').toUpperCase()}
            </label>
            {setting.description && (
              <p className="text-xs text-gray-500 mb-2">{setting.description}</p>
            )}
            {setting.setting_type === 'boolean' ? (
              <select
                value={setting.setting_value}
                onChange={(e) => handleChange(setting.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            ) : setting.setting_type === 'textarea' ? (
              <textarea
                value={setting.setting_value}
                onChange={(e) => handleChange(setting.id, e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <input
                type={setting.setting_type === 'number' ? 'number' : 'text'}
                value={setting.setting_value}
                onChange={(e) => handleChange(setting.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
