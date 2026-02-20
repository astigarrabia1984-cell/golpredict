import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Datos extraídos de tus imágenes 154387 y 1698a1
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const acceder = async (tipo) => {
    try {
      if (tipo === "registro") await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (e) { alert("Error: " + e.message); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00' }}>⚽ GOL PREDICT PRO</h1>
      
      {!user ? (
        <div style={{ background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333', width: '300px' }}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px' }} />
          <button onClick={() => acceder("login")} style={{ width: '100%', padding: '10px', background: '#00ff00', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '5px' }}>ENTRAR</button>
          <p onClick={() => acceder("registro")} style={{ fontSize: '12px', marginTop: '15px', cursor: 'pointer', color: '#888' }}>¿No tienes cuenta? Regístrate aquí</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>Bienvenido: <b>{user.email}</b></p>
          <div style={{ background: 'gold', color: '#000', padding: '15px', borderRadius: '10px', fontWeight: 'bold', margin: '20px 0', cursor: 'pointer' }}>🚀 ACTIVAR PREMIUM</div>
          <button onClick={() => signOut(auth)} style={{ background: 'none', color: 'red', border: 'none', cursor: 'pointer' }}>Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
        }

              
    

                                                             }
