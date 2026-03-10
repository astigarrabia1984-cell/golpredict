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

// --- BASE DE DATOS ACTUALIZADA SEGÚN TUS CAPTURAS ---
const FULL_DATABASE = {
  'soccer_uefa_champions_league': [
    { id: 'ucl_1', date: '11.03. 18:45', home: 'Bayer Leverkusen', away: 'Arsenal', oL: 2.55, oE: 3.40, oV: 2.70 },
    { id: 'ucl_2', date: '11.03. 21:00', home: 'Bodo/Glimt', away: 'Sporting CP', oL: 3.80, oE: 3.90, oV: 1.90 },
    { id: 'ucl_3', date: '11.03. 21:00', home: 'PSG', away: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'ucl_4', date: '11.03. 21:00', home: 'Real Madrid', away: 'Manchester City', oL: 2.80, oE: 3.60, oV: 2.40 },
    { id: 'ucl_5', date: '17.03. 18:45', home: 'Sporting CP', away: 'Bodo/Glimt', oL: 1.45, oE: 4.75, oV: 6.50 },
    { id: 'ucl_6', date: '17.03. 21:00', home: 'Arsenal', away: 'Bayer Leverkusen', oL: 1.80, oE: 3.90, oV: 4.20 },
    { id: 'ucl_7', date: '17.03. 21:00', home: 'Chelsea', away: 'PSG', oL: 2.60, oE: 3.50, oV: 2.60 },
    { id: 'ucl_8', date: '17.03. 21:00', home: 'Manchester City', away: 'Real Madrid', oL: 1.75, oE: 4.00, oV: 4.50 },
    { id: 'ucl_9', date: '18.03. 18:45', home: 'Barcelona', away: 'Newcastle', oL: 1.55, oE: 4.40, oV: 5.50 },
    { id: 'ucl_10', date: '18.03. 21:00', home: 'Bayern München', away: 'Atalanta', oL: 1.40, oE: 5.25, oV: 7.00 },
    { id: 'ucl_11', date: '18.03. 21:00', home: 'Liverpool', away: 'Galatasaray', oL: 1.25, oE: 6.50, oV: 10.00 },
    { id: 'ucl_12', date: '18.03. 21:00', home: 'Tottenham', away: 'Atlético de Madrid', oL: 2.30, oE: 3.50, oV: 3.10 }
  ],
  'soccer_spain_la_liga': [
    { id: 'll_28_1', date: '13.03. 21:00', home: 'Alavés', away: 'Villarreal', oL: 2.80, oE: 3.30, oV: 2.50 },
    { id: 'll_28_2', date: '14.03. 14:00', home: 'Girona', away: 'Athletic Club', oL: 2.40, oE: 3.40, oV: 3.00 },
    { id: 'll_28_3', date: '14.03. 16:15', home: 'Atlético de Madrid', away: 'Getafe', oL: 1.55, oE: 4.00, oV: 6.50 },
    { id: 'll_28_4', date: '14.03. 18:30', home: 'Real Oviedo', away: 'Valencia', oL: 3.10, oE: 3.20, oV: 2.45 },
    { id: 'll_28_5', date: '14.03. 21:00', home: 'Real Madrid', away: 'Elche', oL: 1.15, oE: 8.00, oV: 17.00 },
    { id: 'll_28_6', date: '15.03. 14:00', home: 'Mallorca', away: 'Espanyol', oL: 2.10, oE: 3.20, oV: 3.80 },
    { id: 'll_28_7', date: '15.03. 16:15', home: 'Barcelona', away: 'Sevilla', oL: 1.35, oE: 5.50, oV: 8.50 },
    { id: 'll_28_8', date: '15.03. 18:30', home: 'Real Betis', away: 'Celta de Vigo', oL: 2.00, oE: 3.50, oV: 3.75 },
    { id: 'll_28_9', date: '15.03. 21:00', home: 'Real Sociedad', away: 'Osasuna', oL: 1.85, oE: 3.40, oV: 4.50 },
    { id: 'll_28_10', date: '16.03. 21:00', home: 'Rayo Vallecano', away: 'Levante', oL: 2.20, oE: 3.30, oV: 3.40 },
    { id: 'll_29_1', date: '20.03. 21:00', home: 'Villarreal', away: 'Real Sociedad', oL: 2.45, oE: 3.30, oV: 2.90 },
    { id: 'll_29_2', date: '21.03. 14:00', home: 'Elche', away: 'Mallorca', oL: 2.70, oE: 3.10, oV: 2.80 },
    { id: 'll_29_3', date: '21.03. 16:15', home: 'Espanyol', away: 'Getafe', oL: 2.40, oE: 3.10, oV: 3.25 },
    { id: 'll_29_10', date: '22.03. 21:00', home: 'Real Madrid', away: 'Atlético de Madrid', oL: 1.85, oE: 3.75, oV: 4.00 }
  ],
  'soccer_epl': [
    { id: 'epl_30_1', date: '14.03. 16:00', home: 'Burnley', away: 'Bournemouth', oL: 2.80, oE: 3.40, oV: 2.50 },
    { id: 'epl_30_2', date: '14.03. 16:00', home: 'Sunderland', away: 'Brighton', oL: 4.00, oE: 3.75, oV: 1.85 },
    { id: 'epl_30_3', date: '14.03. 18:30', home: 'Arsenal', away: 'Everton', oL: 1.25, oE: 6.00, oV: 11.00 },
    { id: 'epl_30_4', date: '14.03. 18:30', home: 'Chelsea', away: 'Newcastle', oL: 2.10, oE: 3.60, oV: 3.40 },
    { id: 'epl_30_5', date: '14.03. 21:00', home: 'West Ham', away: 'Manchester City', oL: 9.00, oE: 5.50, oV: 1.30 },
    { id: 'epl_30_6', date: '15.03. 15:00', home: 'Crystal Palace', away: 'Leeds Utd', oL: 2.20, oE: 3.40, oV: 3.20 },
    { id: 'epl_30_7', date: '15.03. 15:00', home: 'Manchester Utd', away: 'Aston Villa', oL: 1.95, oE: 3.70, oV: 3.60 },
    { id: 'epl_30_8', date: '15.03. 15:00', home: 'Nottingham Forest', away: 'Fulham', oL: 2.40, oE: 3.30, oV: 3.00 },
    { id: 'epl_30_9', date: '15.03. 17:30', home: 'Liverpool', away: 'Tottenham', oL: 1.60, oE: 4.20, oV: 5.00 },
    { id: 'epl_30_10', date: '16.03. 21:00', home: 'Brentford', away: 'Wolves', oL: 2.15, oE: 3.30, oV: 3.50 },
    { id: 'epl_31_1', date: '20.03. 21:00', home: 'Bournemouth', away: 'Manchester Utd', oL: 3.10, oE: 3.60, oV: 2.20 },
    { id: 'epl_31_2', date: '21.03. 13:30', home: 'Brighton', away: 'Liverpool', oL: 4.50, oE: 4.00, oV: 1.70 },
    { id: 'epl_32_1', date: '10.04. 21:00', home: 'West Ham', away: 'Wolves', oL: 1.90, oE: 3.50, oV: 4.00 },
    { id: 'epl_33_9', date: '19.04. 17:30', home: 'Manchester City', away: 'Arsenal', oL: 2.00, oE: 3.60, oV: 3.60 }
  ]
};

export default function GolpredictPro() {
  const [liga, setLiga] = useState('soccer_uefa_champions_league'); 
  const [activeTab, setActiveTab] = useState('partidos');
  const [analysedDb, setAnalysedDb] = useState({});

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
      valL: (wL / 50000) * oddL > 1.12, valE: (d / 50000) * oddE > 1.12, valV: (wV / 50000) * oddV > 1.12
    };
  };

  useEffect(() => {
    const db = {};
    Object.keys(FULL_DATABASE).forEach(lId => {
      db[lId] = FULL_DATABASE[lId].map(m => ({ ...m, ...runUltraQuantumEngine(m.oL, m.oE, m.oV) }));
    });
    setAnalysedDb(db);
  }, []);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'monospace', maxWidth:'480px', margin:'0 auto', paddingBottom:'60px'}}>
      
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <h1 style={{color:'#fbbf24', fontSize:'1.1rem', textAlign:'center', marginBottom:'15px', letterSpacing:'1px'}}>GOLPREDICT QUANTUM</h1>
        <div style={{display:'flex', gap:'5px', overflowX:'auto'}}>
          {[{id:'soccer_uefa_champions_league', n:'🏆 CHAMPIONS'}, {id:'soccer_spain_la_liga', n:'🇪🇸 LALIGA'}, {id:'soccer_epl', n:'🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER'}].map(l => (
            <button key={l.id} onClick={() => setLiga(l.id)} style={{padding:'10px 15px', borderRadius:'10px', background: liga === l.id ? '#fbbf24' : '#111', color: liga === l.id ? '#000' : '#888', border:'none', fontSize:'0.6rem', fontWeight:'900', whiteSpace:'nowrap'}}>{l.n}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        {['partidos', 'ia combos'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', borderBottom: activeTab === t ? '3px solid #fbbf24' : 'none', color: activeTab === t ? '#fbbf24' : '#444', fontSize:'0.7rem', fontWeight:'bold'}}>{t.toUpperCase()}</button>
        ))}
      </div>

      <div style={{padding:'15px'}}>
        {activeTab === 'partidos' && analysedDb[liga]?.map(p => (
          <div key={p.id} style={{background:'#0c0c0c', padding:'20px', borderRadius:'20px', marginBottom:'15px', border:'1px solid #1a1a1a'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                <span style={{color:'#666', fontSize:'0.7rem', fontWeight:'bold'}}>{p.date}</span>
                <span style={{color:'#4ade80', fontSize:'0.6rem', fontWeight:'900'}}>ANALYSIS OK</span>
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
      </div>
    </div>
  );
  }
                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
