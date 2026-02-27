
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
    { id: 'LALIGA', nombre: '1a Espana' },
    { id: 'LALIGA2', nombre: '2a Espana' },
    { id: 'PREMIER', nombre: 'Premier' },
    { id: 'SERIEA', nombre: 'Serie A' },
    { id: 'BUNDES', nombre: 'Bundesliga' }
  ];

  const baseDeDatos = {
    LALIGA: [
      { m: 'Real Madrid', v: 'Barcelona' },
      { m: 'At. Madrid', v: 'Sevilla' },
      { m: 'Villarreal', v: 'Valencia' }
    ],
    LALIGA2: [
      { m: 'Almeria', v: 'Cadiz' },
      { m: 'Granada', v: 'Malaga' }
    ],
    PREMIER: [
      { m: 'Man. City', v: 'Liverpool' },
      { m: 'Arsenal', v: 'Chelsea' }
    ],
    SERIEA: [
      { m: 'Inter Milan', v: 'Juventus' },
      { m: 'Milan', v: 'Napoli' }
    ],
    BUNDES: [
      { m: 'Bayern M.', v: 'Dortmund' },
      { m: 'Leverkusen', v: 'Leipzig' }
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
          setPartidos(baseDeDatos['LALIGA']);
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
      setPartidos(baseDeDatos[id] || []);
      setLoading(false);
    }, 400);
  };

  if (loading) {
    return <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>CARGANDO...</div>;
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1>GOL PREDICT PRO</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{ padding: '15px 30px', margin: 'auto', backgroundColor: '#fbbf24', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ENTRAR CON GOOGLE</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif'
