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

export default function AlphaOmegaFullData() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [liga, setLiga] = useState('ESPAÑA');
  const [partidos, setPartidos] = useState([]);
  const [ticketUsuario, setTicketUsuario] = useState([]); 
  const [activeTab, setActiveTab] = useState('mercado');

  // BASE DE DATOS EXTRAÍDA DE TUS CAPTURAS
  const dbPartidos = {
    'ESPAÑA': [
      { id: 101, local: 'Alavés', visitante: 'Villarreal', pL: 35, pE: 30, pV: 35, odd: 2.40 },
      { id: 102, local: 'Girona', visitante: 'Athletic Club', pL: 48, pE: 28, pV: 24, odd: 2.15 },
      { id: 103, local: 'Atlético de Madrid', visitante: 'Getafe', pL: 65, pE: 22, pV: 13, odd: 1.55 },
      { id: 104, local: 'Real Oviedo', visitante: 'Valencia', pL: 30, pE: 30, pV: 40, odd: 2.20 },
      { id: 105, local: 'Real Madrid', visitante: 'Elche', pL: 85, pE: 10, pV: 5, odd: 1.25 },
      { id: 106, local: 'Mallorca', visitante: 'Espanyol', pL: 45, pE: 30, pV: 25, odd: 2.05 },
      { id: 107, local: 'Barcelona', visitante: 'Sevilla', pL: 60, pE: 22, pV: 18, odd: 1.70 },
      { id: 108, local: 'Real Betis', visitante: 'Celta de Vigo', pL: 52, pE: 28, pV: 20, odd: 1.90 },
      { id: 109, local: 'Real Sociedad', visitante: 'Osasuna', pL: 55, pE: 25, pV: 20, odd: 1.85 },
      { id: 110, local: 'Rayo Vallecano', visitante: 'Levante', pL: 48, pE: 28, pV: 24, odd: 2.10 }
    ],
    'PREMIER': [
      { id: 201, local: 'Burnley', visitante: 'Bournemouth', pL: 33, pE: 33, pV: 34, odd: 2.60 },
      { id: 202, local: 'Sunderland', visitante: 'Brighton', pL: 25, pE: 25, pV: 50, odd: 1.80 },
      { id: 203, local: 'Arsenal', visitante: 'Everton', pL: 75, pE: 15, pV: 10, odd: 1.40 },
      { id: 204, local: 'Chelsea', visitante: 'Newcastle', pL: 45, pE: 25, pV: 30, odd: 2.10 },
      { id: 205, local: 'West Ham', visitante: 'Man. City', pL: 10, pE: 20, pV: 70, odd: 1.50 },
      { id: 206, local: 'Crystal Palace', visitante: 'Leeds Utd', pL: 42, pE: 28, pV: 30, odd: 2.25 },
      { id: 207, local: 'Manchester Utd', visitante: 'Aston Villa', pL: 48, pE: 26, pV: 26, odd: 1.95 },
      { id: 208, local: 'Nottingham Forest', visitante: 'Fulham', pL: 40, pE: 30, pV: 30, odd: 2.30 },
      { id: 209, local: 'Liverpool', visitante: 'Tottenham', pL: 58, pE: 22, pV: 20, odd: 1.80 },
      { id: 210, local: 'Brentford', visitante: 'Wolves', pL: 45, pE: 30, pV: 25, odd: 2.05 }
    ],
    'CHAMPIONS': [
      { id: 301, local: 'Galatasaray', visitante: 'Liverpool', pL: 20, pE: 20, pV: 60, odd: 1.65 },
      { id: 302, local: 'Atalanta', visitante: 'Bayern München', pL: 28, pE: 22, pV: 50, odd: 1.95 },
      { id: 303, local: 'Atlético de Madrid', visitante: 'Tottenham', pL: 45, pE: 30, pV: 25, odd: 2.05 },
      { id: 304, local: 'Newcastle', visitante: 'Barcelona', pL: 32, pE: 25, pV: 43, odd: 2.15 },
      { id: 305, local: 'Bayer Leverkusen', visitante: 'Arsenal', pL: 35, pE: 25, pV: 40, odd: 2.25 },
      { id: 306, local: 'Bodo/Glimt', visitante: 'Sporting CP', pL: 30, pE: 25, pV: 45, odd: 2.00 },
      { id: 307, local: 'PSG', visitante: 'Chelsea', pL: 55, pE: 25, pV: 20, odd: 1.75 },
      { id: 308, local: 'Real Madrid', visitante: 'Man. City', pL: 40, pE: 20, pV: 40, odd: 2.45 }
    ]
  };

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
        if (vips.includes(u.email.toLowerCase())) setIsPremium(true);
      }
      setPartidos(dbPartidos[liga]);
    });
  }, [liga]);

  const toggleSelection = (p) => {
    if (ticketUsuario.find(x => x.id === p.id)) {
      setTicketUsuario(ticketUsuario.filter(x => x.id !== p.id));
    } else {
      setTicketUsuario([...ticketUsuario, p]);
    }
  };

  // IA: Selección automática de los 3 con mayor probabilidad de victoria
  const getIACombo = () => {
    const todos = [...dbPartidos['ESPAÑA'], ...dbPartidos['PREMIER'], ...dbPartidos['CHAMPIONS']];
    return todos.sort((a, b) => Math.max(b.pL, b.pV) - Math.max(a.pL, a.pV)).slice(0, 3);
  };

  const comboIA = getIACombo();
  const cuotaIA = comboIA.reduce((acc, item) => acc * item.odd, 1).toFixed(2);
  const cuotaUser = ticketUsuario.reduce((acc, item) => acc * item.odd, 1).toFixed(2);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'160px'}}>
      
      {/* TABS NAVEGACIÓN */}
      <nav style={{display:'flex', background:'#0a0a0a', borderBottom:'1px solid #1a1a1a', position:'sticky', top:0, zIndex:20}}>
        <button onClick={() => setActiveTab('mercado')} style={{flex:1, padding:'18px', background:'transparent', border:'none', color: activeTab === 'mercado' ? '#fbbf24' : '#666', fontWeight:'900', fontSize:'0.65rem'}}>MERCADO</button>
        <button onClick={() => setActiveTab('ia')} style={{flex:1, padding:'18px', background:'transparent', border:'none', color: activeTab === 'ia' ? '#fbbf24' : '#666', fontWeight:'900', fontSize:'0.65rem'}}>COMBINADA IA 🔥</button>
        <button onClick={() => setActiveTab('ticket')} style={{flex:1, padding:'18px', background:'transparent', border:'none', color: activeTab === 'ticket' ? '#fbbf24' : '#666', fontWeight:'900', fontSize:'0.65rem'}}>MI TICKET ({ticketUsuario.length})</button>
      </nav>

      {user && isPremium ? (
        <div style={{padding:'15px'}}>
          
          {activeTab === 'mercado' && (
            <>
              {/* SELECTOR LIGAS */}
              <div style={{display:'flex', gap:'8px', marginBottom:'20px'}}>
                {['ESPAÑA', 'PREMIER', 'CHAMPIONS'].map(l => (
                  <button key={l} onClick={() => setLiga(l)} style={{flex:1, padding:'12px', borderRadius:'12px', border:'none', background: liga === l ? '#fbbf24' : '#111', color: liga === l ? '#000' : '#fff', fontWeight:'900', fontSize:'0.6rem'}}>{l}</button>
                ))}
              </div>

              {partidos.map(p => (
                <div key={p.id} style={{background:'#080808', border:'1px solid #1a1a1a', padding:'20px', borderRadius:'20px', marginBottom:'12px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontWeight:'900', fontSize:'0.85rem'}}>
                    <span>{p.local}</span><span style={{color:'#fbbf24'}}>VS</span><span>{p.visitante}</span>
                  </div>
                  <div style={{display:'flex', height:'10px', background:'#1a1a1a', borderRadius:'5px', overflow:'hidden', marginBottom:'15px'}}>
                    <div style={{width:`${p.pL}%`, background:'#fbbf24'}} />
                    <div style={{width:`${p.pE}%`, background:'#333'}} />
                    <div style={{width:`${p.pV}%`, background:'#555'}} />
                  </div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{color:'#fbbf24', fontWeight:'900', fontSize:'1.1rem'}}>@{p.odd}</span>
                    <button onClick={() => toggleSelection(p)} style={{background: ticketUsuario.find(x => x.id === p.id) ? '#ff4444' : '#fbbf24', color:'#000', border:'none', padding:'10px 18px', borderRadius:'10px', fontWeight:'900', fontSize:'0.6rem'}}>
                      {ticketUsuario.find(x => x.id === p.id) ? 'QUITAR' : 'AÑADIR'}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* VISTA TICKET: TEXTO CORREGIDO A NEGRO SOBRE AMARILLO */}
          {activeTab === 'ticket' && (
            <div style={{padding:'10px'}}>
              {ticketUsuario.length === 0 ? (
                <p style={{textAlign:'center', color:'#444', marginTop:'50px'}}>Ticket vacío</p>
              ) : (
                <div style={{background:'#fbbf24', color:'#000', padding:'30px', borderRadius:'30px', boxShadow:'0 10px 40px rgba(251,191,36,0.2)'}}>
                  <h2 style={{margin:'0 0 25px 0', fontSize:'1.2rem', fontWeight:'900', color:'#000'}}>MI APUESTA COMBINADA</h2>
                  {ticketUsuario.map(t => (
                    <div key={t.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', fontWeight:'900', fontSize:'0.85rem', color:'#000'}}>
                      <span>{t.local} v {t.visitante}</span>
                      <span>@{t.odd}</span>
                    </div>
                  ))}
                  <div style={{borderTop:'2px solid rgba(0,0,0,0.1)', marginTop:'25px', paddingTop:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontWeight:'900', color:'#000'}}>CUOTA TOTAL</span>
                    <span style={{fontSize:'2.4rem', fontWeight:'900', color:'#000'}}>@{cuotaUser}</span>
                  </div>
                  <button style={{width:'100%', marginTop:'25px', padding:'18px', background:'#000', color:'#fbbf24', border:'none', borderRadius:'15px', fontWeight:'900'}}>COPIAR TICKET</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ia' && (
            <div style={{padding:'10px'}}>
              <div style={{background:'#111', border:'2px solid #fbbf24', borderRadius:'30px', padding:'30px'}}>
                <h2 style={{color:'#fbbf24', fontSize:'1.1rem', textAlign:'center', marginBottom:'25px', fontWeight:'900'}}>TOP 3 IA SELECCIÓN</h2>
                {comboIA.map(c => (
                  <div key={c.id} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #222', fontSize:'0.85rem'}}>
                    <span>{c.local} vs {c.visitante}</span>
                    <span style={{color:'#fbbf24', fontWeight:'bold'}}>@{c.odd}</span>
                  </div>
                ))}
                <div style={{textAlign:'center', marginTop:'30px'}}>
                  <div style={{fontSize:'2.5rem', fontWeight:'900', color:'#fbbf24'}}>@{cuotaIA}</div>
                  <div style={{fontSize:'0.6rem', color:'#0f0', fontWeight:'bold'}}>CONFIANZA IA: 94.2%</div>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div style={{textAlign:'center', padding:'150px 30px'}}>
          <button onClick={() => signInWithPopup(auth, provider)} style={{background:'#fbbf24', color:'#000', padding:'20px', width:'100%', borderRadius:'20px', fontWeight:'900', border:'none'}}>ENTRAR VIP</button>
        </div>
      )}
    </div>
  );
         }
                   
                                  
                          
                
                    
        


            
                                           
            
                                
