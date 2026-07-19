# 🎬 CineCritic – Movie Review & Rating Website

![HTML](https://img.shields.io/badge/Frontend-HTML-orange)
![CSS](https://img.shields.io/badge/Style-CSS-blue)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)

A full-stack **Movie Review & Rating Platform** where users can explore movies, view details, and manage reviews using a custom backend and TMDB API.

---

## 📑 Table of Contents

- Project Overview  
- Features  
- Tech Stack  
- Project Structure  
- Environment Variables  
- API Endpoints  
- Running Locally  
- Future Improvements  
- Author  

---

## 📖 Project Overview

**CineCritic** is a movie-based web application that allows users to:

- Browse trending movies  
- View detailed movie pages  
- Add reviews and favorites  
- Fetch movie data using TMDB API  

The project is built using a **simple frontend (HTML, CSS, JS)** and a **Node.js + Express backend with MongoDB**.

---

## ✨ Features

- 🎬 Browse movies from TMDB API  
- 📄 Movie detail page  
- ⭐ Add reviews  
- ❤️ Add to favorites  
- 👤 User data handling  
- 🌐 REST API backend  
- ⚡ Fast and lightweight UI  

---

## 🛠️ Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

### API
- TMDB (The Movie Database API)

---

## 📁 Project Structure

```text
Movie-Website/
│
├── cinecritic/
│   ├── client/
│   │   ├── css/
│   │   ├── js/
│   │   ├── index.html
│   │   └── movie.html
│   │
│   ├── server/
│   │   ├── models/
│   │   │   ├── Favorite.js
│   │   │   ├── Review.js
│   │   │   └── User.js
│   │   │
│   │   ├── node_modules/
│   │   ├── .env
│   │   ├── package.json
│   │   └── server.js
│
└── .gitignore