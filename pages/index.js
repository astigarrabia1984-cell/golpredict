import React, { useState, useMemo } from "react";

/* ===========================
LÓGICA IA Y SISTEMA DE VALIDACIÓN
=========================== */
const teamRatings = {
  "Real Madrid": { a: 1.5, d: 0.7 }, "Barcelona": { a: 1.4, d: 0.8 },
  "Manchester City": { a: 1.6, d: 0.7 }, "Arsenal": { a: 1.4, d: 0.8 },
  "Inter": { a: 1.3, d: 0.7 }, "Juventus": { a: 1.2, d: 0.8 }
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamRatings[match.home] || { a: 1.1, d: 1.0 };
  const away = teamRatings[match.away] || { a: 1.0, d: 1.1 };
  const hxg = (home.a * away.d) * 1.1;
  const axg = away.a * home.d;
  
  let p1 = 0, pX = 0, p2 = 0;
  let maxProb = 0; let exact = "0-0";
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxProb) { maxProb = pr; exact = `${i}-${j}`; }
    }
  }

  const bestPick = p1 > pX && p1 > p2 ? "1" : (p2 > p1 && p2 > pX ? "2" : "X");
  const bestProb = Math.max(p1, pX, p2) * 100;

  let status = "pending"; 
  if (match.ftScore) {
    const [hG, aG] = match.ftScore.split("-").map(Number);
    const actual = hG > aG ? "1" : (hG === aG ? "X" : "2");
    status = actual === bestPick ? "hit" : "miss";
  }

  return {
    homeProb: (p1 * 100).toFixed(1),
    drawProb: (pX * 100).toFixed(1),
    awayProb: (p2 * 100).toFixed(1),
    bestPick, bestProb: bestProb.toFixed(1), status, exact
  };
}

/* ===========================
BASE DE DATOS: TUS RESULTADOS VERIFICADOS
=========================== */
const matchesDB = {
  LALIGA: [
    { id: 1, home: "Real Sociedad", away: "Osasuna", ftScore: "3-1" },
    { id: 2, home: "Real Betis", away: "Celta de Vigo", ftScore: "1-1" },
    { id: 3, home: "Barcelona", away: "Sevilla", ftScore: "5-2" },
    { id: 4, home: "Mallorca", away: "Espanyol", ftScore: "2-1" },
    { id: 5, home: "Real Madrid", away: "Elche", ftScore: "4-1" },
    { id: 6, home: "Real Oviedo", away: "Valencia", ftScore: "1-0" },
    { id: 7, home: "Atlético Madrid", away: "Getafe", ftScore: "1-0" },
    { id: 8, home: "Girona", away: "Athletic Club", ftScore: "3-0" },
    { id: 9, home: "Alavés", away: "Villarreal", ftScore: "1-1" }
  ],
  PREMIER: [
    { id: 10, home: "Liverpool", away: "Tottenham", ftScore: "1-1" },
    { id: 11, home: "Crystal Palace", away: "Leeds Utd", ftScore: "0-0" },
    { id: 12, home: "Manchester Utd", away: "Aston Villa", ftScore: "3-1" },
    { id: 13, home: "Nottingham Forest", away: "Fulham", ftScore: "0-0" },
    { id: 14, home: "West Ham", away: "Manchester City", ftScore: "1-1" },
    { id: 15, home: "Arsenal", away: "Everton", ftScore: "2-0" },
    { id: 16, home: "Chelsea", away: "Newcastle", ftScore: "0-1" },
    { id: 17, home: "Burnley", away: "Bournemouth", ftScore: "0-0" },
    { id: 18, home: "Sunderland", away: "Brighton", ftScore: "0-1" }
  ],
  SERIEA: [
    { id: 20, home: "Lazio", away: "AC Milan", ftScore: "1-0" },
    { id: 21, home: "Como", away: "Roma", ftScore: "2-1" },
    { id: 22, home: "Pisa", away: "Cagliari", ftScore: "3-1" },
    { id: 23, home: "Sassuolo", away: "Bolonia", ftScore: "0-1" },
    { id: 24, home: "Verona", away: "Genoa", ftScore: "0-2" },
    { id: 25, home: "Udinese", away: "Juventus", ftScore: "0-1" },
    { id: 26, home: "Nápoles", away: "Lecce", ftScore: "2-1" },
    { id: 27, home: "Inter", away: "Atalanta", ftScore: "1-1" },
    { id: 28, home: "Torino", away: "Parma", ftScore: "4-1" }
  ]
};

/* ===========================
INTERFAZ
=========================== */
function MatchCard({ match }) {
  const data = useMemo(() => runModel(match), [match]);
  const color = data.status === "hit" ? "#00ff41" : (data.status === "miss" ? "#ff3333" : "#333");

  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "10px", marginBottom: "10px", border: `2px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7em", color: "#666" }}>
        <span>ID: #{match.id}</span>
        <span style={{ color, fontWeight: "bold" }}>{match.ftScore ? (data.status === "hit" ? "ACIERTO" : "FALLO") : "PENDIENTE"}</span>
      </div>
      <div style={{ textAlign: "center", margin: "10px 0", fontWeight: "bold" }}>
        {match.home} <span style={{color: "#00ff41"}}>{match.ftScore}</span> {match.away}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", textAlign: "center", fontSize: "0.8em" }}>
        <div style={{ background: "#1a1a1a", padding: "5px", borderRadius: "5px" }}>1: {data.homeProb}%</div>
        <div style={{ background: "#1a1a1a", padding: "5px", borderRadius: "5px" }}>X: {data.drawProb}%</div>
        <div style={{ background: "#1a1a1a", padding: "5px", borderRadius: "5px" }}>2: {data.awayProb}%</div>
      </div>
    </div>
  );
}

export default function GolPredictPro() {
  const [league, setLeague] = useState("LALIGA");
  const [email, setEmail] = useState("");
  const isVIP = ["astigarrabia1984@gmail.com", "vieirajuandavid9@gmail.con"].includes(email.toLowerCase().trim());

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "15px", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#00ff41", margin: "0" }}>GOLPREDICT PRO</h1>
        <input 
          type="email" 
          placeholder="Email VIP" 
          onChange={(e) => setEmail(e.target.value)}
          style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "8px", borderRadius: "5px", marginTop: "10px", width: "100%", maxWidth: "300px" }}
        />
      </header>

      <div style={{ display: "flex", overflowX: "auto", gap: "10px", marginBottom: "20px" }}>
        {Object.keys(matchesDB).map(l => (
          <button key={l} onClick={() => setLeague(l)} style={{ padding: "10px 20px", background: league === l ? "#00ff41" : "#111", color: league === l ? "#000" : "#fff", border: "none", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}>{l}</button>
        ))}
      </div>

      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        {matchesDB[league].map(m => <MatchCard key={m.id} match={m} />)}
      </div>

      {isVIP && (
        <div style={{ marginTop: "30px", padding: "15px", background: "#111", borderRadius: "10px", border: "1px solid #ffaa00", textAlign: "center", maxWidth: "500px", margin: "20px auto" }}>
          <h3 style={{ color: "#ffaa00", margin: "0" }}>⭐ ACCESO VIP ACTIVADO</h3>
        </div>
      )}
    </div>
  );
                                  }
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
