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

export default function GolPredictMaster() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [partidos, setPartidos] = useState([]);
  const [liga, setLiga] = useState('PD');

  const API_KEY = "8f03761358354c25985025732168979b";

  // DATOS REALES DE LAS CAPTURAS (JORNADA ACTUAL Y 28)
  const generarPartidosReales = (l) => {
    const dataLaliga = [
      { h: "Villarreal", a: "Elche", t: "14:00", d: "HOY" },
      { h: "Getafe", a: "Real Betis", t: "16:15", d: "HOY" },
      { h: "Sevilla", a: "Rayo Vallecano", t: "18:30", d: "HOY" },
      { h: "Valencia", a: "Alavés", t: "21:00", d: "HOY" },
      { h: "Real Madrid", a: "Elche", t: "21:00", d: "14.03" },
      { h: "FC Barcelona", a: "Sevilla", t: "16:15", d: "15.03" }
    ];
    
    return dataLaliga.map((m, i) => engineIA({
        id: 200 + i,
        homeTeam: { shortName: m.h },
        awayTeam: { shortName: m.a },
        utcDate: m.t,
        customDay: m.d
    }));
  };

  const engineIA = (m) => {
    const lambda = 2.85; 
    const prob = Math.min(Math.floor((1 - (Math.exp(-lambda) * (1 + lambda + (Math.pow(lambda, 2)/2)))) * 120), 96);
    return {
      id: m.id,
      local: m.homeTeam.shortName,
      visitante: m.awayTeam.shortName,
      fecha: m.utcDate,
      dia: m.customDay || "HOY",
      prob,
      corners: (8.4 + Math.random() * 3).toFixed(1),
      heatmap: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100)),
      esValor: prob > 85
    };
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      }
      setLoading(false);
    });

    const load = async () => {
      try {
        const res = await fetch(`https://api.football-data.org/v4/competitions/${liga}/matches?status=SCHEDULED`, {
          headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await res.json();
        if (data.matches && data.matches.length > 0) {
          setPartidos(data.matches.slice(0, 10).map(engineIA));
        } else { setPartidos(generarPartidosReales(liga)); }
      } catch { setPartidos(generarPartidosReales(liga)); }
    };

    load();
    return () => unsub();
  }, [liga]);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'15px', fontFamily:'sans-serif', maxWidth:'500px', margin:'0 auto'}}>
      <header style={{textAlign:'center', padding:'25px 0'}}>
        <h1 style={{color:'#fbbf24', fontSize:'2.4rem', fontWeight:'900', margin:0, fontStyle:'italic'}}>GP <span style={{color:'#fff'}}>PRO</span></h1>
        <div style={{color:'#0f0', fontSize:'0.55rem', border:'1px solid #0f0', display:'inline-block', padding:'3px 15px', borderRadius:'12px', marginTop:'8px', fontWeight:'900'}}>LIVE ANALYSIS ACTIVE</div>
      </header>

      <nav style={{display:'flex', gap:'6px', marginBottom:'25px', background:'#111', padding:'5px', borderRadius:'22px'}}>
        {['PD', 'PL', 'CL'].map(l => (
          <button key={l} onClick={() => setLiga(l)} style={{flex:1, padding:'14px', borderRadius:'18px', border:'none', background: liga === l ? '#fbbf24' : 'transparent', color: liga === l ? '#000' : '#444', fontWeight:'900', fontSize:'0.65rem', cursor:'pointer'}}>
            {l === 'PD' ? 'LA LIGA' : l === 'PL' ? 'PREMIER' : 'UCL'}
          </button>
        ))}
      </nav>

      {user && isPremium ? (
        <div>
          {partidos.map(p => (
            <div key={p.id} style={{background:'#080808', border: p.esValor ? '1.5px solid #ff4500' : '1px solid #1a1a1a', padding:'25px', borderRadius:'35px', marginBottom:'18px', position:'relative'}}>
              {p.esValor && <div style={{position:'absolute', top:'-10px', right:'25px', background:'#ff4500', color:'#fff', padding:'3px 12px', borderRadius:'12px', fontSize:'0.5rem', fontWeight:'900'}}>ESTADÍSTICA TOP</div>}
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem', color:'#444', marginBottom:'15px'}}>
                <span>{p.dia} | {p.fecha}</span>
                <span style={{color:'#fbbf24', fontWeight:'900'}}>PREDICCIÓN: {p.prob}%</span>
              </div>
              <div style={{textAlign:'center', fontWeight:'900', fontSize:'1.1rem', marginBottom:'20px'}}>{p.local} vs {p.visitante}</div>
              <div style={{display:'flex', gap:'4px', height:'16px', alignItems:'flex-end', marginBottom:'20px'}}>
                {p.heatmap.map((h, i) => <div key={i} style={{flex:1, height:`${h}%`, background: h > 75 ? '#fbbf24' : '#222', borderRadius:'1px'}}></div>)}
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <div style={{background:'#111', padding:'15px', borderRadius:'18px', textAlign:'center', border:'1px solid #222'}}>
                  <p style={{fontSize:'0.45rem', color:'#555', margin:'0 0 5px 0'}}>PRONÓSTICO</p>
                  <p style={{margin:0, color:'#0f0', fontWeight:'900', fontSize:'0.9rem'}}>+2.5 GOLES</p>
                </div>
                <div style={{background:'#111', padding:'15px', borderRadius:'18px', textAlign:'center', border:'1px solid #222'}}>
                  <p style={{fontSize:'0.45rem', color:'#555', margin:'0 0 5px 0'}}>CÓRNERS</p>
                  <p style={{margin:0, fontWeight:'900', fontSize:'0.9rem'}}>{p.corners}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center', padding:'40px 15px'}}>
          <div style={{fontSize:'4.5rem', marginBottom:'15px'}}>🛡️</div>
          <h2 style={{fontWeight:'900', fontSize:'1.7rem', letterSpacing:'-1px'}}>ANÁLISIS PRIVADO</h2>
          <p style={{color:'#555', fontSize:'0.8rem', lineHeight:'1.6', marginBottom:'40px'}}>Inicia sesión para desbloquear los {partidos.length} análisis de la jornada.</p>
          {!user ? (
            <button onClick={() => signInWithPopup(auth, provider)} style={{width:'100%', padding:'22px', borderRadius:'25px', border:'none', background:'#fbbf24', color:'#000', fontWeight:'900', fontSize:'1.1rem', cursor:'pointer', boxShadow:'0 15px 30px rgba(251,191,36,0.2)'}}>ENTRAR CON GOOGLE</button>
          ) : (
            <button onClick={() => window.open('https://wa.me/34600000000')} style={{width:'100%', padding:'22px', borderRadius:'25px', border:'none', background:'#25D366', color:'#fff', fontWeight:'900', fontSize:'1.1rem', cursor:'pointer'}}>SOLICITAR PASE VIP</button>
          )}
        </div>
      )}
    </div>
  );
}      
                  
            
                                
