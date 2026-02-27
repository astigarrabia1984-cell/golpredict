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

  const ligas = [
    { id: 'LALIGA', nombre: '1ª España', equipos: ['Real Madrid', 'Barcelona', 'Atlético', 'Girona'] },
    { id: 'LALIGA2', nombre: '2ª España', equipos: ['Almería', 'Granada', 'Cádiz', 'Levante'] },
    { id: 'PREMIER', nombre: 'Premier', equipos: ['Man. City', 'Liverpool', 'Arsenal', 'Chelsea'] },
    { id: 'SERIEA', nombre: 'Serie A', equipos: ['Inter', 'Juventus', 'Milan', 'Napoli'] },
    { id: 'BUNDES', nombre: 'Bundesliga', equipos: ['Bayern', 'Dortmund', 'Leverkusen', 'Leipzig'] }
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
    // Simulamos carga de datos de la liga seleccionada
    setTimeout(() => {
      const liga = ligas.find(l => l.id === id);
      const nuevosPartidos = [
        { mandante: liga.equipos[0], visitante: liga.equipos[1] },
        { mandante: liga.equipos[2], visitante: liga.equipos[3] }
      ];
      setPartidos(nuevosPartidos);
      setLoading(false);
    }, 800);
  };

  const obtenerAnalisisIA = (m, v) => {
    const rand = Math.random();
    let ganador, score;
    if (rand > 0.6) { ganador = `Gana ${m}`; score = `${Math.floor(Math.random() * 2) + 1}-${Math.floor(Math.random() * 2)}`; }
    else if (rand > 0.3) { ganador = `Gana ${v}`; score = `${Math.floor(Math.random() * 2)}-${Math.floor(Math.random() * 2) + 1}`; }
    else { ganador = "Empate"; const g = Math.floor(Math.random() * 2); score = `${g}-${g}`; }
    return { ganador, score };
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ letterSpacing: '2px' }}>GOL PREDICT PRO</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{ padding: '15px 30px', cursor: 'pointer', margin: 'auto', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}>ENTRAR CON GOOGLE</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#fbbf24' }}>GOL PREDICT PRO</h3>
        <span style={{ fontSize: '0.8rem' }}>{user.displayName}</span>
      </header>

      {isPremium ? (
        <div>
          {/* PESTAÑAS DE LIGAS */}
          <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', marginBottom: '20px', paddingBottom: '5px' }}>
            {ligas.map((l) => (
              <button key={l.id} onClick={() => cambiarLiga(l.id)} style={{ padding: '8px 15px', whiteSpace: 'nowrap', backgroundColor: ligaActiva === l.id ? '#fbbf24' : '#222', color: ligaActiva === l.id ? '#000' : '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>
                {l.nombre}
              </button>
            ))}
          </div>

          {loading ?
