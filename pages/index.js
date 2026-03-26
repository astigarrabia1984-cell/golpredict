import React, { useState } from "react";

const DATA = {
  "LALIGA": [
    { id: 1, d: "03.04 21:00", h: "Rayo Vallecano", a: "Elche", hE: 1.4, aE: 1.1 },
    { id: 2, d: "04.04 14:00", h: "Real Sociedad", a: "Levante", hE: 1.9, aE: 0.8 },
    { id: 3, d: "04.04 16:15", h: "Mallorca", a: "Real Madrid", hE: 0.9, aE: 2.3 },
    { id: 4, d: "04.04 18:30", h: "Real Betis", a: "Espanyol", hE: 1.7, aE: 1.2 },
    { id: 5, d: "04.04 21:00", h: "Atleti", a: "Barça", hE: 1.8, aE: 1.8 }
  ],
  "NBA": [
    { id: 10, d: "26.03 02:00", h: "Celtics", a: "Knicks", hE: 116, aE: 105 },
    { id: 11, d: "26.03 04:30", h: "Nuggets", a: "Suns", hE: 110, aE: 115 }
  ],
  "NHL": [
    { id: 20, d: "26.03 01:00", h: "Panthers", a: "Bruins", hE: 3.5, aE: 2.8 }
  ]
};

export default function Page() {
  const [tab, setTab] = useState("LALIGA");
  const [open, setOpen] = useState(null);

  const calc = (h, a, type) => {
    const isN = type === "NBA";
    const total = h + a;
    const p1 = Math.round((h / total) * (isN ? 100 : 85));
    const p2 = isN ? (100 - p1) : Math.round((a / total) * 75);
    const pX = isN ? 0 : (100 - p1 - p2);

    let res = { t: "X: " + pX + "%", c: "#ffa500" };
    if (p1 > p2 && p1 > pX) res = { t: "1: " + p1 + "%", c: "#00ff41" };
    if (p2 > p1 && p2 > pX) res = { t: "2: " + p2 + "%", c: "#ff4444" };

    return { ...res, p1, pX, p2, g: isN ? h : total.toFixed(1) };
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "10px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center" }}>GOLPREDICT OMNI</h2>
      
      <div style={{ display: "flex", gap: "5px", marginBottom: "15px", overflowX: "auto" }}>
        {Object.keys(DATA).map((name) => (
          <button 
            key={name} 
            onClick={() => {setTab(name); setOpen(null);}} 
            style={{ padding: "8px", borderRadius: "5px", border: "none", background: tab === name ? "#00ff41" : "#222", color: tab === name ? "#000" : "#fff", fontWeight: "bold", fontSize: "10px" }}
          >
            {name}
          </button>
        ))}
      </div>

      {DATA[tab].map((m) => {
        const s = calc(m.hE, m.aE, tab);
        const isOpen = open === m.id;
        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "10px", marginBottom: "8px", border: isOpen ? "1px solid " + s.c : "1px solid #333" }}>
            <div onClick={() => setOpen(isOpen ? null : m.id)} style={{ padding: "12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: "13px" }}>{m.h}</div>
              <div style={{ textAlign: "center", width: "80px" }}>
                <div style={{ fontSize: "16px", fontWeight: "bold", color: s.c }}>{s.t}</div>
                <div style={{ fontSize: "9px", color: "#666" }}>{m.d}</div>
              </div>
              <div style={{ flex: 1, textAlign: "right", fontSize: "13px" }}>{m.a}</div>
            </div>
            
            {isOpen && (
              <div style={{ padding: "10px", borderTop: "1px solid #222", background: "#080808" }}>
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px", fontSize: "11px" }}>
                  <span>1: {s.p1}%</span>
                  {tab !== "NBA" && <span>X: {s.pX}%</span>}
                  <span>2: {s.p2}%</span>
                </div>
                <div style={{ background: "#1a1a1a", padding: "8px", borderRadius: "5px", textAlign: "center", color: "#00ff41", fontSize: "12px" }}>
                  {tab === "NBA" ? "PREDICCIÓN PUNTOS: " : "ESTIMACIÓN GOLES: "} {s.g}
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
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
