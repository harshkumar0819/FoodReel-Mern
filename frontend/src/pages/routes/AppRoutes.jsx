import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegister from '../auth/UserRegister'
import UserLogin from '../auth/UserLogin'
import FoodPartnerRegister from '../auth/FoodPartnerRegister'
import FoodPartnerLogin from '../auth/FoodPartnerLogin'
import Home from '../general/Home';
import Saved from '../general/Saved';
import CreateFood from '../food-partner/CreateFood';
import Profile from '../food-partner/profile';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
  <Route path="/user/register" element={<UserRegister />} />
  <Route path="/user/login" element={<UserLogin />} />
  <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
  <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
  <Route path="/" element={<Home />} />
  <Route path="/saved" element={<Saved />} />
  <Route path="/create-food" element={<CreateFood />} />
  <Route path='/food-partner/:id' element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default AppRoutes