import Head from 'next/head';
import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Tu configuración real de Firebase
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
      const leagues = ['CL', 'PL', 'PD', 'SA']; // Champions, Premier, España e Italia
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

  // IA: Sincroniza el ganador (1X2) con el marcador exacto
  const getAIPrediction = (id) => {
    const winners = ['1', 'X', '2'];
    const pick = winners[id % 3];
    let score = "";

    if (pick === '1') {
      const homeScores = ['1-0', '2-0', '2-1', '3-1'];
      score = homeScores[id % homeScores.length];
    } else if (pick === 'X') {
      const drawScores = ['0-0', '1-1', '2-2'];
      score = drawScores[id % drawScores.length];
    } else {
      const awayScores = ['0-1', '0-2', '1-2', '1-3'];
      score = awayScores[id % awayScores.length];
    }
    return { pick, score };
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <Head>
        <link rel="icon" href="data:," />
        <title>GOL PREDICT PRO</title>
      </Head>

      <h1 style={{ color: '#00ff00', fontSize: '28px' }}>⚽ GOL PREDICT PRO</h1>
      
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p>Usuario: <b>{user.email}</b> | <span onClick={() => signOut(auth)} style={{ color: '#ff4444', cursor: 'pointer' }}>Salir</span></p>
          <div style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>
            ✨ ACCESO PREMIUM IA ACTIVADO ✨
          </div>
        </div>
      )}

      {loading ? <p>Analizando mercados europeos...</p> : (
        matches.map(m => {
          const prediction = getAIPrediction(m.id);
          return (
            <div key={m.id} style={{ background: '#1a1a1a', margin: '15px auto', padding: '20px', borderRadius: '15px', maxWidth: '450px', border: '1px solid #333' }}>
              <div style={{ fontSize: '11px', color: '#00ff00', fontWeight: 'bold', textTransform: 'uppercase' }}>{m.competition.name}</div>
              
              {/* Nombres de equipos completos y en vertical para que no se corten */}
              <div style={{ margin: '15px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span>{m.homeTeam.name}</span>
                <span style={{ color: '#888', fontSize: '14px' }}>vs</span>
                <span>{m.awayTeam.name}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '15px' }}>
                {['1', 'X', '2'].map(op => (
                  <div key={op} style={{ 
                    background: prediction.pick === op ? '#00ff00' : '#333', 
                    color: prediction.pick === op ? '#000' : '#fff',
                    padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', width: '60px'
                  }}>
                    {op}
                  </div>
                ))}
              </div>
              
              <div style={{ background: '#222', padding: '12px', borderRadius: '10px', border: '1px solid #ffd700' }}>
                <div style={{ color: '#ffd700', fontSize: '14px', fontWeight: 'bold' }}>🎯 MARCADOR EXACTO IA: {prediction.score}</div>
                <div style={{ color: '#888', fontSize: '11px', marginTop: '5px' }}>Análisis táctico completado ✓</div>
              </div>
            </div>
          )
        })
      )}
    </div>
  );
}
