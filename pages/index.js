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
    { id: 302, d: "04.04. 18:00", h: "Verona", a: "Fiorentina", hE: 1.1, aE: 1.6, q1: 3.50, qX: 3.30, q2: 2.15 },
    { id: 303, d: "04.04. 20:45", h: "Lazio", a: "Parma", hE: 1.8, aE: 1.1, q1: 1.75, qX: 3.60, q2: 4.75 },
    { id: 304, d: "05.04. 15:00", h: "Cremonese", a: "Bolonia", hE: 0.9, aE: 1.5, q1: 4.50, qX: 3.40, q2: 1.85 },
    { id: 305, d: "05.04. 18:00", h: "Pisa", a: "Torino", hE: 1.0, aE: 1.4, q1: 3.80, qX: 3.25, q2: 2.05 },
    { id: 306, d: "05.04. 20:45", h: "Inter", a: "Roma", hE: 2.1, aE: 1.4, q1: 1.65, qX: 3.90, q2: 5.25 },
    { id: 307, d: "06.04. 12:30", h: "Udinese", a: "Como", hE: 1.3, aE: 1.2, q1: 2.40, qX: 3.20, q2: 3.10 },
    { id: 308, d: "06.04. 15:00", h: "Lecce", a: "Atalanta", hE: 1.1, aE: 1.9, q1: 4.75, qX: 3.75, q2: 1.75 },
    { id: 309, d: "06.04. 18:00", h: "Juventus", a: "Genoa", hE: 2.2, aE: 0.9, q1: 1.45, qX: 4.20, q2: 7.50 },
    { id: 310, d: "06.04. 20:45", h: "Nápoles", a: "AC Milan", hE: 1.7, aE: 1.7, q1: 2.60, qX: 3.30, q2: 2.70 }
  ],
  "BUNDESLIGA": [
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
    if (!bet.find(b => b.id === m.id)) setBet([...bet, { id: m.id, h: m.h, a: m.a, p, odd: o }]);
  };

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <header style={{ textAlign: "center", padding: "10px 0", borderBottom: "1px solid #111", marginBottom: "15px" }}>
        <h1 style={{ color: "#00ff41", fontSize: "18px", fontWeight: "900", margin: 0 }}>GOLPREDICT OMNI</h1>
      </header>

      <div style={{ display: "flex", gap: "5px", marginBottom: "15px", overflowX: "auto", paddingBottom: "5px" }}>
        {Object.keys(DATA).concat("TICKET").map(n => (
          <button key={n} onClick={() => setTab(n)} style={{ flex: "none", padding: "8px 12px", borderRadius: "15px", border: "none", background: tab === n ? "#00ff41" : "#111", color: tab === n ? "#000" : "#555", fontWeight: "bold", fontSize: "10px" }}>
            {n === "TICKET" ? `🎟️ (${bet.length})` : n}
          </button>
        ))}
      </div>

      {tab !== "TICKET" && DATA[tab].map(m => {
        const tot = m.hE + m.aE, pX = 22;
        const p1 = Math.round((m.hE / tot) * (100 - pX)), p2 = 100 - p1 - pX;
        const max = Math.max(p1, pX, p2), isOpen = open === m.id;

        return (
          <div key={m.id} style={{ background: "#0f0f0f", borderRadius: "12px", marginBottom: "10px", border: isOpen ? "1px solid #00ff41" : "1px solid #1a1a1a" }}>
            <div onClick={() => setOpen(isOpen ? null : m.id)} style={{ padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "bold", marginBottom: "10px" }}>
                <span>{m.h}</span><span style={{ color: "#333" }}>VS</span><span>{m.a}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
                {[p1, pX, p2].map((v, i) => (
                  <div key={i} style={{ background: "#000", padding: "8px", borderRadius: "8px", textAlign: "center", border: v === max ? "1px solid #00ff41" : "none" }}>
                    <div style={{ color: v === max ? "#00ff41" : "#444", fontSize: "15px", fontWeight: "bold" }}>{v}%</div>
                  </div>
                ))}
              </div>
            </div>
            {isOpen && (
              <div style={{ padding: "12px", background: "#050505", borderTop: "1px solid #1a1a1a" }}>
                <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
                   <div style={{ flex: 1, background: "#111", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "8px", color: "#00ff41" }}>GOLES</div><div>{tot.toFixed(1)}</div>
                   </div>
                   <div style={{ flex: 1, background: "#111", padding: "8px", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontSize: "8px", color: "#00ff41" }}>CORNERS</div><div>{Math.round(tot + 6)}</div>
                   </div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  {[m.q1, m.qX, m.q2].map((q, i) => (
                    <button key={i} onClick={() => addBet(m, ["1", "X", "2"][i], q)} style={{ flex: 1, background: "#222", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "bold" }}>{q}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {tab === "TICKET" && (
        <div style={{ background: "#0f0f0f", padding: "15px", borderRadius: "15px" }}>
          <h3 style={{ color: "#00ff41", marginTop: 0 }}>Resumen</h3>
          {bet.map(b => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a", fontSize: "11px" }}>
              <span>{b.h} ({b.p})</span><span style={{ color: "#00ff41" }}>@{b.odd}</span>
            </div>
          ))}
          {bet.length > 0 ? (
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span>Cuota: {totalOdds}</span>
                <input type="number" value={money} onChange={(e) => setMoney(e.target.value)} style={{ width: "60px", background: "#000", color: "#fff", border: "1px solid #333", textAlign: "right" }} />
              </div>
              <div style={{ background: "#00ff41", color: "#000", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: "900" }}>{(totalOdds * money).toFixed(2)}€</div>
              </div>
              <button onClick={() => setBet([])} style={{ width: "100%", marginTop: "10px", background: "none", border: "none", color: "#ff4444", fontSize: "10px" }}>LIMPIAR</button>
            </div>
          ) : <p style={{ textAlign: "center", color: "#333" }}>Vacío</p>}
        </div>
      )}
    </div>
  );
          }
                  


                  
              





          
        

            


              

              

        
                                      

              

                          
                              
         
         
                                                  
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
