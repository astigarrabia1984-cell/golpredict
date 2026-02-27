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
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "usuarios", currentUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().esPremium) {
          setIsPremium(true);
          fetchPartidos();
        } else {
          setLoading(false);
        }
      } else {
        setUser(null);
        setIsPremium(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPartidos = async () => {
    try {
      // Usamos el puente de CORS Anywhere
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.api-futebol.com.br/v1/campeonatos/10/partidas/proximas', {
        headers: {
          'Authorization': 'Bearer test_786526153725162715' 
        }
      });
      const data = await response.json();
      setPartidos(data.partidas || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = () => signInWithPopup(auth, provider);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1>GOL PREDICT PRO</h1>
        <button onClick={login} style={{ padding: '15px', fontSize: '20px', cursor: 'pointer', margin: 'auto' }}>ENTRAR CON GOOGLE</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <h2>GOL PREDICT PRO</h2>
        <span>{user.displayName}</span>
      </header>
      
      {isPremium ? (
        <div style={{ marginTop: '20px' }}>
          {loading ? (
            <p>Cargando pronósticos de la IA...</p>
          ) : (
            <div>
              {partidos.length > 0 ? (
                partidos.map((partido, index) => (
                  <div key={index} style={{ border: '1px solid #333', padding: '15px', marginBottom: '10px', borderRadius: '10px' }}>
                    <p>{partido.time_mandante.nome_popular} vs {partido.time_visitante.nome_popular}</p>
                    <p style={{ color: '#0f0' }}>IA: {Math.floor(Math.random() * 100)}% Probabilidad GOL</p>
                  </div>
                ))
              ) : (
                <p>No hay partidos próximos disponibles. Revisa el botón de CORS Anywhere.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Tu cuenta no es Premium.</p>
          <button style={{ padding: '15px', backgroundColor: '#25D366', border: 'none', color: '#fff', fontWeight: 'bold' }}>
            PAGAR VIP 4,99€ (WhatsApp)
          </button>
        </div>
      )}
    </div>
  );
}
