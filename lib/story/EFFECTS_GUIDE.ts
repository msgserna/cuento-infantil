/**
 * INSTRUCCIONES PARA USAR LOS NUEVOS EFECTOS
 * 
 * 1. AGREGAR VIDEOS:
 *    - Frame con video: videoSrc: "/story/hg/s02-a.mp4"
 *    - Si el video falla, automáticamente cae a la imagen en imageSrc
 * 
 * 2. AGREGAR EFECTOS VISUALES:
 *    - Luz dinámica: effects: { lightColor: "#ff6b00", lightIntensity: 0.4 }
 *    - Partículas: effects: { particleType: "snow" | "rain" | "sparks" | "leaves" }
 *    - Combinar ambos: effects: { lightColor: "#ff6b00", lightIntensity: 0.3, particleType: "sparks" }
 *    - Blur: effects: { blur: 2 }
 * 
 * 3. AGREGAR SONIDOS:
 *    - Frame con audio: audio: { soundFx: "/sounds/forest-ambience.mp3", volume: 0.5 }
 *    - El sonido se reproducirá aproximadamente cuando el frame sea visible
 * 
 * COLORES SUGERIDOS:
 * - Luna/Noche: "#4a90e2" (azul)
 * - Fuego/Casa bruja: "#ff6b00" (naranja)
 * - Bosque: "#2d5016" (verde oscuro)
 * - Magia: "#b366ff" (púrpura)
 * - Tesoro: "#ffd700" (oro)
 * 
 * TIPOS DE PARTÍCULAS:
 * - snow: Copos de nieve cayendo
 * - rain: Lluvia
 * - sparks: Chispas (fuego)
 * - leaves: Hojas cayendo
 * 
 * EJEMPLO COMPLETO:
 */

export const EFFECT_EXAMPLE = {
  id: "s03",
  index: 3,
  title: "Piedrecitas de luna",
  frames: [
    {
      imageSrc: "/story/hg/s03-a.png",
      // videoSrc: "/story/hg/s03-a.mp4", // Opcional: si tienes video
      dialogues: [
        {
          text: "Los niños lo han oído todo. Gretel llora en silencio.",
        },
      ],
      effects: {
        lightColor: "#4a90e2", // Luz azul de luna
        lightIntensity: 0.35,
      },
      audio: {
        soundFx: "/sounds/night-ambience.mp3",
        volume: 0.4,
      },
    },
    {
      imageSrc: "/story/hg/s03-b.png",
      dialogues: [
        {
          text: "Con luna llena, Hänsel sale y recoge piedrecitas blancas.",
        },
      ],
      effects: {
        lightColor: "#4a90e2",
        lightIntensity: 0.4,
        particleType: "snow", // Efecto de brillo de luna
      },
      audio: {
        soundFx: "/sounds/wind-soft.mp3",
        volume: 0.3,
      },
    },
    {
      imageSrc: "/story/hg/s03-c.png",
      dialogues: [
        {
          text: "Mañana seremos capaces de encontrar el camino de vuelta",
        },
      ],
      effects: {
        lightColor: "#4a90e2",
        lightIntensity: 0.3,
        particleType: "snow",
      },
    },
  ],
};

// EJEMPLO: Casa de la bruja (fuego, chispas)
export const WITCH_HOUSE_EXAMPLE = {
  frames: [
    {
      imageSrc: "/story/hg/witch-house.png",
      effects: {
        lightColor: "#ff6b00", // Naranja del fuego
        lightIntensity: 0.5,
        particleType: "sparks", // Chispas
      },
      audio: {
        soundFx: "/sounds/fire-crackle.mp3",
        volume: 0.6,
      },
      dialogues: [
        { text: "Una pequeña casa aparece entre los árboles..." },
      ],
    },
  ],
};

// EJEMPLO: Bosque (viento, hojas)
export const FOREST_EXAMPLE = {
  frames: [
    {
      imageSrc: "/story/hg/forest.png",
      effects: {
        lightColor: "#2d5016", // Verde oscuro
        lightIntensity: 0.25,
        particleType: "leaves", // Hojas
      },
      audio: {
        soundFx: "/sounds/forest-wind.mp3",
        volume: 0.4,
      },
      dialogues: [
        { text: "El bosque es profundo y oscuro..." },
      ],
    },
  ],
};
