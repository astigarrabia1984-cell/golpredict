import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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

    // Volvemos a la conexión directa para que no dependas de archivos extra ahora mismo
    fetch("https://api.football-data.org/v4/matches", {
      headers: { "X-Auth-Token": "8622f57039804f3fbf997840e90c8b18" }
    })
      .then(res => res.json())
      .then(data => setMatches(data.matches || []))
      .catch(e => console.log(e));
  }, []);

  const handleAuth = async (type) => {
    try {
      if (type === "signup") await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div style={{ backgroundColor: '#111', color: 'white', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00' }}>⚽ GOL PREDICT PRO</h1>

      {!user ? (
        <div style={{ background: '#222', padding: '20px', borderRadius: '10px', maxWidth: '300px', margin: 'auto' }}>
          <h3>Área de Usuarios</h3>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '90%', marginBottom: '10px', padding: '8px' }} />
          <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} style={{ width: '90%', marginBottom: '10px', padding: '8px' }} />
          <button onClick={() => handleAuth("login")} style={{ background: '#00ff00', border: 'none', padding: '10px', width: '100%', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
          <p onClick={() => handleAuth("signup")} style={{ fontSize: '12px', cursor: 'pointer', marginTop: '10px', color: '#aaa' }}>¿No tienes cuenta? Regístrate aquí</p>
        </div>
      ) : (
        <div>
          <p>Bienvenido: {user.email} | <span onClick={() => signOut(auth)} style={{ color: '#ff4444', cursor: 'pointer' }}>Cerrar sesión</span></p>
          <div style={{ background: 'gold', color: 'black', padding: '10px', borderRadius: '5px', fontWeight: 'bold', margin: '20px auto', maxWidth: '400px' }}>💎 SUSCRIPCIÓN PREMIUM</div>
          <div style={{ marginTop: '30px' }}>
            {matches.length > 0 ? matches.map(m => (
              <div key={m.id} style={{ background: '#222', margin: '10px auto', padding: '15px', borderRadius: '10px', maxWidth: '450px', border: '1px solid #333' }}>
                {m.homeTeam.name} vs {m.awayTeam.name}
              </div>
            )) : <p>Cargando partidos...</p>}
          </div>
        </div>
      )}
    </div>
  );
        }

                                                             }
