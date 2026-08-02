import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Profile from './pages/Profile';

function App() {
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="app-container">
      <Navbar searchInput={searchInput} setSearchInput={setSearchInput} />
      <Routes>
        <Route path="/" element={<Home searchInput={searchInput} />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
