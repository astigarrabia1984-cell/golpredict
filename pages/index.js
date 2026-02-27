import Head from 'next/head';
import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Tu configuración de Firebase vinculada a golpredict-pro
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

  // Control de sesión y verificación de campo esPremium en Firestore
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

  // Carga de datos con protección ante errores de API
  useEffect(() => {
    if (!isVIP) { setLoading(false); return; }
    
    const fetchData = async () => {
      const ids = ['CL', 'PL', 'PD', 'SA'];
      let leagues = [];
      let tables = {};
      try {
        for (const id of ids) {
          // Usamos el proxy CORS que ya activaste
          const headers = { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" };
          
          const resM = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${id}/matches`, { headers });
          const dataM = await resM.json();
          
          const resT = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${id}/standings`, { headers });
          const dataT = await resT.json();

          if (dataM.matches) {
            leagues.push({
              id,
              name: id === 'PD' ? 'LaLiga' : id === 'CL' ? 'Champions' : id === 'PL' ? 'Premier' : 'Serie A',
              matches: dataM.matches.filter(m => m.status !== 'FINISHED').slice(0, 10)
            });
          }
          if (dataT.standings) tables[id] = dataT.standings[0].table;
        }
        setLeaguesData(leagues);
        setStandings(tables);
      } catch (e) { 
        console.error("Error cargando API. Verifica CORS Anywhere."); 
      }
      setLoading(false);
    };
    fetchData();
  }, [isVIP]);

  const getAI = (id) => {
    const seed = id % 100;
    const p1 = 35 + (seed % 30);
    const pX = 15 + (seed % 15);
    return { p1, pX, p2: 100 - p1 - pX, score: p1 > 48 ? "2-0" : "1-1" };
  };

  // Pantalla de Bienvenida
  if (!user) return (
    <div style={{ background: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ letterSpacing: '2px' }}>⚽ GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, new GoogleAuthProvider())} style={{ background: '#00ff00', padding: '15px 40px', borderRadius: '30px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>ENTRAR CON GOOGLE</button>
    </div>
  );

  // Pantalla de Pago si esPremium es false
  if (!isVIP) return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', padding: '40px 20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#ffd700' }}>⭐ ACCESO VIP REQUERIDO</h2>
      <div style={{ background: '#111', padding: '30px', borderRadius: '20px', border: '2px solid #ffd700', maxWidth: '400px', margin: '30px auto' }}>
        <h3 style={{ fontSize: '32px' }}>4,99€<small style={{ fontSize: '14px' }}>/mes</small></h3>
        <p>Probabilidades IA, Resultados en Vivo y Clasificaciones.</p>
        <button style={{ background: '#ffd700', color: '#000', width: '100%', padding: '15px', borderRadius: '10px', fontWeight: 'bold', border: 'none', marginTop: '20px', cursor: 'pointer' }}>SUSCRIBIRME AHORA</button>
      </div>
      <button onClick={() => auth.signOut()} style={{ color: '#666', background: 'none', border: 'none', marginTop: '20px', textDecoration: 'underline' }}>Cerrar sesión</button>
    </div>
  );

  // Interfaz Principal "MODO VIP"
