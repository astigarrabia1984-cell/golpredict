     import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function AlphaOmegaV2() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [hackerMode, setHackerMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analisis'); // 'analisis' o 'combinada'
  const [liga, setLiga] = useState('PD');

  const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];

  // SIMULACIÓN DE DATOS CON PREDICCIÓN DE GANADOR Y GOLES
  const [partidos] = useState([
    { id: 1, liga: 'PD', local: "Real Madrid", visitante: "FC Barcelona", prob: 88.5, marketOdd: 2.10, stake: 9, ganador: "Real Madrid", goles: "+2.5", heatmap: [40, 60, 80, 95, 70, 50, 90, 100, 85, 60] },
    { id: 2, liga: 'PL', local: "Man. City", visitante: "Arsenal", prob: 82.1, marketOdd: 1.85, stake: 7, ganador: "Man. City", goles: "-3.5", heatmap: [30, 50, 75, 80, 60, 40, 70, 90, 80, 55] },
    { id: 3, liga: 'CL', local: "Bayern", visitante: "PSG", prob: 85.4, marketOdd: 1.90, stake: 8, ganador: "Empate/Bayern", goles: "+3.5", heatmap: [50, 70, 90, 100, 40, 60, 80, 100, 90, 70] },
    { id: 4, liga: 'FL1', local: "Marsella", visitante: "Mónaco", prob: 78.2, marketOdd: 2.30, stake: 6, ganador: "Marsella", goles: "+1.5", heatmap: [20, 40, 60, 50, 80, 90, 70, 60, 50, 40] }
  ]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u && vips.includes(u.email.toLowerCase().trim())) setIsPremium(true);
      setLoading(false);
    });
  }, []);

  const theme = hackerMode ? '#0f0' : '#fbbf24';

  if (loading) return <div style={{background:'#000',color:theme,height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'monospace'}}>DECRIPTANDO SEÑALES...</div>;

  return (
    <div style={{background: '#000', color:'#fff', minHeight:'100vh', fontFamily:'"Orbitron", sans-serif', maxWidth:'480px', margin:'0 auto'}}>
      
      {/* BANNER CONTACTO */}
      <div style={{background: theme, color:'#000', padding:'10px', textAlign:'center', fontSize:'0.7rem', fontWeight:'900'}}>
        🚀 CONTACTO VIP: +34 680 85 20 29
      </div>

      {/* TABS DE NAVEGACIÓN */}
      <div style={{display:'flex', background:'#0a0a0a', borderBottom:`1px solid ${theme}33`}}>
        <div onClick={()=>setActiveTab('analisis')} style={{flex:1, padding:'15px', textAlign:'center', fontSize:'0.7rem', fontWeight:'bold', cursor:'pointer', color: activeTab === 'analisis' ? theme : '#444', borderBottom: activeTab === 'analisis' ? `2px solid ${theme}` : 'none'}}>ANALIZADOR</div>
        <div onClick={()=>setActiveTab('combinada')} style={{flex:1, padding:'15px', textAlign:'center', fontSize:'0.7rem', fontWeight:'bold', cursor:'pointer', color: activeTab === 'combinada' ? theme : '#444', borderBottom: activeTab === 'combinada' ? `2px solid ${theme}` : 'none'}}>COMBINADA MAESTRA</div>
      </div>

      {isPremium ? (
        <div style={{padding:'20px'}}>
          
          {activeTab === 'analisis' ? (
            <>
              {/* SELECTOR DE LIGAS */}
              <div style={{display:'flex', gap:'5px', marginBottom:'20px', overflowX:'auto', paddingBottom:'5px'}}>
                {['PD', 'PL', 'BL1', 'FL1', 'CL'].map(l => (
                  <button key={l} onClick={()=>setLiga(l)} style={{padding:'8px 12px', borderRadius:'10px', border:`1px solid ${liga===l?theme:'#222'}`, background:liga===l?`${theme}22`:'#000', color:liga===l?theme:'#555', fontSize:'0.6rem', fontWeight:'bold'}}>{l}</button>
                ))}
              </div>

              {/* UNIDAD DE STAKE */}
              <div style={{background:'#0a0a0a', padding:'20px', borderRadius:'20px', border:'1px solid #151515', marginBottom:'20px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                  <span style={{fontSize:'0.6rem', color:'#666'}}>STAKE UNIT:</span>
                  <span style={{color: theme, fontWeight:'900'}}>${betAmount}</span>
                </div>
                <input type="range" min="10" max="1000" step="10" value={betAmount} onChange={(e)=>setBetAmount(e.target.value)} style={{width:'100%', accentColor: theme}} />
              </div>

              {/* LISTA DE PARTIDOS */}
              {partidos.filter(p => p.liga === liga || liga === 'PD').map(p => (
                <div key={p.id} style={{background:'#080808', border:'1px solid #1a1a1a', padding:'20px', borderRadius:'25px', marginBottom:'20px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                    <span style={{fontSize:'0.55rem', color:theme, fontWeight:'bold'}}>VALUE: {p.prob}%</span>
                    <span style={{fontSize:'0.55rem', color:'#444'}}>ID #{p.id}992</span>
                  </div>
                  <div style={{fontSize:'1rem', fontWeight:'900', textAlign:'center', marginBottom:'15px'}}>{p.local} v {p.visitante}</div>
                  
                  {/* PREDICCIONES IA */}
                  <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                    <div style={{flex:1, background:'#111', padding:'10px', borderRadius:'12px', textAlign:'center', border:`1px solid ${theme}22`}}>
                      <div style={{fontSize:'0.45rem', color:'#555'}}>GANADOR IA</div>
                      <div style={{fontSize:'0.75rem', fontWeight:'bold', color:theme}}>{p.ganador}</div>
                    </div>
                    <div style={{flex:1, background:'#111', padding:'10px', borderRadius:'12px', textAlign:'center', border:`1px solid ${theme}22`}}>
                      <div style={{fontSize:'0.45rem', color:'#555'}}>TOTAL GOLES</div>
                      <div style={{fontSize:'0.75rem', fontWeight:'bold', color:theme}}>{p.goles}</div>
                    </div>
                  </div>

                  {/* HEATMAP */}
                  <div style={{height:'35px', display:'flex', alignItems:'flex-end', gap:'3px', marginBottom:'15px', background:'#000', padding:'5px', borderRadius:'8px'}}>
                    {p.heatmap.map((h, i) => <div key={i} style={{flex:1, height:`${h}%`, background: h > 85 ? theme : '#222', borderRadius:'1px'}} />)}
                  </div>

                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                    <div style={{background:'#111', padding:'10px', borderRadius:'12px', textAlign:'center'}}>
                      <div style={{fontSize:'0.45rem', color:'#555'}}>INVERSIÓN (S{p.stake})</div>
                      <div style={{fontSize:'0.9rem', fontWeight:'bold'}}>${(betAmount*(p.stake/10)).toFixed(2)}</div>
                    </div>
                    <div style={{background:'#111', padding:'10px', borderRadius:'12px', textAlign:'center'}}>
                      <div style={{fontSize:'0.45rem', color:'#555'}}>GANANCIA NETO</div>
                      <div style={{fontSize:'0.9rem', fontWeight:'bold', color:'#0f0'}}>+${((betAmount*(p.stake/10))*p.marketOdd - (betAmount*(p.stake/10))).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* SECCIÓN COMBINADA MAESTRA */
            <div style={{textAlign:'center'}}>
              <h2 style={{fontSize:'1.2rem', color:theme, marginBottom:'10px'}}>COMBINADA DEL DÍA 🧬</h2>
              <p style={{fontSize:'0.6rem', color:'#666', marginBottom:'20px'}}>Algoritmo Omega: 94.2% Probabilidad de Éxito</p>
              
              <div style={{background:'#0a0a0a', border:`1px solid ${theme}`, borderRadius:'25px', padding:'25px', position:'relative', overflow:'hidden'}}>
                <div style={{position:'absolute', top:0, left:0, width:'100%', height:'2px', background:theme, opacity:0.3}}></div>
                {partidos.slice(0,3).map(p => (
                  <div key={p.id} style={{padding:'10px 0', borderBottom:'1px solid #111', textAlign:'left'}}>
                    <div style={{fontSize:'0.7rem', fontWeight:'bold'}}>{p.local} vs {p.visitante}</div>
                    <div style={{fontSize:'0.6rem', color:theme}}>Pick: {p.ganador} & {p.goles} goles</div>
                  </div>
                ))}
                <div style={{marginTop:'20px'}}>
                  <div style={{fontSize:'0.5rem', color:'#555'}}>CUOTA TOTAL ESTIMADA</div>
                  <div style={{fontSize:'2rem', fontWeight:'900', color:theme}}>@7.42</div>
                </div>
                <button style={{width:'100%', padding:'15px', background:theme, color:'#000', border:'none', borderRadius:'15px', fontWeight:'900', marginTop:'15px', cursor:'pointer'}}>COPIAR APUESTA</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* LOGIN */
        <div style={{padding:'100px 40px', textAlign:'center'}}>
          <div style={{fontSize:'4rem', marginBottom:'20px'}}>🔐</div>
          <h2 style={{fontWeight:'900'}}>TERMINAL ALPHA OMEGA</h2>
          <p style={{color:'#444', fontSize:'0.7rem', marginBottom:'30px'}}>Identificación de Fundador requerida para acceso cuántico.</p>
          <button onClick={()=>signInWithPopup(auth, provider)} style={{width:'100%', padding:'18px', background: theme, color:'#000', border:'none', borderRadius:'15px', fontWeight:'900'}}>ENTRAR CON GOOGLE</button>
        </div>
      )}
    </div>
  );
}       
            
                                           
            
                                
