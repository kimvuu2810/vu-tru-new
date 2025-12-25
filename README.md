<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zMQyiWyVn7pk8Nve-TWF1aRaVfCBV-71

## ✨ Features

- 🎮 **Hand Gesture Control**: Fist → Heart shape, Open hand → Galaxy spiral
- 🤏 **Pinch Zoom**: Zoom in/out with thumb + index finger
- 🖥️ **Fullscreen Mode**: Immersive full-screen experience
- 📸 **Screenshot Capture**: Save your creations
- ❓ **Interactive Help**: Built-in tutorial overlay
- ⚙️ **Settings Panel**: Customize your experience
- ⌨️ **Keyboard Shortcuts**: Quick access to all features

## 🎯 Quick Start

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F` | Toggle Fullscreen |
| `S` | Take Screenshot |
| `H` | Show/Hide Help |
| `ESC` | Exit Fullscreen / Close Overlays |

### Hand Gestures

- 👊 **Fist** → Heart shape
- ✋ **Open Hand** → Galaxy spiral
- 🤏 **Pinch** (thumb + index) → Zoom in/out
- 🖐️ **Move Hand** → Magnetic particle attraction

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open browser at http://localhost:3000
4. Allow camera permissions when prompted
5. Press `H` for help and instructions

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deploy

### Option 1: Deploy to Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Option 3: Manual Deploy

1. Build the app: `npm run build`
2. Upload the `dist/` folder to any static hosting service
3. Make sure camera permissions are enabled in hosting settings

## Important Notes

- **Camera Access**: This app requires webcam access to work properly
- **HTTPS Required**: Camera access only works on HTTPS or localhost
- **Browser Compatibility**: Works best on Chrome/Edge (MediaPipe support)
