// Home.jsx
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../../styles/reels.css'

const Home = () => {
  const [videos, setVideos] = useState([])
  const videoRefs = useRef(new Map())
  const containerRef = useRef(null)
  const scrollTimeoutRef = useRef(null)

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id)
      return
    }
    videoRefs.current.set(id, el)
  }

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let best = null
        entries.forEach((entry) => {
          if (!(entry.target instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (!best || entry.intersectionRatio > best.entry.intersectionRatio) {
              best = { entry, video: entry.target }
            }
          }
        })

        
        videoRefs.current.forEach((v) => {
          if (!(v instanceof HTMLVideoElement)) return
          try {
            if (best && v === best.video) {
              v.play().catch(() => {})
            } else {
              v.pause()
              v.currentTime = 0
            }
          } catch (e) {
            
          }
        })
      },
      { threshold: [0.6] }
    )

    
    videoRefs.current.forEach((el) => {
      try {
        observer.observe(el)
      } catch (e) {}
    })

    return () => observer.disconnect()
  }, [videos])

  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = container.scrollTop
        const reelHeight = container.clientHeight
        const currentReelIndex = Math.round(scrollTop / reelHeight)
        const targetScrollTop = currentReelIndex * reelHeight

        if (Math.abs(scrollTop - targetScrollTop) > 6) {
          container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
        }
      }, 140)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/food', { withCredentials: true })
      .then((response) => {
        const raw = response.data.foodItems || []
        const normalized = raw.map((fi) => ({
          ...fi,
          
          likesCount: Number(fi.likesCount ?? fi.likes ?? 0),
          savesCount: Number(fi.savesCount ?? fi.saves ?? 0),
          liked: !!fi.liked,
          saved: !!fi.saved,
        }))
        setVideos(normalized)
      })
      .catch((error) => {
        console.error('Failed to fetch videos:', error)
      })
  }, [])

 
  async function likeVideo(item) {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/food/like',
        { foodId: item._id },
        { withCredentials: true }
      )

      const { liked, likesCount } = response.data

      setVideos((prev) =>
        prev.map((v) => {
          if (v._id !== item._id) return v

          const prevCount = Number(v.likesCount ?? v.likes ?? 0)

          // if server gives a valid number, trust it
          const newCount =
            typeof likesCount === 'number' && !Number.isNaN(likesCount)
              ? likesCount
              : liked
              ? prevCount + 1
              : Math.max(0, prevCount - 1)

          return {
            ...v,
            likesCount: newCount,
            likes: newCount,
            liked: !!liked,
          }
        })
      )

      if (liked) console.log('Video liked')
      else console.log('Video unliked')
    } catch (err) {
      console.error('likeVideo error:', err)
      if (err?.response?.status === 401) alert('Please login to like videos')
    }
  }

  
  async function saveVideo(item) {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/food/save',
        { foodId: item._id },
        { withCredentials: true }
      )

      const { saved, savesCount } = response.data

      setVideos((prev) =>
        prev.map((v) => {
          if (v._id !== item._id) return v

          const prevCount = Number(v.savesCount ?? v.saves ?? 0)

          const newCount =
            typeof savesCount === 'number' && !Number.isNaN(savesCount)
              ? savesCount
              : saved
              ? prevCount + 1
              : Math.max(0, prevCount - 1)

          return {
            ...v,
            savesCount: newCount,
            saves: newCount,
            saved: !!saved,
          }
        })
      )

      if (saved) console.log('Video saved')
      else console.log('Video unsaved')
    } catch (err) {
      console.error('saveVideo error:', err)
      if (err?.response?.status === 401) alert('Please login to save videos')
    }
  }

  return (
    <div ref={containerRef} className="reel-page" role="region" aria-label="Reels feed">
      <div className="reels-feed" role="list">
        {videos.map((item) => (
          <section key={item._id} className="reel" role="listitem" aria-label="Reel">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              // muted
              playsInline
              loop
              preload="metadata"
            />

            {}
            <aside className="reel-side-actions" aria-hidden="false">
              <button
                onClick={() => likeVideo(item)}
                className={`action-btn ${item.liked ? 'active' : ''}`}
                aria-pressed={!!item.liked}
                aria-label="Like"
                title="Like"
              >
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path d="M12 21s-7-4.35-9-6.35C1.5 12.65 2 7.5 6 5c2-1 4 .5 6 3 2-2.5 4-4 6-3 4 2.5 4.5 7.65 3 9.65-2 2-9 6.35-9 6.35z" />
                </svg>
                <div className="reel-action__count">{item.likesCount ?? item.likes ?? 0}</div>
                <span className="action-label">Likes</span>
              </button>

              <button
                onClick={() => saveVideo(item)}
                className={`action-btn ${item.saved ? 'active' : ''}`}
                aria-pressed={!!item.saved}
                aria-label="Save"
                title="Save"
              >
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path d="M6 2h10a2 2 0 0 1 2 2v18l-7-3-7 3V4a2 2 0 0 1 2-2z" />
                </svg>
                <div className="reel-action__count">{item.savesCount ?? item.saves ?? 0}</div>
                <span className="action-label">Save</span>
              </button>

              <button className="action-btn" aria-label="Comments" title="Comments">
                <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <div className="reel-action__count">{item.comments ?? 0}</div>
                <span className="action-label">Comments</span>
              </button>
            </aside>

            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />
              <div className="reel-content">
                <p className="reel-description" title={item.description || ''}>
                  {item.description || ''}
                </p>

                <Link className="reel-btn store-btn" to={'/food-partner/' + (item.foodPartner ?? '')} aria-label="Visit Store">
                  Visit Store
                </Link>
              </div>
            </div>
          </section>
        ))}
      </div>

      {}
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        <Link to="/" className="nav-item" aria-label="Home">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
          </svg>
          <span className="nav-label">Home</span>
        </Link>

        <Link to="/" className="nav-item logo-btn" aria-label="App">
          <svg viewBox="0 0 100 100" width="36" height="36" aria-hidden="true" className="app-logo">
            <defs>
              <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7a18" />
                <stop offset="50%" stopColor="#af0" />
                <stop offset="100%" stopColor="#6a5cff" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#g1)" />
            <path d="M30 55c5-10 20-18 30-10 12 10-2 32-18 36-18-6-22-22-12-26z" fill="#fff" opacity="0.95" />
          </svg>
          <span className="nav-label">Reels</span>
        </Link>

        <Link to="/saved" className="nav-item" aria-label="Saved">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M6 2h10a2 2 0 0 1 2 2v18l-7-3-7 3V4a2 2 0 0 1 2-2z" />
          </svg>
          <span className="nav-label">Saved</span>
        </Link>
      </nav>
    </div>
  )
}

export default Home
