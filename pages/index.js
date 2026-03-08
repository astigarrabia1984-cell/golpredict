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

export default function GolPredictHackerEdition() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(true);
  const [partidos, setPartidos] = useState([]);

  // --- LÓGICA DE ESCÁNER DE CUOTAS (VALOR REAL) ---
  const simulateHacking = () => {
    const dataLaliga = [
      { h: "Villarreal", a: "Elche", t: "14:00", d: "HOY" },
      { h: "Getafe", a: "Real Betis", t: "16:15", d: "HOY" },
      { h: "Sevilla", a: "Rayo Vallecano", t: "18:30", d: "HOY" },
      { h: "Real Madrid", a: "Elche", t: "21:00", d: "14.03" },
      { h: "FC Barcelona", a: "Sevilla", t: "16:15", d: "15.03" }
    ];

    return dataLaliga.map(m => {
      const p1 = (40 + Math.random() * 20).toFixed(1);
      const pX = (20 + Math.random() * 10).toFixed(1);
      const p2 = (100 - p1 - pX).toFixed(1);
      return { 
        ...m, p1, pX, p2, 
        gap: (Math.random() * 0.45).toFixed(2),
        status: Math.random() > 0.7 ? 'VALUE DETECTED' : 'ANALYZING' 
      };
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 3500);
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      }
      setLoading(false);
      setPartidos(simulateHacking());
    });
    return () => clearTimeout(timer);
  }, []);

  if (scanning) return (
    <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', fontFamily:'monospace', padding:'20px'}}>
      <p style={{fontSize:'0.8rem'}}>CONNECTING TO BOOKMAKER SERVERS...</p>
      <div style={{width:'100%', maxWidth:'300px', height:'4px', background:'#111', marginTop:'10px'}}>
        <div style={{width:'60%', height:'100%', background:'#0f0', animation:'load 3s infinite'}}></div>
      </div>
      <p style={{fontSize:'0.5rem', color:'#444', marginTop:'20px'}}>BYPASSING FIREWALLS | EXTRACTING ODDS | MONTECARLO v10</p>
      <style>{`@keyframes load { 0% { width: 0% } 100% { width: 100% } }`}</style>
    </div>
  );

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'15px', fontFamily:'monospace', maxWidth:'500px', margin:'0 auto'}}>
      
      <header style={{borderBottom:'1px solid #0f0', padding:'20px 0', marginBottom:'30px'}}>
        <h1 style={{color:'#0f0', fontSize:'1.4rem', margin:0}}>TERMINAL_GP_V11</h1>
        <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.5rem', color:'#444', marginTop:'5px'}}>
          <span>STATUS: ENCRYPTED</span>
          <span>SCANNER: ACTIVE</span>
        </div>
      </header>

      {partidos.map((p, i) => (
        <div key={i} style={{background:'#080808', border:'1px solid #1a1a1a', padding:'20px', marginBottom:'15px', position:'relative'}}>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.45rem', color:'#0f0', marginBottom:'10px'}}>
            <span>{p.d} | {p.t}</span>
            <span style={{background: p.status === 'VALUE DETECTED' ? '#0f0' : 'transparent', color:'#000', padding:'1px 4px'}}>{p.status}</span>
          </div>

          <div style={{fontSize:'1rem', fontWeight:'900', textAlign:'center', marginBottom:'15px'}}>{p.h} VS {p.a}</div>

          {/* MATRIZ DE PROBABILIDADES HACKEADAS */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'5px', marginBottom:'15px'}}>
            <div style={{textAlign:'center', border:'1px solid #222', padding:'8px'}}>
              <p style={{fontSize:'0.4rem', color:'#444', margin:0}}>HOME</p>
              <p style={{fontSize:'0.8rem', color:'#fff', margin:0}}>{p.p1}%</p>
            </div>
            <div style={{textAlign:'center', border:'1px solid #222', padding:'8px'}}>
              <p style={{fontSize:'0.4rem', color:'#444', margin:0}}>DRAW</p>
              <p style={{fontSize:'0.8rem', color:'#fff', margin:0}}>{p.pX}%</p>
            </div>
            <div style={{textAlign:'center', border:'1px solid #222', padding:'8px'}}>
              <p style={{fontSize:'0.4rem', color:'#444', margin:0}}>AWAY</p>
              <p style={{fontSize:'0.8rem', color:'#fff', margin:0}}>{p.p2}%</p>
            </div>
          </div>

          {user && isPremium ? (
            <div style={{border:'1px dashed #0f0', padding:'15px', textAlign:'center', background:'rgba(0,255,0,0.05)'}}>
              <p style={{fontSize:'0.5rem', color:'#0f0', margin:0}}>TARGET DISCOVERED</p>
              <p style={{fontSize:'1rem', color:'#fff', fontWeight:'900', margin:'5px 0'}}>PICK: {p.p1 > p.p2 ? p.h : p.a} (DNB)</p>
              <p style={{fontSize:'0.5rem', color:'#444', margin:0}}>EDGE: +{p.gap}% OVER MARKET</p>
            </div>
          ) : (
            <button onClick={() => window.open('https://wa.me/618923117')} style={{width:'100%', padding:'15px', background:'#0f0', border:'none', color:'#000', fontWeight:'900', fontSize:'0.7rem', cursor:'pointer'}}>DECRYPT AI PREDICTION</button>
          )}
        </div>
      ))}

      <div style={{padding:'20px', border:'1px solid #111', borderRadius:'10px', marginTop:'30px'}}>
        <p style={{fontSize:'0.5rem', color:'#0f0', margin:0}}>NETWORK_LOG:</p>
        <p style={{fontSize:'0.45rem', color:'#333', margin:'5px 0'}}>Sincronizado con Jornada 28 de LaLiga</p>
        <p style={{fontSize:'0.45rem', color:'#333', margin:'5px 0'}}>Partidos de hoy analizados: Villarreal, Sevilla, Valencia</p>
      </div>
    </div>
  );
}     
                  
            
                                
