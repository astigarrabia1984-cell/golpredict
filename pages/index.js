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
    { id: 'u1', d: '10.03. 21:00', h: 'Milan', a: 'Benfica', oL: 2.15, oE: 3.40, oV: 3.40 },
    { id: 'u2', d: '10.03. 21:00', h: 'Monaco', a: 'Arsenal', oL: 4.20, oE: 3.75, oV: 1.85 },
    { id: 'u3', d: '11.03. 21:00', h: 'Real Madrid', a: 'Man. City', oL: 2.80, oE: 3.60, oV: 2.40 },
    { id: 'u4', d: '11.03. 21:00', h: 'PSG', a: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'u5', d: '17.03. 21:00', h: 'Man. City', a: 'Real Madrid', oL: 1.75, oE: 4.10, oV: 4.40 },
    { id: 'u6', d: '18.03. 21:00', h: 'Barcelona', a: 'Newcastle', oL: 1.55, oE: 4.40, oV: 5.50 }
  ],
  'laliga': [
    { id: 'l1', d: '13.03. 21:00', h: 'Alavés', a: 'Villarreal', oL: 2.80, oE: 3.30, oV: 2.50 },
    { id: 'l2', d: '14.03. 16:15', h: 'Atlético', a: 'Getafe', oL: 1.55, oE: 4.00, oV: 6.50 },
    { id: 'l3', d: '14.03. 21:00', h: 'Real Madrid', a: 'Elche', oL: 1.15, oE: 8.00, oV: 17.0 },
    { id: 'l4', d: '15.03. 16:15', h: 'Barcelona', a: 'Sevilla', oL: 1.35, oE: 5.50, oV: 8.50 },
    { id: 'l5', d: '22.03. 21:00', h: 'Real Madrid', a: 'Atlético', oL: 1.85, oE: 3.75, oV: 4.00 }
  ],
  'epl': [
    { id: 'e1', d: '14.03. 18:30', h: 'Arsenal', a: 'Everton', oL: 1.25, oE: 6.00, oV: 11.0 },
    { id: 'e2', d: '15.03. 15:00', h: 'Man. Utd', a: 'Aston Villa', oL: 1.95, oE: 3.70, oV: 3.60 },
    { id: 'e3', d: '31.03. 17:30', h: 'Man. City', a: 'Arsenal', oL: 1.95, oE: 3.70, oV: 3.80 },
    { id: 'e4', d: '04.04. 21:15', h: 'Chelsea', a: 'Man. Utd', oL: 2.15, oE: 3.60, oV: 3.20 }
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
    const lA = 2.85 * (pL/(pL+pV+pE)), lB = 2.85 * (pV/(pL+pV+pE));
    const poi = (l) => { let L=Math.exp(-l), k=0, p=1; do { k++; p*=Math.random(); } while(p>L); return k-1; };
    let wL=0, d=0, wV=0;
    for(let i=0; i<ITER; i++){
      const gA=poi(lA), gB=poi(lB);
      if(gA>gB) wL++; else if(gA===gB) d++; else wV++;
    }
    return { pL:(wL/500).toFixed(1), pE:(d/500).toFixed(1), pV:(wV/500).toFixed(1), pick: wL>wV && wL>d ? '1' : wV>wL && wV>d ? '2' : 'X' };
  };

  useEffect(() => {
    const newDb = {};
    Object.keys(FULL_DB).forEach(k => {
      newDb[k] = FULL_DB[k].map(m => ({ ...m, ...runEngine(m.oL, m.oE, m.oV) }));
    });
    setDb(newDb);
  }, []);

  const handleBet = (m, p, o) => {
    const id = `${m.id}-${p}`;
    if (sel.find(b => b.id === id)) {
      setSel(sel.filter(b => b.id !== id));
    } else {
      const filtered = sel.filter(b => !b.id.startsWith(m.id));
      setSel([...filtered, { id, name: `${m.h} vs ${m.a}`, p, o }]);
    }
  };

  const totalOdd = sel.reduce((acc, b) => acc * b.o, 1);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
           <h1 style={{color:'#fbbf24', fontSize:'1rem', margin:0}}>GOLPREDICT QUANTUM</h1>
           <button onClick={() => signOut(auth)} style={{background:'#ff4444', border:'none', color:'#fff', fontSize:'0.6rem', padding:'5px 10px', borderRadius:'5px'}}>LOGOUT</button>
        </div>
        <div style={{display:'flex', gap:'5px'}}>
          {['CHAMPIONS', 'LALIGA', 'PREMIER'].map((n, i) => (
            <button key={i} onClick={() => setLiga(['ucl','laliga','epl'][i])} style={{flex:1, padding:'10px', borderRadius:'8px', background: liga === ['ucl','laliga','epl'][i] ? '#fbbf24' : '#111', color: liga === ['ucl','laliga','epl'][i] ? '#000' : '#888', border:'none', fontSize:'0.6rem', fontWeight:'bold'}}>{n}</button>
          ))}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        <button onClick={() => setTab('p')} style={{flex:1, padding:'15px', background:'none', border:'none', color: tab==='p'?'#fbbf24':'#555', borderBottom: tab==='p'?'2px solid #fbbf24':'none'}}>PARTIDOS</button>
        <button onClick={() => setTab('c')} style={{flex:1, padding:'15px', background:'none', border:'none', color: tab==='c'?'#fbbf24':'#555', borderBottom: tab==='c'?'2px solid #fbbf24':'none'}}>CALCULADORA ({sel.length})</button>
      </div>

      <div style={{padding:'15px'}}>
        {tab === 'p' ? db[liga]?.map(p => (
          <div key={p.id} style={{background:'#0c0c0c', padding:'15px', borderRadius:'15px', marginBottom:'10px', border:'1px solid #1a1a1a'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem', color:'#fbbf24', marginBottom:'10px'}}>
              <span>{p.d}</span><span>IA PICK: {p.pick}</span>
            </div>
            <div style={{textAlign:'center', fontWeight:'bold', marginBottom:'10px'}}>{p.h} vs {p.a}</div>
            <div style={{display:'flex', gap:'5px'}}>
              {[{q:p.oL,t:'1'}, {q:p.oE,t:'X'}, {q:p.oV,t:'2'}].map((o,i) => (
                <button key={i} onClick={() => handleBet(p, o.t, o.q)} style={{flex:1, padding:'10px', borderRadius:'10px', background: sel.find(b=>b.id===`${p.id}-${o.t}`) ? '#fbbf24' : '#151515', color: sel.find(b=>b.id===`${p.id}-${o.t}`) ? '#000' : '#fff', border:'1px solid #333'}}>
                  <div style={{fontSize:'0.9rem', fontWeight:'bold'}}>@{o.q.toFixed(2)}</div>
                  <div style={{fontSize:'0.5rem'}}>{o.t}</div>
                </button>
              ))}
            </div>
          </div>
        )) : (
          <div style={{background:'#0c0c0c', padding:'20px', borderRadius:'20px', border:'1px solid #fbbf24'}}>
            {sel.map(b => (
              <div key={b.id} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #222', fontSize:'0.8rem'}}>
                <span>{b.name} ({b.p})</span><b>@{b.o.toFixed(2)}</b>
              </div>
            ))}
            <div style={{marginTop:'20px', textAlign:'center'}}>
              <div style={{fontSize:'0.7rem', color:'#666'}}>CANTIDAD</div>
              <input type="number" value={bet} onChange={e=>setBet(e.target.value)} style={{background:'#000', border:'1px solid #fbbf24', color:'#fbbf24', fontSize:'1.5rem', width:'80px', textAlign:'center', margin:'10px 0'}} />
              <div style={{fontSize:'1.2rem', color:'#4ade80', margin:'10px 0'}}>TOTAL: @{totalOdd.toFixed(2)}</div>
              <div style={{background:'#fbbf24', color:'#000', padding:'15px', borderRadius:'10px', fontWeight:'bold', fontSize:'1.2rem'}}>PREMIO: {(bet * totalOdd).toFixed(2)}€</div>
              <button onClick={()=>setSel([])} style={{marginTop:'15px', color:'#ff4444', background:'none', border:'none', textDecoration:'underline'}}>Limpiar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
            }
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
