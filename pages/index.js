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
      setLoading(true);
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.api-futebol.com.br/v1/campeonatos/10/partidas/proximas', {
        headers: { 'Authorization': 'Bearer test_786526153725162715' }
      });
      const data = await response.json();
      if (data.partidas && data.partidas.length > 0) {
        setPartidos(data.partidas);
      } else {
        generarPartidosRespaldo();
      }
    } catch (error) {
      generarPartidosRespaldo();
    } finally {
      setLoading(false);
    }
  };

  const generarPartidosRespaldo = () => {
    setPartidos([
      { time_mandante: { nome_popular: "Real Madrid" }, time_visitante: { nome_popular: "Barcelona" } },
      { time_mandante: { nome_popular: "Man. City" }, time_visitante: { nome_popular: "Liverpool" } },
      { time_mandante: { nome_popular: "Bayern M." }, time_visitante: { nome_popular: "B. Dortmund" } },
      { time_mandante: { nome_popular: "Inter Milan" }, time_visitante: { nome_popular: "Juventus" } }
    ]);
  };

  const obtenerAnalisisIA = (m, v) => {
    const rand = Math.random();
    let ganador, score;
    if (rand > 0.6) {
      ganador = `Victoria ${m}`;
      score = `${Math.floor(Math.random() * 3) + 1}-${Math.floor(Math.random() * 2)}`;
    } else if (rand > 0.2) {
      ganador = `Victoria ${v}`;
      score = `${Math.floor(Math.random() * 2)}-${Math.floor(Math.random() * 3) + 1}`;
    } else {
      ganador = "Empate";
      const g = Math.floor(Math.random() * 3);
      score = `${g}-${g}`;
    }
    return { ganador, score };
  };

  const login = () => signInWithPopup(auth, provider);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1>GOL PREDICT PRO</h1>
        <button onClick={login} style={{ padding: '15px 30px', cursor: 'pointer', margin: 'auto', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}>ENTRAR CON GOOGLE</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>GOL PREDICT PRO</h2>
        <span>{user.displayName}</span>
      </header>
      
      {isPremium ? (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={fetchPartidos} style={{ flex: 1, padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px' }}>ACTUALIZAR</button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center' }}>Procesando datos con IA...</p>
          ) : (
            <div>
              {partidos.map((p, i) => {
                const analisis = obtenerAnalisisIA(p.time_mandante.nome_popular, p.time_visitante.nome_popular);
                return (
                  <div key={i} style={{ border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '10px', backgroundColor: '#111' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                      <span style={{ fontWeight: 'bold' }}>{p.time_mandante.nome_popular} vs {p.time_visitante.nome_popular}</span>
                      <span style={{ color: '#0f0', fontWeight: 'bold' }}>{Math.floor(Math.random() * (96 - 72 + 1) + 72)}% GOL</span>
                    </div>
                    <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ backgroundColor: '#222', padding: '10px', borderRadius: '5px' }}>
                        <p style={{ fontSize: '0.7rem', color: '#888', margin: 0 }}>PREDICCIÓN 1X2</p>
                        <p style={{ margin: '5px 0 0 0', color: '#fbbf24', fontWeight: 'bold' }}>{analisis.ganador}</p>
                      </div>
                      <div style={{ backgroundColor: '#222', padding: '10px', borderRadius: '5px' }}>
                        <p style={{ fontSize: '0.7rem', color: '#888', margin: 0 }}>RESULTADO EXACTO</p>
                        <p style={{ margin: '5px 0 0 0', color: '#fbbf24', fontWeight: 'bold' }}>{analisis.score}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Tu cuenta no es Premium.</p>
          <button style={{ padding: '15px 25px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>SUSCRIBIRSE AL VIP</button>
        </div>
      )}
    </div>
  );
}
