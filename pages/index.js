import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';

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

export default function GolpredictPro() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [liga, setLiga] = useState('ESPAÑA');
  const [ticket, setTicket] = useState([]);
  const [activeTab, setActiveTab] = useState('mercado');
  const [analysedDb, setAnalysedDb] = useState({});
  const [stats, setStats] = useState({ aciertos: 0, perdidos: 0 });
  const [isAnalysing, setIsAnalysing] = useState(true);

  const baseData = {
    'ESPAÑA': [
      { id: 101, fecha: '2026-03-13T21:00:00', local: 'Alavés', visitante: 'Villarreal', attL: 1.2, defL: 1.1, attV: 1.5, defV: 1.3, oddL: 2.65, oddE: 3.30, oddV: 2.70 },
      { id: 102, fecha: '2026-03-14T14:00:00', local: 'Girona', visitante: 'Athletic Club', attL: 1.8, defL: 1.4, attV: 1.6, defV: 1.2, oddL: 2.30, oddE: 3.40, oddV: 3.10 },
      { id: 103, fecha: '2026-03-14T16:15:00', local: 'Atlético de Madrid', visitante: 'Getafe', attL: 1.9, defL: 0.8, attV: 0.9, defV: 1.2, oddL: 1.50, oddE: 4.20, oddV: 7.00 },
      { id: 104, fecha: '2026-03-14T18:30:00', local: 'Real Oviedo', visitante: 'Valencia', attL: 1.1, defL: 1.1, attV: 1.2, defV: 1.3, oddL: 2.45, oddE: 3.10, oddV: 3.10 },
      { id: 105, fecha: '2026-03-14T21:00:00', local: 'Real Madrid', visitante: 'Elche', attL: 3.1, defL: 0.6, attV: 0.7, defV: 2.4, oddL: 1.18, oddE: 7.50, oddV: 15.0 },
      { id: 106, fecha: '2026-03-15T14:00:00', local: 'Mallorca', visitante: 'Espanyol', attL: 1.1, defL: 0.9, attV: 1.0, defV: 1.3, oddL: 2.10, oddE: 3.10, oddV: 3.90 },
      { id: 107, fecha: '2026-03-15T16:15:00', local: 'Barcelona', visitante: 'Sevilla', attL: 2.6, defL: 1.0, attV: 1.3, defV: 2.0, oddL: 1.35, oddE: 5.25, oddV: 8.50 },
      { id: 108, fecha: '2026-03-15T18:30:00', local: 'Real Betis', visitante: 'Celta de Vigo', attL: 1.7, defL: 1.2, attV: 1.4, defV: 1.6, oddL: 2.10, oddE: 3.40, oddV: 3.60 },
      { id: 109, fecha: '2026-03-15T21:00:00', local: 'Real Sociedad', visitante: 'Osasuna', attL: 1.6, defL: 0.9, attV: 1.1, defV: 1.4, oddL: 1.90, oddE: 3.30, oddV: 4.50 },
      { id: 110, fecha: '2026-03-16T21:00:00', local: 'Rayo Vallecano', visitante: 'Levante', attL: 1.2, defL: 1.2, attV: 1.1, defV: 1.3, oddL: 2.05, oddE: 3.30, oddV: 3.80 }
    ],
    'PREMIER': [
      { id: 201, fecha: '2026-03-14T16:00:00', local: 'Burnley', visitante: 'Bournemouth', attL: 1.1, defL: 1.7, attV: 1.4, defV: 1.5, oddL: 3.20, oddE: 3.50, oddV: 2.25 },
      { id: 202, fecha: '2026-03-14T16:00:00', local: 'Sunderland', visitante: 'Brighton', attL: 1.2, defL: 1.8, attV: 2.0, defV: 1.4, oddL: 4.50, oddE: 4.00, oddV: 1.75 },
      { id: 203, fecha: '2026-03-14T18:30:00', local: 'Arsenal', visitante: 'Everton', attL: 2.7, defL: 0.7, attV: 1.0, defV: 1.9, oddL: 1.25, oddE: 6.50, oddV: 12.0 },
      { id: 204, fecha: '2026-03-14T18:30:00', local: 'Chelsea', visitante: 'Newcastle', attL: 1.8, defL: 1.6, attV: 1.7, defV: 1.4, oddL: 2.15, oddE: 3.75, oddV: 3.10 },
      { id: 205, fecha: '2026-03-14T21:00:00', local: 'West Ham', visitante: 'Man. City', attL: 1.3, defL: 2.2, attV: 2.8, defV: 1.0, oddL: 9.00, oddE: 5.75, oddV: 1.30 },
      { id: 206, fecha: '2026-03-15T15:00:00', local: 'Crystal Palace', visitante: 'Leeds Utd', attL: 1.4, defL: 1.4, attV: 1.3, defV: 1.6, oddL: 2.30, oddE: 3.40, oddV: 3.10 },
      { id: 207, fecha: '2026-03-15T15:00:00', local: 'Manchester Utd', visitante: 'Aston Villa', attL: 2.0, defL: 1.5, attV: 1.7, defV: 1.5, oddL: 2.20, oddE: 3.60, oddV: 3.20 },
      { id: 208, fecha: '2026-03-15T15:00:00', local: 'Nottingham Forest', visitante: 'Fulham', attL: 1.2, defL: 1.4, attV: 1.4, defV: 1.4, oddL: 2.55, oddE: 3.30, oddV: 2.85 },
      { id: 209, fecha: '2026-03-15T17:30:00', local: 'Liverpool', visitante: 'Tottenham', attL: 2.5, defL: 1.4, attV: 1.9, defV: 1.6, oddL: 1.60, oddE: 4.50, oddV: 5.00 },
      { id: 210, fecha: '2026-03-16T21:00:00', local: 'Brentford', visitante: 'Wolves', attL: 1.5, defL: 1.4, attV: 1.3, defV: 1.5, oddL: 2.10, oddE: 3.40, oddV: 3.60 }
    ],
    'CHAMPIONS': [
      { id: 301, fecha: '2026-03-10T18:45:00', local: 'Galatasaray', visitante: 'Liverpool', attL: 1.4, defL: 1.8, attV: 2.3, defV: 1.2, oddL: 4.20, oddE: 4.00, oddV: 1.75, scoreL: 0, scoreV: 3 },
      { id: 302, fecha: '2026-03-10T21:00:00', local: 'Atalanta', visitante: 'Bayern Múnich', attL: 1.6, defL: 1.9, attV: 2.3, defV: 1.4, oddL: 3.80, oddE: 3.90, oddV: 1.85, scoreL: 1, scoreV: 1 },
      { id: 303, fecha: '2026-03-10T21:00:00', local: 'Atlético de Madrid', visitante: 'Tottenham', attL: 1.5, defL: 0.9, attV: 1.5, defV: 1.5, oddL: 2.00, oddE: 3.50, oddV: 3.80, scoreL: 2, scoreV: 1 },
      { id: 304, fecha: '2026-03-10T21:00:00', local: 'Newcastle', visitante: 'Barcelona', attL: 1.6, defL: 1.5, attV: 2.1, defV: 1.3, oddL: 3.40, oddE: 3.75, oddV: 2.05, scoreL: 1, scoreV: 2 },
      { id: 305, fecha: '2026-03-11T18:45:00', local: 'Bayer Leverkusen', visitante: 'Arsenal', attL: 1.8, defL: 1.4, attV: 2.1, defV: 1.2, oddL: 2.90, oddE: 3.60, oddV: 2.35 },
      { id: 306, fecha: '2026-03-11T21:00:00', local: 'Bodo/Glimt', visitante: 'Sporting CP', attL: 1.4, defL: 1.8, attV: 2.2, defV: 1.3, oddL: 5.00, oddE: 4.20, oddV: 1.65 },
      { id: 307, fecha: '2026-03-11T21:00:00', local: 'PSG', visitante: 'Chelsea', attL: 2.2, defL: 1.5, attV: 1.6, defV: 1.8, oddL: 1.85, oddE: 3.80, oddV: 4.00 },
      { id: 308, fecha: '2026-03-11T21:00:00', local: 'Real Madrid', visitante: 'Man. City', attL: 2.1, defL: 1.7, attV: 2.3, defV: 1.4, oddL: 2.80, oddE: 3.75, oddV: 2.35 }
    ]
  };

  const runQuantumEngine = useCallback(() => {
    setIsAnalysing(true);
    let wins = 0;
    let losses = 0;
    const now = new Date();

    let newDb = {};
    Object.keys(baseData).forEach(lKey => {
      newDb[lKey] = baseData[lKey].map(p => {
        const xGL = (p.attL * (p.defV / 1.5)).toFixed(2);
        const xGV = (p.attV * (p.defL / 1.5)).toFixed(2);
        let wL = 0, dr = 0, wV = 0;
        for(let i=0; i<10000; i++) {
          const rL = Math.floor(Math.random() * (parseFloat(xGL) + 1.2));
          const rV = Math.floor(Math.random() * (parseFloat(xGV) + 1.2));
          if(rL > rV) wL++; else if(rL === rV) dr++; else wV++;
        }
        
        const pL = (wL/100).toFixed(1);
        const pE = (dr/100).toFixed(1);
        const pV = (wV/100).toFixed(1);
        
        let winnerPick = "Empate";
        if(parseFloat(pL) > parseFloat(pV) && parseFloat(pL) > parseFloat(pE)) winnerPick = p.local;
        if(parseFloat(pV) > parseFloat(pL) && parseFloat(pV) > parseFloat(pE)) winnerPick = p.visitante;

        const gameDate = new Date(p.fecha);
        const isFinished = now > gameDate;

        if (isFinished && p.scoreL !== undefined) {
            const actualWinner = p.scoreL > p.scoreV ? p.local : (p.scoreL === p.scoreV ? "Empate" : p.visitante);
            if (winnerPick === actualWinner) wins++; else losses++;
        }

        return { ...p, pL, pE, pV, winnerPick, isFinished };
      });
    });
    setAnalysedDb(newDb);
    setStats({ aciertos: wins, perdidos: losses });
    setIsAnalysing(false);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
        setIsPremium(vips.includes(u.email.toLowerCase()));
        runQuantumEngine();
      } else { setUser(null); setIsPremium(false); }
    });
    return () => unsub();
  }, [runQuantumEngine]);

  if (!user || !isPremium) {
    return (
      <div style={{background:'#000', height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <h1 style={{color:'#fbbf24', fontSize:'2.5rem', fontWeight:'900', fontFamily:'monospace'}}>GOLPREDICT PRO</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{background:'#fbbf24', padding:'15px 40px', border:'none', borderRadius:'10px', fontWeight:'900', cursor:'pointer'}}>ACCESO VIP</button>
      </div>
    );
  }

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'80px'}}>
      
      <div style={{padding:'20px', textAlign:'center', borderBottom:'1px solid #222'}}>
        <h1 style={{color:'#fbbf24', margin:0, fontSize:'1.6rem', letterSpacing:'2px', fontWeight:'900'}}>GOLPREDICT PRO</h1>
        <div style={{display:'flex', justifyContent:'center', gap:'20px', marginTop:'10px'}}>
            <div style={{color:'#4ade80', fontSize:'0.7rem', fontWeight:'900'}}>ACIERTOS: {stats.aciertos}</div>
            <div style={{color:'#ff4444', fontSize:'0.7rem', fontWeight:'900'}}>PERDIDOS: {stats.perdidos}</div>
        </div>
      </div>

      <nav style={{display:'flex', background:'#0a0a0a', position:'sticky', top:0, zIndex:10}}>
        {['mercado', 'ia', 'ticket'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', color: activeTab === t ? '#fbbf24' : '#444', fontWeight:'900', fontSize:'0.7rem', borderBottom: activeTab === t ? '2px solid #fbbf24' : 'none'}}>{t.toUpperCase()}</button>
        ))}
      </nav>

      <div style={{padding:'15px'}}>
        {activeTab === 'mercado' && !isAnalysing && (
          <>
            <div style={{display:'flex', gap:'5px', marginBottom:'20px'}}>
              {Object.keys(baseData).map(l => (
                <button key={l} onClick={() => setLiga(l)} style={{flex:1, padding:'10px', borderRadius:'5px', background: liga === l ? '#fbbf24' : '#111', color: liga === l ? '#000' : '#555', border:'none', fontSize:'0.6rem', fontWeight:'900'}}>{l}</button>
              ))}
            </div>

            {analysedDb[liga]?.map(p => (
              <div key={p.id} style={{background:'#080808', padding:'20px', borderRadius:'25px', marginBottom:'15px', border: p.isFinished ? '1px solid #333' : '1px solid #1a1a1a', opacity: p.isFinished ? 0.7 : 1}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                    <span style={{fontSize:'0.6rem', color:'#555'}}>{new Date(p.fecha).toLocaleString([], {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}</span>
                    {p.isFinished ? 
                        <span style={{color:'#ff4444', fontWeight:'900', fontSize:'0.6rem'}}>● FINALIZADO</span> : 
                        <span style={{color:'#4ade80', fontWeight:'900', fontSize:'0.6rem'}}>● EN ESPERA</span>
                    }
                </div>

                {p.isFinished && p.scoreL !== undefined && (
                    <div style={{textAlign:'center', background:'#111', padding:'10px', borderRadius:'15px', marginBottom:'15px'}}>
                        <div style={{fontSize:'1.8rem', fontWeight:'900', letterSpacing:'5px'}}>{p.scoreL} - {p.scoreV}</div>
                    </div>
                )}

                <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                    {[ {l:'L', v:p.pL, q:p.oddL, c:'#4ade80'}, {l:'X', v:p.pE, q:p.oddE, c:'#fbbf24'}, {l:'V', v:p.pV, q:p.oddV, c:'#22d3ee'} ].map(i => (
                        <div key={i.l} style={{flex:1, textAlign:'center', background:'#111', padding:'8px', borderRadius:'10px'}}>
                            <div style={{fontSize:'0.55rem', color:i.c, fontWeight:'bold'}}>{i.l} @{i.q}</div>
                            <div style={{fontWeight:'900', fontSize:'1.1rem', margin:'3px 0'}}>{i.v}%</div>
                            <div style={{height:'3px', background:i.c, width:`${i.v}%`, margin:'0 auto'}}></div>
                        </div>
                    ))}
                </div>

                <div style={{textAlign:'center', fontWeight:'900', fontSize:'1rem', marginBottom:'15px'}}>{p.local} <span style={{color:'#fbbf24'}}>v</span> {p.visitante}</div>
                
                {!p.isFinished && (
                    <button onClick={() => setTicket([...ticket, p])} style={{width:'100%', background:'#fbbf24', color:'#000', border:'none', padding:'12px', borderRadius:'12px', fontWeight:'900', fontSize:'0.75rem', cursor:'pointer'}}>AÑADIR AL TICKET</button>
                )}
              </div>
            ))}
          </>
        )}
        
        {activeTab === 'ia' && (
           <div style={{padding:'20px', border:'2px dashed #fbbf24', borderRadius:'20px', textAlign:'center'}}>
              <h2 style={{color:'#fbbf24', fontWeight:'900'}}>IA MASTER PICK</h2>
              <p style={{fontSize:'0.7rem', color:'#666'}}>Máxima probabilidad de éxito detectada por el motor.</p>
              {Object.values(analysedDb).flat().filter(p => !p.isFinished).sort((a,b) => Math.max(b.pL, b.pV) - Math.max(a.pL, a.pV)).slice(0,1).map(p => (
                <div key={p.id} style={{marginTop:'20px'}}>
                   <div style={{fontSize:'1.2rem', fontWeight:'bold'}}>{p.local} v {p.visitante}</div>
                   <div style={{fontSize:'3rem', color:'#fbbf24', fontWeight:'900'}}>@{p.winnerPick === p.local ? p.oddL : (p.winnerPick === p.visitante ? p.oddV : p.oddE)}</div>
                   <div style={{color:'#4ade80', fontWeight:'bold'}}>CONFIANZA: {Math.max(p.pL, p.pV)}%</div>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'ticket' && (
           <div style={{background:'#111', padding:'20px', borderRadius:'20px'}}>
              <h3 style={{color:'#fbbf24', textAlign:'center', marginBottom:'15px'}}>MI TICKET</h3>
              {ticket.length === 0 ? <p style={{textAlign:'center', color:'#555'}}>No hay selecciones.</p> : (
                <>
                  {ticket.map((p, idx) => (
                    <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #222'}}>
                      <span>{p.winnerPick}</span> <span style={{color:'#fbbf24'}}>@{p.winnerPick === p.local ? p.oddL : (p.winnerPick === p.visitante ? p.oddV : p.oddE)}</span>
                    </div>
                  ))}
                  <div style={{textAlign:'center', marginTop:'20px'}}>
                    <div style={{fontSize:'2rem', color:'#fbbf24', fontWeight:'900'}}>@{ticket.reduce((acc, p) => acc * (p.winnerPick === p.local ? p.oddL : (p.winnerPick === p.visitante ? p.oddV : p.oddE)), 1).toFixed(2)}</div>
                    <button onClick={() => setTicket([])} style={{width:'100%', background:'#ff4444', color:'#fff', border:'none', padding:'10px', marginTop:'15px', borderRadius:'10px', fontWeight:'bold'}}>LIMPIAR</button>
                  </div>
                </>
              )}
           </div>
        )}
      </div>
    </div>
  );
                }
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
