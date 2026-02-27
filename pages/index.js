import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Tu configuración de Firebase (asegúrate de que coincida con tu proyecto)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "golpredict.firebaseapp.com",
  projectId: "golpredict",
  storageBucket: "golpredict.firebasestorage.app",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID"
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
        // Verificamos en tu base de datos si esPremium: true
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
      <div style={{ textAlign: 'center', marginTop: '50px', backgroundColor: '#000', color: '#fff', height: '100vh' }}>
        <h1>GOL PREDICT</h1>
        <button onClick={login} style={{ padding: '15px', fontSize: '20px', cursor: 'pointer' }}>
          ENTRAR CON GOOGLE
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <h2>Bienvenido, {user.displayName}</h2>
      
      {isPremium ? (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button style={{ flex: 1, padding: '10px' }}>PARTIDOS</button>
            <button style={{ flex: 1, padding: '10px' }}>TABLA</button>
          </div>
          <div style={{ border: '1px solid #333', padding: '20px', borderRadius: '10px' }}>
             <p>Cargando pronósticos de la IA...</p>
             {/* Aquí se cargará la API una vez actives CORS Anywhere */}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>Tu cuenta no es Premium.</p>
          <button style={{ padding: '10px', backgroundColor: '#ffcc00' }}>
            SUSCRIBIRSE POR 4,99€
          </button>
        </div>
      )}
    </div>
  );
}
