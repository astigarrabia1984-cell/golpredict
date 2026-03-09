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

export default function AlphaOmegaDefinitiva() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [betAmount, setBetAmount] = useState(10);
  const [ticketUsuario, setTicketUsuario] = useState([]); 
  const [activeTab, setActiveTab] = useState('mercado');

  // PARTIDOS REALES DE LIGA (Backup para visibilidad inmediata)
  const ligaBackup = [
    { id: 201, local: 'Real Madrid', visitante: 'Barcelona', pL: 48, pE: 22, pV: 30, odd: 1.95, value: true },
    { id: 202, local: 'Atlético', visitante: 'Sevilla', pL: 55, pE: 25, pV: 20, odd: 1.80, value: false },
    { id: 203, local: 'Real Sociedad', visitante: 'Athletic Club', pL: 40, pE: 35, pV: 25, odd: 2.25, value: true },
    { id: 204, local: 'Villarreal', visitante: 'Valencia', pL: 50, pE: 25, pV: 25, odd: 2.00, value: false }
  ];

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        const email = u.email.toLowerCase().trim();
        const vips = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
        if (vips.includes(email)) setIsPremium(true);
      }
      setLoading(false);
      // Aseguramos que los partidos se carguen al iniciar
      setPartidos(ligaBackup);
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

  if (loading) return (
    <div style={{background:'#000', color:'#fbbf24', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', fontFamily:'monospace'}}>
      CONECTANDO AL SERVIDOR...
    </div>
  );

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'Inter, sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'220px'}}>
      
      {/* HEADER */}
      <header style={{padding:'20px', textAlign:'center', borderBottom:'1px solid #111'}}>
        <h1 style={{fontSize:'1.4rem', fontWeight:'900', margin:0, letterSpacing:'-1px'}}>ALPHA <span style={{color:'#fbbf24'}}>OMEGA</span></h1>
        <div style={{fontSize:'0.5rem', color:'#fbbf24', marginTop:'5px', fontWeight:'bold'}}>LIGA ESPAÑOLA - MODO VIP</div>
      </header>

      {/* PESTAÑAS */}
      <nav style={{display:'flex', background:'#0a0a0a', borderBottom:'1px solid #1a1a1a'}}>
        <button onClick={() => setActiveTab('mercado')} style={{flex:1, padding:'15px', background:'transparent', border:'none', color: activeTab === 'mercado' ? '#fbbf24' : '#555', fontWeight:'900', fontSize:'0.7rem'}}>MERCADO IA</button>
        <button onClick={() => setActiveTab('mi-ticket')} style={{flex:1, padding:'15px', background:'transparent', border:'none', color: activeTab === 'mi-ticket' ? '#fbbf24' : '#555', fontWeight:'900', fontSize:'0.7rem'}}>MI TICKET ({ticketUsuario.length})</button>
      </nav>

      {user && isPremium ? (
        <div style={{padding:'15px'}}>
          
          {activeTab === 'mercado' && (
            <>
              {partidos.map(p => {
                const isSelected = ticketUsuario.find(x => x.id === p.id);
                return (
                  <div key={p.id} style={{background:'#0a0a0a', border: isSelected ? '1px solid #fbbf24' : '1px solid #151515', padding:'20px', borderRadius:'25px', marginBottom:'15px'}}>
                    <div style={{textAlign:'center', fontWeight:'800', fontSize:'0.95rem', marginBottom:'15px'}}>
                      {p.local} <span style={{color:'#fbbf24', margin:'0 10px'}}>v</span> {p.visitante}
                    </div>

                    {/* BARRA DE PROBABILIDAD (VISIBLE) */}
                    <div style={{display:'flex', height:'14px', background:'#1a1a1a', borderRadius:'10px', overflow:'hidden', marginBottom:'15px', border:'1px solid #222'}}>
                      <div style={{width:`${p.pL}%`, background:'#fbbf24', color:'#000', fontSize:'0.5rem', fontWeight:'900', display:'flex', alignItems:'center', justifyContent:'center'}}>L {p.pL}%</div>
                      <div style={{width:`${p.pE}%`, background:'#333', color:'#fff', fontSize:'0.5rem', display:'flex', alignItems:'center', justifyContent:'center'}}>X</div>
                      <div style={{width:`${p.pV}%`, background:'#111', color:'#444', fontSize:'0.5rem', display:'flex', alignItems:'center', justifyContent:'center'}}>V</div>
                    </div>

                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontWeight:'900', fontSize:'1.1rem', color:'#fbbf24'}}>@{p.odd}</span>
                      <button 
                        onClick={() => toggleSelection(p)}
                        style={{background: isSelected ? '#ff4444' : '#fbbf24', color:'#000', border:'none', padding:'10px 20px', borderRadius:'12px', fontWeight:'900', fontSize:'0.65rem', cursor:'pointer'}}
                      >
                        {isSelected ? 'QUITAR' : 'AÑADIR AL TICKET'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {activeTab === 'mi-ticket' && (
            <div style={{padding:'10px'}}>
              {ticketUsuario.length === 0 ? (
                <div style={{textAlign:'center', color:'#444', marginTop:'60px'}}>No hay selecciones en tu ticket.</div>
              ) : (
                <div style={{background:'#fbbf24', color:'#000', padding:'30px', borderRadius:'35px', boxShadow:'0 15px 40px rgba(251,191,36,0.3)'}}>
                  <h3 style={{margin:0, fontSize:'1rem', fontWeight:'900', textTransform:'uppercase'}}>Ticket Combinada</h3>
                  <hr style={{borderColor:'rgba(0,0,0,0.1)', margin:'20px 0'}} />
                  {ticketUsuario.map(t => (
                    <div key={t.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'12px', fontWeight:'bold', fontSize:'0.8rem'}}>
                      <span>{t.local} v {t.visitante}</span>
                      <span>@{t.odd}</span>
                    </div>
                  ))}
                  <div style={{marginTop:'30px', borderTop:'3px solid #000', paddingTop:'20px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div>
                        <div style={{fontSize:'0.6rem', fontWeight:'900', opacity:0.7}}>CUOTA TOTAL</div>
                        <div style={{fontSize:'2.2rem', fontWeight:'900'}}>@{cuotaFinal}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'0.6rem', fontWeight:'900', opacity:0.7}}>PREMIO CON ${betAmount}</div>
                        <div style={{fontSize:'1.3rem', fontWeight:'900'}}>${(betAmount * cuotaFinal).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* LOGIN */
        <div style={{padding:'120px 40px', textAlign:'center'}}>
          <div style={{fontSize:'4rem', marginBottom:'20px'}}>🔐</div>
          <h2 style={{fontWeight:'900'}}>ACCESO VIP</h2>
          <p style={{color:'#444', fontSize:'0.8rem', marginBottom:'40px'}}>Ingresa con tu correo de fundador para activar el Terminal.</p>
          <button onClick={() => signInWithPopup(auth, provider)} style={{width:'100%', padding:'20px', background:'#fbbf24', color:'#000', borderRadius:'20px', border:'none', fontWeight:'900', cursor:'pointer'}}>ENTRAR CON GOOGLE</button>
        </div>
      )}

      {/* FOOTER PERSISTENTE TICKET */}
      {ticketUsuario.length > 0 && activeTab === 'mercado' && (
        <div onClick={() => setActiveTab('mi-ticket')} style={{position:'fixed', bottom:'30px', left:'20px', right:'20px', background:'#fbbf24', color:'#000', padding:'20px', borderRadius:'25px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', boxShadow:'0 20px 50px rgba(0,0,0,0.8)'}}>
           <div style={{fontWeight:'900', fontSize:'0.9rem'}}>COMBINADA: @{cuotaFinal}</div>
           <div style={{background:'#000', color:'#fbbf24', padding:'8px 15px', borderRadius:'10px', fontSize:'0.6rem', fontWeight:'900'}}>VER TICKET</div>
        </div>
      )}
    </div>
  );
                                  }
                          
                
                    
        


            
                                           
            
                                
