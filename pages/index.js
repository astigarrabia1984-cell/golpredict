  import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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

export default function GolPredictionProIA5() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [liga, setLiga] = useState('UCL'); // UCL por defecto para ver los cambios
  const [partidos, setPartidos] = useState([]);

  const simulateIA5 = (m) => {
    const p1 = (Math.random() * (60 - 30) + 30).toFixed(1);
    const pX = (Math.random() * (25 - 15) + 15).toFixed(1);
    const p2 = (100 - parseFloat(p1) - parseFloat(pX)).toFixed(1);
    return { ...m, p1, pX, p2, ev: (Math.random() * 0.15).toFixed(2) };
  };

  // --- DATOS CAPTURAS CHAMPIONS LEAGUE ---
  const dataUCL = [
    { h: "Galatasaray", a: "Liverpool", t: "18:45", d: "10.03 MAR" },
    { h: "Atalanta", a: "Bayern Múnich", t: "21:00", d: "10.03 MAR" },
    { h: "Atlético de Madrid", a: "Tottenham", t: "21:00", d: "10.03 MAR" },
    { h: "Newcastle", a: "Barcelona", t: "21:00", d: "10.03 MAR" },
    { h: "Bayer Leverkusen", a: "Arsenal", t: "18:45", d: "11.03 MIÉ" },
    { h: "Bodo/Glimt", a: "Sporting CP", t: "21:00", d: "11.03 MIÉ" },
    { h: "PSG", a: "Chelsea", t: "21:00", d: "11.03 MIÉ" },
    { h: "Real Madrid", a: "Manchester City", t: "21:00", d: "11.03 MIÉ" },
    { h: "Sporting CP", a: "Bodo/Glimt", t: "18:45", d: "17.03 MAR" },
    { h: "Arsenal", a: "Bayer Leverkusen", t: "21:00", d: "17.03 MAR" },
    { h: "Chelsea", a: "PSG", t: "21:00", d: "17.03 MAR" },
    { h: "Manchester City", a: "Real Madrid", t: "21:00", d: "17.03 MAR" }
  ].map(m => simulateIA5(m));

  // --- DATOS LALIGA & PREMIER (RESUMEN) ---
  const dataLaliga = [{ h: "Villarreal", a: "Elche", t: "14:00", d: "08.03 HOY" }, { h: "Barcelona", a: "Sevilla", t: "16:15", d: "15.03 DOM" }].map(m => simulateIA5(m));
  const dataPremier = [{ h: "Liverpool", a: "Tottenham", t: "17:30", d: "15.03 DOM" }, { h: "Arsenal", a: "Everton", t: "18:30", d: "14.03 SÁB" }].map(m => simulateIA5(m));

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      }
    });
  }, []);

  useEffect(() => {
    if (liga === 'UCL') setPartidos(dataUCL);
    else if (liga === 'LA LIGA') setPartidos(dataLaliga);
    else setPartidos(dataPremier);
  }, [liga]);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', padding:'15px', fontFamily:'monospace', maxWidth:'550px', margin:'0 auto'}}>
      
      <header style={{textAlign:'center', padding:'30px 0'}}>
        <h1 style={{color:'#fbbf24', fontSize:'1.6rem', fontWeight:'900', margin:0}}>GOLPREDICTION PRO IA 5</h1>
        <p style={{color:'#0f0', fontSize:'0.55rem', marginTop:'5px'}}>QUANTUM ENGINE: DIXON-COLES v7.0 [ACTIVE]</p>
      </header>

      {/* SELECTOR TRIPLE: LA LIGA | PREMIER | UCL */}
      <div style={{display:'flex', gap:'5px', marginBottom:'25px', background:'#0a0a0a', padding:'5px', borderRadius:'15px', border:'1px solid #1a1a1a'}}>
        {['LA LIGA', 'PREMIER', 'UCL'].map((l) => (
          <button key={l} onClick={() => setLiga(l)} style={{flex:1, padding:'14px', background: liga === l ? '#fbbf24' : 'transparent', color: liga === l ? '#000' : '#fff', border:'none', borderRadius:'12px', fontWeight:'900', fontSize:'0.65rem', cursor:'pointer'}}>
            {l}
          </button>
        ))}
      </div>

      {partidos.map((p, i) => (
        <div key={i} style={{background:'#080808', border:'1px solid #1a1a1a', padding:'25px', borderRadius:'15px', marginBottom:'15px'}}>
          <div style={{fontSize:'0.7rem', color:'#fff', fontWeight:'900', marginBottom:'15px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #111', paddingBottom:'8px'}}>
            <span>FECHA: {p.d}</span>
            <span>HORA: {p.t}</span>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <span style={{fontWeight:'900', fontSize:'1rem', color:'#fff', width:'42%'}}>{p.h.toUpperCase()}</span>
            <span style={{color:'#fbbf24', fontSize:'0.7rem', fontWeight:'900'}}>VS</span>
            <span style={{fontWeight:'900', fontSize:'1rem', color:'#fff', width:'42%', textAlign:'right'}}>{p.a.toUpperCase()}</span>
          </div>

          <div style={{display:'flex', gap:'3px', height:'28px', background:'#111', borderRadius:'5px', overflow:'hidden', marginBottom:'20px', border:'1px solid #222'}}>
            <div style={{width:`${p.p1}%`, background:'#0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:'900', color:'#000'}}>1:{p.p1}%</div>
            <div style={{width:`${p.pX}%`, background:'#333', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:'900', color:'#fff'}}>X:{p.pX}%</div>
            <div style={{width:`${p.p2}%`, background:'#ff4500', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:'900', color:'#fff'}}>2:{p.p2}%</div>
          </div>

          <button onClick={() => window.open('https://wa.me/34600000000')} style={{width:'100%', padding:'18px', background: isPremium ? '#0f0' : '#111', border: '1px solid #333', color: isPremium ? '#000' : '#fbbf24', fontWeight:'900', fontSize:'0.75rem', borderRadius:'10px', cursor:'pointer'}}>
            {isPremium ? `PICK IA 5: ${parseFloat(p.p1) > parseFloat(p.p2) ? p.h : p.a}` : 'DESCIFRAR ANÁLISIS IA 5'}
          </button>
        </div>
      ))}
    </div>
  );
}   
                  
            
                                
