/**
 * EJEMPLO PRÁCTICO: Cómo usar los nuevos efectos visuales y audio
 * 
 * Este archivo muestra cómo actualizar tu sections.ts para usar
 * videos, efectos visuales y sonidos sincronizados con scroll.
 */

import type { StorySection } from "./sections";

/**
 * EJEMPLO COMPLETO: Sección 2 - Pobreza y plan (con efectos atmosféricos)
 */
export const S02_WITH_EFFECTS: StorySection = {
  id: "s02",
  index: 2,
  title: "Pobreza y plan",
  frames: [
    {
      imageSrc: "/story/hg/s02-a.png",
      // Opcional: si tienes s02-a.mp4, descomenta la línea siguiente
      // videoSrc: "/story/hg/s02-a.mp4",
      
      // ✨ Efecto visual: luz oscura, como si fuera noche/tristeza
      effects: {
        lightColor: "#1a1a1a", // Gris oscuro/oscuridad
        lightIntensity: 0.15,   // Muy sutil
      },
      
      // 🔊 Audio: sonido de viento triste o inquietud
      audio: {
        soundFx: "/sounds/sad-wind.mp3",
        volume: 0.3,
      },
      
      dialogues: [
        { text: "La comida escasea. En casa ya no queda casi nada." },
      ],
    },

    {
      imageSrc: "/story/hg/s02-b.png",
      effects: {
        lightColor: "#1a1a1a",
        lightIntensity: 0.15,
      },
      audio: {
        soundFx: "/sounds/sad-wind.mp3",
        volume: 0.3,
      },
      dialogues: [
        { speaker: "Padre", text: "¿Qué va a ser de nosotros?" },
        {
          speaker: "Padre",
          text: "¿Cómo vamos a alimentar a nuestros hijos?",
        },
      ],
    },

    {
      imageSrc: "/story/hg/s02-c.png",
      effects: {
        lightColor: "#1a1a1a",
        lightIntensity: 0.15,
      },
      audio: {
        soundFx: "/sounds/sad-wind.mp3",
        volume: 0.3,
      },
      dialogues: [
        {
          speaker: "Madrastra",
          text: "Mañana los llevaremos al bosque… y los dejaremos allí.",
        },
      ],
    },
  ],
};

/**
 * EJEMPLO: Sección 3 - Piedrecitas de luna (noche mágica)
 */
export const S03_LUNA: StorySection = {
  id: "s03",
  index: 3,
  title: "Piedrecitas de luna",
  frames: [
    {
      imageSrc: "/story/hg/s03-a.png",
      effects: {
        lightColor: "#4a90e2", // Azul de luna
        lightIntensity: 0.35,
        particleType: "snow",  // Efecto de brillo de luna (como nieve/estrellas)
        blur: 0.5,
      },
      audio: {
        soundFx: "/sounds/night-crickets.mp3",
        volume: 0.4,
      },
      dialogues: [
        { text: "Los niños lo han oído todo. Gretel llora en silencio." },
      ],
    },

    {
      imageSrc: "/story/hg/s03-b.png",
      effects: {
        lightColor: "#4a90e2",
        lightIntensity: 0.4,
        particleType: "snow",
      },
      audio: {
        soundFx: "/sounds/night-crickets.mp3",
        volume: 0.4,
      },
      dialogues: [
        { text: "Con luna llena, Hänsel sale y recoge piedrecitas blancas." },
      ],
    },

    {
      imageSrc: "/story/hg/s03-c.png",
      effects: {
        lightColor: "#4a90e2",
        lightIntensity: 0.3,
        particleType: "snow",
      },
      audio: {
        soundFx: "/sounds/magic-sparkle.mp3",
        volume: 0.5,
        delay: 500, // Sonido mágico después de 500ms
      },
      dialogues: [
        { text: "Mañana seremos capaces de encontrar el camino de vuelta" },
      ],
    },
  ],
};

/**
 * EJEMPLO: Sección con CASA DE LA BRUJA (fuego, chispas)
 */
export const WITCH_HOUSE: StorySection = {
  id: "s08",
  index: 8,
  title: "La casa de caramelo",
  frames: [
    {
      imageSrc: "/story/hg/s08-a.png",
      effects: {
        lightColor: "#ff6b00", // Naranja del fuego
        lightIntensity: 0.45,
        particleType: "sparks", // ✨ Chispas de fuego
      },
      audio: {
        soundFx: "/sounds/fire-crackle.mp3",
        volume: 0.6,
      },
      dialogues: [
        { text: "Una pequeña casa aparece entre los árboles..." },
      ],
    },

    {
      imageSrc: "/story/hg/s08-b.png",
      effects: {
        lightColor: "#ff6b00",
        lightIntensity: 0.5,
        particleType: "sparks",
      },
      audio: {
        soundFx: "/sounds/fire-crackle.mp3",
        volume: 0.6,
      },
      dialogues: [
        { text: "Parece hecha de caramelo, chocolate y pan..." },
      ],
    },

    {
      imageSrc: "/story/hg/s08-c.png",
      effects: {
        lightColor: "#ff6b00",
        lightIntensity: 0.55,
        particleType: "sparks",
      },
      audio: {
        soundFx: "/sounds/fire-intensifies.mp3",
        volume: 0.7,
      },
      dialogues: [
        { text: "Ambos corren hacia ella, hambrientos..." },
      ],
    },
  ],
};

/**
 * EJEMPLO: Escena en el BOSQUE con lluvia/viento
 */
export const FOREST_ESCAPE: StorySection = {
  id: "s04",
  index: 4,
  title: "En el bosque",
  frames: [
    {
      imageSrc: "/story/hg/s04-a.png",
      effects: {
        lightColor: "#2d5016", // Verde oscuro del bosque
        lightIntensity: 0.3,
        particleType: "leaves",  // Hojas cayendo
      },
      audio: {
        soundFx: "/sounds/forest-wind.mp3",
        volume: 0.5,
      },
      dialogues: [
        { text: "El bosque es profundo y oscuro alrededor de ellos." },
      ],
    },

    {
      imageSrc: "/story/hg/s04-b.png",
      effects: {
        lightColor: "#2d5016",
        lightIntensity: 0.25,
        particleType: "rain",  // Lluvia
      },
      audio: {
        soundFx: "/sounds/rain-heavy.mp3",
        volume: 0.6,
      },
      dialogues: [
        { text: "La lluvia comienza a caer. Están perdidos." },
      ],
    },

    {
      imageSrc: "/story/hg/s04-c.png",
      effects: {
        lightColor: "#2d5016",
        lightIntensity: 0.35,
        particleType: "leaves",
      },
      audio: {
        soundFx: "/sounds/forest-birds.mp3",
        volume: 0.4,
      },
      dialogues: [
        { text: "Escuchan sonidos extraños... ¿es un pájaro blanco?" },
      ],
    },
  ],
};

/**
 * CÓMO USAR ESTO:
 * 
 * 1. Importa estos ejemplos en lib/story/sections.ts:
 *    import { S02_WITH_EFFECTS, S03_LUNA, WITCH_HOUSE, FOREST_ESCAPE } from "./examples-with-effects";
 * 
 * 2. Reemplaza las secciones en STORY_SECTIONS array:
 *    export const STORY_SECTIONS: StorySection[] = [
 *      // ... portada ...
 *      S02_WITH_EFFECTS,  // En lugar de tu s02 actual
 *      S03_LUNA,          // En lugar de tu s03 actual
 *      // ... resto ...
 *    ];
 * 
 * 3. PREPARA TUS SONIDOS:
 *    - Crea carpeta: public/sounds/
 *    - Agrega archivos MP3:
 *      - sad-wind.mp3 (ambiente triste)
 *      - night-crickets.mp3 (grillos de noche)
 *      - magic-sparkle.mp3 (sonido mágico)
 *      - fire-crackle.mp3 (fuego crepitando)
 *      - forest-wind.mp3 (viento en árboles)\n *      - rain-heavy.mp3 (lluvia)
 *      - forest-birds.mp3 (pájaros del bosque)
 * 
 * 4. PREPARA TUS VIDEOS (opcional):
 *    - Convierte imágenes a video: ffmpeg -loop 1 -i input.png -c:v libx264 -t 3 output.mp4
 *    - Agrega a Frame: videoSrc: \"/story/hg/s02-a.mp4\"
 * 
 * 5. CORRE EL PROYECTO:
 *    npm run dev
 *    Abre http://localhost:3000
 * 
 * CONTROLES:
 * - Botón🔊 en esquina inferior derecha para ajustar volumen
 * - Scroll para ver el efecto de crossfade + sonidos sincronizados
 */
