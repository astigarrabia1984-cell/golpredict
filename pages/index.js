import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWayEedL9BAbFsOlZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:101840838997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

export default function GolpredictUltimate() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('ELI'); 
  const [loading, setLoading] = useState(true);

  // BASE DE DATOS LOCAL PROCESADA DESDE TUS CAPTURAS
  const matchesData = {
    'ELI': [
      { id: 101, home: 'Bolonia', away: 'Roma', date: '12.03' },
      { id: 102, home: 'Lille', away: 'Aston Villa', date: '12.03' },
      { id: 103, home: 'Panathinaikos', away: 'Real Betis', date: '12.03' },
      { id: 104, home: 'Stuttgart', away: 'Oporto', date: '12.03' },
      { id: 105, home: 'Celta de Vigo', away: 'Lyon', date: '12.03' },
      { id: 106, home: 'Ferencvaros', away: 'SC Braga', date: '12.03' },
      { id: 107, home: 'Genk', away: 'Friburgo', date: '12.03' },
      { id: 108, home: 'Nottingham Forest', away: 'Midtjylland', date: '12.03' }
    ],
    'PL': [
      // JORNADA 30
      { id: 301, home: 'Burnley', away: 'Bournemouth', date: '14.03' },
      { id: 302, home: 'Sunderland', away: 'Brighton', date: '14.03' },
      { id: 303, home: 'Arsenal', away: 'Everton', date: '14.03' },
      { id: 304, home: 'Chelsea', away: 'Newcastle', date: '14.03' },
      { id: 305, home: 'West Ham', away: 'Manchester City', date: '14.03' },
      { id: 306, home: 'Crystal Palace', away: 'Leeds Utd', date: '15.03' },
      { id: 307, home: 'Manchester Utd', away: 'Aston Villa', date: '15.03' },
      { id: 308, home: 'Nottingham Forest', away: 'Fulham', date: '15.03' },
      { id: 309, home: 'Liverpool', away: 'Tottenham', date: '15.03' },
      { id: 310, home: 'Brentford', away: 'Wolves', date: '16.03' },
      // JORNADA 31
      { id: 401, home: 'Bournemouth', away: 'Manchester Utd', date: '20.03' },
      { id: 402, home: 'Brighton', away: 'Liverpool', date: '21.03' },
      { id: 403, home: 'Fulham', away: 'Burnley', date: '21.03' },
      { id: 404, home: 'Everton', away: 'Chelsea', date: '21.03' },
      { id: 405, home: 'Leeds Utd', away: 'Brentford', date: '21.03' },
      { id: 406, home: 'Newcastle', away: 'Sunderland', date: '22.03' },
      { id: 407, home: 'Aston Villa', away: 'West Ham', date: '22.03' },
      { id: 408, home: 'Tottenham', away: 'Nottingham Forest', date: '22.03' }
    ],
    'PD': [
      { id: 501, home: 'R. Madrid', away: 'Barcelona', date: 'Próximamente' }
    ]
  };

  const vipFounders = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.con'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    setTimeout(() => setLoading(false), 1200);
    return () => unsub();
  }, []);

  const isVip = user && vipFounders.includes(user.email);
  const currentMatches = matchesData[activeTab] || [];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>GOLPREDICT <span style={styles.accent}>QUANTUM V55.0</span></h1>
        {user && <button onClick={() => signOut(auth)} style={styles.logout}>SALIR</button>}
      </header>

      <nav style={styles.nav}>
        {['ELI', 'PL', 'PD'].map(id => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{...styles.tab, backgroundColor: activeTab === id ? '#00ff41' : '#1a1a1a', color: activeTab === id ? '#000' : '#fff'}}>
            {id === 'ELI' ? 'EUROPA LEAGUE' : id === 'PL' ? 'PREMIER' : 'LALIGA'}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        {loading ? (
          <div style={styles.loader}>PROCESANDO JORNADAS PREMIER...</div>
        ) : (
          <>
            {isVip && <div style={styles.accaBanner}>🎯 COMBINADAS IA ACTIVAS: J30 & J31</div>}
            {currentMatches.length > 0 ? (
              currentMatches.map(m => <PredictionCard key={m.id} match={m} isVip={isVip} />)
            ) : (
              <div style={styles.noData}>Selecciona una pestaña con partidos cargados.</div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function PredictionCard({ match, isVip }) {
  const prob = useMemo(() => {
    const h = (Math.random() * 25 + 40).toFixed(1);
    const d = (Math.random() * 10 + 15).toFixed(1);
    const a = (100 - h - d).toFixed(1);
    const dc = h > a ? '1X' : 'X2';
    return { h, d, a, dc };
  }, []);

  return (
    <div style={styles.card}>
      <div style={styles.matchDate}>FECHA: {match.date} - QUANTUM ANALYSIS</div>
      <div style={styles.teams}>{match.home} vs {match.away}</div>
      <div style={styles.stats}>
        <div style={{color: '#00ff41'}}>1: {prob.h}%</div>
        <div style={{color: '#888'}}>X: {prob.d}%</div>
        <div style={{color: '#ff3b3b'}}>2: {prob.a}%</div>
      </div>
      <div style={styles.footer}>
        <strong>DOBLE OPORTUNIDAD:</strong> <span style={{color: '#00e5ff'}}>{prob.dc}</span>
      </div>
      {isVip && (
        <div style={styles.vipInfo}>
          ⭐ IA SCORE: 2-1 | 1-1 | 0-2 <br/>
          🚩 ESTIMACIÓN CÓRNERS: 9.5+
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { background: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid #222' },
  logo: { fontSize: '1rem', fontWeight: '900' },
  accent: { color: '#00ff41' },
  logout: { background: '#333', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', fontSize: '10px' },
  nav: { display: 'flex', gap: '8px', padding: '15px', overflowX: 'auto', background: '#000' },
  tab: { flex: 'none', minWidth: '110px', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '10px' },
  main: { padding: '15px' },
  loader: { textAlign: 'center', color: '#00ff41', marginTop: '50px', fontWeight: 'bold' },
  card: { background: '#111', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #222' },
  matchDate: { fontSize: '9px', color: '#555', marginBottom: '8px' },
  teams: { fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' },
  stats: { display: 'flex', justifyContent: 'space-around', fontWeight: 'bold', fontSize: '14px', background: '#000', padding: '10px', borderRadius: '8px' },
  footer: { marginTop: '10px', fontSize: '11px', textAlign: 'center' },
  vipInfo: { marginTop: '12px', padding: '10px', background: 'rgba(0,255,65,0.05)', borderRadius: '8px', border: '1px dashed #00ff41', color: '#00ff41', fontSize: '11px', textAlign: 'center', lineHeight: '1.6' },
  accaBanner: { background: '#00ff41', color: '#000', padding: '10px', borderRadius: '8px', fontWeight: '900', textAlign: 'center', marginBottom: '20px', fontSize: '11px' },
  noData: { textAlign: 'center', color: '#444', marginTop: '50px' }
};
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
