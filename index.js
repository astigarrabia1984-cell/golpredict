import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// 🔑 PON AQUÍ TU API REAL
const API_KEY = "8622f57039804f3fbf997840e90c8b18";

// 🔥 PON AQUÍ TU CONFIG REAL DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_FIREBASE_API_KEY",
  authDomain: "TU_FIREBASE_DOMAIN",
  projectId: "TU_FIREBASE_PROJECT_ID",
  storageBucket: "TU_FIREBASE_BUCKET",
  messagingSenderId: "TU_FIREBASE_MESSAGING_ID",
  appId: "TU_FIREBASE_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [premium, setPremium] = useState(false);
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      const res = await fetch(
        "https://api.football-data.org/v4/competitions/PD/matches?status=SCHEDULED",
        { headers: { "X-Auth-Token": API_KEY } }
      );
      const data = await res.json();

      const matchesWithXG = data.matches.map(m => ({
        ...m,
        homeTeam: { ...m.homeTeam, expectedGoals: Math.random() * 2 + 0.5 },
        awayTeam: { ...m.awayTeam, expectedGoals: Math.random() * 2 + 0.5 }
      }));

      setMatches(matchesWithXG || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function login(email, password) {
    const res = await signInWithEmailAndPassword(auth, email, password);
    setUser(res.user);
    const ref = doc(db, "users", res.user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) setPremium(snap.data().premium);
  }

  async function register(email, password) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", res.user.uid), { premium: false });
    alert("Usuario creado");
  }

  function generatePrediction(match) {
    if (!premium) return alert("Solo usuarios premium");

    const home = match.homeTeam.expectedGoals;
    const away = match.awayTeam.expectedGoals;

    let simple = "Empate";
    if (home > away) simple = "Gana Local";
    if (away > home) simple = "Gana Visitante";

    const exact = `${Math.round(home)} - ${Math.round(away)}`;

    return { simple, exact };
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>GolPredict Pro</h1>

      {!user && (
        <div>
          <button onClick={() => login("astigarrabia1984@gmail.com","123456")}>
            Login admin
          </button>
          <button onClick={() => register("usuario@correo.com","123456")}>
            Crear usuario
          </button>
        </div>
      )}

      {user && (
        <div>
          <p>Usuario: {user.email} | Premium: {premium ? "Sí" : "No"}</p>

          <h3>Partidos</h3>
          {matches.map(m => (
            <div key={m.id} style={{ marginBottom: 10 }}>
              {m.homeTeam.name} vs {m.awayTeam.name}
              <button onClick={() => {
                const r = generatePrediction(m);
                setPredictions(p => ({ ...p, [m.id]: r }));
              }}>
                Pronóstico
              </button>

              {predictions[m.id] && (
                <div>
                  {predictions[m.id].simple} | {predictions[m.id].exact}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
