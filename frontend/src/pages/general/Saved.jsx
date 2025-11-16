import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/saved.css";
import axios from "axios";

const Saved = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null); 

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/food/saved", { withCredentials: true })
      .then((res) => {
        setSavedItems(res.data.savedFood || []);
      })
      .catch((err) => {
        console.error("Failed to fetch saved items:", err);
      });
  }, []);

  return (
    <div className="saved-page">
      <header className="saved-header">
        <h2>Saved Reels</h2>
      </header>

      <main className="saved-main">
        {savedItems.length === 0 ? (
          <div className="saved-empty">
            <p>No saved items yet.</p>
            <Link to="/" className="browse-btn">Browse Reels</Link>
          </div>
        ) : (
          <div className="saved-grid">
            {savedItems.map((item) => (
              <div
                key={item._id}
                className="saved-card"
                onClick={() => setActiveVideo(item.food.video)}
              >
                <video
                  src={item.food.video}
                  muted
                  preload="metadata"
                  className="saved-thumb"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {}
      {activeVideo && (
        <div className="popup-overlay" onClick={() => setActiveVideo(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <video src={activeVideo} 
            autoplay controls className="popup-video" />
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <Link to="/" className="nav-item">
          <span>Home</span>
        </Link>
        <Link to="/saved" className="nav-item active">
          <span>Saved</span>
        </Link>
      </nav>
    </div>
  );
};

export default Saved;
