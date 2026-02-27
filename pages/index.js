import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Configuración real de tu proyecto golpredict-pro
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, "usuarios", user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().esPremium) {
          setIsPremium(true);
        }
      } else {
        setUser(null);
        setIsPremium(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = () => signInWithPopup(auth, provider);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>GOL PREDICT</h1>
        <div>
          <button onClick={login} style={{ padding: '15px 30px', fontSize: '20px', cursor: 'pointer', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            ENTRAR CON GOOGLE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>GOL PREDICT PRO</h2>
        <span>Hola, {user.displayName}</span>
      </header>
      
      {isPremium ? (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button style={{ flex: 1, padding: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>PARTIDOS</button>
            <button style={{ flex: 1, padding: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>TABLA</button>
          </div>
          <div style={{ border: '1px solid #333', padding: '40px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#111' }}>
             <p style={{ fontSize: '1.2rem', color: '#aaa' }}>Conectando con la IA de pronósticos...</p>
             <p style={{ fontSize: '0.9rem', color: '#666' }}>Recuerda activar el acceso en CORS Anywhere si no ves datos.</p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h3>Acceso Restringido</h3>
          <p>Tu cuenta no tiene suscripción VIP activa.</p>
          <button style={{ padding: '15px 30px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
            SOLICITAR ACCESO VIP (4,99€)
          </button>
        </div>
      )}
    </div>
  );
}
