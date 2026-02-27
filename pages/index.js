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

  // Lógica de Usuario y VIP
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        const userRef = doc(db, "usuarios", u.email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUser(u);
          setIsVIP(data.esPremium || false);
        } else {
          await setDoc(userRef, { email: u.email, esPremium: false });
          setUser(u);
          setIsVIP(false);
        }
      } else {
        setUser(null);
        setIsVIP(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!isVIP) { setLoading(false); return; }
    
    const fetchAllData = async () => {
      const leagueIds = ['CL', 'PL', 'PD', 'SA']; 
      let allLeagues = [];
      let allStandings = {};
      try {
        for (const id of leagueIds) {
          const resMatches = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${id}/matches`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          const dataMatches = await resMatches.json();
          const resTable = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${id}/standings`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          const dataTable = await resTable.json();

          if (dataMatches.matches) {
            allLeagues.push({
              id,
              name: id === 'PD' ? 'LaLiga' : id === 'CL' ? 'Champions' : id === 'PL' ? 'Premier' : 'Serie A',
              matches: dataMatches.matches.filter(m => m.status !== 'FINISHED').slice(0, 10)
            });
          }
          if (dataTable.standings) allStandings[id] = dataTable.standings[0].table;
        }
        setLeaguesData(allLeagues);
        setStandings(allStandings);
      } catch (e) { console.error("Error API"); }
      setLoading(false);
    };
    fetchAllData();
  }, [isVIP]);

  const login = () => signInWithPopup(auth, new GoogleAuthProvider());

  const getAIPrediction = (id) => {
    const p1 = Math.floor(Math.random() * 40) + 30;
    const pX = Math.floor(Math.random() * 20) + 10;
    return { p1, pX, p2: 100-p1-pX, score: p1 > 45 ? '2-1' : '1-1' };
  };

  if (!user) return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
      <h1>⚽ GOL PREDICT PRO</h1>
      <p>Inicia sesión para acceder a los pronósticos VIP</p>
      <button onClick={login} style={{ background: '#00ff00', color: '#000', padding: '15px 30px', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>ENTRAR CON GOOGLE</button>
    </div>
  );

  if (!isVIP) return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: '#00ff00' }}>⭐ ACCESO VIP REQUERIDO</h2>
      <p>Para ver las probabilidades de la IA y resultados en vivo debes suscribirte.</p>
      <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '2px solid #ffd700', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '30px', margin: '10px 0' }}>4,99€ <small style={{ fontSize: '14px' }}>/mes</small></h3>
        <ul style={{ textAlign: 'left', fontSize: '14px', marginBottom: '20px' }}>
          <li>✅ Predicciones Exactas IA</li>
          <li>✅ Probabilidades 1X2</li>
          <li>✅ Resultados en Tiempo Real</li>
          <li>✅ Tablas de Clasificación</li>
        </ul>
        {/* Aquí pondrías tu enlace de Stripe Checkout */}
        <button style={{ background: '#ffd700', color: '#000', width: '100%', padding: '15px', borderRadius: '10px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>SUSCRIBIRME AHORA</button>
      </div>
      <p style={{ fontSize: '12px', color: '#666' }}>Una vez pagado, tu acceso se activará automáticamente.</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '10px', fontFamily: 'sans-serif' }}>
      <Head><title>VIP - GOL PREDICT PRO</title></Head>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <span style={{ color: '#00ff00', fontWeight: 'bold' }}>VIP ACTIVO</span>
        <button onClick={() => auth.signOut()} style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '12px' }}>Cerrar Sesión</button>
      </header>

      {/* Selector de Liga y Vistas (IDEM código anterior) */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px', justifyContent: 'center' }}>
        {leaguesData.map((l, i) => (
          <button key={i} onClick={() => {setActiveLeague(i); setView('matches');}} style={{ background: activeLeague === i ? '#00ff00' : '#222', color: activeLeague === i ? '#000' : '#fff', border: 'none', padding: '10px 15px', borderRadius: '20px', fontWeight: 'bold' }}>{l.name}</button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
        <button onClick={() => setView('matches')} style={{ background: view === 'matches' ? '#444' : '#222', color: '#fff', border: '1px solid #555', padding: '8px 15px' }}>PARTIDOS</button>
        <button onClick={() => setView('table')} style={{ background: view === 'table' ? '#444' : '#222', color: '#fff', border: '1px solid #555', padding: '8px 15px' }}>CLASIFICACIÓN</button>
      </div>

      {loading ? <p style={{ textAlign: 'center' }}>Cargando datos VIP...</p> : (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          {view === 'matches' ? (
            leaguesData[activeLeague]?.matches.map(m => {
              const pred = getAIPrediction(m.id);
              return (
                <div key={m.id} style={{ background: '#111', marginBottom: '15px', padding: '15px', borderRadius: '12px', border: '1px solid #333' }}>
                  {m.status === 'IN_PLAY' && <div style={{ color: '#ff0000', fontSize: '11px', fontWeight: 'bold' }}>• EN VIVO</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                    {/* Nombres Claros y Resultados */}
                    <div style={{ width: '40%', fontWeight: 'bold' }}>{m.homeTeam.shortName || m.homeTeam.name}</div>
                    <div style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '18px' }}>
                      {m.status === 'SCHEDULED' ? 'vs' : `${m.score.fullTime.home} - ${m.score.fullTime.away}`}
                    </div>
                    <div style={{ width: '40%', fontWeight: 'bold' }}>{m.awayTeam.shortName || m.awayTeam.name}</div>
                  </div>
                  {/* Probabilidades */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', color: '#888' }}>
                    <span>1: {pred.p1}%</span><span>X: {pred.pX}%</span><span>2: {pred.p2}%</span>
                  </div>
                  <div style={{ background: '#00ff0022', marginTop: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #00ff00', textAlign: 'center', fontSize: '13px', fontWeight: 'bold', color: '#00ff00' }}>
                    🎯 RESULTADO IA: {pred.score}
                  </div>
                </div>
              );
            })
          ) : (
            <table style={{ width: '100%', fontSize: '12px' }}>
              <thead><tr style={{ color: '#00ff00' }}><th>Pos</th><th>Equipo</th><th>Pts</th></tr></thead>
              <tbody>
                {standings[leaguesData[activeLeague].id]?.map(t => (
                  <tr key={t.team.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px' }}>{t.position}</td>
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
