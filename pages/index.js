import Head from 'next/head';
import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

export default function Home() {
  const [user, setUser] = useState(null);
  const [leaguesData, setLeaguesData] = useState([]);
  const [activeLeague, setActiveLeague] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        const db = getFirestore(app);
        const userRef = doc(db, "usuarios", u.email);
        const userSnap = await getDoc(userRef);
        setUser(userSnap.exists() && userSnap.data().esPremium ? { ...u, esPremium: true } : u);
      } else { setUser(null); }
    });

    const fetchLeagues = async () => {
      const leagueIds = ['CL', 'PL', 'PD', 'SA']; 
      let allLeagues = [];
      try {
        for (const id of leagueIds) {
          const res = await fetch(`https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/${id}/matches?status=SCHEDULED`, {
            headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
          });
          const data = await res.json();
          if (data.matches) {
            allLeagues.push({
              name: data.competition.name,
              code: id,
              matches: data.matches
            });
          }
        }
        setLeaguesData(allLeagues);
      } catch (e) { console.error("Error"); }
      setLoading(false);
    };
    fetchLeagues();
  }, []);

  const getAIPrediction = (id) => {
    const winners = ['1', 'X', '2'];
    const pick = winners[id % 3];
    let score = pick === '1' ? '2-1' : (pick === 'X' ? '1-1' : '0-2');
    return { pick, score };
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '10px', textAlign
