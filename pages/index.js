import React, { useState } from "react";

const DATA = {
  "LALIGA (J30)": [
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
  "NBA": [
    { id: 20, d: "Hoy 02:00", h: "Celtics", a: "Knicks", hE: 116, aE: 105, q1: 1.45, q2: 2.80 }
  ]
};

export default function App() {
  const [tab, setTab] = useState("LALIGA (J30)");
  const [open, setOpen] = useState(null);
  const [bet, setBet] = useState([]);
  const [money, setMoney] = useState(10);

  const totalOdds = bet.reduce((acc, item) => acc * item.odd, 1).toFixed(2);

  const addToTicket = (match, pick, odd) => {
    if (bet.find(b => b.id === match.id)) return;
    setBet([...bet, { id: match.id, h: match.h, a: match.a, pick, odd }]);
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center", margin: "10px 0" }}>GOLPREDICT OMNI</h2>
      
      <div style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
        {["LALIGA (J30)", "NBA", "TICKET"].map(n => (
          <button key={n} onClick={() => setTab(n)} style={{ flex: 1, padding: "12px 5px", borderRadius: "8px", border: "none", background: tab === n ? "#00ff41" : "#222", color: tab === n ? "#000" : "#fff", fontWeight: "bold", fontSize: "10px" }}>
            {n === "TICKET" ? "🎟️ TICKET (" + bet.length + ")" : n}
          </button>
        ))}
      </div>

      {tab !== "TICKET" && DATA[tab].map(m => {
        const isN = tab === "NBA";
        const tot = m.hE + m.aE;
        const pX = isN ? 0 : 22;
        const p1 = Math.round((m.hE / tot) * (100 - pX));
        const p2 = 100 - p1 - pX;
        const isOpen = open === m.id;

        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "12px", marginBottom: "8px", border: "1px solid #333" }}>
            {/* VISTA PRINCIPAL CON PORCENTAJES */}
            <div onClick={() => setOpen(isOpen ? null : m.id)} style={{ padding: "12px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", flex: 1 }}>{m.h}</span>
                <span style={{ fontSize: "9px", color: "#666", width: "80px", textAlign: "center" }}>{m.d}</span>
                <span style={{ fontSize: "12px", fontWeight: "bold", flex: 1, textAlign: "right" }}>{m.a}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "15px", background: "#000", padding: "8px", borderRadius: "8px" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "8px", color: "#555" }}>1</div><div style={{ color: "#00ff41", fontWeight: "bold" }}>{p1}%</div></div>
                {!isN && <div style={{ textAlign: "center" }}><div style={{ fontSize: "8px", color: "#555" }}>X</div><div style={{ color: "#ffa500", fontWeight: "bold" }}>{pX}%</div></div>}
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "8px", color: "#555" }}>2</div><div style={{ color: "#ff4444", fontWeight: "bold" }}>{p2}%</div></div>
              </div>
            </div>

            {/* DESPLEGABLE: SÓLO GOLES, CÓRNERS Y CUOTAS */}
            {isOpen && (
              <div style={{ padding: "12px", background: "#080808", borderTop: "1px solid #222" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ background: "#1a1a1a", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
                    <div style={{ fontSize: "9px", color: "#00ff41" }}>GOLES TOTALES</div>
                    <div style={{ fontWeight: "bold", fontSize: "16px" }}>{isN ? tot : tot.toFixed(1)}</div>
                  </div>
                  <div style={{ background: "#1a1a1a", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
                    <div style={{ fontSize: "9px", color: "#00ff41" }}>CÓRNERS TOTALES</div>
                    <div style={{ fontWeight: "bold", fontSize: "16px" }}>{Math.round(tot + 6)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => addToTicket(m, "1", m.q1)} style={{ flex: 1, background: "#222", color: "#fff", border: "1px solid #444", padding: "8px", borderRadius: "5px", fontSize: "10px" }}>Cuota 1: {m.q1}</button>
                  {!isN && <button onClick={() => addToTicket(m, "X", m.qX)} style={{ flex: 1, background: "#222", color: "#fff", border: "1px solid #444", padding: "8px", borderRadius: "5px", fontSize: "10px" }}>Cuota X: {m.qX}</button>}
                  <button onClick={() => addToTicket(m, "2", m.q2)} style={{ flex: 1, background: "#222", color: "#fff", border: "1px solid #444", padding: "8px", borderRadius: "5px", fontSize: "10px" }}>Cuota 2: {m.q2}</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* PESTAÑA TICKET / CALCULADORA */}
      {tab === "TICKET" && (
        <div style={{ background: "#111", padding: "15px", borderRadius: "12px" }}>
          <h3 style={{ color: "#00ff41", marginTop: 0 }}>Calculadora de Ticket</h3>
          {bet.map(b => (
            <div key={b.id} style={{ borderBottom: "1px solid #222", padding: "8px 0", fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
              <span>{b.h} vs {b.a} (<b>{b.pick}</b>)</span>
              <span style={{ color: "#00ff41" }}>@{b.odd}</span>
            </div>
          ))}
          {bet.length > 0 ? (
            <div style={{ marginTop: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px" }}>
                <span>Cuota Total:</span>
                <span style={{ fontWeight: "bold", color: "#00ff41" }}>{totalOdds}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span>Importe:</span>
                <input type="number" value={money} onChange={(e) => setMoney(e.target.value)} style={{ width: "70px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", textAlign: "right", padding: "5px" }} />
              </div>
              <div style={{ background: "#00ff41", color: "#000", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
                <div style={{ fontSize: "11px", fontWeight: "bold" }}>GANANCIA POTENCIAL</div>
                <div style={{ fontSize: "26px", fontWeight: "900" }}>{(totalOdds * money).toFixed(2)}€</div>
              </div>
              <button onClick={() => setBet([])} style={{ width: "100%", marginTop: "15px", color: "#ff4444", background: "none", border: "none", fontSize: "11px" }}>Vaciar Ticket</button>
            </div>
          ) : <p style={{ textAlign: "center", color: "#555" }}>Selecciona cuotas para calcular.</p>}
        </div>
      )}
    </div>
  );
                  }
              





          
        

            


              

              

        
                                      

              

                          
                              
         
         
                                                  
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
