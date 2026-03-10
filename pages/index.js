import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const MY_API_KEY = '695217108b2d5b5c02822e3dd4d6ce26'; 

export default function GolpredictPro() {
  const [user, setUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [loading, setLoading] = useState(true);
  // Cambiamos a Champions como inicial hoy por ser jornada Europea
  const [liga, setLiga] = useState('soccer_uefa_champions_league'); 
  const [analysedDb, setAnalysedDb] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);

  const VIP_EMAILS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  const runDeepAnalysis = (oddL, oddE, oddV, currentLiga) => {
    const ITERATIONS = 10000;
    const probL = 1 / oddL;
    const probV = 1 / oddV;
    const eloRating = (probL / probV).toFixed(2);

    // Ajuste de goles: Champions suele ser más over (2.9)
    const baseGls = currentLiga.includes('champions') ? 2.9 : 2.7;
    const lambdaL = baseGls * (probL / (probL + probV + (1/oddE)));
    const lambdaV = baseGls * (probV / (probL + probV + (1/oddE)));

    let wL = 0, d = 0, wV = 0;
    const poisson = (l) => {
      let L = Math.exp(-l), k = 0, p = 1;
      do { k++; p *= Math.random(); } while (p > L);
      return k - 1;
    };

    for (let i = 0; i < ITERATIONS; i++) {
      const gL = poisson(lambdaL);
      const gV = poisson(lambdaV);
      if (gL > gV) wL++; else if (gL === gV) d++; else wV++;
    }

    return {
      pL: (wL / 100).toFixed(1), pE: (d / 100).toFixed(1), pV: (wV / 100).toFixed(1),
      valL: (wL / 10000) * oddL > 1.08, 
      valE: (d / 10000) * oddE > 1.08, 
      valV: (wV / 10000) * oddV > 1.08,
      elo: eloRating
    };
  };

  const fetchLiveOdds = useCallback(async () => {
    if (!isVIP) return;
    setIsSimulating(true);
    try {
      // Forzamos la descarga de mercados frescos
      const res = await fetch(`https://api.the-odds-api.com/v4/sports/${liga}/odds/?apiKey=${MY_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const results = data.map(m => {
          const b = m.bookmakers[0];
          if (!b) return null;
          const out = b.markets[0].outcomes;
          const oL = out.find(o => o.name === m.home_team)?.price;
          const oV = out.find(o => o.name === m.away_team)?.price;
          const oE = out.find(o => o.name === 'Draw' || o.name === 'Draws')?.price;
          if (!oL || !oV || !oE) return null;
          return { id: m.id, home: m.home_team, away: m.away_team, oL, oE, oV, ...runDeepAnalysis(oL, oE, oV, liga) };
        }).filter(x => x);
        setAnalysedDb(prev => ({ ...prev, [liga]: results }));
      }
    } catch (e) { console.error("Error UCL:", e); }
    setIsSimulating(false);
  }, [liga, isVIP]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && VIP_EMAILS.includes(u.email.toLowerCase().trim())) {
        setIsVIP(true); setUser(u);
      } else { setIsVIP(false); setUser(u); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => { if (isVIP) fetchLiveOdds(); }, [liga, isVIP, fetchLiveOdds]);

  if (loading) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24', fontFamily:'monospace'}}>CARGANDO UCL V21...</div>;

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
          <h1 style={{color:'#fbbf24', fontSize:'0.9rem', margin:0}}>GOLPREDICT <span style={{color:'#4ade80'}}>UCL</span></h1>
          <div style={{fontSize:'0.6rem', color:'#4ade80'}}>MERCADO LIVE OK</div>
        </div>
        
        <div style={{display:'flex', gap:'8px', overflowX:'auto'}}>
          {[
            {id:'soccer_uefa_champions_league', n:'🏆 UCL'},
            {id:'soccer_spain_la_liga', n:'1ª ESP'},
            {id:'soccer_spain_la_liga_2', n:'2ª ESP'},
            {id:'soccer_epl', n:'PREMIER'}
          ].map(l => (
            <button key={l.id} onClick={() => setLiga(l.id)} style={{padding:'8px 15px', borderRadius:'8px', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#555', border:'none', fontSize:'0.55rem', fontWeight:'900', whiteSpace:'nowrap'}}>
              {l.n}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:'15px'}}>
        {isSimulating ? (
          <div style={{textAlign:'center', padding:'40px', color:'#fbbf24'}}>ANALIZANDO OCTAVOS CHAMPIONS...</div>
        ) : (
          analysedDb[liga] && analysedDb[liga].length > 0 ? (
            analysedDb[liga].map(p => (
              <div key={p.id} style={{background:'#0c0c0c', padding:'18px', borderRadius:'20px', marginBottom:'15px', border:'1px solid #1a1a1a'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', alignItems:'center'}}>
                  <span style={{fontSize:'0.75rem', fontWeight:'900', color:'#4ade80'}}>{p.home} v {p.away}</span>
                  <span style={{fontSize:'0.5rem', color:'#fbbf24', background:'#222', padding:'4px 8px', borderRadius:'6px'}}>ELO: {p.elo}</span>
                </div>
                <div style={{display:'flex', gap:'6px'}}>
                  {[ {l:'1', q:p.oL, p:p.pL, v:p.valL, n:'LOCAL'}, {l:'X', q:p.oE, p:p.pE, v:p.valE, n:'EMPATE'}, {l:'2', q:p.oV, p:p.pV, v:p.valV, n:'VISIT.'} ].map((o, idx) => (
                    <div key={idx} style={{flex:1, background: o.v ? 'rgba(74,222,128,0.1)' : '#111', border: o.v ? '1px solid #4ade80' : '1px solid #222', padding:'12px 0', borderRadius:'12px', textAlign:'center'}}>
                      <div style={{fontSize:'0.45rem', color:'#444', marginBottom:'3px'}}>{o.n}</div>
                      <div style={{fontSize:'0.9rem', fontWeight:'900', color: o.v ? '#4ade80' : '#fff'}}>@{o.q}</div>
                      <div style={{fontSize:'0.55rem', color: o.v ? '#4ade80' : '#555'}}>{o.p}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div style={{textAlign:'center', padding:'50px'}}>
              <p style={{color:'#fbbf24', fontSize:'0.7rem'}}>Esperando cuotas de Octavos...</p>
              <button onClick={fetchLiveOdds} style={{background:'#111', color:'#fbbf24', border:'1px solid #fbbf24', padding:'10px', borderRadius:'10px', marginTop:'10px'}}>REINTENTAR CONEXIÓN</button>
            </div>
          )
        )}
      </div>
    </div>
  );
        }
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
