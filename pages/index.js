import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

const FULL_DB = {
  'ucl': [
    { id: 'u1', d: '10.03. 18:45', h: 'Galatasaray', a: 'Liverpool', oL: 3.10, oE: 3.60, oV: 2.20 },
    { id: 'u2', d: '10.03. 21:00', h: 'Atalanta', a: 'Bayern', oL: 3.40, oE: 3.80, oV: 2.00 },
    { id: 'u3', d: '10.03. 21:00', h: 'Atlético', a: 'Tottenham', oL: 2.10, oE: 3.40, oV: 3.50 },
    { id: 'u4', d: '10.03. 21:00', h: 'Newcastle', a: 'Barcelona', oL: 3.20, oE: 3.70, oV: 2.10 },
    { id: 'u5', d: '11.03. 18:45', h: 'Leverkusen', a: 'Arsenal', oL: 2.60, oE: 3.40, oV: 2.70 },
    { id: 'u6', d: '11.03. 21:00', h: 'Bodo/Glimt', a: 'Sporting CP', oL: 3.80, oE: 3.90, oV: 1.85 },
    { id: 'u7', d: '11.03. 21:00', h: 'PSG', a: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'u8', d: '11.03. 21:00', h: 'Real Madrid', a: 'Man. City', oL: 2.80, oE: 3.60, oV: 2.40 }
  ],
  'laliga': [
    // Jornada 28
    { id: 'l1', d: '13.03. 21:00', h: 'Alavés', a: 'Villarreal', oL: 2.80, oE: 3.30, oV: 2.50 },
    { id: 'l2', d: '14.03. 14:00', h: 'Girona', a: 'Athletic', oL: 2.40, oE: 3.40, oV: 2.90 },
    { id: 'l3', d: '14.03. 16:15', h: 'Atlético', a: 'Getafe', oL: 1.55, oE: 4.00, oV: 6.50 },
    { id: 'l4', d: '14.03. 18:30', h: 'Real Oviedo', a: 'Valencia', oL: 3.20, oE: 3.10, oV: 2.40 },
    { id: 'l5', d: '14.03. 21:00', h: 'Real Madrid', a: 'Elche', oL: 1.15, oE: 8.00, oV: 17.0 },
    { id: 'l6', d: '15.03. 14:00', h: 'Mallorca', a: 'Espanyol', oL: 2.10, oE: 3.10, oV: 3.80 },
    { id: 'l7', d: '15.03. 16:15', h: 'Barcelona', a: 'Sevilla', oL: 1.35, oE: 5.50, oV: 8.50 },
    { id: 'l8', d: '15.03. 18:30', h: 'Betis', a: 'Celta', oL: 2.00, oE: 3.50, oV: 3.70 },
    { id: 'l9', d: '15.03. 21:00', h: 'Real Sociedad', a: 'Osasuna', oL: 1.80, oE: 3.40, oV: 5.00 },
    { id: 'l10', d: '16.03. 21:00', h: 'Rayo', a: 'Levante', oL: 2.20, oE: 3.20, oV: 3.40 },
    // Jornada 29 (Selección destacada)
    { id: 'l14', d: '22.03. 21:00', h: 'Real Madrid', a: 'Atlético', oL: 1.85, oE: 3.75, oV: 4.00 }
  ],
  'epl': [
    { id: 'e1', d: '14.03. 16:00', h: 'Burnley', a: 'Bournemouth', oL: 2.60, oE: 3.40, oV: 2.70 },
    { id: 'e3', d: '14.03. 18:30', h: 'Arsenal', a: 'Everton', oL: 1.25, oE: 6.00, oV: 11.0 },
    { id: 'e5', d: '15.03. 15:00', h: 'Man. Utd', a: 'Aston Villa', oL: 1.95, oE: 3.70, oV: 3.60 },
    { id: 'e6', d: '15.03. 17:30', h: 'Liverpool', a: 'Tottenham', oL: 1.60, oE: 4.20, oV: 5.00 },
    { id: 'e9', d: '12.04. 17:30', h: 'Chelsea', a: 'Man. City', oL: 4.00, oE: 3.80, oV: 1.85 }
  ]
};

export default function GolpredictPro() {
  const [liga, setLiga] = useState('ucl');
  const [tab, setTab] = useState('p');
  const [db, setDb] = useState({});
  const [sel, setSel] = useState([]);
  const [bet, setBet] = useState(10);
  const [expanded, setExpanded] = useState(null);

  const runEngine = (oL, oE, oV) => {
    const ITER = 50000;
    const pL = 1/oL, pV = 1/oV, pE = 1/oE;
    const totalP = pL + pV + pE;
    const lA = 2.85 * (pL/totalP), lB = 2.85 * (pV/totalP);
    
    const poi = (l) => { 
      let L = Math.exp(-l), k = 0, p = 1; 
      do { k++; p *= Math.random(); } while(p > L); 
      return k - 1; 
    };
    
    let stats = { wL:0, d:0, wV:0, ov15:0, ov25:0, ov35:0, corn:0, scores:{} };

    for(let i=0; i<ITER; i++){
      const gA = poi(lA), gB = poi(lB);
      const totalG = gA + gB;
      if(gA > gB) stats.wL++; else if(gA === gB) stats.d++; else stats.wV++;
      if(totalG > 1.5) stats.ov15++;
      if(totalG > 2.5) stats.ov25++;
      if(totalG > 3.5) stats.ov35++;
      stats.corn += (lA + lB) * 2.5 + (Math.random() * 4);
      const res = `${gA}-${gB}`;
      stats.scores[res] = (stats.scores[res] || 0) + 1;
    }

    const exact = Object.entries(stats.scores)
      .sort((a,b) => b[1] - a[1])
      .slice(0,3)
      .map(s => s[0]);

    return {
      pL: (stats.wL / 500).toFixed(1),
      pE: (stats.d / 500).toFixed(1),
      pV: (stats.wV / 500).toFixed(1),
      ov15: (stats.ov15 / 500).toFixed(1),
      ov25: (stats.ov25 / 500).toFixed(1),
      ov35: (stats.ov35 / 500).toFixed(1),
      corners: (stats.corn / ITER).toFixed(1),
      exact,
      pick: stats.wL > stats.wV && stats.wL > stats.d ? '1' : stats.wV > stats.wL && stats.wV > stats.d ? '2' : 'X'
    };
  };

  useEffect(() => {
    const newDb = {};
    Object.keys(FULL_DB).forEach(k => {
      newDb[k] = FULL_DB[k].map(m => ({ ...m, ...runEngine(m.oL, m.oE, m.oV) }));
    });
    setDb(newDb);
  }, []);

  const handleBet = (m, p, o) => {
    const sid = `${m.id}-${p}`;
    if (sel.find(b => b.id === sid)) setSel(sel.filter(b => b.id !== sid));
    else setSel([...sel.filter(b => !b.id.startsWith(m.id)), { id: sid, name: `${m.h}-${m.a}`, p, o }]);
  };

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'-apple-system, sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      {/* Header */}
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #333', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
           <h1 style={{color:'#fbbf24', fontSize:'1.1rem', margin:0, fontWeight:'900'}}>GOLPREDICT QUANTUM</h1>
           <button onClick={() => signOut(auth)} style={{background:'#ff4444', border:'none', color:'#fff', fontSize:'0.7rem', padding:'8px 12px', borderRadius:'6px', fontWeight:'bold'}}>SALIR</button>
        </div>
        <div style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'5px'}}>
          {['CHAMPIONS', 'LALIGA', 'PREMIER'].map((n, i) => (
            <button key={i} onClick={() => setLiga(['ucl','laliga','epl'][i])} style={{flex:1, padding:'12px', borderRadius:'10px', background: liga === ['ucl','laliga','epl'][i] ? '#fbbf24' : '#1a1a1a', color: liga === ['ucl','laliga','epl'][i] ? '#000' : '#fff', border:'none', fontSize:'0.6rem', fontWeight:'900', whiteSpace:'nowrap'}}>{n}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #333'}}>
        {['p', 'c'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{flex:1, padding:'16px', background:'none', border:'none', color: tab===t?'#fbbf24':'#888', borderBottom: tab===t?'3px solid #fbbf24':'none', fontSize:'0.75rem', fontWeight:'bold'}}>
            {t==='p'?'PARTIDOS' : `TICKET (${sel.length})`}
          </button>
        ))}
      </div>

      <div style={{padding:'12px'}}>
        {tab === 'p' && db[liga]?.map(p => (
          <div key={p.id} style={{background:'#111', padding:'15px', borderRadius:'18px', marginBottom:'12px', border:'1px solid #222'}}>
            <div onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{cursor:'pointer'}}>
              <div style={{fontSize:'0.65rem', color:'#fbbf24', marginBottom:'8px', textAlign:'center', fontWeight:'bold'}}>{p.d} • ANALIZAR ▾</div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'10px', marginBottom:'15px'}}>
                <div style={{flex:1, textAlign:'right'}}><div style={{fontWeight:'900', fontSize:'0.9rem'}}>{p.h}</div><div style={{color:'#4ade80', fontSize:'0.8rem', fontWeight:'bold'}}>{p.pL}%</div></div>
                <div style={{background:'#222', padding:'4px 8px', borderRadius:'6px', fontSize:'0.65rem', color:'#888', fontWeight:'bold'}}>{p.pE}%</div>
                <div style={{flex:1, textAlign:'left'}}><div style={{fontWeight:'900', fontSize:'0.9rem'}}>{p.a}</div><div style={{color:'#4ade80', fontSize:'0.8rem', fontWeight:'bold'}}>{p.pV}%</div></div>
              </div>
            </div>

            {expanded === p.id && (
              <div style={{background:'#000', padding:'15px', borderRadius:'14px', marginBottom:'15px', border:'1px solid #fbbf24'}}>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', fontSize:'0.75rem'}}>
                  <div style={{borderBottom:'1px solid #222', paddingBottom:'5px'}}><span style={{color:'#aaa'}}>Over 1.5:</span> <b style={{color:'#fff'}}>{p.ov15}%</b></div>
                  <div style={{borderBottom:'1px solid #222', paddingBottom:'5px'}}><span style={{color:'#aaa'}}>Over 2.5:</span> <b style={{color:'#fff'}}>{p.ov25}%</b></div>
                  <div style={{borderBottom:'1px solid #222', paddingBottom:'5px'}}><span style={{color:'#aaa'}}>Over 3.5:</span> <b style={{color:'#fff'}}>{p.ov35}%</b></div>
                  <div style={{borderBottom:'1px solid #222', paddingBottom:'5px'}}><span style={{color:'#aaa'}}>Córners:</span> <b style={{color:'#fbbf24'}}>{p.corners}</b></div>
                </div>
                <div style={{marginTop:'10px', textAlign:'center'}}>
                  <div style={{color:'#aaa', fontSize:'0.65rem', marginBottom:'5px', fontWeight:'bold'}}>RESULTADOS EXACTOS TOP</div>
                  <div style={{display:'flex', justifyContent:'center', gap:'8px'}}>
                    {p.exact.map((res, i) => (
                      <span key={i} style={{background:'#fbbf24', color:'#000', padding:'3px 10px', borderRadius:'6px', fontWeight:'900', fontSize:'0.8rem'}}>{res}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{display:'flex', gap:'8px'}}>
              {[{q:p.oL,t:'1'}, {q:p.oE,t:'X'}, {q:p.oV,t:'2'}].map((o,i) => (
                <button key={i} onClick={() => handleBet(p, o.t, o.q)} style={{flex:1, padding:'12px 0', borderRadius:'12px', background: sel.find(b=>b.id===`${p.id}-${o.t}`) ? '#fbbf24' : '#1a1a1a', color: sel.find(b=>b.id===`${p.id}-${o.t}`) ? '#000' : '#fff', border:'1px solid #333', fontWeight:'900'}}>
                  <div style={{fontSize:'1rem'}}>@{o.q.toFixed(2)}</div>
                  <div style={{fontSize:'0.55rem', opacity:0.6}}>{o.t === '1' ? 'LOCAL' : o.t === '2' ? 'VISITANTE' : 'X'}</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {tab === 'c' && (
          <div style={{background:'#111', padding:'20px', borderRadius:'20px', border:'2px solid #fbbf24'}}>
            {sel.length === 0 ? <p style={{textAlign:'center', color:'#666', fontWeight:'bold'}}>SELECCIONA CUOTAS</p> : (
              <>
                {sel.map(b => (
                  <div key={b.id} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #222', fontSize:'0.85rem'}}>
                    <span>{b.name} <b style={{color:'#fbbf24'}}>({b.p})</b></span><b style={{fontSize:'1rem'}}>@{b.o.toFixed(2)}</b>
                  </div>
                ))}
                <div style={{marginTop:'25px', textAlign:'center'}}>
                  <input type="number" value={bet} onChange={e=>setBet(e.target.value)} style={{background:'#000', border:'2px solid #fbbf24', color:'#fbbf24', fontSize:'1.8rem', width:'100px', textAlign:'center', borderRadius:'10px', padding:'5px'}} />
                  <div style={{color:'#4ade80', fontWeight:'900', margin:'15px 0', fontSize:'1.3rem'}}>CUOTA FINAL: @{sel.reduce((acc, b) => acc * b.o, 1).toFixed(2)}</div>
                  <div style={{background:'#fbbf24', color:'#000', padding:'18px', borderRadius:'14px', fontWeight:'900', fontSize:'1.5rem'}}>GANANCIA: {(bet * sel.reduce((acc, b) => acc * b.o, 1)).toFixed(2)}€</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
        }
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
