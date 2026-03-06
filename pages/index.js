    import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.firebasestorage.app",
  messagingSenderId: "1018477661997",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export default function GolPredict() {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const miWhatsapp = "34600000000"; 

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      } else {
        setUser(null);
        setIsPremium(false);
      }
      setLoading(false);
    });

    const q = query(collection(db, 'partidos'), orderBy('fecha', 'asc'));
    const unsubPartidos = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPartidos(docs);
    });

    return () => { unsubAuth(); unsubPartidos(); };
  }, []);

  if (loading) return (
    <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center',fontFamily:'sans-serif'}}>
      CONECTANDO CON LA JORNADA 27...
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif',position:'relative'}}>
      
      {/* Botón WhatsApp Flotante */}
      <a href={`https://wa.me/${miWhatsapp}`} target="_blank" rel="noreferrer" style={{position:'fixed',bottom:'20px',right:'20px',background:'#25D366',width:'60px',height:'60px',borderRadius:'50%',display:'flex',justifyContent:'center',alignItems:'center',zIndex:1000,boxShadow:'0 4px 12px rgba(0,0,0,0.5)'}}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{width:'35px'}} />
      </a>

      <header style={{textAlign:'center',marginBottom:'30px',borderBottom:'1px solid #222',paddingBottom:'15px'}}>
        <h1 style={{color:'#fbbf24',margin:0,fontSize:'1.8rem',fontWeight:'900'}}>GOL PREDICT PRO</h1>
        <p style={{fontSize:'0.7rem',color:'#0f0',fontWeight:'bold',marginTop:'5px'}}>IA DATA: CÓRNERS + GOLES + MARCADOR</p>
      </header>

      {user && isPremium ? (
        <div style={{maxWidth:'500px',margin:'0 auto'}}>
          {partidos.length === 0 ? (
            <p style={{textAlign:'center',color:'#666',marginTop:'50px'}}>No hay partidos cargados. Usa el panel /admin.</p>
          ) : (
            partidos.map((p, i) => {
              const esValor = parseInt(p.probabilidad) >= 95;
              return (
                <div key={i} style={{background:'#0a0a0a',border:esValor?'2px solid #ff8c00':'1px solid #333',padding:'20px',borderRadius:'25px',marginBottom:'20px',position:'relative'}}>
                  {esValor && (
                    <div style={{position:'absolute',top:'-12px',right:'25px',background:'#ff8c00',color:'#000',padding:'3px 12px',borderRadius:'12px',fontSize:'0.6rem',fontWeight:'900',boxShadow:'0 0 15px #ff8c00'}}>
                      ESTADÍSTICA DE VALOR
                    </div>
                  )}

                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'15px'}}>
                    <span style={{fontSize:'0.75rem',color:'#fbbf24',fontWeight:'bold'}}>{p.fecha}</span>
                    <div style={{background:'#0f0',color:'#000',padding:'4px 12px',borderRadius:'8px',fontWeight:'900',fontSize:'0.75rem'}}>{p.probabilidad} ACIERTO</div>
                  </div>

                  <div style={{textAlign:'center',fontSize:'1.2rem',fontWeight:'bold',marginBottom:'20px'}}>{p.local} vs {p.visitante}</div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                    <div style={{background:'#151515',padding:'12px',borderRadius:'15px',textAlign:'center',border:'1px solid #222'}}>
                      <p style={{fontSize:'0.55rem',color:'#666',margin:'0 0 5px 0'}}>GANADOR/EMPATE</p>
                      <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.9rem'}}>{p.pronostico}</p>
                    </div>
                    <div style={{background:'#151515',padding:'12px',borderRadius:'15px',textAlign:'center',border:'1px solid #222'}}>
                      <p style={{fontSize:'0.55rem',color:'#666',margin:'0 0 5px 0'}}>MARCADOR</p>
                      <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.marcador}</p>
                    </div>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                    <div style={{background:'#1a1a1a',padding:'12px',borderRadius:'15px',textAlign:'center',border:'1px solid #fbbf2422'}}>
                      <p style={{fontSize:'0.55rem',color:'#fbbf24',margin:'0 0 5px 0'}}>TOTAL CÓRNERS</p>
                      <p style={{margin:0,color:'#fff',fontWeight:'900',fontSize:'1rem'}}>{p.corners}</p>
                    </div>
                    <div style={{background:'#1a1a1a',padding:'12px',borderRadius:'15px',textAlign:'center',border:'1px solid #fbbf2422'}}>
                      <p style={{fontSize:'0.55rem',color:'#fbbf24',margin:'0 0 5px 0'}}>TOTAL GOLES</p>
                      <p style={{margin:0,color:'#fff',fontWeight:'900',fontSize:'1rem'}}>{p.totalGoles}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'80px',padding:'20px'}}>
          <div style={{fontSize:'3.5rem',marginBottom:'20px'}}>🔒</div>
          <h2 style={{color:'#fbbf24',fontSize:'1.8rem',marginBottom:'10px'}}>PASE VIP REQUERIDO</h2>
          <p style={{color:'#aaa',lineHeight:'1.6',marginBottom:'30px'}}>
            Accede a los pronósticos de la Jornada 27 de LaLiga.<br/>
            Córners, Goles y Marcadores Exactos incluidos.
          </p>
          {!user ? (
            <button onClick={() => signInWithPopup(auth, provider)} style={{width:'100%',padding:'20px',background:'#fbbf24',color:'#000',border:'none',borderRadius:'15px',fontWeight:'bold',fontSize:'1.1rem',cursor:'pointer'}}>ENTRAR CON GOOGLE</button>
          ) : (
            <button onClick={() => window.open(`https://wa.me/${miWhatsapp}`)} style={{width:'100%',padding:'20px',background:'#25D366',color:'#fff',border:'none',borderRadius:'15px',fontWeight:'bold',fontSize:'1.1rem',cursor:'pointer'}}>SOLICITAR PASE POR WHATSAPP</button>
          )}
        </div>
      )}
    </div>
  );
}             
                  
            
                                
