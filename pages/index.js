import Head from 'next/head';
import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  status: "online",
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
  const [errorApi, setErrorApi] = useState(false);

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
      const leagues = ['CL', 'PL', 'PD', 'SA']; 
      let combinedMatches = [];
      try {
        for (const league of leagues) {
          const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${league}/matches?status=SCHEDULED`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          if (!res.ok) throw new Error("CORS Blocked");
          const data = await res.json();
          if (data.matches) combinedMatches = [...combinedMatches, ...data.matches.slice(0, 2)];
        }
        setMatches(combinedMatches);
      } catch (e) { 
        console.error(e);
        setErrorApi(true);
      }
      setLoading(false);
    };
    fetchAllLeagues();
  }, []);

  const getAIPrediction = (id) => {
    const winners = ['1', 'X', '2'];
    const pick = winners[id % 3];
    let score = pick === '1' ? '2-1' : (pick === 'X' ? '1-1' : '0-2');
    return { pick, score };
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '15px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <Head>
        <link rel="icon" href="data:," />
        <title>GOL PREDICT PRO</title>
      </Head>

      <h1 style={{ color: '#00ff00', fontSize: '24px' }}>⚽ GOL PREDICT PRO</h1>
      
      {user && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>
            ✨ PREMIUM ACTIVADO ✨
          </div>
        </div>
      )}

      {errorApi && (
        <div style={{ background: '#440000', padding: '10px', borderRadius: '10px', marginBottom: '10px', fontSize: '13px' }}>
          ⚠️ Si no cargan los partidos en el móvil, pulsa aquí: <br/>
          <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" style={{color: '#00ff00'}}>Activar Servidor de Datos</a>
        </div>
      )}

      {loading ? <p>Cargando pronósticos...</p> : (
        matches.map(m => {
          const prediction = getAIPrediction(m.id);
          return (
            <div key={m.id} style={{ background: '#1a1a1a', margin: '12px auto', padding: '15px', borderRadius: '15px', maxWidth: '400px', border: '1px solid #333' }}>
              <div style={{ fontSize: '10px', color: '#00ff00', fontWeight: 'bold' }}>{m.competition.name}</div>
              
              {/* CORRECCIÓN DE NOMBRES */}
              <div style={{ margin: '10px 0', fontSize: '16px', fontWeight: 'bold' }}>
                <div style={{ color: '#fff' }}>{m.homeTeam?.name || "Equipo Local"}</div>
                <div style={{ color: '#888', fontSize: '12px', margin: '3px 0' }}>vs</div>
                <div style={{ color: '#fff' }}>{m.awayTeam?.name || "Equipo Visitante"}</div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '12px' }}>
                {['1', 'X', '2'].map(op => (
                  <div key={op} style={{ 
                    background: prediction.pick === op ? '#00ff00' : '#333', 
                    color: prediction.pick === op ? '#000' : '#fff',
                    padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', width: '50px'
                  }}>
                    {op}
                  </div>
                ))}
              </div>
              
              <div style={{ background: '#222', padding: '10px', borderRadius: '10px', border: '1px solid #ffd700' }}>
                <div style={{ color: '#ffd700', fontSize: '13px', fontWeight: 'bold' }}>🎯 MARCADOR IA: {prediction.score}</div>
              </div>
            </div>
          )
        })
      )}
    </div>
  );
}
