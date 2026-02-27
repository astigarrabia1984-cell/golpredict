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
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4",
  measurementId: "G-0291GDRK66"
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
  const [ligaActiva, setLigaActiva] = useState('LALIGA');
  const [vista, setVista] = useState('PARTIDOS');

  const ligas = [
    { id: 'LALIGA', nombre: '1a Espana' },
    { id: 'LALIGA2', nombre: '2a Espana' },
    { id: 'PREMIER', nombre: 'Premier' },
    { id: 'SERIEA', nombre: 'Serie A' },
    { id: 'BUNDES', nombre: 'Bundesliga' }
  ];

  const baseDeDatosPartidos = {
    LALIGA: [
      { m: 'Real Madrid', v: 'Barcelona' },
      { m: 'At. Madrid', v: 'Sevilla' },
      { m: 'Villarreal', v: 'Valencia' },
      { m: 'Real Sociedad', v: 'Athletic' }
    ],
    LALIGA2: [
      { m: 'Almeria', v: 'Cadiz' },
      { m: 'Granada', v: 'Sporting' },
      { m: 'Zaragoza', v: 'Oviedo' },
      { m: 'Levante', v: 'Racing' }
    ],
    PREMIER: [
      { m: 'Man. City', v: 'Liverpool' },
      { m: 'Arsenal', v: 'Chelsea' },
      { m: 'Man. United', v: 'Tottenham' },
      { m: 'Aston Villa', v: 'Newcastle' }
    ],
    SERIEA: [
      { m: 'Inter Milan', v: 'Juventus' },
      { m: 'Milan', v: 'Napoli' },
      { m: 'Roma', v: 'Lazio' },
      { m: 'Atalanta', v: 'Fiorentina' }
    ],
    BUNDES: [
      { m: 'Bayern M.', v: 'Dortmund' },
      { m: 'Leverkusen', v: 'Leipzig' },
      { m: 'Frankfurt', v: 'Stuttgart' },
      { m: 'Wolfsburg', v: 'Freiburg' }
    ]
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, 'usuarios', currentUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().esPremium) {
          setIsPremium(true);
          setPartidos(baseDeDatosPartidos['LALIGA']);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const cambiarLiga = (id) => {
    setLigaActiva(id);
    setLoading(true);
    setTimeout(() => {
      setPartidos(baseDeDatosPartidos[id] || []);
      setLoading(false);
    }, 500);
  };

  const obtenerAnalisis = (m, v) => {
    const suma = m.length + v.length;
    if (suma % 3 === 0) return { g: 'Victoria ' + m, s: '2-0' };
    if (suma % 3 === 1) return { g: 'Victoria ' + v, s: '1-3' };
    return { g: 'Empate', s: '1-1' };
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#000', color: '#fbbf24', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <h3>IA ANALIZANDO JORNADA...</h3>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ letterSpacing: '4px', color: '#fbbf24' }}>GOL PREDICT PRO</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{ padding: '15px 30px', cursor: 'pointer', margin: 'auto', backgroundColor: '#fbbf24', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '1rem' }}>
          ENTRAR CON GOOGLE
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#
