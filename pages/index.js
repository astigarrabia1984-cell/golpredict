
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const API_KEY = "8622f57039804f3fbf997840e90c8b18";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO",
  projectId: "TU_ID_PROYECTO",
  storageBucket: "TU_CUBETA",
  messagingSenderId: "TU_ID_MENSAJERIA",
  appId: "TU_ID_APP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      const res = await fetch("https://api.football-data.org/v4/competitions/PD/matches?status=SCHEDULED", {
        headers: { "X-Auth-Token": API_KEY }
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (e) { console.error(e); }
  }

  return (
    <div style={{ backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
        <h1>⚽ GolPredict Pro</h1>
        <p>Pronósticos de LaLiga con IA</p>
      </header>
      
      <main style={{ marginTop: '30px' }}>
        {matches.length > 0 ? (
          matches.map(m => (
            <div key={m.id} style={{ background: '#333', margin: '10px 0', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{m.homeTeam.name} vs {m.awayTeam.name}</span>
              <button style={{ background: '#00ff00', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Predecir</button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>Cargando partidos...</p>
        )}
      </main>
    </div>
  );
}
