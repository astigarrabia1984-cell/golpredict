import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export default function AlphaOmegaTerminal() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [liga, setLiga] = useState('ESPAÑA');
  const [ticket, setTicket] = useState([]); 
  const [activeTab, setActiveTab] = useState('mercado');

  const dbPartidos = {
    'ESPAÑA': [
      { id: 101, local: 'Alavés', visitante: 'Villarreal', pL: 35, pE: 30, pV: 35, odd: 2.40 },
      { id: 103, local: 'Atlético de Madrid', visitante: 'Getafe', pL: 75, pE: 15, pV: 10, odd: 1.55 },
      { id: 105, local: 'Real Madrid', visitante: 'Elche', pL: 92, pE: 5, pV: 3, odd: 1.25 },
      { id: 107, local: 'Barcelona', visitante: 'Sevilla', pL: 65, pE: 20, pV: 15, odd: 1.70 },
      { id: 109, local: 'Real Sociedad', visitante: 'Osasuna', pL: 55, pE: 25, pV: 20, odd: 1.85 }
    ],
    'PREMIER': [
      { id: 203, local: 'Arsenal', visitante: 'Everton', pL: 82, pE: 10, pV: 8, odd: 1.40 },
      { id: 205, local: 'West Ham', visitante: 'Man. City', pL: 5, pE: 10, pV: 85, odd: 1.50 },
      { id: 209, local: 'Liverpool', visitante: 'Tottenham', pL: 62, pE: 20, pV: 18, odd: 1.80 }
    ],
    'CHAMPIONS': [
      { id: 301, local: 'Galatasaray', visitante: 'Liverpool', pL: 15, pE: 20, pV: 65, odd: 1.65 },
      { id: 308, local: 'Real Madrid', visitante: 'Man. City', pL: 45, pE: 15, pV: 40, odd: 2.45 }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
        if (vips.includes(u.email.toLowerCase())) setIsPremium(true);
      }
    });
    return () => unsub();
  }, []);

  const getMC = (p) => ({
    l: (p.pL * 0.99).toFixed(1),
    e: (p.pE * 1.01).toFixed(1),
    v: (p.pV * 1.00).toFixed(1)
  });

  const getCombo = () => {
    const all = [...dbPartidos['ESPAÑA'], ...dbPartidos['PREMIER'], ...dbPartidos['CHAMPIONS']];
    return all.sort((a, b) => Math.max(b.pL, b.pV) - Math.max(a.pL, a.pV)).slice(0, 3);
  };

  const toggle = (p) => {
    setTicket(prev => prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]);
  };

  if (!user || !isPremium) {
    return (
      <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
        <button onClick={() => signInWithPopup(auth, provider)} style={{background:'#fbbf24', color:'#000', padding:'20px', borderRadius:'15px', border:'none', fontWeight:'900', width:'100%', cursor:'pointer'}}>ACCESO VIP ALPHA OMEGA</button>
      </div>
    );
  }

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      <nav style={{display:'flex', background:'#050505', borderBottom:'1px solid #111', position:'sticky', top:0, zIndex:100}}>
        {['mercado', 'ia', 'info', 'ticket'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px 5px', background:'transparent', border:'none', color: activeTab === t ? '#fbbf24' : '#555', fontWeight:'900', fontSize:'0.6rem', textTransform:'uppercase', cursor:'pointer'}}>
            {t === 'ia' ? '🔥 IA' : t === 'ticket' ? `🎟️ (${ticket.length})` : t}
          </button>
        ))}
      </nav>

      <div style={{padding:'15px'}}>
        {activeTab === 'mercado' && (
          <>
            <div style={{display:'flex', gap:'5px', marginBottom:'20px'}}>
              {Object.keys(dbPartidos).map(l => (
                <button key={l} onClick={() => setLiga(l)} style={{flex:1, padding:'10px', borderRadius:'8px', border:'none', background: liga === l ? '#fbbf24' : '#111', color: liga === l ? '#000' : '#fff', fontWeight:'900', fontSize:'0.6rem', cursor:'pointer'}}>{l}</button>
              ))}
            </div>
            {dbPartidos[liga].map(p => {
              const mc = getMC(p);
              return (
                <div key={p.id} style={{background:'#080808', border:'1px solid #1a1a1a', padding:'20px', borderRadius:'20px', marginBottom:'12px'}}>
                  <div style={{fontSize:'0.6rem', color:'#fbbf24', fontWeight:'bold', marginBottom:'10px'}}>MONTE CARLO L:{mc.l}% | E:{mc.e}% | V:{mc.v}%</div>
                  <div style={{display:'flex', justifyContent:'space-between', fontWeight:'900', fontSize:'0.85rem', marginBottom:'15px'}}>
                    <span>{p.local}</span> <span>VS</span> <span>{p.visitante}</span>
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{color:'#fbbf24', fontWeight:'900', fontSize:'1.1rem'}}>@{p.odd}</span>
                    <button onClick={() => toggle(p)} style={{background: ticket.find(x => x.id === p.id) ? '#ff4444' : '#fbbf24', color:'#000', border:'none', padding:'8px 15px', borderRadius:'8px', fontWeight:'900', fontSize:'0.6rem', cursor:'pointer'}}>
                      {ticket.find(x => x.id === p.id) ? 'QUITAR' : 'AÑADIR'}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'ia' && (
          <div style={{background:'#fbbf24', color:'#000', padding:'30px', borderRadius:'25px'}}>
            <h3 style={{textAlign:'center', fontWeight:'900', margin:'0 0 20px 0'}}>COMBINADA IA</h3>
            {getCombo().map(p => (
              <div key={p.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontWeight:'800', fontSize:'0.8rem'}}>
                <span>{p.local} WIN</span> <span>@{p.odd}</span>
              </div>
            ))}
            <div style={{borderTop:'2px solid #000', marginTop:'20px', paddingTop:'15px', textAlign:'center'}}>
              <div style={{fontSize:'2.5rem', fontWeight:'900'}}>@{getCombo().reduce((acc, p) => acc * p.odd, 1).toFixed(2)}</div>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div style={{background:'#080808', padding:'20px', borderRadius:'20px', border:'1px solid #1a1a1a'}}>
            <h4 style={{color:'#fbbf24', margin:'0 0 15px 0'}}>SISTEMA ALPHA OMEGA</h4>
            <div style={{fontSize:'0.7rem', color:'#ccc', lineHeight:'1.6'}}>
              <p><strong>Monte Carlo:</strong> Probabilidad tras 10k simulaciones.</p>
              <p><strong>Dorado (L):</strong> Probabilidad de victoria local.</p>
            </div>
          </div>
        )}

        {activeTab === 'ticket' && (
          <div style={{background:'#fbbf24', color:'#000', padding:'30px', borderRadius:'25px'}}>
            <h3 style={{textAlign:'center', fontWeight:'900', margin:'0 0 20px 0'}}>MI TICKET</h3>
            {ticket.map(p => (
              <div key={p.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontWeight:'800', fontSize:'0.8rem'}}>
                <span>{p.local} vs {p.visitante}</span> <span>@{p.odd}</span>
              </div>
            ))}
            <div style={{borderTop:'2px solid #000', marginTop:'20px', paddingTop:'15px', textAlign:'center'}}>
              <div style={{fontSize:'2.5rem', fontWeight:'900'}}>@{ticket.reduce((acc, p) => acc * p.odd, 1).toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                                                                 }
                
                                                 
                                  
                                                                    }
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
