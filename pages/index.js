import React, { useState, useEffect, useMemo } from "react";

/* ===========================
LÓGICA MATEMÁTICA (POISSON)
=========================== */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

const teamRatings = {
  "Real Madrid": { a: 1.45, d: 0.7 }, "Elche": { a: 0.8, d: 1.2 },
  "Girona": { a: 1.2, d: 0.9 }, "Athletic Bilbao": { a: 1.1, d: 0.9 },
  "Atlético Madrid": { a: 1.3, d: 0.8 }, "Getafe": { a: 0.9, d: 1.1 },
  "Arsenal": { a: 1.4, d: 0.8 }, "Everton": { a: 0.9, d: 1.1 },
  "Chelsea": { a: 1.1, d: 1 }, "Newcastle": { a: 1.2, d: 0.95 },
  "Liverpool": { a: 1.45, d: 0.85 }, "Tottenham Hotspur": { a: 1.25, d: 1 },
  "Bayern Munich": { a: 1.55, d: 0.75 }, "Dortmund": { a: 1.3, d: 0.95 },
  "Leverkusen": { a: 1.35, d: 0.9 }, "Inter": { a: 1.35, d: 0.85 },
  "Roma": { a: 1.15, d: 0.95 }, "Milan": { a: 1.25, d: 0.9 },
  "Napoli": { a: 1.3, d: 0.95 }, "PSG": { a: 1.5, d: 0.9 },
  "Manchester City": { a: 1.6, d: 0.75 }, "Porto": { a: 1.1, d: 1.0 },
  "Barcelona": { a: 1.4, d: 0.85 }, "Juventus": { a: 1.2, d: 0.8 },
  "Villarreal": { a: 1.2, d: 1.0 }, "Sevilla": { a: 1.1, d: 1.1 }
};

function runModel(match) {
  const defaultRating = { a: 1.0, d: 1.0 };
  const home = teamRatings[match.home] || defaultRating;
  const away = teamRatings[match.away] || defaultRating;
  // Factor campo: 1.15 para el local
  const hxg = (home.a * away.d) * 1.15;
  const axg = away.a * home.d;
  let p1 = 0, pX = 0, p2 = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
    }
  }
  const prob1 = (p1 * 100).toFixed(1);
  const probX = (pX * 100).toFixed(1);
  const prob2 = (p2 * 100).toFixed(1);
  const probs = [parseFloat(prob1), parseFloat(probX), parseFloat(prob2)];
  const maxP = Math.max(...probs);
  return {
    homeProb: prob1, drawProb: probX, awayProb: prob2,
    odd1: (100 / prob1).toFixed(2), oddX: (100 / probX).toFixed(2), odd2: (100 / prob2).toFixed(2),
    bestProb: maxP,
    bestPick: maxP === parseFloat(prob1) ? "1" : maxP === parseFloat(probX) ? "X" : "2"
  };
}

/* ===========================
BASE DE DATOS COMPLETA
=========================== */
const matchesDB = {
  LALIGA: [
    { id: 1, home: "Alaves", away: "Villarreal", date: "13-03" },
    { id: 2, home: "Girona", away: "Athletic Bilbao", date: "14-03" },
    { id: 3, home: "Atlético Madrid", away: "Getafe", date: "14-03" },
    { id: 4, home: "Real Oviedo", away: "Valencia", date: "14-03" },
    { id: 5, home: "Real Madrid", away: "Elche", date: "14-03" },
    { id: 6, home: "Mallorca", away: "Espanyol", date: "15-03" },
    { id: 7, home: "Barcelona", away: "Sevilla", date: "15-03" },
    { id: 8, home: "Betis", away: "Celta Vigo", date: "15-03" },
    { id: 9, home: "Real Sociedad", away: "Osasuna", date: "15-03" },
    { id: 10, home: "Rayo Vallecano", away: "Levante", date: "16-03" },
    { id: 11, home: "Villarreal", away: "Real Sociedad", date: "20-03" },
    { id: 12, home: "Elche", away: "Mallorca", date: "21-03" },
    { id: 13, home: "Espanyol", away: "Getafe", date: "21-03" },
    { id: 14, home: "Levante", away: "Real Oviedo", date: "21-03" },
    { id: 15, home: "Osasuna", away: "Girona", date: "21-03" },
    { id: 16, home: "Sevilla", away: "Valencia", date: "21-03" },
    { id: 17, home: "Barcelona", away: "Rayo Vallecano", date: "22-03" },
    { id: 18, home: "Celta Vigo", away: "Alaves", date: "22-03" },
    { id: 19, home: "Athletic Bilbao", away: "Betis", date: "22-03" },
    { id: 20, home: "Real Madrid", away: "Atlético Madrid", date: "22-03" }
  ],
  PREMIER: [
    { id: 30, home: "Burnley", away: "Bournemouth", date: "14-03" },
    { id: 31, home: "Sunderland", away: "Brighton", date: "14-03" },
    { id: 32, home: "Arsenal", away: "Everton", date: "14-03" },
    { id: 33, home: "Chelsea", away: "Newcastle", date: "14-03" },
    { id: 34, home: "West Ham United", away: "Manchester City", date: "14-03" },
    { id: 35, home: "Crystal Palace", away: "Leeds United", date: "15-03" },
    { id: 36, home: "Manchester United", away: "Aston Villa", date: "15-03" },
    { id: 37, home: "Nottingham Forest", away: "Fulham", date: "15-03" },
    { id: 38, home: "Liverpool", away: "Tottenham Hotspur", date: "15-03" },
    { id: 39, home: "Brentford", away: "Wolves", date: "16-03" },
    { id: 40, home: "Bournemouth", away: "Manchester United", date: "20-03" },
    { id: 41, home: "Brighton", away: "Liverpool", date: "21-03" },
    { id: 42, home: "Aston Villa", away: "West Ham United", date: "21-03" },
    { id: 43, home: "Fulham", away: "Burnley", date: "21-03" },
    { id: 44, home: "Manchester City", away: "Crystal Palace", date: "21-03" },
    { id: 45, home: "Everton", away: "Chelsea", date: "21-03" },
    { id: 46, home: "Leeds United", away: "Brentford", date: "21-03" },
    { id: 47, home: "Newcastle United", away: "Sunderland", date: "22-03" },
    { id: 48, home: "Tottenham Hotspur", away: "Nottingham Forest", date: "22-03" }
  ],
  BUNDESLIGA: [
    { id: 60, home: "Monchengladbach", away: "St Pauli", date: "13-03" },
    { id: 61, home: "Borussia Dortmund", away: "Augsburg", date: "14-03" },
    { id: 62, home: "Eintracht Frankfurt", away: "Heidenheim", date: "14-03" },
    { id: 63, home: "Hoffenheim", away: "Wolfsburg", date: "14-03" },
    { id: 64, home: "Leverkusen", away: "Bayern Munich", date: "14-03" },
    { id: 65, home: "Hamburg", away: "Cologne", date: "14-03" },
    { id: 66, home: "Stuttgart", away: "Union Berlin", date: "15-03" },
    { id: 67, home: "RB Leipzig", away: "Mainz", date: "20-03" },
    { id: 68, home: "Bayern Munich", away: "Union Berlin", date: "21-03" },
    { id: 69, home: "Cologne", away: "Monchengladbach", date: "21-03" },
    { id: 70, home: "Heidenheim", away: "Leverkusen", date: "21-03" },
    { id: 71, home: "Wolfsburg", away: "Werder Bremen", date: "21-03" },
    { id: 72, home: "Dortmund", away: "Hamburg", date: "21-03" }
  ],
  SERIEA: [
    { id: 80, home: "Torino", away: "Parma", date: "13-03" },
    { id: 81, home: "Inter", away: "Atalanta", date: "14-03" },
    { id: 82, home: "Napoli", away: "Lecce", date: "14-03" },
    { id: 83, home: "Udinese", away: "Juventus", date: "14-03" },
    { id: 84, home: "Lazio", away: "Bologna", date: "15-03" },
    { id: 85, home: "Fiorentina", away: "Cagliari", date: "15-03" },
    { id: 86, home: "Roma", away: "Como", date: "21-03" },
    { id: 87, home: "Sassuolo", away: "Torino", date: "21-03" },
    { id: 88, home: "AC Milan", away: "Fiorentina", date: "22-03" },
    { id: 89, home: "Juventus", away: "Napoli", date: "22-03" }
  ],
  CHAMPIONS: [
    { id: 100, home: "Arsenal", away: "Porto", date: "18-03" },
    { id: 101, home: "Bayern Munich", away: "Inter", date: "18-03" },
    { id: 102, home: "Manchester City", away: "Real Madrid", date: "18-03" }, // CORREGIDO: Madrid fuera
    { id: 103, home: "PSG", away: "Dortmund", date: "19-03" },
    { id: 104, home: "Barcelona", away: "Napoli", date: "19-03" },
    { id: 105, home: "Liverpool", away: "Juventus", date: "19-03" }
  ],
  EUROPA: [
    { id: 120, home: "Freiburg", away: "Genk", date: "19-03" },
    { id: 121, home: "Lyon", away: "Celta Vigo", date: "19-03" },
    { id: 122, home: "Midtjylland", away: "Nottingham Forest", date: "19-03" },
    { id: 123, home: "Aston Villa", away: "Lille", date: "19-03" },
    { id: 124, home: "Porto", away: "Stuttgart", date: "19-03" },
    { id: 125, home: "Real Betis", away: "Panathinaikos", date: "19-03" }
  ]
};

/* ===========================
COMPONENTES VISUALES
=========================== */

function MatchCard({ match, selected, setSelected }) {
  const data = useMemo(() => runModel(match), [match]);
  const isS = (p) => selected.some(s => s.id === match.id && s.pick === p);
  const toggleS = (p, o) => {
    if (isS(p)) setSelected(selected.filter(s => !(s.id === match.id && s.pick === p)));
    else setSelected([...selected.filter(s => s.id !== match.id), { ...match, pick: p, quota: parseFloat(o) }]);
  };

  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontSize: "0.95em", fontWeight: "bold" }}>{match.home} vs {match.away}</span>
        <span style={{ color: "#666", fontSize: "0.8em" }}>{match.date}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[["1", data.homeProb, data.odd1], ["X", data.drawProb, data.oddX], ["2", data.awayProb, data.odd2]].map(([p, pr, od]) => (
          <div key={p} onClick={() => toggleS(p, od)} style={{ background: isS(p) ? "#00ff41" : "#1a1a1a", color: isS(p) ? "#000" : "#fff", padding: "10px 5px", borderRadius: "5px", textAlign: "center", cursor: "pointer" }}>
            <div style={{ fontSize: "0.7em", opacity: 0.8 }}>{p} ({pr}%)</div>
            <div style={{ fontWeight: "bold", fontSize: "0.9em" }}>@{od}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GolPredictPro() {
  const [league, setLeague] = useState("LALIGA");
  const [activeTab, setActiveTab] = useState("partidos");
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const top5Global = useMemo(() => {
    return Object.values(matchesDB).flat()
      .map(m => ({ ...m, res: runModel(m) }))
      .sort((a, b) => b.res.bestProb - a.res.bestProb)
      .slice(0, 5);
  }, []);

  const comboIA = useMemo(() => {
    return matchesDB[league]
      .map(m => ({ ...m, res: runModel(m) }))
      .sort((a, b) => b.res.bestProb - a.res.bestProb)
      .slice(0, 3);
  }, [league]);

  if (!isMounted) return null;

  return (
    <div style={{ background: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: 'center', padding: '15px 0' }}>
        <h2 style={{ color: "#00ff41", margin: 0, letterSpacing: '1px' }}>GOLPREDICT PRO</h2>
      </header>

      {/* Selector de Ligas */}
      <div style={{ display: "flex", overflowX: "auto", gap: "8px", paddingBottom: "15px" }}>
        {Object.keys(matchesDB).map((l) => (
          <button key={l} onClick={() => setLeague(l)} style={{ padding: "8px 16px", background: league === l ? "#00ff41" : "#222", color: league === l ? "#000" : "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: '0.75em', whiteSpace: 'nowrap' }}>
            {l}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #222", marginBottom: "20px" }}>
        {[
          { id: 'partidos', label: 'Partidos' },
          { id: 'combinada', label: 'IA Combo' },
          { id: 'top5', label: 'Top 5 IA' },
          { id: 'ticket', label: `Ticket (${selectedMatches.length})` }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "12px 5px", background: "none", border: "none", color: activeTab === tab.id ? "#00ff41" : "#555", borderBottom: activeTab === tab.id ? "3px solid #00ff41" : "none", fontWeight: "bold", fontSize: '0.8em' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <main style={{ maxWidth: "500px", margin: "0 auto" }}>
        {activeTab === "partidos" && (
          <div>
            <h4 style={{ color: "#777", marginBottom: "15px" }}>Cartelera {league}</h4>
            {matchesDB[league].map(m => <MatchCard key={m.id} match={m} selected={selectedMatches} setSelected={setSelectedMatches} />)}
          </div>
        )}

        {activeTab === "combinada" && (
          <div>
            <h4 style={{ color: "#00ff41" }}>La Mejor Combinada de {league}</h4>
            <div style={{ background: "#111", padding: "15px", borderRadius: "10px", border: "1px solid #00ff41" }}>
              {comboIA.map((m, i) => (
                <div key={i} style={{ padding: "10px 0", borderBottom: i < 2 ? "1px solid #222" : "none" }}>
                  <div style={{ fontSize: "0.9em" }}>{m.home} vs {m.away}</div>
                  <div style={{ fontWeight: "bold", color: "#00ff41" }}>Pick: {m.res.bestPick} ({m.res.bestProb}%)</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "top5" && (
          <div>
            <h4 style={{ color: "#ffaa00" }}>Pronósticos Más Seguros (Global)</h4>
            {top5Global.map((m, i) => (
              <div key={i} style={{ background: "#111", padding: "15px", borderRadius: "8px", marginBottom: "10px", borderLeft: "4px solid #ffaa00" }}>
                <div style={{ fontSize: "0.8em", color: "#666" }}>{m.date}</div>
                <div style={{ fontWeight: "bold" }}>{m.home} vs {m.away}</div>
                <div style={{ color: "#00ff41", marginTop: "5px" }}>Prona IA: {m.res.bestPick} ({m.res.bestProb}%)</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ticket" && (
          <div style={{ background: "#111", padding: "20px", borderRadius: "10px", border: "1px solid #333" }}>
            <h4 style={{ marginTop: 0 }}>🎫 Tu Ticket</h4>
            {selectedMatches.length === 0 ? <p style={{color: "#444"}}>Vacío.</p> : (
              <>
                {selectedMatches.map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #222" }}>
                    <span style={{ fontSize: "0.85em" }}>{s.home} ({s.pick})</span>
                    <span style={{ fontWeight: "bold", color: "#00ff41" }}>@{s.quota}</span>
                  </div>
                ))}
                <div style={{ marginTop: "20px", textAlign: "right", fontSize: "1.2em", fontWeight: "bold" }}>
                  Cuota Total: <span style={{ color: "#00ff41" }}>@{selectedMatches.reduce((acc, curr) => acc * curr.quota, 1).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
          }

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
