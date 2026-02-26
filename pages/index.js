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
  const [needsAccess, setNeedsAccess] = useState(false);

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
          
          if (res.status === 403) {
            setNeedsAccess(true);
            break;
          }

          const data = await res.json();
          if (data.matches) {
            allLeagues.push({
              name: id === 'PD' ? 'LaLiga' : id === 'CL' ? 'Champions' : id === 'PL' ? 'Premier' : 'Serie A',
              matches: data.matches
            });
          }
        }
        setLeaguesData(allLeagues);
      } catch (e) { 
        console.error("Error"); 
      }
      setLoading(false);
    };
    fetchLeagues();
  }, []);

  const getAIPrediction = (id) => {
    const winners = ['1', 'X', '2'];
    const pick = winners[id % 3];
    let score = pick === '1' ? '2-0' : (pick === 'X' ? '1-1' : '0-1');
    return { pick, score };
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '10px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <Head>
        <title>GOL PREDICT PRO</title>
      </Head>

      <h1 style={{ color: '#00ff00', fontSize: '24px', margin: '20px 0' }}>⚽ GOL PREDICT PRO</h1>

      {/* BOTÓN DE RESCATE: Si no salen los partidos, esto lo arregla */}
      {needsAccess && (
        <div style={{ background: '#222', border: '2px solid #00ff00', padding: '20px', borderRadius: '15px', margin: '20px auto', maxWidth: '400px' }}>
          <p style={{ fontWeight: 'bold' }}>⚠️ ¡ATENCIÓN!</p>
          <p style={{ fontSize: '14px' }}>Para ver los partidos, pulsa el botón y luego "Request temporary access":</p>
          <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" style={{ background: '#00ff00', color: '#000', padding: '12px 20px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' }}>
            ACTIVAR PARTIDOS AQUÍ
          </a>
        </div>
      )}

      {!loading && !needsAccess && (
        <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', marginBottom: '20px', padding: '5px', justifyContent: 'center' }}>
          {leaguesData.map((league, index) => (
            <button key={index} onClick={() => setActiveLeague(index)} style={{
              background: activeLeague === index ? '#00ff00' : '#333',
              color: activeLeague === index ? '#000' : '#fff',
              border: 'none', padding: '10px 15px', borderRadius: '20px', fontWeight: 'bold', whiteSpace: 'nowrap'
            }}>
              {league.name}
            </button>
          ))}
        </div>
      )}

      {loading && !needsAccess ? <p>Cargando partidos...</p> : (
        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
          {leaguesData[activeLeague]?.matches.map(m => {
            const prediction = getAIPrediction(m.id);
            return (
              <div key={m.id} style={{ background: '#111', marginBottom: '20px', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
                {/* Nombres de los dos equipos siempre visibles */}
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{m.homeTeam.name}</div>
                  <div style={{ color: '#00ff00', fontSize: '12px', margin: '5px 0' }}>vs</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{m.awayTeam.name}</div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                  {['1', 'X', '2'].map(op => (
                    <div key={op} style={{ 
                      background: prediction.pick === op ? '#00ff00' : '#222', 
                      color: prediction.pick === op ? '#000' : '#fff',
                      padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', width: '50px'
                    }}>{op}</div>
                  ))}
                </div>
                
                <div style={{ background: '#00ff0022', padding: '10px', borderRadius: '10px', border: '1px solid #00ff00' }}>
                  <div style={{ color: '#00ff00', fontSize: '14px', fontWeight: 'bold' }}>🎯 MARCADOR IA: {prediction.score
