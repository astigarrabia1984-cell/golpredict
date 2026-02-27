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
    { id: 'LALIGA', nombre: '1ª España' },
    { id: 'LALIGA2', nombre: '2ª España' },
    { id: 'PREMIER', nombre: 'Premier' },
    { id: 'SERIEA', nombre: 'Serie A' },
    { id: 'BUNDES', nombre: 'Bundesliga' }
  ];

  const baseDeDatosPartidos = {
    LALIGA: [
      { m: 'Real Madrid', v: 'Real Sociedad' },
      { m: 'Barcelona', v: 'Getafe' },
      { m: 'Atlético', v: 'Sevilla' },
      { m: 'Villarreal', v: 'Valencia' }
    ],
    LALIGA2: [
      { m: 'Almería', v: 'Cádiz' },
      { m: 'Granada', v: 'Sporting' },
      { m: 'Zaragoza', v: 'Oviedo' },
      { m: 'Levante', v: 'Racing' }
    ],
    PREMIER: [
      { m: 'Man. City', v: 'Newcastle' },
      { m: 'Arsenal', v: 'Liverpool' },
      { m: 'Chelsea', v: 'Tottenham' },
      { m: 'Man. United', v: 'Aston Villa' }
    ],
    SERIEA: [
      { m: 'Inter', v: 'Lazio' },
      { m: 'Juventus', v: 'Roma' },
      { m: 'Milan', v: 'Fiorentina' },
      { m: 'Napoli', v: 'Atalanta' }
    ],
    BUNDES: [
      { m: 'Bayern', v: 'Leipzig' },
      { m: 'Dortmund', v: 'Frankfurt' },
      { m: 'Leverkusen', v: 'Stuttgart' },
      { m: 'Wolfsburg', v: 'Mgladbach' }
    ]
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "usuarios", currentUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().esPremium) {
          setIsPremium(true);
          setPartidos(baseDeDatosPartidos['LALIGA']);
        }
        setLoading(false);
      } else {
        setUser(null);
        setIsPremium(false);
        setLoading(false);
      }
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

  const obtenerAnalisisFijoIA = (m, v) => {
    const seed = (m.length + v.length + m.charCodeAt(0)) % 10;
    let ganador, score;
    if (seed > 5) {
      ganador = `Victoria ${m}`;
      score = `${(seed % 2) + 1}-${seed % 2}`;
    } else if (seed > 2) {
      ganador = `Victoria ${v}`;
      score = `${seed % 2}-${(seed % 2) + 1}`;
    } else {
      ganador = "Empate";
      score = `${seed % 2}-${seed % 2}`;
    }
