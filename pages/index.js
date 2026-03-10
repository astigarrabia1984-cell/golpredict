import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

// --- DATA FINAL EXTRAÍDA DE TUS CAPTURAS ---
const FULL_DATABASE = {
  'soccer_uefa_champions_league': [
    { id: 'ucl_1', date: '12.03.', home: 'Galatasaray', away: 'Liverpool', oL: 3.40, oE: 3.80, oV: 2.10 },
    { id: 'ucl_2', date: '12.03.', home: 'Atalanta', away: 'Bayern München', oL: 2.80, oE: 3.50, oV: 2.45 },
    { id: 'ucl_3', date: '13.03.', home: 'Atlético de Madrid', away: 'Tottenham', oL: 2.15, oE: 3.40, oV: 3.30 },
    { id: 'ucl_4', date: '13.03.', home: 'Newcastle', away: 'Barcelona', oL: 2.60, oE: 3.60, oV: 2.50 },
    { id: 'ucl_5', date: '14.03.', home: 'Bayer Leverkusen', away: 'Arsenal', oL: 2.55, oE: 3.40, oV: 2.70 },
    { id: 'ucl_6', date: '17.03.', home: 'PSG', away: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'ucl_7', date: '18.03.', home: 'Real Madrid', away: 'Manchester City', oL: 2.80, oE: 3.60, oV: 2.40 }
  ],
  'soccer_spain_la_liga': [
    { id: 'll_1', date: '08.03.', home: 'Barcelona', away: 'Mallorca', oL: 1.45, oE: 4.50, oV: 7.50 },
    { id: 'll_2', date: '09.03.', home: 'Girona', away: 'Osasuna', oL: 1.65, oE: 4.00, oV: 5.25 },
    { id: 'll_3', date: '10.03.', home: 'Real Madrid', away: 'Celta Vigo', oL: 1.25, oE: 6.00, oV: 11.00 },
    { id: 'll_4', date: '11.03.', home: 'Almería', away: 'Sevilla', oL: 3.20, oE: 3.40, oV: 2.25 },
    { id: 'll_5', date: '15.03.', home: 'Real Sociedad', away: 'Cádiz', oL: 1.40, oE: 4.33, oV: 9.00 },
    { id: 'll_6', date: '16.03.', home: 'Getafe', away: 'Girona', oL: 3.60, oE: 3.40, oV: 2.10 },
    { id: 'll_7', date: '17.03.', home: 'Villarreal', away: 'Valencia', oL: 2.15, oE: 3.40, oV: 3.40 },
    { id: 'll_8', date: '17.03.', home: 'Atlético de Madrid', away: 'Barcelona', oL: 2.30, oE: 3.60, oV: 3.00 }
  ],
  'soccer_epl': [
    { id: 'epl_1', date: '30.03.', home: 'Newcastle', away: 'West Ham', oL: 1.85, oE: 4.00, oV: 3.80 },
    { id: 'epl_2', date: '30.03.', home: 'Bournemouth', away: 'Everton', oL: 2.20, oE: 3.50, oV: 3.20 },
    { id: 'epl_3', date: '30.03.', home: 'Tottenham', away: 'Luton', oL: 1.22, oE: 7.00, oV: 11.00 },
    { id: 'epl_4', date: '30.03.', home: 'Aston Villa', away: 'Wolves', oL: 1.65, oE: 4.20, oV: 4.75 },
    { id: 'epl_5', date: '30.03.', home: 'Brentford', away: 'Manchester Utd', oL: 3.00, oE: 3.75, oV: 2.20 },
    { id: 'epl_6', date: '31.03.', home: 'Liverpool', away: 'Brighton', oL: 1.36, oE: 5.50, oV: 8.00 },
    { id: 'epl_7', date: '31.03.', home: 'Manchester City', away: 'Arsenal', oL: 2.00, oE: 3.60, oV: 3.60 }
  ]
};

export default function GolpredictPro() {
  const [isVIP, setIsVIP] = useState(false);
  const [liga, setLiga] = useState('soccer_uefa_champions_league'); 
  const [activeTab, setActiveTab] = useState('partidos');
  const [analysedDb, setAnalysedDb] = useState({});
  const [betAmount, setBetAmount] = useState(10);

  const VIP_EMAILS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  // --- MOTOR MONTECARLO + POISSON (50.000 ITERACIONES) ---
  const runUltraQuantumEngine = (oddL, oddE, oddV) => {
    const ITERATIONS = 50000;
    const probL = 1 / oddL; const probV = 1 / oddV;
    const lambdaL = 2.85 * (probL / (probL + probV + (1/oddE)));
    const lambdaV = 2.85 * (probV / (probL + probV + (1/oddE)));
    const getPoisson = (l) => { let L = Math.exp(-l), k = 0, p = 1; do { k++; p *= Math.random(); } while (p > L); return k - 1; };
    let wL = 0, d = 0, wV = 0;
    for (let i = 0; i < ITERATIONS; i++) {
      const gL = getPoisson(lambdaL); const gV = getPoisson(lambdaV);
      if (gL > gV) wL++; else if (gL === gV) d++; else wV++;
    }
    return {
      pL: (wL / 500).toFixed(1), pE: (d / 500).toFixed(1), pV: (wV / 500).toFixed(1),
      valL: (wL / 50000) * oddL > 1.12, valE: (d / 50000) * oddE > 1.12, valV: (wV / 50000) * oddV > 1.12,
      pick: wL > wV && wL > d ? 'home' : wV > wL && wV > d ? 'away' : 'draw'
    };
  };

  useEffect(() => {
    const db = {};
    Object.keys(FULL_DATABASE).forEach(lId => {
      db[lId] = FULL_DATABASE[lId].map(m => ({ ...m, ...runUltraQuantumEngine(m.oL, m.oE, m.oV) }));
    });
    setAnalysedDb(db);
    onAuthStateChanged(auth, (u) => {
      if (u && VIP_EMAILS.includes(u.email?.toLowerCase().trim())) setIsVIP(true);
    });
  }, []);

  const generateAICombo = (risk) => {
    const all = Object.values(analysedDb).flat();
    if (all.length < 2) return null;
    let sel = [];
    if (risk === 'Sencilla') sel = all.filter(x => x.oL < 1.6).slice(0, 2);
    if (risk === 'Moderada') sel = all.filter(x => x.valL || x.valV).slice(0, 3);
    if (risk === 'Arriesgada') sel = all.filter(x => x.valE || (x.oL > 2 && x.valL)).slice(0, 3);
    if (sel.length < 2) sel = all.slice(0, 2);
    const odd = sel.reduce((acc, x) => acc * (x.pick === 'home' ? x.oL : x.pick === 'away' ? x.oV : x.oE), 1);
    return { sel, odd };
  };

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'60px'}}>
      
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <h1 style={{color:'#fbbf24', fontSize:'1.1rem', textAlign:'center', marginBottom:'15px'}}>GOLPREDICT QUANTUM</h1>
        <div style={{display:'flex', gap:'5px', overflowX:'auto'}}>
          {[{id:'soccer_uefa_champions_league', n:'🏆 CHAMPIONS'}, {id:'soccer_spain_la_liga', n:'🇪🇸 LALIGA'}, {id:'soccer_epl', n:'🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER'}].map(l => (
            <button key={l.id} onClick={() => setLiga(l.id)} style={{padding:'10px 15px', borderRadius:'10px', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#888', border:'none', fontSize:'0.6rem', fontWeight:'900', whiteSpace:'nowrap'}}>{l.n}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        {['partidos', 'ia combos'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', borderBottom: activeTab === t ? '2px solid #fbbf24' : 'none', color: activeTab === t ? '#fbbf24' : '#444', fontSize:'0.7rem', fontWeight:'bold'}}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div style={{padding:'15px'}}>
        {activeTab === 'partidos' && analysedDb[liga]?.map(p => (
          <div key={p.id} style={{background:'#0c0c0c', padding:'20px', borderRadius:'20px', marginBottom:'15px', border:'1px solid #1a1a1a'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span style={{color:'#666', fontSize:'0.7rem', fontWeight:'bold'}}>{p.date}</span>
                <span style={{color:'#4ade80', fontSize:'0.6rem', fontWeight:'900'}}>MONTECARLO 50K OK</span>
            </div>
            <div style={{fontSize:'0.95rem', fontWeight:'900', marginBottom:'15px', color:'#fbbf24', textTransform:'uppercase', textAlign:'center'}}>
                {p.home} <span style={{color:'#fff', opacity:0.5}}>VS</span> {p.away}
            </div>
            <div style={{display:'flex', gap:'8px'}}>
              {[ {q:p.oL, p:p.pL, v:p.valL}, {q:p.oE, p:p.pE, v:p.valE}, {q:p.oV, p:p.pV, v:p.valV} ].map((o, i) => (
                <div key={i} style={{flex:1, background: o.v ? 'rgba(74,222,128,0.1)' : '#151515', border: o.v ? '2px solid #4ade80' : '1px solid #333', padding:'12px 0', borderRadius:'15px', textAlign:'center'}}>
                  <div style={{fontSize:'1.1rem', fontWeight:'900', color: o.v ? '#4ade80' : '#fff'}}>@{o.q.toFixed(2)}</div>
                  <div style={{fontSize:'0.65rem', color: o.v ? '#4ade80' : '#555'}}>{o.p}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {activeTab === 'ia combos' && ['Sencilla', 'Moderada', 'Arriesgada'].map(r => {
          const c = generateAICombo(r); if (!c) return null;
          return (
            <div key={r} style={{background:'#0c0c0c', padding:'20px', borderRadius:'25px', marginBottom:'20px', border:'1px solid #333'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                <span style={{color: r === 'Arriesgada' ? '#ff4444' : r === 'Moderada' ? '#fbbf24' : '#4ade80', fontWeight:'900', fontSize:'0.9rem'}}>{r.toUpperCase()}</span>
                <span style={{fontSize:'1.2rem', fontWeight:'bold', color:'#fff'}}>@{c.odd.toFixed(2)}</span>
              </div>
              {c.sel.map((s, i) => <div key={i} style={{fontSize:'0.7rem', color:'#aaa', marginBottom:'8px'}}>• {s.home} - <span style={{color:'#fbbf24'}}>{s.pick.toUpperCase()}</span> (@{s.pick==='home'?s.oL:s.pick==='away'?s.oV:s.oE})</div>)}
              <div style={{marginTop:'15px', borderTop:'1px solid #222', paddingTop:'15px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} style={{background:'#111', border:'1px solid #fbbf24', color:'#fbbf24', width:'60px', borderRadius:'8px', padding:'8px', textAlign:'center', fontWeight:'bold'}} />
                 <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'0.6rem', color:'#666'}}>RETORNO ESTIMADO</div>
                    <div style={{color:'#4ade80', fontSize:'1.4rem', fontWeight:'bold'}}>{(betAmount * c.odd).toFixed(2)}€</div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
     }
          



    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
