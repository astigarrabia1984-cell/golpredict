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
    { id: 'u8', d: '11.03. 21:00', h: 'Real Madrid', a: 'Man. City', oL: 2.80, oE: 3.60, oV: 2.40 },
    { id: 'u9', d: '17.03. 18:45', h: 'Sporting CP', a: 'Bodo/Glimt', oL: 1.40, oE: 4.80, oV: 7.50 },
    { id: 'u10', d: '17.03. 21:00', h: 'Arsenal', a: 'Leverkusen', oL: 1.70, oE: 4.00, oV: 4.50 },
    { id: 'u11', d: '17.03. 21:00', h: 'Chelsea', a: 'PSG', oL: 2.50, oE: 3.50, oV: 2.70 },
    { id: 'u12', d: '17.03. 21:00', h: 'Man. City', a: 'Real Madrid', oL: 1.75, oE: 4.10, oV: 4.40 },
    { id: 'u13', d: '18.03. 18:45', h: 'Barcelona', a: 'Newcastle', oL: 1.55, oE: 4.40, oV: 5.50 },
    { id: 'u14', d: '18.03. 21:00', h: 'Bayern', a: 'Atalanta', oL: 1.45, oE: 4.75, oV: 6.00 },
    { id: 'u15', d: '18.03. 21:00', h: 'Liverpool', a: 'Galatasaray', oL: 1.30, oE: 5.50, oV: 9.00 },
    { id: 'u16', d: '18.03. 21:00', h: 'Tottenham', a: 'Atlético', oL: 2.25, oE: 3.40, oV: 3.10 }
  ],
  'laliga': [
    { id: 'l1', d: '13.03. 21:00', h: 'Alavés', a: 'Villarreal', oL: 2.80, oE: 3.30, oV: 2.50 },
    { id: 'l2', d: '14.03. 14:00', h: 'Girona', a: 'Athletic', oL: 2.40, oE: 3.40, oV: 2.90 },
    { id: 'l3', d: '14.03. 16:15', h: 'Atlético', a: 'Getafe', oL: 1.55, oE: 4.00, oV: 6.50 },
    { id: 'l4', d: '14.03. 18:30', h: 'Real Oviedo', a: 'Valencia', oL: 3.20, oE: 3.10, oV: 2.40 },
    { id: 'l5', d: '14.03. 21:00', h: 'Real Madrid', a: 'Elche', oL: 1.15, oE: 8.00, oV: 17.0 },
    { id: 'l7', d: '15.03. 16:15', h: 'Barcelona', a: 'Sevilla', oL: 1.35, oE: 5.50, oV: 8.50 },
    { id: 'l14', d: '22.03. 21:00', h: 'Real Madrid', a: 'Atlético', oL: 1.85, oE: 3.75, oV: 4.00 }
  ],
  'epl': [
    { id: 'e3', d: '14.03. 18:30', h: 'Arsenal', a: 'Everton', oL: 1.25, oE: 6.00, oV: 11.0 },
    { id: 'e5', d: '15.03. 15:00', h: 'Man. Utd', a: 'Aston Villa', oL: 1.95, oE: 3.70, oV: 3.60 },
    { id: 'e6', d: '15.03. 17:30', h: 'Liverpool', a: 'Tottenham', oL: 1.60, oE: 4.20, oV: 5.00 },
    { id: 'e9', d: '12.04. 17:30', h: 'Chelsea', a: 'Man. City', oL: 4.00, oE: 3.80, oV: 1.85 },
    { id: 'e10', d: '19.04. 17:30', h: 'Man. City', a: 'Arsenal', oL: 1.90, oE: 3.75, oV: 3.80 }
  ]
};

export default function GolpredictPro() {
  const [liga, setLiga] = useState('ucl');
  const [tab, setTab] = useState('p');
  const [db, setDb] = useState({});
  const [bet, setBet] = useState(10);
  const [sel, setSel] = useState([]);

  const runEngine = (oL, oE, oV) => {
    const ITER = 50000;
    const pL = 1/oL, pV = 1/oV, pE = 1/oE;
    const totalP = pL + pV + pE;
    const lA = 2.8 * (pL/totalP), lB = 2.8 * (pV/totalP);
    const poi = (l) => { let L=Math.exp(-l), k=0, p=1; do { k++; p*=Math.random(); } while(p>L); return k-1; };
    let wL=0, d=0, wV=0;
    for(let i=0; i<ITER; i++){
      const gA=poi(lA), gB=poi(lB);
      if(gA>gB) wL++; else if(gA===gB) d++; else wV++;
    }
    const probL = (wL/(ITER/100)).toFixed(1);
    const probE = (d/(ITER/100)).toFixed(1);
    const probV = (wV/(ITER/100)).toFixed(1);
    let pick = 'X', pickOdd = oE, prob = probE;
    if(wL > d && wL > wV) { pick = '1'; pickOdd = oL; prob = probL; }
    else if(wV > d && wV > wL) { pick = '2'; pickOdd = oV; prob = probV; }
    return { pL: probL, pE: probE, pV: probV, pick, pickOdd, prob };
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
    if (sel.find(b => b.id === sid)) {
      setSel(sel.filter(b => b.id !== sid));
    } else {
      setSel([...sel.filter(b => !b.id.startsWith(m.id)), { id: sid, name: `${m.h}-${m.a}`, p, o }]);
    }
  };

  const getIACombo = (type) => {
    const all = Object.values(db).flat();
    if(!all.length) return [];
    if(type === 'Básica') return all.filter(m => m.prob > 60).slice(0, 3);
    if(type === 'Moderada') return all.filter(m => m.prob > 45 && m.prob <= 60).slice(0, 3);
    return all.filter(m => m.prob <= 45).slice(0, 3);
  };

  const totalOdd = sel.reduce((acc, b) => acc * b.o, 1);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'-apple-system, sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #333', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
           <h1 style={{color:'#fbbf24', fontSize:'1.2rem', margin:0, fontWeight:'900', letterSpacing:'-0.5px'}}>GOLPREDICT PRO</h1>
           <button onClick={() => signOut(auth)} style={{background:'#ff4444', border:'none', color:'#fff', fontSize:'0.7rem', padding:'8px 12px', borderRadius:'6px', fontWeight:'bold'}}>SALIR</button>
        </div>
        <div style={{display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'5px'}}>
          {['CHAMPIONS', 'LALIGA', 'PREMIER'].map((n, i) => (
            <button key={i} onClick={() => setLiga(['ucl','laliga','epl'][i])} style={{flex:1, padding:'12px', borderRadius:'10px', background: liga === ['ucl','laliga','epl'][i] ? '#fbbf24' : '#1a1a1a', color: liga === ['ucl','laliga','epl'][i] ? '#000' : '#ffffff', border:'none', fontSize:'0.65rem', fontWeight:'bold', whiteSpace:'nowrap'}}>{n}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #333'}}>
        {['p', 'ia', 'c'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{flex:1, padding:'16px', background:'none', border:'none', color: tab===t?'#fbbf24':'#888', borderBottom: tab===t?'3px solid #fbbf24':'none', fontSize:'0.75rem', fontWeight:'bold'}}>
            {t==='p'?'PARTIDOS' : t==='ia'?'IA COMBOS' : `TICKET (${sel.length})`}
          </button>
        ))}
      </div>

      <div style={{padding:'12px'}}>
        {tab === 'p' && db[liga]?.map(p => (
          <div key={p.id} style={{background:'#111', padding:'15px', borderRadius:'16px', marginBottom:'12px', border:'1px solid #222'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'#fbbf24', marginBottom:'10px', fontWeight:'bold'}}>
              <span>{p.d}</span><span style={{background:'#222', padding:'2px 8px', borderRadius:'4px'}}>IA: {p.pick} ({p.prob}%)</span>
            </div>
            <div style={{textAlign:'center', fontWeight:'800', marginBottom:'15px', fontSize:'1rem', color:'#fff'}}>{p.h} <span style={{color:'#444'}}>vs</span> {p.a}</div>
            <div style={{display:'flex', gap:'8px'}}>
              {[{q:p.oL,t:'1'}, {q:p.oE,t:'X'}, {q:p.oV,t:'2'}].map((o,i) => (
                <button key={i} onClick={() => handleBet(p, o.t, o.q)} style={{flex:1, padding:'12px 0', borderRadius:'12px', background: sel.find(b=>b.id===`${p.id}-${o.t}`) ? '#fbbf24' : '#1a1a1a', color: sel.find(b=>b.id===`${p.id}-${o.t}`) ? '#000' : '#fff', border:'1px solid #333', cursor:'pointer'}}>
                  <div style={{fontSize:'1rem', fontWeight:'900'}}>@{o.q.toFixed(2)}</div>
                  <div style={{fontSize:'0.6rem', fontWeight:'bold', opacity:0.7}}>{o.t}</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {tab === 'ia' && ['Básica', 'Moderada', 'Arriesgada'].map(type => (
          <div key={type} style={{background:'#111', padding:'20px', borderRadius:'20px', marginBottom:'15px', border:'1px solid #222', borderLeft:`6px solid ${type==='Básica'?'#4ade80':type==='Moderada'?'#fbbf24':'#ff4444'}`}}>
            <h3 style={{fontSize:'0.9rem', margin:'0 0 12px 0', color:type==='Básica'?'#4ade80':type==='Moderada'?'#fbbf24':'#ff4444', fontWeight:'900'}}>{type.toUpperCase()}</h3>
            {getIACombo(type).map(m => (
              <div key={m.id} style={{fontSize:'0.8rem', display:'flex', justifyContent:'space-between', margin:'8px 0', color:'#eee', fontWeight:'500'}}>
                <span>{m.h} - {m.a}</span><span style={{color:'#fbbf24'}}>Pick {m.pick} (@{m.pickOdd.toFixed(2)})</span>
              </div>
            ))}
            <div style={{marginTop:'15px', paddingTop:'10px', borderTop:'1px solid #222', textAlign:'right', fontWeight:'900', color:'#4ade80', fontSize:'1.1rem'}}>
              CUOTA TOTAL: @{getIACombo(type).reduce((acc, m) => acc * m.pickOdd, 1).toFixed(2)}
            </div>
          </div>
        ))}

        {tab === 'c' && (
          <div style={{padding:'5px'}}>
            {sel.length === 0 ? <div style={{textAlign:'center', padding:'50px', color:'#666', fontWeight:'bold'}}>SELECCIONA CUOTAS EN PARTIDOS</div> : 
              <div style={{background:'#111', padding:'20px', borderRadius:'20px', border:'2px solid #fbbf24'}}>
                <h2 style={{fontSize:'0.8rem', color:'#fbbf24', textAlign:'center', marginBottom:'15px'}}>RESUMEN DE TICKET</h2>
                {sel.map(b => (
                  <div key={b.id} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #222', fontSize:'0.85rem', color:'#fff'}}>
                    <span>{b.name} <b style={{color:'#fbbf24'}}>({b.p})</b></span><b style={{fontSize:'1rem'}}>@{b.o.toFixed(2)}</b>
                  </div>
                ))}
                <div style={{marginTop:'25px', textAlign:'center'}}>
                  <div style={{fontSize:'0.7rem', color:'#aaa', marginBottom:'5px'}}>CANTIDAD APOSTADA</div>
                  <input type="number" value={bet} onChange={e=>setBet(e.target.value)} style={{background:'#000', border:'2px solid #fbbf24', color:'#fbbf24', fontSize:'1.8rem', width:'100px', textAlign:'center', borderRadius:'10px', padding:'5px', marginBottom:'15px'}} />
                  <div style={{color:'#4ade80', fontWeight:'900', fontSize:'1.2rem', marginBottom:'10px'}}>CUOTA FINAL: @{totalOdd.toFixed(2)}</div>
                  <div style={{background:'#fbbf24', color:'#000', padding:'18px', borderRadius:'14px', fontWeight:'900', fontSize:'1.4rem', boxShadow:'0 4px 15px rgba(251, 191, 36, 0.3)'}}>
                    GANANCIA: {(bet * totalOdd).toFixed(2)}€
                  </div>
                  <button onClick={()=>setSel([])} style={{marginTop:'20px', display:'block', width:'100%', color:'#ff4444', background:'none', border:'none', fontSize:'0.75rem', fontWeight:'bold', textDecoration:'underline', cursor:'pointer'}}>ELIMINAR APUESTAS</button>
                </div>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
}

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
