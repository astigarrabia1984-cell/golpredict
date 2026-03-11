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

const VIP_USERS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.con'];

const FULL_DB = {
  'ucl': [
    { id: 'u1', d: '10.03', h: 'Galatasaray', a: 'Liverpool', oL: 3.10, oE: 3.60, oV: 2.20, status: 'lost', res: '1-0', pick: '2' },
    { id: 'u2', d: '10.03', h: 'Atalanta', a: 'Bayern', oL: 3.40, oE: 3.80, oV: 2.00, status: 'won', res: '1-6', pick: '2' },
    { id: 'u3', d: '10.03', h: 'Atlético', a: 'Tottenham', oL: 2.10, oE: 3.40, oV: 3.50, status: 'won', res: '5-2', pick: '1' },
    { id: 'u4', d: '10.03', h: 'Newcastle', a: 'Barcelona', oL: 3.20, oE: 3.70, oV: 2.10, status: 'lost', res: '1-1', pick: '2' },
    { id: 'u5', d: '11.03 18:45', h: 'B. Leverkusen', a: 'Arsenal', oL: 2.60, oE: 3.40, oV: 2.70, status: 'pending' },
    { id: 'u6', d: '11.03 21:00', h: 'Bodo/Glimt', a: 'Sporting CP', oL: 3.80, oE: 3.90, oV: 1.85, status: 'pending' },
    { id: 'u7', d: '11.03 21:00', h: 'PSG', a: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60, status: 'pending' },
    { id: 'u8', d: '11.03 21:00', h: 'Real Madrid', a: 'Man. City', oL: 2.80, oE: 3.60, oV: 2.40, status: 'pending' }
  ],
  'laliga': [
    { id: 'l1', d: '14.03', h: 'Girona', a: 'Athletic Club', oL: 2.45, oE: 3.40, oV: 2.95, status: 'pending' },
    { id: 'l2', d: '14.03', h: 'Atlético', a: 'Getafe', oL: 1.57, oE: 4.00, oV: 6.25, status: 'pending' },
    { id: 'l6', d: '15.03', h: 'Barcelona', a: 'Sevilla', oL: 1.38, oE: 5.25, oV: 8.00, status: 'pending' }
  ],
  'epl': [
    { id: 'e3', d: '14.03', h: 'Arsenal', a: 'Everton', oL: 1.25, oE: 6.25, oV: 12.0, status: 'pending' },
    { id: 'e7', d: '15.03', h: 'Liverpool', a: 'Tottenham', oL: 1.62, oE: 4.40, oV: 5.00, status: 'pending' }
  ]
};

export default function GolpredictPro() {
  const [user, setUser] = useState(null);
  const [liga, setLiga] = useState('ucl');
  const [tab, setTab] = useState('p');
  const [db, setDb] = useState({});
  const [sel, setSel] = useState([]);
  const [bet, setBet] = useState(10);
  const [expanded, setExpanded] = useState(null);

  const hybridEngine = (oL, oE, oV) => {
    const ITER = 50000;
    const rho = -0.06; 
    const pL = 1/oL, pE = 1/oE, pV = 1/oV;
    const sumP = pL + pE + pV;
    const lA = 2.8 * (pL/sumP) * 1.12; 
    const lB = 2.8 * (pV/sumP);

    let s = { wL:0, d:0, wV:0, ov25:0, corn:0, sc:{} };
    for(let i=0; i<ITER; i++){
      let gA=0, pA=1, LA=Math.exp(-lA); do { gA++; pA*=Math.random(); } while(pA>LA); gA--;
      let gB=0, pB=1, LB=Math.exp(-lB); do { gB++; pB*=Math.random(); } while(pB>LB); gB--;
      if(gA===0 && gB===0 && Math.random()<Math.abs(rho)) gA=0;
      if(gA>gB) s.wL++; else if(gA===gB) s.d++; else s.wV++;
      if(gA+gB > 2.5) s.ov25++;
      s.corn += (lA + lB) * 2.3 + (Math.random() * 4);
      const res = `${gA}-${gB}`; s.sc[res] = (s.sc[res]||0)+1;
    }
    const pick = s.wL > s.wV && s.wL > s.d ? '1' : s.wV > s.wL && s.wV > s.d ? '2' : 'X';
    return {
      pL:(s.wL/500).toFixed(1), pE:(s.d/500).toFixed(1), pV:(s.wV/500).toFixed(1),
      ov25:(s.ov25/500).toFixed(1), corners:(s.corn/ITER).toFixed(1),
      exact: Object.entries(s.sc).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>x[0]),
      pick, probMax: Math.max(s.wL, s.d, s.wV)/500, pickOdd: pick==='1'?oL:pick==='2'?oV:oE,
      o1X:1/((1/oL)+(1/oE)), oX2:1/((1/oV)+(1/oE)), o12:1/((1/oL)+(1/oV))
    };
  };

  useEffect(() => {
    onAuthStateChanged(auth, u => setUser(u));
    const newDb = {};
    Object.keys(FULL_DB).forEach(k => {
      newDb[k] = FULL_DB[k].map(m => ({ ...m, ...hybridEngine(m.oL, m.oE, m.oV) }));
    });
    setDb(newDb);
  }, []);

  const getIACombos = () => {
    const all = Object.values(db).flat().filter(m => m.status === 'pending');
    return [
      { t: 'IA SEGURA', c: '#4ade80', p: all.filter(m => m.probMax > 62).slice(0, 3) },
      { t: 'IA MODERADA', c: '#fbbf24', p: all.filter(m => m.probMax > 48 && m.probMax <= 62).slice(0, 3) },
      { t: 'IA BOMBA', c: '#ff4444', p: all.filter(m => m.probMax <= 48).slice(0, 3) }
    ];
  };

  if (user && !VIP_USERS.includes(user.email)) {
    return <div style={{background:'#000', color:'#ff4444', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><h1>ACCESO VIP RESTRINGIDO</h1></div>;
  }

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      {/* HEADER TIPO APP */}
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #333', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
          <h1 style={{color:'#fbbf24', fontSize:'1rem', margin:0, fontWeight:'900'}}>GOLPREDICT V59</h1>
          <div style={{fontSize:'0.6rem', textAlign:'right'}}><span style={{color:'#4ade80'}}>●</span> MONTECARLO 50K<br/>DIXON-COLES xG</div>
        </div>
        <div style={{display:'flex', gap:'6px', overflowX:'auto'}}>
          {['UCL', 'LALIGA', 'EPL'].map((n, i) => (
            <button key={i} onClick={() => setLiga(['ucl','laliga','epl'][i])} style={{flex:1, padding:'12px', borderRadius:'10px', background: liga === ['ucl','laliga','epl'][i] ? '#fbbf24' : '#1a1a1a', color: liga === ['ucl','laliga','epl'][i] ? '#000' : '#fff', border:'none', fontSize:'0.6rem', fontWeight:'900'}}>{n}</button>
          ))}
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #333'}}>
        {['p', 'ia', 'h', 'c'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{flex:1, padding:'14px 0', background:'none', border:'none', color: tab===t?'#fbbf24':'#888', borderBottom: tab===t?'3px solid #fbbf24':'none', fontSize:'0.6rem', fontWeight:'bold'}}>
            {t==='p'?'PARTIDOS':t==='ia'?'COMBOS IA':t==='h'?'HISTORIAL':`TICKET (${sel.length})`}
          </button>
        ))}
      </div>

      <div style={{padding:'12px'}}>
        {tab === 'p' && db[liga]?.filter(m => m.status === 'pending').map(p => (
          <div key={p.id} style={{background:'#111', padding:'15px', borderRadius:'18px', marginBottom:'12px', border:'1px solid #222'}}>
            <div onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{cursor:'pointer'}}>
              <div style={{fontSize:'0.55rem', color:'#fbbf24', textAlign:'center', marginBottom:'8px'}}>{p.d} • TOCAR PARA ANÁLISIS QUANTUM</div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                <div style={{flex:1, textAlign:'center'}}><div style={{fontWeight:'900', fontSize:'0.9rem'}}>{p.h}</div><div style={{color:'#4ade80', fontSize:'0.7rem'}}>{p.pL}%</div></div>
                <div style={{padding:'0 15px', color:'#444', fontWeight:'900'}}>VS</div>
                <div style={{flex:1, textAlign:'center'}}><div style={{fontWeight:'900', fontSize:'0.9rem'}}>{p.a}</div><div style={{color:'#4ade80', fontSize:'0.7rem'}}>{p.pV}%</div></div>
              </div>
            </div>

            {expanded === p.id && (
              <div style={{background:'#000', padding:'12px', borderRadius:'12px', marginBottom:'12px', border:'1px solid #fbbf24'}}>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px'}}>
                  <div style={{background:'#111', padding:'8px', borderRadius:'8px'}}>
                    <div style={{fontSize:'0.55rem', color:'#888'}}>RESULTADOS PROBABLES</div>
                    {p.exact.map(e => <div key={e} style={{fontSize:'0.8rem', fontWeight:'900', color:'#fbbf24'}}>{e}</div>)}
                  </div>
                  <div style={{background:'#111', padding:'8px', borderRadius:'8px'}}>
                    <div style={{fontSize:'0.55rem', color:'#888'}}>ESTIMACIONES</div>
                    <div style={{fontSize:'0.7rem'}}>Goles +2.5: <b>{p.ov25}%</b></div>
                    <div style={{fontSize:'0.7rem'}}>Córners: <b>{p.corners}</b></div>
                  </div>
                </div>
                <div style={{fontSize:'0.6rem', color:'#fbbf24', fontWeight:'bold', marginBottom:'5px'}}>DOBLE OPORTUNIDAD:</div>
                <div style={{display:'flex', gap:'5px'}}>
                  {[{t:'1X', q:p.o1X}, {t:'X2', q:p.oX2}, {t:'12', q:p.o12}].map((d, i) => (
                    <button key={i} onClick={() => setSel([...sel, {name:`${p.h}-${p.a}`, p:d.t, o:d.q}])} style={{flex:1, background:'#222', border:'1px solid #444', color:'#fff', padding:'8px', borderRadius:'8px', fontSize:'0.65rem', fontWeight:'bold'}}>{d.t} @{d.q.toFixed(2)}</button>
                  ))}
                </div>
              </div>
            )}

            <div style={{display:'flex', gap:'8px'}}>
              {[{q:p.oL,t:'1'}, {q:p.oE,t:'X'}, {q:p.oV,t:'2'}].map((o,i) => (
                <button key={i} onClick={() => setSel([...sel, {name:`${p.h}-${p.a}`, p:o.t, o:o.q}])} style={{flex:1, padding:'12px', borderRadius:'10px', background:'#1a1a1a', color:'#fff', border:'1px solid #333', fontWeight:'900'}}>@{o.q.toFixed(2)}</button>
              ))}
            </div>
          </div>
        ))}

        {tab === 'ia' && getIACombos().map((c, i) => (
          <div key={i} style={{background:'#111', padding:'15px', borderRadius:'15px', marginBottom:'12px', borderLeft:`5px solid ${c.c}`}}>
            <h4 style={{color:c.c, margin:'0 0 10px 0', fontSize:'0.8rem', fontWeight:'900'}}>{c.t}</h4>
            {c.p.map((m, idx) => (
              <div key={idx} style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', margin:'6px 0'}}>
                <span>{m.h}-{m.a}</span><b style={{color:'#fbbf24'}}>{m.pick} (@{m.pickOdd.toFixed(2)})</b>
              </div>
            ))}
            <div style={{textAlign:'right', fontWeight:'900', color:c.c, marginTop:'10px', fontSize:'1.1rem'}}>CUOTA TOTAL: @{c.p.reduce((acc, x) => acc * x.pickOdd, 1).toFixed(2)}</div>
          </div>
        ))}

        {tab === 'c' && (
          <div style={{background:'#111', padding:'20px', borderRadius:'20px', border:'2px solid #fbbf24', textAlign:'center'}}>
            <h2 style={{fontSize:'0.8rem', color:'#fbbf24', marginBottom:'15px'}}>CALCULADORA DE TICKET</h2>
            {sel.map((b,i) => (
              <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #222', fontSize:'0.75rem'}}>
                <span>{b.name} <b style={{color:'#fbbf24'}}>{b.p}</b></span>
                <b>@{b.o.toFixed(2)}</b>
              </div>
            ))}
            <div style={{marginTop:'20px'}}>
              <div style={{fontSize:'0.6rem', color:'#888'}}>INVERSIÓN (€)</div>
              <input type="number" value={bet} onChange={e=>setBet(e.target.value)} style={{background:'#000', border:'2px solid #fbbf24', color:'#fbbf24', fontSize:'1.5rem', width:'100px', borderRadius:'10px', textAlign:'center'}} />
            </div>
            <div style={{background:'#fbbf24', color:'#000', padding:'15px', borderRadius:'14px', marginTop:'20px', fontWeight:'900'}}>
              <div style={{fontSize:'0.7rem'}}>GANANCIA ESTIMADA</div>
              <div style={{fontSize:'1.5rem'}}>{(bet * sel.reduce((acc,b)=>acc*b.o,1)).toFixed(2)}€</div>
            </div>
            <button onClick={()=>setSel([])} style={{marginTop:'20px', color:'#ff4444', background:'none', border:'none', fontSize:'0.65rem', fontWeight:'bold', cursor:'pointer'}}>LIMPIAR SELECCIÓN</button>
          </div>
        )}

        {tab === 'h' && (
           <div style={{opacity: 0.8}}>
             {Object.values(db).flat().filter(m => m.status !== 'pending').map(p => (
               <div key={p.id} style={{background:'#111', padding:'12px', borderRadius:'12px', marginBottom:'8px', border:'1px solid #222', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                 <div style={{fontSize:'0.7rem'}}><b>{p.h} {p.res} {p.a}</b><div style={{fontSize:'0.55rem', color:'#666'}}>Pick: {p.pick}</div></div>
                 <div style={{color: p.status==='won'?'#4ade80':'#ff4444', fontWeight:'900', fontSize:'0.6rem'}}>{p.status==='won'?'✓ GANADA':'✗ FALLADA'}</div>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
  }
         
                                                  }
          
          
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
