import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Configuración real extraída de tus capturas
const API_KEY_FOOTBALL = "8622f57039804f3fbf997840e90c8b18";
const firebaseConfig = {
  apiKey: "AIzaSyCWaYeEdL9BAbFs0LZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function Home() {
  const [user, setUser] = useState(null);
  const [premium, setPremium] = useState(false);
  const [matches, setMatches] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docSnap = await getDoc(doc(db, "users", u.uid));
        if (docSnap.exists()) setPremium(docSnap.data().premium);
      }
    });

    fetch("https://api.football-data.org/v4/matches", {
      headers: { "X-Auth-Token": API_KEY_FOOTBALL }
    })
    .then(res => res.json())
    .then(data => setMatches(data.matches || []))
    .catch(e => console.log(e));
  }, []);

  const handleAuth = async (type) => {
    try {
      if (type === "signup") {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), { premium: false });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div style={{ backgroundColor: '#111', color: 'white', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00' }}>⚽ GOL PREDICT PRO</h1>
      {!user ? (
        <div style={{ background: '#222', padding: '20px', borderRadius: '10px', maxWidth: '300px', margin: 'auto' }}>
          <h3>Acceso Usuarios</h3>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '90%', marginBottom: '10px', padding: '8px' }} />
          <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} style={{ width: '90%', marginBottom: '10px', padding: '8px' }} />
          <button onClick={() => handleAuth("login")} style={{ background: '#00ff00', border: 'none', padding: '10px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
          <p onClick={() => handleAuth("signup")} style={{ fontSize: '12px', cursor: 'pointer', marginTop: '10px', color: '#aaa' }}>¿No tienes cuenta? Regístrate aquí</p>
        </div>
      ) : (
        <div>
          <p>👤 {user.email} | Premium: {premium ? "SÍ" : "NO"} | <span onClick={() => signOut(auth)} style={{ color: '#ff4444', cursor: 'pointer' }}>Cerrar sesión</span></p>
          {!premium && (
            <div style={{ background: 'gold', color: 'black', padding: '10px', borderRadius: '5px', fontWeight: 'bold', margin: '20px auto', maxWidth: '400px' }}>💎 ACTIVAR SUSCRIPCIÓN PREMIUM</div>
          )}
          <div style={{ marginTop: '30px' }}>
            {matches.map(m => (
              <div key={m.id} style={{ background: '#222', margin: '10px auto', padding: '15px', borderRadius: '10px', maxWidth: '450px', border: '1px solid #333' }}>
                {m.homeTeam.name} vs {m.awayTeam.name}
                <div style={{ color: '#ffd700', fontSize: '12px', marginTop: '10px' }}>
                  {premium ? "⭐ Pronóstico disponible" : "🔒 Pronóstico bloqueado"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
        }
              
    

                                                             }
