# Hướng Dẫn Deploy Ứng Dụng

Ứng dụng của bạn đã sẵn sàng để deploy với đầy đủ các hiệu ứng 3D và hand tracking!

## ✅ Đã Hoàn Thành

- ✅ Dependencies đã được cài đặt
- ✅ Build production thành công
- ✅ File cấu hình Vercel (vercel.json) đã được tạo
- ✅ File cấu hình Netlify (netlify.toml) đã được tạo
- ✅ Code đã được commit và push lên GitHub

## 🚀 Cách Deploy

### Option 1: Deploy qua Vercel (Khuyến nghị - Dễ nhất!)

**Cách 1: Qua Vercel Dashboard (Không cần CLI)**

1. Truy cập https://vercel.com và đăng nhập
2. Click "Add New Project"
3. Import repository: `kimvuu2810/vu-tru-new`
4. Chọn branch: `claude/review-app-code-m0eaM`
5. Framework Preset: Vite
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click "Deploy"

**Cách 2: Qua Vercel CLI (Nhanh hơn)**

```bash
# Đăng nhập Vercel (chỉ cần làm 1 lần)
vercel login

# Deploy lên production
vercel --prod
```

Vercel CLI đã được cài đặt sẵn trên máy bạn!

### Option 2: Deploy qua Netlify

**Cách 1: Qua Netlify Dashboard**

1. Truy cập https://netlify.com và đăng nhập
2. Click "Add new site" → "Import an existing project"
3. Chọn GitHub và authorize
4. Chọn repository: `kimvuu2810/vu-tru-new`
5. Chọn branch: `claude/review-app-code-m0eaM`
6. Build command: `npm run build`
7. Publish directory: `dist`
8. Click "Deploy site"

**Cách 2: Qua Netlify CLI**

```bash
# Cài Netlify CLI
npm install -g netlify-cli

# Đăng nhập
netlify login

# Deploy
netlify deploy --prod
```

### Option 3: Deploy qua GitHub Pages

```bash
# Cài gh-pages
npm install -g gh-pages

# Build
npm run build

# Deploy
gh-pages -d dist
```

Sau đó enable GitHub Pages trong Settings → Pages → Source: gh-pages branch

## 🎥 Lưu Ý Quan Trọng

### Camera Permissions

App này **BẮT BUỘC** cần quyền truy cập webcam để hoạt động. Đảm bảo:

1. ✅ Site được deploy qua **HTTPS** (không phải HTTP)
2. ✅ Browser hỗ trợ MediaPipe (Chrome, Edge recommended)
3. ✅ User phải click "Allow" khi browser yêu cầu camera permission

### Hiệu Ứng Được Bảo Toàn

Tất cả các hiệu ứng sau sẽ hoạt động đầy đủ sau khi deploy:

- ✨ 18,000 hạt morphing giữa trái tim và galaxy
- 👋 Hand tracking với MediaPipe
- 🌟 Twinkling stars effect
- 💥 Supernova explosion transition
- ❤️ Heart pulsing animation
- 🌌 3,000 hạt celestial core
- 🌠 3,000 hạt nebula background
- ❄️ 1,200 hạt tuyết rơi
- 🎨 Post-processing (bloom, noise, vignette)
- 🔮 Magnetic particle attraction

### Performance

App đã được tối ưu:
- Instanced rendering cho 25,000+ particles
- 60 FPS rendering
- Low-poly geometry
- Optimized bundle size

## 🔗 Links Hữu Ích

- GitHub Repository: https://github.com/kimvuu2810/vu-tru-new
- Branch: claude/review-app-code-m0eaM
- Create PR: https://github.com/kimvuu2810/vu-tru-new/pull/new/claude/review-app-code-m0eaM

## 📊 Build Info

- Build Size: ~1.2 MB (326 KB gzipped)
- Framework: Vite + React + Three.js
- Total Particles: 25,200
- Target FPS: 60

## ❓ Troubleshooting

**Camera không hoạt động:**
- Kiểm tra site có dùng HTTPS chưa
- Thử browser khác (Chrome/Edge)
- Check browser permissions

**Hiệu ứng bị lag:**
- Giảm số lượng hạt trong constants.ts
- Tắt một số post-processing effects
- Check GPU có hỗ trợ WebGL không

**Build fails:**
- Xóa node_modules và chạy lại `npm install`
- Clear cache: `npm run build -- --force`

## 🎉 Kết Quả

Sau khi deploy thành công, bạn sẽ có một URL public dạng:
- Vercel: `https://vu-tru-new.vercel.app`
- Netlify: `https://vu-tru-new.netlify.app`
- GitHub Pages: `https://kimvuu2810.github.io/vu-tru-new`

Chia sẻ link này với mọi người để họ trải nghiệm ứng dụng 3D tương tác của bạn! 🚀
