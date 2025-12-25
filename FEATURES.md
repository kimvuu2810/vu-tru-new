# Tính Năng Ứng Dụng

Ứng dụng 3D tương tác với hand tracking và gesture control đầy đủ.

## 🎮 Các Cử Chỉ Điều Khiển

### 1. 👊 Nắm Tay (Fist Gesture) → Hình Trái Tim
- **Cách thực hiện**: Nắm bàn tay lại (nắm đấm)
- **Hiệu ứng**:
  - 18,000 hạt co lại tạo thành hình trái tim 3D
  - Trái tim đập theo nhịp
  - Màu sắc ấm áp hơn
  - Core energy tăng cường độ sáng

### 2. ✋ Mở Bàn Tay (Open Hand) → Hình Galaxy
- **Cách thực hiện**: Bung bàn tay ra (5 ngón tay dang rộng)
- **Hiệu ứng**:
  - Hạt mở rộng thành galaxy xoắn ốc 3 cánh
  - Hiệu ứng supernova explosion khi chuyển từ trái tim
  - Hạt lấp lánh mạnh hơn
  - Core energy giảm độ sáng

### 3. 🤏 Pinch Zoom (MỚI!) → Phóng To/Thu Nhỏ
- **Cách thực hiện**: Chụm ngón cái và ngón trỏ lại gần nhau (giống pinch trên điện thoại)
- **Hiệu ứng**:
  - **Khoảng cách nhỏ** (ngón tay gần nhau) = **Zoom In** (camera lại gần)
  - **Khoảng cách lớn** (ngón tay xa nhau) = **Zoom Out** (camera ra xa)
  - Hiển thị indicator "Zoom X%" ở phía trên màn hình khi đang pinch
  - Zoom mượt mà với interpolation
  - Dải zoom: 8 → 35 units (camera Z position)

## 📊 Chi Tiết Kỹ Thuật Pinch Zoom

### Cách Hoạt Động
1. **Phát hiện landmarks**: Ngón cái (landmark 4) và ngón trỏ (landmark 8)
2. **Tính khoảng cách Euclidean 3D**:
   ```
   distance = √((x₁-x₂)² + (y₁-y₂)² + (z₁-z₂)²)
   ```
3. **Mapping khoảng cách → zoom level**:
   - Min distance (0.02) → Camera Z = 8 (zoom in max)
   - Max distance (0.15) → Camera Z = 35 (zoom out max)
4. **Smooth interpolation**: Sử dụng easing curve để zoom mượt

### Thông Số Cấu Hình
Trong `constants.ts`:
```typescript
PINCH_ZOOM = {
  MIN_DISTANCE: 0.02,     // Khoảng cách tối thiểu
  MAX_DISTANCE: 0.15,     // Khoảng cách tối đa
  MIN_CAMERA_Z: 8,        // Zoom in max
  MAX_CAMERA_Z: 35,       // Zoom out max
  DEFAULT_CAMERA_Z: 20,   // Vị trí mặc định
  SMOOTHING: 0.1,         // Độ mượt (0-1)
}
```

### Visual Feedback
- **Indicator hiển thị**: Badge màu cyan ở đỉnh màn hình
- **Hiệu ứng**: 3 chấm nhấp nháy + text "Zoom X%"
- **Điều kiện**: Chỉ hiện khi khoảng cách < 0.08 (đang pinch)
- **Màu sắc**: Cyan (#00ffff) với glow effect

## 🎨 Hiệu Ứng Bổ Sung

### 🧲 Magnetic Attraction (Hút Từ Tính)
- Các hạt bị hút về phía ngón trỏ
- Lực hút mạnh hơn khi ở chế độ galaxy
- Tạo hiệu ứng "vẽ" trong không gian 3D

### 💥 Supernova Explosion
- Kích hoạt khi chuyển từ trái tim sang galaxy
- Đẩy tất cả hạt ra xa trong chớp mắt
- Hiệu ứng kéo dài ~2 giây

### ✨ Twinkling Stars
- Mỗi hạt có chu kỳ lấp lánh riêng
- Phase ngẫu nhiên để tránh đồng bộ
- Tạo cảm giác như bầu trời đêm thật

### 🔄 Auto Rotation
- Camera tự động quay khi không có tay
- Tắt khi phát hiện tay
- Tốc độ: 0.3 rad/s

## 🎯 Hệ Thống Particles

### 1. Magic Particles (18,000 hạt)
- Hạt chính morphing giữa 2 hình dạng
- 5 màu sắc: White, Cyan, Gold, Red, Purple
- Kích thước đa dạng: 0.4 → 2.0

### 2. Celestial Core (3,000 hạt)
- Lõi năng lượng ở trung tâm
- Gradient: White → Red/Pink
- Độ sáng thay đổi theo expansion factor

### 3. Celestial Background (3,000 hạt)
- Nền tinh vân xoay chậm
- Màu tím đậm
- Tốc độ xoay: 0.01 rad/s

### 4. Snow Particles (1,200 hạt)
- Tuyết rơi nhẹ nhàng
- Chỉ hiện khi ở chế độ galaxy
- Rơi theo trục Y với tốc độ ngẫu nhiên

## 🎛️ Post-Processing Effects

### Bloom
- Intensity: 2.5
- Luminance threshold: 0.2
- Mipmap blur: enabled

### Noise
- Opacity: 0.03
- Tạo hiệu ứng film grain

### Vignette
- Offset: 0.2
- Darkness: 1.2
- Làm tối viền màn hình

## 🖥️ UI Elements

### 1. Loading State
- Spinner animation
- Text "Summoning" với tracking rộng
- Opacity thấp cho cảm giác huyền bí

### 2. Hand Visualizer
- Góc dưới bên phải
- Mini 3D representation của tay
- Hiển thị landmarks
- Indicator hiện có tay/không

### 3. Pinch Zoom Indicator (MỚI!)
- Vị trí: Top center
- Hiện khi đang pinch
- Hiển thị zoom percentage
- Animation: Pulsing dots

## 📱 Browser Compatibility

### Được Hỗ Trợ Đầy Đủ
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Opera 75+

### Hỗ Trợ Một Phần
- ⚠️ Firefox (MediaPipe performance thấp hơn)
- ⚠️ Safari (cần enable WebGL experimental features)

### Yêu Cầu
- **HTTPS**: Bắt buộc cho camera access
- **WebGL 2.0**: Cho rendering
- **Camera**: Webcam hoạt động
- **GPU**: Khuyến nghị cho 60fps

## 🚀 Performance

### Metrics
- **Target FPS**: 60
- **Actual FPS**: 55-60 (trên GPU trung bình)
- **Total Particles**: 25,200
- **Draw Calls**: ~10 (nhờ instanced rendering)
- **Memory**: ~150 MB

### Optimizations
- Instanced rendering cho tất cả particles
- Low-poly geometry (4-vertex spheres)
- Disabled antialiasing & stencil buffer
- DPR capped at 2
- Memoized particle data

## 🎓 Cách Sử Dụng

1. **Khởi động app**: Cho phép camera access
2. **Đưa tay vào khung hình**: Để bên phải hoặc giữa
3. **Thử các cử chỉ**:
   - Nắm tay → Trái tim
   - Mở tay → Galaxy
   - Pinch (cái + trỏ) → Zoom in/out
4. **Di chuyển tay**: Hạt sẽ bị hút theo

## 🔧 Tùy Chỉnh

Các thông số có thể điều chỉnh trong `constants.ts`:
- `PARTICLE_COUNT`: Số lượng hạt chính
- `GESTURE_THRESHOLDS`: Ngưỡng nhận diện cử chỉ
- `PINCH_ZOOM`: Cấu hình zoom
- `COLORS`: Bảng màu

## 📝 Changelog

### v1.1.0 (Mới nhất)
- ✨ **Thêm Pinch Zoom gesture**
  - Zoom in/out bằng ngón cái + ngón trỏ
  - Visual feedback với indicator
  - Smooth camera interpolation
- 🐛 Bug fixes và performance improvements

### v1.0.0
- 🎉 Initial release
- ✨ Hand tracking với MediaPipe
- ✨ Morphing giữa trái tim và galaxy
- ✨ 25,000+ particles rendering
- ✨ Post-processing effects
