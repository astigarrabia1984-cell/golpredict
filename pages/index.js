  import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function GolPredict() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const miWhatsapp = "34600000000"; // Cambia por tu número real

  // DATOS DE LA JORNADA 27 ANALIZADOS POR IA (Inyectados directamente)
  const partidosJornada = [
    { local: "Celta de Vigo", visitante: "Real Madrid", fecha: "06.03. 21:00", prob: "98%", pron: "Gana Real Madrid", marc: "1-3", corn: "+9.5", goles: "+2.5" },
    { local: "Osasuna", visitante: "Mallorca", fecha: "07.03. 14:00", prob: "88%", pron: "Empate o Mallorca", marc: "1-1", corn: "+8.5", goles: "-2.5" },
    { local: "Valencia", visitante: "Valladolid", fecha: "07.03. 16:15", prob: "92%", pron: "Gana Valencia", marc: "2-0", corn: "+10.5", goles: "+1.5" },
    { local: "Espanyol", visitante: "Rayo Vallecano", fecha: "07.03. 18:30", prob: "85%", pron: "Empate", marc: "0-0", corn: "-9.5", goles: "-1.5" },
    { local: "Leganés", visitante: "Las Palmas", fecha: "07.03. 21:00", prob: "96%", pron: "Gana Leganés", marc: "1-0", corn: "+8.5", goles: "-2.5" }
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>CARGANDO JORNADA 27...</div>;

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <a href={`https://wa.me/${miWhatsapp}`} target="_blank" rel="noreferrer" style={{position:'fixed',bottom:'20px',right:'20px',background:'#25D366',width:'60px',height:'60px',borderRadius:'50%',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000,boxShadow:'0 4px 12px rgba(0,0,0,0.5)'}}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{width:'35px'}} />
      </a>

      <header style={{textAlign:'center',marginBottom:'30px',borderBottom:'1px solid #222',paddingBottom:'15px'}}>
        <h1 style={{color:'#fbbf24',margin:0,fontSize:'1.8rem',fontWeight:'900'}}>GOL PREDICT PRO</h1>
        <p style={{fontSize:'0.7rem',color:'#0f0',fontWeight:'bold'}}>IA PREMIUM: CÓRNERS + GOLES</p>
      </header>

      {user && isPremium ? (
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          {partidosJornada.map((p, i) => {
            const esValor = parseInt(p.prob) >= 95;
            return (
              <div key={i} style={{background:'#0a0a0a',border:esValor?'2px solid #ff8c00':'1px solid #333',padding:'20px',borderRadius:'25px',marginBottom:'20px',position:'relative'}}>
                {esValor && <div style={{position:'absolute',top:'-12px',right:'25px',background:'#ff8c00',color:'#000',padding:'3px 12px',borderRadius:'12px',fontSize:'0.6rem',fontWeight:'900'}}>VALOR IA</div>}
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'15px'}}>
                  <span style={{fontSize:'0.75rem',color:'#fbbf24'}}>{p.fecha}</span>
                  <div style={{background:'#0f0',color:'#000',padding:'4px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.7rem'}}>{p.prob} ACIERTO</div>
                </div>
                <div style={{textAlign:'center',fontSize:'1.2rem',fontWeight:'bold',marginBottom:'15px'}}>{p.local} vs {p.visitante}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                    <div style={{fontSize:'0.5rem',color:'#666'}}>GANADOR</div>
                    <div style={{color:'#fbbf24',fontWeight:'bold',fontSize:'0.9rem'}}>{p.pron}</div>
                  </div>
                  <div style={{background:'#151515',padding:'10px',borderRadius:'12px',textAlign:'center'}}>
                    <div style={{fontSize:'0.5rem',color:'#666'}}>MARCADOR</div>
                    <div style={{color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.marc}</div>
                  </div>
                  <div style={{background:'#1a1a1a',padding:'10px',borderRadius:'12px',textAlign:'center',border:'1px solid #222'}}>
                    <div style={{fontSize:'0.5rem',color:'#fbbf24'}}>CÓRNERS</div>
                    <div style={{fontWeight:'900'}}>{p.corn}</div>
                  </div>
                  <div style={{background:'#1a1a1a',padding:'10px',borderRadius:'12px',textAlign:'center',border:'1px solid #222'}}>
                    <div style={{fontSize:'0.5rem',color:'#fbbf24'}}>GOLES</div>
                    <div style={{fontWeight:'900'}}>{p.goles}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'50px',padding:'20px'}}>
          <div style={{fontSize:'3rem',marginBottom:'20px'}}>🔒</div>
          <h2 style={{color:'#fbbf24'}}>ACCESO VIP REQUERIDO</h2>
          <p style={{color:'#aaa',marginBottom:'30px'}}>Análisis de Córners y Goles para la Jornada 27 de Flashscore.</p>
          {!user ? (
            <button onClick={() => signInWithPopup(auth, provider)} style={{width:'100%',padding:'18px',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',cursor:'pointer'}}>ENTRAR CON GOOGLE</button>
          ) : (
            <button onClick={() => window.open(`https://wa.me/${miWhatsapp}`)} style={{width:'100%',padding:'18px',background:'#25D366',color:'#fff',border:'none',borderRadius:'15px',fontWeight:'bold',cursor:'pointer'}}>SOLICITAR PASE VIP</button>
          )}
        </div>
      )}
    </div>
  );
}         
                  
            
                                
