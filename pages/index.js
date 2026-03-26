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

export default function App() {
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
      <h2 style={{ color: "#00ff41", textAlign: "center", marginBottom: "20px" }}>GOLPREDICT OMNI</h2>
      
      <div style={{ display: "flex", gap: "5px", marginBottom: "15px", overflowX: "auto", paddingBottom: "10px" }}>
        {Object.keys(DATA).map((name) => (
          <button 
            key={name} 
            onClick={() => {setTab(name); setOpen(null);}} 
            style={{ 
              padding: "10px", borderRadius: "8px", border: "none", 
              background: tab === name ? "#00ff41" : "#222", 
              color: tab === name ? "#000" : "#fff", 
              fontWeight: "bold", fontSize: "11px", whiteSpace: "nowrap" 
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {DATA[tab].map((m) => {
        const s = calc(m.hE, m.aE, tab);
        const isOpen = open === m.id;
        return (
          <div key={m.id} style={{ background: "#111", borderRadius: "12px", marginBottom: "10px", border: isOpen ? "1px solid " + s.c : "1px solid #333" }}>
            <div onClick={() => setOpen(isOpen ? null : m.id)} style={{ padding: "15px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: "14px", fontWeight: "bold" }}>{m.h}</div>
              <div style={{ textAlign: "center", width: "90px" }}>
                <div style={{ fontSize: "18px", fontWeight: "900", color: s.c }}>{s.t}</div>
                <div style={{ fontSize: "10px", color: "#666" }}>{m.d}</div>
              </div>
              <div style={{ flex: 1, textAlign: "right", fontSize: "14px", fontWeight: "bold" }}>{m.a}</div>
            </div>
            
            {isOpen && (
              <div style={{ padding: "15px", borderTop: "1px solid #222", background: "#080808" }}>
                <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "12px", fontSize: "12px" }}>
                  <span>Local: {s.p1}%</span>
                  {tab !== "NBA" && <span>X: {s.pX}%</span>}
                  <span>Visitante: {s.p2}%</span>
                </div>
                <div style={{ background: "#1a1a1a", padding: "12px", borderRadius: "8px", textAlign: "center", color: "#00ff41", fontSize: "13px", fontWeight: "bold" }}>
                  {tab === "NBA" ? "PROY. PUNTOS: " : "EST. GOLES: "} {s.g}
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
                   
         
         
         
     


     
     
  
                             
   
      
       
         
  



                        
       
     
              
       
   
     
     
                                   
   
                 
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
