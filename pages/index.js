import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// Configuración de Firebase - Verificada y Estable
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

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      } else {
        setUser(null);
        setIsPremium(false);
      }
      setLoading(false);
    });

    // Escucha activa de la base de datos para actualización automática
    const q = query(collection(db, 'partidos'), orderBy('fecha', 'asc'));
    const unsubPartidos = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPartidos(docs);
    });

    return () => { unsubAuth(); unsubPartidos(); };
  }, []);

  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  if (loading) return (
    <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'sans-serif'}}>
      SINCRONIZANDO CON FLASHSCORE...
    </div>
  );

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',fontFamily:'sans-serif',padding:'20px'}}>
      <h1 style={{color:'#fbbf24',fontSize:'2.5rem',marginBottom:'10px'}}>GOL PREDICT PRO</h1>
      <p style={{color:'#888',marginBottom:'30px'}}>IA Analítica de Fútbol</p>
      <button onClick={login} style={{padding:'20px',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',fontSize:'1.1rem',cursor:'pointer',maxWidth:'400px',margin:'0 auto',width:'100%'}}>ENTRAR CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'30px',borderBottom:'1px solid #222',paddingBottom:'15px'}}>
        <div>
          <div style={{fontSize:'1.4rem',fontWeight:'900',color:'#fbbf24'}}>GOL PREDICT PRO</div>
          <div style={{fontSize:'0.65rem',color:'#0f0',fontWeight:'bold'}}>ACTUALIZACIÓN AUTOMÁTICA</div>
        </div>
        <button onClick={logout} style={{background:'transparent',border:'1px solid #444',color:'#fff',padding:'5px 10px',borderRadius:'8px',fontSize:'0.7rem'}}>SALIR</button>
      </header>

      {isPremium ? (
        <div>
          {partidos.length === 0 ? (
            <div style={{textAlign:'center',padding:'50px',color:'#666'}}>No hay partidos cargados. Usa el panel /admin para subirlos.</div>
          ) : (
            partidos.map((p, i) => (
              <div key={i} style={{background:'#0a0a0a',border:'1px solid #333',padding:'20px',borderRadius:'20px',marginBottom:'20px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'15px'}}>
                  <span style={{fontSize:'0.75rem',color:'#fbbf24',fontWeight:'bold'}}>{p.fecha}</span>
                  <div style={{background:'#0f0',color:'#000',padding:'4px 12px',borderRadius:'8px',fontWeight:'900',fontSize:'0.75rem'}}>{p.probabilidad} ACIERTO</div>
                </div>

                <div style={{textAlign:'center',marginBottom:'20px'}}>
                  <div style={{fontSize:'1.2rem',fontWeight:'bold'}}>{p.local} <span style={{color:'#444'}}>vs</span> {p.visitante}</div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  <div style={{background:'#151515',padding:'12px',borderRadius:'15px',textAlign:'center',border:'1px solid #222'}}>
                    <p style={{fontSize:'0.55rem',color:'#666',margin:'0 0 5px 0'}}>GANADOR / EMPATE</p>
                    <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.9rem'}}>{p.pronostico}</p>
                  </div>
                  <div style={{background:'#151515',padding:'12px',borderRadius:'12px',textAlign:'center',border:'1px solid #222'}}>
                    <p style={{fontSize:'0.55rem',color:'#666',margin:'0 0 5px 0'}}>MARCADOR DIRECTO</p>
                    <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.2rem'}}>{p.marcador}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'80px',padding:'20px'}}>
          <div style={{fontSize:'3rem',marginBottom:'20px'}}>🔒</div>
          <h2 style={{color:'#fbbf24'}}>ACCESO RESTRINGIDO</h2>
          <p style={{color:'#aaa',lineHeight:'1.6',marginBottom:'30px'}}>Tu cuenta no tiene activado el Pase VIP para la Jornada 27 de Flashscore.</p>
          <button style={{width:'100%',padding:'20px',background:'#25D366',color:'#fff',border:'none',borderRadius:'15px',fontWeight:'bold',fontSize:'1.2rem'}}>CONTACTAR SOPORTE VIP</button>
        </div>
      )}
    </div>
  );
}
