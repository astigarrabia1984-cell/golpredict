import React, { useState, useMemo, useEffect } from "react";

/* ============================================================
   1. BASE DE DATOS DE EQUIPOS (Poisson Stats)
   ============================================================ */
const teamStats = {
  "Barcelona": { a: 2.2, d: 0.9, c: 5.8 }, "Real Madrid": { a: 2.3, d: 0.8, c: 6.2 },
  "Atlético de Madrid": { a: 1.8, d: 0.8, c: 4.8 }, "Girona": { a: 1.9, d: 1.2, c: 5.0 },
  "Athletic Club": { a: 1.6, d: 1.0, c: 5.4 }, "Real Sociedad": { a: 1.4, d: 0.9, c: 5.6 },
  "Real Betis": { a: 1.3, d: 1.1, c: 5.1 }, "Villarreal": { a: 1.8, d: 1.5, c: 4.9 },
  "Valencia": { a: 1.1, d: 1.2, c: 4.2 }, "Sevilla": { a: 1.4, d: 1.4, c: 5.5 },
  "Osasuna": { a: 1.2, d: 1.3, c: 4.5 }, "Getafe": { a: 1.0, d: 1.1, c: 3.8 },
  "Celta de Vigo": { a: 1.3, d: 1.5, c: 5.2 }, "Rayo Vallecano": { a: 1.1, d: 1.4, c: 4.7 },
  "Alavés": { a: 1.0, d: 1.3, c: 4.4 }, "Mallorca": { a: 0.9, d: 1.1, c: 4.1 },
  "Espanyol": { a: 1.1, d: 1.5, c: 4.0 }, "Elche": { a: 0.8, d: 1.6, c: 3.9 },
  "Levante": { a: 1.2, d: 1.3, c: 4.8 }, "Real Oviedo": { a: 1.0, d: 1.1, c: 4.2 },
  "Man City": { a: 2.6, d: 0.7, c: 7.5 }, "Arsenal": { a: 2.2, d: 0.8, c: 6.8 },
  "Liverpool": { a: 2.4, d: 0.9, c: 7.2 }, "Aston Villa": { a: 1.9, d: 1.3, c: 5.6 },
  "Tottenham": { a: 2.0, d: 1.5, c: 6.4 }, "Newcastle": { a: 1.8, d: 1.6, c: 6.0 },
  "Man Utd": { a: 1.5, d: 1.5, c: 5.4 }, "Chelsea": { a: 1.7, d: 1.6, c: 5.8 },
  "West Ham": { a: 1.4, d: 1.5, c: 4.9 }, "Brighton": { a: 1.6, d: 1.6, c: 5.7 },
  "Everton": { a: 1.1, d: 1.3, c: 5.0 }, "Bournemouth": { a: 1.3, d: 1.7, c: 4.8 },
  "Fulham": { a: 1.3, d: 1.4, c: 5.1 }, "Brentford": { a: 1.3, d: 1.5, c: 4.9 },
  "Burnley": { a: 0.9, d: 1.8, c: 4.3 }, "Leeds Utd": { a: 1.4, d: 1.7, c: 5.5 },
  "Sunderland": { a: 1.1, d: 1.4, c: 4.5 }, "Nottingham Forest": { a: 1.1, d: 1.6, c: 4.6 },
  "Inter": { a: 2.3, d: 0.6, c: 6.1 }, "AC Milan": { a: 1.9, d: 1.1, c: 5.3 },
  "Juventus": { a: 1.6, d: 0.7, c: 4.9 }, "Atalanta": { a: 1.9, d: 1.2, c: 5.5 },
  "Nápoles": { a: 1.6, d: 1.3, c: 5.9 }, "Roma": { a: 1.6, d: 1.1, c: 4.6 },
  "Lazio": { a: 1.4, d: 1.1, c: 4.8 }, "Fiorentina": { a: 1.4, d: 1.2, c: 5.2 },
  "Bolonia": { a: 1.3, d: 1.1, c: 5.0 }, "Torino": { a: 1.1, d: 1.0, c: 4.4 },
  "Genoa": { a: 1.1, d: 1.3, c: 4.5 }, "Udinese": { a: 1.0, d: 1.2, c: 4.6 },
  "Cagliari": { a: 1.0, d: 1.5, c: 4.4 }, "Verona": { a: 1.0, d: 1.4, c: 4.2 },
  "Sassuolo": { a: 1.2, d: 1.6, c: 4.2 }, "Como": { a: 1.0, d: 1.3, c: 4.0 },
  "Pisa": { a: 0.9, d: 1.2, c: 4.1 }, "Parma": { a: 1.1, d: 1.4, c: 4.3 },
  "Cremonese": { a: 0.9, d: 1.7, c: 4.1 }, "Bayern Múnich": { a: 2.8, d: 1.1, c: 7.3 },
  "Bayer Leverkusen": { a: 2.4, d: 0.8, c: 6.4 }, "RB Leipzig": { a: 2.1, d: 1.1, c: 6.0 },
  "Borussia Dortmund": { a: 2.0, d: 1.3, c: 5.6 }, "Heidenheim": { a: 1.2, d: 1.4, c: 4.0 },
  "Wolfsburgo": { a: 1.3, d: 1.4, c: 4.7 }, "Werder Bremen": { a: 1.2, d: 1.5, c: 4.8 },
  "Union Berlin": { a: 1.0, d: 1.2, c: 4.1 }, "Hoffenheim": { a: 1.6, d: 1.8, c: 4.7 },
  "Borussia M'gladbach": { a: 1.4, d: 1.6, c: 5.0 }, "Colonia": { a: 1.0, d: 1.5, c: 4.2 },
  "Hamburgo": { a: 1.2, d: 1.4, c: 4.5 }, "Galatasaray": { a: 1.7, d: 1.4, c: 5.2 }
};

/* ============================================================
   2. MOTOR POISSON
   ============================================================ */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.3, c: 4.5 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.4, c: 4.2 };
  const hxg = (home.a * 1.15) * away.d;
  const axg = away.a * (home.d * 0.95);
  let p1 = 0, pX = 0, p2 = 0, maxP = 0, bI = 0, bJ = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxP) { maxP = pr; bI = i; bJ = j; }
    }
  }
  return {
    p1: (p1 * 100).toFixed(0), pX: (pX * 100).toFixed(0), p2: (p2 * 100).toFixed(0),
    q1: (1 / (p1 + 0.03)).toFixed(2), qX: (1 / (pX + 0.03)).toFixed(2), q2: (1 / (p2 + 0.03)).toFixed(2),
    exact: `${bI}-${bJ}`,
    goals: (bI + bJ) > 2.5 ? "+2.5" : "-2.5",
    corners: (home.c + away.c) * 0.9 > 9.5 ? "+9.5" : "-9.5"
  };
}

/* ============================================================
   3. APP PRINCIPAL (NEXT.JS COMPATIBLE)
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("CHAMPIONS");
  const [searchTerm, setSearchTerm] = useState("");
  const [ticket, setTicket] = useState([]);
  const [myBets, setMyBets] = useState([]);

  // SOLUCIÓN AL ERROR DE LOCALSTORAGE: Carga inicial
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gp_ultra_final_v1");
      if (saved) setMyBets(JSON.parse(saved));
    }
  }, []);

  // SOLUCIÓN AL ERROR DE LOCALSTORAGE: Guardado automático
  useEffect(() => {
    if (typeof window !== "undefined" && myBets.length > 0) {
      localStorage.setItem("gp_ultra_final_v1", JSON.stringify(myBets));
    }
  }, [myBets]);

  const initialData = {
    "CHAMPIONS": [
      { id: "u1", home: "Barcelona", away: "Newcastle", date: "18.03" },
      { id: "u2", home: "Bayern Múnich", away: "Atalanta", date: "18.03" },
      { id: "u3", home: "Liverpool", away: "Galatasaray", date: "18.03" },
      { id: "u4", home: "Tottenham", away: "Atlético de Madrid", date: "18.03" }
    ],
    "LALIGA": [
      { id: "sp1", home: "Villarreal", away: "Real Sociedad", date: "20.03" },
      { id: "sp2", home: "Elche", away: "Mallorca", date: "21.03" },
      { id: "sp3", home: "Espanyol", away: "Getafe", date: "21.03" },
      { id: "sp4", home: "Levante", away: "Real Oviedo", date: "21.03" },
      { id: "sp5", home: "Osasuna", away: "Girona", date: "21.03" },
      { id: "sp6", home: "Sevilla", away: "Valencia", date: "21.03" },
      { id: "sp7", home: "Barcelona", away: "Rayo Vallecano", date: "22.03" },
      { id: "sp8", home: "Celta de Vigo", away: "Alavés", date: "22.03" },
      { id: "sp9", home: "Athletic Club", away: "Real Betis", date: "22.03" },
      { id: "sp10", home: "Real Madrid", away: "Atlético de Madrid", date: "22.03" }
    ],
    "PREMIER": [
      { id: "en1", home: "Bournemouth", away: "Man Utd", date: "20.03" },
      { id: "en2", home: "Brighton", away: "Liverpool", date: "21.03" },
      { id: "en3", home: "Fulham", away: "Burnley", date: "21.03" },
      { id: "en4", home: "Everton", away: "Chelsea", date: "21.03" },
      { id: "en5", home: "Leeds Utd", away: "Brentford", date: "21.03" },
      { id: "en6", home: "Newcastle", away: "Sunderland", date: "22.03" },
      { id: "en7", home: "Aston Villa", away: "West Ham", date: "22.03" },
      { id: "en8", home: "Tottenham", away: "Nottingham Forest", date: "22.03" }
    ],
    "SERIE A": [
      { id: "it1", home: "Cagliari", away: "Nápoles", date: "20.03" },
      { id: "it2", home: "Genoa", away: "Udinese", date: "20.03" },
      { id: "it4", home: "AC Milan", away: "Torino", date: "21.03" },
      { id: "it5", home: "Juventus", away: "Sassuolo", date: "21.03" },
      { id: "it7", home: "Atalanta", away: "Verona", date: "22.03" },
      { id: "it8", home: "Bolonia", away: "Lazio", date: "22.03" }
    ],
    "BUNDESLIGA": [
      { id: "de1", home: "RB Leipzig", away: "Hoffenheim", date: "20.03" },
      { id: "de2", home: "Bayern Múnich", away: "Union Berlin", date: "21.03" },
      { id: "de4", home: "Heidenheim", away: "Bayer Leverkusen", date: "21.03" },
      { id: "de6", home: "Borussia Dortmund", away: "Hamburgo", date: "21.03" }
    ]
  };

  const filteredMatches = useMemo(() => {
    const list = initialData[league] || [];
    if (!searchTerm) return list;
    return list.filter(m => 
      m.home.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.away.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [league, searchTerm]);

  const addToTicket = (m, p, q) => {
    setTicket(prev => {
      const ex = prev.find(t => t.id === m.id);
      if (ex) return prev.filter(t => t.id !== m.id);
      return [...prev, { ...m, pick: p, q: parseFloat(q) }];
    });
  };

  const shareWhatsApp = () => {
    const qTotal = ticket.reduce((a, b) => a * b.q, 1).toFixed(2);
    let text = `🚀 *GOLPREDICT ULTRA*\n\n`;
    ticket.forEach(t => text += `⚽ ${t.home} vs ${t.away}\n👉 Pronóstico: *${t.pick}* (@${t.q})\n\n`);
    text += `💰 *CUOTA TOTAL: @${qTotal}*`;
    if (typeof window !== "undefined") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const saveBet = () => {
    const qT = ticket.reduce((a, b) => a * b.q, 1).toFixed(2);
    const n = { id: Date.now(), d: new Date().toLocaleString(), m: [...ticket], q: qT, status: "PENDIENTE" };
    setMyBets([n, ...myBets]);
    setTicket([]);
    setActiveTab("MIS APUESTAS");
  };

  const updateStatus = (id, s) => {
    setMyBets(prev => prev.map(b => b.id === id ? { ...b, status: s } : b));
  };

  const stats = useMemo(() => {
    const cl = myBets.filter(b => b.status !== "PENDIENTE");
    const won = cl.filter(b => b.status === "ACERTADO").length;
    return { won, total: cl.length, rate: cl.length ? ((won / cl.length) * 100).toFixed(0) : 0 };
  }, [myBets]);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "10px", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center", textShadow: "0 0 10px #00ff4133" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>

      <div style={{ marginBottom: "15px" }}>
        <input 
          type="text" placeholder="🔍 Buscar partido..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #222", background: "#111", color: "#fff", boxSizing: "border-box" }}
        />
      </div>

      <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", marginBottom: "20px" }}>
        {["LIGAS", "TICKET", "MIS APUESTAS"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "12px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "0.7rem" }}>
            {t} {t === "TICKET" && ticket.length > 0 && `(${ticket.length})`}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px", paddingBottom: "5px" }}>
            {Object.keys(initialData).map(l => (
              <button key={l} onClick={() => {setLeague(l); setSearchTerm("");}} style={{ whiteSpace: "nowrap", padding: "8px 15px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#777", border: "1px solid #333", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "bold" }}>{l}</button>
            ))}
          </div>
          {filteredMatches.map(m => <MatchCard key={m.id} match={m} onSelect={addToTicket} ticket={ticket} />)}
        </>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
          <h3 style={{ color: "#00ff41", marginTop: 0 }}>MI JUGADA</h3>
          {ticket.length === 0 ? <p style={{color:"#444", textAlign:"center"}}>Selecciona pronósticos...</p> : (
            <>
              {ticket.map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #222", fontSize: "0.8rem" }}>
                  <span>{t.home} ({t.pick})</span> <b style={{color:"#00ff41"}}>@{t.q}</b>
                </div>
              ))}
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <div style={{fontSize:"1.5rem", color:"#00ff41", fontWeight:"bold"}}>@{ticket.reduce((a,b)=>a*b.q, 1).toFixed(2)}</div>
                <button onClick={shareWhatsApp} style={{ width: "100%", marginTop: "15px", padding: "12px", background: "#25D366", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold" }}>ENVIAR POR WHATSAPP 📲</button>
                <button onClick={saveBet} style={{ width: "100%", marginTop: "10px", padding: "12px", background: "#00ff41", color: "#000", border: "none", borderRadius: "10px", fontWeight: "bold" }}>GUARDAR HISTORIAL</button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "MIS APUESTAS" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
             <div style={{ background: "#111", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #222" }}>
                <div style={{fontSize: "0.6rem", color: "#555"}}>EFECTIVIDAD</div>
                <div style={{fontSize: "1.2rem", fontWeight: "bold", color: "#00ff41"}}>{stats.rate}%</div>
             </div>
             <div style={{ background: "#111", padding: "12px", borderRadius: "10px", textAlign: "center", border: "1px solid #222" }}>
                <div style={{fontSize: "0.6rem", color: "#555"}}>ACIERTOS</div>
                <div style={{fontSize: "1.2rem", fontWeight: "bold", color: "#fff"}}>{stats.won}/{stats.total}</div>
             </div>
          </div>
          {myBets.map(b => (
            <div key={b.id} style={{ background: "#111", padding: "15px", borderRadius: "12px", marginBottom: "12px", border: b.status === "ACERTADO" ? "2px solid #00ff41" : b.status === "FALLADO" ? "2px solid #ff3333" : "1px solid #222" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", marginBottom: "8px" }}>
                <span style={{color:"#555"}}>{b.d}</span>
                <b style={{ color: b.status === "ACERTADO" ? "#00ff41" : b.status === "FALLADO" ? "#ff3333" : "#ffaa00" }}>{b.status}</b>
              </div>
              {b.m.map(m => <div key={m.id} style={{ fontSize: "0.75rem", marginBottom: "4px" }}>• {m.home} - {m.pick} (@{m.q})</div>)}
              {b.status === "PENDIENTE" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "12px" }}>
                  <button onClick={() => updateStatus(b.id, "ACERTADO")} style={{ background: "#00ff4122", color: "#00ff41", border: "1px solid #00ff41", borderRadius: "5px", padding: "8px", fontSize: "0.6rem", fontWeight: "bold" }}>GANADA</button>
                  <button onClick={() => updateStatus(b.id, "FALLADO")} style={{ background: "#ff333322", color: "#ff3333", border: "1px solid #ff3333", borderRadius: "5px", padding: "8px", fontSize: "0.6rem", fontWeight: "bold" }}>FALLADA</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, onSelect, ticket }) {
  const [open, setOpen] = useState(false);
  const d = useMemo(() => runModel(match), [match]);
  const cur = ticket.find(t => t.id === match.id)?.pick;

  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "15px", marginBottom: "15px", border: "1px solid #222" }}>
      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "15px", fontSize: "0.9rem" }}>{match.home} vs {match.away}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[{ l: "1", q: d.q1, p: d.p1 }, { l: "X", q: d.qX, p: d.pX }, { l: "2", q: d.q2, p: d.p2 }].map(i => (
          <button 
            key={i.l} 
            onClick={() => onSelect(match, i.l, i.q)} 
            style={{ 
              background: cur === i.l ? "#00ff41" : "#050505", 
              color: cur === i.l ? "#000" : "#fff", 
              border: i.p > 60 ? "1.5px solid #00ff41" : "1px solid #333",
              borderRadius: "10px", padding: "10px 0", position: "relative" 
            }}
          >
            {i.p > 60 && <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#00ff41", color: "#000", fontSize: "7px", padding: "2px 4px", borderRadius: "4px", fontWeight: "bold" }}>TOP</span>}
            <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>@{i.q}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{i.p}%</div>
          </button>
        ))}
      </div>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", background: "none", border: "none", color: "#444", fontSize: "0.65rem", marginTop: "12px", textDecoration: "underline" }}>VER ANÁLISIS GOL/CÓRNER</button>
      {open && (
        <div style={{ marginTop: "12px", fontSize: "0.75rem", background: "#050505", padding: "12px", borderRadius: "10px", border: "1px solid #222" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}><span>Marcador Exacto:</span> <b style={{ color: "#00ff41" }}>{d.exact}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}><span>Goles:</span> <b style={{ color: "#00ff41" }}>{d.goals}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Córners:</span> <b>{d.corners}</b></div>
        </div>
      )}
    </div>
  );
       }
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
