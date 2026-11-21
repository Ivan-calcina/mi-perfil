/* Editor visual VANTA — los cambios se almacenan solo en tu navegador hasta exportarlos. */
(() => {
  'use strict';
  const KEY='vanta-profile-studio-draft-v1';
  const $=sel=>document.querySelector(sel);
  const fields=$('#editor-fields'), title=$('#section-title'), desc=$('#section-description');
  let state=ProfileStudio.clone(ProfileStudio.defaults),tab='identity',frame=0,toastTimer=0;
  const presets={
    nebula:{accent:'#aa77ff',secondary:'#4bdded',background:'#080714',text:'#f5f1ff'},
    ember:{accent:'#ff6382',secondary:'#ffc076',background:'#140911',text:'#fff1f3'},
    frost:{accent:'#55bcff',secondary:'#a4f4ff',background:'#071320',text:'#f0fbff'},
    forest:{accent:'#59e9ad',secondary:'#bdff9a',background:'#071510',text:'#e9fff3'},
    mono:{accent:'#f0f0f5',secondary:'#a9a9bb',background:'#090910',text:'#f0f0f5'},
    sunset:{accent:'#ed86c2',secondary:'#ffd28e',background:'#1a0b1a',text:'#fff3f9'}
  };
  const tabs={
    identity:['Tu identidad digital','Cuenta quién eres y haz que el perfil se sienta tuyo.'],
    style:['Diseña tu universo','Cambia colores, formas, botones y estilos sin escribir código.'],
    effects:['Efectos que destacan','Partículas, animaciones y detalles que hacen la diferencia.'],
    media:['Tu mundo multimedia','Agrega fondos animados y música con enlaces directos.'],
    links:['Tus enlaces, a tu manera','Ordena y personaliza tus redes, páginas y proyectos.'],
    widgets:['Muestra mucho más','Tus proyectos, habilidades y pequeños detalles personales.'],
    advanced:['Control total','Importa, exporta y agrega CSS a tu diseño.']
  };
  const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function get(path){return path.split('.').reduce((o,k)=>o?.[k],state);}
  function set(path,value){const bits=path.split('.');let v=state;bits.slice(0,-1).forEach(k=>{v=v[k];});v[bits.at(-1)]=value;}
  function group(label,content,code='',note=''){return `<section class="edit-group"><div class="group-head"><h2>${label}</h2><span>${code}</span></div>${note?`<p class="group-desc">${note}</p>`:''}${content}</section>`;}
  function input(path,label,hint='',placeholder=''){return `<div class="field"><label for="f-${esc(path)}">${label}</label><input id="f-${esc(path)}" type="text" data-path="${esc(path)}" value="${esc(get(path))}" placeholder="${esc(placeholder)}">${hint?`<small>${hint}</small>`:''}</div>`;}
  function textarea(path,label,rows=3,hint=''){return `<div class="field"><label for="f-${esc(path)}">${label}</label><textarea id="f-${esc(path)}" rows="${rows}" data-path="${esc(path)}">${esc(get(path))}</textarea>${hint?`<small>${hint}</small>`:''}</div>`;}
  function special(path,label){return `<div class="field"><label>${label}</label><input type="text" data-special="${esc(path)}" value="${esc((get(path)||[]).join(', '))}" placeholder="Separar con comas"><small>Separa los elementos con una coma.</small></div>`;}
  function select(path,label,opts){return `<div class="field"><label for="f-${esc(path)}">${label}</label><select id="f-${esc(path)}" data-path="${esc(path)}">${opts.map(([value,label])=>`<option value="${esc(value)}" ${get(path)===value?'selected':''}>${esc(label)}</option>`).join('')}</select></div>`;}
  function range(path,label,min,max,unit=''){const v=get(path);return `<div class="field"><div class="range-head"><label for="f-${esc(path)}">${label}</label><output data-output="${esc(path)}">${esc(v)}${unit}</output></div><input id="f-${esc(path)}" type="range" min="${min}" max="${max}" value="${esc(v)}" data-path="${esc(path)}" data-number="true" data-unit="${unit}"></div>`;}
  function colors(paths){return `<div class="field-grid">${paths.map(([p,label])=>`<div class="field"><label>${label}</label><div class="color-input-wrap"><input type="color" data-path="${esc(p)}" value="${esc(get(p))}"><code data-color-label="${esc(p)}">${esc(get(p))}</code></div></div>`).join('')}</div>`;}
  function toggle(path,label,small){return `<label class="toggle-row"><span><strong>${label}</strong><small>${small}</small></span><input type="checkbox" data-path="${esc(path)}" ${get(path)?'checked':''}></label>`;}
  function listItem(kind,item,i){const isLink=kind==='links';const iconOpts=['link','github','instagram','discord','youtube','tiktok','spotify','twitch','telegram','x','email','globe','steam','roblox'];
    return `<div class="collection-item"><div class="item-top"><strong>${isLink?'ENLACE':'PROYECTO'} ${String(i+1).padStart(2,'0')}</strong><div class="item-actions"><button type="button" class="small-icon-btn" title="Subir" data-action="move-up" data-kind="${kind}" data-index="${i}">↑</button><button type="button" class="small-icon-btn" title="Bajar" data-action="move-down" data-kind="${kind}" data-index="${i}">↓</button><button type="button" class="small-icon-btn danger" title="Eliminar" data-action="remove" data-kind="${kind}" data-index="${i}">×</button></div></div>
    <div class="collection-grid">
      <label>${isLink?'Texto del botón':'Nombre'}<input data-path="${kind}.${i}.${isLink?'title':'title'}" value="${esc(item.title)}"></label>
      <label>${isLink?'Icono':'Categoría'}${isLink?`<select data-path="links.${i}.icon">${iconOpts.map(v=>`<option value="${v}" ${item.icon===v?'selected':''}>${v}</option>`).join('')}</select>`:`<input data-path="widgets.projects.${i}.tag" value="${esc(item.tag)}">`}</label>
      ${!isLink?`<label class="full">Descripción<input data-path="widgets.projects.${i}.description" value="${esc(item.description)}"></label>`:''}
      <label class="full">URL (https://...)<input data-path="${isLink?'links':'widgets.projects'}.${i}.url" value="${esc(item.url)}" placeholder="https://..."></label>
      ${isLink?`<label class="full" style="flex-direction:row;align-items:center;justify-content:space-between">Mostrar en mi perfil <input class="collection-visible" type="checkbox" data-path="links.${i}.visible" ${item.visible!==false?'checked':''}></label>`:''}
    </div></div>`;
  }
  function collection(kind){const arr=kind==='links'?state.links:state.widgets.projects;return `<div class="collection-list">${arr.map((x,i)=>listItem(kind,x||{},i)).join('')}</div><button class="add-item" type="button" data-action="add" data-kind="${kind}">＋ Agregar ${kind==='links'?'enlace':'proyecto'}</button>`;}
  function renderFields(){
    title.innerHTML=esc(tabs[tab][0])+'<span class="title-dot">.</span>';desc.textContent=tabs[tab][1];
    let content='';
    if(tab==='identity'){
      content+=group('Datos del perfil',input('name','Nombre visible')+input('username','Nombre de usuario')+input('subtitle','Subtítulo')+textarea('bio','Biografía',4),'01 / 03');
      content+=group('Imagen e información',input('avatar','URL del avatar','URL de imagen (.png, .jpg, .gif, .webp) o ruta local ./assets/avatar.png')+input('status','Estado personalizado')+input('location','Ubicación / texto libre'),'02 / 03');
      content+=group('Insignias',special('badges','Tus insignias'),'03 / 03','Personaliza tus insignias; puedes agregar tantas como quieras.');
    } else if(tab==='style'){
      const active=Object.keys(presets).find(k=>Object.keys(presets[k]).every(p=>get('theme.'+p)===presets[k][p]));
      content+=group('Paletas listas para usar',`<div class="preset-grid">${Object.keys(presets).map(k=>`<button class="preset ${active===k?'active':''}" type="button" data-preset="${k}">${({nebula:'Nebula',ember:'Ember',frost:'Frost',forest:'Forest',mono:'Mono',sunset:'Sunset'})[k]}</button>`).join('')}</div>`,'01 / 03');
      content+=group('Personaliza los colores',colors([['theme.accent','Color principal'],['theme.secondary','Color secundario'],['theme.background','Fondo base'],['theme.text','Color del texto']])+`<div class="field-grid">${select('theme.font','Tipografía',[['space','Space Grotesk'],['sans','DM Sans'],['mono','JetBrains Mono']])}${select('theme.animatedTitle','Efecto del nombre',[['shine','Brillo animado'],['glitch','Glitch'],['neon','Neón'],['none','Sin efecto']])}${select('theme.alignment','Alineación',[['center','Centrado'],['left','Izquierda']])}${select('theme.layout','Ancho de tarjeta',[['compact','Compacto'],['wide','Amplio']])}${select('theme.buttonStyle','Estilo de enlaces',[['glass','Cristal'],['solid','Sólido'],['outline','Contorno']])}</div>`,'02 / 03');
      content+=group('Forma y acabados',range('theme.opacity','Opacidad de la tarjeta',12,100,'%')+range('theme.blur','Desenfoque de fondo',0,50,'px')+range('theme.radius','Redondeo de tarjeta',4,48,'px')+toggle('theme.glow','Resplandor','Ilumina el contorno de la tarjeta.')+toggle('theme.gradient','Texto con degradado','Aplica colores al nombre.'),'03 / 03');
    } else if(tab==='effects'){
      content+=group('Atmósfera',select('effects.background','Efecto de fondo',[['stars','✦ Estrellas'],['snow','❄ Nieve'],['rain','☂ Lluvia'],['fireflies','✳ Luciérnagas'],['bubbles','◌ Burbujas'],['none','Ninguno']])+range('effects.density','Cantidad de partículas',5,100,'%'),'01 / 02','Los efectos están hechos con Canvas y funcionan sin bibliotecas externas.');
      content+=group('Interacciones',toggle('effects.cursorTrail','Estela del cursor','Chispas al mover el cursor por el perfil.')+toggle('effects.cardTilt','Tarjeta inclinable','Reacciona al movimiento del mouse.')+toggle('effects.animatedOrbs','Luces ambientales','Burbujas luminosas animadas detrás del perfil.'),'02 / 02');
    } else if(tab==='media'){
      content+=group('Imagen y video',input('media.backgroundImage','URL de imagen de fondo','Usa un archivo .jpg, .png, .gif o .webp; también sirve ./assets/fondo.jpg')+input('media.backgroundVideo','URL de video de fondo','Usa un archivo .mp4 o .webm DIRECTO; si lo defines, reemplaza la imagen.','https://.../video.mp4'),'01 / 03');
      content+=group('Música',input('media.music','URL directa de audio','Utiliza un archivo .mp3, .ogg o .wav; enlaces de Spotify o YouTube no son archivos directos.')+input('media.songName','Nombre de la canción'),'02 / 03','La reproducción se inicia al pulsar el botón de música, por restricciones del navegador.');
      content+=group('Pantalla de bienvenida',toggle('media.introEnabled','Activar pantalla de entrada','Muestra una portada antes de entrar al perfil público.')+input('media.introTitle','Título de entrada')+input('media.introSubtitle','Subtítulo de entrada'),'03 / 03');
    } else if(tab==='links'){
      content+=group('Administrar enlaces',collection('links'),'ENLACES','Agrega, elimina, oculta o reordena los botones. Cada enlace abre una pestaña nueva.');
    } else if(tab==='widgets'){
      content+=group('Información adicional',toggle('widgets.showStatus','Mostrar estado','Una etiqueta de lo que estás haciendo.')+toggle('widgets.showLocation','Mostrar ubicación','Puede ser cualquier texto, no tiene que ser tu ubicación real.')+toggle('widgets.showClock','Mostrar reloj','La hora local del visitante en su navegador.')+toggle('widgets.showProjects','Mostrar proyectos','Tarjetas con enlaces a tus proyectos.'),'01 / 03');
      content+=group('Detalles personalizados',special('widgets.skills','Etiquetas / habilidades')+input('widgets.quote','Frase especial'),'02 / 03');
      content+=group('Tus proyectos',collection('widgets.projects'),'03 / 03');
    } else if(tab==='advanced'){
      content+=group('CSS personalizado',textarea('customCss','Escribe tu CSS aquí',8,'Puedes apuntar a .profile-card, .profile-name, .profile-link y demás clases del perfil.'),'01 / 03','Este CSS se aplica a tu perfil. Úsalo solo con estilos de confianza.');
      content+=group('Guardar y transferir',`<div class="action-stack"><button class="ui-btn primary" type="button" data-action="export">↓ Descargar config.json</button><button class="ui-btn secondary" type="button" data-action="import">↑ Importar JSON</button><button class="ui-btn ghost" type="button" data-action="reset">↺ Restablecer ejemplo</button></div><p class="editor-help">El editor guarda un <strong>borrador local</strong>. Para que los visitantes vean los cambios, descarga <strong>config.json</strong> y reemplázalo en tu repositorio de GitHub.</p>`,'02 / 03');
      content+=group('Cómo publicarlo',`<div class="code-help">1. Sube los archivos a un repositorio de GitHub.<br>2. Settings → Pages → Deploy from a branch.<br>3. Selecciona main y / (root).<br>4. Edita aquí y exporta config.json.<br>5. Reemplaza config.json en GitHub.<br>6. Tu página pública se actualiza al publicarse el commit.</div>`,'03 / 03');
    }
    fields.innerHTML=content;
    document.querySelectorAll('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===tab));
  }
  function renderPreview(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const win=$('#preview-window'),scroll=win.scrollTop;ProfileStudio.render($('#preview-root'),state,{mode:'preview'});win.scrollTop=scroll;});}
  function saveDraft(){try{localStorage.setItem(KEY,JSON.stringify(state));$('#draft-status').textContent='Guardado en navegador';}catch(_){$('#draft-status').textContent='Almacenamiento no disponible';}}
  function notify(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2700);}
  function exportJSON(){const json=JSON.stringify(state,null,2)+'\n';const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='config.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Archivo config.json descargado. Súbelo a GitHub para publicar cambios.');}
  function changeData(e){const target=e.target,path=target.dataset.path;
    if(path){const val=target.type==='checkbox'?target.checked:target.dataset.number==='true'?Number(target.value):target.value;set(path,val);
      const out=fields.querySelector(`[data-output="${CSS.escape(path)}"]`);if(out)out.textContent=val+(target.dataset.unit||'');
      const colorLabel=fields.querySelector(`[data-color-label="${CSS.escape(path)}"]`);if(colorLabel)colorLabel.textContent=val;
      if(path.startsWith('theme.'))fields.querySelectorAll('.preset').forEach(p=>p.classList.remove('active'));
    }else if(target.dataset.special){set(target.dataset.special,target.value.split(',').map(s=>s.trim()).filter(Boolean).slice(0,25));}
    else return;
    saveDraft();renderPreview();
  }
  fields.addEventListener('input',changeData);
  fields.addEventListener('change',changeData);
  fields.addEventListener('click',e=>{
    const preset=e.target.closest('[data-preset]');if(preset){Object.assign(state.theme,presets[preset.dataset.preset]);saveDraft();renderFields();renderPreview();notify('Paleta aplicada');return;}
    const btn=e.target.closest('[data-action]');if(!btn)return;
    const action=btn.dataset.action;
    if(action==='export')return exportJSON();
    if(action==='import')return $('#import-input').click();
    if(action==='reset'){if(!confirm('¿Restablecer el perfil de ejemplo? Se reemplaza tu borrador local.'))return;state=ProfileStudio.clone(ProfileStudio.defaults);saveDraft();renderFields();renderPreview();notify('Ejemplo restaurado');return;}
    const kind=btn.dataset.kind;if(!kind)return;
    const arr=kind==='links'?state.links:state.widgets.projects,index=Number(btn.dataset.index);
    if(action==='add')arr.push(kind==='links'?{title:'Nuevo enlace',url:'https://',icon:'link',visible:true}:{title:'Nuevo proyecto',description:'Descripción del proyecto',url:'https://',tag:'WEB'});
    if(action==='remove')arr.splice(index,1);
    if(action==='move-up'&&index>0)[arr[index-1],arr[index]]=[arr[index],arr[index-1]];
    if(action==='move-down'&&index<arr.length-1)[arr[index+1],arr[index]]=[arr[index],arr[index+1]];
    saveDraft();renderFields();renderPreview();
  });
  document.querySelector('.studio-nav').addEventListener('click',e=>{const btn=e.target.closest('[data-tab]');if(!btn)return;tab=btn.dataset.tab;renderFields();});
  document.querySelectorAll('[data-preview]').forEach(btn=>btn.addEventListener('click',()=>{const mobile=btn.dataset.preview==='mobile';$('#preview-window').classList.toggle('mobile-view',mobile);document.querySelectorAll('[data-preview]').forEach(b=>b.classList.toggle('active',b===btn));renderPreview();}));
  $('#save-draft').addEventListener('click',()=>{saveDraft();notify('Borrador guardado en este navegador');});
  $('#export-top').addEventListener('click',exportJSON);
  $('#import-input').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const obj=JSON.parse(await file.text());if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('JSON inválido');state=ProfileStudio.normalize(obj);saveDraft();renderFields();renderPreview();notify('Configuración importada correctamente');}catch(err){notify('No se pudo importar: '+err.message);}e.target.value='';});
  async function init(){
    try{const res=await fetch('./config.json',{cache:'no-store'});if(res.ok)state=ProfileStudio.normalize(await res.json());}catch(_){}
    try{const saved=localStorage.getItem(KEY);if(saved)state=ProfileStudio.normalize(JSON.parse(saved));}catch(_){}
    renderFields();renderPreview();
  }
  init();
})();
