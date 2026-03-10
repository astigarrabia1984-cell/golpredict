import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();

const FULL_DATABASE = {
  'soccer_uefa_champions_league': [
    { id: 'u1', date: '10.03. 18:45', home: 'Galatasaray', away: 'Liverpool', oL: 5.50, oE: 4.40, oV: 1.55 },
    { id: 'u2', date: '10.03. 21:00', home: 'Atalanta', away: 'Bayern München', oL: 3.40, oE: 3.80, oV: 2.05 },
    { id: 'u3', date: '10.03. 21:00', home: 'Atlético de Madrid', away: 'Tottenham', oL: 2.10, oE: 3.40, oV: 3.60 },
    { id: 'u4', date: '10.03. 21:00', home: 'Newcastle', away: 'Barcelona', oL: 3.80, oE: 3.90, oV: 1.90 },
    { id: 'u5', date: '11.03. 18:45', home: 'Bayer Leverkusen', away: 'Arsenal', oL: 2.55, oE: 3.40, oV: 2.70 },
    { id: 'u6', date: '11.03. 21:00', home: 'Bodo/Glimt', away: 'Sporting CP', oL: 4.20, oE: 3.90, oV: 1.85 },
    { id: 'u7', date: '11.03. 21:00', home: 'PSG', away: 'Chelsea', oL: 1.95, oE: 3.75, oV: 3.60 },
    { id: 'u8', date: '11.03. 21:00', home: 'Real Madrid', away: 'Manchester City', oL: 2.80, oE: 3.60, oV: 2.40 },
    { id: 'u9', date: '17.03. 18:45', home: 'Sporting CP', away: 'Bodo/Glimt', oL: 1.45, oE: 4.75, oV: 6.50 },
    { id: 'u10', date: '17.03. 21:00', home: 'Arsenal', away: 'Bayer Leverkusen', oL: 1.75, oE: 3.90, oV: 4.20 },
    { id: 'u11', date: '17.03. 21:00', home: 'Chelsea', away: 'PSG', oL: 2.40, oE: 3.50, oV: 2.80 },
    { id: 'u12', date: '17.03. 21:00', home: 'Manchester City', away: 'Real Madrid', oL: 1.75, oE: 4.10, oV: 4.40 },
    { id: 'u13', date: '18.03. 18:45', home: 'Barcelona', away: 'Newcastle', oL: 1.55, oE: 4.40, oV: 5.50 },
    { id: 'u14', date: '18.03. 21:00', home: 'Bayern München', away: 'Atalanta', oL: 1.50, oE: 4.50, oV: 6.00 },
    { id: 'u15', date: '18.03. 21:00', home: 'Liverpool', away: 'Galatasaray', oL: 1.25, oE: 6.50, oV: 11.00 },
    { id: 'u16', date: '18.03. 21:00', home: 'Tottenham', away: 'Atlético de Madrid', oL: 2.25, oE: 3.50, oV: 3.10 }
  ],
  'soccer_spain_la_liga': [
    { id: 'l1', date: '13.03. 21:00', home: 'Alavés', away: 'Villarreal', oL: 2.80, oE: 3.30, oV: 2.50 },
    { id: 'l2', date: '14.03. 14:00', home: 'Girona', away: 'Athletic Club', oL: 2.40, oE: 3.40, oV: 3.00 },
    { id: 'l3', date: '14.03. 16:15', home: 'Atlético de Madrid', away: 'Getafe', oL: 1.55, oE: 4.00, oV: 6.50 },
    { id: 'l4', date: '14.03. 18:30', home: 'Real Oviedo', away: 'Valencia', oL: 3.10, oE: 3.20, oV: 2.45 },
    { id: 'l5', date: '14.03. 21:00', home: 'Real Madrid', away: 'Elche', oL: 1.15, oE: 8.00, oV: 17.00 },
    { id: 'l6', date: '15.03. 14:00', home: 'Mallorca', away: 'Espanyol', oL: 2.10, oE: 3.20, oV: 3.80 },
    { id: 'l7', date: '15.03. 16:15', home: 'Barcelona', away: 'Sevilla', oL: 1.35, oE: 5.50, oV: 8.50 },
    { id: 'l8', date: '15.03. 18:30', home: 'Real Betis', away: 'Celta de Vigo', oL: 2.05, oE: 3.40, oV: 3.70 },
    { id: 'l9', date: '15.03. 21:00', home: 'Real Sociedad', away: 'Osasuna', oL: 1.85, oE: 3.40, oV: 4.50 },
    { id: 'l10', date: '16.03. 21:00', home: 'Rayo Vallecano', away: 'Levante', oL: 2.20, oE: 3.30, oV: 3.40 },
    { id: 'l11', date: '20.03. 21:00', home: 'Villarreal', away: 'Real Sociedad', oL: 2.45, oE: 3.30, oV: 2.90 },
    { id: 'l12', date: '21.03. 14:00', home: 'Elche', away: 'Mallorca', oL: 3.20, oE: 3.10, oV: 2.40 },
    { id: 'l13', date: '22.03. 21:00', home: 'Real Madrid', away: 'Atlético de Madrid', oL: 1.85, oE: 3.75, oV: 4.00 }
  ],
  'soccer_epl': [
    { id: 'e1', date: '14.03. 16:00', home: 'Burnley', away: 'Bournemouth', oL: 2.80, oE: 3.40, oV: 2.50 },
    { id: 'e2', date: '14.03. 16:00', home: 'Sunderland', away: 'Brighton', oL: 4.00, oE: 3.75, oV: 1.85 },
    { id: 'e3', date: '14.03. 18:30', home: 'Arsenal', away: 'Everton', oL: 1.25, oE: 6.00, oV: 11.00 },
    { id: 'e4', date: '14.03. 18:30', home: 'Chelsea', away: 'Newcastle', oL: 2.10, oE: 3.60, oV: 3.40 },
    { id: 'e5', date: '14.03. 21:00', home: 'West Ham', away: 'Manchester City', oL: 9.00, oE: 5.50, oV: 1.30 },
    { id: 'e6', date: '15.03. 15:00', home: 'Manchester Utd', away: 'Aston Villa', oL: 1.95, oE: 3.70, oV: 3.60 },
    { id: 'e7', date: '15.03. 17:30', home: 'Liverpool', away: 'Tottenham', oL: 1.60, oE: 4.20, oV: 5.00 },
    { id: 'e8', date: '20.03. 21:00', home: 'Bournemouth', away: 'Manchester Utd', oL: 3.40, oE: 3.60, oV: 2.10 },
    { id: 'e9', date: '21.03. 13:30', home: 'Brighton', away: 'Liverpool', oL: 4.50, oE: 4.00, oV: 1.70 },
    { id: 'e10', date: '12.04. 17:30', home: 'Chelsea', away: 'Manchester City', oL: 4.00, oE: 3.80, oV: 1.85 },
    { id: 'e11', date: '18.04. 21:00', home: 'Chelsea', away: 'Manchester Utd', oL: 2.15, oE: 3.60, oV: 3.20 },
    { id: 'e12', date: '19.04. 17:30', home: 'Manchester City', away: 'Arsenal', oL: 1.90, oE: 3.75, oV: 3.90 }
  ]
};

export default function GolpredictPro() {
  const [liga, setLiga] = useState('soccer_uefa_champions_league'); 
  const [activeTab, setActiveTab] = useState('partidos');
  const [analysedDb, setAnalysedDb] = useState({});
  const [betAmount, setBetAmount] = useState(10);
  const [selectedBets, setSelectedBets] = useState([]);

  const runEngine = (oL, oE, oV) => {
    const ITER = 50000;
    const pL = 1/oL, pV = 1/oV, pE = 1/oE;
    const lA = 2.85 * (pL/(pL+pV+pE)), lB = 2.85 * (pV/(pL+pV+pE));
    const poi = (l) => { let L=Math.exp(-l), k=0, p=1; do { k++; p*=Math.random(); } while(p>L); return k-1; };
    let wL=0, d=0, wV=0;
    for(let i=0; i<ITER; i++){
      const gA=poi(lA), gB=poi(lB);
      if(gA>gB) wL++; else if(gA===gB) d++; else wV++;
    }
    return {
      pL:(wL/500).toFixed(1), pE:(d/500).toFixed(1), pV:(wV/500).toFixed(1),
      aiPick: wL>wV && wL>d ? '1' : wV>wL && wV>d ? '2' : 'X'
    };
  };

  useEffect(() => {
    const db = {};
    Object.keys(FULL_DATABASE).forEach(k => {
      db[k] = FULL_DATABASE[k].map(m => ({ ...m, ...runEngine(m.oL, m.oE, m.oV) }));
    });
    setAnalysedDb(db);
  }, []);

  const toggleBet = (match, pick, odd) => {
    const betId = `${match.id}-${pick}`;
    if (selectedBets.find(b => b.id === betId)) {
      setSelectedBets(selectedBets.filter(b => b.id !== betId));
    } else {
      const filtered = selectedBets.filter(b => !b.id.startsWith(match.id));
      setSelectedBets([...filtered, { id: betId, match: `${match.home} vs ${match.away}`, pick, odd }]);
    }
  };

  const totalOdd = selectedBets.reduce((acc, b) => acc * b.odd, 1);

  return (
    <div style={{background:'#000', color:'#fff', minHeight:'100vh', fontFamily:'sans-serif', maxWidth:'480px', margin:'0 auto', paddingBottom:'100px'}}>
      
      <div style={{padding:'20px', background:'#050505', borderBottom:'1px solid #222', position:'sticky', top:0, zIndex:100}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
           <h1 style={{color:'#fbbf24', fontSize:'1rem', margin:0}}>GOLPREDICT QUANTUM</h1>
           <button onClick={() => signOut(auth)} style={{background:'#ff4444', border:'none', color:'#fff', fontSize:'0.65rem', padding:'8px 12px', borderRadius:'8px', fontWeight:'bold'}}>CERRAR SESIÓN</button>
        </div>
        <div style={{display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'5px'}}>
          {['🏆 CHAMPIONS', '🇪🇸 LALIGA', '🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER'].map((n, i) => {
            const ids = ['soccer_uefa_champions_league', 'soccer_spain_la_liga', 'soccer_epl'];
            return <button key={i} onClick={() => setLiga(ids[i])} style={{padding:'10px 18px', borderRadius:'12px', background: liga === ids[i] ? '#fbbf24' : '#111', color: liga === ids[i] ? '#000' : '#888', border:'none', fontSize:'0.65rem', fontWeight:'900', whiteSpace:'nowrap'}}>{n}</button>
          })}
        </div>
      </div>

      <div style={{display:'flex', background:'#080808', borderBottom:'1px solid #222'}}>
        {['partidos', 'calculadora'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{flex:1, padding:'15px', background:'none', border:'none', borderBottom: activeTab === t ? '3px solid #fbbf24' : 'none', color: activeTab === t ? '#fbbf24' : '#555', fontSize:'0.75rem', fontWeight:'bold'}}>{t.toUpperCase()} {t==='calculadora' && selectedBets.length > 0 && `(${selectedBets.length})`}</button>
        ))}
      </div>


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
