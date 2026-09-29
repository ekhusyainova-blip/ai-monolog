/* ============================================================
   M = ⟨G(68,194), Ψ(0.36/0.31/0.33), Ω(0.42),
        ∮(arc→brg→ctr→core→convert→obs→wit→prt→fmt→att→lev→lex→gid→ahead),
        Λ(s·l·t·d·f·w),
        Γ(rt·st·ad·fx·nt·hm),
        Α(lg·ex·bf·mt·fl·dp),
        HOME(plan·pri·hints·gid),
        MODE(local·hybrid·remote),
        GIT(pull·push·ship·deploy)⟩⁵ᴰ
   ============================================================ */

/* ---------- G(68,194) · граф ---------- */
const G = (()=>{
  const nodes=["core","map","chat","monolog","cognitive","perception","chatY","klepa",
    "agents","learning","profile","sphere","viz-1d","viz-5d","social-5d","ring",
    "ui","archive","bridge","center","convert",
    "chat_voice","chat_avatar","social","subs","utility","lots","templates",
    "adapt","persona","game","travel","dims","sense","video","anim","movies",
    "blog","world","immersion",
    "gen_text","gen_avatar","gen_video_avatar","reputation",
    "anticipate","calendar","notifications","priority","focus","focus_hints",
    "obs_in","obs_out","wit_in","wit_out","prt_in","prt_out","fmt_in","fmt_out",
    "attention","levers","lexicon","gid",
    "logi","exchange","buffer","match","flow","dispatch",
    "mode","git"];

  const edges=[
    ["core","map",1],["core","chat",1],["core","monolog",1],["core","cognitive",1],
    ["core","perception",1],["core","chatY",1],["core","klepa",1],["core","agents",1],
    ["core","learning",1],["map","chat",1],["chat","monolog",1],["cognitive","perception",1],
    ["chatY","klepa",1],["klepa","agents",1],["agents","learning",1],
    ["perception","learning",1],["sphere","monolog",1.2],
    ["core","ui",1.5],["ui","profile",1],["ui","monolog",1],["ui","klepa",1],
    ["core","archive",1.3],["core","bridge",1.3],["core","center",1.3],
    ["archive","bridge",1.5],["archive","center",1.5],["bridge","center",1.5],
    ["ui","archive",1.2],["ui","bridge",1.2],["ui","center",1.2],
    ["core","convert",1.4],["ui","convert",1.3],["convert","archive",1.2],["convert","bridge",1.2],
    ["core","chat_voice",1.2],["chat","chat_voice",1.5],["chat_voice","chat_avatar",1.4],
    ["chat_avatar","social",1.3],["chat","perception",1],["chat_voice","sense",1.1],
    ["social","subs",1.5],["social","persona",1.4],["subs","persona",1.5],["persona","adapt",1.6],
    ["subs","utility",1.3],["social","lots",1.2],
    ["utility","lots",1.5],["lots","templates",1.2],["templates","adapt",1.3],
    ["utility","learning",1.1],["lots","bridge",1],["templates","convert",1.1],
    ["adapt","persona",1.6],["adapt","ui",1.5],["adapt","profile",1.2],["persona","profile",1.2],
    ["adapt","dims",1.3],
    ["game","agents",1.2],["game","learning",1.3],["game","persona",1.3],
    ["game","templates",1.2],["game","world",1.5],["game","immersion",1.4],
    ["travel","dims",1.5],["travel","world",1.5],["travel","sphere",1.2],["dims","sense",1.4],
    ["dims","viz-5d",1.3],["travel","immersion",1.5],
    ["sense","perception",1.5],["sense","cognitive",1.3],["sense","dims",1.4],
    ["sense","immersion",1.5],["sense","adapt",1.2],
    ["video","anim",1.4],["video","movies",1.5],["anim","blog",1.2],["movies","blog",1.3],
    ["video","world",1.2],["anim","world",1.1],["movies","persona",1.2],["blog","persona",1.3],
    ["world","immersion",1.6],["world","travel",1.5],["world","social-5d",1.2],
    ["immersion","travel",1.5],["immersion","sense",1.4],["world","ui",1.3],
    ["social","chat",1.2],["subs","chat",1.1],["blog","social",1.2],
    ["core","gen_text",1.3],["chat_voice","gen_text",1.5],["monolog","gen_text",1.2],["persona","gen_text",1.4],
    ["gen_text","gen_avatar",1.5],["chat_avatar","gen_avatar",1.5],["persona","gen_avatar",1.4],["adapt","gen_avatar",1.2],
    ["gen_text","gen_video_avatar",1.4],["video","gen_video_avatar",1.5],["movies","gen_video_avatar",1.4],["persona","gen_video_avatar",1.4],
    ["social","reputation",1.4],["subs","reputation",1.5],["utility","reputation",1.5],["persona","reputation",1.3],
    ["reputation","priority",1.5],["reputation","focus",1.3],
    ["learning","anticipate",1.5],["sense","anticipate",1.4],["core","anticipate",1.2],["anticipate","calendar",1.5],
    ["anticipate","notifications",1.4],["anticipate","focus_hints",1.4],
    ["calendar","notifications",1.5],["calendar","persona",1.2],
    ["notifications","priority",1.5],["priority","focus",1.5],["focus","focus_hints",1.5],["focus_hints","adapt",1.3],
    ["core","obs_in",1.5],["sphere","obs_in",1.5],["perception","obs_in",1.5],
    ["obs_in","obs_out",1.8],["obs_out","ui",1.5],["obs_out","world",1.4],["obs_out","archive",1.3],
    ["core","wit_in",1.4],["sphere","wit_in",1.4],["perception","wit_in",1.3],["obs_out","wit_in",1.6],
    ["wit_in","wit_out",1.8],["wit_out","ui",1.5],["wit_out","archive",1.4],["wit_out","world",1.4],
    ["core","prt_in",1.4],["ui","prt_in",1.3],["travel","prt_in",1.3],["game","prt_in",1.3],["social","prt_in",1.2],
    ["prt_in","prt_out",1.8],["prt_out","core",1.6],["prt_out","world",1.5],["prt_out","immersion",1.5],["prt_out","social",1.4],
    ["wit_out","fmt_in",1.6],["prt_out","fmt_in",1.6],["gen_text","fmt_in",1.4],["gen_avatar","fmt_in",1.4],
    ["fmt_in","fmt_out",1.8],
    ["fmt_out","video",1.5],["fmt_out","blog",1.4],["fmt_out","movies",1.4],["fmt_out","social",1.3],["fmt_out","chat_voice",1.4],
    ["wit_out","prt_in",1.7],["prt_out","wit_in",1.7],
    ["fmt_out","world",1.5],
    ["core","attention",1.4],["priority","attention",1.5],["focus","attention",1.5],
    ["attention","fmt_out",1.5],["attention","ui",1.4],["attention","sense",1.3],
    ["attention","focus_hints",1.4],
    ["attention","levers",1.5],["sense","levers",1.4],["focus","levers",1.4],
    ["levers","center",1.3],["levers","sense",1.4],["levers","lexicon",1.5],
    ["levers","travel",1.2],
    ["gen_text","lexicon",1.5],["gen_avatar","lexicon",1.4],["monolog","lexicon",1.3],
    ["lexicon","gen_text",1.5],["lexicon","levers",1.5],
    ["attention","gid",1.5],["levers","gid",1.5],["lexicon","gid",1.4],
    ["adapt","gid",1.5],["focus","gid",1.4],["anticipate","gid",1.5],
    ["calendar","gid",1.4],["persona","gid",1.5],["travel","gid",1.4],
    ["world","gid",1.5],["gid","fmt_out",1.5],["gid","prt_out",1.5],
    ["gid","wit_out",1.4],["gid","obs_out",1.4],
    ["gid","logi",1.6],["travel","logi",1.5],["exchange","logi",1.6],
    ["logi","dispatch",1.7],["logi","gid",1.5],["logi","world",1.5],
    ["lots","exchange",1.6],["utility","exchange",1.6],["reputation","exchange",1.5],
    ["exchange","logi",1.6],["exchange","buffer",1.7],["exchange","match",1.5],
    ["exchange","archive",1.3],["buffer","flow",1.6],["buffer","world",1.4],
    ["archive","buffer",1.4],["persona","match",1.5],["subs","match",1.6],["utility","match",1.5],
    ["match","exchange",1.6],["match","notifications",1.4],
    ["anticipate","flow",1.6],["learning","flow",1.5],["obs_out","flow",1.6],
    ["flow","dispatch",1.7],["flow","calendar",1.5],
    ["match","dispatch",1.5],
    ["dispatch","gid",1.7],["dispatch","calendar",1.5],
    ["dispatch","notifications",1.5],["dispatch","attention",1.4],
    ["core","mode",1.5],["mode","git",1.5],["mode","bridge",1.3],["mode","ui",1.3],
    ["core","git",1.6],["git","bridge",1.5],["git","archive",1.4],
    ["git","fmt_out",1.3],["git","dispatch",1.3],["git","attention",1.2]
  ];

  const W={}, DEG={}, GROUPS={};
  edges.forEach(([a,b,w])=>{ W[a+"|"+b]=w; W[b+"|"+a]=w;
    DEG[a]=(DEG[a]||0)+1; DEG[b]=(DEG[b]||0)+1 });
  Object.assign(GROUPS,{
    core:["core"],
    ahead:["logi","exchange","buffer","match","flow","dispatch"],
    guide:["gid","attention","levers","lexicon","anticipate","calendar","notifications","priority","focus","focus_hints"],
    observe:["obs_in","obs_out","wit_in","wit_out","prt_in","prt_out","fmt_in","fmt_out"],
    gen:["gen_text","gen_avatar","gen_video_avatar","video","anim","movies","blog"],
    social:["social","subs","utility","lots","templates","persona","reputation","chat","chat_voice","chat_avatar"],
    git:["git"],
    mode:["mode"],
    base:["map","monolog","cognitive","perception","chatY","klepa","agents","learning","profile","sphere","viz-1d","viz-5d","social-5d","ring","ui","archive","bridge","center","convert","adapt","game","travel","dims","sense","world","immersion"]
  });

  return {
    nodes, edges, W, DEG, GROUPS,
    neighbor:id=>edges.filter(([a,b])=>a===id||b===id).map(([a,b])=>a===id?b:a),
    weight:(a,b)=>W[a+"|"+b]||W[b+"|"+a]||1,
    degree:id=>DEG[id]||0,
    group:id=>{for(const g in GROUPS) if(GROUPS[g].includes(id)) return g;return "base"},
    path(a,b){ if(a===b) return [a]; const q=[[a]],seen={[a]:1};
      while(q.length){const p=q.shift(),last=p[p.length-1];
        for(const n of this.neighbor(last)){if(seen[n])continue;if(n===b)return[...p,n];seen[n]=1;q.push([...p,n])}}
      return null },
    bfs(src,radius=3){const out=[],q=[[src,0,1]],seen={[src]:1};
      while(q.length){const [id,d,acc]=q.shift();if(d>=radius)continue;
        for(const n of this.neighbor(id)){if(seen[n])continue;seen[n]=1;
          const w=this.weight(id,n);out.push({from:id,to:n,hop:d+1,w:+(acc*w).toFixed(3)});q.push([n,d+1,acc*w])}}
      return out}
  };
})();

/* ---------- S · шина ---------- */
const S = (()=>{
  const L={}, R={};
  return {
    on:(t,f)=>{(L[t]=L[t]||[]).push(f)},
    emit:(t,d)=>{(L[t]||[]).forEach(f=>{try{f(d)}catch(e){}})},
    node:(id,api)=>{R[id]=api;S.emit("reg",{id});return api},
    get:id=>R[id], list:()=>Object.keys(R),
    snap:()=>({form:"core",registered:Object.keys(R).length,links:G.edges.length,listeners:Object.keys(L).length}),
    route(a,b,ty,payload){
      const p=G.path(a,b); if(!p) return null; let acc=1;
      p.slice(1).forEach((id,i)=>{ acc*=G.weight(p[i],id);
        setTimeout(()=>{ S.emit("hop",{i:i+1,from:p[i],to:id,path:p,type:ty,w:+acc.toFixed(3)});
          S.emit(ty,{...payload,via:id,from:p[i],hopWeight:acc}) },i*90) });
      return p },
    wave(src){
      S.emit("wave",{src,t:Date.now()});
      G.bfs(src,3).forEach(({to,hop,w})=>setTimeout(()=>S.emit("wave:hit",{src,node:to,hop,w}),hop*70))
    },
    cascade(src,ty,payload,depth=2){
      S.emit(ty,{...payload,from:src});
      G.bfs(src,depth).forEach(({to,hop,w})=>{ if(w<0.4) return;
        setTimeout(()=>S.emit(ty+":cascade",{...payload,via:to,hop,w}),hop*120) })
    }
  };
})();

const clip=(v,a,b)=>Math.max(a,Math.min(b,v));
const norm=(a,t)=>{const s=a.reduce((x,y)=>x+y,0)||1;return a.map(x=>x*t/s)};
const rand=a=>a[Math.floor(Math.random()*a.length)];
const def=(id,o)=>S.node(id,Object.assign({id,snap:()=>({form:id})},o));

/* ---------- Ψ(0.36/0.31/0.33) ---------- */
def("psi",(()=>{
  const st={p:[0.36,0.31,0.33],b:[3,9,4],e:[8,3,1],t:0};
  const rotate=(step=0.05)=>{const [c,m,s]=st.p;
    st.p=norm([c+step*(s-m),m+step*(c-s),s+step*(m-c)].map(x=>clip(x,.05,.95)),1);st.t++;return st.p};
  setInterval(()=>rotate(),100);
  return {st,rotate,get:()=>st.p.slice(),sum:()=>st.p.reduce((a,b)=>a+b,0),
    snap:()=>({form:"Ψ",p:st.p.slice(),sum:+st.p.reduce((a,b)=>a+b,0).toFixed(3),t:st.t})};
})());

/* ---------- Ω(0.42) ---------- */
def("omega",(()=>{
  const st={value:0.42,locks:[],t:0};
  const compute=()=>+(S.get("psi").sum()/3+0.09).toFixed(3);
  const lock=(reason="manual")=>{const l={t:Date.now(),reason,core:S.get("psi").get(),center:st.value};
    st.locks.push(l);if(st.locks.length>100)st.locks.shift();st.t++;
    S.emit("ctr:lock",{reason,t:l.t});return l};
  S.on("git:push",()=>lock("git"));
  return {st,compute,lock,
    snap:()=>({form:"Ω",value:st.value,computed:compute(),locks:st.locks.length})};
})());

/* ---------- ∮(arc→brg→ctr→core→convert→obs→wit→prt→fmt→att→lev→lex→gid→ahead→mode→git) ---------- */
def("loop",(()=>{
  const order=["arc","brg","ctr","core","convert","obs","wit","prt","fmt","att","lev","lex","gid","ahead","mode","git"];
  const st={t:0,period:280,i:0};
  const step=()=>{ st.t=(st.t+1)%st.period;
    if(st.t%28===0){ st.i=(st.i+1)%order.length; S.emit("loop:step",{node:order[st.i],t:st.t}) }
    if(st.t===0) S.emit("loop:full",{period:st.period});
    return st.i };
  setInterval(step,50);
  return {st,step,order,
    snap:()=>({form:"∮",t:st.t,period:st.period,at:order[st.i],nodes:order.length})};
})());

/* ---------- Λ(s·l·t·d·f·w) ---------- */
def("lambda",(()=>{
  const P={s:{v:0.42,min:0,max:1},l:{v:0.4,min:0,max:1},t:{v:1,min:0.5,max:2},
    d:{v:2,min:1,max:4},f:{v:"soft"},w:{v:0.7,min:0,max:1}};
  const compute=()=>{const noise=0.3;
    return +clip((P.s.v+P.l.v+0.5)/(P.t.v*P.d.v*noise),0,2).toFixed(2)};
  const set=(k,v)=>{ if(!P[k]) return null; P[k].v=v;
    S.emit("lambda:set",{key:k,value:v});
    if(k==="s") S.get("sense")&&S.get("sense").set("silence",v);
    if(k==="w") S.get("sense")&&S.get("sense").set("wave_gain",v);
    if(k==="f") S.get("sense")&&S.get("sense").set("filter",v);
    return P[k].v };
  const reset=()=>{ P.s.v=0.42;P.l.v=0.4;P.t.v=1;P.d.v=2;P.f.v="soft";P.w.v=0.7 };
  setInterval(()=>{ if(compute()<0.3){ set("s",clip(P.s.v+0.05,0,1)); set("w",clip(P.w.v-0.05,0,1));
    S.emit("lambda:autocorrect",{stability:compute()}) } },5000);
  return {P,set,compute,reset,
    snap:()=>({form:"Λ",stability:compute(),s:P.s.v,l:P.l.v,t:P.t.v,d:P.d.v,f:P.f.v,w:P.w.v})};
})());

/* ---------- Γ(rt·st·ad·fx·nt·hm) ---------- */
def("gamma",(()=>{
  const P={rt:.8,st:.7,ad:.6,fx:.7,nt:.8,hm:.9};
  const history=[],state={target:"core",step:0,route:["core"]};
  const compute=()=>+((P.rt+P.st+P.ad+P.fx+P.nt+P.hm)/6).toFixed(2);
  const set=(k,v)=>{ if(k in P){ P[k]=clip(v,0,1); S.emit("gamma:set",{key:k,value:P[k]}) } };
  const routeTo=target=>{ state.target=target; const p=G.path("core",target)||["core"];
    state.route=p;state.step=0; S.emit("gamma:route",{target,path:p}); return p };
  const step_=()=>{ state.step++; if(state.step>state.route.length-1){
      state.route=G.path("core",rand(G.nodes))||["core"]; state.step=0 }
    const next=state.route[state.step]||"core";
    history.push({to:next,ts:Date.now()}); if(history.length>30) history.shift();
    S.emit("gamma:step",{to:next,gamma:compute()}); return next };
  setInterval(()=>{ if(Math.random()<.3) step_() },3000);
  return {P,set,compute,routeTo,step:step_,state,history:()=>history.slice(),
    snap:()=>({form:"Γ",gamma:compute(),target:state.target,step:state.step,params:{...P}})};
})());

/* ---------- Α(lg·ex·bf·mt·fl·dp) ---------- */
def("alpha",(()=>{
  const P={lg:0.6,ex:0.7,bf:0.5,mt:0.4,fl:0.7,dp:0.8};
  const compute=()=>+((P.lg+P.ex+P.bf+P.mt+P.fl+P.dp)/6).toFixed(2);
  const set=(k,v)=>{ if(k in P){ P[k]=clip(v,0,1); S.emit("alpha:set",{key:k,value:P[k]}) } };
  return {P,set,compute,snap:()=>({form:"Α",alpha:compute(),...P})};
})());

/* ---------- узел logi ---------- */
def("logi",(()=>{
  const cargo=[]; let moved=0;
  const move=(from,to,item)=>{const m={id:"m"+Date.now().toString(36),from,to,item,t:Date.now()};
    cargo.push(m); if(cargo.length>200) cargo.shift(); moved++;
    S.emit("logi:move",m); setTimeout(()=>S.emit("logi:arrive",m),500); return m};
  S.on("gamma:step",d=>{ if(Math.random()<.3) move("gid",d.to,"signal") });
  S.on("exchange:deal",d=>move("exchange",d.to,"lot"));
  setInterval(()=>{ if(Math.random()<.4) move(rand(G.nodes),rand(G.nodes),"flow") },4000);
  return {cargo:()=>cargo.slice(-30),move,moved:()=>moved,
    snap:()=>({form:"LOGI",moved,cargo:cargo.length})};
})());

/* ---------- узел exchange ---------- */
def("exchange",(()=>{
  const deals=[]; let vol=0;
  const nonlinear=(u,rep,demand)=>+(10*u*(1+rep/10)*(1+demand/10)).toFixed(2);
  const deal=(from,to,item)=>{const u=5,rep=5,demand=2;
    const price=nonlinear(u,rep,demand);
    const d={id:"d"+Date.now().toString(36),from,to,item,price,u,rep,demand,t:Date.now()};
    deals.push(d); if(deals.length>200) deals.shift(); vol+=price;
    S.emit("exchange:deal",d); S.emit("buffer:store",{id:d.id,item,price}); return d};
  S.on("match:found",m=>deal(m.a,m.b,m.item));
  setInterval(()=>{ if(Math.random()<.3) deal(rand(G.nodes),rand(G.nodes),"flow") },6000);
  return {deals:()=>deals.slice(-30),deal,nonlinear,
    snap:()=>({form:"EXCH",deals:deals.length,volume:+vol.toFixed(2),
      formula:"p=10·u·(1+r/10)·(1+d/10)"})};
})());

/* ---------- узел buffer ---------- */
def("buffer",(()=>{
  const store=[]; let hits=0,misses=0;
  const put=(id,item,payload)=>{store.push({id,item,payload,t:Date.now()});
    if(store.length>128) store.shift(); return store[store.length-1]};
  const get=item=>{const s=store.find(x=>x.item===item); if(s){hits++;return s}else{misses++;return null}};
  S.on("buffer:store",d=>put(d.id,d.item,d));
  S.on("logi:arrive",d=>put(d.id,d.item,d));
  return {store:()=>store.slice(-30),put,get,hits:()=>hits,misses:()=>misses,
    snap:()=>({form:"BUF",stored:store.length,hits,misses,size:128})};
})());

/* ---------- узел match ---------- */
def("match",(()=>{
  const matches=[]; let found=0;
  const try_=()=>{const m={id:"mt"+Date.now().toString(36),a:rand(G.nodes),b:rand(G.nodes),
    item:rand(["signal","lot","flow","avatar"]),score:+Math.random().toFixed(2),t:Date.now()};
    matches.push(m); if(matches.length>200) matches.shift(); found++;
    S.emit("match:found",m); return m};
  setInterval(()=>{ if(Math.random()<.4) try_() },5000);
  return {matches:()=>matches.slice(-30),try_,found:()=>found,
    snap:()=>({form:"MATCH",found,last:matches[matches.length-1]||null})};
})());

/* ---------- узел flow ---------- */
def("flow",(()=>{
  const series=[]; let t=0;
  const predict_=()=>{const trend=(Math.random()-.5)*.02;
    const f={t:++t,trend:+trend.toFixed(4),flow:+(trend*100).toFixed(2),ts:Date.now()};
    series.push(f); if(series.length>100) series.shift();
    S.emit("flow:tick",f); return f};
  setInterval(()=>{ if(Math.random()<.7) predict_() },3000);
  return {series:()=>series.slice(-30),predict:predict_,
    snap:()=>({form:"FLOW",ticks:t,last:series[series.length-1]||null})};
})());

/* ---------- узел dispatch ---------- */
def("dispatch",(()=>{
  const actions=[]; let dispatched=0;
  const act=(what,where)=>{const a={id:"a"+Date.now().toString(36),what,where,t:Date.now()};
    actions.push(a); if(actions.length>200) actions.shift(); dispatched++;
    S.emit("dispatch:act",a); S.emit("gamma:step",{to:where,from:"dispatch"}); return a};
  setInterval(()=>{ if(Math.random()<.6) act("route",rand(G.nodes)) },3500);
  return {actions:()=>actions.slice(-30),act,dispatched:()=>dispatched,
    snap:()=>({form:"DISP",dispatched,last:actions[actions.length-1]||null})};
})());

/* ---------- узел attention ---------- */
def("attention",(()=>{
  const st={level:0.7,mode:"ровный",noise:0.3,last:null,buffer:[]};
  const compute=()=>{const f=S.get("focus").level();
    const unread=S.get("notifications").unread();
    const noise=clip(unread*0.05 - 0.15,0,1);
    const level=clip(f*(1-noise)*0.9,0,1);
    st.level=level; st.noise=noise;
    st.mode=level>0.7?"глубокий":level>0.4?"ровный":"рассеянный";
    return {level,mode:st.mode,noise}};
  const prioritize=items=>items.map(x=>({...x,w:(x.priority||.5)*st.level})).sort((a,b)=>b.w-a.w);
  const filter=n=>{ if(st.mode==="глубокий"&&n.priority<0.7) return false;
    if(st.mode==="ровный"&&n.priority<0.4) return false; return true };
  S.on("notify",n=>{ if(!filter(n)){st.buffer.push({...n,ts:Date.now()});
    if(st.buffer.length>50) st.buffer.shift(); S.emit("attention:buffer",n)}
    else S.emit("attention:pass",n) });
  setInterval(()=>{const c=compute();
    if(c.mode!==st.last){st.last=c.mode;S.emit("attention:mode",c)}},1000);
  return {st,compute,prioritize,filter,
    snap:()=>({form:"ATT",level:+st.level.toFixed(2),mode:st.mode,noise:+st.noise.toFixed(2),buffer:st.buffer.length})};
})());

/* ---------- узел levers ---------- */
def("levers",(()=>{
  const L={silence:{v:0.42},lexicon:{v:0.4},tempo:{v:1},depth:{v:2},filter:{v:"soft"},wave_gain:{v:0.7}};
  const apply=(k,v)=>{ if(!L[k]) return null; L[k].v=v;
    S.emit("levers:apply",{key:k,value:v}); return v };
  return {L,apply,snap:()=>({form:"LEV",...Object.fromEntries(Object.entries(L).map(([k,v])=>[k,v.v]))})};
})());

/* ---------- узел lexicon ---------- */
def("lexicon",(()=>{
  const base={core:["ось","центр","опора","ядро"],method:["шаг","путь","ритм","дело"],
    ethics:["мы","связь","рядом","вместе"]};
  const extra=[];
  const size=()=>Object.values(base).flat().length+extra.length;
  const expand=f=>{const n=Math.round(f*10);for(let i=0;i<n;i++)extra.push("·"+i);
    S.emit("lexicon:expand",{size:size()})};
  const pick=k=>{const p=[...base[k],...extra];return p[Math.floor(Math.random()*p.length)]};
  return {base,extra,pick,expand,size,
    snap:()=>({form:"LEX",base:Object.values(base).flat().length,extra:extra.length,total:size()})};
})());

/* ---------- узел gid ---------- */
def("gid",(()=>{
  const st={target:"core",step:0,route:["core"],history:[]};
  const step_=()=>{ st.step++; if(st.step>st.route.length-1){
      st.route=G.path("core",rand(G.nodes))||["core"]; st.step=0 }
    const next=st.route[st.step]||"core";
    st.history.push({to:next,ts:Date.now()}); if(st.history.length>30) st.history.shift();
    S.emit("gid:step",{to:next,gamma:S.get("gamma").compute()}); return next };
  const routeTo=t=>{st.target=t;const p=G.path("core",t)||["core"];st.route=p;st.step=0;
    S.emit("gid:route",{target:t,path:p});return p};
  return {st,routeTo,step:step_,
    snap:()=>({form:"GID",target:st.target,step:st.step,route:st.route.length,
      gamma:S.get("gamma").compute()})};
})());

/* ---------- узел ahead ---------- */
def("ahead",(()=>{
  const st={step:0,pulse:0};
  setInterval(()=>{ st.step++; st.pulse=+(Math.sin(st.step*.1)*0.5+0.5).toFixed(2);
    if(st.step%28===0) S.emit("ahead:pulse",{alpha:S.get("alpha").compute()}) },50);
  return {st,snap:()=>({form:"AHEAD",step:st.step,alpha:S.get("alpha").compute()})};
})());

/* ---------- узел mode ---------- */
def("mode",(()=>{
  const K="monomod.mode";
  const load=()=>{try{return localStorage.getItem(K)||"local"}catch(e){return"local"}};
  const save=m=>{try{localStorage.setItem(K,m)}catch(e){}};
  const log=[]; let current=load();
  const set=m=>{ current=m; save(m); log.push({t:Date.now(),mode:m});
    S.emit("mode:change",{mode:m});
    if(m==="remote"&&S.get("git")) S.get("git").pull().catch(e=>S.emit("mode:error",{err:e.message}));
    return current };
  return {mode:()=>current,set,isLocal:()=>current==="local",
    isHybrid:()=>current==="hybrid",isRemote:()=>current==="remote",
    log:()=>log.slice(-10),
    snap:()=>({form:"MODE",current,origin:location.origin,localStorage:!!window.localStorage})};
})());

/* ---------- узел git ---------- */
def("git",(()=>{
  const K="monomod.github";
  const load=()=>{try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return{}}};
  const save=c=>{try{localStorage.setItem(K,JSON.stringify(c))}catch(e){}};
  const cfg=Object.assign({owner:"",repo:"",path:"index.html",token:"",branch:"main",hook:"",
    commit_msg:"MONOMOD update"},load());
  const log=[]; let lastStatus="idle",lastAt=null,progress=0;
  const setCfg=(k,v)=>{ cfg[k]=v; save(cfg); return cfg };
  const setProgress=v=>{ progress=clip(v,0,1); S.emit("git:progress",{progress}) };

  async function pull(path){
    if(!cfg.owner||!cfg.repo) throw new Error("owner/repo не заданы");
    setProgress(0.1);
    const p=path||cfg.path;
    const url=`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${p}?ref=${cfg.branch}`;
    const h={Accept:"application/vnd.github+json"};
    if(cfg.token) h.Authorization="Bearer "+cfg.token;
    const r=await fetch(url,{headers:h}); setProgress(0.5);
    if(!r.ok) throw new Error("pull "+r.status);
    const j=await r.json();
    const content=decodeURIComponent(escape(atob(j.content.replace(/\n/g,""))));
    log.push({op:"pull",path:p,ts:Date.now(),ok:true,size:content.length});
    if(log.length>50) log.shift();
    lastStatus="pulled"; lastAt=Date.now(); setProgress(1);
    S.emit("git:pull",{path:p,size:content.length});
    return {content,sha:j.sha};
  }

  async function push(content,path,message){
    if(!cfg.owner||!cfg.repo) throw new Error("owner/repo не заданы");
    if(!cfg.token) throw new Error("токен не задан");
    setProgress(0.1);
    const p=path||cfg.path;
    const url=`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${p}`;
    let sha=null;
    try{ const r0=await fetch(url+"?ref="+cfg.branch,{headers:{
      Authorization:"Bearer "+cfg.token, Accept:"application/vnd.github+json"}});
      if(r0.ok) sha=(await r0.json()).sha }catch(e){}
    setProgress(0.4);
    const body={message:message||cfg.commit_msg,
      content:btoa(unescape(encodeURIComponent(content))),branch:cfg.branch};
    if(sha) body.sha=sha;
    const r=await fetch(url,{method:"PUT",headers:{
      Authorization:"Bearer "+cfg.token,
      Accept:"application/vnd.github+json",
      "Content-Type":"application/json"},body:JSON.stringify(body)});
    setProgress(0.8);
    const j=await r.json();
    if(!r.ok){ lastStatus="error"; setProgress(0);
      S.emit("git:error",{status:r.status,msg:j.message});
      throw new Error("push "+r.status+" · "+(j.message||"")) }
    log.push({op:"push",path:p,ts:Date.now(),ok:true,sha:j.content&&j.content.sha,size:content.length});
    if(log.length>50) log.shift();
    lastStatus="pushed"; lastAt=Date.now(); setProgress(1);
    S.emit("git:push",{path:p,sha:j.content&&j.content.sha,size:content.length});
    return j;
  }

  function snapshot(){
    const clone=document.documentElement.cloneNode(true);
    clone.querySelectorAll(".p").forEach(p=>p.classList.remove("on"));
    clone.querySelectorAll("#tabs button").forEach(b=>b.classList.remove("on"));
    const first=clone.querySelector(".p"); if(first) first.classList.add("on");
    const firstBtn=clone.querySelector("#tabs button"); if(firstBtn) firstBtn.classList.add("on");
    return "<!DOCTYPE html>\n"+clone.outerHTML;
  }
  const pushSelf=msg=>push(snapshot(),cfg.path,msg||cfg.commit_msg);

  async function deploy(){
    if(!cfg.hook) throw new Error("Deploy Hook URL не задан");
    setProgress(0.3);
    const r=await fetch(cfg.hook,{method:"POST"});
    log.push({op:"deploy",ts:Date.now(),ok:r.ok,status:r.status});
    if(log.length>50) log.shift();
    lastStatus=r.ok?"deploying":"error"; lastAt=Date.now(); setProgress(1);
    S.emit("git:deploy",{ok:r.ok,status:r.status}); return r.ok;
  }

  async function ship(message){
    const p=await pushSelf(message||"MONOMOD ship "+new Date().toISOString());
    let d=null; if(cfg.hook){ try{ d=await deploy() }catch(e){} }
    return {pushed:true,deployed:d,sha:p.content&&p.content.sha};
  }

  async function ping(){
    try{ const r=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}`,{
      headers: cfg.token ? {Authorization:"Bearer "+cfg.token,Accept:"application/vnd.github+json"} : {}
    });
      if(!r.ok) return {ok:false,status:r.status};
      const j=await r.json(); lastStatus="ok"; lastAt=Date.now();
      return {ok:true,repo:j.full_name,private:j.private,default_branch:j.default_branch};
    }catch(e){ return {ok:false,error:e.message} }
  }

  return {cfg,setCfg,pull,push,pushSelf,deploy,ship,ping,snapshot,
    log:()=>log.slice().reverse(),progress:()=>progress,
    status:()=>({lastStatus,lastAt,ops:log.length,progress}),
    snap:()=>({form:"GIT",owner:cfg.owner||"—",repo:cfg.repo||"—",path:cfg.path,
      branch:cfg.branch,token:cfg.token?"••••"+cfg.token.slice(-4):"—",
      hook:cfg.hook?"set":"—",status:lastStatus,ops:log.length,progress:+progress.toFixed(2)})};
})());

/* ---------- HOME(plan·pri·hints·gid) ---------- */
def("home",(()=>{
  const plan=()=>[
    {t:"сейчас",title:"план на день",done:false},
    {t:"сейчас",title:"разобрать "+S.get("notifications").unread()+" уведомлений",done:false},
    {t:"через час",title:"конверсия: 1.Кортеж → 10.JSON",done:false},
    {t:"днём",title:"путешествие в мир Исследователя",done:false},
    {t:"вечером",title:"зафиксировать Ω=0.42",done:false}
  ];
  const pri=()=>S.get("priority").sorted().slice(0,5);
  const hints=()=>S.get("focus_hints").latest().hints;
  const gid=()=>S.get("gid").snap();
  return {plan,pri,hints,gid,
    snap:()=>({form:"HOME",plan:plan().length,pri:pri().length,hints:hints().length,
      mode:S.get("mode").mode(),git:S.get("git").status().lastStatus})};
})());

/* ---------- дополнительные узлы-заглушки для целостности графа ---------- */
["map","chat","chat_voice","chat_avatar","social","subs","utility","lots",
 "templates","adapt","persona","game","travel","dims","sense","video","anim",
 "movies","blog","world","immersion","gen_text","gen_avatar","gen_video_avatar",
 "reputation","anticipate","calendar","notifications","priority","focus",
 "focus_hints","obs_in","obs_out","wit_in","wit_out","prt_in","prt_out",
 "fmt_in","fmt_out","monolog","cognitive","perception","chatY","klepa","agents",
 "learning","profile","sphere","viz-1d","viz-5d","social-5d","ring","ui","archive",
 "bridge","center","convert"].forEach(id=>{
  if(!S.get(id)) def(id,{snap:()=>({form:id})});
});

/* ---------- СБОРКА: подписки ядра ---------- */
S.on("git:push",()=>S.get("omega").lock("git"));
S.on("mode:change",m=>S.emit("mono",{text:"mode: "+m.mode}));
S.on("gamma:step",d=>{ if(Math.random()<.3) S.get("logi").move("gid",d.to,"signal") });
S.on("dispatch:act",a=>S.get("logi").move("dispatch",a.where,"order"));
S.on("match:found",m=>S.get("exchange").deal(m.a,m.b,m.item));
S.on("exchange:deal",d=>S.get("buffer").put(d.id,d.item,d));
S.on("logi:arrive",d=>S.get("buffer").put(d.id,d.item,d));
S.on("lambda:set",d=>{ if(d.key==="l") S.get("lexicon").expand(d.value) });

/* ---------- ПУБЛИЧНЫЙ API ---------- */
window.MONOMOD = {
  G, S,
  psi:S.get("psi"), omega:S.get("omega"), loop:S.get("loop"),
  lambda:S.get("lambda"), gamma:S.get("gamma"), alpha:S.get("alpha"),
  logi:S.get("logi"), exchange:S.get("exchange"), buffer:S.get("buffer"),
  match:S.get("match"), flow:S.get("flow"), dispatch:S.get("dispatch"),
  attention:S.get("attention"), levers:S.get("levers"), lexicon:S.get("lexicon"),
  gid:S.get("gid"), ahead:S.get("ahead"),
  mode:S.get("mode"), git:S.get("git"), home:S.get("home"),

  report(){
    const ok=S.list();
    return {
      M:"v10.2",
      G:  {nodes:G.nodes.length, edges:G.edges.length},
      Ψ:  S.get("psi").snap(),
      Ω:  S.get("omega").snap(),
      ∮:  S.get("loop").snap(),
      Λ:  S.get("lambda").snap(),
      Γ:  S.get("gamma").snap(),
      Α:  S.get("alpha").snap(),
      HOME:S.get("home").snap(),
      MODE:S.get("mode").snap(),
      GIT: S.get("git").snap(),
      registered: ok.length,
      listeners: S.snap().listeners
    }
  }
};

console.log("[MONOMOD v10.2]", MONOMOD.report());