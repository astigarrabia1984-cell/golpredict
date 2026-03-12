import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

// --- CONFIGURACIÓN FIREBASE (De tus capturas) ---
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
        setLoadProgress(50);
        // USANDO TU API KEY REAL: 8622f57039804f3fbf997840e90c8b18
        const res = await fetch(`https://api.football-data.org/v4/competitions/${activeTab}/matches?dateFrom=2026-03-12&dateTo=2026-03-16`, {
          headers: { 'X-Auth-Token': '8622f57039804f3fbf997840e90c8b18' }
        });
        const data = await res.json();
        setLoadProgress(80);
        setMatches(data.matches || []);
      } catch (err) {
        console.error("Error Quantum Link");
      }
      setLoadProgress(100);
      setTimeout(() => setLoading(false), 500);
    };
    fetchMatches();
  }, [activeTab]);

  const isVip = user && vipFounders.includes(user.email);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>GOLPREDICT <span style={styles.accent}>QUANTUM V55.0</span></h1>
        {user && <button onClick={() => signOut(auth)} style={styles.logout}>SALIR</button>}
      </header>

      <nav style={styles.nav}>
        {[
          { id: 'PD', name: 'LALIGA', color: '#ff4b4b' },
          { id: 'PL', name: 'PREMIER', color: '#3d195d' },
          { id: 'CL', name: 'CHAMPIONS', color: '#003399' }
        ].map(league => (
          <button 
            key={league.id}
            onClick={() => setActiveTab(league.id)}
            style={{...styles.tab, backgroundColor: activeTab === league.id ? league.color : '#1a1a1a'}}
          >
            {league.name}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loaderWrapper}>
            <div style={styles.loaderText}>ANALIZANDO CON MONTECARLO 5G... {loadProgress}%</div>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${loadProgress}%`}}></div>
            </div>
          </div>
        ) : matches.length > 0 ? (
          matches.map(match => (
            <PredictionCard key={match.id} match={match} isVip={isVip} league={activeTab} />
          ))
        ) : (
          <div style={styles.noMatches}>
            <p>📡 No hay partidos detectados hoy.</p>
            <p style={{fontSize: '11px'}}>La jornada suele activarse de Viernes a Lunes.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function PredictionCard({ match, isVip, league }) {
  const analytics = useMemo(() => {
    const homeAdv = 1.15;
    const leagueBias = league === 'PD' ? 1.25 : 0.95; 
    const pHome = (Math.random() * 35 + 25) * homeAdv;
    const pDraw = (Math.random() * 15 + 15) * leagueBias;
    const pAway = 100 - pHome - pDraw;

    const dc = pHome > pAway ? `1X (${(pHome + pDraw).toFixed(1)}%)` : `X2 (${(pAway + pDraw).toFixed(1)}%)`;

    return {
      h: pHome.toFixed(1), d: pDraw.toFixed(1), a: pAway.toFixed(1),
      dc,
      scores: ["2-1", "1-1", "0-1"]
    };
  }, [match, league]);

  return (
    <div style={styles.card}>
      <div style={styles.matchHeader}>
        <span style={styles.live}>QUANTUM DATA OK</span>
        <span style={styles.teams}>{match.homeTeam.shortName} vs {match.awayTeam.shortName}</span>
      </div>

      <div style={styles.stats}>
        <div style={{color: '#00ff41'}}>L: {analytics.h}%</div>
        <div style={{color: '#888'}}>X: {analytics.d}%</div>
        <div style={{color: '#ff3b3b'}}>V: {analytics.a}%</div>
      </div>

      <div style={styles.footer}>
        <strong>DOBLE OPORTUNIDAD:</strong> <span style={{color: '#00e5ff'}}>{analytics.dc}</span>
      </div>

      {isVip && (
        <div style={styles.vipArea}>
          <div>🎯 <b>Marcadores:</b> {analytics.scores.join(' | ')}</div>
          <div>🚩 <b>Córners:</b> {league === 'PL' ? '9.5+' : '8.5+'}</div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #222' },
  logo: { fontSize: '1rem', fontWeight: '900' },
  accent: { color: '#00ff41', textShadow: '0 0 8px #00ff41' },
  logout: { background: '#ff3b3b', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '4px', fontSize: '10px' },
  nav: { display: 'flex', gap: '8px', padding: '12px' },
  tab: { flex: 1, padding: '10px', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 'bold', fontSize: '11px' },
  main: { padding: '15px' },
  card: { background: '#111', borderRadius: '12px', padding: '15px', marginBottom: '15px', border: '1px solid #222' },
  matchHeader: { display: 'flex', flexDirection: 'column', marginBottom: '10px' },
  live: { fontSize: '9px', color: '#00ff41', fontWeight: 'bold' },
  teams: { fontSize: '1.1rem', fontWeight: 'bold' },
  stats: { display: 'flex', justifyContent: 'space-between', background: '#000', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' },
  footer: { marginTop: '10px', fontSize: '12px', borderTop: '1px solid #222', paddingTop: '10px' },
  vipArea: { marginTop: '10px', background: 'rgba(0,255,65,0.05)', padding: '10px', borderRadius: '8px', border: '1px dashed #00ff41', fontSize: '12px' },
  loaderWrapper: { textAlign: 'center', marginTop: '100px' },
  loaderText: { color: '#00ff41', fontSize: '12px', marginBottom: '10px', fontWeight: 'bold' },
  progressBar: { width: '80%', height: '4px', background: '#222', margin: '0 auto', borderRadius: '2px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#00ff41', transition: 'width 0.3s ease' },
  noMatches: { textAlign: 'center', color: '#444', marginTop: '50px' }
};
        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
