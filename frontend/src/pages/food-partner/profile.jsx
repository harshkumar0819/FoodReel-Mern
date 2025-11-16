import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState(null)
    const [videos, setVideos] = useState([])


useEffect(() => {
    axios.get(`http://localhost:3000/api/food-partner/${id}`, {withCredentials: true})
    .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems);
    })
    .catch((error) => {
        console.error('Failed to fetch profile:', error)
    })
}, [id])

  return (
    <main className="fp-profile">
      <div className="fp-header">
        <div className="fp-left">
          <div  aria-hidden="true">
            <img className="fp-avatar" src="https://images.pexels.com/photos/6413381/pexels-photo-6413381.jpeg" alt="" />
          </div>
          <div className="fp-info">
            <div className="fp-info-item">
              <div className="fp-label">Business name</div>
              <div className="fp-value">{profile?.name || '—'}</div>
            </div>
            <div className="fp-info-item">
              <div className="fp-label">Address</div>
              <div className="fp-value">{profile?.address || '—'}</div>
            </div>
          </div>
        </div>
        <div className="fp-right">
          <div className="fp-stat">
            <div className="fp-stat-label">total meals</div>
            <div className="fp-stat-value">{profile?.totalMeals || '—'}</div>
          </div>
          <div className="fp-stat">
            <div className="fp-stat-label">customer serve</div>
            <div className="fp-stat-value">{profile?.customersServed || '—'}</div>
          </div>
        </div>
      </div>

      <section className="fp-grid" aria-label='Videos'>
        {videos.map((t, index) => (
          <div key={t.id || index} className="fp-tile">

            <video 
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
             src={t.video} muted></video>
          </div>

        ))}
      </section>
    </main>
  )
}

export default Profile