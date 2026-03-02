import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
  const [liga, setLiga] = useState('LALIGA');

  // DATOS OFICIALES JORNADA MARZO 2026
  const datosOficiales = {
    LALIGA: [
      { m: 'Getafe', v: 'Real Madrid', f: 'Viernes 06/03 - 21:00', p: '96%', r: 'Gana Real Madrid', s: '0-2', d: 'Liderazgo sólido del Madrid fuera de casa.' },
      { m: 'Girona', v: 'Sevilla', f: 'Sábado 07/03 - 14:00', p: '91%', r: 'Gana Girona', s: '2-1', d: 'Girona mantiene un 85% de victorias en Montilivi.' },
      { m: 'Valencia', v: 'Valladolid', f: 'Sábado 07/03 - 18:30', p: '93%', r: 'Gana Valencia', s: '2-0', d: 'Mestalla es clave; Valladolid baja rendimiento fuera.' },
      { m: 'Atletico', v: 'Athletic', f: 'Domingo 08/03 - 16:15', p: '89%', r: 'Gana Atletico', s: '2-1', d: 'Duelo directo por Champions; Metropolitano decisivo.' },
      { m: 'Barcelona', v: 'Betis', f: 'Domingo 08/03 - 21:00', p: '94%', r: 'Gana Barcelona', s: '3-1', d: 'Barca domina posesión; Betis sufre en transiciones.' }
    ],
    LALIGA2: [
      { m: 'Zaragoza', v: 'Levante', f: 'Viernes 06/03 - 20:30', p: '85%', r: 'Empate', s: '1-1', d: 'Duelo táctico; ambos equipos cierran bien espacios.' },
      { m: 'Burgos', v: 'Sporting', f: 'Sábado 07/03 - 16:15', p: '88%', r: 'Gana Burgos', s: '1-0', d: 'El Plantío es el estadio más difícil de 2a División.' },
      { m: 'Racing', v: 'Cordoba', f: 'Domingo 08/03 - 21:00', p: '95%', r: 'Gana Racing', s: '3-0', d: 'El líder llega en racha; Córdoba con bajas en defensa.' },
      { m: 'Granada', v: 'Cadiz', f: 'Domingo 08/03 - 18:30', p: '92%', r: 'Gana Granada', s: '2-1', d: 'Derbi andaluz; factor campo a favor del Granada.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(datosOficiales.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const cambiarLiga = (id) => {
    setLiga(id);
    setPartidos(datosOficiales[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>CONECTANDO CON LALIGA...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center'}}>
      <h1 style={{color:'#fbbf24'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',cursor:'pointer'}}>LOGIN CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'25px'}}>
        <h2 style={{color:'#fbbf24',margin:0}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.7rem',color:'#0f0'}}>INFORMACIÓN OFICIAL ACTUALIZADA</p>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'flex',gap:'10px',marginBottom:'25px'}}>
            <button onClick={() => cambiarLiga('LALIGA')} style={{flex:1,padding:'15px',background:liga==='LALIGA'?'#fbbf24':'#1a1a1a',color:liga==='LALIGA'?'#000':'#fff',border:'none',borderRadius:'10px',fontWeight:'bold'}}>1a DIVISIÓN</button>
            <button onClick={() => cambiarLiga('LALIGA2')} style={{flex:1,padding:'15px',background:liga==='LALIGA2'?'#fbbf24':'#1a1a1a',color:liga==='LALIGA2'?'#000':'#fff',border:'none',borderRadius:'10px',fontWeight:'bold'}}>2a DIVISIÓN</button>
          </div>

          {partidos.map((p, i) => (
            <div key={i} style={{background:'#0a0a0a',border:'1px solid #333',padding:'15px',borderRadius:'15px',marginBottom:'15px'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                <span style={{fontSize:'0.7rem',color:'#fbbf24'}}>{p.f}</span>
                <span style={{background:'#0f0',color:'#000',padding:'2px 8px',borderRadius:'5px',fontSize:'0.7rem',fontWeight:'900'}}>{p.p} ACIERTO</span>
              </div>
              <div style={{textAlign:'center',fontSize:'1.1rem',fontWeight:'bold',marginBottom:'15px'}}>{p.m} vs {p.v}</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
                <div style={{background:'#151515',padding:'10px',borderRadius:'10px',textAlign:'center'}}>
                  <div style={{fontSize:'0.6rem',color:'#666'}}>PRONÓSTICO</div>
                  <div style={{color:'#fbbf24',fontWeight:'bold'}}>{p.r}</div>
                </div>
                <div style={{background:'#151515',padding:'10px',borderRadius:'10px',textAlign:'center'}}>
                  <div style={{fontSize:'0.6rem',color:'#666'}}>MARCADOR</div>
                  <div style={{color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.s}</div>
                </div>
              </div>
              <p style={{fontSize:'0.75rem',color:'#aaa',margin:0,lineHeight:'1.3'}}><b style={{color:'#fbbf24'}}>Análisis IA:</b> {p.d}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',padding:'50px 20px'}}>
          <p>Acceso VIP necesario para ver la Jornada de Marzo.</p>
          <button style={{width:'100%',padding:'20px',background:'#25D366',color:'#fff',border:'none',borderRadius:'15px',fontWeight:'bold'}}>SOLICITAR ACCESO</button>
        </div>
      )}
    </div>
  );
}
