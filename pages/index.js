import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// ✅ Datos reales de tu proyecto golpredict-pro
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

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [matches, setMatches] = useState([]);
const [seleccionados, setSeleccionados] = useState({});
  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Consultamos si el usuario es Premium en la base de datos
        const { getFirestore, doc, getDoc } = await import("firebase/firestore");
        const db = getFirestore();
        const userRef = doc(db, "usuarios", u.email);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && userSnap.data().esPremium) {
          setUser({ ...u, esPremium: true });
        } else {
          setUser(u);
        }
      } else {
        setUser(null);
      }
    });

    // Carga de partidos con el puente CORS
    fetch("https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/CL/matches", {
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
    } catch (e) { alert("Error de Acceso: " + e.message); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00' }}>⚽ GOL PREDICT PRO</h1>
      
      {!user ? (
        <div style={{ background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333', maxWidth: '350px', margin: 'auto' }}>
          <h3 style={{ marginBottom: '20px' }}>Área de Usuarios</h3>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ width: '90%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: 'none' }} />
          <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} style={{ width: '90%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: 'none' }} />
          <button onClick={() => handleAuth("login")} style={{ width: '100%', padding: '12px', background: '#00ff00', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>ENTRAR</button>
          <p onClick={() => handleAuth("registro")} style={{ fontSize: '12px', marginTop: '15px', cursor: 'pointer', color: '#888' }}>¿No tienes cuenta? <span style={{color: '#00ff00'}}>Regístrate aquí</span></p>
        </div>
      ) : (
        <div>
          <p>Bienvenido, <b>{user.email}</b> | <span onClick={() => signOut(auth)} style={{ color: '#ff4444', cursor: 'pointer', textDecoration: 'underline' }}>Salir</span></p>
          <div style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)', color: '#000', padding: '15px', borderRadius: '10px', fontWeight: 'bold', margin: '20px auto', maxWidth: '400px', boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)' }}>💎 ACTIVAR SUSCRIPCIÓN PREMIUM</div>
          <d{matches.length > 0 ? matches.map(m => (
  <div key={m.id} style={{ background: '#222', margin: '10px auto', padding: '15px', borderRadius: '10px', maxWidth: '450px' }}>
    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{m.homeTeam.name} vs {m.awayTeam.name}</div>
    
    <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
      {['1', 'X', '2'].map((opcion) => (
        <button 
          key={opcion}
          onClick={() => setSeleccionados({...seleccionados, [m.id]: opcion})}
          style={{ 
            background: seleccionados[m.id] === opcion ? '#00ff00' : '#444', 
            color: seleccionados[m.id] === opcion ? '#000' : '#fff',
            border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold'
          }}
        >
          {opcion}
        </button>
      ))}
    </div>

    <div style={{ color: '#ffd700', fontSize: '12px' }}>
      {user?.esPremium ? "⭐ Predicción IA: Gana Local (85%)" : "🌟 Pronóstico IA bloqueado 🔒"}
    </div>
  </div>
)) : <p>Cargando partidos...</p>}iv style={{ marginTop: '20px' }}>

              </div>

              <div style={{ color: '#ffd700', fontSize: '12px' }}>
                {user?.esPremium ? "🌟 Predicción IA: ¡Gana Local! (Confianza 85%)" : "🌟 Pronóstico IA bloqueado 🔒"}
              </div>
            </div>
          )) : <p>Cargando partidos internacionales...</p>}
        </div>
      )}
    </div>
  );
}
