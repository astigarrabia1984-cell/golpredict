import React, { useState, useMemo } from "react";

/* ============================================================
   1. CEREBRO ESTADÍSTICO (78 EQUIPOS + PARÁMETROS POISSON)
   ============================================================ */
const teamStats = {
  // ESPAÑA
  "Real Madrid": { a: 2.2, d: 0.7, c: 6.2 }, "Barcelona": { a: 2.1, d: 0.9, c: 5.8 },
  "Atlético de Madrid": { a: 1.7, d: 0.8, c: 4.8 }, "Girona": { a: 1.9, d: 1.2, c: 5.0 },
  "Villarreal": { a: 1.8, d: 1.5, c: 4.9 }, "Real Sociedad": { a: 1.3, d: 0.9, c: 5.6 },
  "Sevilla": { a: 1.4, d: 1.4, c: 5.5 }, "Valencia": { a: 1.1, d: 1.2, c: 4.2 },
  "Espanyol": { a: 1.1, d: 1.5, c: 4.0 }, "Getafe": { a: 1.0, d: 1.1, c: 3.8 },
  "Elche": { a: 0.8, d: 1.6, c: 3.9 }, "Mallorca": { a: 0.9, d: 1.1, c: 4.1 },
  "Rayo Vallecano": { a: 1.0, d: 1.4, c: 4.7 }, "Alavés": { a: 1.0, d: 1.3, c: 4.4 },
  "Real Betis": { a: 1.3, d: 1.1, c: 5.1 }, "Athletic Club": { a: 1.5, d: 1.0, c: 5.4 },
  // INGLATERRA
  "Man City": { a: 2.5, d: 0.7, c: 7.5 }, "Arsenal": { a: 2.1, d: 0.8, c: 6.8 },
  "Liverpool": { a: 2.3, d: 0.9, c: 7.2 }, "Man Utd": { a: 1.5, d: 1.5, c: 5.4 },
  "Chelsea": { a: 1.7, d: 1.6, c: 5.8 }, "Tottenham": { a: 2.0, d: 1.5, c: 6.4 },
  "Brighton": { a: 1.6, d: 1.6, c: 5.7 }, "Bournemouth": { a: 1.3, d: 1.7, c: 4.8 },
  "Newcastle": { a: 1.8, d: 1.6, c: 6.0 }, "Sunderland": { a: 1.1, d: 1.4, c: 4.5 },
  "Everton": { a: 1.1, d: 1.3, c: 5.0 }, "West Ham": { a: 1.4, d: 1.5, c: 4.9 },
  // ITALIA
  "Inter": { a: 2.2, d: 0.6, c: 6.1 }, "Milan": { a: 1.9, d: 1.1, c: 5.3 },
  "Juventus": { a: 1.5, d: 0.7, c: 4.9 }, "Napoli": { a: 1.5, d: 1.3, c: 5.9 },
  "Torino": { a: 1.0, d: 1.0, c: 4.4 }, "Sassuolo": { a: 1.2, d: 1.6, c: 4.2 },
  "Fiorentina": { a: 1.4, d: 1.2, c: 5.2 }, "Roma": { a: 1.6, d: 1.1, c: 4.6 },
  // ALEMANIA
  "Leverkusen": { a: 2.4, d: 0.8, c: 6.4 }, "Bayern": { a: 2.7, d: 1.1, c: 7.3 },
  "Dortmund": { a: 1.9, d: 1.3, c: 5.6 }, "RB Leipzig": { a: 2.1, d: 1.1, c: 6.0 },
  "Union Berlin": { a: 1.0, d: 1.2, c: 4.1 }, "Hoffenheim": { a: 1.5, d: 1.8, c: 4.7 },
  "Heidenheim": { a: 1.1, d: 1.4, c: 4.0 }, "Hamburgo": { a: 1.2, d: 1.4, c: 4.5 }
};

/* ============================================================
   2. MOTOR DE PROBABILIDADES
   ============================================================ */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.2, c: 4.5 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.3, c: 4.2 };
  const hxg = (home.a * 1.15) * away.d;
  const axg = away.a * (home.d * 0.95);
  
  let p1 = 0, pX = 0, p2 = 0, maxP = 0, exact = "0-0";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxP) { maxP = pr; exact = `${i}-${j}`; }
    }
  }
  const q1 = (1 / (p1 + 0.05)).toFixed(2);
  const qX = (1 / (pX + 0.05)).toFixed(2);
  const q2 = (1 / (p2 + 0.05)).toFixed(2);
  const bestPick = p1 > p2 && p1 > pX ? "1" : (p2 > pX ? "2" : "X");
  const prob = Math.max(p1, pX, p2) * 100;

  return { 
    p1: (p1 * 100).toFixed(0), pX: (pX * 100).toFixed(0), p2: (p2 * 100).toFixed(0),
    q1, qX, q2, exact, bestPick, prob: prob.toFixed(0),
    goals: (hxg + axg) > 2.5 ? "+2.5" : "-2.5", corners: (home.c + away.c) * 0.9 > 9.5 ? "+9.5" : "-9.5" 
  };
}

/* ============================================================
   3. APP PRINCIPAL
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("LALIGA");
  const [ticket, setTicket] = useState([]);
  const [stake, setStake] = useState(10);
  const [cashOutDone, setCashOutDone] = useState(false);

  const initialData = {
    "LALIGA": [
      { id: "sp1", home: "Villarreal", away: "Real Sociedad", date: "20.03" },
      { id: "sp2", home: "Elche", away: "Mallorca", date: "21.03" },
      { id: "sp3", home: "Espanyol", away: "Getafe", date: "21.03" },
      { id: "sp4", home: "Sevilla", away: "Valencia", date: "21.03" },
      { id: "sp5", home: "Barcelona", away: "Rayo Vallecano", date: "22.03" },
      { id: "sp6", home: "Real Madrid", away: "Atlético de Madrid", date: "22.03" },
      { id: "sp7", home: "Alavés", away: "Athletic Club", date: "22.03" }
    ],
    "PREMIER": [
      { id: "en1", home: "Bournemouth", away: "Man Utd", date: "20.03" },
      { id: "en2", home: "Brighton", away: "Liverpool", date: "21.03" },
      { id: "en3", home: "Everton", away: "Chelsea", date: "21.03" },
      { id: "en4", home: "Newcastle", away: "Sunderland", date: "22.03" },
      { id: "en5", home: "Man City", away: "Arsenal", date: "31.03" },
      { id: "en6", home: "Chelsea", away: "Man City", date: "12.04" }
    ],
    "SERIE A": [
      { id: "it1", home: "Milan", away: "Torino", date: "21.03" },
      { id: "it2", home: "Juventus", away: "Sassuolo", date: "21.03" },
      { id: "it3", home: "Fiorentina", away: "Inter", date: "22.03" },
      { id: "it4", home: "Roma", away: "Lazio", date: "22.03" },
      { id: "it5", home: "Napoli", away: "Milan", date: "05.04" }
    ],
    "BUNDESLIGA": [
      { id: "de1", home: "RB Leipzig", away: "Hoffenheim", date: "20.03" },
      { id: "de2", home: "Bayern", away: "Union Berlin", date: "21.03" },
      { id: "de3", home: "Dortmund", away: "Hamburgo", date: "21.03" },
      { id: "de4", home: "Heidenheim", away: "Leverkusen", date: "21.03" }
    ],
    "CHAMPIONS": [
      { id: "ucl1", home: "Arsenal", away: "Bayern", date: "07.04" },
      { id: "ucl2", home: "Real Madrid", away: "Man City", date: "07.04" }
    ],
    "EUROPA": [
      { id: "uel1", home: "Leverkusen", away: "West Ham", date: "09.04" },
      { id: "uel2", home: "Milan", away: "Roma", date: "09.04" }
    ]
  };

  const addToTicket = (match, pick, q) => {
    setCashOutDone(false);
    setTicket(prev => {
      const exists = prev.find(t => t.id === match.id);
      if (exists) return prev.filter(t => t.id !== match.id);
      return [...prev, { ...match, pick, q: parseFloat(q) }];
    });
  };

  const aiCombos = useMemo(() => {
    const all = Object.values(initialData).flat().map(m => ({ ...m, result: runModel(m) }));
    all.sort((a, b) => b.result.prob - a.result.prob);
    return {
      b: all.slice(0, 2),
      m: all.slice(0, 3),
      a: all.slice(0, 4)
    };
  }, []);

  const totalCuota = ticket.reduce((acc, curr) => acc * curr.q, 1).toFixed(2);
  const potentialWin = (totalCuota * stake).toFixed(2);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "15px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#00ff41", letterSpacing: "2px", margin: 0, textShadow: "0 0 10px rgba(0,255,65,0.3)" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>
      </header>

      <nav style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
        {["LIGAS", "COMBINADAS", "TICKET"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "12px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "0.75rem", position:"relative" }}>
            {t} {t === "TICKET" && ticket.length > 0 && <span style={{position:"absolute", top:"-5px", right:"-5px", background:"#ff3333", color:"#fff", borderRadius:"50%", padding:"2px 6px", fontSize:"0.6rem"}}>{ticket.length}</span>}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px", paddingBottom: "5px" }}>
            {Object.keys(initialData).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ whiteSpace: "nowrap", padding: "10px 15px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#888", border: `1px solid ${league === l ? "#00ff41" : "#333"}`, borderRadius: "20px", fontSize: "0.7rem", fontWeight:"bold" }}>{l}</button>
            ))}
          </div>
          {initialData[league].map(m => <MatchCard key={m.id} match={m} onSelect={addToTicket} ticket={ticket} />)}
        </>
      )}

      {activeTab === "COMBINADAS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <h4 style={{margin:0, color:"#666", fontSize:"0.8rem"}}>PRONÓSTICOS DE LA IA (MULTILIGA)</h4>
          <ComboCard title="IA BÁSICA (Fijos)" color="#00ff41" matches={aiCombos.b} onSelect={addToTicket} ticket={ticket} />
          <ComboCard title="IA MODERADA" color="#ffaa00" matches={aiCombos.m} onSelect={addToTicket} ticket={ticket} />
          <ComboCard title="IA ARRIESGADA" color="#ff3333" matches={aiCombos.a} onSelect={addToTicket} ticket={ticket} />
        </div>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
          <h3 style={{ color: "#00ff41", marginTop: 0, fontSize: "1.1rem" }}>CALCULADORA DE TICKET</h3>
          {ticket.length === 0 ? (
            <p style={{color:"#666", textAlign:"center", padding:"20px"}}>Tu ticket está vacío.</p>
          ) : (
            <>
              {ticket.map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #222", fontSize: "0.85rem" }}>
                  <div>
                    <div style={{fontWeight:"bold"}}>{t.home} vs {t.away}</div>
                    <div style={{color:"#00ff41"}}>Elección: {t.pick}</div>
                  </div>
                  <b style={{alignSelf:"center"}}>@{t.q}</b>
                </div>
              ))}
              
              <div style={{ marginTop: "20px", background: "#050505", padding: "15px", borderRadius: "12px", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <span>Cuota Total:</span> <b style={{ fontSize: "1.3rem", color: "#00ff41" }}>@{totalCuota}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <span>Tu Apuesta (€):</span>
                  <input type="number" value={stake} onChange={(e) => setStake(e.target.value)} style={{ width: "80px", background: "#111", border: "1px solid #00ff41", color: "#fff", padding: "8px", borderRadius: "8px", textAlign: "center", fontSize: "1rem" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #222", paddingTop: "15px" }}>
                  <span style={{fontWeight:"bold"}}>POSIBLE PREMIO:</span> 
                  <b style={{ color: "#00ff41", fontSize: "1.5rem" }}>{potentialWin}€</b>
                </div>
              </div>

              <div style={{display:"flex", gap:"10px", marginTop:"15px"}}>
                <button onClick={() => { setCashOutDone(true); setTimeout(() => setTicket([]), 2000); }} style={{ flex: 2, padding: "12px", background: "#00ff41", color: "#000", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                  {cashOutDone ? "¡APUESTA REALIZADA! ✅" : "CERRAR APUESTA"}
                </button>
                <button onClick={() => setTicket([])} style={{ flex: 1, padding: "12px", background: "transparent", color: "#ff3333", border: "1px solid #ff3333", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>LIMPIAR</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, onSelect, ticket }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  const currentPick = ticket.find(t => t.id === match.id)?.pick;

  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #222" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#666", marginBottom: "10px" }}>
        <span style={{color:"#00ff41", fontWeight:"bold"}}>📅 {match.date}</span>
      </div>
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1rem", marginBottom: "15px" }}>
        {match.home} <span style={{color: "#444", margin:"0 5px"}}>vs</span> {match.away}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {[{ l: "1", q: data.q1, p: data.p1 }, { l: "X", q: data.qX, p: data.pX }, { l: "2", q: data.q2, p: data.p2 }].map(i => (
          <button key={i.l} onClick={() => onSelect(match, i.l, i.q)} style={{ background: currentPick === i.l ? "#00ff41" : "#050505", color: currentPick === i.l ? "#000" : "#fff", border: currentPick === i.l ? "1px solid #00ff41" : "1px solid #333", borderRadius: "10px", padding: "10px 5px", cursor: "pointer", transition: "0.2s" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "bold" }}>{i.l}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: "900" }}>@{i.q}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{i.p}%</div>
          </button>
        ))}
      </div>
      <button onClick={() => setOpen(!open)} style={{width:"100%", background:"none", border:"none", color:"#444", fontSize:"0.65rem", marginTop:"12px", cursor:"pointer", textDecoration:"underline"}}>
        {open ? "OCULTAR DATA" : "ANÁLISIS IA (SCORE/CÓRNERS)"}
      </button>
      {open && (
        <div style={{ marginTop: "10px", fontSize: "0.75rem", background: "#050505", padding: "12px", borderRadius: "8px", border: "1px dashed #333", color: "#ccc" }}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}><span>🎯 Marcador IA:</span> <b style={{color:"#00ff41"}}>{data.exact}</b></div>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}><span>⚽ Línea Goles:</span> <b>{data.goals}</b></div>
          <div style={{display:"flex", justifyContent:"space-between"}}><span>🚩 Córners:</span> <b>{data.corners}</b></div>
        </div>
      )}
    </div>
  );
}

function ComboCard({ title, color, matches, onSelect, ticket }) {
  const cuota = matches.reduce((acc, curr) => acc * parseFloat(curr.result.q1), 1).toFixed(2);
  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "15px", borderLeft: `6px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <b style={{ color, fontSize: "0.9rem" }}>{title}</b>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:"0.6rem", color:"#666"}}>CUOTA</div>
          <b style={{fontSize:"1.1rem"}}>@{cuota}</b>
        </div>
      </div>
      {matches.map(m => (
        <div key={m.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", padding: "6px 0", borderBottom: "1px solid #222" }}>
          <span>{m.home} vs {m.away}</span>
          <b style={{color}}>({m.result.bestPick})</b>
        </div>
      ))}
      <button 
        onClick={() => matches.forEach(m => onSelect(m, m.result.bestPick, m.result.q1))}
        style={{ width: "100%", marginTop: "12px", padding: "8px", background: "#222", color: "#fff", border: "1px solid #333", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "bold", cursor: "pointer" }}
      >
        AÑADIR TODO AL TICKET
      </button>
    </div>
  );
}

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
