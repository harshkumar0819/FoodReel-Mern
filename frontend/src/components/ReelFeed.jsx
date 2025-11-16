import React, { useEffect, useRef } from 'react'

const ReelFeed = ({ items, emptyMessage }) => {
  const videoRefs = useRef(new Map())
  const containerRef = useRef(null)

  // Helper to set/clear video refs
  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id)
      return
    }
    videoRefs.current.set(id, el)
  }

  // IntersectionObserver for auto-play/pause
  useEffect(() => {
    const options = { root: null, rootMargin: '0px', threshold: 0.6 }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoEl = entry.target
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {})
        } else {
          videoEl.pause()
          videoEl.currentTime = 0
        }
      })
    }, options)

    videoRefs.current.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [items])

  if (!items || items.length === 0) {
    return (
      <main className="home-page">
        <div className="reels-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <p style={{ fontSize: '18px', color: 'var(--muted)' }}>{emptyMessage}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="home-page">
      <div className="reels-container" ref={containerRef}>
        {items.map((item) => (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              muted
              playsInline
              loop
              preload="metadata"
            />
            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />
              <div className="reel-content">
                <div className="reel-info">
                  <h3 className="reel-title">{item.name}</h3>
                  <p className="reel-description" title={item.description}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

export default ReelFeed
