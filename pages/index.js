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
  const [vista, setVista] = useState('PARTIDOS');

  const ligas = [
    { id: 'LALIGA', nombre: '1a Espana' },
    { id: 'LALIGA2', nombre: '2a Espana' },
    { id: 'PREMIER', nombre: 'Premier' },
    { id: 'SERIEA', nombre: 'Serie A' },
    { id: 'CHAMPIONS', nombre: 'Champions' }
  ];

  const baseDeDatosPartidos = {
    LALIGA: [
      { m: 'R. Sociedad', v: 'Real Madrid' },
      { m: 'Barcelona', v: 'Villarreal' },
      { m: 'Valencia', v: 'Atletico' },
      { m: 'Sevilla', v: 'Osasuna' }
    ],
    LALIGA2: [
      { m: 'Sporting', v: 'Zaragoza' },
      { m: 'Levante', v: 'Almeria' },
      { m: 'Racing', v: 'Eibar' },
      { m: 'Oviedo', v: 'Burgos' }
    ],
    PREMIER: [
      { m: 'Liverpool', v: 'Newcastle' },
      { m: 'Man. City', v: 'Brighton' },
      { m: 'Arsenal', v: 'Chelsea' },
      { m: 'Tottenham', v: 'Man. United' }
    ],
    SERIEA: [
      { m: 'Napoli', v: 'Inter Milan' },
      { m: 'Juventus', v: 'Lazio' },
      { m: 'Milan', v: 'Atalanta' },
      { m: 'Roma', v: 'Torino' }
    ],
    CHAMPIONS: [
      { m: 'Real Madrid', v: 'Man. City' },
      { m: 'Bayern M.', v: 'Arsenal' },
      { m: 'Barcelona', v: 'Liverpool' },
      { m: 'Inter Milan', v: 'PSG' }
    ]
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, 'usuarios', currentUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().esPremium) {
          setIsPremium(true);
          setPartidos(baseDeDatosPartidos['LALIGA']);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const cambiarLiga = (id) => {
    setLigaActiva(id);
    setLoading(true);
    setTimeout(() => {
      setPartidos(baseDeDatosPartidos[id] || []);
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#000', color: '#fbbf24', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
        <h3>CARGANDO JORNADA ACTUAL...</h3>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ letterSpacing: '4px', color: '#fbbf24' }}>GOL PREDICT PRO</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{ padding: '15px 30px', cursor: 'pointer', margin: 'auto', backgroundColor: '#fbbf24', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', fontSize: '1rem' }}>
          ENTRAR CON GOOGLE
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '15px', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: '#fbbf24', letterSpacing: '2px' }}>GOL PREDICT PRO</h2>
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Acceso VIP: {user.displayName}</p>
      </header>

      {isPremium ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {ligas.map((l) => (
              <button key={l.id} onClick={() => cambiarLiga(l.id)} style={{ padding: '12px 5px', backgroundColor: ligaActiva === l.id ? '#fbbf24' : '#1a1a1a', color: ligaActiva === l.id ? '#000' : '#fff', border: '1px solid #333', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.7rem', cursor: 'pointer' }}>
                {l.nombre}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <button onClick={() => setVista('PARTIDOS')} style={{ flex: 1, padding: '12px', backgroundColor: vista === 'PARTIDOS' ? '#333' : '#111', color: '#fff', border: '1px solid #444', borderRadius: '8px', fontWeight: 'bold' }}>PARTIDOS</button>
            <button onClick={() => setVista('TABLA')} style={{ flex: 1, padding: '12px', backgroundColor: vista === 'TABLA' ? '#333' : '#111', color: '#fff', border: '1px solid #444', borderRadius: '8px', fontWeight: 'bold' }}>TABLA</button>
          </div>

          {vista === 'PARTIDOS' ? (
            <div>
              {partidos.map((p, i) => (
                <div key={i} style={{ border: '1px solid #333', padding: '20px', marginBottom: '15px', borderRadius: '15px', backgroundColor: '#0a0a0a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>{p.m} vs {p.v}</span>
                    <div style={{ color: '#0f0', padding: '5px 12px', borderRadius: '6px', fontWeight: '900', fontSize: '0.9rem' }}>
                      95% GOL
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ backgroundColor: '#151515', padding: '12px', borderRadius: '10px', border: '1px solid #222' }}>
                      <p style={{ fontSize: '0.65rem', color: '#666', margin: '0 0 5px 0', fontWeight: 'bold' }}>PREDICCION 1X2</p>
                      <p style={{ margin: 0, color: '#fbbf24', fontWeight: 'bold' }}>Local o Empate</p>
                    </div>
                    <div style={{ backgroundColor: '#151515', padding: '12px', borderRadius: '10px', border: '1px solid #222' }}>
                      <p style={{ fontSize: '0.65rem', color: '#666', margin: '0 0 5px 0', fontWeight: 'bold' }}>MARCADOR IA</p>
                      <p style={{ margin: 0, color: '#fbbf24', fontWeight: 'bold', fontSize: '1.2rem' }}>2-1</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666', border: '1px dashed #333', borderRadius: '15px' }}>
              Sincronizando clasificacion...
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>🔒</div>
          <p style={{ color: '#aaa', fontSize: '1.1rem', marginBottom: '30px' }}>Acceso restringido. Compra tu pase VIP para ver la jornada de Marzo.</p>
          <button style={{ width: '100%', padding: '20px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            ACTIVAR ACCESO VIP
          </button>
        </div>
      )}
    </div>
  );
}
