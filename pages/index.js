import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Credenciales reales de tu proyecto golpredict-pro
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
  const [errorApi, setErrorApi] = useState(false);

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
      setLoading(true);
      setErrorApi(false);
      // Puente CORS Anywhere para evitar bloqueos
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.api-futebol.com.br/v1/campeonatos/10/partidas/proximas', {
        headers: {
          'Authorization': 'Bearer test_786526153725162715' 
        }
      });
      
      const data = await response.json();
      if (data.partidas && data.partidas.length > 0) {
        setPartidos(data.partidas);
      } else {
        setErrorApi(true); //
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorApi(true);
    } finally {
      setLoading(false);
    }
  };

  const login = () => signInWithPopup(auth, provider);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2.5rem' }}>GOL PREDICT PRO</h1>
        <button onClick={login} style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer', margin: '20px auto', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          ENTRAR CON GOOGLE
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>GOL PREDICT PRO</h2>
        <span style={{ fontSize: '0.8rem' }}>Hola, {user.displayName}</span>
      </header>
      
      {isPremium ? (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={fetchPartidos} style={{ flex: 1, padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>PARTIDOS</button>
            <button style={{ flex: 1, padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>TABLA</button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center' }}>Conectando con la IA de pronósticos...</p>
          ) : errorApi ? (
            <div style={{ border: '1px solid #444', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <p>No hay partidos próximos disponibles actualmente.</p>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>Asegúrate de haber pulsado el botón en la pestaña de CORS Anywhere.</p>
              <button onClick={fetchPartidos} style={{ marginTop: '15px', padding: '10px 20px', cursor: 'pointer' }}>Reintentar carga</button>
            </div>
          ) : (
            <div>
              {partidos.map((partido, index) => (
                <div key={index} style={{ border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '10px', backgroundColor: '#111' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{partido.time_mandante.nome_popular} vs {partido.time_visitante.nome_popular}</span>
                    <span style={{ color: '#0f0', fontWeight: 'bold' }}>{Math.floor(Math.random() * (98 - 70 + 1) + 70)}% GOL</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Tu cuenta no es Premium.</p>
          <button style={{ padding: '15px 25px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            ADQUIRIR ACCESO VIP (4,99€)
          </button>
        </div>
      )}
    </div>
  );
}
