/* VANTA Forest — plantilla nocturna. Diseño original inspirado en perfiles minimalistas. */
(() => {
  'use strict';
  if (!window.ProfileStudio) return;
  const previousRender = ProfileStudio.render;
  const glyph = {github:'GH',instagram:'IG',discord:'DC',youtube:'YT',tiktok:'TT',spotify:'SP',twitch:'TW',telegram:'TG',x:'X',email:'@',globe:'↗',steam:'ST',roblox:'RB',xbox:'XB',link:'↗'};
  const brand = new Set(['github','instagram','discord','youtube','tiktok','spotify','twitch','telegram','x','steam','roblox','xbox']);
  const create = (tag,cls,txt) => {const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=String(txt);return n;};
  const url = val => ProfileStudio.validURL(val);
  const fmt = val => {if(!Number.isFinite(val))return '0:00';const n=Math.max(0,Math.floor(val));return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;};
  const clamp = (v,a,b) => Math.min(b,Math.max(a,Number(v)||0));
  const image = (src,cls,alt) => {const img=create('img',cls);img.src=src;img.alt=alt||'';img.loading='lazy';img.decoding='async';return img;};
  function forestRender(root,raw,opts={}) {
    if (!root) return;
    const c=ProfileStudio.normalize(raw);
    if(c.theme.layout!=='forest') return previousRender(root,c,opts);
    if(typeof root.__dispose==='function')root.__dispose();
    root.replaceChildren();root.classList.add('profile-host');
    const preview=opts.mode==='preview', ds=[];
    const st=create('section','forest-stage'+(preview?' forest-preview':''));
    const theme=c.theme,media=c.media,widgets=c.widgets;
    const hex=v=>/^#[a-f\d]{6}$/i.test(v)?v:'#ffffff';
    st.style.setProperty('--forest-accent',hex(theme.accent));
    st.style.setProperty('--forest-color',hex(theme.text));
    st.style.setProperty('--forest-radius',clamp(theme.radius,4,48)+'px');
    st.style.setProperty('--forest-blur',clamp(theme.blur,0,50)+'px');
    st.style.setProperty('--forest-alpha',String(clamp(theme.opacity,12,100)/230));
    st.dataset.font=['space','sans','mono'].includes(theme.font)?theme.font:'space';
    st.classList.toggle('forest-no-glow',!theme.glow);
    const backdrop=create('div','forest-backdrop');st.append(backdrop);
    if(url(media.backgroundVideo)){
      const vid=create('video','forest-video');vid.autoplay=true;vid.muted=true;vid.loop=true;vid.playsInline=true;vid.preload='metadata';vid.src=url(media.backgroundVideo);backdrop.append(vid);
      vid.play().catch(()=>{});ds.push(()=>{vid.pause();vid.removeAttribute('src');vid.load();});
    }else if(url(media.backgroundImage)){
      backdrop.style.backgroundImage=`url("${url(media.backgroundImage).replace(/["\\]/g,'')}"), url("./forest-fallback.svg")`;
    }
    st.append(create('div','forest-overlay'));
    if(c.effects.animatedOrbs)st.append(create('div','forest-fog'));
    // Hojas y chispas suaves, con posiciones deterministas para la vista previa.
    const kinds={snow:'❄',stars:'✦',fireflies:'✳',rain:'·',bubbles:'◌'};
    const particleChar=kinds[c.effects.background];
    if(particleChar && !matchMedia('(prefers-reduced-motion: reduce)').matches){
      const layer=create('div','forest-particles');const count=Math.min(30,Math.max(5,Math.round(clamp(c.effects.density,5,100)/4)));
      for(let i=0;i<count;i++){
        const fl=create('span','forest-particle',particleChar);
        fl.style.left=((i*47.13+12.8)%100)+'%';fl.style.top=((i*23.71+5.3)%100)+'%';
        fl.style.animationDelay=(-((i*2.17)%18))+'s';fl.style.animationDuration=(11+(i%7)*2.3)+'s';
        fl.style.opacity=String(.22+((i*7)%6)/13);layer.append(fl);
      }st.append(layer);
    }
    const col=create('main','forest-column');st.append(col);
    const avatar=create('div','forest-avatar');
    const avatarUrl=url(c.avatar);
    if(avatarUrl)avatar.append(image(avatarUrl,'forest-avatar-img','Avatar de '+c.name));
    else avatar.append(create('span','forest-avatar-letter',(c.name||'I').slice(0,1).toUpperCase()));
    col.append(avatar);
    col.append(create('h1','forest-name',c.name||'Mi perfil'));
    if(c.subtitle)col.append(create('p','forest-subtitle',c.subtitle));
    if(c.bio)col.append(create('p','forest-bio',c.bio));
    if(widgets.showLocation&&c.location){const loc=create('p','forest-location');loc.append(create('span','forest-location-pin','◆'),document.createTextNode(' '+c.location));col.append(loc);}
    if(widgets.showStatus&&c.status)col.append(create('p','forest-status',c.status));
    if(widgets.showFriendCard){
      const friend=create('aside','forest-friend');const face=create('div','forest-friend-avatar');
      const fUrl=url(widgets.friendAvatar)||avatarUrl;
      if(fUrl)face.append(image(fUrl,'','Imagen de la tarjeta destacada'));
      else face.append(create('span','','✦'));
      const info=create('div','forest-friend-info');
      const head=create('div','forest-friend-head');head.append(create('strong','',widgets.friendName||'Conexión destacada'),create('span','forest-friend-badge','✦'));
      info.append(head,create('p','forest-friend-message',widgets.friendSubtitle||'Este espacio es tuyo'));
      const ornamental=create('div','forest-friend-decoration','╭──────────── ✧ ☾ ✦ ☽ ────────────╮');info.append(ornamental);
      friend.append(face,info);col.append(friend);
    }
    const links=(c.links||[]).filter(l=>l && l.visible!==false && url(l.url));
    if(links.length){const row=create('nav','forest-socials');row.setAttribute('aria-label','Mis redes sociales');
      links.forEach(l=>{
        const a=create('a','forest-social');a.href=url(l.url);a.target='_blank';a.rel='noopener noreferrer';a.title=l.title||'Visitar enlace';a.setAttribute('aria-label',l.title||'Visitar enlace');
        const b=String(l.icon||'link').toLowerCase();
        if(brand.has(b)){
          const ico=image('https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/'+b+'.svg','forest-brand','');
          ico.addEventListener('error',()=>ico.replaceWith(create('span','forest-icon-fallback',glyph[b]||'↗')),{once:true});a.append(ico);
        }else a.append(create('span','forest-icon-fallback',glyph[b]||'↗'));
        row.append(a);
      });col.append(row);
    }
    if(widgets.showClock){const clock=create('span','forest-clock');col.append(clock);const update=()=>clock.textContent=new Intl.DateTimeFormat('es-PE',{hour:'2-digit',minute:'2-digit'}).format(new Date());update();const id=setInterval(update,60000);ds.push(()=>clearInterval(id));}
    const player=create('section','forest-player');player.setAttribute('aria-label','Reproductor de música');
    const cover=create('div','forest-album');const coverURL=url(media.musicCover);
    if(coverURL)cover.append(image(coverURL,'','Portada de la canción'));
    else cover.append(create('span','','♫'));
    const track=create('div','forest-track');track.append(create('strong','forest-track-name',media.songName||'Tu canción favorita'));
    if(media.songArtist)track.append(create('span','forest-track-artist',media.songArtist));
    const progress=create('div','forest-progress');const current=create('span','forest-time','0:00');
    const scrub=create('input','forest-seek');scrub.type='range';scrub.min='0';scrub.max='1000';scrub.value='0';scrub.step='1';scrub.setAttribute('aria-label','Posición de la canción');
    const duration=create('span','forest-time','0:00');progress.append(current,scrub,duration);track.append(progress);
    const controls=create('div','forest-player-controls');const play=create('button','forest-play','▶');play.type='button';play.setAttribute('aria-label','Reproducir');controls.append(play);
    player.append(cover,track,controls);col.append(player);
    const src=url(media.music),sound=create('button','forest-sound','♫');sound.type='button';sound.setAttribute('aria-label','Activar o silenciar música');st.append(sound);
    if(src){
      const audio=create('audio');audio.src=src;audio.preload='metadata';audio.loop=true;st.append(audio);
      const update=()=>{
        const total=Number.isFinite(audio.duration)?audio.duration:0;
        current.textContent=fmt(audio.currentTime);duration.textContent=fmt(total);
        if(total) scrub.value=String(Math.round(audio.currentTime/total*1000));
        scrub.style.setProperty('--progress',String(total?audio.currentTime/total*100:0)+'%');
        play.textContent=audio.paused?'▶':'Ⅱ';play.setAttribute('aria-label',audio.paused?'Reproducir':'Pausar');
        sound.textContent=audio.muted?'♪':'♫';sound.setAttribute('aria-label',audio.muted?'Activar música':'Silenciar música');
      };
      const toggle=()=>audio.paused?audio.play().catch(()=>{play.title='Revisa la URL del audio';}):audio.pause();
      play.addEventListener('click',toggle);
      sound.addEventListener('click',()=>{audio.muted=!audio.muted;update();});
      scrub.addEventListener('input',()=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(scrub.value)/1000*audio.duration;update();});
      ['loadedmetadata','timeupdate','play','pause','volumechange','ended'].forEach(ev=>audio.addEventListener(ev,update));
      update();ds.push(()=>{audio.pause();audio.removeAttribute('src');audio.load();});
    }else{
      play.disabled=true;play.title='Añade un enlace directo a un MP3 desde Multimedia';
      scrub.disabled=true;sound.disabled=true;sound.title='Añade música desde el editor';
      track.querySelector('.forest-track-artist')?.remove();
      track.insertBefore(create('span','forest-track-artist','Configura tu MP3 en el editor'),progress);
    }
    if(media.introEnabled&&!preview){
      const intro=create('div','forest-intro');const btn=create('button','forest-intro-button',media.introTitle||'ENTRAR');
      btn.type='button';intro.append(btn,create('p','',media.introSubtitle||'Haz clic para entrar'));
      btn.addEventListener('click',()=>intro.remove());st.append(intro);
    }
    if(typeof c.customCss==='string'&&c.customCss.trim()){
      const css=create('style');css.textContent=c.customCss.slice(0,30000);st.append(css);
    }
    root.append(st);root.__dispose=()=>ds.forEach(fn=>{try{fn();}catch(_){}});
    if(!preview)document.title=(c.name||'Mi perfil')+' — Mi espacio';
  }
  ProfileStudio.render=forestRender;
})();
