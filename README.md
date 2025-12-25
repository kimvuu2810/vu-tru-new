<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1zMQyiWyVn7pk8Nve-TWF1aRaVfCBV-71

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open browser at http://localhost:3000
4. Allow camera permissions when prompted

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
