import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
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
  const [liga, setLiga] = useState('LALIGA');

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      }
      setLoading(false);
    });

    // ESTO HACE QUE SE ACTUALICE SOLO CADA SEMANA
    const q = query(collection(db, 'partidos'), orderBy('fecha', 'asc'));
    const unsubPartidos = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPartidos(docs);
    });

    return () => { unsubAuth(); unsubPartidos(); };
  }, []);

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>SINCRONIZANDO JORNADA...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center'}}>
      <h1 style={{color:'#fbbf24'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',cursor:'pointer'}}>ACCESO VIP</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'30px'}}>
        <h2 style={{color:'#fbbf24',margin:0}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.7rem',color:'#0f0'}}>SISTEMA DE ACTUALIZACIÓN AUTOMÁTICA</p>
      </header>

      {isPremium ? (
        <div>
          {partidos.filter(p => p.liga === liga).map((p, i) => (
            <div key={i} style={{background:'#0a0a0a',border:'1px solid #333',padding:'18px',borderRadius:'20px',marginBottom:'15px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                <span style={{fontSize:'0.7rem',color:'#fbbf24'}}>{p.fecha}</span>
                <div style={{background:'#0f0',color:'#000',padding:'3px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.75rem'}}>{p.probabilidad} ACIERTO</div>
              </div>
              <div style={{textAlign:'center',fontSize:'1.1rem',fontWeight:'bold',marginBottom:'15px'}}>{p.local} vs {p.visitante}</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center',border:'1px solid #222'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>GANADOR/EMPATE</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold'}}>{p.pronostico}</p>
                </div>
                <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center',border:'1px solid #222'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>MARCADOR DIRECTO</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold'}}>{p.marcador}</p>
                </div>
              </div>
              <p style={{fontSize:'0.75rem',color:'#aaa',margin:0}}><b style={{color:'#fbbf24'}}>IA:</b> {p.analisis}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'50px'}}>🔒 Activa tu Pase VIP para ver la jornada.</div>
      )}
    </div>
  );
}
