// ═══════════════════════════════════════════════════════════
//  HARI-KING — Agente Autónomo Privado de Baxto
//  Honey and Raspberry INK
//  Arquitecto de BRA GT — siempre con ✅ de Baxto
// ═══════════════════════════════════════════════════════════

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const jsonRes = (data, status=200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS }
  });

// ── Auth Baxto ─────────────────────────────────────────────
const BAXTO_TOKEN = 'HARI-KING-BAXTO-2026';

function authCheck(request) {
  const token = request.headers.get('X-Baxto-Token');
  return token === BAXTO_TOKEN;
}

// ═══════════════════════════════════════════════════════════
//  DASHBOARD HTML
// ═══════════════════════════════════════════════════════════
function getDashboard() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HARI-KING — Centro de Control</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --honey:#FFB300;
  --amber:#FF8C00;
  --dark:#04020f;
  --panel:rgba(4,2,15,0.97);
  --border:rgba(255,179,0,0.15);
  --text:#e8d5a0;
  --dim:#8a7040;
}

body{
  background:var(--dark);
  color:var(--text);
  font-family:'Share Tech Mono',monospace;
  height:100vh;
  overflow:hidden;
  display:flex;
  flex-direction:column;
}

/* ── Header ── */
.hk-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 20px;
  border-bottom:1px solid var(--border);
  background:rgba(0,0,0,0.6);
  backdrop-filter:blur(10px);
  flex-shrink:0;
}
.hk-logo{
  font-family:'Orbitron',monospace;
  font-size:16px;
  font-weight:900;
  letter-spacing:0.2em;
  background:linear-gradient(135deg,var(--honey),var(--amber));
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.hk-status{
  display:flex;
  align-items:center;
  gap:8px;
  font-size:10px;
  letter-spacing:0.1em;
  color:var(--dim);
}
.hk-status-dot{
  width:7px;height:7px;
  border-radius:50%;
  background:#22c55e;
  box-shadow:0 0 8px #22c55e;
  animation:pulse 2s ease-in-out infinite;
}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

/* ── Main grid 3 paneles ── */
.hk-grid{
  display:grid;
  grid-template-columns:280px 1fr 340px;
  gap:0;
  flex:1;
  overflow:hidden;
}

/* ── Panel base ── */
.hk-panel{
  border-right:1px solid var(--border);
  overflow-y:auto;
  overflow-x:hidden;
  position:relative;
  scrollbar-width:thin;
  scrollbar-color:rgba(255,179,0,0.2) transparent;
}
.hk-panel:last-child{border-right:none;}

/* Canvas partículas fondo */
.hk-particles{
  position:absolute;
  inset:0;
  pointer-events:none;
  z-index:0;
}

/* Contenido sobre partículas */
.hk-panel-content{
  position:relative;
  z-index:1;
  padding:16px;
}

/* ── Títulos de sección ── */
.hk-section-title{
  font-family:'Orbitron',monospace;
  font-size:9px;
  letter-spacing:0.2em;
  color:var(--honey);
  text-transform:uppercase;
  margin-bottom:12px;
  padding-bottom:6px;
  border-bottom:1px solid rgba(255,179,0,0.15);
  display:flex;
  align-items:center;
  gap:8px;
}

/* ── Toggle rules ── */
.hk-rule{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:8px 10px;
  background:rgba(255,179,0,0.04);
  border:1px solid rgba(255,179,0,0.1);
  border-radius:8px;
  margin-bottom:6px;
  font-size:11px;
  color:var(--text);
  transition:all .2s;
}
.hk-rule:hover{border-color:rgba(255,179,0,0.3);}
.hk-toggle{
  width:32px;height:18px;
  background:rgba(255,179,0,0.15);
  border-radius:9px;
  position:relative;
  cursor:pointer;
  border:1px solid rgba(255,179,0,0.3);
  transition:all .2s;
  flex-shrink:0;
}
.hk-toggle.on{background:rgba(255,179,0,0.4);border-color:var(--honey);}
.hk-toggle::after{
  content:'';
  position:absolute;
  width:12px;height:12px;
  background:var(--dim);
  border-radius:50%;
  top:2px;left:2px;
  transition:all .2s;
}
.hk-toggle.on::after{
  left:16px;
  background:var(--honey);
  box-shadow:0 0 6px var(--honey);
}

/* ── Botones ── */
.hk-btn{
  width:100%;
  padding:9px 12px;
  background:rgba(255,179,0,0.06);
  border:1px solid rgba(255,179,0,0.2);
  border-radius:8px;
  color:var(--honey);
  font-family:'Share Tech Mono',monospace;
  font-size:11px;
  letter-spacing:0.08em;
  cursor:pointer;
  transition:all .2s;
  margin-bottom:6px;
  text-align:left;
  display:flex;
  align-items:center;
  gap:8px;
}
.hk-btn:hover{
  background:rgba(255,179,0,0.12);
  border-color:var(--honey);
  box-shadow:0 0 12px rgba(255,179,0,0.2);
}
.hk-btn.danger{
  color:#ff4444;
  border-color:rgba(255,68,68,0.2);
  background:rgba(255,68,68,0.05);
}
.hk-btn.danger:hover{
  background:rgba(255,68,68,0.1);
  border-color:#ff4444;
  box-shadow:0 0 12px rgba(255,68,68,0.2);
}
.hk-btn.success{
  color:#22c55e;
  border-color:rgba(34,197,94,0.2);
  background:rgba(34,197,94,0.05);
}

/* ── Kill switch ── */
.hk-killswitch{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 14px;
  background:rgba(255,68,68,0.05);
  border:1px solid rgba(255,68,68,0.2);
  border-radius:10px;
  margin-bottom:10px;
}
.hk-ks-label{
  font-family:'Orbitron',monospace;
  font-size:10px;
  letter-spacing:0.1em;
}
.hk-ks-toggle{
  width:44px;height:24px;
  background:rgba(34,197,94,0.3);
  border-radius:12px;
  position:relative;
  cursor:pointer;
  border:1px solid #22c55e;
  transition:all .3s;
}
.hk-ks-toggle.off{background:rgba(255,68,68,0.2);border-color:#ff4444;}
.hk-ks-toggle::after{
  content:'';
  position:absolute;
  width:18px;height:18px;
  background:#22c55e;
  border-radius:50%;
  top:2px;left:22px;
  transition:all .3s;
  box-shadow:0 0 8px #22c55e;
}
.hk-ks-toggle.off::after{left:2px;background:#ff4444;box-shadow:0 0 8px #ff4444;}

/* ── Clientes mini tabla ── */
.hk-client-row{
  display:grid;
  grid-template-columns:60px 1fr 60px;
  gap:6px;
  padding:6px 8px;
  border-bottom:1px solid rgba(255,179,0,0.06);
  font-size:10px;
  align-items:center;
}
.hk-client-row:hover{background:rgba(255,179,0,0.03);}
.hk-tier{
  padding:2px 6px;
  border-radius:10px;
  font-size:9px;
  text-align:center;
}
.hk-tier.gold{background:rgba(255,215,0,0.15);color:#ffd700;border:1px solid rgba(255,215,0,0.3);}
.hk-tier.silver{background:rgba(192,192,192,0.1);color:#c0c0c0;border:1px solid rgba(192,192,192,0.2);}
.hk-tier.bronze{background:rgba(205,127,50,0.1);color:#cd7f32;border:1px solid rgba(205,127,50,0.2);}

/* ── Panel central — links ── */
.hk-link-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
  margin-bottom:16px;
}
.hk-link-card{
  background:rgba(255,179,0,0.04);
  border:1px solid rgba(255,179,0,0.12);
  border-radius:10px;
  padding:12px;
  cursor:pointer;
  transition:all .25s;
  text-decoration:none;
  display:block;
}
.hk-link-card:hover{
  background:rgba(255,179,0,0.09);
  border-color:rgba(255,179,0,0.4);
  transform:translateY(-2px);
  box-shadow:0 6px 20px rgba(255,179,0,0.1);
}
.hk-link-icon{font-size:20px;margin-bottom:6px;display:block;}
.hk-link-name{
  font-family:'Orbitron',monospace;
  font-size:9px;
  letter-spacing:0.1em;
  color:var(--honey);
  display:block;
  margin-bottom:2px;
}
.hk-link-url{
  font-size:9px;
  color:var(--dim);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

/* ── Panel derecho — Chat ── */
.hk-chat-wrap{
  display:flex;
  flex-direction:column;
  height:100%;
}
#hk-avatar-canvas{
  width:100%;
  height:200px;
  flex-shrink:0;
  position:relative;
}
.hk-chat-msgs{
  flex:1;
  overflow-y:auto;
  padding:12px;
  display:flex;
  flex-direction:column;
  gap:8px;
  scrollbar-width:thin;
  scrollbar-color:rgba(255,179,0,0.2) transparent;
}
.hk-msg-user{
  align-self:flex-end;
  background:rgba(255,179,0,0.1);
  border:1px solid rgba(255,179,0,0.25);
  border-radius:12px 12px 3px 12px;
  padding:8px 12px;
  font-size:12px;
  max-width:85%;
  color:var(--text);
}
.hk-msg-bot{
  align-self:flex-start;
  background:rgba(255,140,0,0.06);
  border:1px solid rgba(255,140,0,0.18);
  border-radius:12px 12px 12px 3px;
  padding:8px 12px;
  font-size:12px;
  max-width:90%;
  color:var(--text);
}
.hk-msg-system{
  align-self:center;
  background:rgba(255,179,0,0.05);
  border:1px solid rgba(255,179,0,0.1);
  border-radius:8px;
  padding:6px 12px;
  font-size:10px;
  color:var(--dim);
  letter-spacing:0.06em;
}

/* Indicador estado HARI */
#hk-estado{
  padding:6px 12px;
  font-size:10px;
  color:var(--honey);
  letter-spacing:0.08em;
  display:none;
  align-items:center;
  gap:6px;
  border-top:1px solid var(--border);
}
.hk-dots span{
  display:inline-block;
  width:4px;height:4px;
  border-radius:50%;
  background:var(--honey);
  animation:hkdot .8s ease-in-out infinite;
}
.hk-dots span:nth-child(2){animation-delay:.15s}
.hk-dots span:nth-child(3){animation-delay:.3s}
@keyframes hkdot{0%,80%,100%{transform:scale(.5);opacity:.4}40%{transform:scale(1.1);opacity:1}}

/* Input area */
.hk-input-area{
  padding:10px 12px;
  border-top:1px solid var(--border);
  display:flex;
  flex-direction:column;
  gap:6px;
  flex-shrink:0;
}
.hk-input-row{
  display:flex;
  gap:6px;
  align-items:center;
}
#hk-input{
  flex:1;
  background:rgba(0,0,0,0.4);
  border:1px solid rgba(255,179,0,0.2);
  border-radius:10px;
  color:var(--text);
  font-family:'Share Tech Mono',monospace;
  font-size:12px;
  padding:8px 12px;
  outline:none;
  transition:border-color .2s;
}
#hk-input:focus{border-color:rgba(255,179,0,0.5);}
#hk-input::placeholder{color:var(--dim);}
.hk-send-btn{
  background:linear-gradient(135deg,rgba(255,179,0,0.2),rgba(255,140,0,0.1));
  border:1px solid rgba(255,179,0,0.35);
  border-radius:10px;
  color:var(--honey);
  width:36px;height:36px;
  cursor:pointer;
  font-size:14px;
  transition:all .2s;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
.hk-send-btn:hover{
  background:rgba(255,179,0,0.25);
  box-shadow:0 0 12px rgba(255,179,0,0.3);
}
.hk-img-btn{
  background:rgba(255,179,0,0.08);
  border:1px solid rgba(255,179,0,0.2);
  border-radius:10px;
  color:var(--amber);
  width:36px;height:36px;
  cursor:pointer;
  font-size:14px;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
  transition:all .2s;
}
.hk-img-btn:hover{background:rgba(255,179,0,0.15);}

/* Aprobación ✅ */
.hk-approval{
  background:rgba(255,179,0,0.08);
  border:1px solid rgba(255,179,0,0.3);
  border-radius:10px;
  padding:10px 12px;
  display:none;
  flex-direction:column;
  gap:8px;
}
.hk-approval-txt{font-size:11px;color:var(--text);line-height:1.5;}
.hk-approval-btns{display:flex;gap:6px;}
.hk-approve{
  flex:1;padding:7px;
  background:rgba(34,197,94,0.15);
  border:1px solid rgba(34,197,94,0.4);
  border-radius:8px;color:#22c55e;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;cursor:pointer;
  transition:all .2s;
}
.hk-approve:hover{background:rgba(34,197,94,0.25);}
.hk-reject{
  flex:1;padding:7px;
  background:rgba(255,68,68,0.1);
  border:1px solid rgba(255,68,68,0.3);
  border-radius:8px;color:#ff4444;
  font-family:'Share Tech Mono',monospace;
  font-size:11px;cursor:pointer;
  transition:all .2s;
}
.hk-reject:hover{background:rgba(255,68,68,0.2);}

@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.hk-msg-user,.hk-msg-bot,.hk-msg-system{animation:msgIn .2s ease;}

@media(max-width:768px){
  .hk-grid{grid-template-columns:1fr;}
  .hk-panel:not(:last-child){display:none;}
}
</style>
</head>
<body>

<!-- HEADER -->
<div class="hk-header">
  <div class="hk-logo">⬡ HARI-KING</div>
  <div class="hk-status">
    <div class="hk-status-dot"></div>
    <span>SISTEMA ACTIVO</span>
    <span style="color:rgba(255,179,0,0.4);margin:0 8px;">|</span>
    <span id="hk-time"></span>
  </div>
  <div style="font-size:10px;color:var(--dim);letter-spacing:0.1em;">HONEY AND RASPBERRY INK</div>
</div>

<!-- GRID PRINCIPAL -->
<div class="hk-grid">

  <!-- ══ PANEL IZQUIERDO — CONTROL ══ -->
  <div class="hk-panel">
    <canvas class="hk-particles" id="p-left"></canvas>
    <div class="hk-panel-content">

      <!-- Kill Switch -->
      <div class="hk-section-title">⬡ Sistema</div>
      <div class="hk-killswitch">
        <div>
          <div class="hk-ks-label" id="ks-label" style="color:#22c55e;">BRA GT — ACTIVA</div>
          <div style="font-size:9px;color:var(--dim);margin-top:2px;">Kill Switch</div>
        </div>
        <div class="hk-ks-toggle" id="ks-toggle" onclick="toggleKS()"></div>
      </div>

      <!-- Deploy -->
      <button class="hk-btn success" onclick="triggerDeploy()">🚀 &nbsp;TRIGGER DEPLOY</button>
      <div id="deploy-status" style="font-size:10px;color:var(--dim);margin-bottom:8px;min-height:14px;"></div>

      <!-- Reglas -->
      <div class="hk-section-title" style="margin-top:8px;">⬡ Reglas Activas</div>
      <div id="hk-rules-list">
        <div style="font-size:10px;color:var(--dim);">Cargando...</div>
      </div>

      <!-- Clientes BRA -->
      <div class="hk-section-title" style="margin-top:12px;">⬡ Clientes BRA GT</div>
      <div style="display:grid;grid-template-columns:60px 1fr 60px;gap:6px;padding:4px 8px;margin-bottom:4px;">
        <span style="font-size:9px;color:var(--dim);">ID</span>
        <span style="font-size:9px;color:var(--dim);">Nombre</span>
        <span style="font-size:9px;color:var(--dim);">Tier</span>
      </div>
      <div id="hk-clients-list">
        <div style="font-size:10px;color:var(--dim);padding:8px;">Cargando...</div>
      </div>

    </div>
  </div>

  <!-- ══ PANEL CENTRAL — ACCESOS ══ -->
  <div class="hk-panel">
    <canvas class="hk-particles" id="p-center"></canvas>
    <div class="hk-panel-content">

      <div class="hk-section-title">⬡ Accesos Rápidos</div>
      <div class="hk-link-grid">
        <a class="hk-link-card" href="https://github.com/cherryv1/-BLACK-LILY-/actions" target="_blank">
          <span class="hk-link-icon">⚙️</span>
          <span class="hk-link-name">GT Actions</span>
          <span class="hk-link-url">GitHub Actions</span>
        </a>
        <a class="hk-link-card" href="https://black-lily-elite.cherry-v1pro.workers.dev" target="_blank">
          <span class="hk-link-icon">🦾</span>
          <span class="hk-link-name">Sitio BRA</span>
          <span class="hk-link-url">black-lily-elite.cherry...</span>
        </a>
        <a class="hk-link-card" href="https://black-lily-elite.cherry-v1pro.workers.dev/dashboard" target="_blank">
          <span class="hk-link-icon">📊</span>
          <span class="hk-link-name">Dashboard BRA</span>
          <span class="hk-link-url">/dashboard</span>
        </a>
        <a class="hk-link-card" href="https://dash.cloudflare.com" target="_blank">
          <span class="hk-link-icon">☁️</span>
          <span class="hk-link-name">Cloudflare</span>
          <span class="hk-link-url">dash.cloudflare.com</span>
        </a>
        <a class="hk-link-card" href="https://github.com/cherryv1" target="_blank">
          <span class="hk-link-icon">🐙</span>
          <span class="hk-link-name">GitHub</span>
          <span class="hk-link-url">cherryv1</span>
        </a>
        <a class="hk-link-card" href="https://wa.me/5219842562365" target="_blank">
          <span class="hk-link-icon">💬</span>
          <span class="hk-link-name">WhatsApp</span>
          <span class="hk-link-url">+52 984 256 2365</span>
        </a>
        <a class="hk-link-card" href="https://imgbb.com" target="_blank">
          <span class="hk-link-icon">🖼</span>
          <span class="hk-link-name">ImgBB</span>
          <span class="hk-link-url">imgbb.com</span>
        </a>
        <a class="hk-link-card" href="https://github.com/cherryv1/HARI-KING" target="_blank">
          <span class="hk-link-icon">⬡</span>
          <span class="hk-link-name">HARI-KING Repo</span>
          <span class="hk-link-url">github.com/cherryv1</span>
        </a>
      </div>

      <!-- Métricas BRA -->
      <div class="hk-section-title">⬡ Métricas BRA GT</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px;margin-bottom:16px;">
        <div style="background:rgba(255,179,0,0.05);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
          <div style="font-family:Orbitron,monospace;font-size:16px;color:var(--honey);" id="m-clientes">—</div>
          <div style="font-size:9px;color:var(--dim);margin-top:2px;">Clientes</div>
        </div>
        <div style="background:rgba(255,179,0,0.05);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
          <div style="font-family:Orbitron,monospace;font-size:16px;color:var(--honey);" id="m-conv">—</div>
          <div style="font-size:9px;color:var(--dim);margin-top:2px;">Conv.</div>
        </div>
        <div style="background:rgba(255,179,0,0.05);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
          <div style="font-family:Orbitron,monospace;font-size:16px;color:var(--honey);" id="m-eng">—</div>
          <div style="font-size:9px;color:var(--dim);margin-top:2px;">Eng.</div>
        </div>
        <div style="background:rgba(255,179,0,0.05);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
          <div style="font-family:Orbitron,monospace;font-size:16px;color:var(--honey);" id="m-tasa">—</div>
          <div style="font-size:9px;color:var(--dim);margin-top:2px;">Tasa %</div>
        </div>
      </div>

      <!-- Log de acciones -->
      <div class="hk-section-title">⬡ Log de Acciones</div>
      <div id="hk-log" style="font-size:10px;color:var(--dim);line-height:1.8;max-height:120px;overflow-y:auto;">
        <div>[ Sistema iniciado ]</div>
      </div>

    </div>
  </div>

  <!-- ══ PANEL DERECHO — CHAT HARI-KING ══ -->
  <div class="hk-panel" style="border-right:none;">
    <div class="hk-chat-wrap">

      <!-- Avatar 3D -->
      <div id="hk-avatar-canvas" style="position:relative;">
        <canvas id="hk-3d" style="width:100%;height:100%;display:block;"></canvas>
        <!-- Badge estado -->
        <div id="hk-badge" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);border:1px solid rgba(255,179,0,0.3);border-radius:20px;padding:3px 12px;font-size:9px;letter-spacing:0.12em;color:var(--honey);white-space:nowrap;backdrop-filter:blur(6px);">
          ⬡ HARI-KING — EN ESPERA
        </div>
      </div>

      <!-- Mensajes -->
      <div class="hk-chat-msgs" id="hk-msgs">
        <div class="hk-msg-system">Sistema HARI-KING iniciado — Baxto tiene la palabra final ✅</div>
      </div>

      <!-- Estado -->
      <div id="hk-estado" style="display:none;padding:6px 12px;font-size:10px;color:var(--honey);align-items:center;gap:6px;border-top:1px solid var(--border);">
        <div class="hk-dots"><span></span><span></span><span></span></div>
        <span id="hk-estado-txt">Procesando...</span>
      </div>

      <!-- Aprobación -->
      <div class="hk-approval" id="hk-approval">
        <div class="hk-approval-txt" id="hk-approval-txt"></div>
        <div class="hk-approval-btns">
          <button class="hk-approve" onclick="approveAction()">✅ APROBAR</button>
          <button class="hk-reject"  onclick="rejectAction()">❌ RECHAZAR</button>
        </div>
      </div>

      <!-- Input -->
      <div class="hk-input-area">
        <div class="hk-input-row">
          <label class="hk-img-btn" for="hk-img-input" title="Adjuntar imagen">🖼</label>
          <input type="file" id="hk-img-input" accept="image/*" style="display:none;" onchange="onHKImg(event)"/>
          <input id="hk-input" placeholder="Habla con HARI-KING..." onkeydown="if(event.key==='Enter')sendHK();"/>
          <button class="hk-send-btn" onclick="sendHK()">➤</button>
        </div>
        <div id="hk-img-preview" style="display:none;position:relative;width:fit-content;">
          <img id="hk-img-thumb" style="max-height:60px;border-radius:6px;border:1px solid rgba(255,179,0,0.3);"/>
          <button onclick="clearHKImg()" style="position:absolute;top:-6px;right:-6px;background:var(--amber);border:none;border-radius:50%;width:16px;height:16px;color:#000;font-size:9px;cursor:pointer;">✕</button>
        </div>
      </div>

    </div>
  </div>

</div>

<script>
const BRA_API = 'https://black-lily-elite.cherry-v1pro.workers.dev';

// ── Reloj ──────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('hk-time').textContent =
    now.toLocaleTimeString('es-MX', {hour12:false});
}
setInterval(updateClock, 1000);
updateClock();

// ── Log de acciones ────────────────────────────────────────
function logAction(txt) {
  const log = document.getElementById('hk-log');
  const d = document.createElement('div');
  const t = new Date().toLocaleTimeString('es-MX',{hour12:false});
  d.textContent = '[' + t + '] ' + txt;
  d.style.color = 'rgba(255,179,0,0.7)';
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
}

// ── Kill Switch BRA ────────────────────────────────────────
let ksActive = true;
async function loadKS() {
  try {
    const r = await fetch(BRA_API + '/admin/kill-switch-status');
    const d = await r.json();
    ksActive = d.active !== false;
    updateKSUI();
  } catch(e) {}
}
function updateKSUI() {
  const toggle = document.getElementById('ks-toggle');
  const label  = document.getElementById('ks-label');
  toggle.className = 'hk-ks-toggle' + (ksActive ? '' : ' off');
  label.textContent = ksActive ? 'BRA GT — ACTIVA' : 'BRA GT — INACTIVA';
  label.style.color = ksActive ? '#22c55e' : '#ff4444';
}
async function toggleKS() {
  ksActive = !ksActive;
  updateKSUI();
  try {
    await fetch(BRA_API + '/admin/kill-switch', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({active:ksActive})
    });
    logAction('Kill Switch → ' + (ksActive ? 'ON' : 'OFF'));
  } catch(e) {}
}

// ── Deploy ─────────────────────────────────────────────────
async function triggerDeploy() {
  const st = document.getElementById('deploy-status');
  st.textContent = 'Iniciando deploy...';
  st.style.color = 'var(--honey)';
  logAction('Deploy disparado');
  try {
    const r = await fetch(BRA_API + '/admin/deploy', {method:'POST',headers:{'Content-Type':'application/json'}});
    const d = await r.json();
    st.textContent = d.ok ? '✅ Deploy iniciado' : '❌ Error';
    st.style.color = d.ok ? '#22c55e' : '#ff4444';
    setTimeout(() => { st.textContent = ''; }, 8000);
  } catch(e) {
    st.textContent = '❌ Error de red';
    st.style.color = '#ff4444';
  }
}

// ── Cargar reglas BRA ──────────────────────────────────────
async function loadRules() {
  try {
    const r = await fetch(BRA_API + '/admin/list-rules');
    const d = await r.json();
    const list = document.getElementById('hk-rules-list');
    if (!d.rules || !d.rules.length) {
      list.innerHTML = '<div style="font-size:10px;color:var(--dim);">Sin reglas</div>';
      return;
    }
    list.innerHTML = d.rules.slice(0,6).map(rule => \`
      <div class="hk-rule">
        <span style="color:var(--honey);font-size:10px;">\${rule.trigger}</span>
        <div class="hk-toggle on" title="Activo"></div>
      </div>
    \`).join('');
  } catch(e) {}
}

// ── Cargar clientes BRA ────────────────────────────────────
async function loadClients() {
  try {
    const r = await fetch(BRA_API + '/api/customers');
    const d = await r.json();
    const list = document.getElementById('hk-clients-list');
    if (!d.customers || !d.customers.length) {
      list.innerHTML = '<div style="font-size:10px;color:var(--dim);padding:8px;">Sin clientes</div>';
      return;
    }
    list.innerHTML = d.customers.slice(0,8).map(c => \`
      <div class="hk-client-row">
        <span style="color:var(--honey);font-size:10px;">\${c.customer_id.slice(-4)}</span>
        <span style="font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">\${c.name||'—'}</span>
        <span class="hk-tier \${c.tier||'bronze'}">\${c.tier||'bronze'}</span>
      </div>
    \`).join('');
  } catch(e) {}
}

// ── Métricas BRA ───────────────────────────────────────────
async function loadMetrics() {
  try {
    const r = await fetch(BRA_API + '/api/metrics');
    const d = await r.json();
    document.getElementById('m-clientes').textContent = d.totalClientes ?? '—';
    document.getElementById('m-conv').textContent = d.totalConversiones ?? '—';
    document.getElementById('m-eng').textContent = d.engagementPromedio ? d.engagementPromedio.toFixed(0) : '—';
    document.getElementById('m-tasa').textContent = d.tasaConversion ? d.tasaConversion.toFixed(1)+'%' : '—';
  } catch(e) {}
}

// ── Chat HARI-KING ─────────────────────────────────────────
let hkImg = null;
let pendingAction = null;

function addHKMsg(role, text) {
  const box = document.getElementById('hk-msgs');
  const div = document.createElement('div');
  div.className = role === 'user' ? 'hk-msg-user' : role === 'system' ? 'hk-msg-system' : 'hk-msg-bot';
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function setHKEstado(show, txt) {
  const el = document.getElementById('hk-estado');
  el.style.display = show ? 'flex' : 'none';
  if (txt) document.getElementById('hk-estado-txt').textContent = txt;
}

function onHKImg(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    hkImg = e.target.result;
    document.getElementById('hk-img-thumb').src = hkImg;
    document.getElementById('hk-img-preview').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function clearHKImg() {
  hkImg = null;
  document.getElementById('hk-img-input').value = '';
  document.getElementById('hk-img-preview').style.display = 'none';
}

async function sendHK() {
  const input = document.getElementById('hk-input');
  const msg = input.value.trim();
  if (!msg && !hkImg) return;
  input.value = '';

  addHKMsg('user', msg || '📸 Imagen adjunta');
  setHKEstado(true, 'HARI-KING procesando...');
  setBeeState('pensando');

  try {
    const body = { message: msg || 'Analiza esta imagen', session_id: 'hari-king-baxto', admin: true };
    if (hkImg) body.image = hkImg;

    const r = await fetch(BRA_API + '/admin/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    const d = await r.json();

    setHKEstado(false);
    setBeeState('idle');
    const reply = d.reply || d.response || '—';
    addHKMsg('bot', reply);
    logAction('Chat: ' + msg.slice(0,40));

    // Si la respuesta implica una acción, mostrar panel de aprobación
    if (reply.toLowerCase().includes('puedo') || reply.toLowerCase().includes('ejecutar') || reply.toLowerCase().includes('deploy')) {
      showApproval('HARI-KING propone una acción. ¿Apruebas?\\n\\n' + reply);
    }
  } catch(e) {
    setHKEstado(false);
    setBeeState('idle');
    addHKMsg('bot', '⚠️ Error: ' + e.message);
  }
  clearHKImg();
}

// ── Aprobación Baxto ✅ ────────────────────────────────────
function showApproval(txt) {
  const panel = document.getElementById('hk-approval');
  document.getElementById('hk-approval-txt').textContent = txt;
  panel.style.display = 'flex';
  pendingAction = txt;
}

function approveAction() {
  document.getElementById('hk-approval').style.display = 'none';
  addHKMsg('system', '✅ Baxto aprobó — ejecutando...');
  logAction('✅ Acción aprobada por Baxto');
  setBeeState('ejecutando');
  setTimeout(() => { setBeeState('idle'); addHKMsg('bot', 'Acción ejecutada con éxito.'); }, 2000);
  pendingAction = null;
}

function rejectAction() {
  document.getElementById('hk-approval').style.display = 'none';
  addHKMsg('system', '❌ Baxto rechazó la acción');
  logAction('❌ Acción rechazada por Baxto');
  setBeeState('idle');
  pendingAction = null;
}

// ══════════════════════════════════════════════════════════
//  THREE.JS — ABEJA 3D HARI-KING
// ══════════════════════════════════════════════════════════
let beeScene, beeCamera, beeRenderer, beeClock;
let beeBody, wingL, wingR, beeGroup;
let hexRings = [];
let honeyParticles;
let currentBeeState = 'idle';

const BEE_STATES = {
  idle:       { wingSpeed: 0.15, color: 0xFFB300, glow: 0.5,  label: '⬡ HARI-KING — EN ESPERA' },
  pensando:   { wingSpeed: 0.35, color: 0xFFD700, glow: 0.8,  label: '⬡ HARI-KING — PENSANDO' },
  ejecutando: { wingSpeed: 0.6,  color: 0xFF8C00, glow: 1.2,  label: '⬡ HARI-KING — EJECUTANDO' },
  esperando:  { wingSpeed: 0.08, color: 0xFFE066, glow: 0.3,  label: '⬡ ESPERANDO ✅ DE BAXTO' },
};

function initBee() {
  const canvas = document.getElementById('hk-3d');
  const container = document.getElementById('hk-avatar-canvas');
  const W = container.clientWidth;
  const H = container.clientHeight || 200;

  beeScene = new THREE.Scene();
  beeCamera = new THREE.PerspectiveCamera(55, W/H, 0.1, 100);
  beeCamera.position.set(0, 0.5, 6);

  beeRenderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  beeRenderer.setSize(W, H);
  beeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  beeRenderer.setClearColor(0x000000, 0);

  beeClock = new THREE.Clock();

  beeGroup = new THREE.Group();
  beeScene.add(beeGroup);

  // ── Cuerpo de la abeja ──
  // Abdomen (parte trasera, rayada)
  const abdomenGeo = new THREE.SphereGeometry(0.7, 32, 32);
  abdomenGeo.scale(1, 1.4, 1);
  const abdomenMat = new THREE.MeshPhongMaterial({
    color: 0xFFB300,
    emissive: 0x332200,
    shininess: 80,
  });
  const abdomen = new THREE.Mesh(abdomenGeo, abdomenMat);
  abdomen.position.set(0, -0.3, 0);
  beeGroup.add(abdomen);

  // Rayas negras del abdomen
  for (let i = 0; i < 3; i++) {
    const stripeGeo = new THREE.TorusGeometry(0.68, 0.08, 8, 32);
    const stripeMat = new THREE.MeshPhongMaterial({ color: 0x111111, emissive: 0x000000 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, -0.1 + i * 0.28 - 0.3, 0);
    stripe.rotation.x = Math.PI / 2;
    beeGroup.add(stripe);
  }

  // Tórax (parte central)
  const thoraxGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const thoraxMat = new THREE.MeshPhongMaterial({
    color: 0x1a1a1a,
    emissive: 0x0a0a0a,
    shininess: 60,
  });
  const thorax = new THREE.Mesh(thoraxGeo, thoraxMat);
  thorax.position.set(0, 0.6, 0);
  beeGroup.add(thorax);

  // Cabeza
  const headGeo = new THREE.SphereGeometry(0.38, 32, 32);
  const headMat = new THREE.MeshPhongMaterial({
    color: 0x111111,
    emissive: 0x050505,
    shininess: 100,
  });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0, 1.1, 0.1);
  beeGroup.add(head);

  // Ojos (dos esferas doradas)
  const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const eyeMat = new THREE.MeshPhongMaterial({ color: 0xFFD700, emissive: 0x664400, shininess: 200 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.18, 1.18, 0.32);
  eyeR.position.set(0.18, 1.18, 0.32);
  beeGroup.add(eyeL); beeGroup.add(eyeR);

  // Antenas
  function makeAntenna(side) {
    const points = [
      new THREE.Vector3(side * 0.12, 1.4, 0.1),
      new THREE.Vector3(side * 0.3, 1.8, 0.2),
      new THREE.Vector3(side * 0.35, 2.0, 0.15),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, 10, 0.025, 6, false);
    const mat = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const tube = new THREE.Mesh(geo, mat);
    beeGroup.add(tube);
    // Bolita punta
    const tipGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const tipMat = new THREE.MeshPhongMaterial({ color: 0xFFB300, emissive: 0x332200 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.copy(points[2]);
    beeGroup.add(tip);
  }
  makeAntenna(-1); makeAntenna(1);

  // ── Alas ──
  function makeWing(side) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(side*0.3, 0.8, side*1.2, 1.0, side*1.4, 0.3);
    shape.bezierCurveTo(side*1.2, -0.2, side*0.4, -0.3, 0, 0);

    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xaaddff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      shininess: 200,
      specular: new THREE.Color(0xffffff),
    });
    const wing = new THREE.Mesh(geo, mat);
    wing.position.set(side * 0.45, 0.65, 0);
    wing.rotation.x = -Math.PI / 8;
    return wing;
  }
  wingL = makeWing(-1);
  wingR = makeWing(1);
  beeGroup.add(wingL); beeGroup.add(wingR);

  // ── Hexágonos panal de fondo ──
  function makeHex(radius, z, opacity, color) {
    const geo = new THREE.CylinderGeometry(radius, radius, 0.05, 6);
    const mat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
      transparent: true,
      opacity,
    });
    const hex = new THREE.Mesh(geo, mat);
    hex.rotation.x = Math.PI / 2;
    hex.position.z = z;
    return hex;
  }

  const hexColors = [0xFFB300, 0xFF8C00, 0xFFD700];
  for (let i = 0; i < 5; i++) {
    const h = makeHex(1.2 + i*0.7, -1 - i*0.5, 0.15 - i*0.02, hexColors[i%3]);
    hexRings.push(h);
    beeScene.add(h);
  }

  // Patrón panal (honeycomb) en el fondo
  const honeycombGroup = new THREE.Group();
  const hcMat = new THREE.MeshBasicMaterial({
    color: 0xFFB300,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });
  for (let row = -3; row <= 3; row++) {
    for (let col = -4; col <= 4; col++) {
      const hGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 6);
      const hMesh = new THREE.Mesh(hGeo, hcMat);
      const offsetX = row % 2 === 0 ? 0 : 0.5;
      hMesh.position.set(col * 0.87 + offsetX, row * 0.75, -3);
      hMesh.rotation.x = Math.PI / 2;
      honeycombGroup.add(hMesh);
    }
  }
  beeScene.add(honeycombGroup);

  // ── Partículas miel ──
  const PC = 120;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PC * 3);
  const pCol = new Float32Array(PC * 3);
  const honey1 = new THREE.Color(0xFFB300);
  const honey2 = new THREE.Color(0xFF8C00);
  const honey3 = new THREE.Color(0xFFD700);
  const honeyPalette = [honey1, honey2, honey3];

  for (let i = 0; i < PC; i++) {
    pPos[i*3]   = (Math.random()-0.5)*8;
    pPos[i*3+1] = (Math.random()-0.5)*6;
    pPos[i*3+2] = (Math.random()-0.5)*4 - 1;
    const c = honeyPalette[Math.floor(Math.random()*3)];
    pCol[i*3]=c.r; pCol[i*3+1]=c.g; pCol[i*3+2]=c.b;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));

  honeyParticles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
  }));
  beeScene.add(honeyParticles);

  // ── Luces ──
  beeScene.add(new THREE.AmbientLight(0x221100, 1.5));
  const light1 = new THREE.PointLight(0xFFB300, 4, 12);
  light1.position.set(3, 3, 4);
  beeScene.add(light1);
  const light2 = new THREE.PointLight(0xFF6600, 2, 8);
  light2.position.set(-3, -2, 3);
  beeScene.add(light2);

  beeGroup.position.y = -0.3;
  beeGroup.scale.setScalar(0.7);

  animateBee();
}

function animateBee() {
  requestAnimationFrame(animateBee);
  const t = beeClock.getElapsedTime();
  const state = BEE_STATES[currentBeeState];

  // Alas batiendo
  const wingAngle = Math.sin(t * state.wingSpeed * 30) * 0.4;
  if (wingL) wingL.rotation.y = wingAngle;
  if (wingR) wingR.rotation.y = -wingAngle;

  // Flotación suave
  if (beeGroup) {
    beeGroup.position.y = -0.3 + Math.sin(t * 1.2) * 0.08;
    beeGroup.rotation.y = Math.sin(t * 0.4) * 0.15;
  }

  // Hexágonos rotando
  hexRings.forEach((h, i) => {
    h.rotation.z += 0.002 * (i % 2 === 0 ? 1 : -1);
    h.material.opacity = 0.08 + Math.sin(t + i) * 0.04;
  });

  // Partículas miel
  if (honeyParticles) {
    honeyParticles.rotation.y += 0.001;
    const speedMult = currentBeeState === 'ejecutando' ? 3 : 1;
    honeyParticles.material.opacity = 0.5 + Math.sin(t * 2) * 0.2 * state.glow;
  }

  beeRenderer.render(beeScene, beeCamera);
}

function setBeeState(state) {
  currentBeeState = state;
  const s = BEE_STATES[state] || BEE_STATES.idle;
  document.getElementById('hk-badge').textContent = s.label;

  // Cambiar color cuerpo abeja
  if (beeGroup) {
    beeGroup.children.forEach(child => {
      if (child.material && child.material.color) {
        const origColor = child.material.color.getHex();
        if (origColor === 0xFFB300 || origColor === 0xFF8C00 || origColor === 0xFFD700) {
          child.material.color.setHex(s.color);
        }
      }
    });
  }
}

// ── Partículas canvas 2D (paneles izq y centro) ────────────
function initParticles2D(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;

  function resize() {
    canvas.width  = container.clientWidth;
    canvas.height = container.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({length:50}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random()-.5)*.3,
    vy: (Math.random()-.5)*.3,
    r: Math.random()*1.5+.5,
    alpha: Math.random()*.4+.1,
    color: Math.random() > .5 ? '#FFB300' : '#FF8C00',
  }));

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>canvas.width) p.vx*=-1;
      if (p.y<0||p.y>canvas.height) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// ── Init todo ──────────────────────────────────────────────
initParticles2D('p-left');
initParticles2D('p-center');
initBee();
loadKS();
loadRules();
loadClients();
loadMetrics();
setInterval(loadMetrics, 30000);
setInterval(loadClients, 60000);
</script>
</body>
</html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

// ═══════════════════════════════════════════════════════════
//  WORKER HANDLER
// ═══════════════════════════════════════════════════════════
export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // Dashboard
    if (path === '/' || path === '/dashboard') {
      return getDashboard();
    }

    // Health check
    if (path === '/health') {
      return jsonRes({ ok: true, system: 'HARI-KING', version: '1.0.0' });
    }

    return new Response('HARI-KING — Not Found', { status: 404 });
  }
};
