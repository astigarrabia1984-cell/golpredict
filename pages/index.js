import React, { useState } from "react";

const DATA = {
  "LALIGA (J30)": [
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
    { id: 13, d: "26.03 02:00", h: "Boston Celtics", a: "NY Knicks", hE: 116, aE: 105 },
    { id: 14, d: "26.03 04:30", h: "Denver Nuggets", a: "Phoenix Suns", hE: 110, aE: 115 }
  ],
  "NHL": [
    { id: 15, d: "26.03 01:00", h: "Florida Panthers", a: "Boston Bruins", hE: 3.5, aE: 2.8 }
  ]
};

export default function App() {
  const [tab, setTab] = useState("LALIGA (J30)");
  const [active, setActive] = useState(null);

  const getS = (h, a, type) => {
    const isNBA = type === "NBA";
    const total = h + a;
    const p1 = Math.round((h / total) * (isNBA ? 100 : 85));
    const p2 = isNBA ? (100 - p1) : Math.round((a / total) * 75);
    const pX = isNBA ? 0 : (100 - p1 - p2);

    let res = { t: "X: " + pX + "%", c: "#ffa500" };
    if (p1 > p2 && p1 > pX) res = { t: "1: " + p1 + "%", c: "#00ff41" };
    if (p2 > p1 && p2 > pX) res = { t: "2: " + p2 + "%", c: "#ff4444" };

    return { ...res, p1, pX, p2, g: isNBA ? h : total.toFixed(1) };
  };

  return (
    <div style={{ background: "#000", color: "#FFF", minHeight: "100vh", padding: "15px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center", fontSize: "1.2rem", marginBottom: "20px" }}>GOLPREDICT OMNI</h2>
      
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto" }}>
        {Object.keys(DATA).map((l) => (
          <button key={l} onClick={() => {setTab(l); setActive(null);}} style={{ padding: "10px 15px", borderRadius: "8px", border: "none", background: tab === l ? "#00ff41" : "#222", color: tab === l ? "#000" : "#FFF", fontWeight: "bold", fontSize: "0.7rem", whiteSpace: "nowrap" }}>{l}</button>
        ))}
      </div>

      {DATA[tab].map((m) => {
        const s = getS(m.hE, m.aE, tab);
        const isOpen = active === m.id;
        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "12px", marginBottom: "10px", border: isOpen ? "1px solid " + s.c : "1px solid #333", overflow: "hidden" }}>
            <div onClick={() => setActive(isOpen ? null : m.id)} style={{ padding: "15px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: "0.85rem", fontWeight: "bold" }}>{m.h}</div>
              <div style={{ textAlign: "center", width: "90px" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "900", color: s.c }}>{s.t}</div>
                <div style={{ fontSize: "0.5rem", color: "#666" }}>{m.d}</div>
              </div>
              <div style={{ flex: 1, textAlign: "right", fontSize: "0.85rem", fontWeight: "bold" }}>{m.a}</div>
            </div>
            {isOpen && (
              <div style={{ padding: "15px", background: "#080808", borderTop: "1px solid #222" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", textAlign: "center", marginBottom: "10px" }}>
                  <div><div style={{fontSize:"0.6rem", color:"#555"}}>1</div><div style={{fontWeight:"bold"}}>{s.p1}%</div></div>
                  <div><div style={{fontSize:"0.6rem", color:"#555"}}>X</div><div style={{fontWeight:"bold"}}>{tab === "NBA" ? "-" : s.pX+"%"}</div></div>
                  <div><div style={{fontSize:"0.6rem", color:"#555"}}>2</div><div style={{fontWeight:"bold"}}>{s.p2}%</div></div>
                </div>
                <div style={{ background: "#1a1a1a", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
                   <div style={{ fontSize: "0.6rem", color: "#00ff41" }}>{tab === "NBA" ? "PROY. PUNTOS" : "EST. GOLES"}</div>
                   <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{s.g}</div>
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
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
