import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    // Cargamos los partidos (He puesto la Champions League para asegurar que cargue algo hoy)
    fetch("https://api.football-data.org/v4/competitions/CL/matches", {
      headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
    })
    .then(res => res.json())
    .then(data => setMatches(data.matches || []))
    .catch(e => console.log(e));
  }, []);

  const handleAuth = async (tipo) => {
    try {
      if (tipo === "registro") await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00' }}>⚽ GOL PREDICT PRO</h1>
      
      {!user ? (
        <div style={{ background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333', maxWidth: '350px', margin: 'auto' }}>
          <h3>Área de Usuarios</h3>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ width: '90%', padding: '10px', marginBottom: '10px' }} />
          <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} style={{ width: '90%', padding: '10px', marginBottom: '15px' }} />
          <button onClick={() => handleAuth("login")} style={{ width: '100%', padding: '10px', background: '#00ff00', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>ENTRAR</button>
          <p onClick={() => handleAuth("registro")} style={{ fontSize: '12px', marginTop: '15px', cursor: 'pointer', color: '#888' }}>¿Nuevo? <span style={{color:'#00ff00'}}>Regístrate aquí</span></p>
        </div>
      ) : (
        <div>
          <p>👤 {user.email} | <span onClick={() => signOut(auth)} style={{ color: 'red', cursor: 'pointer' }}>Salir</span></p>
          <div style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '15px', borderRadius: '10px', fontWeight: 'bold', margin: '20px auto', maxWidth: '400px' }}>🚀 ACTIVAR SUSCRIPCIÓN PREMIUM</div>
          <div style={{ marginTop: '20px' }}>
            {matches.length > 0 ? matches.map(m => (
              <div key={m.id} style={{ background: '#222', margin: '10px auto', padding: '15px', borderRadius: '10px', maxWidth: '450px', border: '1px solid #333' }}>
                <div style={{fontWeight: 'bold'}}>{m.homeTeam.name} vs {m.awayTeam.name}</div>
                <div style={{color: '#ffd700', fontSize: '12px', marginTop: '10px'}}>⭐ Pronóstico IA bloqueado 🔒</div>
              </div>
            )) : <p>Cargando partidos internacionales...</p>}
          </div>
        </div>
      )}
    </div>
  );
}
                                                             }
