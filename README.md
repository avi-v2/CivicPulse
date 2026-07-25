# 🏙️ CivicPulse

**See It. Report It. Fix It.**

CivicPulse is a crowdsourced civic issue reporting platform that enables citizens to report, track, and monitor civic problems such as potholes, garbage accumulation, water leakage, broken streetlights, and sewage issues through an interactive map interface.

Built as a hackathon project, CivicPulse aims to bridge the communication gap between citizens and local authorities by providing a centralized, location-aware reporting system.

---

## ✨ Features

- 🗺️ Interactive map powered by MapLibre & MapTiler
- 📍 Click anywhere on the map to report an issue
- 📝 Report submission with:
  - Title
  - Description
  - Category
  - Severity
  - Location
- 📊 Live dashboard statistics
- 📋 Recent reports sidebar
- 🔍 Location search with geocoding
- 🎯 Interactive map markers & popups
- 🔥 Firebase Firestore integration
- 📷 Image upload support (in progress)
- 🤖 AI-powered issue classification (planned)

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Lucide React

### Maps
- MapLibre GL JS
- MapTiler API

### Backend
- Firebase Firestore
- Firebase Storage

### Planned AI
- Google Gemini Vision API

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/CivicPulse.git

cd CivicPulse
```

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
VITE_MAPTILER_KEY=YOUR_MAPTILER_KEY

VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

### Start the development server

```bash
npm run dev
```

---

## 📸 Screenshots

> Add screenshots here

- Home Page
- Interactive Map
- Report Submission Form
- Dashboard
- Admin Panel

---

## 🎯 Future Enhancements

- AI-based issue classification from uploaded images
- Duplicate report detection
- Admin analytics dashboard
- Heatmap visualization
- Authentication
- Real-time notifications
- Mobile responsive improvements

---

## 👥 Team

- **Avi**
- **Keshav**

---

## 📄 License

This project was developed for a hackathon and is intended for educational and demonstration purposes.
