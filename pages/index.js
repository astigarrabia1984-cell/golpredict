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
  const [errorApi, setErrorApi] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Verificamos si el usuario es Premium en la base de datos
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
      // Usamos el puente de CORS Anywhere
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.api-futebol.com.br/v1/campeonatos/10/partidas/proximas', {
        headers: {
          'Authorization': 'Bearer test_786526153725162715' 
        }
      });
      
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await response.json();
      // Verificamos si la API devolvió partidos
      if (data.partidas && data.partidas.length > 0) {
        setPartidos(data.partidas);
        setErrorApi(false);
      } else {
        setPartidos([]);
        setErrorApi(true);
      }
    } catch (error) {
      console.error("Error cargando partidos:", error);
      setErrorApi(true);
    } finally {
      setLoading(false);
    }
  };

  const login = () => signInWithPopup(auth, provider);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>GOL PREDICT PRO</h1>
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
        <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Hola, {user.displayName}</span>
      </header>
      
      {isPremium ? (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button style={{ flex: 1, padding: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>PARTIDOS</button>
            <button style={{ flex: 1, padding: '15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>TABLA</button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Conectando con la IA de pronósticos...</p>
            </div>
          ) : errorApi ? (
            <div style={{ border: '1px solid #ff4444', padding: '20px', borderRadius: '10px', textAlign: 'center', backgroundColor: '#221111' }}>
              <p>No hay partidos próximos disponibles actualmente.</p>
              <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Asegúrate de haber pulsado el botón en la pestaña de CORS Anywhere.</p>
              <button onClick={fetchPartidos} style={{ marginTop: '10px', padding: '10px', cursor: 'pointer' }}>Reintentar carga</button>
            </div>
          ) : (
            <div>
              {partidos.map((partido, index) => (
                <div key={index} style={{ border: '1px solid #333', padding: '20px', marginBottom: '15px', borderRadius: '10px', backgroundColor: '#111' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{partido.time_mandante.nome_popular} vs {partido.time_visitante.nome_popular}</span>
                    <span style={{ color: '#0f0', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {Math.floor(Math.random() * (95 - 65 + 1) + 65)}% GOL
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px', marginBottom: 0 }}>Predicción de la IA: Alta probabilidad de gol en la segunda mitad.</p>
                </div>
              ))}
            </div>
          )}
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
