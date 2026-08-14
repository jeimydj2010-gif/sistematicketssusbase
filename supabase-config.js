// ============================================================================
// TURNERO DE PRUEBAS V14.4 - CONFIGURACION CENTRALIZADA DE SUPABASE
// ============================================================================
// OPCION A (recomendada para GitHub Pages):
// Pegue aqui la URL y la Publishable/Anon key del PROYECTO DE PRUEBAS.
// NO utilice la service_role key en el frontend.
//
// OPCION B:
// Deje estos valores vacios y abra configurar-supabase.html. La configuracion
// se guardara en localStorage del navegador de ese equipo.
// ============================================================================
(function(){
  'use strict';

  const FILE_CONFIG = {
    url: '',
    anonKey: ''
  };

  const STORAGE_KEY = 'cordillera_turnero_supabase_pruebas_v14';
  const DUMMY_CONFIG = {
    // Valores sintacticamente validos para evitar que createClient lance un
    // error JavaScript mientras el navegador redirige a la configuracion.
    url: 'https://configuracion-pendiente.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.configuracion-pendiente-turnero-pruebas.no-usar'
  };

  function clean(v){ return String(v || '').trim(); }
  function normalize(cfg){
    return { url: clean(cfg && cfg.url).replace(/\/$/, ''), anonKey: clean(cfg && cfg.anonKey) };
  }
  function isPlaceholder(v){
    const s = clean(v).toLowerCase();
    return !s || s.includes('pega_aqui') || s.includes('tu-proyecto') || s.includes('configuracion-pendiente');
  }
  function isValid(cfg){
    cfg = normalize(cfg);
    if(isPlaceholder(cfg.url) || isPlaceholder(cfg.anonKey)) return false;
    try {
      const u = new URL(cfg.url);
      return u.protocol === 'https:' && /\.supabase\.co$/i.test(u.hostname) && cfg.anonKey.length >= 20;
    } catch(e){ return false; }
  }
  function readStored(){
    try { return normalize(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); }
    catch(e){ return {url:'', anonKey:''}; }
  }

  const fileCfg = normalize(FILE_CONFIG);
  const storedCfg = readStored();
  const activeCfg = isValid(fileCfg) ? fileCfg : (isValid(storedCfg) ? storedCfg : DUMMY_CONFIG);
  const configured = isValid(fileCfg) || isValid(storedCfg);

  window.TURNERO_SUPABASE = Object.freeze(activeCfg);
  window.TURNERO_CONFIG_MISSING = !configured;
  window.TURNERO_FEATURES = Object.freeze({
    turneroEnabled: true,
    recepcionEnabled: true,
    panelAtencionEnabled: true,
    supervisionEnabled: true,
    pantallaTvEnabled: true,
    horariosEnabled: true,
    ventanillasEnabled: true,
    reportesTurneroEnabled: true,
    testMode: true
  });
  window.TURNERO_CONFIG = Object.freeze({
    storageKey: STORAGE_KEY,
    isConfigured: function(){ return configured; },
    get: function(){ return normalize(activeCfg); },
    validate: isValid,
    save: function(cfg){
      const normalized = normalize(cfg);
      if(!isValid(normalized)) throw new Error('La URL o la Publishable/Anon key de Supabase no son validas.');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    },
    clear: function(){ localStorage.removeItem(STORAGE_KEY); },
    setupUrl: function(returnTo){
      const ret = returnTo || (location.pathname.split('/').pop() || 'index.html');
      return 'configurar-supabase.html?return=' + encodeURIComponent(ret + location.search + location.hash);
    }
  });

  // Si el paquete se sube a GitHub sin configurar las credenciales, no se
  // muestra un error de JavaScript: se envia a una pantalla de configuracion.
  if(!configured && !/configurar-supabase\.html$/i.test(location.pathname)){
    const target = window.TURNERO_CONFIG.setupUrl();
    try { location.replace(target); } catch(e) { location.href = target; }
  }
})();
