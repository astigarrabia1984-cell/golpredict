import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const API_KEY = "8622f57039804f3fbf997840e90c8b18";

const firebaseConfig = {
  apiKey: "AIzaSyCWaYeEdL9BAbFs0LZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function Home() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("https://api.football-data.org/v4/competitions/PD/matches?status=SCHEDULED", {
      headers: { "X-Auth-Token": API_KEY }
    })
    .then(res => res.json())
    .then(data => setMatches(data.matches || []))
    .catch(e => console.log(e));
  }, []);

  return (
    <div style={{ backgroundColor: '#111', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#00ff00' }}>⚽ GOL PREDICT PRO</h1>
      <div style={{ marginTop: '30px' }}>
        {matches.length > 0 ? matches.map(m => (
          <div key={m.id} style={{ background: '#222', border: '1px solid #444', margin: '10px auto', padding: '20px', borderRadius: '12px', maxWidth: '400px' }}>
            <div style={{ fontWeight: 'bold' }}>{m.homeTeam.name} vs {m.awayTeam.name}</div>
            <button style={{ marginTop: '10px', background: '#00ff00', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>PREDECIR</button>
          </div>
        )) : <p>Cargando partidos de hoy...</p>}
      </div>
    </div>
  );
}
