import Head from 'next/head';
import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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
const db = getFirestore(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [leaguesData, setLeaguesData] = useState([]);
  const [standings, setStandings] = useState({});
  const [activeLeague, setActiveLeague] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('matches');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const userRef = doc(db, "usuarios", u.email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsVIP(userSnap.data().esPremium || false);
        } else {
          await setDoc(userRef, { email: u.email, esPremium: false });
          setIsVIP(false);
        }
        setUser(u);
      } else {
        setUser(null);
        setIsVIP(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isVIP) { setLoading(false); return; }
    
    const fetchData = async () => {
      const ids = ['CL', 'PL', 'PD', 'SA'];
      let leagues = [];
      let tables = {};
      try {
        for (const id of ids) {
          const resM = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${id}/matches`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          const dataM = await resM.json();
          const resT = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${id}/standings`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          const dataT = await resT.json();

          if (dataM.matches) {
            leagues.push({
              id,
              name: id === 'PD' ? 'LaLiga' : id === 'CL' ? 'Champions' : id === 'PL' ? 'Premier' : 'Serie A',
              matches: dataM.matches.filter(m => m.status !== 'FINISHED').slice(0, 12)
            });
          }
          if (dataT.standings) tables[id] = dataT.standings[0].table;
        }
        setLeaguesData(leagues);
        setStandings(tables);
      } catch (e) { console.log("API Error"); }
      setLoading(false);
    };
    fetchData();
  }, [isVIP]);

  const getAI = (id) => {
    const p1 = Math.floor(Math.random() * 30) + 40;
    const pX = Math.floor(Math.random() * 15) + 10;
    return { p1, pX, p2: 100-p1-pX, score: p1 > 50 ? "2-0" : "1-1" };
  };

  if (!user) return (
    <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#0ff00' }}>⚽ GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} style={{ background: '#00ff00', padding: '15px 30px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ENTRAR CON GOOGLE</button>
    </div>
  );

  if (!isVIP) return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#ffd700' }}>⭐ PLAN VIP REQUERIDO</h2>
      <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '2px solid #ffd700', maxWidth: '400px', margin: '20px auto' }}>
        <h3 style={{ fontSize: '32px' }}>4,99€<small style={{ fontSize: '14px' }}>/mes</small></h3>
        <p>Desbloquea Probabilidades IA, Marcadores en Vivo y Clasificaciones.</p>
        <button style={{ background: '#ffd700', color: '#000', width: '100%', padding: '15px', borderRadius: '10px', fontWeight: 'bold', border: 'none', marginTop: '20px' }}>SUSCRIBIRME (STRIPE)</button>
      </div>
      <button onClick={() => auth.signOut()} style={{ color: '#666', background: 'none', border: 'none' }}>Cerrar sesión</button>
    </div>
  );

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '10px', fontFamily: 'sans-serif' }}>
      <Head><title>VIP - GOL PREDICT PRO</title></Head>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
        <span style={{ color: '#00ff00', fontWeight: 'bold' }}>MODO VIP</span>
        <button onClick={() => auth.signOut()} style={{ color: '#ff4444', background: 'none', border: 'none' }}>Salir</button>
      </div>

      <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px' }}>
        {leaguesData.map((l, i) => (
          <button key={i} onClick={() => {setActiveLeague(i); setView('matches');}} style={{ background: activeLeague === i ? '#00ff00' : '#222', color: activeLeague === i ? '#000' : '#fff', border: 'none', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{l.name}</button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '15px 0' }}>
        <button onClick={() => setView('matches')} style={{ background: view === 'matches' ? '#333' : '#111', color: '#fff', border: '1px solid #444', padding: '10px 20px' }}>PARTIDOS</button>
        <button onClick={() => setView('table')} style={{ background: view === 'table' ? '#333' : '#111', color: '#fff', border: '1px solid #444', padding: '10px 20px' }}>TABLA</button>
      </div>

      {loading ? <p style={{ textAlign: 'center' }}>Cargando datos en vivo...</p> : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {view === 'matches' ? (
            leaguesData[activeLeague]?.matches.map(m => {
              const ai = getAI(m.id);
              return (
                <div key={m.id} style={{ background: '#111', marginBottom: '15px', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
                  {m.status === 'IN_PLAY' && <div style={{ color: '#f00', fontWeight: 'bold', fontSize: '12px' }}>• EN VIVO</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                    <div style={{ width: '40%', fontWeight: 'bold' }}>{m.homeTeam.name}</div>
                    <div style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '20px' }}>
                      {m.status === 'SCHEDULED' ? 'vs' : `${m.score.fullTime.home}-${m.score.fullTime.away}`}
                    </div>
                    <div style={{ width: '40%', fontWeight: 'bold' }}>{m.awayTeam.name}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', color: '#888', borderTop: '1px solid #222', paddingTop: '10px' }}>
                    <span>1: {ai.p1}%</span><span>X: {ai.pX}%</span><span>2: {ai.p2}%</span>
                  </div>
                  <div style={{ background: '#00ff0022', color: '#00ff00', padding: '8px', borderRadius: '5px', marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>🎯 PREDICCIÓN: {ai.score}</div>
                </div>
              );
            })
          ) : (
            <table style={{ width: '100%', textAlign: 'left', fontSize: '13px' }}>
              <thead><tr style={{ color: '#00ff00' }}><th>Pos</th><th>Equipo</th><th>Pts</th></tr></thead>
              <tbody>
                {standings[leaguesData[activeLeague].id]?.map(t => (
                  <tr key={t.team.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '10px 5px' }}>{t.position}</td>
                    <td>{t.team.name}</td>
                    <td style={{ color: '#00ff00' }}>{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
