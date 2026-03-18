import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API routes
  app.post("/api/download/tiktok", async (req, res) => {
    try {
      const { url } = req.body;
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.data) {
        res.json(data);
      } else {
        // Fallback for TikTok
        const fallback = await fetch(`https://api.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const fbData = await fallback.json();
        res.json(fbData);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/download/youtube/cobalt", async (req, res) => {
    try {
      const { url, type } = req.body;
      
      // 1. محاولة Cobalt
      try {
        const response = await fetch('https://api.cobalt.tools/api/json', {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            videoQuality: '720',
            downloadMode: type === 'video' ? 'auto' : 'audio',
            isAudioOnly: type === 'audio',
            aFormat: 'mp3'
          })
        });
        const data = await response.json();
        if (data.url) return res.json(data);
      } catch (e) { console.error("Cobalt failed in backend"); }

      // 2. محاولة SaveTube المحدثة
      const videoIdMatch = url.match(/(?:v=|\/|shorts\/)([0-9A-Za-z_-]{11})/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      
      if (videoId) {
        try {
          const stRes = await fetch(`https://api.v02.savetube.me/info/${videoId}`);
          const stData = await stRes.json();
          if (stData.status && stData.data) {
            const streams = type === 'video' ? stData.data.video_formats : stData.data.audio_formats;
            if (streams && streams.length > 0) {
              return res.json({ url: streams[0].url });
            }
          }
        } catch (e) {}

        // محاولة محرك بديل: yt5s
        try {
          const params = new URLSearchParams();
          params.append('q', url);
          params.append('vt', 'home');
          
          const yt5sRes = await fetch('https://yt5s.io/api/ajaxSearch/index', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
          });
          const yt5sData = await yt5sRes.json();
          if (yt5sData.status === 'ok' && yt5sData.links) {
            const formats = type === 'video' ? yt5sData.links.mp4 : yt5sData.links.mp3;
            const firstKey = Object.keys(formats)[0];
            if (firstKey) {
              const convertParams = new URLSearchParams();
              convertParams.append('vid', yt5sData.vid);
              convertParams.append('k', formats[firstKey].k);
              
              const convRes = await fetch('https://yt5s.io/api/ajaxConvert/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: convertParams
              });
              const convData = await convRes.json();
              if (convData.status === 'ok' && convData.dlink) {
                return res.json({ url: convData.dlink });
              }
            }
          }
        } catch (e) {}
      }
      
      res.status(404).json({ error: "All backend engines failed" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/download/youtube/init", async (req, res) => {
    try {
      const { url, format } = req.body;
      const response = await fetch(`https://loader.to/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/download/youtube/progress", async (req, res) => {
    try {
      const { id } = req.query;
      const response = await fetch(`https://p.savenow.to/api/progress?id=${id}`);
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
