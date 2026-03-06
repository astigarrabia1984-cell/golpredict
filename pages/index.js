import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
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

// Evita errores de inicialización duplicada
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function GolPredict() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const miWhatsapp = "618923117"; 

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        try {
          const d = await getDoc(doc(db, 'usuarios', u.email));
          if (d.exists() && d.data().esPremium) setIsPremium(true);
        } catch (e) { console.error("Error suscripción:", e); }
      }
      setLoading(false);
    });

    const q = query(collection(db, 'partidos'), orderBy('fecha', 'asc'));
    const unsubPartidos = onSnapshot(q, (snap) => {
      setPartidos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error Firestore:", err));

    return () => { unsubAuth(); unsubPartidos(); };
  }, []);

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'sans-serif'}}>CARGANDO JORNADA...</div>;

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'30px'}}>
        <h1 style={{color:'#fbbf24',margin:0,fontSize:'1.8rem'}}>GOL PREDICT PRO</h1>
        <p style={{fontSize:'0.7rem',color:'#0f0',fontWeight:'bold'}}>SISTEMA IA FLASHSCORE</p>
      </header>

      {!user ? (
        <div style={{textAlign:'center',padding:'50px'}}>
          <button onClick={() => signInWithPopup(auth, provider)} style={{background:'#fbbf24',padding:'15px 30px',border:'none',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>ENTRAR CON GOOGLE</button>
        </div>
      ) : isPremium ? (
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          {partidos.length === 0 ? (
            <div style={{textAlign:'center',color:'#666',padding:'20px',border:'1px dashed #333',borderRadius:'15px'}}>
              Esperando datos de la Jornada 27...
            </div>
          ) : (
            partidos.map((p, i) => {
              const esValor = parseInt(p.probabilidad) >= 95;
              return (
                <div key={i} style={{background:'#0a0a0a',border:esValor?'2px solid #ff8c00':'1px solid #333',padding:'20px',borderRadius:'25px',marginBottom:'20px',position:'relative'}}>
                  {esValor && <div style={{position:'absolute',top:'-12px',right:'20px',background:'#ff8c00',color:'#000',padding:'3px 10px',borderRadius:'10px',fontSize:'0.6rem',fontWeight:'900'}}>VALOR IA</div>}
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'15px',fontSize:'0.75rem',color:'#fbbf24'}}>
                    <span>{p.fecha}</span>
                    <span style={{color:'#0f0'}}>{p.probabilidad} ACIERTO</span>
                  </div>
                  <div style={{textAlign:'center',fontSize:'1.2rem',fontWeight:'bold',marginBottom:'15px'}}>{p.local} vs {p.visitante}</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                    <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'0.5rem',color:'#666'}}>GANADOR</div>
                      <div style={{color:'#fbbf24',fontWeight:'bold'}}>{p.pronostico}</div>
                    </div>
                    <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'0.5rem',color:'#666'}}>MARCADOR</div>
                      <div style={{color:'#fbbf24',fontWeight:'bold'}}>{p.marcador}</div>
                    </div>
                    <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'0.5rem',color:'#666'}}>CÓRNERS</div>
                      <div style={{fontWeight:'bold'}}>{p.corners}</div>
                    </div>
                    <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                      <div style={{fontSize:'0.5rem',color:'#666'}}>GOLES</div>
                      <div style={{fontWeight:'bold'}}>{p.totalGoles}</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'50px'}}>
          <div style={{fontSize:'3rem'}}>🔒</div>
          <h2 style={{color:'#fbbf24'}}>PASE VIP REQUERIDO</h2>
          <button onClick={() => window.open(`https://wa.me/${miWhatsapp}`)} style={{background:'#25D366',color:'#fff',padding:'15px 30px',border:'none',borderRadius:'12px',fontWeight:'bold',marginTop:'20px'}}>HABLAR POR WHATSAPP</button>
        </div>
      )}
    </div>
  );
}            
                  
            
                                
