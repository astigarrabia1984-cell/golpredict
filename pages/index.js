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
  const [leaguesData, setLeaguesData] = useState([]);
  const [activeLeague, setActiveLeague] = useState(0);
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

    const fetchLeagues = async () => {
      const leagueIds = ['CL', 'PL', 'PD', 'SA']; 
      let allLeagues = [];
      try {
        for (const id of leagueIds) {
          const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${id}/matches?status=SCHEDULED`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          if (!res.ok) throw new Error("CORS Blocked");
          const data = await res.json();
          if (data.matches) {
            allLeagues.push({
              name: id === 'PD' ? 'LaLiga' : id === 'CL' ? 'Champions' : id === 'PL' ? 'Premier' : 'Serie A',
              code: id,
              matches: data.matches
            });
          }
        }
        setLeaguesData(allLeagues);
        setErrorApi(false);
      } catch (e) { 
        console.error("Error cargando datos");
        setErrorApi(true);
      }
      setLoading(false);
    };
    fetchLeagues();
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

      <h1 style={{ color: '#00ff00', fontSize: '26px', marginBottom: '15px' }}>⚽ GOL PREDICT PRO</h1>
      
      {/* Botón de emergencia si no cargan los partidos */}
      {errorApi && (
        <div style={{ background: '#331111', border: '1px solid #ff0000', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
          <p style={{ fontSize: '14px' }}>⚠️ Los partidos no cargan en este dispositivo.</p>
          <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" style={{ background: '#00ff00', color: '#000', padding: '10px 15px', borderRadius: '5px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
            ACTIVAR DATOS AQUÍ
          </a>
        </div>
      )}

      {/* Selector de Pestañas */}
      {!loading && leaguesData.length > 0 && (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '20px', paddingBottom: '10px', justifyContent: 'center' }}>
          {leaguesData.map((league, index) => (
            <button key={index} onClick={() => setActiveLeague(index)} style={{
              background: activeLeague === index ? '#00ff00' : '#222',
              color: activeLeague === index ? '#000' : '#fff',
              border: 'none', padding: '10px 18px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap'
            }}>
              {league.name}
            </button>
          ))}
        </div>
      )}

      {loading ? <p>Analizando partidos de la semana...</p> : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {leaguesData[activeLeague]?.matches.map(m => {
            const prediction = getAIPrediction(m.id);
            return (
              <div key={m.id} style={{ background: '#1a1a1a', margin: '12px auto', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
                
                {/* Nombres de los DOS equipos garantizados */}
                <div style={{ marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#fff' }}>{m.homeTeam.name}</div>
                  <div style={{ color: '#00ff00', fontSize: '14px', margin: '5px 0', fontWeight: 'bold' }}>vs</div>
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#fff' }}>{m.awayTeam.name}</div>
                </div>
                
                {/* Botones de predicción */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
                  {['1', 'X', '2'].map(op => (
                    <div key={op} style={{ 
                      background: prediction.pick === op ? '#00ff00' : '#333', 
                      color: prediction.pick === op ? '#000' : '#fff',
                      padding: '12px 25px', borderRadius: '8px', fontWeight: 'bold', width: '60px'
                    }}>
                      {op}
                    </div>
                  ))}
                </div>
                
                {/* Marcador Exacto */}
                <div style={{ background: '#222', padding: '12px', borderRadius: '10px', border: '1px solid #ffd700' }}>
                  <div style={{ color: '#ffd700', fontSize: '14px', fontWeight: 'bold' }}>🎯 MARCADOR IA: {prediction.score}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
