import Head from 'next/head';
import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        const db = getFirestore(app);
        const userRef = doc(db, "usuarios", u.email);
        const userSnap = await getDoc(userRef);
        setUser(userSnap.exists() && userSnap.data().esPremium ? { ...u, esPremium: true } : u);
      } else { setUser(null); }
    });

    const fetchAllLeagues = async () => {
      const leagues = ['CL', 'PL', 'PD', 'SA']; // Champions, Premier, España, Italia
      let combinedMatches = [];
      for (const league of leagues) {
        try {
          const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${league}/matches?status=SCHEDULED`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          const data = await res.json();
          if (data.matches) combinedMatches = [...combinedMatches, ...data.matches.slice(0, 3)];
        } catch (e) { console.error("Error en liga " + league); }
      }
      setMatches(combinedMatches);
      setLoading(false);
    };
    fetchAllLeagues();
  }, []);

  // Lógica IA: Elige ganador basándose en una lógica de probabilidad simulada
  const getAISelection = (id) => ['1', 'X', '2'][id % 3];

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <Head>
        <link rel="icon" href="data:," /> {/* Esto elimina el error del favicon */}
        <title>GOL PREDICT PRO</title>
      </Head>

      <h1 style={{ color: '#00ff00', fontSize: '28px' }}>⚽ GOL PREDICT PRO</h1>
      
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p>Usuario: <b>{user.email}</b> | <span onClick={() => signOut(auth)} style={{ color: '#ff4444', cursor: 'pointer' }}>Salir</span></p>
          <div style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>
            ✨ SUSCRIPCIÓN PREMIUM ACTIVA ✨
          </div>
        </div>
      )}

      {loading ? <p>Analizando ligas europeas...</p> : (
        matches.map(m => {
          const aiPick = getAISelection(m.id);
          return (
            <div key={m.id} style={{ background: '#1a1a1a', margin: '15px auto', padding: '15px', borderRadius: '12px', maxWidth: '450px', border: '1px solid #333' }}>
              <div style={{ fontSize: '12px', color: '#00ff00', fontWeight: 'bold' }}>{m.competition.name}</div>
              <div style={{ margin: '10px 0', fontWeight: 'bold' }}>{m.homeTeam.name} vs {m.awayTeam.name}</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                {['1', 'X', '2'].map(op => (
                  <div key={op} style={{ 
                    background: aiPick === op ? '#00ff00' : '#333', 
                    color: aiPick === op ? '#000' : '#fff',
                    padding: '8px 20px', borderRadius: '5px', fontWeight: 'bold'
                  }}>
                    {op}
                  </div>
                ))}
              </div>
              <div style={{ color: '#ffd700', fontSize: '13px' }}>⭐ IA Predict: Gana {aiPick === '1' ? 'Local' : aiPick === '2' ? 'Visitante' : 'Empate'}</div>
            </div>
          )
        })
      )}
    </div>
  );
}
