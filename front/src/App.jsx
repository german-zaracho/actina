import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import MultiplechoiceSubjects from './pages/multiplechoice/MultiplechoiceSubjects';
import MultiplechoiceClassification from './pages/multiplechoice/MultiplechoiceClassification';
import MultiplechoiceQuestions from './pages/multiplechoice/MultiplechoiceQuestions';
import FlashcardSubjects from './pages/flashcard/FlashcardSubjects';
import FlashcardTabs from './pages/flashcard/FlashcardTabs';
import AtlasSubjects from './pages/atlas/AtlasSubjects';
import AtlasPages from './pages/atlas/AtlasPages';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/admin/AdminPanel';
import FriendsPage from './pages/FriendsPage';
import PublicProfilePage from './pages/PublicProfilePage';
import CreateActivityPage from './pages/CreateActivityPage';
import MyActivitiesPage from './pages/MyActivitiesPage';
import FavoritesPage from './pages/FavoritesPage';
import './css/styles.css';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
// Tenia la validacion por si intentas ir al panel de admin te lleve al home, 
// pero si no estas logueado aun asi te lleva al home si vas a una ruta cualquiera, con esto te lleva al login,
// habia una forma de importar directamente un servicio a cada vista, pero era repetir codigo innecesariamente

export default function App() {

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2023";

  const [multiplechoices, setMultiplechoices] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [atlas, setAtlas] = useState([]);

  useEffect(() => {

    console.log("Iniciando componente");
    fetch(`${API_URL}/api/multiplechoices`, {
      headers: {
        "auth-token": localStorage.getItem("token")
      }
    })
      .then((res) => res.json())
      .then((data) => setMultiplechoices(data))
      .catch((error) => console.error("Error fetching multiplechoices:", error));

    fetch(`${API_URL}/api/flashcards`, {
      headers: {
        "auth-token": localStorage.getItem("token")
      }
    }
    )
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
      .catch((error) => console.error("Error fetching flashcards:", error));

    fetch(`${API_URL}/api/atlas`, {
      headers: {
        "auth-token": localStorage.getItem("token")
      }
    })
      .then((res) => res.json())
      .then((data) => setAtlas(data))
      .catch((error) => console.error("Error fetching atlas:", error));

  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Publicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protegidas */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/:userName" element={<ProtectedRoute><PublicProfilePage /></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/my-activities" element={<ProtectedRoute><MyActivitiesPage /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateActivityPage /></ProtectedRoute>} />
          <Route path="/multiplechoiceSubjects" element={<ProtectedRoute><MultiplechoiceSubjects multiplechoices={multiplechoices} /></ProtectedRoute>} />
          <Route path="/multiplechoiceClassification/:subject" element={<ProtectedRoute><MultiplechoiceClassification multiplechoices={multiplechoices} /></ProtectedRoute>} />
          <Route path="/multiplechoiceQuestions/:classification" element={<ProtectedRoute><MultiplechoiceQuestions multiplechoices={multiplechoices} /></ProtectedRoute>} />
          <Route path="/flashcardsSubjects" element={<ProtectedRoute><FlashcardSubjects flashcards={flashcards} /></ProtectedRoute>} />
          <Route path="/flashcardTabs/:subject" element={<ProtectedRoute><FlashcardTabs flashcards={flashcards} /></ProtectedRoute>} />
          <Route path="/atlasSubjects" element={<ProtectedRoute><AtlasSubjects atlas={atlas} /></ProtectedRoute>} />
          <Route path="/atlasPages/:subject" element={<ProtectedRoute><AtlasPages atlas={atlas} /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}