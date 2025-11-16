import React, { useState } from 'react'
import '../../styles/create-food.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateFood = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sizeWarning, setSizeWarning] = useState('')

  const navigate = useNavigate()
  const MAX_FILE_SIZE = 20 * 1024 * 1024 

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0] || null
    
    if (preview) {
      try { URL.revokeObjectURL(preview) } catch(e) {/* ignore */}
    }
    
    if (file && file.size > MAX_FILE_SIZE) {
      setSizeWarning(`File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds 20 MB limit`)
      setVideoFile(null)
      setPreview(null)
      return
    }
    setSizeWarning('')
    setVideoFile(file)
    if (file) setPreview(URL.createObjectURL(file))
    else setPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return alert('Please enter a name')

    const form = new FormData()
    form.append('name', name)
    form.append('description', description)
    if (videoFile) form.append('video', videoFile)

    setLoading(true)
    try {
     
      const res = await axios.post('http://localhost:3000/api/food', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      console.log('Uploaded', res.data)
      navigate('/')
      alert('Food item created')
     
      setName('')
      setDescription('')
      setVideoFile(null)
      setPreview(null)
    } catch (err) {
      console.error('Upload failed', err)
      alert('Upload failed — error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="cf-page">
      <div className="cf-card">
        <header className="cf-header">
          <h2 className="cf-title">Create food</h2>
          <p className="cf-sub">Add a new food item with a short video, name and description.</p>
        </header>

        <form className="cf-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="field">
            <label>Video</label>
            <div className="file-input-wrapper">
              {}
              <input id="video" className="input file-input" type="file" accept="video/*" onChange={handleVideoChange} />

              <label htmlFor="video" className="file-btn" title="Choose a video">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M23 7l-7 5 7 5V7z"></path>
                  <rect x="1" y="5" width="15" height="14" rx="2"></rect>
                </svg>
                <span className="file-label-text">{videoFile ? videoFile.name : 'Choose a short video'}</span>
              </label>
            </div>

            {sizeWarning && (
              <div className="cf-warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{sizeWarning}</span>
              </div>
            )}

            {preview && (
              <div className="cf-preview">
                <video src={preview} controls />
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Veg Biryani" />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" className="input textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description"></textarea>
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary">{loading ? 'Saving...' : 'Create'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setName(''); setDescription(''); setVideoFile(null); setPreview(null) }}>Reset</button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default CreateFood