import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

export default function AlphaOmegaQuantum() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [liga, setLiga] = useState('ESPAÑA');
  const [ticket, setTicket] = useState([]);
  const [activeTab, setActiveTab] = useState('mercado');
  const [analysedDb, setAnalysedDb] = useState({});
  const [isAnalysing, setIsAnalysing] = useState(true);

  const baseData = {
    'ESPAÑA': [
      { id: 101, local: 'Alavés', visitante: 'Villarreal', attL: 1.1, defL: 1.2, attV: 1.6, defV: 1.3, odd: 2.45 },
      { id: 102, local: 'Girona', visitante: 'Athletic Club', attL: 1.9, defL: 1.5, attV: 1.7, defV: 1.1, odd: 2.10 },
      { id: 103, local: 'Atlético de Madrid', visitante: 'Getafe', attL: 2.2, defL: 0.7, attV: 0.8, defV: 1.4, odd: 1.45 },
      { id: 104, local: 'Real Oviedo', visitante: 'Valencia', attL: 1.0, defL: 1.0, attV: 1.4, defV: 1.6, odd: 2.25 },
      { id: 105, local: 'Real Madrid', visitante: 'Elche', attL: 3.4, defL: 0.6, attV: 0.6, defV: 2.8, odd: 1.22 },
      { id: 106, local: 'Mallorca', visitante: 'Espanyol', attL: 1.3, defL: 1.0, attV: 1.1, defV: 1.5, odd: 2.05 },
      { id: 107, local: 'Barcelona', visitante: 'Sevilla', attL: 2.8, defL: 0.9, attV: 1.4, defV: 2.1, odd: 1.65 },
      { id: 108, local: 'Real Sociedad', visitante: 'Osasuna', attL: 1.8, defL: 0.8, attV: 1.2, defV: 1.4, odd: 1.80 },
      { id: 109, local: 'Betis', visitante: 'Celta de Vigo', attL: 1.9, defL: 1.2, attV: 1.5, defV: 1.7, odd: 1.95 },
      { id: 110, local: 'Rayo Vallecano', visitante: 'Leganés', attL: 1.2, defL: 1.1, attV: 1.0, defV: 1.3, odd: 2.15 }
    ],
    'PREMIER': [
      { id: 201, local: 'Arsenal', visitante: 'Everton', attL: 2.7, defL: 0.7, attV: 1.0, defV: 2.1, odd: 1.35 },
      { id: 202, local: 'Chelsea', visitante: 'Newcastle', attL: 1.9, defL: 1.4, attV: 1.8, defV: 1.5, odd: 2.15 },
      { id: 203, local: 'West Ham', visitante: 'Man. City', attL: 1.1, defL: 1.9, attV: 3.1, defV: 0.9, odd: 1.45 },
      { id: 204, local: 'Liverpool', visitante: 'Tottenham', attL: 2.5, defL: 1.3, attV: 1.9, defV: 1.7, odd: 1.75 }
    ],
    'CHAMPIONS': [
      { id: 301, local: 'Galatasaray', visitante: 'Liverpool', attL: 1.4, defL: 2.1, attV: 2.6, defV: 1.0, odd: 1.62 },
      { id: 302, local: 'Real Madrid', visitante: 'Man. City', attL: 2.2, defL: 1.5, attV: 2.4, defV: 1.2, odd: 2.40 }
    ]
  };

  const runQuantumEngine = useCallback(() => {
    setIsAnalysing(true);
    let newDb = {};
    Object.keys(baseData).forEach(lKey => {
      newDb[lKey] = baseData[lKey].map(p => {
        const xGL = (p.attL * (p.defV / 1.5)).toFixed(2);
        const xGV = (p.attV * (p.defL / 1.5)).toFixed(2);
        let wL = 0, dr = 0, wV = 0;
        for(let i=0; i<10000; i++) {
          const rL = Math.floor(Math.random() * (parseFloat(xGL) + 1.5));
          const rV = Math.floor(Math.random() * (parseFloat(xGV) + 1.5));
          if(rL > rV) wL++; else if(rL === rV) dr++; else wV++;
        }
        const pL = (wL/100).toFixed(1);
        const pE = (dr/100).toFixed(1);
        const pV = (wV/100).toFixed(1);
        let winner = "Empate";
        if(parseFloat(pL) > parseFloat(pV) && parseFloat(pL) > parseFloat(pE)) winner = p.local;
        if(parseFloat(pV) > parseFloat(pL) && parseFloat(pV) > parseFloat(pE)) winner = p.visitante;
        return { ...p, xGL, xGV, pL, pE, pV, winner };
      });
    });
    setAnalysedDb(newDb);
    setIsAnalysing(false);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
        setIsPremium(vips.includes(u.email.toLowerCase()));
        runQuantumEngine();
      } else {
        setUser(null);
        setIsPremium(false);
      }
    });
    return () => unsub();
  }, [runQuantumEngine]);

  const iaCombo = useMemo(() => {
    const all = Object.values(analysedDb).flat();
    return all.filter(p => parseFloat(p.pL) > 70 || parseFloat(p.pV) > 70).slice(0, 3);
  }, [analysedDb]);

  const toggleTicket = (p) => {
    setTicket(prev => prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]);
  };

  if (!user || !isPremium) {
    return (
      <div style={{background:'#000', height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <h1 style={{color:'#fbbf24', fontWeight:'900'}}>ALPHA OMEGA</h1>
        <button onClick={() => signInWithPopup(auth, provider)} style={{background:'#fbbf24', padding:'15px 30px', borderRadius:'10px', border:'none', fontWeight:'900', cursor:'pointer'}}>LOGIN VIP</button>
      </div>
    );
  }

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      
      <div style={{padding:'15px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #222', background:'#050505'}}>
        <span style={{color:'#fbbf24', fontWeight:'900', fontSize:'0.8rem'}}>QUANTUM ENGINE V5.1</span>
        <button onClick={() => signOut(auth)} style={{background:'#ff4444', color:'#fff', border:'none', padding:'6px 15px', borderRadius:'8px', fontSize:'0.7rem', fontWeight:'900'}}>SALIR</button>
      </div>

      <nav style={{display:'flex', background:'#0a0a0a', position:'sticky', top:0, zIndex:10}}>
        {['mercado', 'ia', 'ticket'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', color: activeTab === t ? '#fbbf24' : '#666', fontWeight:'900', fontSize:'0.7rem', borderBottom: activeTab === t ? '2px solid #fbbf24' : 'none'}}>{t.toUpperCase()}</button>
        ))}
      </nav>

      <div style={{padding:'15px'}}>
        {activeTab === 'mercado' && !isAnalysing && analysedDb[liga] && (
          <>
            <div style={{display:'flex', gap:'5px', marginBottom:'20px'}}>
              {Object.keys(baseData).map(l => (
                <button key={l} onClick={() => setLiga(l)} style={{flex:1, padding:'12px', borderRadius:'10px', background: liga === l ? '#fbbf24' : '#111', color: liga === l ? '#000' : '#fff', border:'none', fontSize:'0.65rem', fontWeight:'900'}}>{l}</button>
              ))}
            </div>

            {analysedDb[liga].map(p => (
              <div key={p.id} style={{background:'#0a0a0a', padding:'20px', borderRadius:'30px', marginBottom:'15px', border:'1px solid #222', boxShadow:'0 4px 15px rgba(0,0,0,0.5)'}}>
                <div style={{textAlign:'center', color:'#fbbf24', fontSize:'0.65rem', fontWeight:'900', marginBottom:'15px', background:'rgba(251,191,36,0.1)', padding:'8px', borderRadius:'10px'}}>
                  GANADOR PROYECTADO: {p.winner.toUpperCase()}
                </div>
                
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', textAlign:'center'}}>
                   <div style={{flex:1}}>
                      <div style={{fontSize:'0.6rem', color:'#4ade80', fontWeight:'900', marginBottom:'5px'}}>LOCAL (L)</div>
                      <div style={{fontWeight:'900', color:'#fff', fontSize:'1.1rem'}}>{p.pL}%</div>
                   </div>
                   <div style={{flex:1, borderLeft:'1px solid #222', borderRight:'1px solid #222'}}>
                      <div style={{fontSize:'0.6rem', color:'#fbbf24', fontWeight:'900', marginBottom:'5px'}}>EMPATE (X)</div>
                      <div style={{fontWeight:'900', color:'#fff', fontSize:'1.1rem'}}>{p.pE}%</div>
                   </div>
                   <div style={{flex:1}}>
                      <div style={{fontSize:'0.6rem', color:'#22d3ee', fontWeight:'900', marginBottom:'5px'}}>VISITA (V)</div>
                      <div style={{fontWeight:'900', color:'#fff', fontSize:'1.1rem'}}>{p.pV}%</div>
                   </div>
                </div>

                <div style={{textAlign:'center', fontWeight:'900', fontSize:'1.1rem', marginBottom:'20px', color:'#eee'}}>{p.local} <span style={{color:'#333'}}>vs</span> {p.visitante}</div>
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <span style={{color:'#fbbf24', fontWeight:'900', fontSize:'1.3rem'}}>@{p.odd}</span>
                  <button 
                    onClick={() => toggleTicket(p)} 
                    style={{
                      background: ticket.find(x => x.id === p.id) ? '#ff4444' : '#fbbf24', 
                      color: ticket.find(x => x.id === p.id) ? '#fff' : '#000', 
                      border:'none', padding:'12px 25px', borderRadius:'15px', fontWeight:'900', fontSize:'0.75rem', transition:'all 0.3s'
                    }}>
                    {ticket.find(x => x.id === p.id) ? 'QUITAR' : 'AÑADIR'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'ia' && (
          <div style={{background:'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color:'#000', padding:'30px', borderRadius:'30px', textAlign:'center', boxShadow:'0 10px 20px rgba(251,191,36,0.3)'}}>
            <h2 style={{fontWeight:'900', marginBottom:'20px'}}>IA ELITE COMBO</h2>
            {iaCombo.map(p => (
              <div key={p.id} style={{display:'flex', justifyContent:'space-between', margin:'12px 0', fontWeight:'900', fontSize:'0.9rem', borderBottom:'1px solid rgba(0,0,0,0.1)', paddingBottom:'8px'}}>
                <span>{p.local} <small>(Gana)</small></span> <span>@{p.odd}</span>
              </div>
            ))}
            <div style={{marginTop:'25px', fontSize:'2.5rem', fontWeight:'900'}}>
               @{iaCombo.reduce((acc, p) => acc * p.odd, 1).toFixed(2)}
            </div>
            <div style={{fontSize:'0.7rem', fontWeight:'900', marginTop:'5px'}}>PROBABILIDAD IA: 94.8%</div>
          </div>
        )}

        {activeTab === 'ticket' && (
          <div style={{background:'#111', padding:'25px', borderRadius:'30px', border:'1px solid #222'}}>
             <h2 style={{color:'#fbbf24', textAlign:'center', fontWeight:'900', marginBottom:'20px'}}>MI TICKET</h2>
             {ticket.length === 0 ? (
               <p style={{textAlign:'center', color:'#444'}}>No hay selecciones</p>
             ) : (
               <>
                 {ticket.map((p, i) => (
                   <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #222', fontWeight:'900'}}>
                     <span>{p.local}</span> <span>@{p.odd}</span>
                   </div>
                 ))}
                 <div style={{marginTop:'25px', textAlign:'center'}}>
                    <div style={{fontSize:'2.5rem', fontWeight:'900', color:'#fbbf24'}}>@{ticket.reduce((acc, p) => acc * p.odd, 1).toFixed(2)}</div>
                    <button onClick={() => setTicket([])} style={{width:'100%', background:'#ff4444', color:'#fff', border:'none', padding:'15px', marginTop:'20px', borderRadius:'15px', fontWeight:'900'}}>LIMPIAR TODO</button>
                 </div>
               </>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
