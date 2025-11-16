import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth-shared.css'
import  axios from 'axios'
import { useNavigate } from 'react-router-dom'

const FoodPartnerRegister = () => {

  const navigate = useNavigate();

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="partner-reg">
        <header className="auth-header">
          <h1 id="partner-reg" className="auth-title">Partner account</h1>
          <div className="auth-sub">Register as a food partner to manage your menu and orders.</div>
        </header>

        <form className="auth-form" onSubmit={async(e)=>{
          e.preventDefault()
          
          const businessName = e.target.businessName.value;
          const contactName = e.target.contactName.value;
          const phone = e.target.phone.value;
          const email = e.target.email.value;
          const password = e.target.password.value;
          const address = e.target.address.value;
          try {
            const response = await axios.post("http://localhost:3000/api/auth/food-partner/register", {
             name: businessName,
              contactName,
              phone,
              email,
              password,
              address
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
            <label>Business name</label>
            <input className="input" placeholder="Restaurant or kitchen name" name="businessName" />
          </div>

          <div className="field">
            <label>Contact name</label>
            <input className="input" type="text" placeholder="Full name of contact person" name="contactName" />
          </div>

          <div className="field">
            <label>Phone number</label>
            <input className="input" type="tel" placeholder="+1 555 555 5555" name="phone" />
          </div>

          <div className="field">
            <label>Email address</label>
            <input className="input" type="email" placeholder="contact@business.com" name="email" />
          </div>

          <div className="field">
            <label>Password</label>
            <input className="input" type="password" placeholder="Create a password" name="password" />
          </div>

          <div className="field">
            <label>Address</label>
            <textarea className="input textarea" placeholder="Street, city, state, postal code" name="address" rows={3} />
          </div>

          <div className="actions">
            <button className="btn btn-primary" type="submit">Create partner account</button>
            <Link className="small-link" to="/food-partner/login">Already partnered?</Link>
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

export default FoodPartnerRegister
