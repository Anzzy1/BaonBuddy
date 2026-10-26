const { app, BrowserWindow, Menu, shell } = require('electron');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Serve the exported Next.js app from a tiny local server.
// A real http:// origin keeps localStorage, workers and WebAssembly happy.
// In development main.js sits in desktop/, while the packaged app keeps out/ next to it.
const WEB_ROOT = app.isPackaged ? path.join(__dirname, 'out') : path.join(__dirname, '..', 'out');

app.setName('BaonBuddy');
if (process.platform === 'win32') app.setAppUserModelId('com.baonbuddy.app');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.onnx': 'application/octet-stream',
  '.gz': 'application/gzip',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
};

function startServer() {
  return new Promise(resolve => {
    const server = http.createServer((req, res) => {
      let pathname;
      try {
        pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      } catch {
        res.writeHead(400).end('Bad request');
        return;
      }

      let filePath = path.join(WEB_ROOT, pathname);
      // Never serve outside the exported app folder
      if (!filePath.startsWith(WEB_ROOT)) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      if (pathname === '/' || pathname.endsWith('/')) filePath = path.join(filePath, 'index.html');
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        // SPA fallback for hash routes / missing trailing slash
        filePath = path.join(WEB_ROOT, 'index.html');
      }

      // These headers enable SharedArrayBuffer, which the offline Whisper
      // model uses for multi-threaded speech recognition.
      res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Content-Type', MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream');
      fs.createReadStream(filePath)
        .on('error', () => res.writeHead(500).end('Read error'))
        .pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

let mainWindow = null;

async function createWindow() {
  const port = await startServer();
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 380,
    minHeight: 600,
    backgroundColor: '#FFFFFF',
    title: 'BaonBuddy',
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);

  // Optional headless check: BAONBUDDY_SMOKE=1 electron .
  if (process.env.BAONBUDDY_SMOKE === '1') {
    mainWindow.webContents.once('did-finish-load', async () => {
      await new Promise(r => setTimeout(r, 2500));
      try {
        const info = await mainWindow.webContents.executeJavaScript(
          `({
            title: document.title,
            heading: (document.querySelector('h1') || {}).innerText || '',
            tabs: document.querySelectorAll('nav.tabbar button').length,
            styles: getComputedStyle(document.body).backgroundColor,
            stored: !!localStorage.getItem('estudyante-balanse.v1'),
            text: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 220)
          })`,
        );
        console.log('SMOKE ' + JSON.stringify(info));
        fs.writeFileSync(path.join(os.tmpdir(), 'baonbuddy-smoke.json'), JSON.stringify(info));
      } catch (err) {
        console.error('SMOKE ERROR', err);
        fs.writeFileSync(path.join(os.tmpdir(), 'baonbuddy-smoke.json'), JSON.stringify({ error: String(err) }));
      }
      app.quit();
    });
  }

  await mainWindow.loadURL(`http://127.0.0.1:${port}/`);
  mainWindow.on('closed', () => { mainWindow = null; });

  // External links open in the real browser, not inside the app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  if (process.env.BAONBUDDY_SMOKE === '1') {
    fs.writeFileSync(
      path.join(os.tmpdir(), 'baonbuddy-boot.json'),
      JSON.stringify({ webRoot: WEB_ROOT, exists: fs.existsSync(WEB_ROOT), packaged: app.isPackaged, dirname: __dirname }),
    );
  }
  return createWindow();
}).catch(err => {
  console.error(err);
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
