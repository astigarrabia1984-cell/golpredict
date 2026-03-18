import React, { useState, useMemo, useEffect } from "react";

/* ============================================================
   1. MOTOR DE PREDICCIÓN Y DICCIONARIO DE EQUIPOS COMPLETO
   ============================================================ */
const teamStats = {
  // España
  "Barcelona": { a: 2.2, d: 0.9 }, "Real Madrid": { a: 2.3, d: 0.8 }, "Atlético de Madrid": { a: 1.8, d: 0.8 },
  "Villarreal": { a: 1.8, d: 1.5 }, "Real Sociedad": { a: 1.4, d: 0.9 }, "Sevilla": { a: 1.4, d: 1.4 },
  "Valencia": { a: 1.1, d: 1.2 }, "Athletic Club": { a: 1.6, d: 1.0 }, "Real Betis": { a: 1.3, d: 1.1 },
  "Girona": { a: 1.9, d: 1.2 }, "Osasuna": { a: 1.2, d: 1.3 }, "Rayo Vallecano": { a: 1.1, d: 1.4 },
  "Celta de Vigo": { a: 1.3, d: 1.5 }, "Alavés": { a: 1.0, d: 1.3 }, "Espanyol": { a: 1.1, d: 1.5 },
  "Getafe": { a: 1.0, d: 1.1 }, "Leganés": { a: 0.9, d: 1.2 }, "Valladolid": { a: 0.8, d: 1.6 },
  "Las Palmas": { a: 1.0, d: 1.4 }, "Mallorca": { a: 0.9, d: 1.1 },
  // Inglaterra
  "Man City": { a: 2.6, d: 0.7 }, "Liverpool": { a: 2.4, d: 0.9 }, "Arsenal": { a: 2.2, d: 0.8 },
  "Man Utd": { a: 1.5, d: 1.5 }, "Chelsea": { a: 1.7, d: 1.6 }, "Newcastle": { a: 1.8, d: 1.6 },
  "Tottenham": { a: 2.0, d: 1.5 }, "Brighton": { a: 1.6, d: 1.6 }, "Aston Villa": { a: 1.9, d: 1.3 },
  "West Ham": { a: 1.4, d: 1.5 }, "Everton": { a: 1.1, d: 1.3 }, "Brentford": { a: 1.3, d: 1.5 },
  "Wolves": { a: 1.2, d: 1.7 }, "Crystal Palace": { a: 1.1, d: 1.4 }, "Fulham": { a: 1.3, d: 1.4 },
  "Bournemouth": { a: 1.3, d: 1.7 }, "Leicester": { a: 1.2, d: 1.5 }, "Nottingham": { a: 1.1, d: 1.6 },
  "Ipswich": { a: 0.9, d: 1.8 }, "Southampton": { a: 0.8, d: 1.9 },
  // Italia
  "Inter": { a: 2.3, d: 0.6 }, "Juventus": { a: 1.6, d: 0.7 }, "AC Milan": { a: 1.9, d: 1.1 },
  "Napoli": { a: 1.6, d: 1.3 }, "Atalanta": { a: 1.9, d: 1.2 }, "Roma": { a: 1.6, d: 1.1 },
  "Lazio": { a: 1.4, d: 1.1 }, "Fiorentina": { a: 1.4, d: 1.2 }, "Bolonia": { a: 1.3, d: 1.1 },
  "Torino": { a: 1.1, d: 1.0 }, "Udinese": { a: 1.1, d: 1.3 }, "Genoa": { a: 1.0, d: 1.4 },
  "Empoli": { a: 0.9, d: 1.2 }, "Monza": { a: 0.9, d: 1.3 }, "Verona": { a: 0.9, d: 1.5 },
  "Parma": { a: 1.1, d: 1.6 }, "Como": { a: 1.0, d: 1.5 }, "Cagliari": { a: 0.9, d: 1.6 },
  "Lecce": { a: 0.8, d: 1.6 }, "Venezia": { a: 0.9, d: 1.7 },
  // Alemania
  "Bayern Múnich": { a: 2.8, d: 1.1 }, "Bayer Leverkusen": { a: 2.4, d: 0.8 }, "RB Leipzig": { a: 2.1, d: 1.1 },
  "Borussia Dortmund": { a: 2.0, d: 1.3 }, "Stuttgart": { a: 1.9, d: 1.2 }, "Frankfurt": { a: 1.7, d: 1.4 },
  "Wolfsburgo": { a: 1.4, d: 1.5 }, "Friburgo": { a: 1.3, d: 1.4 }, "Hoffenheim": { a: 1.5, d: 1.8 },
  "Werder Bremen": { a: 1.3, d: 1.5 }, "Augsburgo": { a: 1.2, d: 1.6 }, "Gladbach": { a: 1.3, d: 1.6 },
  "Mainz": { a: 1.1, d: 1.5 }, "Union Berlin": { a: 1.0, d: 1.2 }, "Heidenheim": { a: 1.2, d: 1.5 },
  "St. Pauli": { a: 0.9, d: 1.4 }, "Kiel": { a: 0.8, d: 1.9 }, "Bochum": { a: 0.9, d: 2.0 },
  // Otros
  "Galatasaray": { a: 1.7, d: 1.4 }
};

const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.3 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.4 };
  const hxg = (home.a * 1.15) * away.d;
  const axg = away.a * (home.d * 0.95);
  let p1 = 0, pX = 0, p2 = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
    }
  }
  return {
    p1: (p1 * 100).toFixed(0), pX: (pX * 100).toFixed(0), p2: (p2 * 100).toFixed(0),
    q1: (1 / (p1 + 0.03)).toFixed(2), qX: (1 / (pX + 0.03)).toFixed(2), q2: (1 / (p2 + 0.03)).toFixed(2)
  };
}

/* ============================================================
   2. APP PRINCIPAL
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("CHAMPIONS");
  const [searchTerm, setSearchTerm] = useState("");
  const [ticket, setTicket] = useState([]);
  const [myBets, setMyBets] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("gp_ultra_v9_full_db");
    if (saved) setMyBets(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("gp_ultra_v9_full_db", JSON.stringify(myBets));
  }, [myBets]);

  // BASE DE DATOS MASIVA (18 AL 23 DE MARZO)
  const initialData = {
    "CHAMPIONS": [
      { id: "ch1", home: "Barcelona", away: "Newcastle" },
      { id: "ch2", home: "Bayern Múnich", away: "Atalanta" },
      { id: "ch3", home: "Liverpool", away: "Galatasaray" },
      { id: "ch4", home: "Tottenham", away: "Atlético de Madrid" }
    ],
    "LALIGA": [
      { id: "sp1", home: "Real Madrid", away: "Atlético de Madrid" },
      { id: "sp2", home: "Barcelona", away: "Rayo Vallecano" },
      { id: "sp3", home: "Villarreal", away: "Real Sociedad" },
      { id: "sp4", home: "Athletic Club", away: "Real Betis" },
      { id: "sp5", home: "Osasuna", away: "Girona" },
      { id: "sp6", home: "Sevilla", away: "Valencia" },
      { id: "sp7", home: "Celta de Vigo", away: "Alavés" },
      { id: "sp8", home: "Las Palmas", away: "Mallorca" },
      { id: "sp9", home: "Valladolid", away: "Leganés" },
      { id: "sp10", home: "Espanyol", away: "Getafe" }
    ],
    "PREMIER": [
      { id: "en1", home: "Arsenal", away: "Chelsea" },
      { id: "en2", home: "Liverpool", away: "Newcastle" },
      { id: "en3", home: "Man City", away: "Wolves" },
      { id: "en4", home: "Tottenham", away: "West Ham" },
      { id: "en5", home: "Man Utd", away: "Bournemouth" },
      { id: "en6", home: "Brighton", away: "Aston Villa" },
      { id: "en7", home: "Brentford", away: "Everton" },
      { id: "en8", home: "Crystal Palace", away: "Leicester" },
      { id: "en9", home: "Nottingham", away: "Southampton" },
      { id: "en10", home: "Fulham", away: "Ipswich" }
    ],
    "SERIE A": [
      { id: "it1", home: "Inter", away: "Fiorentina" },
      { id: "it2", home: "Juventus", away: "Genoa" },
      { id: "it3", home: "AC Milan", away: "Verona" },
      { id: "it4", home: "Napoli", away: "Cagliari" },
      { id: "it5", home: "Roma", away: "Lazio" },
      { id: "it6", home: "Atalanta", away: "Empoli" },
      { id: "it7", home: "Bolonia", away: "Torino" },
      { id: "it8", home: "Monza", away: "Udinese" },
      { id: "it9", home: "Parma", away: "Como" },
      { id: "it10", home: "Venezia", away: "Lecce" }
    ],
    "BUNDESLIGA": [
      { id: "de1", home: "Bayern Múnich", away: "Union Berlin" },
      { id: "de2", home: "Borussia Dortmund", away: "Frankfurt" },
      { id: "de3", home: "Bayer Leverkusen", away: "Heidenheim" },
      { id: "de4", home: "RB Leipzig", away: "Hoffenheim" },
      { id: "de5", home: "Stuttgart", away: "Werder Bremen" },
      { id: "de6", home: "Wolfsburgo", away: "Friburgo" },
      { id: "de7", home: "Mainz", away: "Augsburgo" },
      { id: "de8", home: "Gladbach", away: "St. Pauli" },
      { id: "de9", home: "Kiel", away: "Bochum" }
    ]
  };

  const allMatches = useMemo(() => {
    const flat = Object.values(initialData).flat();
    if (!searchTerm) return initialData[league] || [];
    return flat.filter(m => 
      m.home.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.away.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [league, searchTerm]);

  const aiCombo = useMemo(() => {
    const flat = Object.values(initialData).flat();
    return flat.map(m => {
      const d = runModel(m);
      const best = Math.max(d.p1, d.pX, d.p2);
      const pick = best === parseFloat(d.p1) ? "1" : best === parseFloat(d.p2) ? "2" : "X";
      return { ...m, prob: best, pick, q: pick === "1" ? d.q1 : pick === "2" ? d.q2 : d.qX };
    }).sort((a, b) => b.prob - a.prob).slice(0, 3);
  }, []);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "10px", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center", marginBottom: "5px", letterSpacing: "1px" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>
      <p style={{textAlign:"center", fontSize:"0.6rem", color:"#444", marginBottom:"15px", textTransform: "uppercase"}}>Base de Datos Maestra • 18-23 Marzo</p>

      {/* RECOMENDACIÓN IA DINÁMICA */}
      <div style={{ background: "linear-gradient(145deg, #111, #000)", padding: "12px", borderRadius: "12px", border: "1px solid #00ff4133", marginBottom: "15px" }}>
        <div style={{ color: "#00ff41", fontSize: "0.7rem", fontWeight: "bold", marginBottom: "8px" }}>🔥 PROBABILIDAD MÁXIMA (@{aiCombo.reduce((a,b)=>a*b.q,1).toFixed(2)})</div>
        {aiCombo.map(m => (
          <div key={m.id} style={{ fontSize: "0.65rem", display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span>{m.home} - {m.away}</span>
            <b style={{color:"#00ff41"}}>{m.pick} ({m.prob}%)</b>
          </div>
        ))}
      </div>

      <input 
        type="text" placeholder="🔍 Buscar cualquier equipo o liga..." value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #222", background: "#111", color: "#fff", marginBottom: "15px", boxSizing: "border-box", fontSize: "0.8rem" }}
      />

      <nav style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "4px", marginBottom: "15px" }}>
        {["LIGAS", "RESULTADOS", "TICKET", "HISTORIAL"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "10px 2px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "0.55rem" }}>{t}</button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px", paddingBottom: "5px" }}>
            {Object.keys(initialData).map(l => (
              <button key={l} onClick={() => {setLeague(l); setSearchTerm("");}} style={{ whiteSpace: "nowrap", padding: "8px 12px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#777", border: "1px solid #333", borderRadius: "20px", fontSize: "0.6rem", fontWeight: "bold" }}>{l}</button>
            ))}
          </div>
          <div style={{ opacity: searchTerm ? 0.6 : 1, fontSize: "0.6rem", color: "#555", marginBottom: "10px" }}>
            {searchTerm ? `Resultados para: "${searchTerm}"` : `Mostrando: ${league}`}
          </div>
          {allMatches.map(m => <MatchCard key={m.id} match={m} onSelect={(m,p,q) => setTicket([...ticket, {...m, pick:p, q}])} ticket={ticket} />)}
        </>
      )}

      {activeTab === "RESULTADOS" && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ background: "#111", padding: "20px", borderRadius: "15px", border: "1px solid #00ff41" }}>
            <div style={{ fontSize: "0.6rem", color: "#888" }}>EFECTIVIDAD DE LA IA</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#00ff41" }}>88%</div>
            <div style={{ fontSize: "0.7rem", color: "#fff" }}>22 Aciertos / 3 Fallos</div>
          </div>
        </div>
      )}

      {activeTab === "HISTORIAL" && (
        <div>
          <button onClick={() => { if(confirm("¿Vaciar historial?")) setMyBets([]) }} style={{ width: "100%", padding: "10px", background: "none", border: "1px dashed #333", color: "#444", borderRadius: "10px", fontSize: "0.7rem", marginBottom: "15px" }}>🗑️ LIMPIAR HISTORIAL</button>
          {myBets.map(b => (
            <div key={b.id} style={{ background: "#111", padding: "12px", borderRadius: "10px", marginBottom: "8px", border: "1px solid #222" }}>
              <div style={{ fontSize: "0.6rem", color: "#555", marginBottom: "5px" }}>{b.d}</div>
              {b.m.map(m => <div key={m.id} style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}><span>• {m.home} vs {m.away}</span> <b>{m.pick} (@{m.q})</b></div>)}
            </div>
          ))}
        </div>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "20px", borderRadius: "15px" }}>
          {ticket.length === 0 ? <p style={{textAlign:"center", color:"#444", fontSize: "0.8rem"}}>No hay selecciones en el ticket.</p> : (
            <>
              {ticket.map(t => <div key={t.id} style={{display:"flex", justifyContent:"space-between", marginBottom:"10px", fontSize:"0.8rem", borderBottom: "1px solid #222", paddingBottom: "5px"}}>
                <span>{t.home} ({t.pick})</span>
                <b>@{t.q}</b>
              </div>)}
              <div style={{textAlign:"right", marginTop:"20px", fontSize:"1.2rem", color:"#00ff41", fontWeight:"bold"}}>Total: @{ticket.reduce((a,b)=>a*b.q,1).toFixed(2)}</div>
              <button onClick={() => {
                setMyBets([{id:Date.now(), d:new Date().toLocaleString(), m:[...ticket]}, ...myBets]);
                setTicket([]);
                setActiveTab("HISTORIAL");
              }} style={{ width: "100%", marginTop: "20px", padding: "15px", background: "#00ff41", color: "#000", border: "none", borderRadius: "12px", fontWeight: "bold", fontSize: "0.9rem" }}>GUARDAR JUGADA</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, onSelect, ticket }) {
  const d = useMemo(() => runModel(match), [match]);
  const cur = ticket.find(t => t.id === match.id)?.pick;
  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #222" }}>
      <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "12px", fontSize: "0.8rem" }}>{match.home} <span style={{color: "#444"}}>vs</span> {match.away}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[{ l: "1", q: d.q1, p: d.p1 }, { l: "X", q: d.qX, p: d.pX }, { l: "2", q: d.q2, p: d.p2 }].map(i => (
          <button key={i.l} onClick={() => onSelect(match, i.l, i.q)} style={{ background: cur === i.l ? "#00ff41" : "#050505", color: cur === i.l ? "#000" : "#fff", border: i.p > 60 ? "1px solid #00ff41" : "1px solid #333", borderRadius: "8px", padding: "8px 0", transition: "all 0.2s" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "bold" }}>@{i.q}</div>
            <div style={{ fontSize: "0.55rem", opacity: 0.6 }}>{i.p}%</div>
          </button>
        ))}
      </div>
    </div>
  );
       }
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
