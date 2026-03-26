import React, { useState } from "react";

const MASTER_DATA = {
  "LALIGA (J30)": [
    { id: "es1", d: "03.04. 21:00", h: "Rayo Vallecano", a: "Elche", hE: 1.4, aE: 1.1 },
    { id: "es2", d: "04.04. 14:00", h: "Real Sociedad", a: "Levante", hE: 1.9, aE: 0.8 },
    { id: "es3", d: "04.04. 16:15", h: "Mallorca", a: "Real Madrid", hE: 0.9, aE: 2.3 },
    { id: "es4", d: "04.04. 18:30", h: "Real Betis", a: "Espanyol", hE: 1.7, aE: 1.2 },
    { id: "es5", d: "04.04. 21:00", h: "Atlético de Madrid", a: "Barcelona", hE: 1.8, aE: 1.8 },
    { id: "es6", d: "05.04. 14:00", h: "Getafe", a: "Athletic Club", hE: 1.1, aE: 1.5 },
    { id: "es7", d: "05.04. 16:15", h: "Valencia", a: "Celta de Vigo", hE: 1.6, aE: 1.2 },
    { id: "es8", d: "05.04. 18:30", h: "Real Oviedo", a: "Sevilla", hE: 1.1, aE: 1.4 },
    { id: "es9", d: "05.04. 21:00", h: "Alavés", a: "Osasuna", hE: 1.2, aE: 1.2 },
    { id: "es10", d: "06.04. 21:00", h: "Girona", a: "Villarreal", hE: 2.1, aE: 1.6 }
  ],
  "CHAMPIONS": [
    { id: "u1", d: "07.04. 21:00", h: "Real Madrid", a: "Man. City", hE: 1.9, aE: 2.1 },
    { id: "u2", d: "07.04. 21:00", h: "Arsenal", a: "Bayern", hE: 2.0, aE: 1.7 },
    { id: "u3", d: "08.04. 21:00", h: "PSG", a: "Barcelona", hE: 2.1, aE: 1.8 },
    { id: "u4", d: "08.04. 21:00", h: "Atlético", a: "Dortmund", hE: 1.6, aE: 1.1 }
  ],
  "NBA": [
    { id: "n1", d: "26.03. 01:30", h: "Boston Celtics", a: "NY Knicks", hE: 116, aE: 108 },
    { id: "n2", d: "26.03. 03:00", h: "Denver Nuggets", a: "Phoenix Suns", hE: 110, aE: 115 }
  ],
  "NHL": [
    { id: "h1", d: "26.03. 01:00", h: "Florida Panthers", a: "Boston Bruins", hE: 3.5, aE: 2.5 }
  ]
};

export default function App() {
  const [tab, setTab] = useState("LALIGA (J30)");
  const [active, setActive] = useState(null);

  const calc = (h, a, type) => {
    const isNBA = type === "NBA";
    const t = h + a;
    const p1 = Math.round((h / (h + a)) * (isNBA ? 100 : 85));
    const p2 = isNBA ? (100 - p1) : Math.round((a / (h + a)) * 75);
    const pX = isNBA ? 0 : (100 - p1 - p2);

    let res = { txt: `X: ${pX}%`, col: "#ffa500" };
    if (p1 > p2 && p1 > pX) res = { txt: `1: ${p1}%`, col: "#00ff41" };
    if (p2 > p1 && p2 > pX) res = { txt: `2: ${p2}%`, col: "#ff4444" };

    return { ...res, p1, pX, p2, g: isNBA ? h : t.toFixed(1), c: isNBA ? "AST" : "CNR", cv: isNBA ? Math.round(h/5) : Math.round(t+6) };
  };

  return (
    <div style={{ background: "#000", color: "#FFF", minHeight: "100vh", maxWidth: "500px", margin: "0 auto", padding: "10px", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#00ff41", textAlign: "center", fontSize: "1.4rem" }}>GOLPREDICT OMNI</h1>
      
      <div style={{ display: "flex", gap: "5px", marginBottom: "15px", overflowX: "auto" }}>
        {Object.keys(MASTER_DATA).map(l => (
          <button key={l} onClick={() => {setTab(l); setActive(null);}} style={{ flexShrink: 0, padding: "10px", borderRadius: "5px", border: "none", background: tab === l ? "#00ff41" : "#222", color: tab === l ? "#000" : "#FFF", fontWeight: "bold", fontSize: "0.7rem" }}>{l}</button>
        ))}
      </div>

      {MASTER_DATA[tab].map(m => {
        const s = calc(m.hE, m.aE, tab);
        const isOpen = active === m.id;
        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "10px", marginBottom: "8px", border: isOpen ? `1px solid ${s.col}` : "1px solid #333" }}>
            <div onClick={() => setActive(isOpen ? null : m.id)} style={{ padding: "15px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: "0.85rem", fontWeight: "bold" }}>{m.h}</div>
              <div style={{ textAlign: "center", width: "90px" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "900", color: s.col }}>{s.txt}</div>
                <div style={{ fontSize: "0.5rem", color: "#555" }}>{m.d}</div>
              </div>
              <div style={{ flex: 1, textAlign: "right", fontSize: "0.85rem", fontWeight: "bold" }}>{m.a}</div>
            </div>
            {isOpen && (
              <div style={{ padding: "15px", background: "#080808", borderTop: "1px solid #222" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px", marginBottom: "10px", textAlign: "center" }}>
                  <div style={{ padding: "5px", background: "#1a1a1a", fontSize: "0.6rem" }}>L: {s.p1}%</div>
                  <div style={{ padding: "5px", background: "#1a1a1a", fontSize: "0.6rem" }}>X: {tab === "NBA" ? "-" : s.pX+"%"}</div>
                  <div style={{ padding: "5px", background: "#1a1a1a", fontSize: "0.6rem" }}>V: {s.p2}%</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ background: "#1a1a1a", padding: "8px", borderRadius: "5px", textAlign: "center", fontSize: "0.7rem", color: "#00ff41" }}>{tab === "NBA" ? "PTS" : "GOLES"}: {s.g}</div>
                  <div style={{ background: "#1a1a1a", padding: "8px", borderRadius: "5px", textAlign: "center", fontSize: "0.7rem", color: "#00ff41" }}>{s.c}: {s.cv}</div>
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
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
