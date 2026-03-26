import React, { useState } from "react";

const DATA = {
  "LALIGA": [
    { id: 1, d: "03.04 21:00", h: "Rayo Vallecano", a: "Elche", hE: 1.4, aE: 1.1 },
    { id: 2, d: "04.04 14:00", h: "Real Sociedad", a: "Levante", hE: 1.9, aE: 0.8 },
    { id: 3, d: "04.04 16:15", h: "Mallorca", a: "Real Madrid", hE: 0.9, aE: 2.3 },
    { id: 4, d: "04.04 18:30", h: "Real Betis", a: "Espanyol", hE: 1.7, aE: 1.2 },
    { id: 5, d: "04.04 21:00", h: "Atleti", a: "Barça", hE: 1.8, aE: 1.8 },
    { id: 6, d: "05.04 14:00", h: "Getafe", a: "Athletic", hE: 1.1, aE: 1.5 },
    { id: 7, d: "05.04 16:15", h: "Valencia", a: "Celta", hE: 1.6, aE: 1.2 },
    { id: 8, d: "05.04 18:30", h: "Oviedo", a: "Sevilla", hE: 1.1, aE: 1.4 },
    { id: 9, d: "05.04 21:00", h: "Alavés", a: "Osasuna", hE: 1.2, aE: 1.2 },
    { id: 10, d: "06.04 21:00", h: "Girona", a: "Villarreal", hE: 2.1, aE: 1.6 }
  ],
  "CHAMPIONS": [
    { id: 11, d: "07.04 21:00", h: "Real Madrid", a: "Man. City", hE: 1.9, aE: 2.1 },
    { id: 12, d: "08.04 21:00", h: "PSG", a: "Barcelona", hE: 2.1, aE: 1.8 }
  ],
  "NBA": [
    { id: 13, d: "Hoy 02:00", h: "Boston Celtics", a: "NY Knicks", hE: 116, aE: 105 },
    { id: 14, d: "Hoy 04:30", h: "LA Lakers", a: "GS Warriors", hE: 112, aE: 118 }
  ],
  "NHL": [
    { id: 15, d: "Hoy 01:00", h: "Florida", a: "Boston", hE: 3.2, aE: 2.5 }
  ]
};

export default function GolPredict() {
  const [tab, setTab] = useState("LALIGA");
  const [open, setOpen] = useState(null);

  const getS = (h, a, t) => {
    const isN = t === "NBA";
    const sum = h + a;
    const p1 = Math.round((h / sum) * (isN ? 100 : 85));
    const p2 = isN ? (100 - p1) : Math.round((a / sum) * 75);
    const pX = isN ? 0 : (100 - p1 - p2);

    let res = { txt: `X: ${pX}%`, col: "#ffa500" };
    if (p1 > p2 && p1 > pX) res = { txt: `1: ${p1}%`, col: "#00ff41" };
    if (p2 > p1 && p2 > pX) res = { txt: `2: ${p2}%`, col: "#ff4444" };

    return { ...res, p1, pX, p2, g: isN ? h : sum.toFixed(1), c: isN ? "AST" : "CNR", cv: isN ? Math.round(h/5) : Math.round(sum+6) };
  };

  return (
    <div style={{ background: "#000", color: "#FFF", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#00ff41", textAlign: "center", fontSize: "1.2rem" }}>GOLPREDICT OMNI</h1>
      
      <div style={{ display: "flex", gap: "5px", marginBottom: "15px", overflowX: "auto" }}>
        {Object.keys(DATA).map(l => (
          <button key={l} onClick={() => {setTab(l); setOpen(null);}} style={{ flexShrink: 0, padding: "8px 12px", borderRadius: "5px", border: "none", background: tab === l ? "#00ff41" : "#222", color: tab === l ? "#000" : "#FFF", fontWeight: "bold", fontSize: "0.7rem" }}>{l}</button>
        ))}
      </div>

      {DATA[tab].map(m => {
        const s = getS(m.hE, m.aE, tab);
        const isOpen = open === m.id;
        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "8px", marginBottom: "8px", border: isOpen ? `1px solid ${s.col}` : "1px solid #333" }}>
            <div onClick={() => setOpen(isOpen ? null : m.id)} style={{ padding: "12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: "0.8rem", fontWeight: "bold" }}>{m.h}</div>
              <div style={{ textAlign: "center", width: "85px" }}>
                <div style={{ fontSize: "1rem", fontWeight: "900", color: s.col }}>{s.txt}</div>
                <div style={{ fontSize: "0.5rem", color: "#666" }}>{m.d}</div>
              </div>
              <div style={{ flex: 1, textAlign: "right", fontSize: "0.8rem", fontWeight: "bold" }}>{m.a}</div>
            </div>
            {isOpen && (
              <div style={{ padding: "12px", background: "#080808", borderTop: "1px solid #222" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", marginBottom: "10px", textAlign: "center" }}>
                  <div style={{ padding: "5px", background: "#1a1a1a", fontSize: "0.6rem" }}>1: {s.p1}%</div>
                  <div style={{ padding: "5px", background: "#1a1a1a", fontSize: "0.6rem" }}>X: {tab === "NBA" ? "-" : s.pX+"%"}</div>
                  <div style={{ padding: "5px", background: "#1a1a1a", fontSize: "0.6rem" }}>2: {s.p2}%</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", textAlign: "center" }}>
                  <div style={{ padding: "8px", background: "#1a1a1a", borderRadius: "5px", fontSize: "0.7rem", color: "#00ff41" }}>{tab === "NBA" ? "PTS" : "GOLES"}: {s.g}</div>
                  <div style={{ padding: "8px", background: "#1a1a1a", borderRadius: "5px", fontSize: "0.7rem", color: "#00ff41" }}>{s.c}: {s.cv}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
              }

              

        
                                      

              

                          
                              
         
         
                                                  }
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
