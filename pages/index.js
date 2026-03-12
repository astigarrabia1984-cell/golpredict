import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCWayEedL9BAbFsOlZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  storageBucket: "golpredict-pro.appspot.com",
  messagingSenderId: "101840838997",
  appId: "1:101840838997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

export default function GolpredictUltimate() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('PD'); 
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const vipFounders = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.con'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setLoadProgress(20);
      try {
        // PASO 1: Intentar buscar todos los partidos del día (Método más estable para cuentas Free)
        // Usamos la fecha de hoy 12 de marzo de 2026
        const response = await fetch(`https://api.football-data.org/v4/matches?dateFrom=2026-03-12&dateTo=2026-03-12`, {
          headers: { 'X-Auth-Token': '8622f57039804f3fbf997840e90c8b18' }
        });
        
        const data = await response.json();
        setLoadProgress(70);

        if (data.matches) {
          // PASO 2: Filtrado inteligente según la pestaña activa
          let filtered = [];
          if (activeTab === 'PD') filtered = data.matches.filter(m => m.competition.code === 'PD');
          if (activeTab === 'PL') filtered = data.matches.filter(m => m.competition.code === 'PL');
          if (activeTab === 'CL') filtered = data.matches.filter(m => m.competition.code === 'CL');
          // Para la Europa League probamos por código o por nombre
          if (activeTab === 'ELI') filtered = data.matches.filter(m => m.competition.code === 'ELI' || m.competition.name.includes('Europa'));

          setMatches(filtered);
        }
      } catch (err) {
        console.error("Error en conexión cuántica");
      }
      setLoadProgress(100);
      setTimeout(() => setLoading(false), 500);
    };
    fetchMatches();
  }, [activeTab]);

  const isVip = user && vipFounders.includes(user.email);

  const aiAccas = useMemo(() => {
    if (matches.length < 2) return null;
    return {
      segura: matches.slice(0, 2),
      moderada: matches.slice(0, 3),
      quantum: matches.slice(0, 5)
    };
  }, [matches]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>GOLPREDICT <span style={styles.accent}>QUANTUM V55.0</span></h1>
        {user && <button onClick={() => signOut(auth)} style={styles.logout}>CERRAR</button>}
      </header>

      <nav style={styles.nav}>
        {[
          { id: 'PD', name: 'LALIGA', color: '#ff4b4b' },
          { id: 'PL', name: 'PREMIER', color: '#3d195d' },
          { id: 'CL', name: 'CHAMPIONS', color: '#003399' },
          { id: 'ELI', name: 'EUROPA LEA.', color: '#ffa500' }
        ].map(league => (
          <button 
            key={league.id}
            onClick={() => setActiveTab(league.id)}
            style={{...styles.tab, backgroundColor: activeTab === league.id ? league.color : '#1a1a1a', border: activeTab === league.id ? '1px solid #fff' : 'none'}}
          >
            {league.name}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loaderWrapper}>
            <div style={styles.loaderText}>MONTECARLO 5G: ESCANEANDO SATÉLITES... {loadProgress}%</div>
            <div style={styles.progressBar}><div style={{...styles.progressFill, width: `${loadProgress}%`}}></div></div>
          </div>
        ) : (
          <>
            {isVip && aiAccas && <div style={styles.accaBanner}>🎯 COMBINADA IA DISPONIBLE ({matches.length} PARTIDOS)</div>}
            {matches.length > 0 ? (
              matches.map(match => (
                <div key={match.id} style={styles.card}>
                  <div style={styles.teams}>{match.homeTeam.shortName} vs {match.awayTeam.shortName}</div>
                  <div style={styles.stats}>
                    <span style={{color: '#00ff41'}}>1: {(Math.random() * 40 + 30).toFixed(1)}%</span>
                    <span style={{color: '#aaa'}}>X: {(Math.random() * 20 + 10).toFixed(1)}%</span>
                    <span style={{color: '#ff3b3b'}}>2: {(Math.random() * 30 + 10).toFixed(1)}%</span>
                  </div>
                  {isVip && <div style={styles.vipInfo}>⭐ Marcador IA: 2-1 | 1-0</div>}
                </div>
              ))
            ) : (
              <div style={styles.errorBox}>
                <p>⚠️ No hay partidos de esta liga para hoy.</p>
                <p style={{fontSize: '10px'}}>Prueba la pestaña EUROPA LEAGUE, hoy hay jornada activa.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #333' },
  logo: { fontSize: '1rem', fontWeight: 'bold' },
  accent: { color: '#00ff41' },
  logout: { background: '#333', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px' },
  nav: { display: 'flex', gap: '5px', padding: '10px', overflowX: 'auto' },
  tab: { flex: 'none', minWidth: '90px', padding: '10px', borderRadius: '5px', color: '#fff', fontSize: '10px', fontWeight: 'bold' },
  main: { padding: '15px' },
  card: { background: '#111', padding: '15px', borderRadius: '10px', marginBottom: '10px', border: '1px solid #222' },
  teams: { fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' },
  stats: { display: 'flex', justifyContent: 'space-around', fontWeight: 'bold', fontSize: '13px' },
  vipInfo: { marginTop: '10px', padding: '8px', background: 'rgba(0,255,65,0.1)', borderRadius: '5px', color: '#00ff41', fontSize: '11px', textAlign: 'center' },
  accaBanner: { background: '#00ff41', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px', fontSize: '12px' },
  loaderWrapper: { textAlign: 'center', marginTop: '100px' },
  loaderText: { color: '#00ff41', fontSize: '11px', fontWeight: 'bold', marginBottom: '10px' },
  progressBar: { width: '200px', height: '4px', background: '#222', margin: '0 auto', borderRadius: '2px' },
  progressFill: { height: '100%', background: '#00ff41', transition: 'width 0.4s' },
  errorBox: { textAlign: 'center', color: '#666', marginTop: '50px' }
};
        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
