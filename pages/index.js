import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Tu configuración de Firebase
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

  // Base de datos de partidos de la jornada
  const baseDeDatosPartidos = {
    LALIGA: [
      { m: 'Real Madrid', v: 'Real Sociedad' },
      { m: 'Barcelona', v: 'Getafe' },
      { m: 'Atlético', v: 'Sevilla' },
      { m: 'Villarreal', v: 'Valencia' },
      { m: 'Athletic', v: 'Betis' }
    ],
    LALIGA2: [
      { m: 'Almería', v: 'Cádiz' },
      { m: 'Granada', v: 'Sporting' },
      { m: 'Zaragoza', v: 'Oviedo' },
      { m: 'Levante', v: 'Racing' },
      { m: 'Elche', v: 'Eibar' }
    ],
    PREMIER: [
      { m: 'Man. City', v: 'Newcastle' },
      { m: 'Arsenal', v: 'Liverpool' },
      { m: 'Chelsea', v: 'Tottenham' },
      { m: 'Man. United', v: 'Aston Villa' },
      { m: 'Fulham', v: 'Brighton' }
    ],
    SERIEA: [
      { m: 'Inter', v: 'Lazio' },
      { m: 'Juventus', v: 'Roma' },
      { m: 'Milan', v: 'Fiorentina' },
      { m: 'Napoli', v: 'Atalanta' },
      { m: 'Bologna', v: 'Torino' }
    ],
    BUNDES: [
      { m: 'Bayern', v: 'Leipzig' },
      { m: 'Dortmund', v: 'Frankfurt' },
      { m: 'Leverkusen', v: 'Stuttgart' },
      { m: 'Wolfsburg', v: 'Mgladbach' },
      { m: 'Freiburg', v: 'Hoffenheim' }
    ]
  };

  const ligas = [
    { id: 'LALIGA', nombre: '1ª España' },
    { id: 'LALIGA2', nombre: '2ª España' },
    { id: 'PREMIER', nombre: 'Premier' },
    { id: 'SERIEA', nombre: 'Serie A' },
    { id: 'BUNDES', nombre: 'Bundesliga' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "usuarios", currentUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().esPremium) {
          setIsPremium(true);
          cambiarLiga('LALIGA');
        } else { setLoading(false); }
      } else { setUser(null); setIsPremium(false); setLoading(false); }
    });
    return () => unsubscribe();
  }, []);

  const cambiarLiga = (id) => {
    setLigaActiva(id);
    setLoading(true);
    setTimeout(() => {
      setPartidos(baseDeDatosPartidos[id] || []);
      setLoading(false);
    }, 600);
  };

  const obtenerAnalisisFijoIA = (m, v) => {
    // Genera resultados fijos basados en los nombres de los equipos
    const seed = (m.length + v.length + m.charCodeAt(0)) % 10;
    let ganador, score;
    if (seed > 5) {
      ganador = `Gana ${m}`;
      score = `${(seed % 2) + 1}-${seed % 2}`;
    } else if (seed > 2) {
      ganador = `Gana ${v}`;
      score = `${seed % 2}-${(seed % 2) + 1}`;
    } else {
      ganador = "Empate";
      score = `${seed % 2}-${seed % 2}`;
    }
    return { ganador, score };
  };

  const login = () => signInWithPopup(auth, provider);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ letterSpacing: '4px', marginBottom: '30px' }}>GOL PREDICT PRO</h1>
        <button onClick={login} style={{ padding: '15px 30px', cursor: 'pointer', margin: 'auto', backgroundColor: '#fbbf24', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', fontSize: '1rem' }}>ENTRAR CON GOOGLE</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: '#fbbf24', letterSpacing: '2px' }}>GOL PREDICT PRO</h2>
        <p style={{ fontSize: '0.8rem', margin: '5px 0', color: '#888' }}>Usuario VIP: {user.displayName}</p>
      </header>

      {isPremium ? (
        <div>
          {/* SELECTOR DE LIGAS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {ligas.map((l) => (
              <button key={l.id} onClick={() => cambiarLiga(l.id)} style={{ padding: '12px 5px', backgroundColor: ligaActiva === l.id ? '#fbbf24' : '#1
