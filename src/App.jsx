rap:"wrap"}}>
            {!tracking?<Btn onClick={start} icon="▶️" full>Démarrer le suivi GPS</Btn>:<Btn onClick={stop} variant="danger" icon="⏹" full>Arrêter le suivi</Btn>}
          </div>
          {trail.length>0&&!tracking&&<div style={{marginTop:8}}><Btn onClick={()=>{setTrail([]);setSeconds(0);}} variant="secondary" icon="🗑" full>Effacer les données</Btn></div>}
        </Card>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["📍","Points GPS",trail.length],["⏱","Durée",fmtDur(seconds)],["🎯","Précision",last?`±${last.accuracy}m`:"—"],["📅","Date",todayISO()]].map(([ic,l,v])=>(
            <div key={l} style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:20}}>{ic}</div>
              <div style={{fontSize:16,fontWeight:800,color:C.sky,marginTop:4}}>{v}</div>
              <div style={{fontSize:11,color:C.muted,fontWeight:700,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <Card>
        <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>🗺️ Points enregistrés ({trail.length})</h3>
        {!trail.length
          ?<div style={{height:180,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,flexDirection:"column",gap:8}}><div style={{fontSize:36}}>📍</div><div style={{fontSize:13,fontWeight:700}}>Démarrez pour voir les points</div></div>
          :<div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
            {[...trail].reverse().map((pt,i)=>(
              <div key={i} style={{padding:"8px 12px",background:i===0?C.skyLL:C.bg,borderRadius:8,border:`1.5px solid ${C.border}`}}>
                <div style={{fontSize:12,fontWeight:700,color:C.text}}>📍 {pt.lat}, {pt.lng}</div>
                <div style={{fontSize:10,color:C.muted,fontWeight:600}}>±{pt.accuracy}m · {new Date(pt.ts).toLocaleTimeString("fr-FR")}</div>
              </div>
            ))}
          </div>
        }
        {last&&<a href={`https://maps.google.com/maps?q=${last.lat},${last.lng}`} target="_blank" rel="noopener noreferrer" style={{display:"block",marginTop:12,textAlign:"center",background:C.skyLL,color:C.nav1,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"9px",fontSize:12,fontWeight:800,textDecoration:"none"}}>🗺️ Voir ma position sur Google Maps</a>}
      </Card>
    </div>
  </div>
  );
}

// ════════════ FORMULAIRE PLAINTE ════════════
function PlainteForm({user}) {
  const [form,setForm]=useState({type:PLAINT_TYPES[0],description:"",urgence:"Normal"});
  const [loc,setLoc]=useState({lat:"",lng:""});
  const [photo,setPhoto]=useState(null);
  const [saving,setSaving]=useState(false);
  const [done,setDone]=useState(false);
  const [gpsL,setGpsL]=useState(false);
  const photoRef=useRef(null);

  const capturePos=()=>{
    setGpsL(true);
    navigator.geolocation?.getCurrentPosition(
      p=>{setLoc({lat:p.coords.latitude.toFixed(6),lng:p.coords.longitude.toFixed(6)});setGpsL(false);},
      ()=>setGpsL(false)
    );
  };

  const handlePhoto=e=>{
    const file=e.target.files[0];
    if(!file)return;
    if(file.size>5*1024*1024){alert("Photo trop lourde (max 5MB).");return;}
    const reader=new FileReader();
    reader.onload=ev=>setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const submit=async()=>{
    if(!form.description.trim()){alert("⚠️ Décrivez le problème.");return;}
    setSaving(true);
    const{error}=await savePlainte(user,{...form,...loc,photo});
    setSaving(false);
    if(error){alert("Erreur lors de l'envoi. Réessayez.");return;}
    setDone(true);
  };

  if(done)return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"50vh"}}>
      <Card style={{textAlign:"center",maxWidth:420,padding:40}}>
        <div style={{fontSize:52,marginBottom:12}}>📨</div>
        <h2 style={{fontSize:17,fontWeight:800,color:C.text,marginBottom:10}}>Signalement envoyé !</h2>
        <p style={{color:C.muted,fontSize:13,fontWeight:600,marginBottom:18}}>Transmis au Superviseur et au Directeur Commercial.</p>
        <Btn onClick={()=>{setDone(false);setForm({type:PLAINT_TYPES[0],description:"",urgence:"Normal"});setLoc({lat:"",lng:""});setPhoto(null);}} icon="➕" full>Nouveau signalement</Btn>
      </Card>
    </div>
  );

  const urgColor2={
    Normal:{bg:C.successL,c:C.success,icon:"🟢"},
    Moyen:{bg:C.warnL,c:C.warn,icon:"🟡"},
    Haute:{bg:"#FFF7ED",c:C.orange,icon:"🟠"},
    Critique:{bg:C.dangerL,c:C.danger,icon:"🔴"}
  };

  return (
    <div style={{animation:"fadeIn 0.3s ease",maxWidth:680}}>
      <PageTitle title="⚠️ Signaler un problème" sub="Transmis au Superviseur et au Directeur Commercial"/>
      <Card>
        <FSelect label="Type de problème" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
          {PLAINT_TYPES.map(t=><option key={t}>{t}</option>)}
        </FSelect>

        <div style={{marginBottom:14}}>
          <FL>Niveau d'urgence</FL>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {PLAINT_LEVELS.map(v=>{
              const uc=urgColor2[v]||urgColor2.Normal;
              const active=form.urgence===v;
              return (
                <div key={v} onClick={()=>setForm(f=>({...f,urgence:v}))}
                  style={{textAlign:"center",padding:"10px 6px",borderRadius:9,cursor:"pointer",border:`2px solid ${active?uc.c:C.border}`,background:active?uc.bg:C.white,fontSize:12,fontWeight:active?800:600,color:active?uc.c:C.muted,transition:"all 0.15s"}}>
                  <div style={{fontSize:18,marginBottom:3}}>{uc.icon}</div>{v}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <FL required>Description du problème</FL>
          <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
            placeholder="Décrivez le problème en détail : quoi, où, avec qui, quand..."
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:9,padding:"10px 13px",fontSize:13,fontWeight:600,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#FAFEFF",color:C.text,height:110,resize:"vertical"}}/>
        </div>

        {/* UPLOAD PHOTO */}
        <div style={{marginBottom:14}}>
          <FL>Photo / Document (optionnel)</FL>
          <input type="file" ref={photoRef} accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
          {!photo?(
            <div onClick={()=>photoRef.current?.click()}
              style={{border:`2px dashed ${C.border}`,borderRadius:10,padding:"20px",textAlign:"center",cursor:"pointer",background:C.bg,transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.sky;e.currentTarget.style.background=C.skyLL;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bg;}}>
              <div style={{fontSize:32,marginBottom:6}}>📸</div>
              <div style={{fontSize:13,fontWeight:700,color:C.muted}}>Cliquez pour téléverser une photo</div>
              <div style={{fontSize:11,color:C.light,marginTop:3,fontWeight:600}}>JPG, PNG, WEBP · Max 5 MB</div>
            </div>
          ):(
            <div style={{position:"relative",borderRadius:10,overflow:"hidden",border:`1.5px solid ${C.border}`}}>
              <img src={photo} alt="Photo signalement" style={{width:"100%",maxHeight:200,objectFit:"contain",display:"block",background:C.bg}}/>
              <button onClick={()=>setPhoto(null)} style={{position:"absolute",top:8,right:8,background:C.danger,border:"none",color:"#FFF",borderRadius:999,width:28,height:28,cursor:"pointer",fontSize:14,fontWeight:700}}>✕</button>
              <div style={{padding:"6px 10px",background:C.successL,fontSize:11,fontWeight:700,color:C.success}}>✅ Photo ajoutée</div>
            </div>
          )}
        </div>

        <div style={{marginBottom:18}}>
          <FL>Position GPS (optionnel)</FL>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            {loc.lat
              ?<div style={{flex:1,background:C.successL,border:"1px solid #A7F3D0",borderRadius:9,padding:"9px 12px",fontSize:12,fontWeight:700,color:C.success}}>📍 {loc.lat}, {loc.lng}</div>
              :<Btn onClick={capturePos} variant="secondary" icon="📍">{gpsL?"Acquisition...":"Capturer ma position"}</Btn>
            }
            {loc.lat&&<Btn onClick={()=>setLoc({lat:"",lng:""})} variant="danger" sm icon="✕">Effacer</Btn>}
          </div>
        </div>

        <Btn onClick={submit} disabled={saving} icon={saving?"⏳":"📤"} full variant="navy">
          {saving?"Envoi en cours...":"Envoyer le signalement"}
        </Btn>
      </Card>
    </div>
  );
}

// ════════════ LOCALISATION CARTE ════════════
function LocalisationMap() {
  const [points,setPoints]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selId,setSelId]=useState(null);
  const mapRef=useRef(null);
  const mapInstRef=useRef(null);
  const timerRef=useRef(null);

  const loadData=useCallback(async()=>{
    const data=await loadGPSToday();
    setPoints(data);setLoading(false);
  },[]);

  useEffect(()=>{
    loadData();
    timerRef.current=setInterval(loadData,15000);
    return()=>clearInterval(timerRef.current);
  },[loadData]);

  const buildMap=useCallback((pts)=>{
    if(!mapRef.current)return;
    const initMap=()=>{
      if(mapInstRef.current){mapInstRef.current.remove();mapInstRef.current=null;}
      const L=window.L;
      const map=L.map(mapRef.current).setView([-4.3217,15.3222],12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap"}).addTo(map);
      const byDel={};
      pts.forEach(p=>{if(!byDel[p.delegue_id])byDel[p.delegue_id]={info:p,pts:[]};byDel[p.delegue_id].pts.push([p.lat,p.lng]);});
      Object.values(byDel).forEach((d,i)=>{
        const col=CHART_COLS[i%CHART_COLS.length];
        if(d.pts.length>1)L.polyline(d.pts,{color:col,weight:3.5,opacity:0.85}).addTo(map);
        if(d.pts.length>0){
          L.circleMarker(d.pts[0],{radius:5,color:col,fillColor:"#FFF",fillOpacity:1,weight:2}).addTo(map);
          L.circleMarker(d.pts[d.pts.length-1],{radius:9,color:col,fillColor:col,fillOpacity:1}).addTo(map)
            .bindPopup(`<b>${d.info.prenom} ${d.info.nom}</b><br>N°${d.info.num||"—"}<br><small>Dernier point : ${new Date(d.info.created_at).toLocaleTimeString("fr-FR")}</small>`);
        }
      });
      if(pts.length>0)map.fitBounds(pts.map(p=>[p.lat,p.lng]),{padding:[30,30]});
      mapInstRef.current=map;
    };
    if(window.L){initMap();return;}
    if(!document.getElementById("lf-css")){const l=document.createElement("link");l.id="lf-css";l.rel="stylesheet";l.href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";document.head.appendChild(l);}
    if(!document.getElementById("lf-js")){const s=document.createElement("script");s.id="lf-js";s.src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";s.onload=initMap;document.head.appendChild(s);}
    else setTimeout(()=>{if(window.L)initMap();},500);
  },[]);

  useEffect(()=>{if(points.length>0&&mapRef.current)buildMap(points);},[points,buildMap]);

  const byDel={};
  points.forEach(p=>{if(!byDel[p.delegue_id])byDel[p.delegue_id]={id:p.delegue_id,nom:p.nom,prenom:p.prenom,num:p.num,pts:[]};byDel[p.delegue_id].pts.push(p);});
  const delList=Object.values(byDel);

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🗺️ Localisation en temps réel"
        sub="Actualisation automatique toutes les 15 secondes"
        action={<div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{fontSize:11,fontWeight:800,color:C.success,background:C.successL,padding:"4px 10px",borderRadius:999,border:`1px solid #A7F3D0`}}>● LIVE</div>
          <Btn onClick={loadData} variant="secondary" icon="🔄" sm>Actualiser</Btn>
        </div>}/>

      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:14}}>
        <div>
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:800,color:C.text,textTransform:"uppercase",letterSpacing:0.6,marginBottom:10}}>
              Délégués actifs — {delList.length}
            </div>
            {loading&&<div style={{textAlign:"center",color:C.muted,padding:"20px 0",fontSize:13,fontWeight:600}}>⏳ Chargement...</div>}
            {!loading&&!delList.length&&(
              <div style={{textAlign:"center",color:C.muted,padding:"20px 0"}}>
                <div style={{fontSize:30,marginBottom:6}}>📍</div>
                <div style={{fontSize:12,fontWeight:700}}>Aucun délégué actif aujourd'hui</div>
              </div>
            )}
            {delList.map((d,i)=>{
              const last=d.pts[d.pts.length-1];
              return (
                <div key={d.id} onClick={()=>setSelId(selId===d.id?null:d.id)}
                  style={{padding:"10px 12px",borderRadius:9,marginBottom:6,cursor:"pointer",border:`2px solid ${selId===d.id?CHART_COLS[i%CHART_COLS.length]:C.border}`,background:selId===d.id?C.skyLL:C.bg,transition:"all 0.12s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:CHART_COLS[i%CHART_COLS.length],flexShrink:0,boxShadow:`0 0 0 3px ${CHART_COLS[i%CHART_COLS.length]}33`}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:800,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.prenom} {d.nom}</div>
                      <div style={{fontSize:10,color:C.muted,fontWeight:600}}>N°{d.num||"—"} · {d.pts.length} point(s)</div>
                    </div>
                  </div>
                  {selId===d.id&&last&&(
                    <div style={{marginTop:8,fontSize:10,color:C.muted,lineHeight:1.8,background:C.white,borderRadius:6,padding:"7px 10px",border:`1px solid ${C.border}`}}>
                      <div style={{fontWeight:800,color:C.text}}>📍 {last.lat}, {last.lng}</div>
                      <div style={{fontWeight:600}}>🕐 {new Date(last.created_at).toLocaleTimeString("fr-FR")}</div>
                      <div style={{fontWeight:600}}>🎯 ±{last.accuracy}m précision</div>
                      <a href={`https://maps.google.com/maps?q=${last.lat},${last.lng}`} target="_blank" rel="noopener noreferrer"
                        style={{display:"block",marginTop:5,color:C.sky,fontWeight:800,textDecoration:"none",fontSize:11}}>
                        📌 Ouvrir dans Google Maps →
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
          <Card>
            <div style={{fontSize:11,fontWeight:800,color:C.text,textTransform:"uppercase",letterSpacing:0.6,marginBottom:8}}>Légende des trajectoires</div>
            {delList.map((d,i)=>(
              <div key={d.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <div style={{width:20,height:3,background:CHART_COLS[i%CHART_COLS.length],borderRadius:2,flexShrink:0}}/>
                <span style={{fontSize:11,color:C.muted,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.prenom} {d.nom}</span>
              </div>
            ))}
          </Card>
        </div>
        <div ref={mapRef} style={{height:"calc(100vh - 200px)",minHeight:440,borderRadius:14,border:`1.5px solid ${C.border}`,background:C.bg,position:"relative",overflow:"hidden"}}>
          {!points.length&&!loading&&(
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:C.muted}}>
              <div style={{fontSize:48}}>🗺️</div>
              <div style={{fontSize:15,fontWeight:800,color:C.text}}>Aucune donnée GPS aujourd'hui</div>
              <div style={{fontSize:12,fontWeight:600,color:C.muted}}>Les délégués doivent activer leur GPS terrain</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════ PLAINTES VIEW ════════════
function PlaintesView() {
  const [plaintes,setPlaintes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  const [photoModal,setPhotoModal]=useState(null);

  useEffect(()=>{loadPlaintes().then(d=>{setPlaintes(d);setLoading(false);});},[]);

  const update=async(id,statut)=>{
    await updatePlainteStatut(id,statut);
    setPlaintes(prev=>prev.map(p=>p.id===id?{...p,statut}:p));
  };

  const filtered=filter==="all"?plaintes:plaintes.filter(p=>p.statut===filter);
  const statColor={nouveau:{bg:C.dangerL,c:C.danger},en_cours:{bg:C.warnL,c:C.warn},traite:{bg:C.successL,c:C.success}};

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      {photoModal&&(
        <div onClick={()=>setPhotoModal(null)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20,cursor:"zoom-out"}}>
          <img src={photoModal} alt="Photo signalement" style={{maxWidth:"95vw",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}}/>
        </div>
      )}
      <PageTitle title="⚠️ Signalements & Plaintes" sub={`${plaintes.length} signalement(s) au total`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12,marginBottom:16}}>
        <StatCard icon="🔴" label="Nouveaux" value={plaintes.filter(p=>p.statut==="nouveau").length} color={C.danger}/>
        <StatCard icon="🟡" label="En cours" value={plaintes.filter(p=>p.statut==="en_cours").length} color={C.warn}/>
        <StatCard icon="✅" label="Traités" value={plaintes.filter(p=>p.statut==="traite").length} color={C.success}/>
        <StatCard icon="🚨" label="Critiques" value={plaintes.filter(p=>p.urgence==="Critique").length} color={C.danger}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {[["all","Tous"],["nouveau","Nouveaux"],["en_cours","En cours"],["traite","Traités"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)}
            style={{padding:"7px 16px",borderRadius:999,border:`1.5px solid ${filter===v?C.sky:C.border}`,background:filter===v?C.sky:C.white,color:filter===v?"#FFF":C.muted,fontWeight:filter===v?800:600,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>
            {l}
          </button>
        ))}
      </div>
      {loading&&<div style={{textAlign:"center",padding:48,color:C.muted,fontWeight:700}}>⏳ Chargement...</div>}
      {!loading&&!filtered.length&&<Card style={{textAlign:"center",padding:48,color:C.muted,fontWeight:700}}>Aucun signalement trouvé.</Card>}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(p=>{
          const uc=URGENCE_COLOR[p.urgence]||C.warn;
          const sc=statColor[p.statut]||statColor.nouveau;
          return (
            <Card key={p.id} style={{borderLeft:`5px solid ${uc}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8,flexWrap:"wrap"}}>
                    <div style={{fontSize:12,fontWeight:800,color:C.text}}>{p.prenom} {p.nom}</div>
                    <Badge color="navy" size="xs">N°{p.num||"—"}</Badge>
                    <span style={{background:uc+"22",color:uc,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:999,border:`1px solid ${uc}44`}}>
                      {(p.urgence||"").toUpperCase()}
                    </span>
                    <span style={{background:sc.bg,color:sc.c,fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:999}}>
                      {(p.statut||"").replace("_"," ")}
                    </span>
                  </div>
                  <div style={{fontSize:13,fontWeight:800,color:C.nav1,marginBottom:5}}>📋 {p.type_plainte}</div>
                  <div style={{fontSize:13,color:C.text,lineHeight:1.7,fontWeight:600}}>{p.description}</div>
                  <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontSize:11,color:C.light,fontWeight:700}}>🕐 {new Date(p.created_at).toLocaleString("fr-FR")}</span>
                    {p.lat&&p.lng&&(
                      <a href={`https://maps.google.com/maps?q=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer"
                        style={{fontSize:11,color:C.sky,fontWeight:800,textDecoration:"none"}}>📍 Voir position</a>
                    )}
                    {p.photo_base64&&(
                      <button onClick={()=>setPhotoModal(p.photo_base64)}
                        style={{fontSize:11,color:C.magenta,fontWeight:800,background:"none",border:"none",cursor:"pointer",padding:0}}>
                        📸 Voir photo
                      </button>
                    )}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",flexShrink:0}}>
                  {p.statut!=="en_cours"&&<Btn onClick={()=>update(p.id,"en_cours")} variant="warn" icon="🔄" sm>En cours</Btn>}
                  {p.statut!=="traite"&&<Btn onClick={()=>update(p.id,"traite")} variant="success" icon="✅" sm>Traité</Btn>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ════════════ DASHBOARD ════════════
function Dashboard({user}) {
  const all=loadReports();
  const now=new Date();const month=now.getMonth();const year=now.getFullYear();
  const todayR=all.filter(r=>r.date===todayISO());
  const monthR=all.filter(r=>{const d=new Date(r.date);return d.getMonth()===month&&d.getFullYear()===year;});
  const totalCA=all.reduce((s,r)=>s+(r.totalCA||0),0);
  const monthCA=monthR.reduce((s,r)=>s+(r.totalCA||0),0);

  const byDel={};
  all.forEach(r=>{const k=`${r.prenom} ${(r.nom||"").split(" ")[0]}`;byDel[k]=(byDel[k]||0)+(r.totalCA||0);});
  const barData=Object.entries(byDel).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,ca])=>({name,ca:parseFloat(ca.toFixed(2))}));
  const trendData=Array.from({length:7},(_,i)=>{
    const d=new Date();d.setDate(d.getDate()-6+i);
    const iso=d.toISOString().split("T")[0];
    const ca=all.filter(r=>r.date===iso).reduce((s,r)=>s+(r.totalCA||0),0);
    return{jour:d.toLocaleDateString("fr-FR",{weekday:"short"}),ca:parseFloat(ca.toFixed(2))};
  });
  const pCount={};
  all.forEach(r=>r.lignes?.forEach(l=>{pCount[l.code]=(pCount[l.code]||0)+(l.qte||0);}));
  const pieData=Object.entries(pCount).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({name,value}));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <img src={LOGO_URL} alt="Logo" style={{width:44,height:44,objectFit:"contain",borderRadius:8,border:`1.5px solid ${C.border}`,padding:3}} onError={e=>e.target.style.display="none"}/>
        <div>
          <h1 style={{fontSize:18,fontWeight:800,color:C.text,margin:"0 0 2px"}}>Tableau de bord commercial</h1>
          <p style={{color:C.muted,fontSize:12,margin:0,fontWeight:700}}>LabPro Pharma RDC · {todayFR()} · {ROLE_LABEL[user.role]}</p>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        <StatCard icon="📊" label="Rapports aujourd'hui" value={todayR.length} color={C.sky}/>
        <StatCard icon="📅" label="Rapports ce mois" value={monthR.length} color={C.nav1}/>
        <StatCard icon="💰" label="CA mensuel (USD)" value={`$${fmt(monthCA)}`} color={C.success}/>
        <StatCard icon="🏆" label="CA global (USD)" value={`$${fmt(totalCA)}`} color={C.warn}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:14}}>
        <Card>
          <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>📈 Évolution CA — 7 derniers jours</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/>
              <XAxis dataKey="jour" tick={{fontSize:11,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/>
              <Tooltip formatter={v=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700}}/>
              <Line type="monotone" dataKey="ca" stroke={C.sky} strokeWidth={2.5} dot={{r:4,fill:C.sky}} activeDot={{r:7}}/>
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>🧪 Top produits vendus</h3>
          {pieData.length
            ?<ResponsiveContainer width="100%" height={180}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={80} dataKey="value">{pieData.map((_,i)=><Cell key={i} fill={CHART_COLS[i%CHART_COLS.length]}/>)}</Pie><Tooltip contentStyle={{borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700}}/><Legend wrapperStyle={{fontSize:10,fontWeight:700}}/></PieChart></ResponsiveContainer>
            :<div style={{height:180,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13,fontWeight:700}}>Aucune donnée</div>
          }
        </Card>
      </div>
      <Card>
        <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>👥 CA par délégué (total)</h3>
        {barData.length
          ?<ResponsiveContainer width="100%" height={190}><BarChart data={barData} barSize={32}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/><XAxis dataKey="name" tick={{fontSize:11,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/><Tooltip formatter={v=>`$${fmt(v)}`} contentStyle={{borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700}}/><Bar dataKey="ca" fill={C.sky} radius={[6,6,0,0]} label={{position:"top",fontSize:10,fill:C.muted,fontWeight:700,formatter:v=>v>0?`$${v}`:""}} /></BarChart></ResponsiveContainer>
          :<div style={{height:190,display:"flex",alignItems:"center",justifyContent:"center",color:C.light,fontSize:13,fontWeight:700}}>Aucun rapport enregistré.</div>
        }
      </Card>
    </div>
  );
}

// ════════════ TOUS LES RAPPORTS ════════════
function TousLesRapports() {
  const [search,setSearch]=useState("");const [dateF,setDateF]=useState("");const [exp,setExp]=useState(null);
  const all=loadReports();
  const filtered=all.filter(r=>{
    const q=search.toLowerCase();
    return(!search||`${r.prenom} ${r.nom} ${r.secteurs}`.toLowerCase().includes(q)||r.lignes?.some(l=>l.client.toLowerCase().includes(q)))&&(!dateF||r.date===dateF);
  }).sort((a,b)=>b.date.localeCompare(a.date));

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="📋 Tous les rapports" sub={`${filtered.length} rapport(s)`}
        action={<Btn onClick={()=>exportExcelCompil(filtered,"Tous Rapports")} icon="⬇" variant="navy">Exporter .xlsx</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:10,marginBottom:14,alignItems:"center"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:C.light,fontSize:14}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher délégué, secteur, client..."
            style={{width:"100%",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px 9px 34px",fontSize:13,fontWeight:600,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"#FAFEFF",color:C.text}}/>
        </div>
        <input type="date" value={dateF} onChange={e=>setDateF(e.target.value)}
          style={{border:`1.5px solid ${C.border}`,borderRadius:10,padding:"9px 12px",fontSize:13,fontWeight:700,outline:"none",fontFamily:"inherit",background:"#FAFEFF",color:C.text}}/>
        {(search||dateF)&&<Btn onClick={()=>{setSearch("");setDateF("");}} variant="danger" sm icon="✕">Effacer</Btn>}
      </div>
      {!filtered.length?<Card style={{textAlign:"center",padding:48,color:C.muted,fontWeight:700}}>Aucun rapport trouvé.</Card>:
      <Card p="0" style={{overflow:"hidden"}}>
        <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:580}}>
            <thead><tr style={{background:C.skyLL}}>
              {["Délégué","N°","Date","Secteurs","Ventes","CA (USD)","Sig.","Actions"].map(h=>(
                <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(r=>(
                <React.Fragment key={r.id}>
                  <tr style={{borderBottom:`1px solid ${C.skyLL}`,cursor:"pointer"}}
                    onClick={()=>setExp(exp===r.id?null:r.id)}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:C.sky,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:800,flexShrink:0}}>{initials(r)}</div>
                        <span style={{fontSize:12,fontWeight:800,color:C.text}}>{r.prenom} {r.nom}</span>
                      </div>
                    </td>
                    <td style={{padding:"10px 12px"}}><Badge color="navy" size="xs">{r.num||"—"}</Badge></td>
                    <td style={{padding:"10px 12px",fontSize:12,fontWeight:700,color:C.muted,whiteSpace:"nowrap"}}>{r.date}</td>
                    <td style={{padding:"10px 12px",fontSize:11,color:C.muted,fontWeight:600,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.secteurs}</td>
                    <td style={{padding:"10px 12px"}}><Badge size="xs">{r.lignes?.length||0}</Badge></td>
                    <td style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:C.success}}>{fmt(r.totalCA)} $</td>
                    <td style={{padding:"10px 12px"}}>{r.signature?<Badge color="green" size="xs">✓</Badge>:<Badge color="warn" size="xs">—</Badge>}</td>
                    <td style={{padding:"10px 12px"}}>
                      <div style={{display:"flex",gap:5,alignItems:"center"}}>
                        <Btn onClick={e=>{e.stopPropagation();exportExcel(r);}} variant="success" icon="⬇" sm>xlsx</Btn>
                        <span style={{color:C.light,fontSize:13,fontWeight:700}}>{exp===r.id?"▲":"▼"}</span>
                      </div>
                    </td>
                  </tr>
                  {exp===r.id&&(
                    <tr key={r.id+"_e"}><td colSpan={8} style={{padding:0}}>
                      <div style={{background:"#F8FCFF",padding:"12px 14px",borderBottom:`2px solid ${C.border}`}}>
                        <div style={{overflowX:"auto"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:480}}>
                            <thead><tr>{["Code","Item","Qté","Montant","Client","Adresse","Tél","GPS"].map(h=>(
                              <th key={h} style={{padding:"6px 9px",textAlign:"left",fontSize:9,fontWeight:800,color:C.text,borderBottom:`1px solid ${C.border}`,textTransform:"uppercase"}}>{h}</th>
                            ))}</tr></thead>
                            <tbody>{(r.lignes||[]).map((l,i)=>(
                              <tr key={i} style={{borderBottom:`1px solid ${C.skyLL}`}}>
                                <td style={{padding:"5px 9px",fontFamily:"monospace",fontWeight:800,color:C.nav1,fontSize:11}}>{l.code}</td>
                                <td style={{padding:"5px 9px",fontWeight:700}}>{l.item}</td>
                                <td style={{padding:"5px 9px",textAlign:"center",fontWeight:800}}>{l.qte}</td>
                                <td style={{padding:"5px 9px",fontWeight:800,color:C.success}}>{fmt(l.montant)}$</td>
                                <td style={{padding:"5px 9px",fontWeight:700}}>{l.client}</td>
                                <td style={{padding:"5px 9px",color:C.muted,fontWeight:600}}>{l.adresse}</td>
                                <td style={{padding:"5px 9px",color:C.muted,fontWeight:600}}>{l.tel}</td>
                                <td style={{padding:"5px 9px",fontSize:10,color:C.sky,fontWeight:700}}>{l.lat&&l.lng?`${l.lat}, ${l.lng}`:"—"}</td>
                              </tr>
                            ))}</tbody>
                          </table>
                        </div>
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>}
    </div>
  );
}

// ════════════ CLASSEMENT ════════════
function Classement() {
  const all=loadReports();const now=new Date();const month=now.getMonth();const year=now.getFullYear();
  const mR=all.filter(r=>{const d=new Date(r.date);return d.getMonth()===month&&d.getFullYear()===year;});
  const objectifs=loadObjectifs();
  const stats={};
  mR.forEach(r=>{
    if(!stats[r.delegueId])stats[r.delegueId]={id:r.delegueId,num:r.num,nom:r.nom,prenom:r.prenom,ca:0,ventes:0,clients:0,jours:new Set()};
    stats[r.delegueId].ca+=(r.totalCA||0);
    stats[r.delegueId].ventes+=(r.lignes?.length||0);
    stats[r.delegueId].clients+=(r.nbClients||0);
    stats[r.delegueId].jours.add(r.date);
  });
  const ranking=Object.values(stats).map(s=>({...s,jours:s.jours.size})).sort((a,b)=>b.ca-a.ca);
  const medals=["🥇","🥈","🥉"];
  const mColors=[C.warn,"#94A3B8","#CD7F32"];

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="🏆 Classement des Délégués" sub={now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"})}/>
      {!ranking.length?<Card style={{textAlign:"center",padding:56,color:C.muted,fontWeight:700}}>Aucune donnée ce mois.</Card>:<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(185px,1fr))",gap:12,marginBottom:18}}>
          {ranking.slice(0,3).map((d,i)=>{
            const objKey=`${d.id}_${year}_${month}`;
            const obj=parseFloat(objectifs[objKey])||0;
            const pct=obj>0?Math.min(100,Math.round((d.ca/obj)*100)):null;
            return (
              <Card key={i} style={{textAlign:"center",border:`2px solid ${mColors[i]||C.border}`,boxShadow:i===0?"0 8px 28px rgba(217,119,6,0.18)":"none"}}>
                <div style={{fontSize:38,marginBottom:6}}>{medals[i]}</div>
                <div style={{width:46,height:46,borderRadius:"50%",background:mColors[i]||C.sky,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"#FFF",margin:"0 auto 8px"}}>{initials(d)}</div>
                <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 3px"}}>{d.prenom} {(d.nom||"").split(" ")[0]}</h3>
                <div style={{fontSize:19,fontWeight:800,color:mColors[i],margin:"4px 0 8px"}}>${fmt(d.ca)}</div>
                {pct!==null&&<div style={{marginBottom:8}}>
                  <div style={{background:C.skyLL,borderRadius:999,height:6,border:`1px solid ${C.border}`}}>
                    <div style={{background:pct>=100?C.success:C.sky,borderRadius:999,height:"100%",width:`${pct}%`}}/>
                  </div>
                  <div style={{fontSize:10,fontWeight:800,color:C.muted,marginTop:3}}>Objectif : {pct}%</div>
                </div>}
                <div style={{display:"flex",justifyContent:"center",gap:5,flexWrap:"wrap"}}>
                  <Badge color={i===0?"warn":"sky"} size="xs">{d.ventes} ventes</Badge>
                  <Badge color="green" size="xs">{d.clients} clients</Badge>
                </div>
              </Card>
            );
          })}
        </div>
        <Card p="0" style={{overflow:"hidden"}}>
          <div style={{padding:"11px 14px",background:C.nav1}}><h3 style={{color:"#FFF",fontSize:13,fontWeight:800,margin:0}}>Classement complet</h3></div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
              <thead><tr style={{background:C.skyLL}}>
                {["Rang","N°","Délégué(e)","CA (USD)","Ventes","Clients","Jours","Objectif"].map(h=>(
                  <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{ranking.map((d,i)=>{
                const objKey=`${d.id}_${year}_${month}`;
                const obj=parseFloat(objectifs[objKey])||0;
                const pct=obj>0?Math.min(100,Math.round((d.ca/obj)*100)):null;
                return (
                  <tr key={d.id} style={{borderBottom:`1px solid ${C.skyLL}`,background:i===0?"#FFFBEB":"transparent"}}
                    onMouseEnter={e=>e.currentTarget.style.background=i===0?"#FEF3C7":C.bg}
                    onMouseLeave={e=>e.currentTarget.style.background=i===0?"#FFFBEB":"transparent"}>
                    <td style={{padding:"11px 12px",fontSize:20}}>{medals[i]||`#${i+1}`}</td>
                    <td style={{padding:"11px 12px"}}><Badge color="navy" size="xs">{d.num||"—"}</Badge></td>
                    <td style={{padding:"11px 12px"}}><div style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:mColors[i]||C.sky,display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:800,flexShrink:0}}>{initials(d)}</div>
                      <div><div style={{fontSize:12,fontWeight:800,color:C.text}}>{d.prenom} {d.nom}</div></div>
                    </div></td>
                    <td style={{padding:"11px 12px",fontSize:13,fontWeight:800,color:C.success}}>{fmt(d.ca)} $</td>
                    <td style={{padding:"11px 12px"}}><Badge size="xs">{d.ventes}</Badge></td>
                    <td style={{padding:"11px 12px"}}><Badge color="green" size="xs">{d.clients}</Badge></td>
                    <td style={{padding:"11px 12px"}}><Badge color="navy" size="xs">{d.jours} j</Badge></td>
                    <td style={{padding:"11px 12px",minWidth:100}}>
                      {pct!==null?<div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{background:C.bg,borderRadius:4,height:6,flex:1,border:`1px solid ${C.border}`}}><div style={{background:pct>=100?C.success:C.sky,borderRadius:4,height:"100%",width:`${pct}%`}}/></div>
                        <span style={{fontSize:10,fontWeight:800,color:pct>=100?C.success:C.muted,minWidth:28}}>{pct}%</span>
                      </div>:<span style={{fontSize:10,color:C.light,fontWeight:700}}>Non défini</span>}
                    </td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </Card>
      </>}
    </div>
  );
}

// ════════════ COMPILATION ════════════
function Compilation({type}) {
  const all=loadReports();const now=new Date();
  let filtered,titre;
  if(type==="hebdo"){const ws=new Date();ws.setDate(ws.getDate()-7);filtered=all.filter(r=>new Date(r.date)>=ws);titre=`Semaine du ${ws.toLocaleDateString("fr-FR")} au ${now.toLocaleDateString("fr-FR")}`;}
  else{filtered=all.filter(r=>{const d=new Date(r.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});titre=now.toLocaleDateString("fr-FR",{month:"long",year:"numeric"});}
  const stats={};
  filtered.forEach(r=>{
    if(!stats[r.delegueId])stats[r.delegueId]={id:r.delegueId,num:r.num,prenom:r.prenom,nom:r.nom,ca:0,ventes:0,clients:0,rapports:0};
    stats[r.delegueId].ca+=(r.totalCA||0);
    stats[r.delegueId].ventes+=(r.lignes?.length||0);
    stats[r.delegueId].clients+=(r.nbClients||0);
    stats[r.delegueId].rapports++;
  });
  const rows=Object.values(stats).sort((a,b)=>b.ca-a.ca);
  const totalCA=rows.reduce((s,r)=>s+r.ca,0);
  const chartData=rows.map(r=>({name:r.prenom,ca:parseFloat(r.ca.toFixed(2)),ventes:r.ventes}));
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title={type==="hebdo"?"📅 Rapport Hebdomadaire":"🗓 Rapport Mensuel"} sub={titre}
        action={<Btn onClick={()=>exportExcelCompil(filtered,titre)} icon="⬇" variant="navy">Exporter .xlsx</Btn>}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:16}}>
        <StatCard icon="📊" label="Rapports" value={filtered.length} color={C.sky}/>
        <StatCard icon="👥" label="Délégués actifs" value={rows.length} color={C.nav1}/>
        <StatCard icon="🛍" label="Total ventes" value={rows.reduce((s,r)=>s+r.ventes,0)} color={C.success}/>
        <StatCard icon="💰" label="CA Total (USD)" value={`$${fmt(totalCA)}`} color={C.warn}/>
      </div>
      {chartData.length>0&&<Card style={{marginBottom:14}}>
        <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:"0 0 12px"}}>📊 Performance comparée</h3>
        <ResponsiveContainer width="100%" height={190}><BarChart data={chartData} barSize={32}><CartesianGrid strokeDasharray="3 3" stroke={C.skyLL}/><XAxis dataKey="name" tick={{fontSize:11,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:C.muted,fontWeight:700}} axisLine={false} tickLine={false}/><Tooltip formatter={(v,n)=>[n==="ca"?`$${fmt(v)}`:v,n==="ca"?"CA":"Ventes"]} contentStyle={{borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:12,fontWeight:700}}/><Legend wrapperStyle={{fontSize:11,fontWeight:700}}/><Bar dataKey="ca" name="CA (USD)" fill={C.sky} radius={[5,5,0,0]}/><Bar dataKey="ventes" name="Ventes" fill={C.success} radius={[5,5,0,0]}/></BarChart></ResponsiveContainer>
      </Card>}
      <Card p="0" style={{overflow:"hidden"}}>
        <div style={{padding:"11px 14px",background:C.nav1}}><h3 style={{color:"#FFF",fontSize:13,fontWeight:800,margin:0}}>Récapitulatif</h3></div>
        {!rows.length?<div style={{padding:40,textAlign:"center",color:C.muted,fontWeight:700}}>Aucune donnée.</div>:
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:480}}>
            <thead><tr style={{background:C.skyLL}}>{["Rang","N°","Délégué(e)","Rapports","Ventes","CA (USD)","Part (%)"].map(h=>(
              <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:9,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
            ))}</tr></thead>
            <tbody>{rows.map((r,i)=>{const pct=totalCA>0?Math.round((r.ca/totalCA)*100):0;return(
              <tr key={r.id} style={{borderBottom:`1px solid ${C.skyLL}`}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 12px",fontWeight:800,fontSize:18}}>{"🥇🥈🥉".split("")[i]||`#${i+1}`}</td>
                <td style={{padding:"10px 12px"}}><Badge color="navy" size="xs">{r.num||"—"}</Badge></td>
                <td style={{padding:"10px 12px",fontSize:12,fontWeight:800,color:C.text}}>{r.prenom} {r.nom}</td>
                <td style={{padding:"10px 12px"}}><Badge color="navy" size="xs">{r.rapports}</Badge></td>
                <td style={{padding:"10px 12px"}}><Badge size="xs">{r.ventes}</Badge></td>
                <td style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:C.success}}>{fmt(r.ca)} $</td>
                <td style={{padding:"10px 12px",minWidth:100}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{background:C.bg,borderRadius:4,height:6,flex:1,border:`1px solid ${C.border}`}}><div style={{background:C.sky,borderRadius:4,height:"100%",width:`${pct}%`}}/></div>
                    <span style={{fontSize:10,fontWeight:800,color:C.muted,minWidth:26}}>{pct}%</span>
                  </div>
                </td>
              </tr>
            );})}
            </tbody>
            <tfoot><tr style={{background:"#F0FDF4",borderTop:`2px solid #A7F3D0`}}>
              <td colSpan={5} style={{padding:"10px 12px",fontSize:13,fontWeight:800,color:C.text}}>TOTAL GÉNÉRAL</td>
              <td style={{padding:"10px 12px",fontSize:14,fontWeight:800,color:C.success}}>{fmt(totalCA)} USD</td>
              <td style={{padding:"10px 12px",fontSize:11,fontWeight:800,color:C.muted}}>100%</td>
            </tr></tfoot>
          </table>
        </div>}
      </Card>
    </div>
  );
}

// ════════════ GESTION UTILISATEURS ════════════
function GestionUtilisateurs() {
  const [users,setUsers]=useState([]);const [loading,setLoading]=useState(true);
  const [form,setForm]=useState({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""});
  const [saving,setSaving]=useState(false);const [msg,setMsg]=useState({text:"",type:""});const [tab,setTab]=useState("liste");
  const load=async()=>{setLoading(true);const{data}=await db.from("profiles").select("*").order("nom");setUsers(data||[]);setLoading(false);};
  useEffect(()=>{load();},[]);
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const showMsg=(text,type="success")=>{setMsg({text,type});setTimeout(()=>setMsg({text:"",type:""}),4000);};
  const createUser=async()=>{
    if(!form.email||!form.nom||!form.prenom||!form.password)return showMsg("Tous les champs obligatoires sont requis.","error");
    if(form.password.length<6)return showMsg("Mot de passe : au moins 6 caractères.","error");
    setSaving(true);
    const{data:authData,error:authErr}=await db.auth.signUp({email:form.email.trim().toLowerCase(),password:form.password,options:{data:{nom:form.nom,prenom:form.prenom}}});
    if(authErr){showMsg(`Erreur : ${authErr.message}`,"error");setSaving(false);return;}
    const{error:profErr}=await db.from("profiles").insert({id:authData.user.id,email:form.email.trim().toLowerCase(),nom:form.nom.trim().toUpperCase(),prenom:form.prenom.trim(),role:form.role,num:form.num.trim()||null,genre:form.genre,actif:true,created_at:nowTS()});
    if(profErr){showMsg(`Profil non créé : ${profErr.message}`,"error");setSaving(false);return;}
    showMsg(`✅ Compte créé pour ${form.prenom} ${form.nom}.`);
    setForm({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""});
    await load();setSaving(false);
  };
  const toggleActif=async u=>{
    await db.from("profiles").update({actif:!u.actif}).eq("id",u.id);
    showMsg(`${u.prenom} ${u.nom} : ${!u.actif?"activé":"désactivé"}.`);
    await load();
  };
  const roleGroups={directeur:"Direction",superviseur:"Superviseur",comptable:"Comptable",delegue:"Délégués Commerciaux"};
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <PageTitle title="👥 Gestion des Utilisateurs"/>
      {msg.text&&<div style={{background:msg.type==="error"?C.dangerL:C.successL,border:`1.5px solid ${msg.type==="error"?"#FCA5A5":"#A7F3D0"}`,borderRadius:10,padding:"11px 16px",fontSize:13,fontWeight:700,color:msg.type==="error"?C.danger:C.success,marginBottom:14}}>{msg.text}</div>}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {[["liste","📋 Liste"],["ajouter","➕ Ajouter"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:"9px 18px",borderRadius:999,border:`1.5px solid ${tab===id?C.sky:C.border}`,background:tab===id?C.sky:C.white,color:tab===id?"#FFF":C.muted,fontWeight:tab===id?800:600,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"}}>{lbl}</button>
        ))}
      </div>
      {tab==="liste"&&(
        <div>
          {loading?<div style={{textAlign:"center",padding:40,color:C.muted,fontWeight:700}}>⏳ Chargement...</div>:
          Object.entries(roleGroups).map(([role,title])=>{
            const group=users.filter(u=>u.role===role);
            if(!group.length)return null;
            return (
              <div key={role} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:ROLE_COLOR[role]}}/>
                  <h3 style={{fontSize:13,fontWeight:800,color:C.text,margin:0}}>{title} ({group.length})</h3>
                </div>
                <Card p="0" style={{overflow:"hidden"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead><tr style={{background:C.skyLL}}>
                      {["N°","Nom complet","Email","Statut","Actions"].map(h=>(
                        <th key={h} style={{padding:"9px 13px",textAlign:"left",fontSize:10,fontWeight:800,color:C.text,borderBottom:`2px solid ${C.border}`,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>{group.map(u=>(
                      <tr key={u.id} style={{borderBottom:`1px solid ${C.skyLL}`}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <td style={{padding:"9px 13px"}}><Badge color="navy" size="xs">{u.num||"—"}</Badge></td>
                        <td style={{padding:"9px 13px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div style={{width:28,height:28,borderRadius:"50%",background:ROLE_COLOR[u.role],display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontSize:10,fontWeight:800,flexShrink:0}}>{initials(u)}</div>
                            <div>
                              <div style={{fontSize:12,fontWeight:800,color:C.text}}>{u.prenom} {u.nom}</div>
                              <div style={{fontSize:10,color:C.light,fontWeight:700}}>{ROLE_LABEL[u.role]}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:"9px 13px",fontSize:12,color:C.muted,fontWeight:600}}>{u.email}</td>
                        <td style={{padding:"9px 13px"}}><Badge color={u.actif?"green":"red"} size="xs">{u.actif?"Actif":"Désactivé"}</Badge></td>
                        <td style={{padding:"9px 13px"}}><Btn onClick={()=>toggleActif(u)} variant={u.actif?"danger":"success"} sm icon={u.actif?"🔒":"🔓"}>{u.actif?"Désactiver":"Activer"}</Btn></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </Card>
              </div>
            );
          })}
        </div>
      )}
      {tab==="ajouter"&&(
        <Card style={{maxWidth:520}}>
          <h3 style={{fontSize:14,fontWeight:800,color:C.text,margin:"0 0 18px"}}>➕ Créer un nouveau compte</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <FInput label="Prénom" value={form.prenom} onChange={e=>setF("prenom",e.target.value)} placeholder="Ex: Jacques" required/>
            <FInput label="Nom" value={form.nom} onChange={e=>setF("nom",e.target.value)} placeholder="Ex: BOZITO" required/>
          </div>
          <FInput label="Email professionnel" value={form.email} onChange={e=>setF("email",e.target.value)} type="email" placeholder="prenom.nom@labpropharma.cd" required/>
          <FInput label="Mot de passe initial" value={form.password} onChange={e=>setF("password",e.target.value)} type="password" placeholder="Min. 6 caractères" required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 16px"}}>
            <FSelect label="Rôle" value={form.role} onChange={e=>setF("role",e.target.value)} required>
              <option value="delegue">Délégué(e)</option>
              <option value="superviseur">Superviseur</option>
              <option value="comptable">Comptable</option>
              <option value="directeur">Directeur</option>
            </FSelect>
            <FInput label="N° Agent" value={form.num} onChange={e=>setF("num",e.target.value)} placeholder="Ex: 02"/>
            <FSelect label="Genre" value={form.genre} onChange={e=>setF("genre",e.target.value)}>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </FSelect>
          </div>
          <div style={{background:C.skyLL,borderRadius:9,padding:"10px 13px",fontSize:12,fontWeight:700,color:C.nav1,marginBottom:16}}>
            ℹ️ Un email de confirmation sera envoyé. L'utilisateur doit cliquer sur le lien pour activer son compte.
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={createUser} disabled={saving} icon={saving?"⏳":"✅"} variant="navy">{saving?"Création...":"Créer le compte"}</Btn>
            <Btn onClick={()=>setForm({email:"",nom:"",prenom:"",role:"delegue",num:"",genre:"M",password:""})} variant="secondary" icon="🔄">Effacer</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ════════════ APP ROOT ════════════
const defaultView=role=>role==="delegue"?"rapport":role==="comptable"?"dashboard_c":role==="superviseur"?"localisation":"dashboard";

export default function App() {
  const [user,   setUser]   = useState(null);
  const [view,   setView]   = useState("");
  const [booted, setBooted] = useState(false);
  const [isMob,  setIsMob]  = useState(isMobileW());
  const [sideOpen,setSideOpen] = useState(false);

  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Inter',system-ui,sans-serif;background:#F0F9FF;-webkit-font-smoothing:antialiased;}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:#F0F9FF}
      ::-webkit-scrollbar-thumb{background:#BAE6FD;border-radius:3px}
      @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    `;
    document.head.appendChild(style);
    db.auth.getSession().then(async({data:{session}})=>{
      if(session?.user){
        const p=await getProfile(session.user.id);
        if(p&&p.actif){setUser({...p,authId:session.user.id});setView(defaultView(p.role));}
        else await db.auth.signOut();
      }
      setBooted(true);
    });
    const{data:{subscription}}=db.auth.onAuthStateChange(async(ev)=>{
      if(ev==="SIGNED_OUT"){setUser(null);setView("");}
    });
    const onResize=()=>setIsMob(isMobileW());
    window.addEventListener("resize",onResize);
    return()=>{document.head.removeChild(style);subscription.unsubscribe();window.removeEventListener("resize",onResize);};
  },[]);

  const onLogin =u=>{setUser(u);setView(defaultView(u.role));};
  const onLogout=async()=>{await db.auth.signOut();setUser(null);setView("");};
  const onNav   =v=>{setView(v);setSideOpen(false);};

  if(!booted)return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.nav2},${C.sky})`,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14}}>
      <img src={LOGO_URL} alt="Logo" style={{width:100,height:100,objectFit:"contain",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.4))"}} onError={e=>e.target.style.display="none"}/>
      <div style={{color:"rgba(255,255,255,0.6)",fontSize:14,fontWeight:700}}>Chargement de LabPro Sales v5...</div>
    </div>
  );

  if(!user)return <AuthPage onLogin={onLogin}/>;

  const renderView=()=>{
    switch(view){
      case "rapport":       return <NouveauRapport user={user}/>;
      case "historique":    return <HistoriqueDelegue user={user}/>;
      case "objectif":      return <MonObjectif user={user}/>;
      case "gps":           return <GPSTerrain user={user}/>;
      case "plainte":       return <PlainteForm user={user}/>;
      case "localisation":  return <LocalisationMap/>;
      case "plaintes":      return <PlaintesView/>;
      case "dashboard":
      case "dashboard_c":   return <Dashboard user={user}/>;
      case "rapports":
      case "rapports_c":    return <TousLesRapports/>;
      case "hebdo":         return <Compilation type="hebdo"/>;
      case "mensuel":       return <Compilation type="mensuel"/>;
      case "classement":    return <Classement/>;
      case "objectifs_dir": return user.role==="directeur"?<ObjectifsDirecteur/>:<Dashboard user={user}/>;
      case "users":         return user.role==="directeur"?<GestionUtilisateurs/>:<Dashboard user={user}/>;
      default:              return <Dashboard user={user}/>;
    }
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"inherit"}}>
      <Sidebar user={user} view={view} setView={onNav} onLogout={onLogout} mobile={isMob} open={sideOpen} onClose={()=>setSideOpen(false)}/>
      <div style={{flex:1,marginLeft:isMob?0:238,display:"flex",flexDirection:"column",minHeight:"100vh",background:"#F0F9FF"}}>
        {isMob&&<MobileHeader user={user} view={view} onMenuOpen={()=>setSideOpen(true)}/>}
        <main style={{flex:1,padding:isMob?"14px 12px 80px":"24px 28px",overflowX:"hidden"}}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
