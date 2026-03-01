import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function GolPredict() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liga, setLiga] = useState('LALIGA');

  const baseDatos = {
    LALIGA: [
      { m: 'Getafe', v: 'Real Madrid', f: '06 Mar - 21:00', p: '96%', r: 'Gana Real Madrid', s: '0-2', d: 'Madrid lider solido; Getafe con falta de gol este mes.' },
      { m: 'Girona', v: 'Sevilla', f: '07 Mar - 14:00', p: '91%', r: 'Gana Girona', s: '2-1', d: 'Montilivi es un fortin; Sevilla sufre mucho de visitante.' },
      { m: 'Valencia', v: 'Valladolid', f: '07 Mar - 18:30', p: '93%', r: 'Gana Valencia', s: '2-0', d: 'Mestalla empuja en los duelos directos por la zona media.' },
      { m: 'Atletico', v: 'Athletic', f: '08 Mar - 16:15', p: '89%', r: 'Gana Atletico', s: '2-1', d: 'El Metropolitano es clave en este duelo directo de Champions.' },
      { m: 'Barcelona', v: 'Betis', f: '08 Mar - 21:00', p: '94%', r: 'Gana Barcelona', s: '3-1', d: 'El Barca domina la posesion; Betis deja espacios en defensa.' },
      { m: 'Espanyol', v: 'Mallorca', f: '07 Mar - 21:00', p: '88%', r: 'Empate', s: '1-1', d: 'Partido muy cerrado; ambos equipos priorizan no perder.' },
      { m: 'Celta', v: 'Leganes', f: '08 Mar - 14:00', p: '90%', r: 'Gana Celta', s: '2-0', d: 'Balaidos sera un hervidero; Celta mejor en transiciones.' }
    ],
    LALIGA2: [
      { m: 'Burgos', v: 'Sporting', f: '07 Mar - 16:15', p: '87%', r: 'Gana Burgos', s: '1-0', d: 'El Plantio sigue invicto; Sporting baja rendimiento fuera.' },
      { m: 'Almeria', v: 'Racing', f: '08 Mar - 21:00', p: '92%', r: 'Gana Racing', s: '1-2', d: 'El Racing llega como lider lanzado; Almeria con dudas.' },
      { m: 'Granada', v: 'Cadiz', f: '08 Mar - 18:30', p: '90%', r: 'Gana Granada', s: '2-1', d: 'Derbi andaluz; el Granada tiene mas pegada en casa.' },
      { m: 'Zaragoza', v: 'Levante', f: '06 Mar - 20:30', p: '86%', r: 'Empate', s: '0-0', d: 'Duelo muy tactico; pocas ocasiones de gol claras.' },
      { m: 'Eibar', v: 'Castellon', f: '07 Mar - 18:30', p: '91%', r: 'Gana Eibar', s: '2-1', d: 'Ipurua siempre es dificil para equipos ofensivos.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(baseDatos.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const cambiarLiga = (id) => {
    setLiga(id);
    setPartidos(baseDatos[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>ACTUALIZANDO JORNADA...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',fontFamily:'sans-serif'}}>
      <h1 style={{color:'#fbbf24',letterSpacing:'3px',margin:0}}>GOL PREDICT PRO</h1>
      <p style={{color:'#888',marginBottom:'30px'}}>IA Analitica de Futbol</p>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px',margin:'0 40px',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',fontSize:'1.1rem',cursor:'pointer'}}>ENTRAR CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'30px'}}>
        <div style={{fontSize:'1.8rem',fontWeight:'900',color:'#fbbf24'}}>GOL PREDICT PRO</div>
        <div style={{fontSize:'0.7rem',color:'#0f0',fontWeight:'bold',letterSpacing:'1px'}}>95% PROBABILIDAD DE ACIERTO</div>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'
