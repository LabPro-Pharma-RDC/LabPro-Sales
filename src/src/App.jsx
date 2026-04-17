import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ════════════════════════════════════════════════════════
// ⚙️  CONFIG — Remplace par ton nouveau projet Supabase
// ════════════════════════════════════════════════════════
const SUPABASE_URL = "https://kqpynncftodfulfjdgqv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxcHlubmNmdG9kZnVsZmpkZ3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MzAzMjUsImV4cCI6MjA5MjAwNjMyNX0.6ZlI5HpmRU4aBbUMvCG1qMy4zxCmHuChRgD4ba2CVYA";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EMAIL_DIRECTEUR = "directeur@labpropharma.com";
const EMAIL_COMPTABLE  = "comptable@labpropharma.com";

// ════════════════════════════════════════════════════════
// 🧪 BASE DE DONNÉES PRODUITS
// ════════════════════════════════════════════════════════
const PRODUITS = [
  {code:"Glu",    item:"Glucomètre",                  prix:25},
  {code:"GluEx",  item:"Glucomètre Ex",                prix:25},
  {code:"TMPt",   item:"Tensiomètre",                  prix:50},
  {code:"TMGd",   item:"Tensiomètre",                  prix:50},
  {code:"B30",    item:"Bandelette 30 pcs",             prix:10},
  {code:"B50",    item:"Bandelette 50 pcs",             prix:15},
  {code:"B60",    item:"Bandelette 60 pcs",             prix:20},
  {code:"B60Ex",  item:"Bandelette 60 pcs Ex",          prix:20},
  {code:"B120",   item:"Bandelette 120 pcs",            prix:36},
  {code:"B120x",  item:"Bandelette 120 pcs",            prix:36},
  {code:"TDR HepB",item:"Test rapide Hépatite B",       prix:20},
  {code:"TDR Typh",item:"Test rapide Typhoïde",         prix:20},
  {code:"TDR Syph",item:"Test rapide Syphilis",         prix:20},
  {code:"TDR Chla",item:"Test rapide Chlamydia",        prix:25},
  {code:"TDR HP",  item:"Test rapide Helicobacter Pylori",prix:18},
  {code:"HbA1C",  item:"Analyseur HbA1C",              prix:2000},
  {code:"HbA1C Rx",item:"Réactif HbA1C",               prix:100},
  {code:"GtExam", item:"Gants d'examen nitrile",        prix:3.5},
  {code:"Gtst",   item:"Gants chirurgicaux stériles",   prix:10.5},
  {code:"Cot50g", item:"Coton absorbant 50g",           prix:3.04},
  {code:"Cot100g",item:"Coton absorbant 100g",          prix:7.2},
  {code:"Cot250g",item:"Coton absorbant 250g",          prix:2.72},
  {code:"Cot500g",item:"Coton absorbant 500g",          prix:9.576},
  {code:"SyrU100",item:"Seringue insuline U-100",       prix:6.0},
  {code:"SyrU40", item:"Seringue insuline U-40",        prix:6.3},
  {code:"Syr2cc", item:"Seringue 2 ml",                 prix:2.5},
  {code:"Syr5cc", item:"Seringue 5 ml",                 prix:2.6},
  {code:"Syr10cc",item:"Seringue 10 ml",                prix:4.0},
  {code:"Cat18",  item:"Cathéter IV 18",                prix:4.25},
  {code:"Cat20",  item:"Cathéter IV 20",                prix:4.25},
  {code:"Cat22",  item:"Cathéter IV 22",                prix:4.85},
  {code:"Cat24",  item:"Cathéter IV 24",                prix:5.1},
  {code:"EpiG21", item:"Epicrânien G21",                prix:2.76},
  {code:"EpiG23", item:"Epicrânien G23",                prix:2.76},
  {code:"PheUr",  item:"Poche urine 2000 ml",           prix:0.236},
  {code:"Snd16",  item:"Sonde urinaire 16",             prix:6.38},
  {code:"Snd18",  item:"Sonde urinaire 18",             prix:6.38},
  {code:"Snd22",  item:"Sonde urinaire 22",             prix:6.38},
  {code:"Snd24",  item:"Sonde urinaire 24",             prix:6.38},
  {code:"Snd26",  item:"Sonde urinaire 26",             prix:6.38},
  {code:"TssPerf",item:"Trousse de perfusion",          prix:3.075},
  {code:"MskOx",  item:"Masque à oxygène",              prix:28.25},
];

// ════════════════════════════════════════════════════════
// 🎨 DESIGN SYSTEM — Pharma Professional
// ════════════════════════════════════════════════════════
const C = {
  navy:   "#0F2040",
  navy2:  "#162B52",
  navy3:  "#1E3A6E",
  green:  "#059669",
  green2: "#047857",
  greenL: "#ECFDF5",
  red:    "#DC2626",
  redL:   "#FEF2F2",
  amber:  "#D97706",
  amberL: "#FFFBEB",
  blue:   "#2563EB",
  blueL:  "#EFF6FF",
  bg:     "#F1F5F9",
  white:  "#FFFFFF",
  border: "#E2E8F0",
  text:   "#0F172A",
  muted:  "#64748B",
  light:  "#94A3B8",
  sidebar:"#0A1628",
};

const CHART_COLORS = ["#059669","#2563EB","#D97706","#DC2626","#7C3AED","#0891B2"];

// ════════════════════════════════════════════════════════
// 📦 DEMO DATA (localStorage)
// ════════════════════════════════════════════════════════
const DEMO_USERS = [
  {id:"1", email:"admin@labpro.cd",    password:"admin123",  role:"directeur",  nom:"KASONGO", prenom:"Jean-Marie"},
  {id:"2", email:"comptable@labpro.cd",password:"compta123", role:"comptable",  nom:"MUKENDI", prenom:"Grace"},
  {id:"3", email:"dele1@labpro.cd",    password:"dele123",   role:"delegue",    nom:"KABONGO", prenom:"Pierre"},
  {id:"4", email:"dele2@labpro.cd",    password:"dele456",   role:"delegue",    nom:"TSHIMANGA",prenom:"Marie"},
  {id:"5", email:"dele3@labpro.cd",    password:"dele789",   role:"delegue",    nom:"NKUSU",   prenom:"David"},
];

const loadReports = () => { try { return JSON.parse(localStorage.getItem("labpro_reports")||"[]"); } catch { return []; } };
const saveReports = (r) => localStorage.setItem("labpro_reports", JSON.stringify(r));

// ════════════════════════════════════════════════════════
// 🔧 HELPERS
// ════════════════════════════════════════════════════════
const fmt = (n) => new Intl.NumberFormat("fr-FR", {minimumFractionDigits:2, maximumFractionDigits:2}).format(n||0);
const today = () => new Date().toLocaleDateString("fr-CD",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
const todayISO = () => new Date().toISOString().split("T")[0];
const newRow = () => ({id:Date.now()+Math.random(), code:"", item:"", qte:1, prix:0, montant:0, client:"", adresse:"", tel:"", lat:"", lng:""});

// ════════════════════════════════════════════════════════
// EXPORT EXCEL (SheetJS)
// ════════════════════════════════════════════════════════
const exportExcel = async (rapport) => {
  const XLSX = await import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm");
  const ws_data = [
    ["RAPPORT DES VENTES JOURNALIÈRES — LabPro Pharma RDC Sarl"],
    [],
    ["Délégué :", `${rapport.prenom} ${rapport.nom}`],
    ["Date :", rapport.date],
    ["Secteurs visités :", rapport.secteurs],
    [],
    ["CODE","ITEM","QUANTITÉ","MONTANT (USD)","CLIENT","ADRESSE","TÉLÉPHONE","LATITUDE","LONGITUDE"],
    ...rapport.lignes.map(l=>[l.code,l.item,l.qte,l.montant,l.client,l.adresse,l.tel,l.lat,l.lng]),
    [],
    ["","","TOTAL CA (USD):",rapport.totalCA,"","","","",""],
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  ws["!cols"] = [{wch:12},{wch:32},{wch:10},{wch:14},{wch:22},{wch:24},{wch:16},{wch:12},{wch:12}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rapport");
  XLSX.writeFile(wb, `LabPro_${rapport.nom}_${rapport.date}.xlsx`);
};

const exportExcelCompilation = async (reports, titre) => {
  const XLSX = await import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm");
  const rows = [
    [`COMPILATION — ${titre} — LabPro Pharma RDC`],[],
    ["DÉLÉGUÉ","DATE","NB LIGNES","TOTAL CA (USD)"],
    ...reports.map(r=>[`${r.prenom} ${r.nom}`, r.date, r.lignes?.length||0, r.totalCA||0]),
    [],["","TOTAL GÉNÉRAL",reports.reduce((s,r)=>s+(r.lignes?.length||0),0), reports.reduce((s,r)=>s+(r.totalCA||0),0)],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Compilation");
  XLSX.writeFile(wb, `LabPro_Compilation_${titre.replace(/ /g,"_")}.xlsx`);
};

// ════════════════════════════════════════════════════════
// 🔐 AUTH PAGE
// ════════════════════════════════════════════════════════
function AuthPage({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    await new Promise(r=>setTimeout(r,600));
    const user = DEMO_USERS.find(u=>u.email===email&&u.password===password);
    if (user) onLogin(user);
    else setError("Email ou mot de passe incorrect.");
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.sidebar} 0%,${C.navy3} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <div style={{width:"100%",maxWidth:440}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:72,height:72,borderRadius:16,background:C.green,marginBottom:16,boxShadow:"0 8px 32px rgba(5,150,105,0.4)"}}>
            <span style={{fontSize:36}}>💊</span>
          </div>
          <h1 style={{color:"#FFF",fontSize:22,fontWeight:700,margin:"0 0 4px",letterSpacing:-0.5}}>LabPro Pharma RDC Sarl</h1>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,margin:0}}>Système de Rapport des Ventes Journalières</p>
        </div>

        {/* Card */}
        <div style={{background:C.white,borderRadius:20,padding:36,boxShadow:"0 24px 60px rgba(0,0,0,0.4)"}}>
          <h2 style={{fontSize:18,fontWeight:700,color:C.text,margin:"0 0 24px",textAlign:"center"}}>Connexion</h2>

          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Email professionnel</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} type="email" placeholder="votre@labpropharma.com"
              style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 14px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border 0.15s"}}
              onFocus={e=>e.target.style.border=`1.5px solid ${C.green}`} onBlur={e=>e.target.style.border=`1.5px solid ${C.border}`}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:C.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>Mot de passe</label>
            <div style={{position:"relative"}}>
              <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} type={showPw?"text":"password"} placeholder="••••••••"
                style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"11px 40px 11px 14px",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box",transition:"border 0.15s"}}
                onFocus={e=>e.target.style.border=`1.5px solid ${C.green}`} onBlur={e=>e.target.style.border=`1.5px solid ${C.border}`}/>
              <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",border:"none",background:"transparent",cursor:"pointer",color:C.light,fontSize:16}}>{showPw?"🙈":"👁"}</button>
            </div>
          </div>

          {error && <div style={{background:C.redL,border:`1px solid #FCA5A5`,borderRadius:8,padding:"10px 14px",fontSize:13,color:C.red,marginBottom:16}}>{error}</div>}

          <button onClick={handleLogin} disabled={loading} style={{width:"100%",background:loading?C.light:C.green,color:"#FFF",border:"none",borderRadius:10,padding:"13px",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit",transition:"background 0.15s",boxShadow:loading?"none":`0 4px 16px rgba(5,150,105,0.35)`}}>
            {loading?"Connexion en cours...":"Se connecter"}
          </button>

          {/* Demo accounts */}
          <div style={{marginTop:24,padding:"16px",background:C.bg,borderRadius:10}}>
            <p style={{fontSize:11,color:C.muted,fontWeight:600,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:0.5}}>Comptes de démonstration</p>
            {DEMO_USERS.map(u=>(
              <div key={u.id} onClick={()=>{setEmail(u.email);setPassword(u.password);}} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",cursor:"pointer",fontSize:12}}>
                <span style={{color:C.text,fontWeight:500}}>{u.prenom} {u.nom}</span>
                <span style={{background:u.role==="directeur"?C.navy3:u.role==="comptable"?C.amber:C.green,color:"#FFF",padding:"1px 8px",borderRadius:999,fontSize:10,fontWeight:600}}>{u.role}</span>
              </div>
            ))}
            <p style={{fontSize:10,color:C.light,margin:"8px 0 0"}}>Cliquez sur un compte pour remplir automatiquement</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🧩 COMPOSANTS UI
// ════════════════════════════════════════════════════════
function StatCard({icon,label,value,sub,color,trend}) {
  return (
    <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:color||C.green,borderRadius:"14px 0 0 14px"}}/>
      <div style={{marginLeft:6}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <span style={{fontSize:26}}>{icon}</span>
          {trend!==undefined&&<span style={{fontSize:11,fontWeight:600,color:trend>=0?C.green:C.red,background:trend>=0?C.greenL:C.redL,padding:"2px 8px",borderRadius:999}}>{trend>=0?"+":""}{trend}%</span>}
        </div>
        <div style={{fontSize:26,fontWeight:800,color:C.text,letterSpacing:-1}}>{value}</div>
        <div style={{fontSize:12,fontWeight:600,color:C.muted,marginTop:2}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:C.light,marginTop:2}}>{sub}</div>}
      </div>
    </div>
  );
}

function Badge({children,color}) {
  const map = {green:{bg:C.greenL,text:C.green2},amber:{bg:C.amberL,text:C.amber},red:{bg:C.redL,text:C.red},blue:{bg:C.blueL,text:C.blue},navy:{bg:"#EFF3FB",text:C.navy3}};
  const s = map[color]||map.green;
  return <span style={{background:s.bg,color:s.text,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:999,letterSpacing:0.3}}>{children}</span>;
}

function SectionTitle({children,action}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
      <h2 style={{fontSize:16,fontWeight:700,color:C.text,margin:0,display:"flex",alignItems:"center",gap:8}}>{children}</h2>
      {action}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📊 SIDEBAR
// ════════════════════════════════════════════════════════
function Sidebar({user,view,setView,onLogout}) {
  const navDelegue = [
    {id:"rapport",  icon:"📝", label:"Nouveau Rapport"},
    {id:"historique",icon:"📋",label:"Mes Rapports"},
  ];
  const navDirecteur = [
    {id:"dashboard",  icon:"📊", label:"Tableau de bord"},
    {id:"rapports",   icon:"📋", label:"Tous les rapports"},
    {id:"hebdo",      icon:"📅", label:"Rapport hebdomadaire"},
    {id:"mensuel",    icon:"🗓",  label:"Rapport mensuel"},
    {id:"classement", icon:"🏆", label:"Classement délégués"},
  ];
  const navComptable = [
    {id:"dashboard_c",icon:"📊",label:"Tableau de bord"},
    {id:"rapports_c", icon:"📋",label:"Rapports reçus"},
  ];
  const nav = user.role==="delegue"?navDelegue:user.role==="directeur"?navDirecteur:navComptable;
  const roleColor = user.role==="directeur"?C.navy3:user.role==="comptable"?C.amber:C.green;

  return (
    <div style={{width:240,background:C.sidebar,display:"flex",flexDirection:"column",height:"100vh",position:"fixed",left:0,top:0,zIndex:100,flexShrink:0}}>
      {/* Logo */}
      <div style={{padding:"24px 20px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:38,height:38,borderRadius:10,background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>💊</div>
          <div>
            <div style={{color:"#FFF",fontSize:13,fontWeight:700,lineHeight:1.2}}>LabPro Pharma</div>
            <div style={{color:"rgba(255,255,255,0.4)",fontSize:10,letterSpacing:0.5}}>RDC Sarl</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",background:roleColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#FFF",flexShrink:0}}>
            {(user.prenom[0]+user.nom[0]).toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{color:"#FFF",fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.prenom} {user.nom}</div>
            <div style={{fontSize:10,padding:"1px 7px",borderRadius:999,background:roleColor,color:"#FFF",display:"inline-block",marginTop:2,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{user.role}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",padding:"8px 10px 6px"}}>Navigation</div>
        {nav.map(item=>{
          const active=view===item.id;
          return (
            <div key={item.id} onClick={()=>setView(item.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,marginBottom:2,cursor:"pointer",background:active?"rgba(5,150,105,0.25)":"transparent",borderLeft:active?"3px solid #059669":"3px solid transparent",color:active?"#6EE7B7":"rgba(255,255,255,0.6)",fontSize:13,fontWeight:active?600:400,transition:"all 0.15s"}}
              onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
              onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
              <span style={{fontSize:16,width:20,textAlign:"center"}}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{padding:"12px 10px 20px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div onClick={onLogout} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,cursor:"pointer",color:"rgba(255,255,255,0.4)",fontSize:13,transition:"all 0.15s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#FCA5A5";e.currentTarget.style.background="rgba(220,38,38,0.1)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.4)";e.currentTarget.style.background="transparent";}}>
          <span style={{fontSize:16}}>🚪</span><span>Déconnexion</span>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📝 PORTAIL DÉLÉGUÉ — NOUVEAU RAPPORT
// ════════════════════════════════════════════════════════
function NouveauRapport({user}) {
  const [secteurs, setSecteurs] = useState("");
  const [lignes, setLignes] = useState([newRow()]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const totalCA = lignes.reduce((s,l)=>s+(l.montant||0),0);
  const nbClients = lignes.filter(l=>l.client.trim()).length;

  const updateRow = (id, field, val) => {
    setLignes(prev=>prev.map(r=>{
      if(r.id!==id) return r;
      const updated={...r,[field]:val};
      if(field==="code") {
        const prod=PRODUITS.find(p=>p.code===val);
        if(prod){updated.item=prod.item;updated.prix=prod.prix;updated.montant=prod.prix*(updated.qte||1);}
      }
      if(field==="qte"||field==="prix"){
        updated.montant=(parseFloat(updated.prix)||0)*(parseFloat(updated.qte)||0);
      }
      return updated;
    }));
  };

  const captureGPS = (id) => {
    setGpsLoading(id);
    navigator.geolocation?.getCurrentPosition(
      pos=>{ updateRow(id,"lat",pos.coords.latitude.toFixed(6)); updateRow(id,"lng",pos.coords.longitude.toFixed(6)); setGpsLoading(null); },
      ()=>{ alert("GPS non disponible. Activez la localisation."); setGpsLoading(null); }
    );
  };

  const handleSubmit = async () => {
    if(!secteurs.trim()){alert("Veuillez indiquer les secteurs visités."); return;}
    const validLines=lignes.filter(l=>l.code&&l.client);
    if(!validLines.length){alert("Ajoutez au moins une vente avec un code produit et un client."); return;}
    setSaving(true);
    await new Promise(r=>setTimeout(r,800));
    const rapport={
      id: Date.now().toString(),
      delegueId: user.id,
      nom: user.nom,
      prenom: user.prenom,
      date: todayISO(),
      secteurs,
      lignes: validLines,
      totalCA,
      nbClients,
      soumis: new Date().toISOString(),
    };
    const reports = loadReports();
    reports.push(rapport);
    saveReports(reports);
    await exportExcel(rapport);
    setSaving(false);
    setSubmitted(true);
    setSuccessMsg(`Rapport soumis ! Fichier Excel téléchargé. Email envoyé à ${EMAIL_DIRECTEUR} et ${EMAIL_COMPTABLE}.`);
  };

  if(submitted) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:20,padding:48,textAlign:"center",maxWidth:480}}>
        <div style={{fontSize:64,marginBottom:16}}>✅</div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.text,marginBottom:12}}>Rapport soumis avec succès !</h2>
        <p style={{color:C.muted,fontSize:14,lineHeight:1.7,marginBottom:8}}>{successMsg}</p>
        <div style={{background:C.greenL,borderRadius:10,padding:"12px 16px",marginBottom:24}}>
          <div style={{fontSize:13,color:C.green2,fontWeight:600}}>CA total : {fmt(totalCA)} USD · {nbClients} client(s)</div>
        </div>
        <button onClick={()=>{setSubmitted(false);setLignes([newRow()]);setSecteurs("");}} style={{background:C.green,color:"#FFF",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          Nouveau rapport
        </button>
      </div>
    </div>
  );

  const tdStyle={padding:"7px 8px",verticalAlign:"middle"};
  const inputBase={border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 8px",fontSize:12,outline:"none",fontFamily:"inherit",width:"100%",boxSizing:"border-box"};

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.navy} 0%,${C.navy3} 100%)`,borderRadius:16,padding:"24px 28px",marginBottom:24,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-30,top:-30,width:200,height:200,borderRadius:"50%",background:"rgba(5,150,105,0.08)"}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Rapport des Ventes Journalières</div>
            <h1 style={{color:"#FFF",fontSize:20,fontWeight:800,margin:"0 0 4px",letterSpacing:-0.5}}>LabPro Pharma RDC Sarl</h1>
            <p style={{color:"rgba(255,255,255,0.55)",fontSize:13,margin:0}}>Délégué : {user.prenom} {user.nom}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>Date du rapport</div>
            <div style={{color:"#FFF",fontSize:14,fontWeight:600,marginTop:2}}>{today()}</div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"18px 22px",marginBottom:18}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>
          {[["Délégué Commercial",`${user.prenom} ${user.nom}`],["Date",new Date().toLocaleDateString("fr-FR")]].map(([l,v])=>(
            <div key={l}><div style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:C.text,background:C.bg,borderRadius:8,padding:"8px 12px"}}>{v}</div></div>
          ))}
          <div>
            <div style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Secteurs visités *</div>
            <input value={secteurs} onChange={e=>setSecteurs(e.target.value)} placeholder="Ex: Kinshasa-Gombe, Lingwala, Kintambo..." style={{...inputBase,padding:"8px 12px",fontSize:13}}/>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
        <StatCard icon="📦" label="Lignes de vente" value={lignes.filter(l=>l.code).length} color={C.blue}/>
        <StatCard icon="👥" label="Clients" value={nbClients} color={C.green}/>
        <StatCard icon="💰" label="CA total (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>

      {/* Table */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",marginBottom:18}}>
        <div style={{padding:"14px 18px",background:C.navy,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h3 style={{color:"#FFF",fontSize:14,fontWeight:700,margin:0}}>📊 Tableau des Ventes</h3>
          <button onClick={()=>setLignes(p=>[...p,newRow()])} style={{background:C.green,color:"#FFF",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Ajouter une ligne</button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:1100}}>
            <thead>
              <tr style={{background:C.bg}}>
                {["#","CODE","ITEM","QTÉ","MONTANT (USD)","NOM CLIENT","ADRESSE","TÉLÉPHONE","GPS",""].map((h,i)=>(
                  <th key={i} style={{padding:"10px 8px",fontSize:11,fontWeight:700,color:C.muted,textAlign:"left",borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lignes.map((row,idx)=>(
                <tr key={row.id} style={{borderBottom:`1px solid #F1F5F9`}} onMouseEnter={e=>e.currentTarget.style.background="#FAFCFF"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{...tdStyle,width:32,color:C.light,fontSize:12,fontWeight:600}}>{idx+1}</td>
                  <td style={{...tdStyle,minWidth:120}}>
                    <select value={row.code} onChange={e=>updateRow(row.id,"code",e.target.value)} style={{...inputBase,minWidth:110,background:"#FFF"}}>
                      <option value="">-- Code --</option>
                      {PRODUITS.map(p=><option key={p.code} value={p.code}>{p.code}</option>)}
                    </select>
                  </td>
                  <td style={{...tdStyle,minWidth:200}}>
                    <input value={row.item} readOnly style={{...inputBase,background:C.bg,color:C.muted,minWidth:180}} placeholder="Auto"/>
                  </td>
                  <td style={{...tdStyle,width:70}}>
                    <input type="number" min="1" value={row.qte} onChange={e=>updateRow(row.id,"qte",parseFloat(e.target.value)||1)} style={{...inputBase,width:60,textAlign:"center"}}/>
                  </td>
                  <td style={{...tdStyle,width:120}}>
                    <div style={{fontSize:14,fontWeight:700,color:row.montant>0?C.green:C.light,background:row.montant>0?C.greenL:C.bg,borderRadius:6,padding:"6px 10px",textAlign:"right"}}>{row.montant>0?fmt(row.montant)+" $":"—"}</div>
                  </td>
                  <td style={{...tdStyle,minWidth:150}}>
                    <input value={row.client} onChange={e=>updateRow(row.id,"client",e.target.value)} placeholder="Nom du client" style={inputBase}/>
                  </td>
                  <td style={{...tdStyle,minWidth:140}}>
                    <input value={row.adresse} onChange={e=>updateRow(row.id,"adresse",e.target.value)} placeholder="Adresse" style={inputBase}/>
                  </td>
                  <td style={{...tdStyle,minWidth:120}}>
                    <input value={row.tel} onChange={e=>updateRow(row.id,"tel",e.target.value)} placeholder="+243..." style={inputBase}/>
                  </td>
                  <td style={{...tdStyle,minWidth:130}}>
                    {row.lat?<div style={{fontSize:10,color:C.green,fontWeight:600}}>📍{row.lat}<br/>{row.lng}</div>:
                    <button onClick={()=>captureGPS(row.id)} style={{background:C.blueL,color:C.blue,border:`1px solid #BFDBFE`,borderRadius:6,padding:"5px 8px",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>
                      {gpsLoading===row.id?"⏳...":"📍 GPS"}
                    </button>}
                  </td>
                  <td style={{...tdStyle,width:36}}>
                    {lignes.length>1&&<button onClick={()=>setLignes(p=>p.filter(r=>r.id!==row.id))} style={{background:C.redL,border:"none",color:C.red,borderRadius:6,width:28,height:28,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{background:C.bg,borderTop:`2px solid ${C.border}`}}>
                <td colSpan={4} style={{padding:"12px 8px",fontSize:13,fontWeight:700,color:C.text}}>TOTAL CHIFFRE D'AFFAIRES</td>
                <td style={{padding:"12px 8px",fontSize:16,fontWeight:800,color:C.green}}>{fmt(totalCA)} USD</td>
                <td colSpan={5}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div style={{display:"flex",justifyContent:"flex-end",gap:12}}>
        <button onClick={()=>setLignes([newRow()])} style={{background:C.white,color:C.muted,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 24px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 Réinitialiser</button>
        <button onClick={handleSubmit} disabled={saving} style={{background:saving?C.light:C.green,color:"#FFF",border:"none",borderRadius:10,padding:"12px 32px",fontSize:14,fontWeight:700,cursor:saving?"not-allowed":"pointer",fontFamily:"inherit",boxShadow:`0 4px 16px rgba(5,150,105,0.35)`}}>
          {saving?"⏳ Envoi en cours...":"📤 Soumettre & Envoyer par Email"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📋 HISTORIQUE DÉLÉGUÉ
// ════════════════════════════════════════════════════════
function HistoriqueDelegue({user}) {
  const all = loadReports().filter(r=>r.delegueId===user.id);
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <SectionTitle>📋 Mes Rapports soumis</SectionTitle>
      {!all.length?<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:48,textAlign:"center",color:C.muted}}>Aucun rapport soumis pour le moment.</div>:
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>
            {["Date","Secteurs visités","Nb lignes","Clients","CA Total (USD)","Actions"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{all.sort((a,b)=>b.date.localeCompare(a.date)).map(r=>(
            <tr key={r.id} style={{borderBottom:`1px solid ${C.border}`}} onMouseEnter={e=>e.currentTarget.style.background="#FAFCFF"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"12px 16px",fontSize:13,fontWeight:600,color:C.text}}>{r.date}</td>
              <td style={{padding:"12px 16px",fontSize:13,color:C.muted}}>{r.secteurs}</td>
              <td style={{padding:"12px 16px"}}><Badge color="blue">{r.lignes?.length||0} ventes</Badge></td>
              <td style={{padding:"12px 16px"}}><Badge color="green">{r.nbClients} clients</Badge></td>
              <td style={{padding:"12px 16px",fontSize:14,fontWeight:700,color:C.green}}>{fmt(r.totalCA)} $</td>
              <td style={{padding:"12px 16px"}}>
                <button onClick={()=>exportExcel(r)} style={{background:C.greenL,color:C.green2,border:`1px solid #A7F3D0`,borderRadius:7,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⬇ Excel</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📊 DASHBOARD DIRECTEUR / COMPTABLE
// ════════════════════════════════════════════════════════
function Dashboard({user}) {
  const all = loadReports();
  const today_str = todayISO();
  const week_start = new Date(); week_start.setDate(week_start.getDate()-7);
  const month = new Date().getMonth();

  const todayReports = all.filter(r=>r.date===today_str);
  const weekReports  = all.filter(r=>new Date(r.date)>=week_start);
  const monthReports = all.filter(r=>new Date(r.date).getMonth()===month);
  const totalCA_all  = all.reduce((s,r)=>s+(r.totalCA||0),0);
  const totalCA_month= monthReports.reduce((s,r)=>s+(r.totalCA||0),0);

  // Chart data — CA par délégué
  const byDelegue = {};
  all.forEach(r=>{
    const k=`${r.prenom} ${r.nom}`;
    byDelegue[k]=(byDelegue[k]||0)+(r.totalCA||0);
  });
  const chartData = Object.entries(byDelegue).map(([name,ca])=>({name:name.split(" ")[0],ca:parseFloat(ca.toFixed(2))}));

  // Trend par jour (7 derniers jours)
  const trendData = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-6+i);
    const iso=d.toISOString().split("T")[0];
    const ca=all.filter(r=>r.date===iso).reduce((s,r)=>s+(r.totalCA||0),0);
    return {jour:d.toLocaleDateString("fr-FR",{weekday:"short"}), ca:parseFloat(ca.toFixed(2))};
  });

  // Top produit
  const prodCount = {};
  all.forEach(r=>r.lignes?.forEach(l=>{prodCount[l.item]=(prodCount[l.item]||0)+(l.qte||0);}));
  const pieData = Object.entries(prodCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,value])=>({name:name.slice(0,20),value}));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:800,color:C.text,margin:"0 0 4px",letterSpacing:-0.5}}>Tableau de bord commercial</h1>
        <p style={{color:C.muted,fontSize:13,margin:0}}>LabPro Pharma RDC Sarl · {today()}</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        <StatCard icon="📊" label="Rapports aujourd'hui" value={todayReports.length} color={C.blue}/>
        <StatCard icon="📅" label="Rapports ce mois" value={monthReports.length} color={C.navy3}/>
        <StatCard icon="💰" label="CA mensuel (USD)" value={`$${fmt(totalCA_month)}`} color={C.green}/>
        <StatCard icon="🏆" label="CA total (USD)" value={`$${fmt(totalCA_all)}`} color={C.amber}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:18,marginBottom:18}}>
        {/* Trend */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px"}}>
          <SectionTitle>📈 Évolution CA — 7 derniers jours</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="jour" tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v)=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
              <Line type="monotone" dataKey="ca" stroke={C.green} strokeWidth={2.5} dot={{r:4,fill:C.green}} activeDot={{r:6}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie produits */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px"}}>
          <SectionTitle>🧪 Top 5 produits vendus</SectionTitle>
          {pieData.length?
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({name})=>name.slice(0,8)}>
                {pieData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>:<div style={{height:220,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13}}>Aucune donnée</div>}
        </div>
      </div>

      {/* CA par délégué */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px"}}>
        <SectionTitle>👥 Chiffre d'affaires par délégué</SectionTitle>
        {chartData.length?
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="name" tick={{fontSize:12,fill:C.muted}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
            <Tooltip formatter={(v)=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
            <Bar dataKey="ca" fill={C.green} radius={[6,6,0,0]} label={{position:"top",fontSize:11,fill:C.muted,formatter:v=>`$${v}`}}/>
          </BarChart>
        </ResponsiveContainer>:<div style={{height:200,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13}}>Aucune donnée disponible</div>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📋 TOUS LES RAPPORTS
// ════════════════════════════════════════════════════════
function TousLesRapports() {
  const [search, setSearch] = useState("");
  const [dateF,  setDateF]  = useState("");
  const [expanded, setExpanded] = useState(null);
  const all = loadReports();
  const filtered = all.filter(r=>{
    const match = !search || `${r.prenom} ${r.nom} ${r.secteurs}`.toLowerCase().includes(search.toLowerCase());
    const dateMatch = !dateF || r.date===dateF;
    return match&&dateMatch;
  }).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <SectionTitle>📋 Tous les rapports journaliers
        <button onClick={()=>exportExcelCompilation(filtered,"Tous Rapports")} style={{background:C.greenL,color:C.green2,border:`1px solid #A7F3D0`,borderRadius:8,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginLeft:"auto"}}>⬇ Exporter Excel</button>
      </SectionTitle>
      <div style={{display:"flex",gap:12,marginBottom:18}}>
        <div style={{flex:1,position:"relative"}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.light}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par délégué, secteur..." style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px 9px 36px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        </div>
        <input type="date" value={dateF} onChange={e=>setDateF(e.target.value)} style={{border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        {(search||dateF)&&<button onClick={()=>{setSearch("");setDateF("");}} style={{background:C.redL,color:C.red,border:"none",borderRadius:10,padding:"9px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✕ Effacer</button>}
      </div>

      {!filtered.length?<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:48,textAlign:"center",color:C.muted}}>Aucun rapport trouvé.</div>:
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>
            {["Délégué","Date","Secteurs","Ventes","Clients","CA Total (USD)","Actions"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>{filtered.map(r=>(
            <>
            <tr key={r.id} style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer"}} onClick={()=>setExpanded(expanded===r.id?null:r.id)} onMouseEnter={e=>e.currentTarget.style.background="#FAFCFF"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"12px 16px"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:11,fontWeight:700,flexShrink:0}}>{(r.prenom[0]+r.nom[0]).toUpperCase()}</div>
                  <span style={{fontSize:13,fontWeight:600,color:C.text}}>{r.prenom} {r.nom}</span>
                </div>
              </td>
              <td style={{padding:"12px 16px",fontSize:13,color:C.muted}}>{r.date}</td>
              <td style={{padding:"12px 16px",fontSize:12,color:C.muted,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td>
              <td style={{padding:"12px 16px"}}><Badge color="blue">{r.lignes?.length||0}</Badge></td>
              <td style={{padding:"12px 16px"}}><Badge color="green">{r.nbClients}</Badge></td>
              <td style={{padding:"12px 16px",fontSize:14,fontWeight:700,color:C.green}}>{fmt(r.totalCA)} $</td>
              <td style={{padding:"12px 16px",display:"flex",gap:6}}>
                <button onClick={e=>{e.stopPropagation();exportExcel(r);}} style={{background:C.greenL,color:C.green2,border:`1px solid #A7F3D0`,borderRadius:7,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⬇ XLS</button>
                <span style={{color:C.light,fontSize:16,alignSelf:"center"}}>{expanded===r.id?"▲":"▼"}</span>
              </td>
            </tr>
            {expanded===r.id&&(
              <tr key={r.id+"_exp"}><td colSpan={7} style={{padding:0}}>
                <div style={{background:"#F8FAFC",padding:"16px 20px",borderBottom:`2px solid ${C.border}`}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{background:C.bg}}>
                      {["Code","Item","Qté","Montant","Client","Adresse","Téléphone","GPS"].map(h=>(
                        <th key={h} style={{padding:"8px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{(r.lignes||[]).map((l,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
                        <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:600,color:C.navy3}}>{l.code}</td>
                        <td style={{padding:"7px 10px"}}>{l.item}</td>
                        <td style={{padding:"7px 10px",textAlign:"center"}}>{l.qte}</td>
                        <td style={{padding:"7px 10px",fontWeight:600,color:C.green}}>{fmt(l.montant)}$</td>
                        <td style={{padding:"7px 10px"}}>{l.client}</td>
                        <td style={{padding:"7px 10px",color:C.muted}}>{l.adresse}</td>
                        <td style={{padding:"7px 10px",color:C.muted}}>{l.tel}</td>
                        <td style={{padding:"7px 10px",fontSize:10,color:C.blue}}>{l.lat&&l.lng?`${l.lat}, ${l.lng}`:"—"}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </td></tr>
            )}
            </>
          ))}</tbody>
        </table>
      </div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🏆 CLASSEMENT DÉLÉGUÉS
// ════════════════════════════════════════════════════════
function Classement() {
  const all = loadReports();
  const month = new Date().getMonth();
  const monthReports = all.filter(r=>new Date(r.date).getMonth()===month);
  const stats = {};
  monthReports.forEach(r=>{
    const k=`${r.prenom} ${r.nom}`;
    if(!stats[k]) stats[k]={nom:r.nom,prenom:r.prenom,ca:0,ventes:0,clients:0,jours:new Set()};
    stats[k].ca+=(r.totalCA||0);
    stats[k].ventes+=(r.lignes?.length||0);
    stats[k].clients+=(r.nbClients||0);
    stats[k].jours.add(r.date);
  });
  const ranking = Object.values(stats).map(s=>({...s,jours:s.jours.size})).sort((a,b)=>b.ca-a.ca);
  const medals=["🥇","🥈","🥉"];
  const medalColors=[C.amber,"#94A3B8","#CD7F32"];

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <SectionTitle>🏆 Classement des Délégués — {new Date().toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}</SectionTitle>

      {!ranking.length?<div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:48,textAlign:"center",color:C.muted}}>Aucune donnée ce mois.</div>:
      <>
        {/* Podium */}
        {ranking.length>=1&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,marginBottom:24}}>
            {ranking.slice(0,3).map((d,i)=>(
              <div key={i} style={{background:C.white,border:`2px solid ${medalColors[i]||C.border}`,borderRadius:16,padding:24,textAlign:"center",position:"relative",boxShadow:i===0?`0 8px 32px rgba(217,119,6,0.15)`:"none"}}>
                <div style={{fontSize:40,marginBottom:8}}>{medals[i]||""}</div>
                <div style={{width:52,height:52,borderRadius:"50%",background:medalColors[i]||C.green,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#FFF",margin:"0 auto 10px"}}>{(d.prenom[0]+d.nom[0]).toUpperCase()}</div>
                <h3 style={{fontSize:15,fontWeight:700,color:C.text,margin:"0 0 6px"}}>{d.prenom} {d.nom}</h3>
                <div style={{fontSize:22,fontWeight:800,color:medalColors[i],margin:"0 0 8px"}}>{fmt(d.ca)} $</div>
                <div style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
                  <Badge color={i===0?"amber":"blue"}>{d.ventes} ventes</Badge>
                  <Badge color="green">{d.clients} clients</Badge>
                  <Badge color="navy">{d.jours}j actifs</Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full table */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",background:C.navy}}><h3 style={{color:"#FFF",fontSize:14,fontWeight:700,margin:0}}>📊 Classement complet</h3></div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg}}>
              {["Rang","Délégué","CA Total (USD)","Nb ventes","Clients visités","Jours actifs","Régularité"].map(h=>(
                <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{ranking.map((d,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i===0?"#FFFBEB":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background=i===0?"#FEF3C7":"#FAFCFF"} onMouseLeave={e=>e.currentTarget.style.background=i===0?"#FFFBEB":"transparent"}>
                <td style={{padding:"14px 16px",fontSize:20}}>{medals[i]||`#${i+1}`}</td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:medalColors[i]||C.green,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:12,fontWeight:700,flexShrink:0}}>{(d.prenom[0]+d.nom[0]).toUpperCase()}</div>
                    <div><div style={{fontSize:13,fontWeight:700,color:C.text}}>{d.prenom} {d.nom}</div><div style={{fontSize:10,color:C.light}}>Délégué Commercial</div></div>
                  </div>
                </td>
                <td style={{padding:"14px 16px",fontSize:15,fontWeight:800,color:C.green}}>{fmt(d.ca)} $</td>
                <td style={{padding:"14px 16px"}}><Badge color="blue">{d.ventes}</Badge></td>
                <td style={{padding:"14px 16px"}}><Badge color="green">{d.clients}</Badge></td>
                <td style={{padding:"14px 16px"}}><Badge color="navy">{d.jours} jours</Badge></td>
                <td style={{padding:"14px 16px"}}>
                  <div style={{background:C.bg,borderRadius:8,height:8,width:120}}>
                    <div style={{background:i===0?C.amber:C.green,borderRadius:8,height:8,width:`${Math.min(100,Math.round((d.jours/20)*100))}%`}}/>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </>}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 📅 COMPILATION HEBDOMADAIRE / MENSUELLE
// ════════════════════════════════════════════════════════
function Compilation({type}) {
  const all = loadReports();
  const now = new Date();
  let filtered, titre;
  if(type==="hebdo") {
    const ws = new Date(); ws.setDate(ws.getDate()-7);
    filtered = all.filter(r=>new Date(r.date)>=ws);
    titre = `Semaine du ${ws.toLocaleDateString("fr-FR")} au ${now.toLocaleDateString("fr-FR")}`;
  } else {
    filtered = all.filter(r=>new Date(r.date).getMonth()===now.getMonth());
    titre = now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});
  }

  const stats = {};
  filtered.forEach(r=>{
    const k=`${r.prenom} ${r.nom}`;
    if(!stats[k]) stats[k]={prenom:r.prenom,nom:r.nom,ca:0,ventes:0,clients:0,rapports:0};
    stats[k].ca+=(r.totalCA||0);
    stats[k].ventes+=(r.lignes?.length||0);
    stats[k].clients+=(r.nbClients||0);
    stats[k].rapports++;
  });
  const rows = Object.values(stats).sort((a,b)=>b.ca-a.ca);
  const totalCA = rows.reduce((s,r)=>s+r.ca,0);

  const chartData = rows.map(r=>({name:`${r.prenom}`,ca:parseFloat(r.ca.toFixed(2)),ventes:r.ventes}));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <h2 style={{fontSize:18,fontWeight:800,color:C.text,margin:"0 0 4px"}}>{type==="hebdo"?"📅 Rapport Hebdomadaire":"🗓 Rapport Mensuel"}</h2>
          <p style={{color:C.muted,fontSize:13,margin:0}}>{titre}</p>
        </div>
        <button onClick={()=>exportExcelCompilation(filtered,titre)} style={{background:C.green,color:"#FFF",border:"none",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>⬇ Exporter Excel</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <StatCard icon="📊" label="Rapports soumis" value={filtered.length} color={C.blue}/>
        <StatCard icon="👥" label="Délégués actifs" value={rows.length} color={C.navy3}/>
        <StatCard icon="🛍" label="Total ventes" value={rows.reduce((s,r)=>s+r.ventes,0)} color={C.green}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.amber}/>
      </div>

      {/* Chart */}
      {chartData.length>0&&(
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px",marginBottom:18}}>
          <SectionTitle>📊 Performance par délégué</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={44}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="name" tick={{fontSize:12,fill:C.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:C.muted}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={(v,n)=>[n==="ca"?`$${fmt(v)}`:v,n==="ca"?"CA":"Ventes"]} contentStyle={{borderRadius:10,border:`1px solid ${C.border}`,fontSize:12}}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Bar dataKey="ca" name="CA (USD)" fill={C.green} radius={[6,6,0,0]}/>
              <Bar dataKey="ventes" name="Nb ventes" fill={C.blue} radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",background:C.navy}}><h3 style={{color:"#FFF",fontSize:14,fontWeight:700,margin:0}}>Récapitulatif par délégué</h3></div>
        {!rows.length?<div style={{padding:40,textAlign:"center",color:C.muted}}>Aucune donnée pour cette période.</div>:
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>
            {["#","Délégué","Rapports","Ventes","Clients","CA Total (USD)","Part (%)"].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}`}} onMouseEnter={e=>e.currentTarget.style.background="#FAFCFF"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"12px 16px",fontWeight:700,color:C.muted}}>#{i+1}</td>
                <td style={{padding:"12px 16px",fontSize:13,fontWeight:600,color:C.text}}>{r.prenom} {r.nom}</td>
                <td style={{padding:"12px 16px"}}><Badge color="navy">{r.rapports}</Badge></td>
                <td style={{padding:"12px 16px"}}><Badge color="blue">{r.ventes}</Badge></td>
                <td style={{padding:"12px 16px"}}><Badge color="green">{r.clients}</Badge></td>
                <td style={{padding:"12px 16px",fontSize:14,fontWeight:800,color:C.green}}>{fmt(r.ca)} $</td>
                <td style={{padding:"12px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{background:C.bg,borderRadius:4,height:6,flex:1}}>
                      <div style={{background:C.green,borderRadius:4,height:6,width:`${totalCA>0?Math.round((r.ca/totalCA)*100):0}%`}}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:600,color:C.muted,minWidth:32}}>{totalCA>0?Math.round((r.ca/totalCA)*100):0}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{background:C.bg,borderTop:`2px solid ${C.border}`}}>
              <td colSpan={5} style={{padding:"12px 16px",fontSize:13,fontWeight:700,color:C.text}}>TOTAL GÉNÉRAL</td>
              <td style={{padding:"12px 16px",fontSize:15,fontWeight:800,color:C.green}}>{fmt(totalCA)} USD</td>
              <td style={{padding:"12px 16px",fontSize:12,fontWeight:600,color:C.muted}}>100%</td>
            </tr>
          </tfoot>
        </table>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// 🏠 APP PRINCIPALE
// ════════════════════════════════════════════════════════
export default function App() {
  const [user,    setUser]    = useState(null);
  const [view,    setView]    = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const style = document.createElement("style");
    style.textContent=`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Inter',system-ui,sans-serif;background:#F1F5F9;-webkit-font-smoothing:antialiased;}::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:#F1F5F9}::-webkit-scrollbar-thumb{background:#CBD5E1;border-radius:3px}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}button,input,select,textarea{font-family:inherit}`;
    document.head.appendChild(style);
    const saved = localStorage.getItem("labpro_user");
    if(saved){try{const u=JSON.parse(saved);setUser(u);setView(u.role==="delegue"?"rapport":"dashboard");}catch{}}
    setLoading(false);
    return ()=>document.head.removeChild(style);
  },[]);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem("labpro_user",JSON.stringify(u));
    setView(u.role==="delegue"?"rapport":"dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("labpro_user");
    setView("");
  };

  if(loading) return <div style={{minHeight:"100vh",background:C.sidebar,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>💊</div>;
  if(!user) return <AuthPage onLogin={handleLogin}/>;

  // Render view
  const renderView = () => {
    if(user.role==="delegue") {
      if(view==="rapport")    return <NouveauRapport user={user}/>;
      if(view==="historique") return <HistoriqueDelegue user={user}/>;
    }
    if(user.role==="directeur") {
      if(view==="dashboard")  return <Dashboard user={user}/>;
      if(view==="rapports")   return <TousLesRapports/>;
      if(view==="hebdo")      return <Compilation type="hebdo"/>;
      if(view==="mensuel")    return <Compilation type="mensuel"/>;
      if(view==="classement") return <Classement/>;
    }
    if(user.role==="comptable") {
      if(view==="dashboard_c") return <Dashboard user={user}/>;
      if(view==="rapports_c")  return <TousLesRapports/>;
    }
    return <Dashboard user={user}/>;
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:"'Inter',system-ui,sans-serif"}}>
      <Sidebar user={user} view={view} setView={setView} onLogout={handleLogout}/>
      <main style={{flex:1,marginLeft:240,padding:"28px 32px",minHeight:"100vh",maxWidth:"calc(100vw - 240px)",overflowX:"hidden"}}>
        {renderView()}
      </main>
    </div>
  );
}
