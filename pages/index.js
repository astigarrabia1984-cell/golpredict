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

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export default function AlphaOmegaFinal() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [liga, setLiga] = useState('PD');
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState(10);
  const [ticketUsuario, setTicketUsuario] = useState([]); 
  const [activeTab, setActiveTab] = useState('mercado'); // 'mercado', 'mi-ticket', 'ia-pro'

  // Partidos de ejemplo (Fallback) por si la API tarda en responder
  const mockData = [
    { id: 101, local: 'Real Madrid', visitante: 'Atlético', pL: 52, pE: 28, pV: 20, odd: 1.95, value: true },
    { id: 102, local: 'Liverpool', visitante: 'Chelsea', pL: 60, pE: 25, pV: 15, odd: 1.70, value: false },
    { id: 103, local: 'Bayern', visitante: 'Leipzig', pL: 68, pE: 12, pV: 20, odd: 1.45, value: true },
  ];

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
        if (vips.includes(u.email.toLowerCase())) setIsPremium(true);
      }
      setLoading(false);
      setPartidos(mockData); // Carga inicial de datos
    });
  }, []);

  const toggleSelection = (p) => {
    if (ticketUsuario.find(x => x.id === p.id)) {
      setTicketUsuario(ticketUsuario.filter(x => x.id !== p.id));
    } else {
      setTicketUsuario([...ticketUsuario, p]);
    }
  };

  const cuotaFinal = ticketUsuario.reduce((acc, item) => acc * item.odd, 1).toFixed(2);

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'monospace'}}>DECRYPTING...</div>;

  return (
    <div style={{background:'#050505', color:'#fff', minHeight:'100vh', fontFamily:'Inter, sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      
      {/* HEADER DINÁMICO */}
      <header style={{padding:'20px', textAlign:'center', borderBottom:'1px solid #111'}}>
        <h1 style={{fontSize:'1.3rem', fontWeight:'900', margin:0}}>ALPHA <span style={{color:'#fbbf24'}}>OMEGA</span></h1>
        <p style={{fontSize:'0.5rem', color:'#333', letterSpacing:'3px', marginTop:'5px'}}>SISTEMA DE PRECISIÓN VIP</p>
      </header>

      {/* MENÚ DE PESTAÑAS (TABS) */}
      <nav style={{display:'flex', background:'#0a0a0a', borderBottom:'1px solid #111'}}>
        <button onClick={() => setActiveTab('mercado')} style={{flex:1, padding:'15px', background:'transparent', border:'none', color: activeTab === 'mercado' ? '#fbbf24' : '#444', fontWeight:'bold', fontSize:'0.65rem', borderBottom: activeTab === 'mercado' ? '2px solid #fbbf24' : 'none'}}>MERCADO IA</button>
        <button onClick={() => setActiveTab('mi-ticket')} style={{flex:1, padding:'15px', background:'transparent', border:'none', color: activeTab === 'mi-ticket' ? '#fbbf24' : '#444', fontWeight:'bold', fontSize:'0.65rem', borderBottom: activeTab === 'mi-ticket' ? '2px solid #fbbf24' : 'none'}}>MI TICKET ({ticketUsuario.length})</button>
        <button onClick={() => setActiveTab('ia-pro')} style={{flex:1, padding:'15px', background:'transparent', border:'none', color: activeTab === 'ia-pro' ? '#fbbf24' : '#444', fontWeight:'bold', fontSize:'0.65rem', borderBottom: activeTab === 'ia-pro' ? '2px solid #fbbf24' : 'none'}}>COMBINADA IA 🔥</button>
      </nav>

      {user && isPremium ? (
        <div style={{padding:'15px'}}>
          
          {/* VISTA: MERCADO (PARTIDOS INDIVIDUALES) */}
          {activeTab === 'mercado' && (
            <>
              {partidos.map(p => (
                <div key={p.id} style={{background:'#080808', border:'1px solid #151515', padding:'18px', borderRadius:'20px', marginBottom:'15px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'0.9rem', marginBottom:'12px'}}>
                    <span>{p.local}</span>
                    <span style={{color:'#fbbf24'}}>vs</span>
                    <span>{p.visitante}</span>
                  </div>
                  
                  {/* BARRA 1X2 */}
                  <div style={{display:'flex', height:'8px', background:'#111', borderRadius:'10px', overflow:'hidden', marginBottom:'15px'}}>
                    <div style={{width:`${p.pL}%`, background:'#fbbf24'}} />
                    <div style={{width:`${p.pE}%`, background:'#333'}} />
                    <div style={{width:`${p.pV}%`, background:'#1a1a1a'}} />
                  </div>

                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontWeight:'900', fontSize:'1rem'}}>@{p.odd}</span>
                    <button 
                      onClick={() => toggleSelection(p)}
                      style={{background: ticketUsuario.find(x => x.id === p.id) ? '#ff4444' : '#fbbf24', color:'#000', border:'none', padding:'10px 18px', borderRadius:'12px', fontWeight:'900', fontSize:'0.6rem', cursor:'pointer'}}
                    >
                      {ticketUsuario.find(x => x.id === p.id) ? 'QUITAR' : 'AÑADIR AL TICKET'}
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* VISTA: MI TICKET (COMBINADA DEL USUARIO) */}
          {activeTab === 'mi-ticket' && (
            <div style={{padding:'10px'}}>
              {ticketUsuario.length === 0 ? (
                <p style={{textAlign:'center', color:'#333', marginTop:'50px'}}>No has seleccionado ningún partido todavía.</p>
              ) : (
                <div style={{background:'#fbbf24', color:'#000', padding:'25px', borderRadius:'30px'}}>
                  <h3 style={{margin:0, fontSize:'0.8rem', fontWeight:'900'}}>TU COMBINADA ACTUAL</h3>
                  <hr style={{borderColor:'rgba(0,0,0,0.1)', margin:'15px 0'}} />
                  {ticketUsuario.map(t => (
                    <div key={t.id} style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', marginBottom:'10px', fontWeight:'bold'}}>
                      <span>{t.local} v {t.visitante}</span>
                      <span>@{t.odd}</span>
                    </div>
                  ))}
                  <div style={{marginTop:'25px', borderTop:'2px solid #000', paddingTop:'15px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                      <div>
                        <div style={{fontSize:'0.5rem', fontWeight:'bold'}}>CUOTA TOTAL</div>
                        <div style={{fontSize:'2rem', fontWeight:'900'}}>@{cuotaFinal}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'0.5rem', fontWeight:'bold'}}>GANANCIA EST.</div>
                        <div style={{fontSize:'1.2rem', fontWeight:'900'}}>${(betAmount * cuotaFinal).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA: IA PRO (SUGERENCIA DEL ALGORITMO) */}
          {activeTab === 'ia-pro' && (
            <div style={{padding:'10px', textAlign:'center'}}>
              <div style={{background:'#111', padding:'30px', borderRadius:'30px', border:'2px dashed #fbbf24'}}>
                <span style={{fontSize:'0.5rem', background:'#fbbf24', color:'#000', padding:'3px 8px', borderRadius:'5px', fontWeight:'900'}}>RECOMENDACIÓN DEL DÍA</span>
                <h2 style={{fontSize:'1.2rem', margin:'20px 0'}}>COMBINADA PREMIUM IA</h2>
                <p style={{fontSize:'0.7rem', color:'#666', lineHeight:'1.8'}}>
                  Real Madrid Win @1.65<br/>
                  Man. City Over 2.5 @1.80<br/>
                  Bayern Win @1.35
                </p>
                <div style={{fontSize:'1.5rem', fontWeight:'900', color:'#fbbf24', marginTop:'20px'}}>CUOTA: @4.01</div>
                <button style={{marginTop:'20px', width:'100%', padding:'15px', borderRadius:'15px', background:'#fbbf24', border:'none', fontWeight:'900'}}>COPIAR TICKET</button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* PANTALLA DE BLOQUEO */
        <div style={{padding:'100px 40px', textAlign:'center'}}>
          <div style={{fontSize:'5rem', marginBottom:'20px'}}>🔒</div>
          <h2 style={{fontWeight:'900', fontSize:'1.4rem'}}>ÁREA EXCLUSIVA</h2>
          <p style={{color:'#444', fontSize:'0.8rem', lineHeight:'1.7', marginBottom:'30px'}}>Acceso solo para Fundadores VIP y Usuarios Premium.</p>
          <button onClick={() => signInWithPopup(auth, provider)} style={{width:'100%', padding:'20px', background:'#fbbf24', border:'none', borderRadius:'20px', fontWeight:'900', cursor:'pointer'}}>INGRESAR CON GOOGLE</button>
        </div>
      )}

      {/* FOOTER: AJUSTE DE INVERSIÓN (SOLO SI HAY TICKET) */}
      {ticketUsuario.length > 0 && activeTab === 'mercado' && (
        <div style={{position:'fixed', bottom:'20px', left:'15px', right:'15px', background:'rgba(251,191,36,0.95)', backdropFilter:'blur(10px)', padding:'15px', borderRadius:'20px', display:'flex', justifyContent:'space-between', alignItems:'center', color:'#000', boxShadow:'0 10px 30px rgba(0,0,0,0.5)'}}>
           <div style={{fontWeight:'900', fontSize:'0.8rem'}}>TICKET: @{cuotaFinal}</div>
           <button onClick={() => setActiveTab('mi-ticket')} style={{background:'#000', color:'#fbbf24', border:'none', padding:'10px 15px', borderRadius:'10px', fontSize:'0.6rem', fontWeight:'900'}}>VER MI APUESTA</button>
        </div>
      )}
    </div>
  );
                }
                    
        


            
                                           
            
                                
