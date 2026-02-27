import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
  const [ligaActiva, setLigaActiva] = useState('LALIGA');
  const [vista, setVista] = useState('PARTIDOS'); // Nueva opción para alternar entre Partidos y Tabla

  const ligas = [
    { id: 'LALIGA', nombre: '1ª España', equipos: ['Real Madrid', 'Barcelona', 'Atlético', 'Girona'] },
    { id: 'LALIGA2', nombre: '2ª España', equipos: ['Almería', 'Granada', 'Cádiz', 'Levante'] },
    { id: 'PREMIER', nombre: 'Premier', equipos: ['Man. City', 'Liverpool', 'Arsenal', 'Chelsea'] },
    { id: 'SERIEA', nombre: 'Serie A', equipos: ['Inter', 'Juventus', 'Milan', 'Napoli'] },
    { id: 'BUNDES', nombre: 'Bundesliga', equipos: ['Bayern', 'Dortmund', 'Leverkusen', 'Leipzig'] }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "usuarios", currentUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().esPremium) {
          setIsPremium(true);
          cambiarLiga('LALIGA');
        } else { setLoading(false); }
      } else { setUser(null); setIsPremium(false); setLoading(false); }
    });
    return () => unsubscribe();
  }, []);

  const cambiarLiga = (id) => {
    setLigaActiva(id);
    setLoading(true);
    setTimeout(() => {
      const liga = ligas.find(l => l.id === id);
      const nuevosPartidos = [
        { mandante: liga.equipos[0], visitante: liga.equipos[1] },
        { mandante: liga.equipos[2], visitante: liga.equipos[3] }
      ];
      setPartidos(nuevosPartidos);
      setLoading(false);
    }, 600);
  };

  const obtenerAnalisisIA = (m, v) => {
    const rand = Math.random();
    let ganador, score;
    if (rand > 0.6) { ganador = `Gana ${m}`; score = `${Math.floor(Math.random() * 2) + 1}-${Math.floor(Math.random() * 2)}`; }
    else if (rand > 0.3) { ganador = `Gana ${v}`; score = `${Math.floor(Math.random() * 2)}-${Math.floor(Math.random() * 2) + 1}`; }
    else { ganador = "Empate"; const g = Math.floor(Math.random() * 2); score = `${g}-${g}`; }
    return { ganador, score };
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ letterSpacing: '2px' }}>GOL PREDICT PRO</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{ padding: '15px 30px', cursor: 'pointer', margin: 'auto', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}>ENTRAR CON GOOGLE</button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: '#fbbf24' }}>GOL PREDICT PRO</h2>
        <p style={{ fontSize: '0.8rem', margin: '5px 0' }}>Hola, {user.displayName}</p>
      </header>

      {isPremium ? (
        <div>
          {/* SELECCIÓN DE LIGAS (Ahora en cuadrícula para que se vea siempre) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {ligas.map((l) => (
              <button key={l.id} onClick={() => cambiarLiga(l.id)} style={{ padding: '10px 5px', backgroundColor: ligaActiva === l.id ? '#fbbf24' : '#222', color: ligaActiva === l.id ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer' }}>
                {l.nombre}
              </button>
            ))}
          </div>

          {/* BOTONES DE VISTA (PARTIDOS / TABLA) */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button onClick={() => setVista('PARTIDOS')} style={{ flex: 1, padding: '12px', backgroundColor: vista === 'PARTIDOS' ? '#444' : '#222', color: '#fff', border: '1px solid #555', borderRadius: '5px', fontWeight: 'bold' }}>PARTIDOS</button>
            <button onClick={() => setVista('TABLA')} style={{ flex: 1, padding: '12px', backgroundColor: vista === 'TABLA' ? '#444' : '#222', color: '#fff', border: '1px solid #555', borderRadius: '5px', fontWeight: 'bold' }}>TABLA</button>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', marginTop: '30px' }}>Actualizando datos de {ligaActiva}...</p>
          ) : vista === 'PARTIDOS' ? (
            <div>
              {partidos.map((p, i) => {
                const analisis = obtenerAnalisisIA(p.mandante, p.visitante);
                return (
                  <div key={i} style={{ border: '1px solid #333', padding: '15px', marginBottom: '15px', borderRadius: '12px', backgroundColor: '#111' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <span style={{ fontWeight: 'bold' }}>{p.mandante} vs {p.visitante}</span>
                      <span style={{ color: '#0f0', fontWeight: 'bold' }}>{Math.floor(Math.random() * (94 - 78) + 78)}% GOL</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                        <p style={{ fontSize: '0.65rem', color: '#888', margin: '0 0 5px 0' }}>GANADOR PROBABLE</p>
                        <p style={{ margin: 0, color: '#fbbf24', fontWeight: 'bold', fontSize: '0.9rem' }}>{analisis.ganador}</p>
                      </div>
                      <div style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '8px', border: '1px solid #222' }}>
                        <p style={{ fontSize: '0.65rem', color: '#888', margin: '0 0 5px 0' }}>MARCADOR EXACTO</p>
                        <p style={{ margin: 0, color: '#fbbf24', fontWeight: 'bold', fontSize: '1rem' }}>{analisis.score}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #333' }}>
              <h4 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>Clasificación {ligaActiva}</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333', color: '#888' }}>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Pos</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>Equipo</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {ligas.find(l => l.id === ligaActiva).equipos.map((equipo, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '10px' }}>{index + 1}</td>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{equipo}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>{20 - (index * 3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <p>Activa tu suscripción para ver todas las ligas y tablas.</p>
          <button style={{ padding: '15px 25px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>SUSCRIBIRSE AL VIP</button>
        </div>
      )}
    </div>
  );
}
