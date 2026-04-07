// UrlField.jsx — URL input with profile picker/dropdown (manual-only)
import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

/**
 * @param {{
 *   url: string,
 *   profile: string,
 *   profiles?: Array<{value: string, label: string}>,
 *   onChange: Function,
 *   onRemove: Function,
 *   placeholder?: string
 * }} props
 */
export default function UrlField({ url, profile, profiles = [], onChange, onRemove, placeholder = 'https://example.com' }) {
  const [editCustom, setEditCustom] = useState(false)
  const [customProfile, setCustomProfile] = useState(profile || '')

  useEffect(() => {
    const hasPreset = profiles.some((p) => p.value === profile)
    setEditCustom(!hasPreset && !!profile)
    setCustomProfile(profile || '')
  }, [profile, profiles])

  const handleUrlChange = (newUrl) => {
    onChange({ url: newUrl, profile: editCustom ? customProfile : profile })
  }

  const handleProfileSelect = (selectedProfile) => {
    if (selectedProfile === 'custom') {
      setEditCustom(true)
      setCustomProfile('')
      onChange({ url, profile: '' })
    } else {
      setEditCustom(false)
      setCustomProfile('')
      onChange({ url, profile: selectedProfile })
    }
  }

  const handleCustomChange = (value) => {
    setCustomProfile(value)
    onChange({ url, profile: value })
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-input)',
    }}>
      <Globe size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

      <input
        value={url}
        onChange={e => handleUrlChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: 13,
          outline: 'none',
        }}
      />

      <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

      {!editCustom ? (
        <select
          value={profile || ''}
          onChange={e => handleProfileSelect(e.target.value)}
          style={{
            width: 150,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 13,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">Profile (optional)</option>
          {profiles.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
          <option value="custom">Custom...</option>
        </select>
      ) : (
        <input
          value={customProfile}
          onChange={e => handleCustomChange(e.target.value)}
          placeholder="Profile (manual)"
          style={{
            width: 150,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 13,
            outline: 'none',
          }}
        />
      )}

      <button
        onClick={onRemove}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 20,
          height: 20,
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          borderRadius: 4,
          cursor: 'pointer',
          transition: 'var(--transition)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-dim)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        ×
      </button>
    </div>
  )
}