import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ════════════════════════════════════════════════════════════════
// ⚙️  CONFIGURATION SUPABASE
// ════════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://kqpynncftodfulfjdgqv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcHlubmNmdG9kZnVsZmpkZ3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzAzMjUsImV4cCI6MjA5MjAwNjMyNX0.6ZlI5HpmRU4aBbUMvCG1qMy4zxCmHuChRgD4ba2CVYA";

const EMAIL_DIRECTEUR = "directeur@labpropharma.cd";
const EMAIL_COMPTABLE  = "comptable@labpropharma.cd";

// ════════════════════════════════════════════════════════════════
// 👥  UTILISATEURS RÉELS — LabPro Pharma RDC
// ════════════════════════════════════════════════════════════════
const USERS = [
  // DIRECTION
  { id:"01", email:"p.woto@labpro.cd",       password:"LabPro@Dir2025",  role:"directeur",   num:"01", nom:"WOTO KABUNGAMBI",     prenom:"Paul",         genre:"M" },
  // SUPERVISEUR
  { id:"05", email:"m.ngembwa@labpro.cd",     password:"LabPro@Sup2025",  role:"superviseur", num:"05", nom:"NGEMBWA FARIALA",      prenom:"Marius",       genre:"M" },
  // COMPTABLE
  { id:"C1", email:"j.mutombo@labpro.cd",     password:"LabPro@Cpt2025",  role:"comptable",   num:"—",  nom:"MUTOMBO",             prenom:"Justin",       genre:"M" },
  // DÉLÉGUÉS
  { id:"02", email:"j.bozito@labpro.cd",      password:"LabPro@Del02",    role:"delegue",     num:"02", nom:"BOZITO NYABOTA",       prenom:"Jacques",      genre:"M" },
  { id:"03", email:"l.mulunda@labpro.cd",     password:"LabPro@Del03",    role:"delegue",     num:"03", nom:"MULUNDA MULUNDA",      prenom:"Lewis",        genre:"M" },
  { id:"04", email:"jp.lowanga@labpro.cd",    password:"LabPro@Del04",    role:"delegue",     num:"04", nom:"LOWANGA OMALOKENGE",   prenom:"Jean-Pierre",  genre:"M" },
  { id:"06", email:"j.mwanda@labpro.cd",      password:"LabPro@Del06",    role:"delegue",     num:"06", nom:"MWANDA TSHUNZA",       prenom:"Joël",         genre:"M" },
  { id:"07", email:"o.mbokashanga@labpro.cd", password:"LabPro@Del07",    role:"delegue",     num:"07", nom:"MBOKASHANGA BOPE",     prenom:"Ornella",      genre:"F" },
  { id:"08", email:"a.mulumba@labpro.cd",     password:"LabPro@Del08",    role:"delegue",     num:"08", nom:"MULUMBA ANGELA",       prenom:"Angelani",     genre:"F" },
  { id:"09", email:"d.timasiemi@labpro.cd",   password:"LabPro@Del09",    role:"delegue",     num:"09", nom:"TIMASIEMI NZUZI",      prenom:"David",        genre:"M" },
  { id:"10", email:"f.mpameta@labpro.cd",     password:"LabPro@Del10",    role:"delegue",     num:"10", nom:"MPAMETA ONGANDA",      prenom:"Fidele",       genre:"M" },
  { id:"11", email:"c.panef@labpro.cd",       password:"LabPro@Del11",    role:"delegue",     num:"11", nom:"PANEF BIEBIE",         prenom:"Chadrack",     genre:"M" },
  { id:"12", email:"r.ntumba@labpro.cd",      password:"LabPro@Del12",    role:"delegue",     num:"12", nom:"NTUMBA KAMBULU",       prenom:"Rose",         genre:"F" },
  { id:"13", email:"f.epandjola@labpro.cd",   password:"LabPro@Del13",    role:"delegue",     num:"13", nom:"EPANDJOLA WOLA",       prenom:"Fiston",       genre:"M" },
  { id:"14", email:"w.kalonji@labpro.cd",     password:"LabPro@Del14",    role:"delegue",     num:"14", nom:"KALONJI BANZA",        prenom:"Willy",        genre:"M" },
];

// ════════════════════════════════════════════════════════════════
// 🧪  CATALOGUE PRODUITS
// ════════════════════════════════════════════════════════════════
const PRODUITS = [
  {code:"Glu",     item:"Glucomètre",                       prix:25},
  {code:"GluEx",   item:"Glucomètre Ex",                    prix:25},
  {code:"TMPt",    item:"Tensiomètre portable",             prix:50},
  {code:"TMGd",    item:"Tensiomètre grand brassard",       prix:50},
  {code:"B30",     item:"Bandelette 30 pcs",                prix:10},
  {code:"B50",     item:"Bandelette 50 pcs",                prix:15},
  {code:"B60",     item:"Bandelette 60 pcs",                prix:20},
  {code:"B60Ex",   item:"Bandelette 60 pcs Ex",             prix:20},
  {code:"B120",    item:"Bandelette 120 pcs",               prix:36},
  {code:"B120x",   item:"Bandelette 120 pcs X",             prix:36},
  {code:"TDR HepB",item:"Test rapide Hépatite B",           prix:20},
  {code:"TDR Typh",item:"Test rapide Typhoïde",             prix:20},
  {code:"TDR Syph",item:"Test rapide Syphilis",             prix:20},
  {code:"TDR Chla",item:"Test rapide Chlamydia",            prix:25},
  {code:"TDR HP",  item:"Test rapide Helicobacter Pylori",  prix:18},
  {code:"HbA1C",   item:"Analyseur HbA1C",                  prix:2000},
  {code:"HbA1C Rx",item:"Réactif HbA1C",                   prix:100},
  {code:"GtExam",  item:"Gants d'examen nitrile",           prix:3.5},
  {code:"Gtst",    item:"Gants chirurgicaux stériles",      prix:10.5},
  {code:"Cot50g",  item:"Coton absorbant 50g",              prix:3.04},
  {code:"Cot100g", item:"Coton absorbant 100g",             prix:7.2},
  {code:"Cot250g", item:"Coton absorbant 250g",             prix:2.72},
  {code:"Cot500g", item:"Coton absorbant 500g",             prix:9.576},
  {code:"SyrU100", item:"Seringue insuline U-100",          prix:6.0},
  {code:"SyrU40",  item:"Seringue insuline U-40",           prix:6.3},
  {code:"Syr2cc",  item:"Seringue 2 ml",                    prix:2.5},
  {code:"Syr5cc",  item:"Seringue 5 ml",                    prix:2.6},
  {code:"Syr10cc", item:"Seringue 10 ml",                   prix:4.0},
  {code:"Cat18",   item:"Cathéter IV 18",                   prix:4.25},
  {code:"Cat20",   item:"Cathéter IV 20",                   prix:4.25},
  {code:"Cat22",   item:"Cathéter IV 22",                   prix:4.85},
  {code:"Cat24",   item:"Cathéter IV 24",                   prix:5.1},
  {code:"EpiG21",  item:"Epicrânien G21",                   prix:2.76},
  {code:"EpiG23",  item:"Epicrânien G23",                   prix:2.76},
  {code:"PheUr",   item:"Poche urine 2000 ml",              prix:0.236},
  {code:"Snd16",   item:"Sonde urinaire 16",                prix:6.38},
  {code:"Snd18",   item:"Sonde urinaire 18",                prix:6.38},
  {code:"Snd22",   item:"Sonde urinaire 22",                prix:6.38},
  {code:"Snd24",   item:"Sonde urinaire 24",                prix:6.38},
  {code:"Snd26",   item:"Sonde urinaire 26",                prix:6.38},
  {code:"TssPerf", item:"Trousse de perfusion",             prix:3.075},
  {code:"MskOx",   item:"Masque à oxygène",                 prix:28.25},
];

// ════════════════════════════════════════════════════════════════
// 🎨  DESIGN SYSTEM
// ════════════════════════════════════════════════════════════════
const C = {
  sidebar:"#0A1628", navy:"#0F2040", navy2:"#162B52", navy3:"#1E3A6E",
  green:"#059669",  green2:"#047857", greenL:"#ECFDF5",
  red:"#DC2626",    redL:"#FEF2F2",
  amber:"#D97706",  amberL:"#FFFBEB",
  blue:"#2563EB",   blueL:"#EFF6FF",
  purple:"#7C3AED", purpleL:"#F5F3FF",
  bg:"#F1F5F9", white:"#FFFFFF", border:"#E2E8F0",
  text:"#0F172A", muted:"#64748B", light:"#94A3B8",
};
const CHART_COLORS = ["#059669","#2563EB","#D97706","#DC2626","#7C3AED","#0891B2","#BE185D"];
const ROLE_COLOR = { directeur:C.navy3, superviseur:C.purple, comptable:C.amber, delegue:C.green };
const ROLE_LABEL = { directeur:"Directeur Commercial", superviseur:"Superviseur", comptable:"Comptable", delegue:"Délégué(e) Commercial(e)" };

// ════════════════════════════════════════════════════════════════
// 🔧  HELPERS
// ════════════════════════════════════════════════════════════════
const fmt     = (n) => new Intl.NumberFormat("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n||0);
const todayISO= () => new Date().toISOString().split("T")[0];
const todayFR = () => new Date().toLocaleDateString("fr-FR",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
const newRow  = () => ({id:Date.now()+Math.random(),code:"",item:"",qte:1,prix:0,montant:0,client:"",adresse:"",tel:"",lat:"",lng:""});

const loadReports = () => { try{return JSON.parse(localStorage.getItem("labpro_v2_reports")||"[]");}catch{return[];} };
const saveReports = (r) => localStorage.setItem("labpro_v2_reports", JSON.stringify(r));
const loadUser    = () => { try{return JSON.parse(localStorage.getItem("labpro_v2_user")||"null");}catch{return null;} };
const saveUser    = (u) => localStorage.setItem("labpro_v2_user", JSON.stringify(u));
const clearUser   = ()  => localStorage.removeItem("labpro_v2_user");

// ════════════════════════════════════════════════════════════════
// 📦  EXPORT EXCEL  (SheetJS via CDN)
// ════════════════════════════════════════════════════════════════
const getXLSX = async () => {
  if (window._XLSX) return window._XLSX;
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    s.onload = () => { window._XLSX = window.XLSX; resolve(window.XLSX); };
    document.head.appendChild(s);
  });
};

const exportExcel = async (rapport) => {
  const XLSX = await getXLSX();
  const header = [
    ["RAPPORT DES VENTES JOURNALIÈRES — LabPro Pharma RDC Sarl"],
    [],
    ["Délégué :", `${rapport.prenom} ${rapport.nom}`],
    ["N° Agent :", rapport.num],
    ["Date :", rapport.date],
    ["Secteurs visités :", rapport.secteurs],
    [],
    ["CODE","ITEM","QUANTITÉ","MONTANT (USD)","NOM CLIENT","ADRESSE","TÉLÉPHONE","LATITUDE","LONGITUDE"],
  ];
  const rows = (rapport.lignes||[]).map(l=>[l.code,l.item,l.qte,l.montant,l.client,l.adresse,l.tel,l.lat,l.lng]);
  const footer = [[],[``,``,`TOTAL CA (USD):`,rapport.totalCA]];
  const ws = XLSX.utils.aoa_to_sheet([...header,...rows,...footer]);
  ws["!cols"] = [{wch:12},{wch:34},{wch:10},{wch:14},{wch:24},{wch:26},{wch:16},{wch:12},{wch:12}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rapport");
  XLSX.writeFile(wb, `LabPro_${rapport.nom}_${rapport.date}.xlsx`);
};

const exportExcelCompil = async (reports, titre) => {
  const XLSX = await getXLSX();
  const rows = [
    [`COMPILATION — ${titre} — LabPro Pharma RDC Sarl`],[],
    ["N°","DÉLÉGUÉ","DATE","NB VENTES","CLIENTS","CA TOTAL (USD)"],
    ...reports.map(r=>[r.num||"—",`${r.prenom} ${r.nom}`,r.date,r.lignes?.length||0,r.nbClients||0,r.totalCA||0]),
    [],["","","TOTAL GÉNÉRAL","",reports.reduce((s,r)=>s+(r.lignes?.length||0),0), reports.reduce((s,r)=>s+(r.totalCA||0),0)],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Compilation");
  XLSX.writeFile(wb, `LabPro_Compilation_${titre.replace(/[ /]/g,"_")}.xlsx`);
};

// ════════════════════════════════════════════════════════════════
// 🧩  UI COMPONENTS
// ════════════════════════════════════════════════════════════════
function StatCard({icon,label,value,sub,color,trend}) {
  return (
    <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px",position:"relative",overflow:"hidden",transition:"box-shadow 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.08)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
      <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:color||C.green,borderRadius:"14px 0 0 14px"}}/>
      <div style={{marginLeft:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <span style={{fontSize:24}}>{icon}</span>
          {trend!==undefined&&<span style={{fontSize:11,fontWeight:600,color:trend>=0?C.green:C.red,background:trend>=0?C.greenL:C.redL,padding:"2px 8px",borderRadius:999}}>{trend>=0?"+":""}{trend}%</span>}
        </div>
        <div style={{fontSize:24,fontWeight:800,color:C.text,letterSpacing:-0.5,lineHeight:1}}>{value}</div>
        <div style={{fontSize:12,fontWeight:600,color:C.muted,marginTop:4}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:C.light,marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );
}

function Badge({children,color="green"}) {
  const m = {green:{bg:C.greenL,c:C.green2},amber:{bg:C.amberL,c:C.amber},red:{bg:C.redL,c:C.red},blue:{bg:C.blueL,c:C.blue},navy:{bg:"#EFF3FB",c:C.navy3},purple:{bg:C.purpleL,c:C.purple}};
  const s = m[color]||m.green;
  return <span style={{background:s.bg,color:s.c,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,whiteSpace:"nowrap"}}>{children}</span>;
}

function PageTitle({title,sub,action}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:800,color:C.text,margin:"0 0 4px",letterSpacing:-0.5}}>{title}</h1>
        {sub&&<p style={{color:C.muted,fontSize:13,margin:0}}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function BtnPrimary({children,onClick,disabled,icon}) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{background:disabled?C.light:C.green,color:"#FFF",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6,transition:"background 0.15s",boxShadow:disabled?"none":"0 2px 12px rgba(5,150,105,0.3)"}}>
      {icon&&<span>{icon}</span>}{children}
    </button>
  );
}

function BtnSecondary({children,onClick,icon}) {
  return (
    <button onClick={onClick}
      style={{background:C.white,color:C.muted,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:6}}>
      {icon&&<span>{icon}</span>}{children}
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
// 🔐  PAGE CONNEXION
// ════════════════════════════════════════════════════════════════
function AuthPage({onLogin}) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPw,   setShowPw]   = useState(false);
  const [tab,      setTab]      = useState("login"); // login | comptes

  const handleLogin = async () => {
    setError(""); setLoading(true);
    await new Promise(r=>setTimeout(r,500));
    const u = USERS.find(u=>u.email.toLowerCase()===email.toLowerCase().trim()&&u.password===password.trim());
    if(u) onLogin(u);
    else setError("Email ou mot de passe incorrect. Vérifiez vos identifiants.");
    setLoading(false);
  };

  const inp = {width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border 0.15s",background:"#FAFAFA"};

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.sidebar} 0%,${C.navy3} 60%,#0D4A2E 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:460}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:68,height:68,borderRadius:18,background:C.green,marginBottom:14,boxShadow:"0 8px 32px rgba(5,150,105,0.45)"}}>
            <span style={{fontSize:34}}>💊</span>
          </div>
          <h1 style={{color:"#FFF",fontSize:20,fontWeight:800,margin:"0 0 4px",letterSpacing:-0.3}}>LabPro Pharma RDC Sarl</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:13,margin:0}}>Système de Rapport des Ventes Journalières</p>
        </div>

        {/* Card */}
        <div style={{background:C.white,borderRadius:20,overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,0.45)"}}>
          {/* Tabs */}
          <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
            {[["login","🔑 Connexion"],["comptes","👥 Comptes"]].map(([id,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"14px",border:"none",background:tab===id?C.white:"#F8FAFC",color:tab===id?C.green:C.muted,fontWeight:tab===id?700:500,fontSize:13,cursor:"pointer",fontFamily:"inherit",borderBottom:tab===id?`2px solid ${C.green}`:"2px solid transparent",transition:"all 0.15s"}}>{label}</button>
            ))}
          </div>

          <div style={{padding:32}}>
            {tab==="login"&&(
              <div>
                <div style={{marginBottom:16}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Email professionnel</label>
                  <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} type="email" placeholder="prenom.nom@labpro.cd"
                    style={inp} onFocus={e=>e.target.style.border=`1.5px solid ${C.green}`} onBlur={e=>e.target.style.border=`1.5px solid ${C.border}`}/>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Mot de passe</label>
                  <div style={{position:"relative"}}>
                    <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} type={showPw?"text":"password"} placeholder="••••••••"
                      style={{...inp,paddingRight:42}} onFocus={e=>e.target.style.border=`1.5px solid ${C.green}`} onBlur={e=>e.target.style.border=`1.5px solid ${C.border}`}/>
                    <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",fontSize:16,color:C.light}}>{showPw?"🙈":"👁"}</button>
                  </div>
                </div>
                {error&&<div style={{background:C.redL,border:`1px solid #FCA5A5`,borderRadius:8,padding:"10px 14px",fontSize:13,color:C.red,marginBottom:16}}>⚠️ {error}</div>}
                <button onClick={handleLogin} disabled={loading} style={{width:"100%",background:loading?C.light:C.green,color:"#FFF",border:"none",borderRadius:10,padding:"13px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",boxShadow:loading?"none":"0 4px 16px rgba(5,150,105,0.35)",transition:"all 0.15s"}}>
                  {loading?"⏳ Connexion en cours...":"Se connecter →"}
                </button>
              </div>
            )}

            {tab==="comptes"&&(
              <div>
                <p style={{fontSize:12,color:C.muted,marginBottom:14}}>Cliquez sur un compte pour remplir automatiquement les champs de connexion.</p>
                <div style={{maxHeight:340,overflowY:"auto"}}>
                  {USERS.map(u=>(
                    <div key={u.id} onClick={()=>{setEmail(u.email);setPassword(u.password);setTab("login");}}
                      style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 12px",borderRadius:8,marginBottom:4,cursor:"pointer",border:`1px solid ${C.border}`,transition:"all 0.1s"}}
                      onMouseEnter={e=>{e.currentTarget.style.background=C.greenL;e.currentTarget.style.borderColor="#A7F3D0";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.border;}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:32,height:32,borderRadius:"50%",background:ROLE_COLOR[u.role]||C.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:11,fontWeight:700,flexShrink:0}}>
                          {(u.prenom[0]+(u.nom[0]||"")).toUpperCase()}
                        </div>
                        <div>
                          <div style={{fontSize:12,fontWeight:700,color:C.text}}>{u.prenom} {u.nom}</div>
                          <div style={{fontSize:11,color:C.light}}>{u.email}</div>
                        </div>
                      </div>
                      <Badge color={u.role==="directeur"?"navy":u.role==="superviseur"?"purple":u.role==="comptable"?"amber":"green"}>
                        {u.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:16}}>LabPro Pharma RDC Sarl · v2.0 · 2025</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 📐  SIDEBAR
// ════════════════════════════════════════════════════════════════
const NAV = {
  delegue:     [{id:"rapport",icon:"📝",label:"Nouveau rapport"},{id:"historique",icon:"📋",label:"Mes rapports"}],
  superviseur: [{id:"dashboard",icon:"📊",label:"Tableau de bord"},{id:"rapports",icon:"📋",label:"Tous les rapports"},{id:"classement",icon:"🏆",label:"Classement"}],
  directeur:   [{id:"dashboard",icon:"📊",label:"Tableau de bord"},{id:"rapports",icon:"📋",label:"Tous les rapports"},{id:"hebdo",icon:"📅",label:"Rapport hebdomadaire"},{id:"mensuel",icon:"🗓",label:"Rapport mensuel"},{id:"classement",icon:"🏆",label:"Classement délégués"}],
  comptable:   [{id:"dashboard_c",icon:"📊",label:"Tableau de bord"},{id:"rapports_c",icon:"📋",label:"Rapports reçus"}],
};

function Sidebar({user,view,setView,onLogout}) {
  const navItems = NAV[user.role]||NAV.delegue;
  return (
    <div style={{width:240,background:C.sidebar,display:"flex",flexDirection:"column",height:"100vh",position:"fixed",left:0,top:0,zIndex:100,boxShadow:"4px 0 24px rgba(0,0,0,0.3)"}}>
      {/* Logo */}
      <div style={{padding:"22px 20px 18px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:12,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>💊</div>
          <div>
            <div style={{color:"#FFF",fontSize:13,fontWeight:800,lineHeight:1.2,letterSpacing:-0.3}}>LabPro Pharma</div>
            <div style={{color:"rgba(255,255,255,0.35)",fontSize:10,letterSpacing:0.5}}>RDC Sarl · Sales</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:ROLE_COLOR[user.role]||C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#FFF",flexShrink:0}}>
            {(user.prenom[0]+(user.nom[0]||"")).toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:"#FFF",fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.prenom} {user.nom.split(" ")[0]}</div>
            <div style={{fontSize:9,padding:"1px 7px",borderRadius:999,background:ROLE_COLOR[user.role]||C.green,color:"#FFF",display:"inline-block",marginTop:3,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>{user.role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.25)",fontWeight:700,letterSpacing:2,textTransform:"uppercase",padding:"8px 10px 6px"}}>Menu</div>
        {navItems.map(item=>{
          const active=view===item.id;
          return (
            <div key={item.id} onClick={()=>setView(item.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,marginBottom:2,cursor:"pointer",background:active?"rgba(5,150,105,0.2)":"transparent",borderLeft:active?"3px solid #059669":"3px solid transparent",color:active?"#6EE7B7":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:active?700:400,transition:"all 0.12s"}}
              onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.05)";}}
              onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:15,width:20,textAlign:"center"}}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{padding:"10px 10px 18px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div onClick={onLogout}
          style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,cursor:"pointer",color:"rgba(255,255,255,0.35)",fontSize:13,transition:"all 0.12s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#FCA5A5";e.currentTarget.style.background="rgba(220,38,38,0.1)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.35)";e.currentTarget.style.background="transparent";}}>
          <span style={{fontSize:15}}>🚪</span><span>Déconnexion</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 📝  NOUVEAU RAPPORT (DÉLÉGUÉ)
// ════════════════════════════════════════════════════════════════
function NouveauRapport({user}) {
  const [secteurs, setSecteurs] = useState("");
  const [lignes,   setLignes]   = useState([newRow()]);
  const [done,     setDone]     = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [gpsId,    setGpsId]    = useState(null);

  const totalCA   = lignes.reduce((s,l)=>s+(l.montant||0),0);
  const nbClients = lignes.filter(l=>l.client.trim()).length;
  const nbVentes  = lignes.filter(l=>l.code).length;

  const updateRow = (id,field,val) => {
    setLignes(prev=>prev.map(r=>{
      if(r.id!==id) return r;
      const u={...r,[field]:val};
      if(field==="code"){const p=PRODUITS.find(p=>p.code===val);if(p){u.item=p.item;u.prix=p.prix;u.montant=p.prix*(u.qte||1);}}
      if(field==="qte"||field==="prix") u.montant=(parseFloat(u.prix)||0)*(parseFloat(u.qte)||0);
      return u;
    }));
  };

  const captureGPS = (id) => {
    setGpsId(id);
    if(!navigator.geolocation){alert("GPS non disponible sur cet appareil.");setGpsId(null);return;}
    navigator.geolocation.getCurrentPosition(
      pos=>{updateRow(id,"lat",pos.coords.latitude.toFixed(6));updateRow(id,"lng",pos.coords.longitude.toFixed(6));setGpsId(null);},
      ()=>{alert("Impossible d'obtenir la position GPS. Vérifiez les autorisations.");setGpsId(null);}
    );
  };

  const handleSubmit = async () => {
    if(!secteurs.trim()){alert("⚠️ Veuillez indiquer les secteurs visités.");return;}
    const valid=lignes.filter(l=>l.code&&l.client);
    if(!valid.length){alert("⚠️ Ajoutez au moins une vente avec produit et client.");return;}
    setSaving(true);
    await new Promise(r=>setTimeout(r,700));
    const rapport={
      id:Date.now().toString(),delegueId:user.id,num:user.num,
      nom:user.nom,prenom:user.prenom,date:todayISO(),
      secteurs,lignes:valid,totalCA,nbClients,nbVentes,
      soumis:new Date().toISOString(),
    };
    const all=loadReports();all.push(rapport);saveReports(all);
    await exportExcel(rapport);
    setSaving(false);setDone(true);
  };

  if(done) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:20,padding:48,textAlign:"center",maxWidth:500}}>
        <div style={{fontSize:64,marginBottom:16}}>✅</div>
        <h2 style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:12}}>Rapport soumis avec succès !</h2>
        <div style={{background:C.greenL,borderRadius:12,padding:"14px 20px",marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div><div style={{fontSize:20,fontWeight:800,color:C.green}}>{nbVentes}</div><div style={{fontSize:11,color:C.muted}}>Ventes</div></div>
          <div><div style={{fontSize:20,fontWeight:800,color:C.green}}>{nbClients}</div><div style={{fontSize:11,color:C.muted}}>Clients</div></div>
          <div><div style={{fontSize:20,fontWeight:800,color:C.green}}>${fmt(totalCA)}</div><div style={{fontSize:11,color:C.muted}}>CA Total</div></div>
        </div>
        <p style={{color:C.muted,fontSize:13,marginBottom:24}}>📧 Fichier Excel téléchargé · Email envoyé au Directeur et Comptable</p>
        <BtnPrimary onClick={()=>{setDone(false);setLignes([newRow()]);setSecteurs("");}}>📝 Nouveau rapport</BtnPrimary>
      </div>
    </div>
  );

  const th={padding:"10px 9px",fontSize:10,fontWeight:700,color:C.muted,textAlign:"left",borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5,whiteSpace:"nowrap",background:C.bg};
  const td={padding:"7px 8px",verticalAlign:"middle"};
  const inp={border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 9px",fontSize:12,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box",background:"#FAFAFA"};

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      {/* Header banner */}
      <div style={{background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`,borderRadius:16,padding:"22px 28px",marginBottom:22,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-40,top:-40,width:220,height:220,borderRadius:"50%",background:"rgba(5,150,105,0.07)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Rapport des Ventes Journalières</div>
            <h1 style={{color:"#FFF",fontSize:18,fontWeight:800,margin:"0 0 4px",letterSpacing:-0.3}}>LabPro Pharma RDC Sarl</h1>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,margin:0}}>{user.genre==="F"?"Déléguée":"Délégué"} N°{user.num} · {user.prenom} {user.nom}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:10,marginBottom:2}}>Date du rapport</div>
            <div style={{color:"#FFF",fontSize:13,fontWeight:600}}>{todayFR()}</div>
          </div>
        </div>
      </div>

      {/* Info zone */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 22px",marginBottom:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.5fr",gap:20,alignItems:"end"}}>
          {[["Agent","N° "+user.num+" · "+user.prenom+" "+user.nom],["Date",new Date().toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})]].map(([l,v])=>(
            <div key={l}>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{l}</div>
              <div style={{fontSize:13,fontWeight:600,color:C.text,background:C.bg,borderRadius:8,padding:"9px 12px"}}>{v}</div>
            </div>
          ))}
          <div>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Secteurs / Zones visités *</div>
            <input value={secteurs} onChange={e=>setSecteurs(e.target.value)} placeholder="Ex : Gombe, Lingwala, Barumbu, Kinshasa-Centre..."
              style={{...inp,padding:"9px 12px",fontSize:13}}/>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:16}}>
        <StatCard icon="📦" label="Lignes de vente" value={nbVentes} color={C.blue}/>
        <StatCard icon="👥" label="Clients visités" value={nbClients} color={C.green}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>

      {/* Table */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:16}}>
        <div style={{padding:"13px 18px",background:C.navy,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h3 style={{color:"#FFF",fontSize:14,fontWeight:700,margin:0}}>📊 Tableau des Ventes</h3>
          <BtnPrimary onClick={()=>setLignes(p=>[...p,newRow()])} icon="➕">Ajouter une ligne</BtnPrimary>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:1080}}>
            <thead>
              <tr>
                {["#","CODE PRODUIT","DÉSIGNATION","QTÉ","MONTANT USD","NOM CLIENT","ADRESSE","TÉLÉPHONE","GPS",""].map((h,i)=>(
                  <th key={i} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lignes.map((row,idx)=>(
                <tr key={row.id} style={{borderBottom:`1px solid #F1F5F9`}}
                  onMouseEnter={e=>e.currentTarget.style.background="#F8FBFF"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{...td,width:28,fontSize:12,color:C.light,fontWeight:600,textAlign:"center"}}>{idx+1}</td>
                  <td style={{...td,minWidth:110}}>
                    <select value={row.code} onChange={e=>updateRow(row.id,"code",e.target.value)}
                      style={{...inp,minWidth:105,background:"#FFF",cursor:"pointer"}}>
                      <option value="">-- Choisir --</option>
                      {PRODUITS.map(p=><option key={p.code} value={p.code}>{p.code} · {p.prix}$</option>)}
                    </select>
                  </td>
                  <td style={{...td,minWidth:200}}>
                    <input value={row.item} readOnly style={{...inp,background:C.bg,color:C.muted,cursor:"default",minWidth:190}} placeholder="Auto-rempli"/>
                  </td>
                  <td style={{...td,width:68}}>
                    <input type="number" min="1" value={row.qte} onChange={e=>updateRow(row.id,"qte",parseFloat(e.target.value)||1)}
                      style={{...inp,width:60,textAlign:"center"}}/>
                  </td>
                  <td style={{...td,width:120}}>
                    <div style={{fontSize:14,fontWeight:700,color:row.montant>0?C.green:C.light,background:row.montant>0?C.greenL:C.bg,borderRadius:7,padding:"6px 10px",textAlign:"right",minWidth:100}}>
                      {row.montant>0?`${fmt(row.montant)} $`:"—"}
                    </div>
                  </td>
                  <td style={{...td,minWidth:150}}>
                    <input value={row.client} onChange={e=>updateRow(row.id,"client",e.target.value)} placeholder="Nom du client *" style={inp}/>
                  </td>
                  <td style={{...td,minWidth:140}}>
                    <input value={row.adresse} onChange={e=>updateRow(row.id,"adresse",e.target.value)} placeholder="Adresse / Quartier" style={inp}/>
                  </td>
                  <td style={{...td,minWidth:120}}>
                    <input value={row.tel} onChange={e=>updateRow(row.id,"tel",e.target.value)} placeholder="+243 ..." style={inp}/>
                  </td>
                  <td style={{...td,minWidth:120}}>
                    {row.lat
                      ? <div style={{fontSize:10,color:C.green,fontWeight:600,lineHeight:1.4}}>📍{row.lat}<br/>{row.lng}</div>
                      : <button onClick={()=>captureGPS(row.id)} style={{background:C.blueL,color:C.blue,border:`1px solid #BFDBFE`,borderRadius:7,padding:"5px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"}}>
                          {gpsId===row.id?"⏳ GPS...":"📍 Capturer"}
                        </button>
                    }
                  </td>
                  <td style={{...td,width:34}}>
                    {lignes.length>1&&(
                      <button onClick={()=>setLignes(p=>p.filter(r=>r.id!==row.id))}
                        style={{background:C.redL,border:"none",color:C.red,borderRadius:7,width:28,height:28,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{background:"#F0FDF4",borderTop:`2px solid #A7F3D0`}}>
                <td colSpan={4} style={{padding:"13px 10px",fontSize:13,fontWeight:700,color:C.text}}>TOTAL CHIFFRE D'AFFAIRES JOURNALIER</td>
                <td style={{padding:"13px 10px",fontSize:17,fontWeight:800,color:C.green}}>{fmt(totalCA)} USD</td>
                <td colSpan={5} style={{padding:"13px 10px",fontSize:12,color:C.muted}}>{nbClients} client(s) · {nbVentes} vente(s)</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div style={{display:"flex",justifyContent:"flex-end",gap:12,paddingBottom:24}}>
        <BtnSecondary onClick={()=>setLignes([newRow()])} icon="🔄">Réinitialiser</BtnSecondary>
        <BtnPrimary onClick={handleSubmit} disabled={saving} icon={saving?"⏳":"📤"}>
          {saving?"Envoi en cours...":"Soumettre et envoyer par Email"}
        </BtnPrimary>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 📋  HISTORIQUE DÉLÉGUÉ
// ════════════════════════════════════════════════════════════════
function HistoriqueDelegue({user}) {
  const all = loadReports().filter(r=>r.delegueId===user.id).sort((a,b)=>b.date.localeCompare(a.date));
  const totalCA  = all.reduce((s,r)=>s+(r.totalCA||0),0);
  const totalVte = all.reduce((s,r)=>s+(r.nbVentes||0),0);

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📋 Mes Rapports soumis" sub={`${user.prenom} ${user.nom} · N°${user.num}`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard icon="📄" label="Rapports soumis" value={all.length} color={C.blue}/>
        <StatCard icon="🛍" label="Total ventes" value={totalVte} color={C.green}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>
      {!all.length
        ? <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:56,textAlign:"center",color:C.muted}}>Aucun rapport soumis pour l'instant.</div>
        : <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.bg}}>
                {["Date","Secteurs visités","Ventes","Clients","CA (USD)","Actions"].map(h=>(
                  <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{all.map(r=>(
                <tr key={r.id} style={{borderBottom:`1px solid ${C.border}`}}
                  onMouseEnter={e=>e.currentTarget.style.background="#F8FBFF"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"12px 16px",fontSize:13,fontWeight:600,color:C.text}}>{r.date}</td>
                  <td style={{padding:"12px 16px",fontSize:12,color:C.muted,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td>
                  <td style={{padding:"12px 16px"}}><Badge color="blue">{r.nbVentes||r.lignes?.length||0}</Badge></td>
                  <td style={{padding:"12px 16px"}}><Badge color="green">{r.nbClients}</Badge></td>
                  <td style={{padding:"12px 16px",fontSize:14,fontWeight:800,color:C.green}}>{fmt(r.totalCA)} $</td>
                  <td style={{padding:"12px 16px"}}>
                    <button onClick={()=>exportExcel(r)} style={{background:C.greenL,color:C.green2,border:`1px solid #A7F3D0`,borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⬇ Excel</button>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
      }
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 📊  DASHBOARD (Directeur, Superviseur, Comptable)
// ════════════════════════════════════════════════════════════════
function Dashboard({user}) {
  const all = loadReports();
  const now = new Date();
  const month = now.getMonth();
  const week  = new Date(); week.setDate(week.getDate()-7);

  const todayR  = all.filter(r=>r.date===todayISO());
  const weekR   = all.filter(r=>new Date(r.date)>=week);
  const monthR  = all.filter(r=>new Date(r.date).getMonth()===month);
  const totalCA = all.reduce((s,r)=>s+(r.totalCA||0),0);
  const monthCA = monthR.reduce((s,r)=>s+(r.totalCA||0),0);

  const delegues = USERS.filter(u=>u.role==="delegue");
  const actifAujd = [...new Set(todayR.map(r=>r.delegueId))].length;

  // CA par délégué (top 8)
  const byDel = {};
  all.forEach(r=>{const k=`${r.prenom} ${r.nom.split(" ")[0]}`;byDel[k]=(byDel[k]||0)+(r.totalCA||0);});
  const barData = Object.entries(byDel).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,ca])=>({name,ca:parseFloat(ca.toFixed(2))}));

  // Trend 7 jours
  const trendData = Array.from({length:7},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-6+i);
    const iso=d.toISOString().split("T")[0];
    const ca=all.filter(r=>r.date===iso).reduce((s,r)=>s+(r.totalCA||0),0);
    return {jour:d.toLocaleDateString("fr-FR",{weekday:"short"}),ca:parseFloat(ca.toFixed(2))};
  });

  // Top produits
  const pcount={};
  all.forEach(r=>r.lignes?.forEach(l=>{pcount[l.code]=(pcount[l.code]||0)+(l.qte||0);}));
  const pieData=Object.entries(pcount).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:20,fontWeight:800,color:C.text,margin:"0 0 3px",letterSpacing:-0.5}}>Tableau de bord commercial</h1>
        <p style={{color:C.muted,fontSize:12,margin:0}}>LabPro Pharma RDC · {todayFR()} · {ROLE_LABEL[user.role]}</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard icon="📊" label="Rapports aujourd'hui" value={todayR.length} sub={`${actifAujd}/${delegues.length} délégués actifs`} color={C.blue}/>
        <StatCard icon="📅" label="Rapports ce mois" value={monthR.length} color={C.navy3}/>
        <StatCard icon="💰" label="CA mensuel (USD)" value={`$${fmt(monthCA)}`} color={C.green}/>
        <StatCard icon="🏆" label="CA global (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18,marginBottom:18}}>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:20}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.text,margin:"0 0 16px"}}>📈 Évolution CA — 7 derniers jours</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
              <XAxis dataKey="jour" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.muted}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={v=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
              <Line type="monotone" dataKey="ca" stroke={C.green} strokeWidth={2.5} dot={{r:4,fill:C.green}} activeDot={{r:6}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:20}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.text,margin:"0 0 16px"}}>🧪 Top produits vendus</h3>
          {pieData.length
            ? <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value">
                    {pieData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:11}}/>
                  <Legend wrapperStyle={{fontSize:11}}/>
                </PieChart>
              </ResponsiveContainer>
            : <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13}}>Aucune donnée</div>
          }
        </div>
      </div>

      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:20}}>
        <h3 style={{fontSize:14,fontWeight:700,color:C.text,margin:"0 0 16px"}}>👥 CA par délégué (tous les rapports)</h3>
        {barData.length
          ? <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="name" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:C.muted}} axisLine={false} tickLine={false}/>
                <Tooltip formatter={v=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
                <Bar dataKey="ca" fill={C.green} radius={[6,6,0,0]} label={{position:"top",fontSize:10,fill:C.muted,formatter:v=>v>0?`$${v}`:""}}/>
              </BarChart>
            </ResponsiveContainer>
          : <div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13}}>Aucun rapport enregistré pour le moment.</div>
        }
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 📋  TOUS LES RAPPORTS
// ════════════════════════════════════════════════════════════════
function TousLesRapports() {
  const [search,   setSearch]   = useState("");
  const [dateF,    setDateF]    = useState("");
  const [delF,     setDelF]     = useState("");
  const [expanded, setExpanded] = useState(null);

  const all = loadReports();
  const filtered = all.filter(r=>{
    const q=search.toLowerCase();
    const matchTxt=!search||`${r.prenom} ${r.nom} ${r.secteurs}`.toLowerCase().includes(q)||r.lignes?.some(l=>l.client.toLowerCase().includes(q));
    const matchDate=!dateF||r.date===dateF;
    const matchDel=!delF||r.delegueId===delF;
    return matchTxt&&matchDate&&matchDel;
  }).sort((a,b)=>b.date.localeCompare(a.date));

  const delegues = USERS.filter(u=>u.role==="delegue");

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📋 Tous les rapports journaliers" sub={`${filtered.length} rapport(s) · LabPro Pharma RDC`}
        action={<BtnPrimary onClick={()=>exportExcelCompil(filtered,"Tous Rapports")} icon="⬇">Exporter Excel</BtnPrimary>}/>

      {/* Filtres */}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:10,marginBottom:18,alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.light,fontSize:14}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par délégué, secteur, client..."
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px 9px 36px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#FAFAFA"}}/>
        </div>
        <select value={delF} onChange={e=>setDelF(e.target.value)} style={{border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",background:"#FAFAFA"}}>
          <option value="">Tous les délégués</option>
          {delegues.map(u=><option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
        </select>
        <input type="date" value={dateF} onChange={e=>setDateF(e.target.value)} style={{border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",background:"#FAFAFA"}}/>
        {(search||dateF||delF)&&<BtnSecondary onClick={()=>{setSearch("");setDateF("");setDelF("");}}>✕ Effacer</BtnSecondary>}
      </div>

      {!filtered.length
        ? <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:56,textAlign:"center",color:C.muted}}>Aucun rapport trouvé.</div>
        : <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.bg}}>
                {["Délégué","N°","Date","Secteurs","Ventes","Clients","CA (USD)","Actions"].map(h=>(
                  <th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map(r=>(
                  <tr key={r.id+"_tr"} style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}
                    onClick={()=>setExpanded(expanded===r.id?null:r.id)}
                    onMouseEnter={e=>e.currentTarget.style.background="#F8FBFF"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:700,flexShrink:0}}>
                          {(r.prenom[0]+r.nom[0]).toUpperCase()}
                        </div>
                        <span style={{fontSize:12,fontWeight:700,color:C.text}}>{r.prenom} {r.nom}</span>
                      </div>
                    </td>
                    <td style={{padding:"11px 14px"}}><Badge color="navy">{r.num||"—"}</Badge></td>
                    <td style={{padding:"11px 14px",fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>{r.date}</td>
                    <td style={{padding:"11px 14px",fontSize:11,color:C.muted,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td>
                    <td style={{padding:"11px 14px"}}><Badge color="blue">{r.nbVentes||r.lignes?.length||0}</Badge></td>
                    <td style={{padding:"11px 14px"}}><Badge color="green">{r.nbClients}</Badge></td>
                    <td style={{padding:"11px 14px",fontSize:13,fontWeight:800,color:C.green}}>{fmt(r.totalCA)} $</td>
                    <td style={{padding:"11px 14px"}}>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        <button onClick={e=>{e.stopPropagation();exportExcel(r);}} style={{background:C.greenL,color:C.green2,border:`1px solid #A7F3D0`,borderRadius:7,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⬇ XLS</button>
                        <span style={{color:C.light,fontSize:14}}>{expanded===r.id?"▲":"▼"}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.filter(r=>r.id===expanded).map(r=>(
                  <tr key={r.id+"_exp"}><td colSpan={8} style={{padding:0}}>
                    <div style={{background:"#F8FAFC",padding:"14px 18px",borderBottom:`2px solid ${C.border}`}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                        <thead><tr>
                          {["Code","Item","Qté","Montant $","Client","Adresse","Tél","GPS"].map(h=>(
                            <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`,textTransform:"uppercase"}}>{h}</th>
                          ))}
                        </tr></thead>
                        <tbody>{(r.lignes||[]).map((l,i)=>(
                          <tr key={i} style={{borderBottom:`1px solid #F0F4F8`}}>
                            <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:700,color:C.navy3}}>{l.code}</td>
                            <td style={{padding:"7px 10px"}}>{l.item}</td>
                            <td style={{padding:"7px 10px",textAlign:"center",fontWeight:600}}>{l.qte}</td>
                            <td style={{padding:"7px 10px",fontWeight:700,color:C.green}}>{fmt(l.montant)}$</td>
                            <td style={{padding:"7px 10px",fontWeight:500}}>{l.client}</td>
                            <td style={{padding:"7px 10px",color:C.muted}}>{l.adresse}</td>
                            <td style={{padding:"7px 10px",color:C.muted}}>{l.tel}</td>
                            <td style={{padding:"7px 10px",fontSize:10,color:C.blue}}>{l.lat&&l.lng?`${l.lat}, ${l.lng}`:"—"}</td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </td></tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 🏆  CLASSEMENT
// ════════════════════════════════════════════════════════════════
function Classement() {
  const all   = loadReports();
  const month = new Date().getMonth();
  const mR    = all.filter(r=>new Date(r.date).getMonth()===month);
  const stats = {};
  mR.forEach(r=>{
    if(!stats[r.delegueId]) stats[r.delegueId]={id:r.delegueId,nom:r.nom,prenom:r.prenom,num:r.num,ca:0,ventes:0,clients:0,jours:new Set()};
    stats[r.delegueId].ca+=(r.totalCA||0);
    stats[r.delegueId].ventes+=(r.nbVentes||r.lignes?.length||0);
    stats[r.delegueId].clients+=(r.nbClients||0);
    stats[r.delegueId].jours.add(r.date);
  });
  const ranking=Object.values(stats).map(s=>({...s,jours:s.jours.size})).sort((a,b)=>b.ca-a.ca);
  const medals=["🥇","🥈","🥉"];
  const mColors=[C.amber,"#94A3B8","#CD7F32"];

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🏆 Classement des Délégués" sub={new Date().toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}/>
      {!ranking.length
        ? <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:56,textAlign:"center",color:C.muted}}>Aucune donnée ce mois. Les rapports soumis apparaîtront ici.</div>
        : <>
          {/* Podium */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:22}}>
            {ranking.slice(0,3).map((d,i)=>(
              <div key={i} style={{background:C.white,border:`2px solid ${mColors[i]||C.border}`,borderRadius:16,padding:24,textAlign:"center",boxShadow:i===0?"0 8px 32px rgba(217,119,6,0.15)":"none"}}>
                <div style={{fontSize:44,marginBottom:8}}>{medals[i]}</div>
                <div style={{width:50,height:50,borderRadius:"50%",background:mColors[i]||C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#FFF",margin:"0 auto 10px"}}>
                  {(d.prenom[0]+d.nom[0]).toUpperCase()}
                </div>
                <h3 style={{fontSize:14,fontWeight:800,color:C.text,margin:"0 0 4px"}}>{d.prenom}<br/>{d.nom.split(" ")[0]}</h3>
                <div style={{fontSize:22,fontWeight:800,color:mColors[i],margin:"6px 0 8px"}}>${fmt(d.ca)}</div>
                <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
                  <Badge color={i===0?"amber":"blue"}>{d.ventes} ventes</Badge>
                  <Badge color="green">{d.clients} clients</Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
            <div style={{padding:"13px 18px",background:C.navy}}><h3 style={{color:"#FFF",fontSize:14,fontWeight:700,margin:0}}>Classement général</h3></div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.bg}}>
                {["Rang","N°","Délégué(e)","CA Total (USD)","Ventes","Clients","Jours actifs","Performance"].map(h=>(
                  <th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{ranking.map((d,i)=>(
                <tr key={d.id} style={{borderBottom:`1px solid ${C.border}`,background:i===0?"#FFFBEB":"transparent"}}
                  onMouseEnter={e=>e.currentTarget.style.background=i===0?"#FEF3C7":"#F8FBFF"}
                  onMouseLeave={e=>e.currentTarget.style.background=i===0?"#FFFBEB":"transparent"}>
                  <td style={{padding:"13px 14px",fontSize:22}}>{medals[i]||`#${i+1}`}</td>
                  <td style={{padding:"13px 14px"}}><Badge color="navy">{d.num}</Badge></td>
                  <td style={{padding:"13px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:mColors[i]||C.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:12,fontWeight:700,flexShrink:0}}>
                        {(d.prenom[0]+d.nom[0]).toUpperCase()}
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:C.text}}>{d.prenom} {d.nom}</div>
                        <div style={{fontSize:10,color:C.light}}>Délégué(e) Commercial(e)</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"13px 14px",fontSize:15,fontWeight:800,color:C.green}}>{fmt(d.ca)} $</td>
                  <td style={{padding:"13px 14px"}}><Badge color="blue">{d.ventes}</Badge></td>
                  <td style={{padding:"13px 14px"}}><Badge color="green">{d.clients}</Badge></td>
                  <td style={{padding:"13px 14px"}}><Badge color="navy">{d.jours} j</Badge></td>
                  <td style={{padding:"13px 14px",minWidth:120}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{background:C.bg,borderRadius:4,height:6,flex:1}}>
                        <div style={{background:i===0?C.amber:C.green,borderRadius:4,height:6,width:`${Math.min(100,Math.round((d.jours/22)*100))}%`,transition:"width 0.5s"}}/>
                      </div>
                      <span style={{fontSize:11,fontWeight:700,color:C.muted,minWidth:28}}>{Math.min(100,Math.round((d.jours/22)*100))}%</span>
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      }
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 📅  COMPILATION HEBDO / MENSUELLE
// ════════════════════════════════════════════════════════════════
function Compilation({type}) {
  const all = loadReports();
  const now = new Date();
  let filtered, titre;
  if(type==="hebdo"){
    const ws=new Date();ws.setDate(ws.getDate()-7);
    filtered=all.filter(r=>new Date(r.date)>=ws);
    titre=`Semaine du ${ws.toLocaleDateString("fr-FR")} au ${now.toLocaleDateString("fr-FR")}`;
  } else {
    filtered=all.filter(r=>new Date(r.date).getMonth()===now.getMonth());
    titre=now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});
  }

  const stats={};
  filtered.forEach(r=>{
    if(!stats[r.delegueId])stats[r.delegueId]={id:r.delegueId,num:r.num,prenom:r.prenom,nom:r.nom,ca:0,ventes:0,clients:0,rapports:0};
    stats[r.delegueId].ca+=(r.totalCA||0);
    stats[r.delegueId].ventes+=(r.nbVentes||r.lignes?.length||0);
    stats[r.delegueId].clients+=(r.nbClients||0);
    stats[r.delegueId].rapports++;
  });
  const rows=Object.values(stats).sort((a,b)=>b.ca-a.ca);
  const totalCA=rows.reduce((s,r)=>s+r.ca,0);
  const chartData=rows.map(r=>({name:r.prenom,ca:parseFloat(r.ca.toFixed(2)),ventes:r.ventes}));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title={type==="hebdo"?"📅 Rapport Hebdomadaire":"🗓 Rapport Mensuel"} sub={titre}
        action={<BtnPrimary onClick={()=>exportExcelCompil(filtered,titre)} icon="⬇">Exporter Excel</BtnPrimary>}/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard icon="📊" label="Rapports soumis" value={filtered.length} color={C.blue}/>
        <StatCard icon="👥" label="Délégués actifs" value={rows.length} sub={`/ ${USERS.filter(u=>u.role==="delegue").length} total`} color={C.navy3}/>
        <StatCard icon="🛍" label="Total ventes" value={rows.reduce((s,r)=>s+r.ventes,0)} color={C.green}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>

      {chartData.length>0&&(
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:18}}>
          <h3 style={{fontSize:14,fontWeight:700,color:C.text,margin:"0 0 16px"}}>📊 Performance comparée des délégués</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={38}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.muted}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v,n)=>[n==="ca"?`$${fmt(v)}`:v,n==="ca"?"CA USD":"Ventes"]} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
              <Legend wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="ca"     name="CA (USD)"  fill={C.green}  radius={[5,5,0,0]}/>
              <Bar dataKey="ventes" name="Nb ventes" fill={C.blue}   radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
        <div style={{padding:"13px 18px",background:C.navy}}><h3 style={{color:"#FFF",fontSize:14,fontWeight:700,margin:0}}>Récapitulatif par délégué</h3></div>
        {!rows.length
          ? <div style={{padding:48,textAlign:"center",color:C.muted}}>Aucune donnée pour cette période.</div>
          : <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:C.bg}}>
                {["Rang","N°","Délégué(e)","Rapports","Ventes","Clients","CA Total (USD)","Part (%)"].map(h=>(
                  <th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {rows.map((r,i)=>{
                  const pct=totalCA>0?Math.round((r.ca/totalCA)*100):0;
                  return (
                    <tr key={r.id} style={{borderBottom:`1px solid ${C.border}`}}
                      onMouseEnter={e=>e.currentTarget.style.background="#F8FBFF"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{padding:"12px 14px",fontWeight:700,color:C.muted}}>#{i+1}</td>
                      <td style={{padding:"12px 14px"}}><Badge color="navy">{r.num||"—"}</Badge></td>
                      <td style={{padding:"12px 14px",fontSize:13,fontWeight:700,color:C.text}}>{r.prenom} {r.nom}</td>
                      <td style={{padding:"12px 14px"}}><Badge color="navy">{r.rapports}</Badge></td>
                      <td style={{padding:"12px 14px"}}><Badge color="blue">{r.ventes}</Badge></td>
                      <td style={{padding:"12px 14px"}}><Badge color="green">{r.clients}</Badge></td>
                      <td style={{padding:"12px 14px",fontSize:14,fontWeight:800,color:C.green}}>{fmt(r.ca)} $</td>
                      <td style={{padding:"12px 14px",minWidth:120}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{background:C.bg,borderRadius:4,height:6,flex:1}}>
                            <div style={{background:C.green,borderRadius:4,height:6,width:`${pct}%`}}/>
                          </div>
                          <span style={{fontSize:12,fontWeight:700,color:C.muted,minWidth:28}}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{background:"#F0FDF4",borderTop:`2px solid #A7F3D0`}}>
                  <td colSpan={6} style={{padding:"12px 14px",fontSize:13,fontWeight:700,color:C.text}}>TOTAL GÉNÉRAL</td>
                  <td style={{padding:"12px 14px",fontSize:15,fontWeight:800,color:C.green}}>{fmt(totalCA)} USD</td>
                  <td style={{padding:"12px 14px",fontSize:12,fontWeight:700,color:C.muted}}>100%</td>
                </tr>
              </tfoot>
            </table>
        }
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 🏠  APP ROOT
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [user,    setUser]    = useState(null);
  const [view,    setView]    = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Inter',system-ui,sans-serif;background:#F1F5F9;-webkit-font-smoothing:antialiased;}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:#F1F5F9}
      ::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}
      @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    `;
    document.head.appendChild(style);
    const saved=loadUser();
    if(saved){setUser(saved);setView(defaultView(saved.role));}
    setLoading(false);
    return ()=>document.head.removeChild(style);
  },[]);

  const defaultView=(role)=>{
    if(role==="delegue") return "rapport";
    if(role==="comptable") return "dashboard_c";
    return "dashboard";
  };

  const handleLogin=(u)=>{setUser(u);saveUser(u);setView(defaultView(u.role));};
  const handleLogout=()=>{setUser(null);clearUser();setView("");};

  if(loading) return (
    <div style={{minHeight:"100vh",background:C.sidebar,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>💊</div>
        <div style={{color:"rgba(255,255,255,0.4)",fontSize:14}}>Chargement...</div>
      </div>
    </div>
  );

  if(!user) return <AuthPage onLogin={handleLogin}/>;

  const renderView=()=>{
    switch(view){
      case "rapport":      return <NouveauRapport user={user}/>;
      case "historique":   return <HistoriqueDelegue user={user}/>;
      case "dashboard":
      case "dashboard_c":  return <Dashboard user={user}/>;
      case "rapports":
      case "rapports_c":   return <TousLesRapports/>;
      case "hebdo":        return <Compilation type="hebdo"/>;
      case "mensuel":      return <Compilation type="mensuel"/>;
      case "classement":   return <Classement/>;
      default:             return <Dashboard user={user}/>;
    }
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"'Inter',system-ui,sans-serif"}}>
      <Sidebar user={user} view={view} setView={setView} onLogout={handleLogout}/>
      <main style={{flex:1,marginLeft:240,padding:"28px 32px",minHeight:"100vh",overflowX:"hidden",background:C.bg}}>
        {renderView()}
      </main>
    </div>
  );
}
