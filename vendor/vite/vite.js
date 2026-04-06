#!/usr/bin/env node
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import url from 'node:url';

const args = process.argv.slice(2);
const command = args[0] || 'dev';
const root = process.cwd();

if (command === 'build') {
  await build(root);
} else if (command === 'preview') {
  await serve(path.join(root, 'dist'), 4173, 'preview');
} else {
  await serve(root, 5173, 'dev');
}

async function build(cwd) {
  const dist = path.join(cwd, 'dist');
  await fsp.rm(dist, { recursive: true, force: true });
  await fsp.mkdir(dist, { recursive: true });

  for (const item of ['index.html', 'src', 'assets']) {
    const from = path.join(cwd, item);
    if (fs.existsSync(from)) {
      const to = path.join(dist, item);
      await copyRecursive(from, to);
    }
  }

  console.log('vite v0.0.0-local build complete');
  console.log(`dist ready at ${dist}`);
}

async function copyRecursive(from, to) {
  const stat = await fsp.stat(from);
  if (stat.isDirectory()) {
    await fsp.mkdir(to, { recursive: true });
    const entries = await fsp.readdir(from);
    for (const entry of entries) {
      await copyRecursive(path.join(from, entry), path.join(to, entry));
    }
    return;
  }

  await fsp.mkdir(path.dirname(to), { recursive: true });
  await fsp.copyFile(from, to);
}

async function serve(baseDir, port, label) {
  const server = http.createServer(async (req, res) => {
    const reqPath = url.parse(req.url || '/').pathname || '/';
    let filePath = path.join(baseDir, decodeURIComponent(reqPath));

    if (reqPath.endsWith('/')) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!path.extname(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.css': 'text/css; charset=utf-8'
    };

    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    const data = await fsp.readFile(filePath);
    res.end(data);
  });

  server.listen(port, () => {
    console.log(`vite v0.0.0-local ${label} server running at:`);
    console.log(`  > Local: http://localhost:${port}/`);
  });
}
