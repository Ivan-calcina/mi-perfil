/* VANTA Profile Studio — diseño y código originales, sin dependencias de JS. */
(() => {
  'use strict';
  const defaults = {
    name: 'NOCTIS', username: 'noctis.dev', subtitle: 'DISEÑADOR DIGITAL · CREADOR',
    bio: 'Transformando ideas en experiencias. Un rincón de internet hecho a mi manera.',
    location: 'En algún lugar de la red', status: 'Construyendo algo nuevo', avatar: '',
    badges: ['✦ CREATOR', '⌘ DEV', '☾ NIGHT OWL'],
    theme: {accent:'#aa77ff',secondary:'#4bdded',background:'#080714',text:'#f5f1ff',opacity:76,blur:22,radius:26,font:'space',alignment:'center',layout:'compact',buttonStyle:'glass',glow:true,gradient:true,animatedTitle:'shine'},
    effects:{background:'stars',density:56,cursorTrail:true,cardTilt:false,animatedOrbs:true},
    media:{backgroundImage:'',backgroundVideo:'',music:'',songName:'Mi canción favorita',introEnabled:false,introTitle:'BIENVENIDO A MI ESPACIO',introSubtitle:'Haz clic para entrar'},
    links:[{title:'Mi GitHub',url:'https://github.com/',icon:'github',visible:true},{title:'Mi Instagram',url:'https://instagram.com/',icon:'instagram',visible:true},{title:'Discord',url:'https://discord.com/',icon:'discord',visible:true},{title:'Mi portafolio',url:'https://example.com/',icon:'globe',visible:true}],
    widgets:{showStatus:true,showLocation:true,showClock:false,showProjects:true,skills:['Diseño','Código','Creatividad'],quote:'Lo extraordinario comienza con una idea.',projects:[{title:'Mi universo digital',description:'Un proyecto que estoy creando.',url:'https://github.com/',tag:'WEB'},{title:'Experimentos visuales',description:'Interacciones y efectos a mi estilo.',url:'https://github.com/',tag:'CREATIVE'}]},customCss:''
  };
  const clone = v => JSON.parse(JSON.stringify(v));
  function normalize(c) {
    if (!c || typeof c !== 'object' || Array.isArray(c)) return clone(defaults);
    const out = {...clone(defaults), ...c};
    for (const k of ['theme','effects','media','widgets']) out[k] = {...clone(defaults[k]), ...(c[k] && typeof c[k]==='object' && !Array.isArray(c[k]) ? c[k] : {})};
    out.links = Array.isArray(c.links) ? c.links.slice(0,60) : clone(defaults.links);
    out.badges = Array.isArray(c.badges) ? c.badges.slice(0,25) : clone(defaults.badges);
    out.widgets.skills = Array.isArray(out.widgets.skills) ? out.widgets.skills.slice(0,25) : [];
    out.widgets.projects = Array.isArray(out.widgets.projects) ? out.widgets.projects.slice(0,30) : [];
    return out;
  }
  function elem(tag, cls, content) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (content != null) e.textContent = String(content);
    return e;
  }
  function validURL(url, allowMail=false) {
    if (typeof url !== 'string' || !url.trim()) return '';
    try {
      const u = new URL(url.trim(), document.baseURI);
      if (['https:','http:'].includes(u.protocol) || (allowMail && u.protocol === 'mailto:')) return u.href;
    } catch (_) {}
    return '';
  }
  function colorOr(value, fallback) {return /^#[0-9a-f]{6}$/i.test(String(value)) ? value : fallback;}
  function clamp(n, lo, hi) { return Math.max(lo,Math.min(hi,Number(n)||0)); }
  const glyphs = {github:'⌘',instagram:'◎',discord:'◕',youtube:'▶',tiktok:'♪',spotify:'≋',twitch:'♜',telegram:'➤',x:'𝕏',email:'✉',globe:'◈',steam:'◉',roblox:'◇',link:'↗'};

  function render(root, raw, options={}) {
    if (!root) return;
    if (typeof root.__dispose === 'function') root.__dispose();
    const c = normalize(raw), preview = options.mode === 'preview', disposers=[];
    root.replaceChildren();
    root.classList.add('profile-host');
    const stage = elem('div','profile-stage' + (preview ? ' is-preview' : ''));
    const t = c.theme, ef=c.effects, m=c.media, w=c.widgets;
    const accent=colorOr(t.accent,'#aa77ff'), secondary=colorOr(t.secondary,'#4bdded');
    stage.style.setProperty('--accent', accent);
    stage.style.setProperty('--accent-2',secondary);
    stage.style.setProperty('--canvas-bg', colorOr(t.background,'#080714'));
    stage.style.setProperty('--profile-text',colorOr(t.text,'#f5f1ff'));
    stage.style.setProperty('--glass-alpha',String(clamp(t.opacity,12,100)/100));
    stage.style.setProperty('--glass-blur',`${clamp(t.blur,0,50)}px`);
    stage.style.setProperty('--card-radius',`${clamp(t.radius,4,48)}px`);
    stage.dataset.font = ['space','mono','sans'].includes(t.font) ? t.font : 'space';
    stage.dataset.alignment = t.alignment==='left' ? 'left':'center';
    stage.dataset.layout = t.layout==='wide' ? 'wide':'compact';
    stage.dataset.buttons = ['glass','solid','outline'].includes(t.buttonStyle)?t.buttonStyle:'glass';
    stage.dataset.title = ['shine','glitch','neon','none'].includes(t.animatedTitle)?t.animatedTitle:'shine';
    stage.classList.toggle('no-glow',!t.glow);
    stage.classList.toggle('no-gradient',!t.gradient);
    stage.classList.toggle('no-orbs',!ef.animatedOrbs);
    stage.innerHTML = '<div class="scene-bg"></div><div class="orb orb-one"></div><div class="orb orb-two"></div><div class="scene-grid"></div><canvas class="particles-canvas" aria-hidden="true"></canvas><div class="cursor-layer" aria-hidden="true"></div>';
    const bg=stage.querySelector('.scene-bg');
    const videoURL=validURL(m.backgroundVideo), imageURL=validURL(m.backgroundImage);
    if (videoURL) {
      const v=elem('video','scene-media'); v.src=videoURL; v.autoplay=true; v.loop=true; v.muted=true; v.playsInline=true; v.setAttribute('aria-hidden','true'); v.preload='metadata'; bg.append(v);
      const p=v.play(); if(p && p.catch) p.catch(()=>{}); disposers.push(()=>{v.pause(); v.removeAttribute('src'); v.load();});
    } else if (imageURL) { bg.style.backgroundImage=`linear-gradient(rgba(5,4,15,.38),rgba(5,4,15,.52)),url("${imageURL.replace(/["\\]/g,'')}")`; }
    const hud=elem('div','profile-hud');
    hud.append(elem('span','hud-logo','✦  PERSONAL / SPACE'),elem('span','hud-secondary','EST. 2026   —   ON THE INTERNET'));
    stage.append(hud);
    const card=elem('article','profile-card');
    card.setAttribute('aria-label','Tarjeta de perfil');
    const top=elem('div','card-topbar');
    top.append(elem('span','','✧  DIGITAL IDENTITY'),elem('span','corner-cross','✳'));
    card.append(top);
    const head=elem('div','profile-heading');
    const avatarWrap=elem('div','avatar-outer'), av=elem('div','avatar-face');
    if (validURL(c.avatar)) {const img=elem('img'); img.src=validURL(c.avatar);img.alt=`Avatar de ${c.name || 'usuario'}`;img.loading='lazy';av.append(img);}
    else av.append(elem('span','avatar-initial',(String(c.name||'N').trim().charAt(0)||'N').toUpperCase()));
    avatarWrap.append(av,elem('span','avatar-spark','✦'));head.append(avatarWrap);
    if (c.subtitle) head.append(elem('div','profile-subtitle',c.subtitle));
    head.append(elem('h1','profile-name',c.name||'Mi perfil'));
    if(c.username)head.append(elem('div','profile-username','@'+String(c.username).replace(/^@/,'')));
    if(c.bio)head.append(elem('p','profile-bio',c.bio));
    if(c.badges.length){const badges=elem('div','profile-badges');c.badges.filter(Boolean).forEach(b=>badges.append(elem('span','profile-badge',b)));head.append(badges);}
    card.append(head);
    if(w.showStatus || w.showLocation){const info=elem('div','profile-info');
      if (w.showStatus && c.status) {const x=elem('span','info-status');x.append(elem('i','online-dot'),document.createTextNode(' '+c.status));info.append(x);}
      if (w.showLocation && c.location)info.append(elem('span','info-location','⌁  '+c.location));
      if(info.childNodes.length)card.append(info);
    }
    const visibleLinks=c.links.filter(l=>l && l.visible!==false && validURL(l.url,true));
    if(visibleLinks.length){const label=elem('div','block-label');label.append(elem('span','','MIS ENLACES'),elem('span','','↗  '+String(visibleLinks.length).padStart(2,'0')));card.append(label);
      const links=elem('div','profile-links');visibleLinks.forEach(l=>{
        const a=elem('a','profile-link');a.href=validURL(l.url,true);a.target='_blank';a.rel='noopener noreferrer';
        a.append(elem('span','link-symbol',glyphs[l.icon]||glyphs.link),elem('span','link-text',l.title||'Enlace'),elem('span','link-arrow','↗'));links.append(a);
      });card.append(links);
    }
    if(w.showProjects && w.projects.some(p=>p && p.title)){
      const label=elem('div','block-label project-label');label.append(elem('span','','PROYECTOS SELECCIONADOS'),elem('span','','✦ '+String(w.projects.length).padStart(2,'0')));card.append(label);
      const grid=elem('div','project-grid');
      w.projects.filter(p=>p && p.title).forEach(p=>{
        const url=validURL(p.url,true), item=elem(url?'a':'div','project-tile');
        if(url){item.href=url;item.target='_blank';item.rel='noopener noreferrer';}
        item.append(elem('span','project-tag',p.tag||'PROYECTO'),elem('strong','',p.title),elem('small','',p.description||''));
        grid.append(item);
      });card.append(grid);
    }
    if(w.skills.length){const skills=elem('div','skills-row');w.skills.filter(Boolean).forEach(s=>skills.append(elem('span','skill-chip',s)));card.append(skills);}
    if(w.quote)card.append(elem('p','profile-quote','“'+w.quote+'”'));
    const audioUrl=validURL(m.music);
    if(audioUrl){
      const player=elem('div','music-player');const disc=elem('span','music-disc','♫');const song=elem('div','song-meta');song.append(elem('strong','',m.songName||'Mi música'),elem('small','','AUDIO PERSONAL'));
      const btn=elem('button','music-button','▶');btn.type='button';btn.setAttribute('aria-label','Reproducir música');
      const audio=elem('audio');audio.src=audioUrl;audio.preload='none';audio.loop=true;player.append(disc,song,btn,audio);card.append(player);
      btn.addEventListener('click',()=>{if(audio.paused){audio.play().then(()=>{btn.textContent='Ⅱ';btn.setAttribute('aria-label','Pausar música');disc.classList.add('spinning');}).catch(()=>{btn.textContent='!';btn.title='No fue posible reproducir este archivo';});}else{audio.pause();btn.textContent='▶';btn.setAttribute('aria-label','Reproducir música');disc.classList.remove('spinning');}});
      disposers.push(()=>{audio.pause();audio.removeAttribute('src');});
    }
    if(w.showClock){const clock=elem('div','local-clock');const update=()=>{clock.textContent='⌚ HORA LOCAL · '+new Intl.DateTimeFormat('es-PE',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());};update();const id=setInterval(update,1000);card.append(clock);disposers.push(()=>clearInterval(id));}
    const foot=elem('div','card-footer');foot.append(elem('span','','VANTA / PERSONAL PROFILE'),elem('span','','MADE WITH ✦'));card.append(foot);
    stage.append(card);
    if (typeof c.customCss==='string' && c.customCss.trim()) {const style=elem('style');style.textContent=c.customCss.slice(0,30000);stage.append(style);}
    if(m.introEnabled && !preview){const intro=elem('div','intro-screen');const content=elem('div','intro-content');content.append(elem('div','intro-mark','✦'),elem('div','intro-heading',m.introTitle||'BIENVENIDO'),elem('p','',m.introSubtitle||'Pulsa para entrar'));const enter=elem('button','intro-button','ENTRAR AL PERFIL  ↗');enter.type='button';enter.addEventListener('click',()=>{intro.classList.add('intro-leaving');setTimeout(()=>intro.remove(),520);});content.append(enter);intro.append(content);stage.append(intro);}
    root.append(stage);
    const disposeFx=initParticles(stage,ef,preview);disposers.push(disposeFx);
    if(ef.cursorTrail) {const handler=e=>{
      if(e.pointerType==='touch') return;
      const layer=stage.querySelector('.cursor-layer'),dot=elem('i','cursor-spark');dot.style.left=e.clientX-stage.getBoundingClientRect().left+'px';dot.style.top=e.clientY-stage.getBoundingClientRect().top+'px';layer.append(dot);
      const a=dot.animate([{opacity:0.9,transform:'translate(-50%,-50%) scale(1)'},{opacity:0,transform:'translate(-50%,-125%) scale(.1)'}],{duration:650,easing:'ease-out'});a.onfinish=()=>dot.remove();
      if(layer.children.length>45)layer.firstElementChild?.remove();
    };stage.addEventListener('pointermove',handler);disposers.push(()=>stage.removeEventListener('pointermove',handler));}
    if(ef.cardTilt && !preview){const onMove=e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1000px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;};const onLeave=()=>card.style.transform='';card.addEventListener('pointermove',onMove);card.addEventListener('pointerleave',onLeave);disposers.push(()=>{card.removeEventListener('pointermove',onMove);card.removeEventListener('pointerleave',onLeave);});}
    root.__dispose=()=>{disposers.forEach(d=>{try{d();}catch(_){}});};
    if(!preview)document.title=(c.name||'Mi perfil')+' — Mi espacio';
  }

  function initParticles(stage,ef,preview){
    const mode=ef.background;
    const canvas=stage.querySelector('canvas.particles-canvas');
    if(!['stars','snow','rain','fireflies','bubbles'].includes(mode) || matchMedia('(prefers-reduced-motion: reduce)').matches) return ()=>{};
    const ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
    let width=1,height=1,dpr=1,raf=0,arr=[];
    const total=Math.max(5,Math.min(150,Math.round(clamp(ef.density,5,100)*(preview?.52:1.15))));
    function reset(){const rect=stage.getBoundingClientRect();width=Math.max(1,Math.round(rect.width));height=Math.max(1,Math.round(rect.height));dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      arr=Array.from({length:total},()=>spawn(true));}
    function spawn(randomY){const rain=mode==='rain';return {x:Math.random()*width,y:randomY?Math.random()*height:(mode==='bubbles'?height+10:-10),rx:1+Math.random()*(rain?1:2.5),speed:(rain?6:mode==='snow'?1.1:mode==='bubbles'?1.1:.2)+Math.random()*(rain?3:1.05),phase:Math.random()*7,alpha:.22+Math.random()*.58};}
    let tick=0;function frame(){ctx.clearRect(0,0,width,height);tick+=.014;
      for(let i=0;i<arr.length;i++) {let p=arr[i];
        ctx.globalAlpha=p.alpha*(mode==='stars'||mode==='fireflies' ? .67+.33*Math.sin(tick*3+p.phase) : 1);
        ctx.beginPath();
        if(mode==='rain'){ctx.strokeStyle='#b9a3ff';ctx.lineWidth=.9;ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-4,p.y+19);ctx.stroke();p.x-=.55;p.y+=p.speed;}
        else{ctx.fillStyle=mode==='fireflies'?'#a7ffde':mode==='snow'?'#ffffff':mode==='bubbles'?'#6ddfff':'#d7c4ff';
          if(mode==='bubbles'){ctx.strokeStyle='#9fdaff';ctx.lineWidth=1.1;ctx.arc(p.x,p.y,p.rx*2.1,0,Math.PI*2);ctx.stroke();}
          else{ctx.arc(p.x,p.y,p.rx*(mode==='stars'?.62:1),0,Math.PI*2);ctx.fill();}
          if(mode==='snow'||mode==='bubbles'){p.y-=mode==='bubbles'?p.speed*.38:-p.speed*.45;p.x+=Math.sin(tick+p.phase)*.35;}
          else if(mode==='fireflies'){p.x+=Math.sin(tick+p.phase)*.28;p.y+=Math.cos(tick+p.phase)*.25;}
          else{p.y+=.035;p.x+=.012;}
        }
        if(p.y>height+28||p.y < -28||p.x< -30||p.x>width+30)arr[i]=spawn(false);
      }ctx.globalAlpha=1;raf=requestAnimationFrame(frame);}
    const observer=typeof ResizeObserver!=='undefined'?new ResizeObserver(reset):null;observer?.observe(stage);
    const onResize=()=>reset();if(!observer)window.addEventListener('resize',onResize);
    reset();raf=requestAnimationFrame(frame);
    return ()=>{cancelAnimationFrame(raf);observer?.disconnect();window.removeEventListener('resize',onResize);};
  }
  window.ProfileStudio = {defaults:clone(defaults),clone,normalize,render,validURL};
})();
