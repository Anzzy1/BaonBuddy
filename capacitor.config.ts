import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.baonbuddy.app',
  appName: 'BaonBuddy',
  webDir: 'out',
  server: {
    // https://localhost gives the WebView a secure origin, so the camera,
    // microphone and WebAssembly work. Cleartext is allowed only for the
    // optional local Ollama server on the same network.
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    backgroundColor: '#FFFFFF',
  },
  ios: {
    // The page handles the notch/home-indicator insets itself via
    // viewport-fit=cover + env(safe-area-inset-*) in globals.css.
    contentInset: 'never',
    // Matches the iOS shell's grouped background (app/ios.css) so rubber-band
    // overscroll doesn't flash white. Long-press link previews feel un-app-like.
    backgroundColor: '#F2F2F7',
    allowsLinkPreview: false,
  },
  plugins: {
    LocalNotifications: {
      // White glyph in res/drawable; Android tints it with iconColor
      smallIcon: 'ic_stat_baonbuddy',
      iconColor: '#3A4BFF',
    },
    SystemBars: {
      // Light bars (dark icons) to match the white UI, inset handling in CSS so
      // the web layout can use the same safe-area variables on Android and iOS.
      style: 'LIGHT',
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
  },
};

export default config;
