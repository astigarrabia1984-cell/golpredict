  import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, onSnapshot, query } from 'firebase/firestore';

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

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) setIsPremium(true);
      }
      setLoading(false);
    });

    const q = query(collection(db, 'partidos'));
    const unsubPartidos = onSnapshot(q, (snapshot) => {
      setPartidos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubAuth(); unsubPartidos(); };
  }, []);

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>CARGANDO...</div>;

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <h1 style={{color:'#fbbf24',textAlign:'center',fontSize:'1.2rem'}}>GOL PREDICT PRO</h1>
      
      {!user ? (
        <button onClick={() => signInWithPopup(auth, provider)} style={{display:'block',margin:'50px auto',padding:'15px',background:'#fbbf24',border:'none',borderRadius:'10px',fontWeight:'bold'}}>ENTRAR CON GOOGLE</button>
      ) : isPremium ? (
        <div>
          {partidos.length === 0 && <p style={{textAlign:'center',color:'#666'}}>No hay partidos. Añádelos en Firebase.</p>}
          {partidos.map((p, i) => (
            <div key={i} style={{background:'#111',border:'1px solid #333',padding:'15px',borderRadius:'15px',marginBottom:'10px'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'#fbbf24'}}>
                <span>{p.fecha}</span>
                <span>{p.probabilidad} ACIERTO</span>
              </div>
              <p style={{textAlign:'center',fontWeight:'bold',margin:'10px 0'}}>{p.local} vs {p.visitante}</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5px',fontSize:'0.75rem',textAlign:'center'}}>
                <div style={{background:'#222',padding:'5px',borderRadius:'5px'}}>GANA: {p.pronostico}</div>
                <div style={{background:'#222',padding:'5px',borderRadius:'5px'}}>RES: {p.marcador}</div>
                <div style={{background:'#222',padding:'5px',borderRadius:'5px'}}>CORNERS: {p.corners}</div>
                <div style={{background:'#222',padding:'5px',borderRadius:'5px'}}>GOLES: {p.totalGoles}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'50px'}}>
          <p>Pase VIP Requerido para ver la Jornada 27</p>
          <a href="https://wa.me/34600000000" style={{color:'#25D366',fontWeight:'bold',textDecoration:'none'}}>HABLAR POR WHATSAPP</a>
        </div>
      )}
    </div>
  );
}                  
                  
            
                                
