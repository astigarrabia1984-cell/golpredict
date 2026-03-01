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

  const carteleraCompleta = {
    LALIGA: [
      { m: 'Getafe', v: 'Real Madrid', f: 'Vie 06 Mar', p: '94%', r: 'Gana Real Madrid', s: '0-2', d: 'El Madrid es el mejor visitante; Getafe con problemas de gol.' },
      { m: 'Girona', v: 'Sevilla', f: 'Sab 07 Mar', p: '91%', r: 'Gana Girona', s: '2-1', d: 'Fortaleza total en Montilivi; Sevilla irregular fuera.' },
      { m: 'Alaves', v: 'Las Palmas', f: 'Sab 07 Mar', p: '88%', r: 'Empate', s: '1-1', d: 'Equipos muy igualados en la zona media de la tabla.' },
      { m: 'Espanyol', v: 'Mallorca', f: 'Sab 07 Mar', p: '87%', r: 'Gana Espanyol', s: '1-0', d: 'El factor campo sera decisivo para los pericos.' },
      { m: 'Valencia', v: 'Valladolid', f: 'Sab 07 Mar', p: '90%', r: 'Gana Valencia', s: '2-0', d: 'Mestalla empuja al equipo contra un rival directo.' },
      { m: 'Atletico', v: 'Athletic', f: 'Dom 08 Mar', p: '89%', r: 'Gana Atletico', s: '2-1', d: 'Duelo Champions; el Metropolitano marcara la diferencia.' },
      { m: 'Osasuna', v: 'Real Sociedad', f: 'Dom 08 Mar', p: '86%', r: 'Empate', s: '1-1', d: 'Derbi del norte muy físico y con pocos espacios.' },
      { m: 'Barcelona', v: 'Betis', f: 'Dom 08 Mar', p: '93%', r: 'Gana Barcelona', s: '3-1', d: 'El Barca domina la posesion; Betis sufre en transiciones.' },
      { m: 'Celta', v: 'Leganes', f: 'Dom 08 Mar', p: '88%', r: 'Gana Celta', s: '2-0', d: 'Balaidos es clave para la salvacion del Celta.' },
      { m: 'Villarreal', v: 'Rayo', f: 'Lun 09 Mar', p: '92%', r: 'Gana Villarreal', s: '2-1', d: 'Submarino amarillo superior en calidad individual.' }
    ],
    LALIGA2: [
      { m: 'Zaragoza', v: 'Levante', f: 'Vie 06 Mar', p: '85%', r: 'Empate', s: '0-0', d: 'Dos defensas muy solidas; partido de pocos goles.' },
      { m: 'Burgos', v: 'Sporting', f: 'Sab 07 Mar', p: '88%', r: 'Gana Burgos', s: '1-0', d: 'El Plantio es inexpugnable esta temporada.' },
      { m: 'Castellon', v: 'Almeria', f: 'Sab 07 Mar', p: '89%', r: 'Gana Almeria', s: '1-2', d: 'La delantera del Almeria marca la diferencia en 2a.' },
      { m: 'Eibar', v: 'Racing Ferrol', f: 'Sab 07 Mar', p: '91%', r: 'Gana Eibar', s: '2-0', d: 'Ipurua siempre es dificil para los visitantes.' },
      { m: 'Malaga', v: 'Oviedo', f: 'Sab 07 Mar', p: '87%', r: 'Empate', s: '1-1', d: 'Duelo historico muy nivelado en la Rosaleda.' },
      { m: 'Tenerife', v: 'Mirandes', f: 'Dom 08 Mar', p: '86%', r: 'Gana Tenerife', s: '1-0', d: 'El Heliodoro empujara para salir del descenso.' },
      { m: 'Granada', v: 'Cadiz', f: 'Dom 08 Mar', p: '90%', r: 'Gana Granada', s: '2-1', d: 'Derbi andaluz; Granada mas fuerte en las areas.' },
      { m: 'Huesca', v: 'Elche', f: 'Dom 08 Mar', p: '88%', r: 'Empate', s: '0-0', d: 'Partido tactico; Elche domina pero Huesca cierra bien.' },
      { m: 'Racing', v: 'Cordoba', f: 'Dom 08 Mar', p: '93%', r: 'Gana Racing', s: '3-1', d: 'El Sardinero disfruta del mejor futbol de la liga.' },
      { m: 'Cartagena', v: 'Depor', f: 'Dom 08 Mar', p: '87%', r: 'Gana Depor', s: '0-2', d: 'El Depor en racha ascendente contra un colista.' }
    ]
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const d = await getDoc(doc(db, 'usuarios', u.email));
        if (d.exists() && d.data().esPremium) {
          setIsPremium(true);
          setPartidos(carteleraCompleta.LALIGA);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const changeL = (id) => {
    setLiga(id);
    setPartidos(carteleraCompleta[id] || []);
  };

  if (loading) return <div style={{background:'#000',color:'#fbbf24',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>PROCESANDO JORNADA COMPLETA...</div>;

  if (!user) return (
    <div style={{background:'#000',color:'#fff',height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',fontFamily:'sans-serif'}}>
      <h1 style={{color:'#fbbf24',letterSpacing:'2px'}}>GOL PREDICT PRO</h1>
      <button onClick={() => signInWithPopup(auth, provider)} style={{padding:'18px',margin:'auto',background:'#fbbf24',border:'none',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>ACCESO VIP GOOGLE</button>
    </div>
  );

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh',padding:'15px',fontFamily:'sans-serif'}}>
      <header style={{textAlign:'center',marginBottom:'20px'}}>
        <h2 style={{color:'#fbbf24',margin:0,fontSize:'1.8rem'}}>GOL PREDICT PRO</h2>
        <p style={{fontSize:'0.8rem',color:'#888',marginTop:'5px'}}>Suscripcion VIP: {user.displayName}</p>
      </header>

      {isPremium ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'25px'}}>
            {Object.keys(carteleraCompleta).map(id => (
              <button key={id} onClick={() => changeL(id)} style={{padding:'15px',background:liga===id?'#fbbf24':'#1a1a1a',color:liga===id?'#000':'#fff',border:'1px solid #333',borderRadius:'10px',fontWeight:'bold',fontSize:'0.9rem',cursor:'pointer'}}>{id === 'LALIGA' ? '1a DIVISION' : '2a DIVISION'}</button>
            ))}
          </div>

          <p style={{fontSize:'0.7rem',color:'#666',textAlign:'center',marginBottom:'15px'}}>Viendo {partidos.length} partidos analizados</p>

          {partidos.map((p, i) => (
            <div key={i} style={{border:'1px solid #333',padding:'18px',marginBottom:'15px',borderRadius:'15px',background:'#0a0a0a'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
                <div>
                  <p style={{fontSize:'0.7rem',color:'#fbbf24',margin:0,fontWeight:'bold'}}>{p.f}</p>
                  <span style={{fontWeight:'bold',fontSize:'1.1rem'}}>{p.m} vs {p.v}</span>
                </div>
                <div style={{background:'#0f0',color:'#000',padding:'5px 10px',borderRadius:'8px',fontWeight:'900',fontSize:'0.7rem'}}>{p.p} ACIERTO</div>
              </div>
              
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
                <div style={{background:'#151515',padding:'12px',borderRadius:'10px',border:'1px solid #222'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>PRONOSTICO 1X2</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'0.85rem'}}>{p.r}</p>
                </div>
                <div style={{background:'#151515',padding:'12px',borderRadius:'10px',border:'1px solid #222'}}>
                  <p style={{fontSize:'0.55rem',color:'#666',margin:0}}>RESULTADO EXACTO</p>
                  <p style={{margin:0,color:'#fbbf24',fontWeight:'bold',fontSize:'1.1rem'}}>{p.s}</p>
                </div>
              </div>
              <p style={{fontSize:'0.75rem',color:'#aaa',margin:0,lineHeight:'1.3'}}><b style={{color:'#fbbf24'}}>Analisis:</b> {p.d}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center',marginTop:'100px',padding:'20px'}}>
          <p style={{fontSize:'1.1rem',color:'#ccc'}}>No tienes acceso a la jornada completa. Activa tu pase VIP para desbloquear los 21 partidos de esta semana.</p>
          <button style={{width:'100%',padding:'20px',background:'#25D366',color:'#fff',border:'none',borderRadius:'15px',fontWeight:'bold',marginTop:'20px',fontSize:'1.2rem'}}>SOLICITAR ACCESO VIP</button>
        </div>
      )}
    </div>
  );
}
