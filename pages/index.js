import React, { useState } from "react";

const DATA = {
  "CHAMPIONS": [
    { id: 501, d: "07.04. 21:00", h: "Real Madrid", a: "Bayern Múnich", hE: 2.1, aE: 1.8, q1: 2.10, qX: 3.60, q2: 3.20 },
    { id: 502, d: "07.04. 21:00", h: "Sporting CP", a: "Arsenal", hE: 1.2, aE: 2.4, q1: 4.50, qX: 3.90, q2: 1.70 },
    { id: 503, d: "08.04. 21:00", h: "Barcelona", a: "Atleti", hE: 1.9, aE: 1.6, q1: 2.20, qX: 3.40, q2: 3.10 },
    { id: 504, d: "08.04. 21:00", h: "PSG", a: "Liverpool", hE: 1.7, aE: 2.2, q1: 3.00, qX: 3.80, q2: 2.10 },
    { id: 505, d: "14.04. 21:00", h: "Atleti", a: "Barcelona", hE: 1.8, aE: 1.8, q1: 2.60, qX: 3.40, q2: 2.60 },
    { id: 506, d: "14.04. 21:00", h: "Liverpool", a: "PSG", hE: 2.3, aE: 1.5, q1: 1.80, qX: 4.00, q2: 4.20 },
    { id: 507, d: "15.04. 21:00", h: "Arsenal", a: "Sporting CP", hE: 2.5, aE: 0.8, q1: 1.30, qX: 5.00, q2: 9.00 },
    { id: 508, d: "15.04. 21:00", h: "Bayern Múnich", a: "Real Madrid", hE: 1.9, aE: 1.9, q1: 2.40, qX: 3.50, q2: 2.50 }
  ],
  "LALIGA": [
    { id: 1, d: "03.04. 21:00", h: "Rayo Vallecano", a: "Elche", hE: 1.4, aE: 1.1, q1: 1.95, qX: 3.30, q2: 4.00 },
    { id: 2, d: "04.04. 14:00", h: "Real Sociedad", a: "Levante", hE: 1.9, aE: 0.8, q1: 1.70, qX: 3.60, q2: 5.00 },
    { id: 3, d: "04.04. 16:15", h: "Mallorca", a: "Real Madrid", hE: 0.9, aE: 2.3, q1: 6.00, qX: 4.20, q2: 1.55 },
    { id: 4, d: "04.04. 18:30", h: "Real Betis", a: "Espanyol", hE: 1.7, aE: 1.2, q1: 2.20, qX: 3.20, q2: 3.50 },
    { id: 5, d: "04.04. 21:00", h: "Atleti", a: "Barça", hE: 1.8, aE: 1.8, q1: 2.60, qX: 3.40, q2: 2.70 },
    { id: 6, d: "05.04. 14:00", h: "Getafe", a: "Athletic Club", hE: 1.1, aE: 1.5, q1: 3.10, qX: 3.10, q2: 2.45 },
    { id: 7, d: "05.04. 16:15", h: "Valencia", a: "Celta de Vigo", hE: 1.6, aE: 1.2, q1: 2.30, qX: 3.25, q2: 3.20 },
    { id: 8, d: "05.04. 18:30", h: "Real Oviedo", a: "Sevilla", hE: 1.1, aE: 1.4, q1: 3.00, qX: 3.10, q2: 2.50 },
    { id: 9, d: "05.04. 21:00", h: "Alavés", a: "Osasuna", hE: 1.2, aE: 1.2, q1: 2.80, qX: 3.00, q2: 2.80 },
    { id: 10, d: "06.04. 21:00", h: "Girona", a: "Villarreal", hE: 2.1, aE: 1.6, q1: 2.10, qX: 3.50, q2: 3.30 }
  ],
  "PREMIER": [
    { id: 101, d: "10.04. 21:00", h: "West Ham", a: "Wolves", hE: 1.5, aE: 1.2, q1: 2.10, qX: 3.40, q2: 3.50 },
    { id: 102, d: "11.04. 13:30", h: "Arsenal", a: "Bournemouth", hE: 2.5, aE: 0.7, q1: 1.30, qX: 5.50, q2: 9.50 },
    { id: 103, d: "11.04. 16:00", h: "Brentford", a: "Everton", hE: 1.4, aE: 1.3, q1: 2.40, qX: 3.20, q2: 3.10 },
    { id: 104, d: "11.04. 16:00", h: "Burnley", a: "Brighton", hE: 1.0, aE: 1.7, q1: 3.80, qX: 3.50, q2: 1.95 },
    { id: 105, d: "11.04. 18:30", h: "Liverpool", a: "Fulham", hE: 2.6, aE: 0.9, q1: 1.25, qX: 6.00, q2: 11.0 },
    { id: 106, d: "12.04. 15:00", h: "Crystal Palace", a: "Newcastle", hE: 1.2, aE: 1.8, q1: 3.20, qX: 3.50, q2: 2.20 },
    { id: 107, d: "12.04. 15:00", h: "Nottingham", a: "Aston Villa", hE: 1.1, aE: 1.9, q1: 4.20, qX: 3.80, q2: 1.80 },
    { id: 108, d: "12.04. 15:00", h: "Sunderland", a: "Tottenham", hE: 0.8, aE: 2.2, q1: 5.50, qX: 4.30, q2: 1.55 },
    { id: 109, d: "12.04. 17:30", h: "Chelsea", a: "Man City", hE: 1.4, aE: 2.4, q1: 5.00, qX: 4.00, q2: 1.65 },
    { id: 110, d: "13.04. 21:00", h: "Man Utd", a: "Leeds Utd", hE: 1.9, aE: 1.3, q1: 1.80, qX: 3.90, q2: 4.20 }
  ],
  "SERIE A": [
    { id: 301, d: "04.04. 15:00", h: "Sassuolo", a: "Cagliari", hE: 1.4, aE: 1.2, q1: 2.10, qX: 3.40, q2: 3.50 },
    { id: 306, d: "05.04. 20:45", h: "Inter", a: "Roma", hE: 2.1, aE: 1.4, q1: 1.65, qX: 3.90, q2: 5.25 },
    { id: 309, d: "06.04. 18:00", h: "Juventus", a: "Genoa", hE: 2.2, aE: 0.9, q1: 1.45, qX: 4.20, q2: 7.50 },
    { id: 310, d: "06.04. 20:45", h: "Nápoles", a: "AC Milan", hE: 1.7, aE: 1.7, q1: 2.60, qX: 3.30, q2: 2.70 }
  ],
  "BUNDES": [
    { id: 401, d: "04.04. 15:30", h: "Bayer Leverkusen", a: "Wolfsburgo", hE: 2.4, aE: 0.8, q1: 1.35, qX: 5.00, q2: 8.50 },
    { id: 407, d: "04.04. 18:30", h: "Stuttgart", a: "Dortmund", hE: 1.8, aE: 1.7, q1: 2.40, qX: 3.75, q2: 2.70 }
  ]
};

export default function App() {
  const [tab, setTab] = useState("CHAMPIONS");
  const [open, setOpen] = useState(null);
  const [bet, setBet] = useState([]);
  const [money, setMoney] = useState(10);

  const totalOdds = bet.reduce((acc, item) => acc * item.odd, 1).toFixed(2);

  const addBet = (m, p, o) => {
    const exists = bet.find(b => b.id === m.id);
    if (exists && exists.p === p) {
      setBet(bet.filter(b => b.id !== m.id));
    } else {
      setBet([...bet.filter(b => b.id !== m.id), { id: m.id, h: m.h, a: m.a, p, odd: o }]);
    }
  };

  const renderMatch = (m) => {
    const tot = m.hE + m.aE, pX = 22;
    const p1 = Math.round((m.hE / tot) * (100 - pX)), p2 = 100 - p1 - pX;
    const max = Math.max(p1, pX, p2), isOpen = open === m.id;
    const currentBet = bet.find(b => b.id === m.id);

    return (
      <div key={m.id} style={{ background: "#0f0f0f", borderRadius: "14px", marginBottom: "14px", border: isOpen ? "2px solid #00ff41" : "1px solid #222" }}>
        <div onClick={() => setOpen(isOpen ? null : m.id)} style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: "950", marginBottom: "14px", color: "#fff" }}>
            <span>{m.h}</span><span style={{ color: "#00ff41", fontSize: "12px" }}>VS</span><span>{m.a}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            {[p1, pX, p2].map((v, i) => (
              <div key={i} style={{ background: "#000", padding: "12px", borderRadius: "12px", textAlign: "center", border: v === max ? "1px solid #00ff41" : "1px solid #111" }}>
                <div style={{ color: v === max ? "#00ff41" : "#fff", fontSize: "20px", fontWeight: "950" }}>{v}%</div>
                <div style={{ fontSize: "8px", color: "#555", fontWeight: "bold" }}>{["LOCAL", "EMPATE", "VISITA"][i]}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "10px", fontSize: "10px", color: "#333", fontWeight: "bold" }}>{m.d}</div>
        </div>
        {isOpen && (
          <div style={{ padding: "16px", background: "#050505", borderTop: "1px solid #222" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div style={{ flex: 1, background: "#111", padding: "12px", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "9px", color: "#00ff41", fontWeight: "bold" }}>PROB. GOLES</div><div style={{ fontSize: "20px", fontWeight: "950" }}>{tot.toFixed(1)}</div>
              </div>
              <div style={{ flex: 1, background: "#111", padding: "12px", borderRadius: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "9px", color: "#00ff41", fontWeight: "bold" }}>CORNERS IA</div><div style={{ fontSize: "20px", fontWeight: "950" }}>{Math.round(tot + 6)}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {[m.q1, m.qX, m.q2].map((q, i) => {
                const p = ["1", "X", "2"][i];
                const active = currentBet?.p === p;
                return (
                  <button key={i} onClick={() => addBet(m, p, q)} style={{ flex: 1, background: active ? "#00ff41" : "#1a1a1a", color: active ? "#000" : "#fff", border: "none", padding: "15px", borderRadius: "10px", fontWeight: "950", fontSize: "15px" }}>
                    {q}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "15px", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", paddingBottom: "20px" }}>
        <h1 style={{ color: "#00ff41", fontSize: "26px", fontWeight: "950", margin: 0, letterSpacing: "-1px" }}>GOLPREDICT PRO</h1>
      </header>

      <nav style={{ display: "flex", gap: "8px", marginBottom: "25px", overflowX: "auto", paddingBottom: "10px" }}>
        {Object.keys(DATA).concat("COMBINADA IA", "TICKET").map(n => (
          <button key={n} onClick={() => setTab(n)} style={{ flex: "none", padding: "12px 20px", borderRadius: "14px", border: "none", background: tab === n ? "#00ff41" : "#111", color: tab === n ? "#000" : "#777", fontWeight: "950", fontSize: "11px" }}>
            {n === "TICKET" ? `🎟️ ${bet.length}` : n}
          </button>
        ))}
      </nav>

      {tab !== "TICKET" && tab !== "COMBINADA IA" && DATA[tab].map(m => renderMatch(m))}

      {tab === "COMBINADA IA" && (
        <div>
          {[
            { t: "BÁSICA", c: "#00ff41", desc: "Favoritos claros para asegurar.", ids: [501, 102, 309] },
            { t: "MODERADA", c: "#ffaa00", desc: "Partidos con alta probabilidad de goles.", ids: [503, 1, 306] },
            { t: "ARRIESGADA", c: "#ff4444", desc: "Cuotas altas para máximo beneficio.", ids: [502, 5, 109] }
          ].map(comb => (
            <div key={comb.t} style={{ background: "#0f0f0f", padding: "20px", borderRadius: "18px", marginBottom: "15px", border: `1px solid ${comb.c}` }}>
              <h3 style={{ color: comb.c, margin: "0 0 10px 0", fontWeight: "950", fontSize: "20px" }}>{comb.t}</h3>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>{comb.desc}</p>
              <button onClick={() => {
                const picks = [];
                Object.values(DATA).flat().forEach(m => { if(comb.ids.includes(m.id)) picks.push({id: m.id, h: m.h, a: m.a, p: "1", odd: m.q1}); });
                setBet(picks); setTab("TICKET");
              }} style={{ width: "100%", background: comb.c, color: "#000", border: "none", padding: "15px", borderRadius: "12px", fontWeight: "950" }}>
                CARGAR COMBINADA
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "TICKET" && (
        <div style={{ background: "#0f0f0f", padding: "20px", borderRadius: "25px", border: "1px solid #222" }}>
          <h3 style={{ color: "#00ff41", marginTop: 0, fontWeight: "950", fontSize: "22px" }}>RESUMEN TICKET</h3>
          {bet.map(b => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid #222" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "950", color: "#fff", fontSize: "14px" }}>{b.h} - {b.a}</div>
                <div style={{ color: "#00ff41", fontSize: "12px", fontWeight: "bold" }}>PICK: {b.p}</div>
              </div>
              <div style={{ color: "#fff", fontWeight: "950", fontSize: "18px" }}>@{b.odd}</div>
            </div>
          ))}
          {bet.length > 0 ? (
            <div style={{ marginTop: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span style={{ color: "#555", fontWeight: "bold" }}>CUOTA FINAL</span>
                <span style={{ fontWeight: "950", color: "#00ff41", fontSize: "30px" }}>{totalOdds}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <span style={{ color: "#555", fontWeight: "bold" }}>CANTIDAD (€)</span>
                <input type="number" value={money} onChange={(e) => setMoney(e.target.value)} style={{ width: "90px", background: "#000", color: "#00ff41", border: "2px solid #00ff41", borderRadius: "10px", padding: "12px", fontSize: "20px", fontWeight: "950", textAlign: "right" }} />
              </div>
              <div style={{ background: "#00ff41", color: "#000", padding: "25px", borderRadius: "18px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: "950" }}>PREMIO ESTIMADO</div>
                <div style={{ fontSize: "40px", fontWeight: "950" }}>{(totalOdds * money).toFixed(2)}€</div>
              </div>
              <button onClick={() => setBet([])} style={{ width: "100%", marginTop: "20px", color: "#ff4444", background: "none", border: "none", fontWeight: "950", fontSize: "12px" }}>LIMPIAR TODO</button>
            </div>
          ) : <div style={{ textAlign: "center", padding: "50px 0", color: "#333", fontWeight: "950" }}>VACÍO</div>}
        </div>
      )}
    </div>
  );
     }
                              

          
                  


                  
              





          
        

            


              

              

        
                                      

              

                          
                              
         
         
                                                  
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
