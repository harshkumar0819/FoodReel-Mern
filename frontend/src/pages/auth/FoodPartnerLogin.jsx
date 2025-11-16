import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth-shared.css'
import  axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="partner-login">
        <header className="auth-header">
          <h1 id="partner-login" className="auth-title">Partner sign in</h1>
          <div className="auth-sub">Sign in to manage your menu and incoming orders.</div>
        </header>

        <form className="auth-form" onSubmit={ async(e)=>{
          e.preventDefault()
          
          const email = e.target.email.value;
          const password = e.target.password.value;
          try {
            const response = await axios.post("http://localhost:3000/api/auth/food-partner/login", {
              email,
              password,
            },
            {
              withCredentials: true
            });
            navigate("/create-food");
          } catch (err) {
            console.error(err);
          }
        }}>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" name='email' placeholder="contact@business.com" />
          </div>

          <div className="field">
            <label>Password</label>
            <input className="input" type="password" name='password' placeholder="Your password" />
          </div>

          <div className="actions">
            <button className="btn btn-primary" type="submit">Sign in</button>
            <Link className="small-link" to="/food-partner/register">Create partner account</Link>
          </div>

          <div className="link-row">
            <Link className="alt-link" to="/user/register">Register as normal user</Link>
            <Link className="alt-link" to="/food-partner/register">Register as food partner</Link>
          </div>
        </form>
      </section>
    </main>
  )
}

export default FoodPartnerLogin
