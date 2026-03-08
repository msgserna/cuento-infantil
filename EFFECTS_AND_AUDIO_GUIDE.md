# 🎬 Sistema de Efectos Visuales y Audio

## ¿Imágenes vs Videos? Híbrido es la mejor opción ✅

### Estructura recomendada:

```
public/
├── story/
│   └── hg/
│       ├── s01-cover.png           (imagen estática)
│       ├── s02-a.mp4               (video - momento clave)
│       ├── s02-a.png               (fallback si falla video)
│       ├── s02-b.png               (imagen estática)
│       └── s02-c.png
└── sounds/
    ├── night-ambience.mp3
    ├── forest-wind.mp3
    ├── fire-crackle.mp3
    └── magic-sparkle.mp3
```

---

## 📹 Implementar Videos

### 1. Convertir imágenes a videos (recomendado para animaciones suaves)

**Con FFmpeg:**
```bash
# Crear video corto (3 segundos, loop) desde imagen
ffmpeg -loop 1 -i s02-a.png -c:v libx264 -t 3 -r 30 -pix_fmt yuv420p s02-a.mp4

# Comprimir para web (mejor tamaño)
ffmpeg -i s02-a.mp4 -vcodec libx265 -crf 23 s02-a-compressed.mp4
```

### 2. En tu código (sections.ts):
```typescript
{
  imageSrc: "/story/hg/s02-a.png",      // Fallback si video falla
  videoSrc: "/story/hg/s02-a.mp4",      // Video
  dialogues: [...],
  effects: {
    lightColor: "#ff6b00",
    lightIntensity: 0.4
  },
  audio: {
    soundFx: "/sounds/forest-ambience.mp3",
    volume: 0.5
  }
}
```

---

## 💡 Sistema de Efectos Visuales

### Tipos disponibles:

```typescript
// Luz dinámica (glow)
effects: {
  lightColor: "#ff6b00",      // Color hexadecimal
  lightIntensity: 0.4         // 0 a 1
}

// Partículas
effects: {
  particleType: "snow"        // "snow" | "rain" | "sparks" | "leaves"
}

// Combinar
effects: {
  lightColor: "#4a90e2",
  lightIntensity: 0.35,
  particleType: "snow",
  blur: 2                     // píxeles
}
```

### Colores sugeridos por escena:

| Escena | Color | Código |
|--------|-------|--------|
| Noche/Luna | Azul | `#4a90e2` |
| Fuego/Bruja | Naranja | `#ff6b00` |
| Bosque | Verde oscuro | `#2d5016` |
| Magia/Hechizo | Púrpura | `#b366ff` |
| Tesoro | Oro | `#ffd700` |
| Muerte/Oscuridad | Gris oscuro | `#1a1a1a` |

---

## 🔊 Sistema de Audio

### Formatos soportados:
- `.mp3` (mejor compatibilidad)
- `.wav` (mejor calidad, tamaño mayor)
- `.m4a` (iOS-friendly)

### Crear sonidos ambientales:

**Con Audacity/Reaper:**
1. Grabar o descargar SFX libre (freesound.org, zapsplat.com)
2. Normalizar a -3dB (Para que no distorsione)
3. Exportar como MP3, bitrate 128kbps (tamaño web-friendly)

**Archivos sugeridos:**
- `night-ambience.mp3` (grillos, viento suave)
- `forest-wind.mp3` (viento entre árboles)
- `fire-crackle.mp3` (sonido de fuego)
- `magic-sparkle.mp3` (efecto mágico)
- `wolf-howl.mp3` (si hay lobo)

### Usar en código:
```typescript
audio: {
  soundFx: "/sounds/forest-wind.mp3",
  volume: 0.4,                 // 0 a 1
  delay: 500                   // ms (opcional)
}
```

---

## 🎮 Controles de Usuario

El componente `AudioControls` flotante permite:
- 🔊 Ajustar volumen maestro
- 🔇 Muteador
- Ubicado en esquina inferior derecha

```typescript
// Ya está en page.tsx:
<AudioControls />
```

---

## 🧪 Iniciar + Probar

### 1. Verificar renders:
```bash
npm run dev
```
Ir a http://localhost:3000

### 2. Agregar datos de prueba a sections.ts:
```typescript
import { EFFECT_EXAMPLE } from "@/lib/story/EFFECTS_GUIDE";

// Reemplazar sección s03 con:
export const STORY_SECTIONS = [
  // ... otras secciones
  EFFECT_EXAMPLE,
];
```

### 3. Preparar sonidos:
- Crear carpeta `public/sounds/`
- Agregar archivos MP3
- Referenciar en `sections.ts`

---

## ⚡ Performance Tips

### Videos:
- ✅ Máximo 5MB por video (usa H.265 para comprimir)
- ✅ Resolución: 1920x1080 mín (Next.js escala automáticamente)
- ✅ Formato: MP4 + WebM fallback
- ✅ Loop automático (no necesita re-cargar)

### Efectos visuales:
- ✅ Canvas renderiza a 60fps pero optimizado
- ✅ Usa `willChange: opacity` en frames
- ✅ GPU acceleration automática (CSS transforms)

### Audio:
- ✅ Web Audio API es muy eficiente
- ✅ Máximo 3-4 sonidos simultáneos recommended
- ✅ Precarga automática al cargar página

---

## 🐛 Debugging

### Audio no se oye:
1. Verificar volumen en `AudioControls`
2. Browser console: `navigator.onLine` debe ser `true`
3. Check browser settings (algunos bloquean autoplay)

### Videos no cargan:
1. Verificar ruta: `/public/story/hg/s02-a.mp4`
2. Fallback a imagen automático
3. Check DevTools → Network tab

### Efectos lentificando:
1. Reducir `particleType` (máx 50 partículas)
2. Reducir `lightIntensity` (reduce procesamiento)
3. Usar imagen estática en mobile (agregar media query)

---

## 📚 Ejemplo completo:

```typescript
// lib/story/sections.ts
{
  id: "s03",
  index: 3,
  title: "Piedrecitas de luna",
  frames: [
    {
      imageSrc: "/story/hg/s03-a.png",
      videoSrc: "/story/hg/s03-a.mp4",
      effects: {
        lightColor: "#4a90e2",
        lightIntensity: 0.35,
        particleType: "snow"
      },
      audio: {
        soundFx: "/sounds/night-ambience.mp3",
        volume: 0.4
      },
      dialogues: [
        { text: "Los niños lo han oído todo..." }
      ]
    }
  ]
}
```

---

## 📖 Referencia de API

### Frame Type:
```typescript
type Frame = {
  imageSrc: string;           // Requerido
  videoSrc?: string;          // Opcional: video MP4
  effects?: {
    lightColor?: string;      // Hex color
    lightIntensity?: number;  // 0-1
    particleType?: ParticleType;
    parallaxIntensity?: number;
    blur?: number;
  };
  audio?: {
    soundFx?: string;
    volume?: number;          // 0-1
    delay?: number;           // ms
  };
  dialogues: Dialogue[];
};
```

¡Listo! Ahora tienes un sistema profesional de efectos y audio. 🎉
