import React from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth-shared.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/user/register", {
        fullName: firstName + " " + lastName,
        email,
        password,
      },
      {
        withCredentials: true
      });

 
  console.info(`Registered user: ${firstName} ${lastName} <${email}>`)
  navigate("/")
      
    } catch (err) {
       console.error(err);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="user-reg">
        <header className="auth-header">
          <h1 id="user-reg" className="auth-title">Create your account</h1>
          <div className="auth-sub">Register as a user to explore meals and place orders.</div>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="field two-cols">
            <div>
              <label>First name</label>
              <input name="firstName" className="input" placeholder="First name" required />
            </div>
            <div>
              <label>Last name</label>
              <input name="lastName" className="input" placeholder="Last name" required />
            </div>
          </div>

          <div className="field">
            <label>Email</label>
            <input name="email" className="input" type="email" placeholder="name@example.com" required />
          </div>

          <div className="field">
            <label>Password</label>
            <input name="password" className="input" type="password" placeholder="Create a password" required />
          </div>

          <div className="actions">
            <button className="btn btn-primary" type="submit">Create account</button>
            <Link className="small-link" to="/user/login">Already have an account?</Link>
          </div>

          <div className="link-row">
            <Link className="alt-link" to="/user/register">Register as normal user</Link>
            <Link className="alt-link" to="/food-partner/register">Register as food partner</Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default UserRegister;
