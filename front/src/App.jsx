import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import MultiplechoiceSubjects from './MultiplechoiceSubjects';
import MultiplechoiceClassification from './MultiplechoiceClassification';
import MultiplechoiceQuestions from './MultiplechoiceQuestions';
import FlashcardSubjects from './FlashcardSubjects';
import FlashcardTabs from './FlashcardTabs';
import AtlasSubjects from './AtlasSubjects';
import AtlasPages from './AtlasPages';
import Home from './Home';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProfilePage from './ProfilePage';
import './css/styles.css';


export default function App() {

  const [multiplechoices, setMultiplechoices] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [atlas, setAtlas] = useState([]);

  useEffect(() => {

    console.log("Iniciando componente");
    fetch("http://localhost:2023/api/multiplechoices", {
      headers:{
        "auth-token": localStorage.getItem("token")
      }
    })
      .then((res) => res.json())
      .then((data) => setMultiplechoices(data))
      .catch((error) => console.error("Error fetching multiplechoices:", error));

    fetch("http://localhost:2023/api/flashcards", {
      headers:{
          "auth-token": localStorage.getItem("token")
        }
      }
    )
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
      .catch((error) => console.error("Error fetching flashcards:", error));
    
    fetch("http://localhost:2023/api/atlas", {
      headers:{
        "auth-token": localStorage.getItem("token")
      }
    })
      .then((res) => res.json())
      .then((data) => setAtlas(data))
      .catch((error) => console.error("Error fetching atlas:", error));

  }, []);

  useEffect(() => { }, [multiplechoices, flashcards, atlas])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/multiplechoiceSubjects" element={<MultiplechoiceSubjects multiplechoices={multiplechoices} />} />
          <Route path="/multiplechoiceClassification/:subject" element={<MultiplechoiceClassification multiplechoices={multiplechoices} />} />
          <Route path="/multiplechoiceQuestions/:classification" element={<MultiplechoiceQuestions multiplechoices={multiplechoices} />} />
          <Route path="/flashcardsSubjects" element={<FlashcardSubjects flashcards={flashcards} />} />
          <Route path="/flashcardTabs/:subject" element={<FlashcardTabs flashcards={flashcards} />} />
          <Route path="/atlasSubjects" element={<AtlasSubjects atlas={atlas} />} />
          <Route path="/atlasPages/:subject" element={<AtlasPages atlas={atlas}/>} />
        </Routes>
      </Router>
    </>
  )
}
