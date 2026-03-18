import React, { useState, useMemo, useEffect } from "react";

/* ============================================================
   1. CEREBRO ESTADÍSTICO (78 EQUIPOS: ESP, ENG, ITA, GER)
   ============================================================ */
const teamStats = {
  // --- ESPAÑA (LALIGA) ---
  "Real Madrid": { a: 2.2, d: 0.7, c: 6.2, cuota: 1.45 }, "Barcelona": { a: 2.1, d: 0.9, c: 5.8, cuota: 1.55 },
  "Girona": { a: 1.9, d: 1.2, c: 5.0, cuota: 2.10 }, "Atlético Madrid": { a: 1.7, d: 0.8, c: 4.8, cuota: 1.70 },
  "Athletic Club": { a: 1.5, d: 1.0, c: 5.4, cuota: 2.30 }, "Real Sociedad": { a: 1.3, d: 0.9, c: 5.6, cuota: 2.20 },
  "Betis": { a: 1.3, d: 1.1, c: 5.1, cuota: 2.45 }, "Valencia": { a: 1.1, d: 1.2, c: 4.2, cuota: 2.80 },
  "Villarreal": { a: 1.8, d: 1.5, c: 4.9, cuota: 2.35 }, "Getafe": { a: 1.0, d: 1.1, c: 3.8, cuota: 3.10 },
  "Osasuna": { a: 1.2, d: 1.3, c: 4.5, cuota: 2.90 }, "Las Palmas": { a: 1.0, d: 1.2, c: 3.5, cuota: 3.20 },
  "Alavés": { a: 1.0, d: 1.3, c: 4.4, cuota: 3.30 }, "Sevilla": { a: 1.4, d: 1.4, c: 5.5, cuota: 2.50 },
  "Mallorca": { a: 0.9, d: 1.1, c: 4.1, cuota: 3.40 }, "Rayo Vallecano": { a: 1.0, d: 1.4, c: 4.7, cuota: 3.10 },
  "Celta de Vigo": { a: 1.3, d: 1.5, c: 5.2, cuota: 2.70 }, "Cádiz": { a: 0.7, d: 1.5, c: 3.6, cuota: 4.00 },
  "Granada": { a: 1.1, d: 1.8, c: 4.0, cuota: 4.50 }, "Almería": { a: 1.1, d: 2.0, c: 4.3, cuota: 5.00 },
  // --- INGLATERRA (PREMIER) ---
  "Man City": { a: 2.5, d: 0.7, c: 7.5, cuota: 1.30 }, "Arsenal": { a: 2.1, d: 0.8, c: 6.8, cuota: 1.50 },
  "Liverpool": { a: 2.3, d: 0.9, c: 7.2, cuota: 1.45 }, "Aston Villa": { a: 1.9, d: 1.3, c: 5.6, cuota: 2.20 },
  "Tottenham": { a: 2.0, d: 1.5, c: 6.4, cuota: 2.30 }, "Man Utd": { a: 1.5, d: 1.5, c: 5.4, cuota: 2.50 },
  "Chelsea": { a: 1.7, d: 1.6, c: 5.8, cuota: 2.10 }, "Newcastle": { a: 1.8, d: 1.6, c: 6.0, cuota: 2.40 },
  "West Ham": { a: 1.5, d: 1.7, c: 4.6, cuota: 2.80 }, "Brighton": { a: 1.6, d: 1.6, c: 5.7, cuota: 2.30 },
  "Wolves": { a: 1.3, d: 1.5, c: 4.5, cuota: 3.10 }, "Everton": { a: 1.1, d: 1.4, c: 5.5, cuota: 3.50 },
  // --- ITALIA (SERIE A) ---
  "Inter": { a: 2.2, d: 0.6, c: 6.1, cuota: 1.40 }, "Milan": { a: 1.9, d: 1.1, c: 5.3, cuota: 1.75 },
  "Juventus": { a: 1.5, d: 0.7, c: 4.9, cuota: 1.85 }, "Roma": { a: 1.6, d: 1.1, c: 4.6, cuota: 2.10 },
  "Atalanta": { a: 1.8, d: 1.2, c: 5.5, cuota: 1.95 }, "Lazio": { a: 1.3, d: 1.1, c: 4.8, cuota: 2.30 },
  "Napoli": { a: 1.5, d: 1.3, c: 5.9, cuota: 2.20 },
  // --- ALEMANIA (BUNDESLIGA) ---
  "Leverkusen": { a: 2.4, d: 0.8, c: 6.4, cuota: 1.50 }, "Bayern": { a: 2.7, d: 1.1, c: 7.3, cuota: 1.35 },
  "Stuttgart": { a: 2.1, d: 1.2, c: 5.4, cuota: 1.80 }, "Dortmund": { a: 1.9, d: 1.3, c: 5.6, cuota: 1.95 },
  "RB Leipzig": { a: 2.1, d: 1.1, c: 6.0, cuota: 1.75 }
};

/* ============================================================
   2. MOTOR MATEMÁTICO (POISSON RECURSIVO)
   ============================================================ */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.0, d: 1.2, c: 4.0, cuota: 2.5 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.2, c: 4.0, cuota: 2.5 };
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

  const probs = { "1": p1, "X": pX, "2": p2 };
  const bestPick = Object.keys(probs).reduce((a, b) => probs[a] > probs[b] ? a : b);
  const cuota = bestPick === "1" ? home.cuota : (bestPick === "2" ? away.cuota : 3.40);

  return {
    bestPick, prob: (probs[bestPick] * 100).toFixed(0), exact, cuota,
    goals: (hxg + axg) > 2.5 ? "+2.5" : "-2.5",
    corners: (home.c + away.c) * 0.92 > 9.5 ? "+9.5" : "-9.5",
    isUpset: (pX + p2) > 0.60 && p1 < 0.40,
    status: match.ftScore ? (getActualRes(match.ftScore) === bestPick ? "hit" : "miss") : "pending"
  };
}

const getActualRes = (score) => {
  const [h, a] = score.split("-").map(Number);
  return h > a ? "1" : (h === a ? "X" : "2");
};

/* ============================================================
   3. COMPONENTE PRINCIPAL
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("LALIGA");
  const [matches, setMatches] = useState({ LALIGA: [], PREMIER: [], "SERIE A": [], BUNDESLIGA: [], CHAMPIONS: [], "EUROPA LEAGUE": [] });
  const [ticket, setTicket] = useState([]);
  const [history, setHistory] = useState([]);
  const [importText, setImportText] = useState("");

  // Lógica de Combinadas Automáticas
  const combos = useMemo(() => {
    const all = Object.entries(matches).flatMap(([l, ms]) => ms.map(m => ({ ...m, league: l, ...runModel(m) })));
    return {
      esp: all.filter(m => m.league === "LALIGA" && !m.ftScore).sort((a,b) => b.prob - a.prob).slice(0, 3),
      multi: all.filter(m => !m.ftScore).sort((a,b) => b.prob - a.prob).slice(0, 3)
    };
  }, [matches]);

  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      setMatches(data);
      setActiveTab("LIGAS");
    } catch (e) { alert("JSON Inválido"); }
  };

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "15px", fontFamily: "sans-serif", maxWidth: "500px", margin: "0 auto" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#00ff41", letterSpacing: "2px" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>
      </header>

      {/* Navegación */}
      <nav style={{ display: "flex", gap: "5px", marginBottom: "20px", overflowX: "auto" }}>
        {["LIGAS", "COMBINADAS", "TICKET", "HISTORIAL", "ADMIN"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "10px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "0.6rem", whiteSpace: "nowrap" }}>
            {t}
          </button>
        ))}
      </nav>

      {/* VISTA: LIGAS */}
      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px" }}>
            {Object.keys(matches).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ whiteSpace: "nowrap", padding: "6px 12px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#888", border: `1px solid ${league === l ? "#00ff41" : "#333"}`, borderRadius: "20px", fontSize: "0.6rem" }}>{l}</button>
            ))}
          </div>
          {matches[league]?.map(m => <MatchCard key={m.id} match={m} onAdd={(m, p) => setTicket([...ticket, { ...m, pick: p, cuota: runModel(m).cuota }])} />)}
        </>
      )}

      {/* VISTA: COMBINADAS */}
      {activeTab === "COMBINADAS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <ComboCard title="🇪🇸 TOP 3 ESPAÑA" items={combos.esp} color="#ffaa00" />
          <ComboCard title="🌍 TOP 3 MULTI-LIGA" items={combos.multi} color="#00e5ff" />
        </div>
      )}

      {/* VISTA: TICKET */}
      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "15px", borderRadius: "12px" }}>
          <h3 style={{ color: "#00ff41", fontSize: "0.9rem", marginTop: 0 }}>APUESTA ACTUAL</h3>
          {ticket.map((t, i) => <div key={i} style={{ fontSize: "0.75rem", padding: "8px 0", borderBottom: "1px solid #222" }}>{t.home} - {t.pick} (@{t.cuota})</div>)}
          <div style={{ textAlign: "right", marginTop: "10px", color: "#00ff41" }}>Cuota Total: {ticket.reduce((acc, t) => acc * t.cuota, 1).toFixed(2)}</div>
          <button onClick={() => { setHistory([{ id: Date.now(), items: ticket }, ...history]); setTicket([]); setActiveTab("HISTORIAL"); }} style={{ width: "100%", padding: "12px", background: "#00ff41", border: "none", borderRadius: "8px", fontWeight: "bold", marginTop: "15px" }}>VALIDAR TICKET</button>
        </div>
      )}

      {/* VISTA: ADMIN */}
      {activeTab === "ADMIN" && (
        <div style={{ background: "#111", padding: "15px", borderRadius: "12px" }}>
          <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder="Pega el JSON de la jornada..." style={{ width: "100%", height: "200px", background: "#000", color: "#00ff41", border: "1px solid #333", borderRadius: "8px", padding: "10px", fontSize: "0.7rem" }} />
          <button onClick={handleImport} style={{ width: "100%", padding: "12px", background: "#00ff41", border: "none", borderRadius: "8px", marginTop: "10px", fontWeight: "bold" }}>ACTUALIZAR JORNADA</button>
        </div>
      )}

      {/* VISTA: HISTORIAL */}
      {activeTab === "HISTORIAL" && (
        <div>
          {history.map(h => (
            <div key={h.id} style={{ background: "#111", padding: "12px", borderRadius: "8px", marginBottom: "10px", borderLeft: "4px solid #333" }}>
              {h.items.map((item, idx) => {
                const res = runModel(item);
                return (
                  <div key={idx} style={{ fontSize: "0.7rem", display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
                    <span>{item.home} vs {item.away} ({item.pick})</span>
                    <span style={{ color: res.status === "hit" ? "#00ff41" : res.status === "miss" ? "#ff3333" : "#888" }}>{res.status.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTES
   ============================================================ */
function MatchCard({ match, onAdd }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  return (
    <div style={{ background: "#111", padding: "12px", borderRadius: "10px", marginBottom: "10px", border: `1px solid ${data.status === "hit" ? "#00ff41" : "#222"}` }}>
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "0.85rem" }} onClick={() => setOpen(!open)}>
        {match.home} <span style={{color: "#00ff41"}}>{match.ftScore || "vs"}</span> {match.away}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", marginTop: "10px" }}>
        {["1", "X", "2"].map(p => (
          <button key={p} onClick={() => onAdd(match, p)} style={{ background: data.bestPick === p ? "#1a1a1a" : "#050505", border: data.bestPick === p ? "1px solid #00ff41" : "1px solid #333", color: "#fff", padding: "8px", borderRadius: "5px", fontSize: "0.7rem" }}>{p}</button>
        ))}
      </div>
      {open && (
        <div style={{ marginTop: "10px", fontSize: "0.65rem", color: "#aaa", background: "#050505", padding: "8px", borderRadius: "6px" }}>
          IA Predict: {data.exact} | Goles: {data.goals} | Córners: {data.corners}
        </div>
      )}
    </div>
  );
}

function ComboCard({ title, items, color }) {
  if (!items.length) return null;
  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "12px", borderLeft: `4px solid ${color}` }}>
      <div style={{ color, fontSize: "0.75rem", fontWeight: "bold", marginBottom: "10px" }}>{title}</div>
      {items.map((i, idx) => <div key={idx} style={{ fontSize: "0.7rem", display: "flex", justifyContent: "space-between", margin: "4px 0" }}><span>{i.home} ({i.bestPick})</span><span>@{i.cuota}</span></div>)}
    </div>
  );
                                                                     }
         



        
      
        
  
        
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
