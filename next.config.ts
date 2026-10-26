import type { NextConfig } from 'next';

// Static export so the app can be bundled into an Android APK (Capacitor)
// and a Windows desktop app (Electron) without a server.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
