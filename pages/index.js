import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function AlphaOmegaCombinadas() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [liga, setLiga] = useState('PD');
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState(10);
  const [ticket, setTicket] = useState([]); // Estado para la combinada

  const API_KEY = "TU_API_KEY_AQUÍ";

  const generarDataIA = (m) => {
    const pLocal = Math.floor(Math.random() * (60 - 40) + 40);
    const pEmpate = Math.floor(Math.random() * (25 - 15) + 15);
    const pVisit = 100 - pLocal - pEmpate;
    const marketOdd = (100 / (pLocal - 3)).toFixed(2);
    return {
      id: m.id,
      local: m.homeTeam.shortName || m.homeTeam.name,
      visitante: m.awayTeam.shortName || m.awayTeam.name,
      pLocal, pEmpate, pVisit, marketOdd,
    };
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
        if (vips.includes(u.email.toLowerCase())) setIsPremium(true);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.football-data.org/v4/competitions/${liga}/matches?status=SCHEDULED`, {
          headers: { 'X-Auth-Token': API_KEY }
        });
        const data = await res.json();
        if (data.matches) setPartidos(data.matches.slice(0, 10).map(generarDataIA));
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [liga]);

  // Lógica del Ticket
  const toggleSelection = (p) => {
    if (ticket.find(item => item.id === p.id)) {
      setTicket(ticket.filter(item => item.id !== p.id));
    } else {
      setTicket([...ticket, p]);
    }
  };

  const cuotaTotal = ticket.reduce((acc, item) => acc * item.marketOdd, 1).toFixed(2);
  const beneficioCombinada = (betAmount * cuotaTotal).toFixed(2);

  if (loading && !partidos.length) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>CARGANDO TERMINAL...</div>;

  return (
    <div style={{background: '#050505', color:'#fff', minHeight:'100vh', fontFamily:'Inter, sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'180px'}}>
      
      <header style={{padding:'25px', textAlign:'center', borderBottom:'1px solid #111'}}>
        <h1 style={{margin:0, fontSize:'1.4rem', fontWeight:'900'}}>ALPHA <span style={{color:'#fbbf24'}}>OMEGA</span></h1>
        <p style={{fontSize:'0.5rem', color:'#444', letterSpacing:'2px'}}>COMBINADAS MODE ACTIVE</p>
      </header>

      {/* SELECTOR LIGAS */}
      <div style={{display:'flex', gap:'5px', padding:'10px', overflowX:'auto'}}>
        {[ {id:'PD', n:'ESP'}, {id:'PL', n:'ENG'}, {id:'BL1', n:'GER'}, {id:'CL', n:'UCL'} ].map(l => (
          <button key={l.id} onClick={() => setLiga(l.id)} style={{flex:1, minWidth:'80px', padding:'12px', borderRadius:'10px', border:'none', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#444', fontWeight:'900', fontSize:'0.6rem'}}>
            {l.n}
          </button>
        ))}
      </div>

      {user && isPremium ? (
        <div style={{padding:'15px'}}>
          {partidos.map(p => {
            const isSelected = ticket.find(item => item.id === p.id);
            return (
              <div key={p.id} style={{background:'#080808', border: isSelected ? '1px solid #fbbf24' : '1px solid #151515', padding:'20px', borderRadius:'25px', marginBottom:'15px', transition:'0.3s'}}>
                <div style={{textAlign:'center', fontWeight:'bold', fontSize:'0.9rem', marginBottom:'15px'}}>{p.local} v {p.visitante}</div>
                
                <div style={{display:'flex', height:'12px', background:'#111', borderRadius:'10px', overflow:'hidden', marginBottom:'15px'}}>
                  <div style={{width:`${p.pLocal}%`, background:'#fbbf24'}} />
                  <div style={{width:`${p.pEmpate}%`, background:'#333'}} />
                  <div style={{width:`${p.pVisit}%`, background:'#1a1a1a'}} />
                </div>

                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{fontSize:'0.8rem', fontWeight:'900', color:'#fbbf24'}}>@{p.marketOdd}</span>
                  <button 
                    onClick={() => toggleSelection(p)}
                    style={{padding:'8px 15px', borderRadius:'10px', border:'none', background: isSelected ? '#ff4444' : '#fbbf24', color:'#000', fontWeight:'bold', fontSize:'0.6rem', cursor:'pointer'}}
                  >
                    {isSelected ? 'QUITAR' : 'AÑADIR AL TICKET'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{padding:'100px 40px', textAlign:'center'}}>
          <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px', width:'100%', background:'#fbbf24', border:'none', borderRadius:'15px', fontWeight:'900'}}>LOG IN VIP</button>
        </div>
      )}

      {/* --- PANEL FLOTANTE DE TICKET (RESUMEN COMBINADA) --- */}
      {ticket.length > 0 && (
        <div style={{position:'fixed', bottom:'20px', left:'50%', transform:'translateX(-50%)', width:'90%', maxWidth:'400px', background:'#fbbf24', color:'#000', borderRadius:'25px', padding:'20px', boxShadow:'0 10px 40px rgba(0,0,0,0.5)', zIndex:1000}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
            <span style={{fontSize:'0.7rem', fontWeight:'900'}}>COMBINADA ({ticket.length} SELECCIONES)</span>
            <span style={{fontSize:'0.6rem', cursor:'pointer'}} onClick={() => setTicket([])}>LIMPIAR</span>
          </div>
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
            <div>
              <div style={{fontSize:'0.5rem', opacity:0.7}}>CUOTA TOTAL</div>
              <div style={{fontSize:'1.4rem', fontWeight:'900'}}>@{cuotaTotal}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'0.5rem', opacity:0.7}}>INVERSIÓN</div>
              <input 
                type="number" 
                value={betAmount} 
                onChange={(e) => setBetAmount(e.target.value)}
                style={{width:'60px', background:'transparent', border:'none', borderBottom:'2px solid #000', fontWeight:'900', fontSize:'1rem', textAlign:'right'}}
              />
            </div>
          </div>

          <button style={{width:'100%', padding:'15px', background:'#000', color:'#fbbf24', border:'none', borderRadius:'15px', fontWeight:'900', fontSize:'0.8rem'}}>
            GANANCIA TOTAL: ${beneficioCombinada}
          </button>
        </div>
      )}
    </div>
  );
}

            
                                           
            
                                
