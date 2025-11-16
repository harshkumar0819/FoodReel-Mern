import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth-shared.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="user-login">
        <header className="auth-header">
          <h1 id="user-login" className="auth-title">Welcome back</h1>
          <div className="auth-sub">Sign in to your user account to continue.</div>
        </header>


        <form className="auth-form" onSubmit={async(e)=> {
          e.preventDefault()
          
          const email = e.target.email.value;
          const password = e.target.password.value;
          const response = await axios.post("http://localhost:3000/api/auth/user/login", {
            email,
            password
        },
        {
          withCredentials: true
        });
  
  console.info(`Logged in user: ${email}`)
  navigate("/");
       }

        }>
          <div className="field">
            <label>Email</label>
            <input className="input" type="email" name='email' placeholder="name@example.com" />
          </div>

          <div className="field">
            <label>Password</label>
            <input className="input" type="password" name='password' placeholder="Your password" />
          </div>

          <div className="actions">
            <button className="btn btn-primary" type="submit">Sign in</button>
            <Link className="small-link" to="/user/register">Create account</Link>
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

export default UserLogin
