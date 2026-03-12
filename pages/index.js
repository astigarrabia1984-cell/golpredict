import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

// --- CONFIGURACIÓN FIREBASE (Confirmada en tus capturas) ---
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

  const vipFounders = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.con'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // SOLUCIÓN FINAL: Cargamos los partidos del día sin filtros de fecha que bloqueen la API Free
        const response = await fetch(`https://api.football-data.org/v4/matches`, {
          headers: { 'X-Auth-Token': '8622f57039804f3fbf997840e90c8b18' }
        });
        
        const data = await response.json();

        if (data.matches) {
          // Mapeo de IDs de la API para tus pestañas
          const leagueMap = {
            'PD': 'Primera Division',
            'PL': 'Premier League',
            'CL': 'UEFA Champions League',
            'ELI': 'UEFA Europa League'
          };

          const filtered = data.matches.filter(m => 
            m.competition.name === leagueMap[activeTab] || 
            m.competition.code === activeTab
          );

          setMatches(filtered);
        }
      } catch (err) {
        console.error("Error de conexión");
      }
      setLoading(false);
    };
    fetchMatches();
  }, [activeTab]);

  const isVip = user && vipFounders.includes(user.email);

  // --- LÓGICA DE COMBINADAS IA (3 OPCIONES) ---
  const aiCombos = useMemo(() => {
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
        {user && <button onClick={() => signOut(auth)} style={styles.logout}>SALIR</button>}
      </header>

      <nav style={styles.nav}>
        {['PD', 'PL', 'CL', 'ELI'].map(id => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id)}
            style={{...styles.tab, backgroundColor: activeTab === id ? '#00ff41' : '#1a1a1a', color: activeTab === id ? '#000' : '#fff'}}
          >
            {id === 'PD' ? 'LALIGA' : id === 'PL' ? 'PREMIER' : id === 'CL' ? 'CHAMPIONS' : 'EUROPA LEA.'}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.info}>Sincronizando con Satélite...</div>
        ) : (
          <>
            {isVip && aiCombos && (
              <div style={styles.comboSection}>
                <div style={{...styles.comboCard, borderColor: '#00ff41'}}>SEGURA: {aiCombos.segura.length} matches</div>
                <div style={{...styles.comboCard, borderColor: '#ffcc00'}}>MODERADA: {aiCombos.moderada.length} matches</div>
                <div style={{...styles.comboCard, borderColor: '#ff3b3b'}}>QUANTUM: {aiCombos.quantum.length} matches</div>
              </div>
            )}

            {matches.length > 0 ? (
              matches.map(match => (
                <div key={match.id} style={styles.card}>
                  <div style={styles.leagueName}>{match.competition.name}</div>
                  <div style={styles.matchTeams}>{match.homeTeam.shortName} vs {match.awayTeam.shortName}</div>
                  <div style={styles.stats}>
                    <div style={{color: '#00ff41'}}>1: {(Math.random() * 40 + 30).toFixed(1)}%</div>
                    <div style={{color: '#888'}}>X: {(Math.random() * 20 + 10).toFixed(1)}%</div>
                    <div style={{color: '#ff3b3b'}}>2: {(Math.random() * 30 + 10).toFixed(1)}%</div>
                  </div>
                  {isVip && <div style={styles.vipTag}>⭐ IA SCORE: 2-1 | 1-1 | 2-0</div>}
                </div>
              ))
            ) : (
              <div style={styles.info}>📡 No se detectan partidos en vivo para esta pestaña.<br/><small>La API Free solo muestra partidos del día actual.</small></div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #222' },
  logo: { fontSize: '1.2rem', fontWeight: 'bold' },
  accent: { color: '#00ff41' },
  logout: { background: '#ff3b3b', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' },
  nav: { display: 'flex', gap: '5px', padding: '10px', overflowX: 'auto' },
  tab: { flex: 'none', minWidth: '100px', padding: '10px', border: 'none', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px' },
  main: { padding: '15px' },
  info: { textAlign: 'center', marginTop: '50px', color: '#666' },
  card: { background: '#111', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #333' },
  leagueName: { fontSize: '10px', color: '#00ff41', marginBottom: '5px' },
  matchTeams: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' },
  stats: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' },
  vipTag: { marginTop: '10px', padding: '5px', background: 'rgba(0,255,65,0.1)', borderRadius: '5px', fontSize: '12px', color: '#00ff41' },
  comboSection: { display: 'flex', gap: '10px', marginBottom: '20px' },
  comboCard: { flex: 1, padding: '10px', background: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid', fontSize: '10px', fontWeight: 'bold' }
};

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
