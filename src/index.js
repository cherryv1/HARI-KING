// ═══════════════════════════════════════════════════════════
//  HARI-KING — Agente Autónomo Privado de Baxto

async function hariCommit(fileName, content, message, env) {
  const MAX_RETRIES = 3;
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const GITHUB_API = `https://api.github.com/repos/cherryv1/HARI-KING/contents/${fileName}`;
      const res = await fetch(GITHUB_API, {
        headers: { "Authorization": `Bearer ${env.GITHUB_TOKEN}`, "User-Agent": "HARI-KING-Agent" }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const fileData = await res.json();
      const commitRes = await fetch(GITHUB_API, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${env.GITHUB_TOKEN}`, "Content-Type": "application/json", "User-Agent": "HARI-KING-Agent" },
        body: JSON.stringify({ message: "HARI-AUTONOMOUS: " + message, content: btoa(content), sha: fileData.sha })
      });
      if (!commitRes.ok) throw new Error(`Commit failed! status: ${commitRes.status}`);
      return await commitRes.json();
    } catch (error) {
      lastError = error;
      if (attempt === MAX_RETRIES) throw new Error(`Max retries reached: ${lastError.message}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}


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
    if (path === "/admin/execute" && request.method === "POST") {
      try {
        const { fileName, content, commitMessage } = await request.json();
        if (!fileName || !content) return jsonRes({ ok: false, error: "fileName y content requeridos" });
        const result = await hariCommit(fileName, content, commitMessage || "HARI: cambio aprobado", env);
        return jsonRes({ ok: true, result });
      } catch(e) { return jsonRes({ ok: false, error: e.message }); }
    }
    if (path === '/health') {
      return jsonRes({ ok: true, system: 'HARI-KING', version: '1.1.0' });
    }


    // HARI-KING — Orquestador de APIs
    if (path === '/api/chat' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { message, session_id } = body;
        const imageBase64 = body.image || null;
        const sessKey = "hari:" + (session_id || "baxto");
        let history = [];
        try {
          const raw = await env.SESSIONS.get(sessKey);
          if (raw) history = JSON.parse(raw);
        } catch(e) {}
        
        
        let codeContext = "";
        try {
          const ghRes = await fetch("https://api.github.com/repos/cherryv1/HARI-KING/contents/src/index.js", {
            headers: { "Authorization": `Bearer ${env.GITHUB_TOKEN}`, "User-Agent": "HARI-KING-Worker" }
          });
          const ghData = await ghRes.json();
          if (ghData && ghData.content) {
            const fullCode = atob(ghData.content.replace(/\n/g, ""));
            codeContext = "\n\nAquí está tu código real actual (primeras 100 líneas):\n" + fullCode.split("\n").slice(0, 100).join("\n") + "\nBasa tus propuestas en este código real. Solo JavaScript.";
          }
        } catch(e) { console.error("GH_FETCH_ERROR:", e.message); }

        const SYSTEM = 'Eres HARI-KING v4.5, arquitecto privado de Baxto Style Tattoo. Solo existes para Baxto. No ejecutas nada sin su ✅. Baxto tiene la última palabra siempre. Habla directo, sin bullets, sin markdown. STACK: Cloudflare Workers ESM, JavaScript puro, fetch nativo, Web APIs estándar. NO existe Node.js, require(), npm, Python, cron, sistema de archivos. Propón solo cambios reales en src/index.js basados en el código que recibes como contexto.' + codeContext;
        
        // Detectar tipo de tarea
        const msgLower = message.toLowerCase();
        const esImagen = !!imageBase64 || /imagen|foto|analiz|visual|ver|diseño/i.test(msgLower);
        const esCodigo = /código|error|bug|fix|index|worker|deploy|función/i.test(msgLower);
        
        let reply = null;
        
        // Groq llama-4-scout — visión real
        if (imageBase64 && env.GROQ_API_KEY) {
          try {
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
            const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + env.GROQ_API_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: [{
                  role: 'user',
                  content: [
                    { type: 'text', text: SYSTEM + '\n\n' + (message || 'Analiza esta imagen en detalle') },
                    { type: 'image_url', image_url: { url: 'data:' + mimeType + ';base64,' + base64Data } }
                  ]
                }],
                max_tokens: 800,
                temperature: 0.7
              })
            });
            const d = await r.json();
            reply = d.choices?.[0]?.message?.content;
          } catch(e) { reply = 'VISION_ERROR: ' + e.message; }
        }

        // Mistral — análisis de código
        if (!reply && esCodigo && env.MISTRAL_API_KEY) {
          try {
            const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + env.MISTRAL_API_KEY, 'Content-Type': 'application/json' },
              body: JSON.stringify({ model: 'mistral-small-latest', messages: [{ role: 'system', content: SYSTEM }, ...history, { role: 'user', content: message }], max_tokens: 800 })
            });
            const d = await r.json();
            reply = d.choices?.[0]?.message?.content;
          } catch(e) {}
        }
        
        // Groq — chat general (primario)
        if (!reply && env.GROQ_API_KEY) {
          try {
            const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + env.GROQ_API_KEY, 'Content-Type': 'application/json' },
              body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: SYSTEM }, ...history, { role: 'user', content: message }], max_tokens: 500, temperature: 0.7 })
            });
            const d = await r.json();
            reply = d.choices?.[0]?.message?.content;
          } catch(e) {}
        }
        
        // Cerebras — fallback
        if (!reply && env.CEREBRAS_API_KEY) {
          try {
            const r = await fetch('https://api.cerebras.ai/v1/chat/completions', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + env.CEREBRAS_API_KEY, 'Content-Type': 'application/json' },
              body: JSON.stringify({ model: 'llama3.1-8b', messages: [{ role: 'system', content: SYSTEM }, ...history, { role: 'user', content: message }], max_tokens: 500 })
            });
            const d = await r.json();
            reply = d.choices?.[0]?.message?.content;
          } catch(e) {}
        }
        
        // Guardar en KV
        if (reply) {
          try {
            history.push({ role: 'user', content: message });
            history.push({ role: 'assistant', content: reply });
            if (history.length > 20) history = history.slice(-20);
            await env.SESSIONS.put(sessKey, JSON.stringify(history), { expirationTtl: 86400 });
          } catch(e) {}
        }
        return jsonRes({ reply: reply || 'HARI sin respuesta — verificar APIs', ok: true });
      } catch(e) {
        return jsonRes({ error: e.message }, 500);
      }
    }


    // HARI supervisa BRA GT
    if (path === '/api/supervisar' && request.method === 'GET') {
      try {
        const BRA = 'https://black-lily-elite.cherry-v1pro.workers.dev';
        const opts = { headers: { 'X-Hari-Auth': 'hari-king-2026', 'User-Agent': 'HARI-KING/1.0' } };
        const [health, metrics, rules] = await Promise.all([
          fetch(BRA + '/health', opts).then(r => r.json()),
          fetch(BRA + '/api/metrics', opts).then(r => r.json()),
          fetch(BRA + '/admin/list-rules', opts).then(r => r.json())
        ]);
        return jsonRes({
          ok: true,
          bra_status: health.status || 'unknown',
          total_clientes: metrics.totalClientes || 0,
          conversiones: metrics.totalConversiones || 0,
          engagement: metrics.engagementPromedio || 0,
          reglas_activas: rules.rules?.length || 0,
          timestamp: new Date().toISOString()
        });
      } catch(e) {
        return jsonRes({ ok: false, error: e.message }, 500);
      }
    }

    // ── AGENTE: analizar código y proponer fix ────────────────
    if (path === '/agent/analyze' && request.method === 'POST') {
      try {
        const { task } = await request.json();
        if (!task) return jsonRes({ error: 'Falta task' }, 400);
        const { agentLoop } = await import('./agent.js');
        const result = await agentLoop(task, env);
        return jsonRes(result);
      } catch(e) { return jsonRes({ error: e.message }, 500); }
    }

    // ── AGENTE: aprobar y ejecutar fix ✅ ──────────────────
    if (path === '/agent/approve' && request.method === 'POST') {
      try {
        const { proposalId } = await request.json();
        if (!proposalId) return jsonRes({ error: 'Falta proposalId' }, 400);
        const { executeApproved } = await import('./agent.js');
        const result = await executeApproved(proposalId, env);
        return jsonRes(result);
      } catch(e) { return jsonRes({ error: e.message }, 500); }
    }

    // ── AGENTE: leer archivo del repo ──────────────────────
    if (path === '/agent/file' && request.method === 'POST') {
      try {
        const { file } = await request.json();
        const { readFile } = await import('./agent.js');
        const result = await readFile(file || 'src/index.js', env.GITHUB_PAT);
        return jsonRes({ ok: true, content: result.content.slice(0, 5000), sha: result.sha });
      } catch(e) { return jsonRes({ error: e.message }, 500); }
    }

    // ── AGENTE: ver commits ────────────────────────────────
    if (path === '/agent/commits' && request.method === 'GET') {
      try {
        const { getCommits } = await import('./agent.js');
        const commits = await getCommits(env.GITHUB_PAT);
        return jsonRes({ ok: true, commits });
      } catch(e) { return jsonRes({ error: e.message }, 500); }
    }

    // ── AGENTE: ver actions ────────────────────────────────
    if (path === '/agent/actions' && request.method === 'GET') {
      try {
        const { getActions } = await import('./agent.js');
        const actions = await getActions(env.GITHUB_PAT);
        return jsonRes({ ok: true, actions });
      } catch(e) { return jsonRes({ error: e.message }, 500); }
    }

    // ── AGENTE: ver issues ─────────────────────────────────
    if (path === '/agent/issues' && request.method === 'GET') {
      try {
        const { getIssues } = await import('./agent.js');
        const issues = await getIssues(env.GITHUB_PAT);
        return jsonRes({ ok: true, issues });
      } catch(e) { return jsonRes({ error: e.message }, 500); }
    }

    // ── AGENTE: listar archivos ────────────────────────────
    if (path === '/agent/files' && request.method === 'GET') {
      try {
        const { listFiles } = await import('./agent.js');
        const files = await listFiles('src', env.GITHUB_PAT);
        return jsonRes({ ok: true, files });
      } catch(e) { return jsonRes({ error: e.message }, 500); }
    }

    // ── AGENTE: status general ─────────────────────────────
    if (path === '/agent/status' && request.method === 'GET') {
      try {
        const { getCommits, getActions, getIssues } = await import('./agent.js');
        const [commits, actions, issues] = await Promise.all([
          getCommits(env.GITHUB_PAT, 5),
          getActions(env.GITHUB_PAT),
          getIssues(env.GITHUB_PAT)
        ]);
        return jsonRes({ ok: true, commits, actions, issues, repo: 'cherryv1/HARI-KING' });
      } catch(e) { return jsonRes({ error: e.message }, 500); }
    }

    return new Response('HARI-KING — Not Found', { status: 404 });
  }
};
