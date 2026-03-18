import React, { useState, useMemo } from "react";

/* ============================================================
   1. BASE DE DATOS DE EQUIPOS AMPLIADA (Métricas de ataque/defensa)
   ============================================================ */
const teamStats = {
  // ESPAÑA
  "Real Madrid": { a: 2.2, d: 0.7, c: 6.2 }, "Barcelona": { a: 2.1, d: 0.9, c: 5.8 },
  "Atlético de Madrid": { a: 1.7, d: 0.8, c: 4.8 }, "Girona": { a: 1.9, d: 1.2, c: 5.0 },
  "Villarreal": { a: 1.8, d: 1.5, c: 4.9 }, "Real Sociedad": { a: 1.3, d: 0.9, c: 5.6 },
  "Sevilla": { a: 1.4, d: 1.4, c: 5.5 }, "Valencia": { a: 1.1, d: 1.2, c: 4.2 },
  "Athletic Club": { a: 1.5, d: 1.0, c: 5.4 }, "Real Betis": { a: 1.3, d: 1.1, c: 5.1 },
  "Osasuna": { a: 1.2, d: 1.3, c: 4.5 }, "Celta de Vigo": { a: 1.3, d: 1.5, c: 5.2 },
  "Mallorca": { a: 0.9, d: 1.1, c: 4.1 }, "Getafe": { a: 1.0, d: 1.1, c: 3.8 },
  "Rayo Vallecano": { a: 1.0, d: 1.4, c: 4.7 }, "Alavés": { a: 1.0, d: 1.3, c: 4.4 },
  "Espanyol": { a: 1.1, d: 1.5, c: 4.0 }, "Elche": { a: 0.8, d: 1.6, c: 3.9 },
  "Levante": { a: 1.2, d: 1.3, c: 4.8 }, "Real Oviedo": { a: 1.0, d: 1.1, c: 4.2 },

  // INGLATERRA
  "Man City": { a: 2.5, d: 0.7, c: 7.5 }, "Arsenal": { a: 2.1, d: 0.8, c: 6.8 },
  "Liverpool": { a: 2.3, d: 0.9, c: 7.2 }, "Man Utd": { a: 1.5, d: 1.5, c: 5.4 },
  "Chelsea": { a: 1.7, d: 1.6, c: 5.8 }, "Tottenham": { a: 2.0, d: 1.5, c: 6.4 },
  "Aston Villa": { a: 1.9, d: 1.3, c: 5.6 }, "Newcastle": { a: 1.8, d: 1.6, c: 6.0 },
  "Brighton": { a: 1.6, d: 1.6, c: 5.7 }, "Bournemouth": { a: 1.3, d: 1.7, c: 4.8 },
  "Everton": { a: 1.1, d: 1.3, c: 5.0 }, "West Ham": { a: 1.4, d: 1.5, c: 4.9 },
  "Sunderland": { a: 1.1, d: 1.4, c: 4.5 }, "Fulham": { a: 1.3, d: 1.4, c: 5.1 },
  "Burnley": { a: 0.9, d: 1.8, c: 4.3 }, "Leeds Utd": { a: 1.4, d: 1.7, c: 5.5 },
  "Brentford": { a: 1.3, d: 1.5, c: 4.9 }, "Nottingham Forest": { a: 1.1, d: 1.6, c: 4.6 },
  "Wolves": { a: 1.1, d: 1.4, c: 4.7 }, "Crystal Palace": { a: 1.2, d: 1.4, c: 4.8 },

  // ITALIA
  "Inter": { a: 2.2, d: 0.6, c: 6.1 }, "Milan": { a: 1.9, d: 1.1, c: 5.3 }, "AC Milan": { a: 1.9, d: 1.1, c: 5.3 },
  "Juventus": { a: 1.5, d: 0.7, c: 4.9 }, "Napoli": { a: 1.5, d: 1.3, c: 5.9 }, "Nápoles": { a: 1.5, d: 1.3, c: 5.9 },
  "Atalanta": { a: 1.8, d: 1.2, c: 5.5 }, "Roma": { a: 1.6, d: 1.1, c: 4.6 },
  "Lazio": { a: 1.3, d: 1.1, c: 4.8 }, "Torino": { a: 1.0, d: 1.0, c: 4.4 },
  "Sassuolo": { a: 1.2, d: 1.6, c: 4.2 }, "Fiorentina": { a: 1.4, d: 1.2, c: 5.2 },
  "Cagliari": { a: 1.0, d: 1.5, c: 4.4 }, "Genoa": { a: 1.1, d: 1.3, c: 4.5 },
  "Udinese": { a: 1.0, d: 1.2, c: 4.6 }, "Parma": { a: 1.1, d: 1.4, c: 4.3 },
  "Cremonese": { a: 0.9, d: 1.7, c: 4.1 }, "Como": { a: 1.0, d: 1.3, c: 4.0 },
  "Pisa": { a: 0.9, d: 1.2, c: 4.1 }, "Verona": { a: 1.0, d: 1.4, c: 4.2 },
  "Bolonia": { a: 1.3, d: 1.1, c: 5.0 }, "Lecce": { a: 0.8, d: 1.4, c: 3.9 },

  // ALEMANIA
  "Leverkusen": { a: 2.4, d: 0.8, c: 6.4 }, "Bayer Leverkusen": { a: 2.4, d: 0.8, c: 6.4 },
  "Bayern": { a: 2.7, d: 1.1, c: 7.3 }, "Bayern Múnich": { a: 2.7, d: 1.1, c: 7.3 },
  "Dortmund": { a: 1.9, d: 1.3, c: 5.6 }, "Borussia Dortmund": { a: 1.9, d: 1.3, c: 5.6 },
  "RB Leipzig": { a: 2.1, d: 1.1, c: 6.0 }, "Hoffenheim": { a: 1.5, d: 1.8, c: 4.7 },
  "Union Berlin": { a: 1.0, d: 1.2, c: 4.1 }, "Heidenheim": { a: 1.1, d: 1.4, c: 4.0 },
  "Hamburgo": { a: 1.2, d: 1.4, c: 4.5 }, "Colonia": { a: 1.0, d: 1.5, c: 4.2 },
  "Borussia M'gladbach": { a: 1.3, d: 1.6, c: 5.0 }, "Wolfsburgo": { a: 1.2, d: 1.4, c: 4.7 },
  "Werder Bremen": { a: 1.2, d: 1.5, c: 4.8 }, "Mainz": { a: 1.1, d: 1.4, c: 4.5 },
  "Eintracht Fráncfort": { a: 1.5, d: 1.4, c: 5.2 }, "St. Pauli": { a: 1.0, d: 1.3, c: 4.3 },
  "Friburgo": { a: 1.3, d: 1.4, c: 4.9 }, "Augsburgo": { a: 1.2, d: 1.6, c: 4.6 },
  "Stuttgart": { a: 2.0, d: 1.2, c: 5.8 },

  // OTROS (EUROPA / CHAMPIONS)
  "Galatasaray": { a: 1.6, d: 1.4, c: 5.2 }
};

/* ============================================================
   2. MOTOR DE CÁLCULO
   ============================================================ */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const poisson = (lambda, k) => (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);

function runModel(match) {
  const home = teamStats[match.home] || { a: 1.1, d: 1.2, c: 4.5 };
  const away = teamStats[match.away] || { a: 1.0, d: 1.3, c: 4.2 };
  const hxg = (home.a * 1.15) * away.d;
  const axg = away.a * (home.d * 0.95);
  
  let p1 = 0, pX = 0, p2 = 0, maxP = 0, bestI = 0, bestJ = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const pr = poisson(hxg, i) * poisson(axg, j);
      if (i > j) p1 += pr; else if (i === j) pX += pr; else p2 += pr;
      if (pr > maxP) { maxP = pr; bestI = i; bestJ = j; }
    }
  }

  return { 
    p1: (p1 * 100).toFixed(0), pX: (pX * 100).toFixed(0), p2: (p2 * 100).toFixed(0),
    q1: (1 / (p1 + 0.05)).toFixed(2), qX: (1 / (pX + 0.05)).toFixed(2), q2: (1 / (p2 + 0.05)).toFixed(2),
    exact: `${bestI}-${bestJ}`,
    goals: (bestI + bestJ) > 2 ? "+2.5 Goles" : "-2.5 Goles",
    corners: (home.c + away.c) * 0.9 > 9.5 ? "+9.5 Córners" : "-9.5 Córners",
    bestPick: p1 > p2 && p1 > pX ? "1" : (p2 > pX ? "2" : "X"),
    prob: Math.max(p1, pX, p2)
  };
}

/* ============================================================
   3. COMPONENTE PRINCIPAL (DATOS INTEGRADOS DE LAS CAPTURAS)
   ============================================================ */
export default function GolPredictPro() {
  const [activeTab, setActiveTab] = useState("LIGAS");
  const [league, setLeague] = useState("CHAMPIONS");
  const [ticket, setTicket] = useState([]);
  const [stake, setStake] = useState(10);
  const [msg, setMsg] = useState("");

  const initialData = {
    "CHAMPIONS": [
      { id: "u1", home: "Barcelona", away: "Newcastle", date: "18.03" },
      { id: "u2", home: "Bayern Múnich", away: "Atalanta", date: "18.03" },
      { id: "u3", home: "Liverpool", away: "Galatasaray", date: "18.03" },
      { id: "u4", home: "Tottenham", away: "Atlético de Madrid", date: "18.03" }
    ],
    "LALIGA": [
      // Jornada 29
      { id: "sp1", home: "Villarreal", away: "Real Sociedad", date: "20.03" },
      { id: "sp2", home: "Elche", away: "Mallorca", date: "21.03" },
      { id: "sp3", home: "Espanyol", away: "Getafe", date: "21.03" },
      { id: "sp4", home: "Levante", away: "Real Oviedo", date: "21.03" },
      { id: "sp5", home: "Osasuna", away: "Girona", date: "21.03" },
      { id: "sp6", home: "Sevilla", away: "Valencia", date: "21.03" },
      { id: "sp7", home: "Barcelona", away: "Rayo Vallecano", date: "22.03" },
      { id: "sp8", home: "Celta de Vigo", away: "Alavés", date: "22.03" },
      { id: "sp9", home: "Athletic Club", away: "Real Betis", date: "22.03" },
      { id: "sp10", home: "Real Madrid", away: "Atlético de Madrid", date: "22.03" },
      // Jornada 30
      { id: "sp11", home: "Rayo Vallecano", away: "Elche", date: "03.04" },
      { id: "sp12", home: "Real Sociedad", away: "Levante", date: "04.04" },
      { id: "sp13", home: "Mallorca", away: "Real Madrid", date: "04.04" },
      { id: "sp14", home: "Alavés", away: "Osasuna", date: "04.04" },
      { id: "sp15", home: "Atlético de Madrid", away: "Barcelona", date: "04.04" },
      { id: "sp16", home: "Getafe", away: "Athletic Club", date: "05.04" },
      { id: "sp17", home: "Valencia", away: "Celta de Vigo", date: "05.04" },
      { id: "sp18", home: "Real Oviedo", away: "Sevilla", date: "05.04" },
      { id: "sp19", home: "Real Betis", away: "Espanyol", date: "05.04" },
      { id: "sp20", home: "Girona", away: "Villarreal", date: "06.04" }
    ],
    "PREMIER": [
      // Jornada 31
      { id: "en1", home: "Bournemouth", away: "Man Utd", date: "20.03" },
      { id: "en2", home: "Brighton", away: "Liverpool", date: "21.03" },
      { id: "en3", home: "Fulham", away: "Burnley", date: "21.03" },
      { id: "en4", home: "Everton", away: "Chelsea", date: "21.03" },
      { id: "en5", home: "Leeds Utd", away: "Brentford", date: "21.03" },
      { id: "en6", home: "Newcastle", away: "Sunderland", date: "22.03" },
      { id: "en7", home: "Aston Villa", away: "West Ham", date: "22.03" },
      { id: "en8", home: "Tottenham", away: "Nottingham Forest", date: "22.03" },
      // Jornada 32
      { id: "en9", home: "West Ham", away: "Wolves", date: "10.04" },
      { id: "en10", home: "Arsenal", away: "Bournemouth", date: "11.04" },
      { id: "en11", home: "Brentford", away: "Everton", date: "11.04" },
      { id: "en12", home: "Burnley", away: "Brighton", date: "11.04" },
      { id: "en13", home: "Crystal Palace", away: "Newcastle", date: "11.04" },
      { id: "en14", home: "Nottingham Forest", away: "Aston Villa", date: "11.04" },
      { id: "en15", home: "Liverpool", away: "Fulham", date: "11.04" },
      { id: "en16", home: "Sunderland", away: "Tottenham", date: "12.04" },
      { id: "en17", home: "Chelsea", away: "Man City", date: "12.04" },
      { id: "en18", home: "Man Utd", away: "Leeds Utd", date: "13.04" }
    ],
    "SERIE A": [
      // Jornada 30
      { id: "it1", home: "Cagliari", away: "Nápoles", date: "20.03" },
      { id: "it2", home: "Genoa", away: "Udinese", date: "20.03" },
      { id: "it3", home: "Parma", away: "Cremonese", date: "21.03" },
      { id: "it4", home: "AC Milan", away: "Torino", date: "21.03" },
      { id: "it5", home: "Juventus", away: "Sassuolo", date: "21.03" },
      { id: "it6", home: "Como", away: "Pisa", date: "22.03" },
      { id: "it7", home: "Atalanta", away: "Verona", date: "22.03" },
      { id: "it8", home: "Bolonia", away: "Lazio", date: "22.03" },
      { id: "it9", home: "Roma", away: "Lecce", date: "22.03" },
      { id: "it10", home: "Fiorentina", away: "Inter", date: "22.03" },
      // Jornada 31
      { id: "it11", home: "Lecce", away: "Atalanta", date: "04.04" },
      { id: "it12", home: "Sassuolo", away: "Cagliari", date: "04.04" },
      { id: "it13", home: "Verona", away: "Fiorentina", date: "04.04" },
      { id: "it14", home: "Lazio", away: "Parma", date: "04.04" },
      { id: "it15", home: "Cremonese", away: "Bolonia", date: "05.04" },
      { id: "it16", home: "Pisa", away: "Torino", date: "05.04" },
      { id: "it17", home: "Inter", away: "Roma", date: "05.04" },
      { id: "it18", home: "Udinese", away: "Como", date: "06.04" },
      { id: "it19", home: "Juventus", away: "Genoa", date: "06.04" },
      { id: "it20", home: "Nápoles", away: "AC Milan", date: "06.04" }
    ],
    "BUNDESLIGA": [
      // Jornada 27
      { id: "de1", home: "RB Leipzig", away: "Hoffenheim", date: "20.03" },
      { id: "de2", home: "Bayern Múnich", away: "Union Berlin", date: "21.03" },
      { id: "de3", home: "Colonia", away: "Borussia M'gladbach", date: "21.03" },
      { id: "de4", home: "Heidenheim", away: "Bayer Leverkusen", date: "21.03" },
      { id: "de5", home: "Wolfsburgo", away: "Werder Bremen", date: "21.03" },
      { id: "de6", home: "Borussia Dortmund", away: "Hamburgo", date: "21.03" },
      { id: "de7", home: "Mainz", away: "Eintracht Fráncfort", date: "22.03" },
      { id: "de8", home: "St. Pauli", away: "Friburgo", date: "22.03" },
      { id: "de9", home: "Augsburgo", away: "Stuttgart", date: "22.03" },
      // Jornada 28
      { id: "de10", home: "Bayer Leverkusen", away: "Wolfsburgo", date: "04.04" },
      { id: "de11", home: "Borussia M'gladbach", away: "Heidenheim", date: "04.04" },
      { id: "de12", home: "Friburgo", away: "Bayern Múnich", date: "04.04" },
      { id: "de13", home: "Hamburgo", away: "Augsburgo", date: "04.04" },
      { id: "de14", home: "Hoffenheim", away: "Mainz", date: "04.04" },
      { id: "de15", home: "Werder Bremen", away: "RB Leipzig", date: "04.04" },
      { id: "de16", home: "Stuttgart", away: "Borussia Dortmund", date: "04.04" }
    ],
    "EUROPA": [
      { id: "e1", home: "Bayer Leverkusen", away: "West Ham", date: "09.04" },
      { id: "e2", home: "AC Milan", away: "Roma", date: "09.04" }
    ]
  };

  const addToTicket = (match, pick, q) => {
    setMsg("");
    setTicket(prev => {
      const exists = prev.find(t => t.id === match.id);
      if (exists) return prev.filter(t => t.id !== match.id);
      return [...prev, { ...match, pick, q: parseFloat(q) }];
    });
  };

  const aiCombos = useMemo(() => {
    const all = Object.values(initialData).flat().map(m => ({ ...m, result: runModel(m) }));
    all.sort((a, b) => b.result.prob - a.result.prob);
    return { b: all.slice(0, 2), m: all.slice(0, 3), a: all.slice(0, 4) };
  }, []);

  const totalCuota = ticket.reduce((acc, curr) => acc * curr.q, 1).toFixed(2);

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: "15px", maxWidth: "500px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#00ff41", textAlign: "center", marginBottom: "20px" }}>GOLPREDICT <span style={{color:"#fff"}}>ULTRA</span></h2>

      <nav style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
        {["LIGAS", "IA COMBOS", "TICKET"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: "12px", background: activeTab === t ? "#00ff41" : "#111", color: activeTab === t ? "#000" : "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", position:"relative" }}>
            {t} {t === "TICKET" && ticket.length > 0 && <span style={{position:"absolute", top:"-5px", right:"-5px", background:"#ff3333", color:"#fff", borderRadius:"50%", padding:"2px 6px", fontSize:"0.6rem"}}>{ticket.length}</span>}
          </button>
        ))}
      </nav>

      {activeTab === "LIGAS" && (
        <>
          <div style={{ display: "flex", overflowX: "auto", gap: "8px", marginBottom: "15px", paddingBottom: "5px" }}>
            {Object.keys(initialData).map(l => (
              <button key={l} onClick={() => setLeague(l)} style={{ whiteSpace: "nowrap", padding: "10px 15px", background: league === l ? "#222" : "#111", color: league === l ? "#00ff41" : "#888", border: `1px solid ${league === l ? "#00ff41" : "#333"}`, borderRadius: "20px", fontSize: "0.7rem", fontWeight:"bold" }}>{l}</button>
            ))}
          </div>
          {initialData[league].map(m => <MatchCard key={m.id} match={m} onSelect={addToTicket} ticket={ticket} />)}
        </>
      )}

      {activeTab === "IA COMBOS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <ComboView title="COMBO SEGURO (Fijos)" color="#00ff41" matches={aiCombos.b} onAdd={addToTicket} />
          <ComboView title="COMBO MODERADO" color="#ffaa00" matches={aiCombos.m} onAdd={addToTicket} />
          <ComboView title="COMBO ARRIESGADO" color="#ff3333" matches={aiCombos.a} onAdd={addToTicket} />
        </div>
      )}

      {activeTab === "TICKET" && (
        <div style={{ background: "#111", padding: "20px", borderRadius: "15px", border: "1px solid #222" }}>
          <h3 style={{ color: "#00ff41", marginTop: 0 }}>CALCULADORA DE APUESTA</h3>
          {ticket.length === 0 ? <p style={{color:"#666", textAlign:"center"}}>Selecciona pronósticos en las ligas.</p> : (
            <>
              {ticket.map(t => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #222", fontSize: "0.85rem" }}>
                  <span>{t.home} vs {t.away} <b>({t.pick})</b></span>
                  <b style={{color:"#00ff41"}}>@{t.q}</b>
                </div>
              ))}
              <div style={{ marginTop: "20px", background: "#050505", padding: "15px", borderRadius: "10px", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                  <span>Cuota Total:</span> <b style={{ fontSize: "1.2rem", color: "#00ff41" }}>@{totalCuota}</b>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Inversión (€):</span>
                  <input type="number" value={stake} onChange={(e) => setStake(e.target.value)} style={{ width: "80px", background: "#111", border: "1px solid #00ff41", color: "#fff", padding: "8px", borderRadius: "5px", textAlign: "center" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", borderTop: "1px solid #222", paddingTop: "15px" }}>
                  <span style={{fontWeight:"bold"}}>POSIBLE PREMIO:</span> 
                  <b style={{ color: "#00ff41", fontSize: "1.4rem" }}>{(totalCuota * stake).toFixed(2)}€</b>
                </div>
              </div>
              <button onClick={() => { setMsg("✅ APUESTA REGISTRADA"); setTimeout(()=>setTicket([]), 2000); }} style={{ width: "100%", marginTop: "15px", padding: "12px", background: "#00ff41", color: "#000", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                {msg || "CERRAR APUESTA"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MatchCard({ match, onSelect, ticket }) {
  const [open, setOpen] = useState(false);
  const data = useMemo(() => runModel(match), [match]);
  const currentPick = ticket.find(t => t.id === match.id)?.pick;

  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #222" }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.65rem", color:"#555", marginBottom:"8px"}}>
         <span>📅 {match.date}</span>
      </div>
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1rem", marginBottom: "15px" }}>
        {match.home} vs {match.away}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[{ l: "1", q: data.q1, p: data.p1 }, { l: "X", q: data.qX, p: data.pX }, { l: "2", q: data.q2, p: data.p2 }].map(i => (
          <button key={i.l} onClick={() => onSelect(match, i.l, i.q)} style={{ background: currentPick === i.l ? "#00ff41" : "#050505", color: currentPick === i.l ? "#000" : "#fff", border: "1px solid #333", borderRadius: "10px", padding: "10px 5px", cursor: "pointer" }}>
            <div style={{ fontSize: "0.9rem", fontWeight: "900" }}>@{i.q}</div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>{i.p}%</div>
          </button>
        ))}
      </div>
      <button onClick={() => setOpen(!open)} style={{width:"100%", background:"none", border:"none", color:"#444", fontSize:"0.65rem", marginTop:"12px", cursor:"pointer", textDecoration:"underline"}}>
        {open ? "OCULTAR" : "ANÁLISIS IA & MARCADOR"}
      </button>
      {open && (
        <div style={{ marginTop: "10px", fontSize: "0.75rem", background: "#050505", padding: "10px", borderRadius: "8px", color: "#eee" }}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}><span>🎯 Marcador IA:</span> <b style={{color:"#00ff41"}}>{data.exact}</b></div>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"4px"}}><span>⚽ Goles:</span> <b>{data.goals}</b></div>
          <div style={{display:"flex", justifyContent:"space-between"}}><span>🚩 Córners:</span> <b>{data.corners}</b></div>
        </div>
      )}
    </div>
  );
}

function ComboView({ title, color, matches, onAdd }) {
  const cuota = matches.reduce((acc, curr) => acc * parseFloat(curr.result.q1), 1).toFixed(2);
  return (
    <div style={{ background: "#111", padding: "15px", borderRadius: "12px", borderLeft: `5px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <b style={{ color, fontSize: "0.85rem" }}>{title}</b>
        <b style={{ color: "#fff" }}>@{cuota}</b>
      </div>
      {matches.map(m => (
        <div key={m.id} style={{ fontSize: "0.75rem", color: "#aaa", ma
         
               

                                    
         
                                   
           
        
                                  
            
          
        
          

     
    

    
     
    
  
    

                                             
      
        
        
        

        
        

        
                      

            

                                                        
                  
        
          

  
                                              

            
                                                                                      


            





                                                                    


    
                                                                                          
        

    
                                            
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
