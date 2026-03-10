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
  const [liga, setLiga] = useState('soccer_spain_la_liga'); 
  const [analysedDb, setAnalysedDb] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [activeTab, setActiveTab] = useState('mercado');

  const VIP_EMAILS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  // --- NÚCLEO IA: ELO + POISSON + 10K MONTE CARLO ---
  const runDeepAnalysis = (oddL, oddE, oddV, currentLiga) => {
    const ITERATIONS = 10000;
    
    // 1. INFERENCIA DE ELO (Fuerza Relativa)
    // Calculamos el Rating ELO implícito por el mercado
    const probL = 1 / oddL;
    const probV = 1 / oddV;
    const eloDiff = Math.log10(probL / probV) * 400; 
    const eloRating = (probL / probV).toFixed(2);

    // 2. EXPECTATIVA DE GOLES (POISSON)
    const baseGls = currentLiga.includes('la_liga_2') ? 2.2 : 2.8;
    const lambdaL = baseGls * (probL / (probL + probV + (1/oddE)));
    const lambdaV = baseGls * (probV / (probL + probV + (1/oddE)));

    // 3. SIMULACIÓN MONTE CARLO
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

    const finalPL = (wL / 100).toFixed(1);
    const finalPE = (d / 100).toFixed(1);
    const finalPV = (wV / 100).toFixed(1);

    return {
      pL: finalPL, pE: finalPE, pV: finalPV,
      valL: (wL / 10000) * oddL > 1.12, 
      valE: (d / 10000) * oddE > 1.12, 
      valV: (wV / 10000) * oddV > 1.12,
      elo: eloRating
    };
  };

  const fetchLiveOdds = useCallback(async () => {
    if (!isVIP) return;
    setIsSimulating(true);
    try {
      const res = await fetch(`https://api.the-odds-api.com/v4/sports/${liga}/odds/?apiKey=${MY_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const results = data.map(m => {
          const b = m.bookmakers[0];
          if (!b) return null;
          const out = b.markets[0].outcomes;
          const oL = out.find(o => o.name === m.home_team)?.price;
          const oV = out.find(o => o.name === m.away_team)?.price;
          const oE = out.find(o => o.name === 'Draw')?.price;
          if (!oL || !oV || !oE) return null;
          return { id: m.id, home: m.home_team, away: m.away_team, oL, oE, oV, ...runDeepAnalysis(oL, oE, oV, liga) };
        }).filter(x => x);
        setAnalysedDb(prev => ({ ...prev, [liga]: results }));
      }
    } catch (e) { console.error(e); }
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

  // GENERADOR DE COMBINADAS MEJORADO
  const getCombos = (tipo) => {
    const matches = analysedDb[liga] || [];
    if (matches.length < 2) return null;
    let picks = [];
    if (tipo === 'Sencilla') picks = matches.filter(m => parseFloat(m.pL) > 60 || parseFloat(m.pV) > 60).slice(0, 2);
    if (tipo === 'Moderada') picks = matches.filter(m => m.valL || m.valV).slice(0, 3);
    if (tipo === 'Arriesgada') picks = matches.filter(m => m.valE || (m.elo < 1.3 && m.valL)).slice(0, 3);
    
    if (picks.length === 0) picks = matches.slice(0, 2);
    const totalOdd = picks.reduce((acc, p) => acc * (p.valL ? p.oL : p.valV ? p.oV : p.oE), 1);
    return { picks, totalOdd };
  };

  if (loading) return <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#fbbf24', fontFamily:'monospace'}}>GOLPREDICT V19...</div>;

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      
      {/* HEADER DINÁMICO */}
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
          <h1 style={{color:'#fbbf24', fontSize:'0.9rem', margin:0}}>GOLPREDICT <span style={{color:'#4ade80'}}>V19</span></h1>
          <button onClick={() => setActiveTab(activeTab === 'mercado' ? 'ia' : 'mercado')} style={{background:'#fbbf24', border:'none', padding:'6px 12px', borderRadius:'8px', fontWeight:'900', fontSize:'0.6rem', color:'#000'}}>
            {activeTab === 'mercado' ? 'GENERAR COMBOS' : 'VER PARTIDOS'}
          </button>
        </div>
        
        <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'5px'}}>
          {[
            {id:'soccer_spain_la_liga', n:'1ª ESP'},
            {id:'soccer_spain_la_liga_2', n:'2ª ESP'},
            {id:'soccer_epl', n:'PREMIER'},
            {id:'soccer_uefa_champions_league', n:'UCL'}
          ].map(l => (
            <button key={l.id} onClick={() => setLiga(l.id)} style={{padding:'8px 15px', borderRadius:'8px', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#555', border:'none', fontSize:'0.55rem', fontWeight:'900', whiteSpace:'nowrap'}}>
              {l.n}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'mercado' ? (
        <div style={{padding:'15px'}}>
          {analysedDb[liga]?.map(p => (
            <div key={p.id} style={{background:'#0c0c0c', padding:'18px', borderRadius:'20px', marginBottom:'15px', border:'1px solid #1a1a1a'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', alignItems:'center'}}>
                <span style={{fontSize:'0.75rem', fontWeight:'900'}}>{p.home} v {p.away}</span>
                <span style={{fontSize:'0.5rem', color:'#fbbf24', background:'#222', padding:'4px 8px', borderRadius:'6px'}}>ELO: {p.elo}</span>
              </div>
              <div style={{display:'flex', gap:'6px'}}>
                {[ 
                  {l:'1', q:p.oL, p:p.pL, v:p.valL, n:'LOCAL'}, 
                  {l:'X', q:p.oE, p:p.pE, v:p.valE, n:'EMPATE'}, 
                  {l:'2', q:p.oV, p:p.pV, v:p.valV, n:'VISIT.'} 
                ].map((o, idx) => (
                  <div key={idx} style={{flex:1, background: o.v ? 'rgba(74,222,128,0.1)' : '#111', border: o.v ? '1px solid #4ade80' : '1px solid #222', padding:'12px 0', borderRadius:'12px', textAlign:'center'}}>
                    <div style={{fontSize:'0.45rem', color:'#444', marginBottom:'3px'}}>{o.n}</div>
                    <div style={{fontSize:'0.9rem', fontWeight:'900', color: o.v ? '#4ade80' : '#fff'}}>@{o.q}</div>
                    <div style={{fontSize:'0.55rem', color: o.v ? '#4ade80' : '#555'}}>{o.p}%</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{padding:'15px'}}>
          <h2 style={{color:'#fbbf24', fontSize:'0.8rem', marginBottom:'20px'}}>ESTRATEGIA IA (Basada en ELO)</h2>
          {['Sencilla', 'Moderada', 'Arriesgada'].map(tipo => {
            const combo = getCombos(tipo);
            if (!combo) return null;
            return (
              <div key={tipo} style={{background:'#0c0c0c', padding:'20px', borderRadius:'25px', marginBottom:'20px', border:'1px solid #333'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                  <span style={{color: tipo === 'Arriesgada' ? '#ff4444' : tipo === 'Moderada' ? '#fbbf24' : '#4ade80', fontWeight:'900', fontSize:'0.8rem'}}>{tipo}</span>
                  <span style={{color:'#fff', fontWeight:'900', fontSize:'1rem'}}>@{combo.totalOdd.toFixed(2)}</span>
                </div>
                {combo.picks.map((pick, i) => (
                  <div key={i} style={{fontSize:'0.65rem', color:'#888', marginBottom:'6px'}}>✓ {pick.home} vs {pick.away}</div>
                ))}
                <div style={{marginTop:'15px', borderTop:'1px solid #222', paddingTop:'15px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <span style={{fontSize:'0.6rem', color:'#444'}}>STAKE:</span>
                    <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} style={{background:'#111', border:'1px solid #333', color:'#fbbf24', width:'50px', padding:'5px', borderRadius:'8px', textAlign:'center'}} />
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'0.5rem', color:'#444'}}>PREMIO ESTIMADO</div>
                    <div style={{fontSize:'1.1rem', color:'#4ade80', fontWeight:'bold'}}>{(betAmount * combo.totalOdd).toFixed(2)}€</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
        }
                                                                    
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
