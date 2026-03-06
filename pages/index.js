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

  // CONFIGURA AQUÍ TU NÚMERO DE WHATSAPP (Sin el +)
  const miWhatsapp = "34600000000"; 

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      } else { setUser(null); setIsPremium(false); }
      setLoading(false);
    });

    const q = query(collection(db, 'partidos'), orderBy('fecha', 'asc'));
    const unsubPartidos = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPartidos(docs);
    });

    return () => { unsubAuth(); unsubPartidos(); };
  }, []);

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>Sincronizando jornada...</div>;

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif', position:'relative'}}>
      
      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a 
        href={`https://wa.me/${miWhatsapp}?text=Hola,%20quiero%20activar%20mi%20Pase%20VIP%20en%20GolPredict`}
        target="_blank"
        rel="noreferrer"
        style={{position:'fixed', bottom:'20px', right:'20px', background:'#25D366', width:'60px', height:'60px', borderRadius:'50%', display:'flex', justifyContent:'center', alignItems:'center', boxShadow:'0 4px 10px rgba(0,0,0,0.5)', zIndex:1000}}
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" style={{width:'35px'}} />
      </a>

      <header style={{textAlign:'center',marginBottom:'25px'}}>
        <h1 style={{color:'#fbbf24',margin:0,fontSize:'1.6rem'}}>GOL PREDICT PRO</h1>
        <p style={{fontSize:'0.65rem',color:'#0f0'}}>PRONÓSTICOS VIP ACTUALIZADOS</p>
      </header>

      {user && isPremium ? (
        <div>
          {partidos.map((p, i) => {
            const esValor = parseInt(p.probabilidad) >= 95;
            return (
              <div key={i} style={{background:'#0d0d0d', border: esValor ? '2px solid #ff8c00' : '1px solid #333', padding:'18px', borderRadius:'22px', marginBottom:'15px', position:'relative'}}>
                {esValor && (
                  <div style={{position:'absolute', top:'-10px', right:'20px', background:'#ff8c00', color:'#000', padding:'2px 10px', borderRadius:'10px', fontSize:'0.6rem', fontWeight:'900'}}>
                    ESTADÍSTICA DE VALOR
                  </div>
                )}
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                  <span style={{fontSize:'0.7rem', color:'#fbbf24'}}>{p.fecha}</span>
                  <div style={{background:'#0f0', color:'#000', padding:'3px 10px', borderRadius:'8px', fontWeight:'900', fontSize:'0.7rem'}}>{p.probabilidad} ACIERTO</div>
                </div>
                <div style={{textAlign:'center', fontSize:'1.1rem', fontWeight:'bold', marginBottom:'15px'}}>{p.local} vs {p.visitante}</div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px'}}>
                  <div style={{background:'#151515', padding:'10px', borderRadius:'10px', textAlign:'center'}}>
                    <p style={{fontSize:'0.5rem', color:'#666', margin:0}}>GANADOR</p>
                    <p style={{margin:0, color:'#fbbf24', fontWeight:'bold'}}>{p.pronostico}</p>
                  </div>
                  <div style={{background:'#151515', padding:'10px', borderRadius:'10px', textAlign:'center'}}>
                    <p style={{fontSize:'0.5rem', color:'#666', margin:0}}>MARCADOR</p>
                    <p style={{margin:0, color:'#fbbf24', fontWeight:'bold'}}>{p.marcador}</p>
                  </div>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                  <div style={{background:'#1a1a1a', padding:'10px', borderRadius:'10px', textAlign:'center', border:'1px solid #fbbf2422'}}>
                    <p style={{fontSize:'0.5rem', color:'#fbbf24', margin:0}}>CÓRNERS</p>
                    <p style={{margin:0, fontWeight:'900'}}>{p.corners}</p>
                  </div>
                  <div style={{background:'#1a1a1a', padding:'10px', borderRadius:'10px', textAlign:'center', border:'1px solid #fbbf2422'}}>
                    <p style={{fontSize:'0.5rem', color:'#fbbf24', margin:0}}>GOLES</p>
                    <p style={{margin:0, fontWeight:'900'}}>{p.totalGoles}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{textAlign:'center', marginTop:'80px', padding:'20px'}}>
          <div style={{fontSize:'3rem', marginBottom:'20px'}}>🔒</div>
          <h2 style={{color:'#fbbf24'}}>PASE VIP REQUERIDO</h2>
          <p style={{color:'#aaa', marginBottom:'30px'}}>Para ver los córners, goles y marcador de la jornada de Flashscore.</p>
          <button onClick={() => window.open(`https://wa.me/${miWhatsapp}`, '_blank')} style={{width:'100%', padding:'20px', background:'#25D366', color:'#fff', border:'none', borderRadius:'15px', fontWeight:'bold', fontSize:'1.1rem'}}>ADQUIRIR ACCESO POR WHATSAPP</button>
        </div>
      )}
    </div>
  );
}
                          
                  
            
                                
