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
  "Villarreal": { a: 1.2, d: 1.0 }, "Sevilla": { a: 1.1, d: 1.1 },
  "Alaves": { a: 0.9, d: 1.1 }, "Mallorca": { a: 1.0, d: 1.0 },
  "Espanyol": { a: 0.9, d: 1.2 }, "Betis": { a: 1.2, d: 1.0 },
  "Celta Vigo": { a: 1.1, d: 1.1 }, "Real Sociedad": { a: 1.2, d: 0.9 },
  "Osasuna": { a: 1.0, d: 1.0 }, "Rayo Vallecano": { a: 1.0, d: 1.1 },
  "Levante": { a: 0.9, d: 1.2 }, "Real Oviedo": { a: 0.8, d: 1.1 },
  "Valencia": { a: 1.1, d: 1.0 }, "Burnley": { a: 0.8, d: 1.2 },
  "Bournemouth": { a: 0.9, d: 1.1 }, "Sunderland": { a: 0.8, d: 1.1 },
  "Brighton": { a: 1.2, d: 1.0 }, "West Ham United": { a: 1.1, d: 1.0 },
  "Crystal Palace": { a: 0.9, d: 1.1 }, "Leeds United": { a: 0.9, d: 1.2 },
  "Manchester United": { a: 1.2, d: 1.0 }, "Aston Villa": { a: 1.2, d: 1.0 },
  "Nottingham Forest": { a: 0.9, d: 1.1 }, "Fulham": { a: 1.0, d: 1.0 },
  "Brentford": { a: 1.0, d: 1.1 }, "Wolves": { a: 0.9, d: 1.1 }
};

function runModel(match) {
  const defaultRating = { a: 1.0, d: 1.0 };
  const home = teamRatings[match.home] || defaultRating;
  const away = teamRatings[match.away] || defaultRating;
  const hxg = (home.a * away.d) * 1.15;
  const axg = away.a * home.d;
  let p1 = 0, pX = 0, p2 = 0;
  let maxExactProb = 0;
  let exactScore = "0-0";

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxExactProb) { maxExactProb = pr; exactScore = `${i}-${j}`; }
    }
  }

  const prob1 = (p1 * 100).toFixed(1);
  const probX = (pX * 100).toFixed(1);
  const prob2 = (p2 * 100).toFixed(1);
  const totalGoals = hxg + axg;
  const corners = 7.5 + (home.a + away.a);

  return {
    homeProb: prob1, drawProb: probX, awayProb: prob2,
    odd1: (100 / prob1).toFixed(2), oddX: (100 / probX).toFixed(2), odd2: (100 / prob2).toFixed(2),
    bestProb: Math.max(parseFloat(prob1), parseFloat(probX), parseFloat(prob2)),
    bestPick: parseFloat(prob1) > Math.max(parseFloat(probX), parseFloat(prob2)) ? "1" : (parseFloat(probX) > parseFloat(prob2) ? "X" : "2"),
    exactScore, 
    predictGoals: totalGoals > 2.5 ? "+2.5" : "-2.5",
    predictCorners: corners > 9.5 ? "+9.5" : "-9.5"
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
    { id: 47, home: "Newcastle", away: "Sunderland", date: "22-03" },
    { id: 48, home: "Tottenham Hotspur", away: "Nottingham Forest", date: "22-03" }
  ],
  BUNDESLIGA: [
    { id: 60, home: "Monchengladbach", away: "St Pauli", date: "13-03" },
    { id: 61, home: "Dortmund", away: "Augsburg", date: "14-03" },
    { id: 62, home: "Eintracht Frankfurt", away: "Heidenheim", date: "14-03" },
    { id: 63, home: "Hoffenheim", away: "Wolfsburg", date: "14-03" },
    { id: 64, home: "Leverkusen", away: "Bayern Munich", date: "14-03" },
    { id: 65, home: "Hamburg", away: "Cologne", date: "14-03" },
    { id: 66, home: "Stuttgart", away: "Union Berlin", date: "15-03" }
  ],
  SERIEA: [
    { id: 80, home: "Torino", away: "Parma", date: "13-03" },
    { id: 81, home: "Inter", away: "Atalanta", date: "14-03" },
    { id: 82, home: "Napoli", away: "Lecce", date: "14-03" },
    { id: 83, home: "Udinese", away: "Juventus", date: "14-03" },
    { id: 84, home: "Lazio", away: "Bologna", date: "15-03" },
    { id: 85, home: "Fiorentina", away: "Cagliari", date: "15-03" }
  ],
  CHAMPIONS: [
    { id: 100, home: "Arsenal", away: "Porto", date: "18-03" },
    { id: 101, home: "Bayern Munich", away: "Inter", date: "18-03" },
    { id: 102, home: "Manchester City", away: "Real Madrid", date: "18-03" },
    { id: 103, home: "PSG", away: "Dortmund", date: "19-03" },
    { id: 104, home: "Barcelona", away: "Napoli", date: "19-03" },
    { id: 105, home: "Liverpool", away: "Juventus", date: "19-03" }
  ],
  EUROPA: [
    { id: 120, home: "Freiburg", away: "Genk", date: "19-03" },
    { id: 121, home: "Lyon", away: "Celta Vigo", date: "19-03" },
    { id: 122, home: "Midtjylland", away: "Nottingham Forest", date: "19-03" },
    { id: 123, home: "Aston Villa", away: "Lille", date: "19-03" }
  ]
};

/* ===========================
COMPONENTES VISUALES
=========================== */

function MatchCard({ match, selected, setSelected }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  const isS = (p) => selected.some(s => s.id === match.id && s.pick === p);
  const toggleS = (p, o) => {
    if (isS(p)) setSelected(selected.filter(s => !(s.id === match.id && s.pick === p)));
    else setSelected([...selected.filter(s => s.id !== match.id), { ...match, pick: p, quota: parseFloat(o) }]);
  };

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #222" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", justifyContent: "space-between", cursor: "pointer", marginBottom: "10px" }}>
        <span style={{ fontSize: "0.9em", fontWeight: "bold" }}>{match.home} vs {match.away}</span>
        <span style={{ color: "#00ff41" }}>{open ? "▲" : "▼"}</span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
        {[["1", data.homeProb, data.odd1], ["X", data.drawProb, data.oddX], ["2", data.awayProb, data.odd2]].map(([p, pr, od]) => (
          <div key={p} onClick={() => toggleS(p, od)} style={{ background: isS(p) ? "#00ff41" : "#1a1a1a", color: isS(p) ? "#000" : "#fff", padding: "8px 2px", borderRadius: "4px", textAlign: "center", cursor: "pointer", fontSize: "0.8em" }}>
            <div>{p} ({pr}%)</div>
            <div style={{ fontWeight: "bold" }}>@{od}</div>
          </div>
        ))}
      </div>

      {open && (
        <div style={{ marginTop: "10px", padding: "10px", background: "#050505", borderRadius: "5px", fontSize: "0.85em", borderTop: "1px solid #222" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{color: "#888"}}>Resultado Exacto:</span> <span style={{color: "#fff", fontWeight: "bold"}}>{data.exactScore}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{color: "#888"}}>Goles:</span> <span style={{color: "#00ff41"}}>{data.predictGoals}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{color: "#888"}}>Córners:</span> <span style={{color: "#ffaa00"}}>{data.predictCorners}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GolPredictPro() {
  const [league, setLeague] = useState("LALIGA");
  const [activeTab, setActiveTab] = useState("partidos");
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const top5Global = useMemo(() => {
    return Object.values(matchesDB).flat().map(m => ({ ...m, res: runModel(m) }))
      .sort((a, b) => b.res.bestProb - a.res.bestProb).slice(0, 5);
  }, []);

  const comboIA = useMemo(() => {
    return matchesDB[league].map(m => ({ ...m, res: runModel(m) }))
      .sort((a, b) => b.res.bestProb - a.res.bestProb).slice(0, 3);
  }, [league]);

  if (!isClient) return null;

  return (
    <div style={{ background: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: 'center', marginBottom: "20px" }}>GOLPREDICT PRO</h2>

      <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px" }}>
        {Object.keys(matchesDB).map(l => (
          <button key={l} onClick={() => setLeague(l)} style={{ padding: "8px 15px", background: league === l ? "#00ff41" : "#222", color: league === l ? "#000" : "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", fontSize: '0.7em', whiteSpace: 'nowrap' }}>{l}</button>
        ))}
      </div>

      <nav style={{ display: "flex", borderBottom: "1px solid #222", marginBottom: "20px" }}>
        {[{id:'partidos',l:'Partidos'},{id:'ia',l:'IA Combo'},{id:'top5',l:'Top 5 IA'},{id:'tk',l:`Ticket (${selectedMatches.length})`}].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, padding: "10px 2px", background: "none", border: "none", color: activeTab === t.id ? "#00ff41" : "#555", borderBottom: activeTab === t.id ? "3px solid #00ff41" : "none", fontWeight: "bold", fontSize: '0.75em' }}>{t.l}</button>
        ))}
      </nav>

      <main style={{ maxWidth: "500px", margin: "0 auto" }}>
        {activeTab === "partidos" && matchesDB[league].map(m => <MatchCard key={m.id} match={m} selected={selectedMatches} setSelected={setSelectedMatches} />)}

        {activeTab === "ia" && (
          <div style={{ background: "#111", padding: "15px", borderRadius: "10px", border: "1px solid #00ff41" }}>
            <h4 style={{color: "#00ff41", marginTop: 0}}>Sugerencia {league}</h4>
            {comboIA.map((m, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: i<2?"1px solid #222":"" }}>
                <div style={{fontSize: "0.85em"}}>{m.home} vs {m.away}</div>
                <div style={{color: "#00ff41", fontWeight: "bold", fontSize: "0.9em"}}>Pick: {m.res.bestPick} ({m.res.bestProb}%)</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "top5" && top5Global.map((m, i) => (
          <div key={i} style={{ background: "#111", padding: "12px", borderRadius: "8px", marginBottom: "10px", borderLeft: "4px solid #ffaa00" }}>
            <div style={{fontWeight: "bold", fontSize: "0.9em"}}>{m.home} vs {m.away}</div>
            <div style={{color: "#00ff41", fontSize: "0.85em"}}>Gana: {m.res.bestPick} ({m.res.bestProb}%) | {m.res.exactScore}</div>
          </div>
        ))}

        {activeTab === "tk" && (
          <div style={{ background: "#111", padding: "15px", borderRadius: "10px" }}>
            {selectedMatches.length === 0 ? "Vacio" : (
              <>
                {selectedMatches.map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #222", fontSize: "0.85em" }}>
                    <span>{s.home} ({s.pick})</span> <span style={{color: "#00ff41"}}>@{s.quota}</span>
                  </div>
                ))}
                <div style={{ marginTop: "15px", textAlign: "right", fontWeight: "bold" }}>
                  Cuota Total: @{selectedMatches.reduce((acc, curr) => acc * curr.quota, 1).toFixed(2)}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
     }
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
