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
    setTimeout(() => {
      const liga = ligas.find(l => l.id === id);
      const nuevosPartidos = [
        { mandante: liga.equipos[0], visitante: liga.equipos[1] },
        { mandante: liga.equipos[2], visitante: liga.equipos[3] }
      ];
      setPartidos(nuevosPartidos);
      setLoading(false);
    }, 600);
  };

  const obtenerAnalisisFijoIA = (m, v) => {
    const seed = (m.length + v.length + m.charCodeAt(0)) % 10;
    let ganador, score;

    if (seed > 5) {
      ganador = `Gana ${m}`;
      score = `${(seed % 2) + 1}-${seed % 2}`;
    } else if (seed > 2) {
      ganador = `Gana ${v}`;
      score = `${seed % 2}-${(seed %
