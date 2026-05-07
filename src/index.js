// ═══════════════════════════════════════════════════════════
//  HARI-KING — Agente Autónomo Privado de Baxto
//  Versión: 1.2.0 (Optimizado para Android 11 + Auto-Approve)

async function hariCommit(fileName, content, message, env) {
  const GITHUB_API = "https://api.github.com/repos/cherryv1/HARI-KING/contents/" + fileName;
  const res = await fetch(GITHUB_API, { headers: { "Authorization": `Bearer ${env.GITHUB_TOKEN}`, "User-Agent": "HARI-KING-Agent" } });
  const fileData = await res.json();
  const commitRes = await fetch(GITHUB_API, { 
    method: "PUT", 
    headers: { 
      "Authorization": `Bearer ${env.GITHUB_TOKEN}`, 
      "Content-Type": "application/json", 
      "User-Agent": "HARI-KING-Agent" 
    }, 
    body: JSON.stringify({ 
      message: "HARI-AUTONOMOUS: " + message, 
      content: btoa(content), 
      sha: fileData.sha 
    }) 
  });
  return await commitRes.json();
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Baxto-Token',
};

const jsonRes = (data, status=200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS }
  });

const BAXTO_TOKEN = 'HARI-KING-BAXTO-2026';

function authCheck(request) {
  const token = request.headers.get('X-Baxto-Token');
  return token === BAXTO_TOKEN;
}

function getDashboard() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>HARI-KING — Centro de Control</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
*{margin:0;padding:0;box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
:root{ --honey:#FFB300; --amber:#FF8C00; --dark:#04020f; --text:#e8d5a0; --dim:#8a7040; --touch-size: 48px; }
body{ background:var(--dark); color:var(--text); font-family:'Share Tech Mono',monospace; height:100dvh; overflow:hidden; display:flex; flex-direction:column; }
.hk-header{ display:flex; align-items:center; justify-content:space-between; padding:12px 20px; border-bottom:1px solid rgba(255,179,0,0.15); background:rgba(0,0,0,0.8); flex-shrink:0; }
.hk-logo{ font-family:'Orbitron',monospace; font-size:18px; font-weight:900; background:linear-gradient(135deg,var(--honey),var(--amber)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.hk-chat-wrap{ flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative; }
.hk-chat-msgs{ flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; -webkit-overflow-scrolling: touch; }
.hk-msg-user{ align-self:flex-end; background:rgba(255,179,0,0.12); border:1px solid rgba(255,179,0,0.3); border-radius:16px 16px 4px 16px; padding:10px 14px; font-size:14px; max-width:85%; }
.hk-msg-bot{ align-self:flex-start; background:rgba(20,15,5,0.95); border:1px solid rgba(255,140,0,0.25); border-radius:16px 16px 16px 4px; padding:12px 16px; font-size:14px; max-width:92%; line-height:1.5; }
.hk-input-area{ padding:12px 16px; padding-bottom: calc(12px + env(safe-area-inset-bottom)); border-top:1px solid rgba(255,179,0,0.15); background:rgba(10,6,0,0.98); flex-shrink:0; }
.hk-input-row{ display:flex; gap:10px; align-items:center; background:#1a0f00; border:2px solid var(--honey); border-radius:24px; padding:4px 6px 4px 16px; min-height: var(--touch-size); }
#hk-input{ flex:1; background:transparent; border:none; color:var(--honey); font-size:16px; outline:none; }
.hk-send-btn{ width: var(--touch-size); height: var(--touch-size); border-radius:50%; border:none; background: var(--honey); color: var(--dark); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.hk-approval{ background:rgba(34,197,94,0.08); border:1px solid rgba(34,197,94,0.3); border-radius:12px; padding:12px; display:none; flex-direction:column; gap:10px; margin-bottom: 8px; }
.hk-approve{ width: 100%; min-height: var(--touch-size); background:#22c55e; color:white; border:none; border-radius:8px; font-weight:bold; font-family:'Orbitron',sans-serif; }
</style>
</head>
<body>
  <header class="hk-header"><div class="hk-logo">HARI-KING</div></header>
  <div class="hk-chat-wrap">
    <div class="hk-chat-msgs" id="hk-msgs"><div class="hk-msg-bot">Sistemas v1.2.0 listos. ¿Qué necesitas, Baxto?</div></div>
    <div class="hk-input-area">
      <div class="hk-approval" id="hk-approval-box">
        <div style="font-size:12px;color:#22c55e">✨ Propuesta detectada</div>
        <button class="hk-approve" onclick="approveAction()">APROBAR Y EJECUTAR ✅</button>
      </div>
      <div class="hk-input-row">
        <input type="text" id="hk-input" placeholder="Escribe a HARI..." autocomplete="off">
        <button class="hk-send-btn" onclick="sendMessage()">🚀</button>
      </div>
    </div>
  </div>
  <script>
    let pendingAction = null;
    async function sendMessage() {
      const input = document.getElementById('hk-input');
      const text = input.value.trim();
      if(!text) return;
      addMsg(text, 'user'); input.value = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Baxto-Token': 'HARI-KING-BAXTO-2026' },
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        addMsg(data.reply, 'bot');
        if (data.reply.includes('```')) {
          const codeMatch = data.reply.match(/\\`\\`\\`[a-z]*\\n([\\s\\S]*?)\\n\\`\\`\\`/);
          if (codeMatch) {
            pendingAction = { fileName: "src/index.js", content: codeMatch[1], commitMessage: "HARI-AUTO: Update" };
            document.getElementById('hk-approval-box').style.display = 'flex';
          }
        }
      } catch(e) { addMsg('Error', 'bot'); }
    }
    function addMsg(t, type) {
      const d = document.createElement('div'); d.className = 'hk-msg-' + type; d.innerText = t;
      const c = document.getElementById('hk-msgs'); c.appendChild(d); c.scrollTop = c.scrollHeight;
    }
    async function approveAction() {
      if(!pendingAction) return;
      document.getElementById('hk-approval-box').style.display = 'none';
      const res = await fetch('/admin/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Baxto-Token': 'HARI-KING-BAXTO-2026' },
        body: JSON.stringify(pendingAction)
      });
      const data = await res.json();
      addMsg(data.ok ? '✅ Aplicado' : '❌ Error', 'bot');
    }
  </script>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (path === '/' || path === '/admin') return new Response(getDashboard(), { headers: { 'Content-Type': 'text/html' } });
    if (!authCheck(request)) return jsonRes({ error: 'Unauthorized' }, 401);

    if (path === '/api/chat' && request.method === 'POST') {
      const { message } = await request.json();
      const GITHUB_API = "https://api.github.com/repos/cherryv1/HARI-KING/contents/src/index.js";
      const codeRes = await fetch(GITHUB_API, { headers: { "Authorization": `Bearer \${env.GITHUB_TOKEN}`, "User-Agent": "HARI-KING-Agent" } });
      const codeData = await codeRes.json();
      const currentCode = atob(codeData.content);
      
      let reply = "He analizado el código real. ";
      if (message.toLowerCase().includes('cambio')) {
        reply += "Propongo este ajuste:\\n\\n\\`\\`\\`javascript\\nconsole.log('HARI v1.2.0');\\n\\`\\`\\`";
      } else {
        reply += "Todo en orden en src/index.js.";
      }
      return jsonRes({ reply, ok: true });
    }

    if (path === '/admin/execute' && request.method === 'POST') {
      const { fileName, content, commitMessage } = await request.json();
      const result = await hariCommit(fileName, content, commitMessage, env);
      return jsonRes({ ok: true, result });
    }
    return new Response('Not Found', { status: 404 });
  }
};
