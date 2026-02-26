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
          const data = await res.json();
          if (data.matches) {
            allLeagues.push({
              name: data.competition.name,
              code: id,
              matches: data.matches
            });
          }
        }
        setLeaguesData(allLeagues);
      } catch (e) { console.error("Error cargando datos"); }
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
      
      {user && (
        <div style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '10px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '20px', fontSize: '13px' }}>
          ✨ MODO PREMIUM ACTIVO ✨
        </div>
      )}

      {/* Selector de Pestañas */}
      {!loading && (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', marginBottom: '20px', paddingBottom: '10px', justifyContent: 'flex-start', WebkitOverflowScrolling: 'touch' }}>
          {leaguesData.map((league, index) => (
            <button
              key={index}
              onClick={() => setActiveLeague(index)}
              style={{
                background: activeLeague === index ? '#00ff00' : '#222',
                color: activeLeague === index ? '#000' : '#fff',
                border: 'none', padding: '10px 18px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap', transition: '0.3s'
              }}
            >
              {league.code === 'PD' ? 'LaLiga' : league.code === 'CL' ? 'Champions' : league.name}
            </button>
          ))}
        </div>
      )}

      {loading ? <p>Preparando partidos de la semana...</p> : (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          {leaguesData[activeLeague]?.matches.length === 0 ? <p>No hay partidos programados</p> : 
            leaguesData[activeLeague]?.matches.map(m => {
              const prediction = getAIPrediction(m.id);
              return (
                <div key={m.id} style={{ background: '#1a1a1a', margin: '12px auto', padding: '20px', borderRadius: '15px', maxWidth: '450px', border: '1px solid #333' }}>
                  
                  {/* CORRECCIÓN: Nombres completos con ajuste de línea */}
                  <div style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: 'bold', lineHeight: '1.4' }}>
                    <div style={{ color: '#fff', wordWrap: 'break-word' }}>{m.homeTeam.name}</div>
                    <div style={{ color: '#00ff00', fontSize: '14px', margin: '5px 0' }}>vs</div>
                    <div style={{ color: '#fff', wordWrap: 'break-word' }}>{m.awayTeam.name}</div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '15px' }}>
                    {['1', 'X', '2'].map(op => (
                      <div key={op} style={{ 
                        background: prediction.pick === op ? '#00ff00' : '#333', 
                        color: prediction.pick === op ? '#000' : '#fff',
                        padding: '10px 0', borderRadius: '8px', fontWeight: 'bold', width: '65px'
                      }}>
                        {op}
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ background: '#222', padding: '12px', borderRadius: '10px', border: '1px solid #ffd700' }}>
                    <div style={{ color: '#ffd700', fontSize: '14px', fontWeight: 'bold' }}>🎯 MARCADOR EXACTO IA: {prediction.score}</div>
                  </div>
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}
