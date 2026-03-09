   import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function GolPredictUltimate() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [hackerMode, setHackerMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // LISTA VIP FUNDADORES
  const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  // PARTIDOS DE PRUEBA (Para que veas la calculadora SIEMPRE)
  const [partidos] = useState([
    { id: 1, local: "Real Madrid", visitante: "FC Barcelona", prob: 88.5, marketOdd: 2.10, stake: 9, heatmap: [40, 60, 80, 95, 70, 50, 90, 100, 85, 60] },
    { id: 2, local: "Man. City", visitante: "Arsenal", prob: 82.1, marketOdd: 1.85, stake: 7, heatmap: [30, 50, 75, 80, 60, 40, 70, 90, 80, 55] }
  ]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const email = u.email.toLowerCase().trim();
        if (vips.includes(email)) {
          setIsPremium(true); // DESBLOQUEO TOTAL VIP
        }
      }
      setLoading(false);
    });
  }, []);

  const theme = hackerMode ? '#0f0' : '#fbbf24';

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'monospace'}}>CONECTANDO AL SATÉLITE...</div>;

  return (
    <div style={{background: hackerMode ? '#000' : '#050505', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      
      {/* HEADER INTERACTIVO */}
      <div onClick={() => window.open('https://wa.me/34680852029')} style={{background: theme, color:'#000', padding:'12px', textAlign:'center', fontSize:'0.7rem', fontWeight:'900', cursor:'pointer'}}>
        🚀 CONTACTO VIP: +34 680 85 20 29
      </div>

      <header style={{padding:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #111'}}>
        <h1 style={{margin:0, fontSize:'1.2rem', fontWeight:'900'}}>ALPHA <span style={{color: theme}}>OMEGA</span></h1>
        <button onClick={() => setHackerMode(!hackerMode)} style={{background:'#111', border:`1px solid ${theme}`, color: theme, borderRadius:'15px', padding:'5px 10px', fontSize:'0.6rem', fontWeight:'bold'}}>
          {hackerMode ? 'MODO LUXURY' : 'MODO HACKER'}
        </button>
      </header>

      {user && isPremium ? (
        <div style={{padding:'20px'}}>
          
          {/* CALCULADORA DE BANKROLL */}
          <div style={{background:'#0a0a0a', padding:'20px', borderRadius:'20px', border:'1px solid #151515', marginBottom:'25px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
              <span style={{fontSize:'0.7rem', color:'#666'}}>TU UNIDAD DE STAKE:</span>
              <span style={{color: theme, fontWeight:'900'}}>${betAmount}</span>
            </div>
            <input 
              type="range" min="10" max="1000" step="10" 
              value={betAmount} 
              onChange={(e) => setBetAmount(e.target.value)} 
              style={{width:'100%', accentColor: theme}} 
            />
          </div>

          {/* LISTA DE PARTIDOS MEJORADA */}
          {partidos.map(p => {
            const inversion = (betAmount * (p.stake / 10)).toFixed(2);
            const neto = ((inversion * p.marketOdd) - inversion).toFixed(2);

            return (
              <div key={p.id} style={{background:'#080808', border:'1px solid #1a1a1a', padding:'20px', borderRadius:'25px', marginBottom:'20px'}}>
                <div style={{fontSize:'0.6rem', color: theme, fontWeight:'bold', marginBottom:'10px'}}>VALUE BET DETECTADA ({p.prob}%)</div>
                <div style={{fontSize:'1rem', fontWeight:'900', textAlign:'center', marginBottom:'15px'}}>{p.local} v {p.visitante}</div>
                
                {/* MAPA DE CALOR */}
                <div style={{height:'35px', display:'flex', alignItems:'flex-end', gap:'3px', marginBottom:'20px', background:'#000', padding:'5px', borderRadius:'10px'}}>
                  {p.heatmap.map((h, i) => (
                    <div key={i} style={{flex:1, height:`${h}%`, background: h > 80 ? theme : '#222', borderRadius:'1px'}} />
                  ))}
                </div>

                {/* RESULTADOS CALCULADORA */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <div style={{background:'#111', padding:'10px', borderRadius:'15px', textAlign:'center'}}>
                    <div style={{fontSize:'0.5rem', color:'#444'}}>INVERSIÓN (S{p.stake})</div>
                    <div style={{fontSize:'1rem', fontWeight:'bold'}}>${inversion}</div>
                  </div>
                  <div style={{background:'#111', padding:'10px', borderRadius:'15px', textAlign:'center', border:`1px solid #0f02`}}>
                    <div style={{fontSize:'0.5rem', color:'#444'}}>GANANCIA NETO</div>
                    <div style={{fontSize:'1rem', fontWeight:'bold', color:'#0f0'}}>+${neto}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* PANTALLA DE BLOQUEO */
        <div style={{padding:'100px 40px', textAlign:'center'}}>
          <div style={{fontSize:'4rem', marginBottom:'20px'}}>🔐</div>
          <h2 style={{fontWeight:'900'}}>ACCESO VIP RESTRINGIDO</h2>
          <p style={{color:'#444', fontSize:'0.8rem', marginBottom:'30px'}}>
            Inicia sesión con tu cuenta de Fundador (**astigarrabia1984** o **vieirajuandavid9**) para activar el terminal.
          </p>
          <button 
            onClick={() => signInWithPopup(auth, provider)} 
            style={{width:'100%', padding:'18px', background: theme, color:'#000', border:'none', borderRadius:'15px', fontWeight:'900', cursor:'pointer'}}
          >
            ENTRAR CON GOOGLE
          </button>
        </div>
      )}
    </div>
  );
}               
            
                                           
            
                                
