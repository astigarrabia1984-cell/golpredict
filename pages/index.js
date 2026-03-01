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

  const getEscudo = (nombre) => {
    const n = nombre.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
    return 'https://api.sofascore.app/api/v1/team/' + n + '/image'; 
  };

  const baseDatos = {
    LALIGA: [
      { m: 'Getafe', v: 'Real Madrid', f: 'Viernes 06 Mar - 21:00', p: '96%', r: 'Gana Real Madrid', s: '0-2', d: 'Madrid solido lider; Getafe con bajas en ataque.' },
      { m: 'Girona', v: 'Sevilla', f: 'Sabado 07 Mar - 14:00', p: '91%', r: 'Gana Girona', s: '2-1', d: 'Montilivi es un fortin; Sevilla sufre fuera de casa.' },
      { m: 'Valencia', v: 'Valladolid', f: 'Sabado 07 Mar - 18:30', p: '93%', r: 'Gana Valencia', s: '2-0', d: 'Mestalla empuja al equipo en duelos directos.' },
      { m: 'Atletico', v: 'Athletic', f: 'Domingo 08 Mar - 16:15', p: '89%', r: 'Gana Atletico', s: '2-1', d: 'Factor Metropolitano decisivo en duelo Champions.' },
      { m: 'Barcelona', v: 'Betis', f: 'Domingo 08 Mar - 21:00', p: '94%', r: 'Gana Barcelona', s: '3-1', d: 'El Barca domina la posesion; Betis deja espacios.' },
      { m: 'Celta', v: 'Leganes', f: 'Domingo 08 Mar - 14:00', p: '88%', r: 'Gana Celta', s: '2-0', d: 'Balaidos es clave para la salvacion del Celta.' },
      { m: 'Villarreal', v: 'Rayo', f: 'Lunes 09 Mar - 21:00', p: '90%', r: 'Gana Villarreal', s: '2-1', d: 'Submarino amarillo superior en calidad individual.' }
    ],
    LALIGA2: [
      { m: 'Burgos', v: 'Sporting', f: 'Sabado 07 Mar - 16:15', p: '87%', r: 'Gana Burgos', s: '1-0', d: 'El Plantio es inexpugnable esta temporada en 2a.' },
      { m: 'Castellon', v: 'Almeria', f: 'Sabado 07 Mar - 21:00', p: '89%', r: 'Gana Almeria', s: '1-2', d: 'La delantera del Almeria marca la diferencia.' },
      { m: 'Granada', v: 'Cadiz', f: 'Domingo 08 Mar - 18:30', p: '92%', r: 'Gana Granada', s: '2-1', d: 'Derbi andaluz; Granada mas fuerte en las areas.' },
      { m: 'Racing', v: 'Cordoba', f: 'Domingo 08 Mar - 21:00', p: '95%', r: 'Gana Racing', s: '3-0', d: 'El Sardinero disfruta del mejor futbol de la liga.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(baseDatos.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const cambiarLiga = (id) => {
    setLiga(id);
    setPartidos(baseDatos[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>CARGANDO JORNADA PRO...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',fontFamily:'sans-serif'}}>
      <h1 style={{color:'#fbbf24',letterSpacing:'3px',margin:0}}>GOL PREDICT PRO</h1>
      <p style={{color:'#888',marginBottom:'30px'}}>Inteligencia Artificial aplicada al futbol</p>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'20px',margin:'0 40px',background:'#fbbf24',border:'none',borderRadius:'15px',fontWeight:'bold',fontSize:'1.1rem',cursor:'pointer'}}>ENTRAR CON GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'30px'}}>
        <div style={{fontSize:'1.8rem',fontWeight:'900',color:'#fbbf24'}}>GOL PREDICT PRO</div>
        <div style={{fontSize:'0.7rem',color:'#0f0',fontWeight:'bold'}}>ALGORITMO DE PROBABILIDAD ACTIVO</div>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'30px'}}>
            <button onClick={() => cambiarLiga('LALIGA')} style={{padding:'15px',background:liga==='LALIGA'?'#fbbf24':'#1a1a1a',color:liga==='LALIGA'?'#000':'#fff',border:'none',borderRadius:'12px',fontWeight:'bold'}}>1a DIVISION</button>
            <button onClick={() => cambiarLiga('LALIGA2')} style={{padding:'15px',background:liga==='LALIGA2'?'#fbbf24':'#1a1a1a',color:liga==='LALIGA2'?'#000':'#fff',border:'none',borderRadius:'12px',fontWeight:'bold'}}>2a DIVISION</button>
          </div>

          {partidos.map((p, i) => (
            <div key={i} style={{border:'1px solid #222',padding:'20px',marginBottom:'20px',borderRadius:'20px',background:'#0a0a0a'}}>
              <p style={{fontSize:'0.7rem',color:'#fbbf24',textAlign:'center',fontWeight:'bold',marginBottom:'15px'}}>{p.f}</p>
              
              <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',marginBottom:'20px'}}>
                <div style={{textAlign:'center',width:'30%'}}>
                  <img src={getEscudo(p.m)} alt="logo" style={{width:'45px',height:'45px',marginBottom:'5px',filter:'drop-shadow(0 0 5px rgba(255,255,255,0.2))'}} onError={(e)=>{e.target.src='https://www.sofascore.com/static/images/placeholders/team.png'}} />
                  <div style={{fontSize:'0.8rem',fontWeight:'bold'}}>{p.m}</div>
                </div>
                <div style={{background:'#0f0',color:'#000',padding:'5px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.7rem'}}>{p.p} ACIERTO</div>
                <div style={{textAlign:'center',width:'30%'}}>
                  <img src={getEscudo(p.v)} alt="logo" style={{width:'45px',height:'45px',marginBottom:'5px',filter:'drop-shadow(0 0 5px rgba(255,255,255,0.2))'}} onError={(e)=>{e.target.src='https://www.sofascore.com/static/images/placeholders/team.png'}} />
                  <div style={{fontSize:'0.8rem',fontWeight:'bold'}}>{p.v}</div>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'15px'}}>
                <div style={{background:'#151515',padding:'12px',borderRadius:'12px',textAlign:'center'}}>
                  <p style={{fontSize:'0.6rem',color:'#666',margin:0}}>PRONOSTICO</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold'}}>{p.r}</p>
                </div>
                <div style={{background:'#151515',padding:'12px',borderRadius:'12px',textAlign:'center'}}>
                  <p style={{fontSize:'0.6rem',color:'#666',margin:0}}>MARCADOR</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.2rem'}}>{p.s}</p>
                </div>
              </div>
              <div style={{fontSize:'0.75rem',color:'#aaa',padding:'10px',background:'#111',borderRadius:'10px',lineHeight:'1.3'}}>
                <b style={{color:'#fbbf24'}}>Analisis:</b> {p.d}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'100px',padding:'20px'}}>
          <div style={{fontSize:'3rem'}}>🔒</div>
          <p style={{color:'#ccc',marginTop:'20px'}}>Tu suscripcion no incluye los pronosticos de la Jornada de Marzo.</p>
          <button style={{width:'100%',padding:'20px',background:'#25D366',color:'#fff',border:'none',borderRadius:'15px',fontWeight:'bold',marginTop:'20px',fontSize:'1.2rem'}}>SOLICITAR PASE VIP</button>
        </div>
      )}
    </div>
  );
}
