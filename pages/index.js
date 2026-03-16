import React, { useState, useEffect, useMemo } from "react";

/* ===========================
LÓGICA IA Y SISTEMA DE VALIDACIÓN
=========================== */
const teamRatings = {
  "Real Madrid": { a: 1.45, d: 0.7 }, "Elche": { a: 0.8, d: 1.2 },
  "Girona": { a: 1.2, d: 0.9 }, "Athletic Bilbao": { a: 1.1, d: 0.9 },
  "Atlético Madrid": { a: 1.3, d: 0.8 }, "Getafe": { a: 0.9, d: 1.1 },
  "Arsenal": { a: 1.4, d: 0.8 }, "Everton": { a: 0.9, d: 1.1 },
  "Chelsea": { a: 1.1, d: 1 }, "Newcastle": { a: 1.2, d: 0.95 },
  "Liverpool": { a: 1.45, d: 0.85 }, "Manchester City": { a: 1.6, d: 0.75 },
  "Barcelona": { a: 1.4, d: 0.85 }, "Juventus": { a: 1.2, d: 0.8 },
  "Bayern Munich": { a: 1.55, d: 0.75 }, "Inter": { a: 1.35, d: 0.85 },
  "Napoli": { a: 1.3, d: 0.95 }, "Leverkusen": { a: 1.35, d: 0.9 }
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamRatings[match.home] || { a: 1.0, d: 1.0 };
  const away = teamRatings[match.away] || { a: 1.0, d: 1.0 };
  const hxg = (home.a * away.d) * 1.15;
  const axg = away.a * home.d;
  
  let p1 = 0, pX = 0, p2 = 0;
  let maxP = 0; let exact = "0-0";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxP) { maxP = pr; exact = `${i}-${j}`; }
    }
  }

  const prob1 = parseFloat((p1 * 100).toFixed(1));
  const probX = parseFloat((pX * 100).toFixed(1));
  const prob2 = parseFloat((p2 * 100).toFixed(1));
  const bestProb = Math.max(prob1, probX, prob2);
  const bestPick = prob1 === bestProb ? "1" : (probX === bestProb ? "X" : "2");

  let status = "pending"; 
  if (match.ftScore) {
    const [hG, aG] = match.ftScore.split("-").map(Number);
    const actual = hG > aG ? "1" : (hG === aG ? "X" : "2");
    status = actual === bestPick ? "hit" : "miss";
  }

  // IA Realista: Menos de 4 tarjetas y córners ajustados
  const cornerIdx = (home.a + away.a) * 4.1;
  const cardIdx = (home.d + away.d) * 2.1;

  return {
    homeProb: prob1, drawProb: probX, awayProb: prob2,
    bestPick, bestProb, status, exact,
    corners: cornerIdx > 10.2 ? "+9.5" : (cornerIdx > 8.5 ? "+8.5" : "-8.5"),
    cards: cardIdx > 5.2 ? "+5.5" : (cardIdx > 4.2 ? "+4.5" : "-4.5")
  };
}

/* ===========================
BASE DE DATOS SEGÚN CAPTURAS
=========================== */
const matchesDB = {
  LALIGA: [
    { id: 1, home: "Alaves", away: "Villarreal", date: "13-03", ftScore: "1-1" },
    { id: 2, home: "Girona", away: "Athletic Bilbao", date: "14-03", ftScore: "1-2" },
    { id: 3, home: "Atlético Madrid", away: "Getafe", date: "14-03", ftScore: "2-1" },
    { id: 4, home: "Real Oviedo", away: "Valencia", date: "14-03", ftScore: "0-1" },
    { id: 5, home: "Real Madrid", away: "Elche", date: "14-03", ftScore: "3-0" },
    { id: 6, home: "Mallorca", away: "Espanyol", date: "15-03", ftScore: "0-0" },
    { id: 7, home: "Barcelona", away: "Sevilla", date: "15-03", ftScore: "2-0" },
    { id: 8, home: "Betis", away: "Celta Vigo", date: "15-03", ftScore: "1-2" },
    { id: 9, home: "Real Sociedad", away: "Osasuna", date: "15-03", ftScore: "1-1" },
    { id: 10, home: "Rayo Vallecano", away: "Levante", date: "16-03", ftScore: "0-2" }
  ],
  PREMIER: [
    { id: 30, home: "Burnley", away: "Bournemouth", date: "14-03", ftScore: "0-2" },
    { id: 31, home: "Sunderland", away: "Brighton", date: "14-03", ftScore: "1-1" },
    { id: 32, home: "Arsenal", away: "Everton", date: "14-03", ftScore: "3-1" },
    { id: 33, home: "Chelsea", away: "Newcastle", date: "14-03", ftScore: "2-2" },
    { id: 34, home: "West Ham United", away: "Manchester City", date: "14-03", ftScore: "1-3" },
    { id: 35, home: "Crystal Palace", away: "Leeds United", date: "15-03", ftScore: "0-0" },
    { id: 36, home: "Manchester United", away: "Aston Villa", date: "15-03", ftScore: "1-2" },
    { id: 37, home: "Nottingham Forest", away: "Fulham", date: "15-03", ftScore: "1-1" },
    { id: 38, home: "Liverpool", away: "Tottenham Hotspur", date: "15-03", ftScore: "3-2" },
    { id: 39, home: "Brentford", away: "Wolves", date: "16-03", ftScore: "0-1" }
  ],
  SERIEA: [
    { id: 80, home: "Torino", away: "Parma", date: "13-03", ftScore: "1-1" },
    { id: 81, home: "Inter", away: "Atalanta", date: "14-03", ftScore: "2-0" },
    { id: 82, home: "Napoli", away: "Lecce", date: "14-03", ftScore: "2-1" },
    { id: 83, home: "Udinese", away: "Juventus", date: "14-03", ftScore: "0-2" },
    { id: 84, home: "Lazio", away: "Bologna", date: "15-03", ftScore: "1-0" },
    { id: 85, home: "Fiorentina", away: "Cagliari", date: "15-03", ftScore: "1-1" }
  ],
  BUNDESLIGA: [
    { id: 60, home: "Monchengladbach", away: "St Pauli", date: "13-03", ftScore: "1-1" },
    { id: 61, home: "Dortmund", away: "Augsburg", date: "14-03", ftScore: "2-1" },
    { id: 62, home: "Eintracht Frankfurt", away: "Heidenheim", date: "14-03", ftScore: "3-1" },
    { id: 63, home: "Hoffenheim", away: "Wolfsburg", date: "14-03", ftScore: "0-2" },
    { id: 64, home: "Leverkusen", away: "Bayern Munich", date: "14-03", ftScore: "1-1" },
    { id: 65, home: "Hamburg", away: "Cologne", date: "14-03", ftScore: "2-1" },
    { id: 66, home: "Stuttgart", away: "Union Berlin", date: "15-03", ftScore: "3-0" }
  ]
};

/* ===========================
APP PRINCIPAL
=========================== */
function MatchCard({ match }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  const borderColor = data.status === "hit" ? "#00ff41" : (data.status === "miss" ? "#ff3333" : "#222");

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "8px", marginBottom: "10px", border: `2px solid ${borderColor}`, cursor: "pointer" }} onClick={() => setOpen(!open)}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7em", color: "#666", marginBottom: "5px" }}>
        <span>{match.date}</span>
        {match.ftScore && <span style={{ color: data.status === "hit" ? "#00ff41" : "#ff3333", fontWeight: "bold" }}>FINALIZADO</span>}
      </div>
      <div style={{ textAlign: "center", marginBottom: "8px", fontWeight: "bold" }}>
        {match.home} <span style={{color: "#00ff41"}}>{match.ftScore || "vs"}</span> {match.away}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", textAlign: "center", fontSize: "0.75em" }}>
        <div style={{ background: data.bestPick === "1" ? "#00ff4122" : "#1a1a1a", padding: "4px", borderRadius: "4px" }}>1: {data.homeProb}%</div>
        <div style={{ background: data.bestPick === "X" ? "#00ff4122" : "#1a1a1a", padding: "4px", borderRadius: "4px" }}>X: {data.drawProb}%</div>
        <div style={{ background: data.bestPick === "2" ? "#00ff4122" : "#1a1a1a", padding: "4px", borderRadius: "4px" }}>2: {data.awayProb}%</div>
      </div>
      {open && (
        <div style={{ marginTop: "10px", padding: "8px", background: "#050505", borderRadius: "5px", fontSize: "0.75em", borderTop: "1px solid #222" }}>
          <div style={{display:'flex', justifyContent:'space-between'}}><span>Marcador IA:</span> <b>{data.exact}</b></div>
          <div style={{display:'flex', justifyContent:'space-between'}}><span>Córners:</span> <b style={{color: "#ffaa00"}}>{data.corners}</b></div>
          <div style={{display:'flex', justifyContent:'space-between'}}><span>Tarjetas:</span> <b style={{color: "#ff3333"}}>{data.cards}</b></div>
        </div>
      )}
    </div>
  );
}

export default function GolPredictPro() {
  const [league, setLeague] = useState("LALIGA");
  const [activeTab, setActiveTab] = useState("partidos");
  const [userEmail, setUserEmail] = useState("");
  const isVIP = ["astigarrabia1984@gmail.com", "vieirajuandavid9@gmail.com"].includes(userEmail);

  const superCombo = useMemo(() => {
    const all = Object.values(matchesDB).flat().filter(m => !m.ftScore);
    return all.map(m => ({ ...m, res: runModel(m) }))
              .sort((a, b) => b.res.bestProb - a.res.bestProb).slice(0, 4);
  }, []);

  return (
    <div style={{ background: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <header style={{textAlign: 'center', padding: '10px 0'}}>
        <h2 style={{ color: "#00ff41", margin: 0 }}>GOLPREDICT PRO</h2>
        <input 
          type="email" 
          placeholder="Email VIP" 
          onChange={(e) => setUserEmail(e.target.value.toLowerCase())}
          style={{background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '0.7em', padding: '5px', borderRadius: '4px', marginTop: '10px'}}
        />
      </header>

      <nav style={{ display: "flex", gap: "5px", margin: "15px 0" }}>
        <button onClick={() => setActiveTab("partidos")} style={{ flex: 1, padding: "12px", background: activeTab === "partidos" ? "#00ff41" : "#222", color: activeTab === "partidos" ? "#000" : "#fff", borderRadius: "5px", fontWeight: "bold", border:'none' }}>LIGAS</button>
        <button onClick={() => setActiveTab("combo")} style={{ flex: 1, padding: "12px", background: activeTab === "combo" ? "#ffaa00" : "#222", color: activeTab === "combo" ? "#000" : "#fff", borderRadius: "5px", fontWeight: "bold", border:'none' }}>⭐ SUPER COMBO</button>
      </nav>

      {activeTab === "partidos" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px" }}>
            {Object.keys(matchesDB).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ padding: "8px 15px", background: league === l ? "#333" : "#111", border: "1px solid #333", color: league === l ? "#00ff41" : "#fff", borderRadius: "20px", fontSize: '0.7em', whiteSpace: 'nowrap' }}>{l}</button>
            ))}
          </div>
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            {matchesDB[league].map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </>
      )}

      {activeTab === "combo" && (
        <div style={{ maxWidth: "500px", margin: "0 auto", background: "#111", padding: "20px", borderRadius: "15px", border: "2px solid #ffaa00" }}>
          {!isVIP ? (
            <p style={{textAlign:'center', color:'#ff3333'}}>Acceso restringido. Introduce un email de fundador VIP.</p>
          ) : (
            <>
              <h3 style={{ color: "#ffaa00", marginTop: 0, textAlign: "center" }}>COMBINADA MULTI-LIGA</h3>
              {superCombo.map(m => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #222" }}>
                  <span style={{ fontSize: "0.85em" }}>{m.home} vs {m.away}</span>
                  <span style={{ color: "#00ff41", fontWeight: "bold" }}>{m.res.bestPick} ({m.res.bestProb}%)</span>
                </div>
              ))}
              <div style={{ marginTop: "20px", textAlign: "center", padding: "15px", background: "#00ff41", color: "#000", borderRadius: "8px", fontWeight: "bold" }}>
                Cuota Estimada: {(superCombo.reduce((acc, m) => acc * (m.res.bestProb/100), 1) * 10).toFixed(2)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
  }
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
