import { useState } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [phase, setPhase] = useState('input')
  const [licenseInput, setLicenseInput] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e?.preventDefault()

    if (!licenseInput.trim()) {
      setError('Please enter a license number')
      return
    }

    setError(null)
    setPhase('loading')
    setLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/search`, {
        license_number: licenseInput
      })

      await new Promise(r => setTimeout(r, 1000))

      if (response.data.found) {
        setResult(response.data.data)
      } else {
        setResult(null)
        setError(response.data.message)
      }

      setPhase('result')
    } catch (err) {
      setError(err.response?.data?.error || err.message)
      setPhase('result')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchAgain = () => {
    setPhase('input')
    setLicenseInput('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="app">
      {/* Background decoration */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="shell">
        {/* Wordmark */}
        <div className="wordmark">
          <span className="wordmark-dot" />
          DOTM Nepal
        </div>

        <div className="card">
          {/* Header strip */}
          <div className="card-eyebrow">
            <span className="eyebrow-tag">License Registry</span>
            <span className="eyebrow-live">
              <span className="live-dot" /> Live
            </span>
          </div>

          <div className="card-body">
            {/* PHASE: INPUT */}
            {phase === 'input' && (
              <div className="phase phase-input">
                <div className="title-block">
                  <h1 className="title">Verify your<br /><em>license status</em></h1>
                  <p className="subtitle">Enter your license number to check print status and collection point.</p>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                  <div className="field">
                    <label htmlFor="license" className="field-label">License Number</label>
                    <div className="field-row">
                      <div className="input-wrap">
                        <span className="input-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                        </span>
                        <input
                          id="license"
                          type="text"
                          placeholder="e.g. LIC-001234"
                          value={licenseInput}
                          onChange={(e) => setLicenseInput(e.target.value)}
                          autoFocus
                          className="text-input"
                        />
                      </div>
                      <button type="submit" className="btn-primary">
                        Search
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="inline-error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {error}
                    </div>
                  )}
                </form>

                <div className="hint-row">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  Find your license number on your application receipt
                </div>
              </div>
            )}

            {/* PHASE: LOADING */}
            {phase === 'loading' && (
              <div className="phase phase-loading">
                <div className="loader-ring">
                  <svg className="loader-svg" viewBox="0 0 52 52">
                    <circle className="loader-track" cx="26" cy="26" r="22" />
                    <circle className="loader-arc" cx="26" cy="26" r="22" />
                  </svg>
                </div>
                <p className="loader-label">Searching license database…</p>
                <p className="loader-sub">This usually takes a moment</p>
              </div>
            )}

            {/* PHASE: RESULT */}
            {phase === 'result' && (
              <div className="phase phase-result">
                {result ? (
                  <>
                    <div className="status-banner status-success">
                      <span className="status-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      <div>
                        <span className="status-title">Printed &amp; Ready</span>
                        <span className="status-desc">Your license is available for collection</span>
                      </div>
                    </div>

                    <div className="info-grid">
                      <div className="info-cell">
                        <span className="info-key">Full Name</span>
                        <span className="info-val">{result.name}</span>
                      </div>
                      <div className="info-cell">
                        <span className="info-key">License No.</span>
                        <span className="info-val mono">{result.license_number}</span>
                      </div>
                      <div className="info-cell">
                        <span className="info-key">Status</span>
                        <span className="info-val status-ok">Printed</span>
                      </div>
                    </div>

                    {result.collection_point && (
                      <div className="collection-card">
                        <div className="collection-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <div>
                          <span className="collection-label">Collection Point</span>
                          <span className="collection-value">{result.collection_point}</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="status-banner status-pending">
                      <span className="status-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </span>
                      <div>
                        <span className="status-title">Not Yet Printed</span>
                        <span className="status-desc">{error || 'Your license is still being processed'}</span>
                      </div>
                    </div>

                    <div className="pending-note">
                      <p>Your license has not been printed yet. For further details or to track progress, visit the official DOTM portal.</p>
                      <a href="https://dotm.gov.np/" target="_blank" rel="noopener noreferrer" className="gov-link">
                        dotm.gov.np
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    </div>
                  </>
                )}

                <button className="btn-ghost" onClick={handleSearchAgain}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Search another license
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="footer-note">
          Official license verification portal · Department of Transport Management
        </div>
      </div>
    </div>
  )
}

export default App