/* VANTA NOCTURNO / editor independiente para el modo Bosque. */
(() => {
  'use strict';
  const KEY = 'vanta-night-editor-draft-v1';
  const $ = q => document.querySelector(q);
  const fields = $('#fields'), preview = $('#night-preview-root');
  const clone = o => JSON.parse(JSON.stringify(o));
  const escape = x => String(x ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let published = ProfileStudio.clone(ProfileStudio.defaults);
  let state = clone(published), section = 'perfil', frame = 0, messageTimeout = 0;
  const sections = {
    perfil: ['Tu perfil', 'Nombre, foto y datos que aparecen en tu página.'],
    fondo: ['Fondo y apariencia', 'El escenario oscuro, transparencias y colores.'],
    tarjeta: ['Tarjeta destacada', 'Personaliza el recuadro translúcido bajo tu nombre.'],
    redes: ['Tus redes sociales', 'Los iconos que aparecen debajo de la tarjeta.'],
    musica: ['Tu reproductor', 'Canción, portada, artista y sonido de fondo.'],
    efectos: ['Efectos visuales', 'Partículas y animaciones del bosque nocturno.'],
    avanzado: ['Guardar y publicar', 'Administra tus borradores y exporta el perfil.']
  };
  const iconTypes = ['discord','xbox','spotify','github','twitch','tiktok','steam','instagram','youtube','telegram','x','email','globe','roblox','link'];
  const pathValue = path => path.split('.').reduce((o,p)=>o?.[p],state);
  function setPath(path,value){const keys=path.split('.');let obj=state;for(const k of keys.slice(0,-1))obj=obj[k];obj[keys[keys.length-1]]=value;}
  const group = (name,inner,note='') => `<section class="night-group"><h2>${escape(name)}</h2>${note?`<p class="group-hint">${escape(note)}</p>`:''}${inner}</section>`;
  const textField = (path,label,hint='',placeholder='') => `<div class="night-field"><label for="field-${escape(path)}">${escape(label)}</label><input id="field-${escape(path)}" type="text" data-path="${escape(path)}" value="${escape(pathValue(path))}" placeholder="${escape(placeholder)}" autocomplete="off">${hint?`<small>${escape(hint)}</small>`:''}</div>`;
  const areaField = (path,label) => `<div class="night-field"><label for="field-${escape(path)}">${escape(label)}</label><textarea id="field-${escape(path)}" data-path="${escape(path)}" rows="3">${escape(pathValue(path))}</textarea></div>`;
  const toggle = (path,label,hint='') => `<label class="night-toggle"><span>${escape(label)}${hint?`<small>${escape(hint)}</small>`:''}</span><input type="checkbox" data-path="${escape(path)}" ${pathValue(path)?'checked':''}></label>`;
  const select = (path,label,items) => `<div class="night-field"><label for="field-${escape(path)}">${escape(label)}</label><select id="field-${escape(path)}" data-path="${escape(path)}">${items.map(([value,name])=>`<option value="${escape(value)}" ${pathValue(path)===value?'selected':''}>${escape(name)}</option>`).join('')}</select></div>`;
  const color = (path,label) => `<div class="night-field"><label for="field-${escape(path)}">${escape(label)}</label><input type="color" id="field-${escape(path)}" data-path="${escape(path)}" value="${escape(pathValue(path))}"></div>`;
  const slider = (path,label,min,max,unit='') => `<div class="night-field"><div class="range-caption"><label for="field-${escape(path)}">${escape(label)}</label><output data-output="${escape(path)}">${escape(pathValue(path))}${escape(unit)}</output></div><input type="range" id="field-${escape(path)}" data-path="${escape(path)}" min="${min}" max="${max}" data-numeric="true" data-unit="${escape(unit)}" value="${escape(pathValue(path))}"></div>`;
  function socialLinks(){
    return state.links.map((l,i)=>`<div class="night-link"><header><span>ENLACE ${String(i+1).padStart(2,'0')}</span><div class="link-actions"><button type="button" class="night-icon-btn" data-link-action="up" data-index="${i}" title="Subir">↑</button><button type="button" class="night-icon-btn" data-link-action="down" data-index="${i}" title="Bajar">↓</button><button type="button" class="night-icon-btn" data-link-action="delete" data-index="${i}" title="Eliminar">×</button></div></header><div class="night-link-grid"><label>Nombre<input data-path="links.${i}.title" value="${escape(l.title)}"></label><label>Icono<select data-path="links.${i}.icon">${iconTypes.map(icon=>`<option value="${icon}" ${l.icon===icon?'selected':''}>${icon}</option>`).join('')}</select></label><label class="full">URL de tu cuenta<input data-path="links.${i}.url" value="${escape(l.url)}" placeholder="https://..."></label><label class="full visible"><input type="checkbox" data-path="links.${i}.visible" ${l.visible!==false?'checked':''}> Mostrar esta red en mi perfil</label></div></div>`).join('');
  }
  function renderFields(){
    $('#panel-title').innerHTML=escape(sections[section][0])+'<span>.</span>';
    $('#panel-intro').textContent=sections[section][1];
    document.querySelectorAll('.night-nav button').forEach(b=>b.classList.toggle('selected',b.dataset.section===section));
    let html='';
    switch(section){
      case 'perfil':
        html+=group('Identidad',textField('name','Nombre visible')+textField('username','Nombre de usuario')+textField('subtitle','Subtítulo')+areaField('bio','Descripción'));
        html+=group('Avatar y ubicación',textField('avatar','Imagen de perfil (URL)','Puedes usar una imagen de GitHub, o ./assets/avatar.png.')+textField('location','Ubicación')+toggle('widgets.showLocation','Mostrar ubicación')+textField('status','Estado')+toggle('widgets.showStatus','Mostrar estado'));
        break;
      case 'fondo':
        html+=group('Escenario nocturno',textField('media.backgroundImage','Imagen de fondo (URL)','Admite una imagen JPG, PNG, GIF o WebP. Puedes usar ./assets/fondo.jpg')+textField('media.backgroundVideo','Video de fondo (URL)','Archivo MP4/WebM directo; tiene preferencia sobre la imagen.')+color('theme.background','Color de reserva'));
        html+=group('Tarjetas y colores',`<div class="night-pair">${color('theme.accent','Color de acento')+color('theme.text','Color del texto')}</div>`+slider('theme.opacity','Transparencia de tarjeta',12,100,'%')+slider('theme.blur','Desenfoque de tarjeta',0,50,'px')+slider('theme.radius','Bordes redondeados',4,48,'px')+toggle('theme.glow','Brillo en iconos y avatar'));
        break;
      case 'tarjeta':
        html+=group('Tarjeta de presentación',toggle('widgets.showFriendCard','Mostrar tarjeta central')+textField('widgets.friendName','Nombre o título')+textField('widgets.friendSubtitle','Texto secundario')+textField('widgets.friendAvatar','Imagen de tarjeta (URL)','Si está vacío, usa tu avatar principal.'));
        break;
      case 'redes':
        html+=group('Iconos sociales',`<p class="group-hint">Cambia las URL por las de tus cuentas reales. Solo se mostrarán los enlaces activados.</p>${socialLinks()}<button type="button" class="night-add" id="add-link">＋ Agregar otra red</button>`);
        break;
      case 'musica':
        html+=group('Música de tu perfil',textField('media.music','Archivo de música (URL)','Debe ser un MP3, OGG o WAV accesible; una URL de Spotify no reproduce audio aquí.')+textField('media.songName','Nombre de la canción')+textField('media.songArtist','Artista o descripción')+textField('media.musicCover','Imagen de portada (URL)'));
        html+=group('Pantalla de entrada',toggle('media.introEnabled','Activar pantalla de bienvenida')+textField('media.introTitle','Texto de entrada')+textField('media.introSubtitle','Texto secundario'));
        break;
      case 'efectos':
        html+=group('Partículas',select('effects.background','Animación de fondo',[['stars','✦ Estrellas / chispas'],['snow','❄ Nieve'],['rain','· Lluvia'],['fireflies','✳ Luciérnagas'],['bubbles','◌ Burbujas'],['none','Ninguna']])+slider('effects.density','Cantidad de partículas',5,100,'%')+toggle('effects.animatedOrbs','Niebla ambiental animada'));
        break;
      case 'avanzado':
        html+=group('Sincronización',`<p class="group-hint">El editor siempre abre usando el diseño público de Bosque Nocturno. Tus borradores se recuperan únicamente cuando tú los pides.</p><div class="night-row-actions"><button type="button" class="small-btn" data-do="published">↻ Cargar perfil publicado</button><button type="button" class="small-btn" data-do="restore">↶ Recuperar borrador</button><button type="button" class="small-btn highlighted" data-do="download">↓ Exportar JSON</button><button type="button" class="small-btn" data-do="import">↑ Importar JSON</button></div>`);
        html+=group('Cómo publicar',`<p class="group-hint">1. Personaliza el perfil con la vista previa.<br>2. Pulsa <strong>Exportar JSON</strong>.<br>3. Abre tu repositorio GitHub.<br>4. Sustituye <code>config.json</code> por el archivo descargado.<br>5. GitHub Pages actualizará el perfil público.</p>`);
        html+=group('CSS personalizado',areaField('customCss','Estilos adicionales',''), 'Puedes añadir CSS para personalizaciones avanzadas.');
        break;
    }
    fields.innerHTML=html;
  }
  function renderPreview(){
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{
      const holder=$('#preview-viewport'); const top=holder.scrollTop;
      ProfileStudio.render(preview,state,{mode:'preview'});
      holder.scrollTop=top;
    });
  }
  function saveDraft(){
    try{localStorage.setItem(KEY,JSON.stringify(state));$('#save-status').textContent='Borrador local guardado';}
    catch(_){$('#save-status').textContent='Borrador sin guardar';}
  }
  function toast(msg){const t=$('#night-toast');t.textContent=msg;t.classList.add('visible');clearTimeout(messageTimeout);messageTimeout=setTimeout(()=>t.classList.remove('visible'),3000);}
  function download(){
    const json=JSON.stringify(state,null,2)+'\n'; const u=URL.createObjectURL(new Blob([json],{type:'application/json'}));
    const a=document.createElement('a'); a.href=u; a.download='config.json'; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),1200);
    toast('Descargado config.json. Sustitúyelo en GitHub para publicarlo.');
  }
  function onField(e){const el=e.target,path=el.dataset.path;if(!path)return;
    const value=el.type==='checkbox'?el.checked:el.dataset.numeric==='true'?Number(el.value):el.value;
    setPath(path,value);
    const output=fields.querySelector(`[data-output="${path}"]`);if(output)output.textContent=value+(el.dataset.unit||'');
    state.theme.layout='forest';saveDraft();renderPreview();
  }
  fields.addEventListener('input',onField);
  fields.addEventListener('change',onField);
  fields.addEventListener('click',e=>{
    const add=e.target.closest('#add-link');if(add){state.links.push({title:'Nueva red',url:'https://',icon:'link',visible:true});saveDraft();renderFields();renderPreview();return;}
    const b=e.target.closest('[data-link-action]');if(b){const i=Number(b.dataset.index),action=b.dataset.linkAction;
      if(action==='delete')state.links.splice(i,1);
      if(action==='up' && i>0)[state.links[i-1],state.links[i]]=[state.links[i],state.links[i-1]];
      if(action==='down' && i<state.links.length-1)[state.links[i],state.links[i+1]]=[state.links[i+1],state.links[i]];
      saveDraft();renderFields();renderPreview();return;
    }
    const action=e.target.closest('[data-do]')?.dataset.do;if(!action)return;
    if(action==='download'){download();return;}
    if(action==='import'){$('#json-import').click();return;}
    if(action==='published'){
      if(JSON.stringify(state)!==JSON.stringify(published)&&!confirm('¿Cargar el perfil publicado? Tu último borrador seguirá guardado para recuperarlo.'))return;
      state=clone(published);state.theme.layout='forest';renderFields();renderPreview();$('#save-status').textContent='Perfil publicado';toast('Vista previa sincronizada con GitHub');return;
    }
    if(action==='restore'){
      try{const raw=localStorage.getItem(KEY);if(!raw){toast('Aún no hay un borrador anterior.');return;}state=ProfileStudio.normalize(JSON.parse(raw));state.theme.layout='forest';renderFields();renderPreview();$('#save-status').textContent='Borrador recuperado';toast('Borrador recuperado');}catch(_){toast('No se pudo recuperar el borrador.');}return;
    }
  });
  $('.night-nav').addEventListener('click',e=>{const btn=e.target.closest('[data-section]');if(!btn)return;section=btn.dataset.section;renderFields();});
  $('#desk-view').addEventListener('click',()=>{$('#preview-viewport').classList.remove('phone');$('#desk-view').classList.add('current');$('#phone-view').classList.remove('current');});
  $('#phone-view').addEventListener('click',()=>{$('#preview-viewport').classList.add('phone');$('#phone-view').classList.add('current');$('#desk-view').classList.remove('current');});
  $('#download-config').addEventListener('click',download);
  $('#json-import').addEventListener('change',async e=>{
    const f=e.target.files?.[0];if(!f)return;
    try{const v=JSON.parse(await f.text());if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Configuración inválida');state=ProfileStudio.normalize(v);state.theme.layout='forest';saveDraft();renderFields();renderPreview();toast('Configuración importada correctamente');}
    catch(e){toast('No se pudo importar: '+e.message);}e.target.value='';
  });
  async function start(){
    try{const res=await fetch('./config.json?studio=night3',{cache:'no-store'});if(!res.ok)throw Error('Error HTTP '+res.status);published=ProfileStudio.normalize(await res.json());}
    catch(e){toast('No se pudo cargar config.json; usando valores de ejemplo');}
    published.theme.layout='forest';state=clone(published);
    renderFields();renderPreview();$('#save-status').textContent='Perfil publicado';
  }
  start();
})();