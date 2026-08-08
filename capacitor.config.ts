import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.codeforge.learn",
  appName: "Code Forge",
  webDir: "out",
  android: {
    allowMixedContent: false,
    backgroundColor: "#07080b",
    webContentsDebuggingEnabled: false,
  },
  server: {
    androidScheme: "https",
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 400,
      backgroundColor: "#07080b",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      backgroundColor: "#07080b",
      style: "DARK",
      overlaysWebView: false,
    },
  },
};

export default config;
