import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCWaYEedL9BAbFs0lZ8_OTk1fOHE7UqBKc",
  authDomain: "golpredict-pro.firebaseapp.com",
  projectId: "golpredict-pro",
  appId: "1:1018477661997:web:9a776f0eb568ff89708da4"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const MY_API_KEY = '695217108b2d5b5c02822e3dd4d6ce26'; 

export default function GolpredictPro() {
  const [user, setUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liga, setLiga] = useState('soccer_spain_la_liga');
  const [analysedDb, setAnalysedDb] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [selections, setSelections] = useState([]);

  const VIP_EMAILS = ['astigarrabia1984@gmail.com', 'vieirajuandavid9@gmail.com'];
  const CONTACT_NUMBER = "34618923117";

  // --- NÚCLEO MATEMÁTICO TRIPLE (ELO + POISSON + MONTE CARLO) ---
  const runDeepAnalysis = (oddL, oddE, oddV) => {
    const ITERATIONS = 10000;
    
    // 1. CÁLCULO ELO SIMULADO (A partir de la probabilidad implícita de cuotas)
    // El ELO ajusta la "voracidad" de los equipos
    const implL = 1 / oddL;
    const implV = 1 / oddV;
    const eloFactor = (implL / implV); // Ratio de fuerza relativa

    // 2. PARÁMETROS POISSON (λ)
    // λ = Goles esperados. Ajustamos según el ELO y la media de la liga (aprox 2.7)
    let lambdaL = (2.7 * (implL / (implL + implV + (1/oddE)))) * 1.1; // +10% ventaja local
    let lambdaV = (2.7 * (implV / (implL + implV + (1/oddE))));

    // 3. SIMULACIÓN MONTE CARLO
    let winsL = 0, draws = 0, winsV = 0;
    const getPoisson = (l) => {
      let L = Math.exp(-l), k = 0, p = 1;
      do { k++; p *= Math.random(); } while (p > L);
      return k - 1;
    };

    for (let i = 0; i < ITERATIONS; i++) {
      const gL = getPoisson(lambdaL);
      const gV = getPoisson(lambdaV);
      if (gL > gV) winsL++;
      else if (gL === gV) draws++;
      else winsV++;
    }

    const pL = (winsL / ITERATIONS) * 100;
    const pE = (draws / ITERATIONS) * 100;
    const pV = (winsV / ITERATIONS) * 100;

    // DETERMINACIÓN DE "VALUE BET" (Buscamos >12% de Edge matemático)
    const valL = (pL / 100) * oddL > 1.12;
    const valE = (pE / 100) * oddE > 1.12;
    const valV = (pV / 100) * oddV > 1.12;

    return { pL, pE, pV, valL, valE, valV, eloFactor: eloFactor.toFixed(2) };
  };

  const fetchLiveOdds = useCallback(async () => {
    if (!isVIP) return;
    setIsSimulating(true);
    try {
      const res = await fetch(`https://api.the-odds-api.com/v4/sports/${liga}/odds/?apiKey=${MY_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const processed = data.map(match => {
          const bookie = match.bookmakers[0];
          if (!bookie) return null;
          const outcomes = bookie.markets[0].outcomes;
          const oL = outcomes.find(o => o.name === match.home_team)?.price;
          const oV = outcomes.find(o => o.name === match.away_team)?.price;
          const oE = outcomes.find(o => o.name === 'Draw')?.price;

          if (!oL || !oV || !oE) return null;

          const stats = runDeepAnalysis(oL, oE, oV);

          return {
            id: match.id,
            home: match.home_team,
            away: match.away_team,
            oL, oE, oV,
            ...stats
          };
        }).filter(x => x !== null);

        setAnalysedDb(prev => ({ ...prev, [liga]: processed }));
      }
    } catch (e) { console.error("Error Crítico API:", e); }
    setIsSimulating(false);
  }, [liga, isVIP]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && VIP_EMAILS.includes(u.email.toLowerCase().trim())) {
        setIsVIP(true); setUser(u);
      } else { setIsVIP(false); setUser(u); }
      setLoading(false);
      
  
                                      
          
          

                                         


    

          
    
          
       



                                       
          

                                                                 
                
                                                 
                                  
                                                                    
                      
                   
                                  
                          
                
                    
        


            
                                           
            
                                
