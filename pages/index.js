 import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
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
      }
      setLoading(false);
    });

    const q = query(collection(db, 'partidos'), orderBy('fecha', 'asc'));
    const unsubPartidos = onSnapshot(q, (snapshot) => {
      setPartidos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubAuth(); unsubPartidos(); };
  }, []);

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>Cargando...</div>;

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'20px'}}>
        <h1 style={{color:'#fbbf24',fontSize:'1.5rem'}}>GOL PREDICT PRO</h1>
      </header>

      {user && isPremium ? (
        <div>
          {partidos.map((p, i) => (
            <div key={i} style={{background:'#111',border:parseInt(p.probabilidad)>=95?'2px solid #ff8c00':'1px solid #333',padding:'15px',borderRadius:'15px',marginBottom:'15px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem'}}>
                <span>{p.fecha}</span>
                <span style={{color:'#0f0'}}>{p.probabilidad} ACIERTO</span>
              </div>
              <h3 style={{textAlign:'center'}}>{p.local} vs {p.visitante}</h3>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',textAlign:'center',fontSize:'0.8rem'}}>
                <div style={{background:'#222',padding:'10px',borderRadius:'10px'}}>
                  <b>GANADOR:</b><br/>{p.pronostico}
                </div>
                <div style={{background:'#222',padding:'10px',borderRadius:'10px'}}>
                  <b>MARCADOR:</b><br/>{p.marcador}
                </div>
                <div style={{background:'#222',padding:'10px',borderRadius:'10px'}}>
                  <b>CORNERS:</b><br/>{p.corners}
                </div>
                <div style={{background:'#222',padding:'10px',borderRadius:'10px'}}>
                  <b>GOLES:</b><br/>{p.totalGoles}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',padding:'20px'}}>
          <p>Acceso VIP requerido para la Jornada de Flashscore.</p>
          <button onClick={() => window.open(`https://wa.me/${miWhatsapp}`)} style={{background:'#25D366',color:'#fff',padding:'15px',border:'none',borderRadius:'10px',fontWeight:'bold',cursor:'pointer'}}>ACTIVAR POR WHATSAPP</button>
        </div>
      )}
    </div>
  );
}                      
                  
            
                                
