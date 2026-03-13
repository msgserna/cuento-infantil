// lib/story/sections.ts
// 11 secciones verticales:
// - Sección 0 (portada): 1 imagen, no cuenta como capítulo
// - Secciones 1..10: 3 imágenes por sección + diálogos (overlay con opacidad)

export type Dialogue = {
  speaker?: string;
  text: string;
};

export type Frame = {
  // Ruta en /public (.png .jpg para imágenes, .mp4 .webm para videos)
  imageSrc: string;
  // Opcional: ruta del video. Si existe, se usa VIDEO en lugar de imagen
  videoSrc?: string;

  // Efectos visuales para esta sección
  effects?: {
    lightColor?: string; // ej: "#ff6b00" para fuego, "#4a90e2" para luna
    lightIntensity?: number; // 0 - 1
    particleType?: "none" | "snow" | "rain" | "sparks" | "leaves"; // partículas
    parallaxIntensity?: number; // 0 - 1
    blur?: number; // píxeles (ej: 2 para efecto de movimiento)
  };

  // Audio para esta escena
  audio?: {
    soundFx?: string; // ruta en /public/sounds
    volume?: number; // 0 - 1
    delay?: number; // ms antes de ejecutar
  };

  // Narración de voz (ruta en /public/narration)
  narrationSrc?: string;

  // Diálogos que aparecen sobre este frame
  dialogues: Dialogue[];

  // Zonas interactivas hover/touch (ej: luna que brilla al pasar el ratón)
  hotspots?: Array<{
    id: string;
    top: string;
    left: string;
    size: string;
    glowColor: string;
    autoGlow?: boolean;
  }>;

  // Puntos de brillo estáticos tipo sparkle (piedras brillantes, luna, etc.)
  sparkles?: Array<{
    top: string;
    left: string;
    size: number;       // px
    color: string;      // rgba
    delay: number;      // s — desfase de la animación
    type?: "moon";      // si es luna, glow más grande
  }>;
};

export type StorySection = {
  id: string; // "s01"..."s11"
  index: number; // 0 = portada, 1..10 = capítulos
  title: string;
  // Portada tendrá 1 frame, el resto 3
  frames: Frame[];
};

export const STORY_SECTIONS: StorySection[] = [
  // 01 — PORTADA (index 0: no cuenta como capítulo)
  {
    id: "s01",
    index: 0,
    title: "Hänsel y Gretel",
    frames: [
      {
        imageSrc: "/story/hg/s01-cover.webp",
        videoSrc: "/story/hg/portada.webm",
        dialogues: [
          { text: "Un cuento de los Hermanos Grimm" },
          { text: "Scroll para empezar" },
        ],
      },
    ],
  },

  // 02 — POBREZA Y PLAN (interior oscuro, tristeza)
  {
    id: "s02",
    index: 1,
    title: "Pobreza y plan",
    frames: [
      {
        imageSrc: "/story/hg/s02-a.webp",
        videoSrc: "/story/hg/s02-a.webm",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.15,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/sad-wind.mp3", volume: 0.15 },
        narrationSrc: "/narration/s02-a.mp3",
        dialogues: [
          {
            text: "Había una vez un leñador muy pobre que vivía junto a un enorme bosque con su esposa y sus dos hijos: el niño se llamaba Hänsel y la niña, Gretel.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s02-b.webp",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.2,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/sad-wind.mp3", volume: 0.12 },
        narrationSrc: "/narration/s02-b.mp3",
        dialogues: [
          {
            speaker: "Madrastra",
            text: "Mañana llevaremos a los niños a lo más espeso del bosque… y los dejaremos allí.",
          },
          {
            speaker: "Padre",
            text: "No, mujer. ¿Crees que tengo el corazón de piedra?",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s02-c.webp",
        videoSrc: "/story/hg/s02-c.webm",
        effects: {
          lightColor: "#2a1a1a",
          lightIntensity: 0.2,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/tension.mp3", volume: 0.15 },
        narrationSrc: "/narration/s02-c.mp3",
        dialogues: [
          {
            speaker: "Madrastra",
            text: "Entonces, ¿nos morimos de hambre los cuatro?",
          },
        ],
      },
    ],
  },

  // 03 — PIEDRECITAS (noche de luna — brillo mágico azul)
  {
    id: "s03",
    index: 2,
    title: "Piedrecitas de luna",
    frames: [
      {
        imageSrc: "/story/hg/s03-a.webp",
        videoSrc: "/story/hg/s03-a.webm",
        effects: {
          lightColor: "#4a90e2",
          lightIntensity: 0.3,
          particleType: "snow",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/night-crickets.mp3", volume: 0.2 },
        narrationSrc: "/narration/s03-a.mp3",
        dialogues: [
          { text: "Pero los niños no podían dormirse. Lo habían oído todo. Gretel lloraba en silencio, pero Hänsel tuvo una idea." },
        ],
      },
      {
        imageSrc: "/story/hg/s03-b.webp",
        videoSrc: "/story/hg/s03-b.webm",
        effects: {
          lightColor: "#6ab0ff",
          lightIntensity: 0.4,
          particleType: "snow",
          parallaxIntensity: 0.6,
        },
        audio: { soundFx: "/sounds/night-crickets.mp3", volume: 0.15 },
        narrationSrc: "/narration/s03-b.mp3",
        dialogues: [
          {
            text: "Hänsel se escabulló fuera de la casa. Era noche de luna llena y las piedrecitas blancas del suelo brillaban como si fueran de plata. Recogió cuantas le cabían en los bolsillos.",
          },
        ],
        hotspots: [
          {
            id: "moon",
            top: "5%",
            left: "68%",
            size: "16%",
            glowColor: "rgba(180, 210, 255, 0.5)",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s03-c.webp",
        effects: {
          lightColor: "#4a90e2",
          lightIntensity: 0.35,
          particleType: "snow",
          parallaxIntensity: 0.5,
        },
        audio: {
          soundFx: "/sounds/magic-sparkle.mp3",
          volume: 0.2,
          delay: 400,
        },
        narrationSrc: "/narration/s03-c.mp3",
        dialogues: [
          {
            speaker: "Hänsel",
            text: "Tranquilízate, hermana, y vete a dormir.",
          },
          { speaker: "Hänsel", text: "Dios no nos abandonará." },
        ],
      },
    ],
  },

  // 04 — ABANDONO 1 + HOGUERA (bosque verde oscuro → fuego naranja)
  {
    id: "s04",
    index: 3,
    title: "La hoguera",
    frames: [
      {
        imageSrc: "/story/hg/s04-a.webp",
        effects: {
          lightColor: "#2d5016",
          lightIntensity: 0.25,
          particleType: "leaves",
          parallaxIntensity: 0.4,
        },
        narrationSrc: "/narration/s04-a.mp3",
        dialogues: [
          { text: "Al amanecer, la madrastra los despertó y emprendieron la marcha hacia el bosque. Hänsel se detenía cada poco para dejar caer una piedrecita blanca en el camino." },
        ],
      },
      {
        imageSrc: "/story/hg/s04-b.webp",
        effects: {
          lightColor: "#ff6b00",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.2 },
        narrationSrc: "/narration/s04-b.mp3",
        dialogues: [
          {
            speaker: "Madrastra",
            text: "Tumbaos junto al fuego. Vuestro padre y yo vamos a cortar leña... Cuando terminemos, vendremos a buscaros.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s04-c.webp",
        videoSrc: "/story/hg/s04-c.webm",
        effects: {
          lightColor: "#ff8c33",
          lightIntensity: 0.35,
          particleType: "sparks",
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.18 },
        narrationSrc: "/narration/s04-c.mp3",
        dialogues: [
          {
            text: "Hänsel y Gretel esperaron junto al fuego. Oían los golpes del hacha, pero en realidad era solo una rama que golpeaba contra un tronco. Poco a poco se quedaron dormidos.",
          },
        ],
      },
    ],
  },

  // 05 — CAMINO DE PIEDRECITAS + REGRESO (noche mágica → amanecer)
  {
    id: "s05",
    index: 4,
    title: "El camino de vuelta",
    frames: [
      {
        imageSrc: "/story/hg/s05-a.webp",
        effects: {
          lightColor: "#4a90e2",
          lightIntensity: 0.3,
          particleType: "snow",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/night-crickets.mp3", volume: 0.15 },
        narrationSrc: "/narration/s05-a.mp3",
        dialogues: [
          {
            speaker: "Hänsel",
            text: "Espera a que la luna esté en lo alto y encontraremos el camino.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s05-b.webp",
        effects: {
          lightColor: "#c0d8ff",
          lightIntensity: 0.45,
          particleType: "snow",
          parallaxIntensity: 0.6,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.2 },
        narrationSrc: "/narration/s05-b.mp3",
        sparkles: [
          // Luna
          { top: "14%", left: "40%", size: 6, color: "rgba(200, 220, 255, 0.6)", delay: 0, type: "moon" },
          // Piedrecitas — de abajo (pies de los niños) hacia arriba por el camino
          // Zona baja del camino (cerca de los niños, ~55% left)
          { top: "75%", left: "52%", size: 3, color: "rgba(210, 230, 255, 0.7)", delay: 0.2 },
          { top: "73%", left: "48%", size: 2.5, color: "rgba(200, 220, 255, 0.6)", delay: 1.1 },
          { top: "71%", left: "55%", size: 2, color: "rgba(220, 235, 255, 0.7)", delay: 0.7 },
          // Zona media-baja (curva hacia la izquierda, ~45-50% left)
          { top: "67%", left: "46%", size: 3, color: "rgba(210, 230, 255, 0.65)", delay: 1.8 },
          { top: "65%", left: "50%", size: 2.5, color: "rgba(200, 220, 255, 0.6)", delay: 0.4 },
          { top: "62%", left: "44%", size: 2, color: "rgba(220, 235, 255, 0.7)", delay: 1.4 },
          // Zona media (centro del camino, ~40-45% left)
          { top: "58%", left: "42%", size: 3, color: "rgba(210, 230, 255, 0.7)", delay: 2.2 },
          { top: "55%", left: "45%", size: 2.5, color: "rgba(200, 215, 255, 0.55)", delay: 0.9 },
          { top: "52%", left: "40%", size: 2, color: "rgba(220, 235, 255, 0.65)", delay: 1.6 },
          // Zona alta del camino (se aleja, ~35-40% left)
          { top: "48%", left: "38%", size: 2.5, color: "rgba(210, 230, 255, 0.6)", delay: 0.3 },
          { top: "45%", left: "41%", size: 2, color: "rgba(200, 220, 255, 0.55)", delay: 2.0 },
          { top: "42%", left: "37%", size: 2.5, color: "rgba(220, 235, 255, 0.7)", delay: 0.6 },
          { top: "39%", left: "39%", size: 2, color: "rgba(200, 215, 255, 0.5)", delay: 1.3 },
        ],
        dialogues: [
          {
            text: "Cuando salió la luna, las piedrecitas de Hänsel brillaron como monedas de plata, señalando el camino de vuelta. Caminaron durante toda la noche siguiendo aquel rastro luminoso.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s05-c.webp",
        videoSrc: "/story/hg/s05-c.webm",
        effects: {
          lightColor: "#ffcc66",
          lightIntensity: 0.25,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/forest-birds.mp3", volume: 0.18 },
        narrationSrc: "/narration/s05-c.mp3",
        dialogues: [
          { text: "Al amanecer, la casa apareció al fin entre los árboles. El padre se alegró muchísimo de verlos, pues su conciencia no le había dejado dormir ni un solo instante." },
        ],
      },
    ],
  },

  // 06 — PLAN 2 + MIGAS (interior noche → bosque día)
  {
    id: "s06",
    index: 5,
    title: "Más lejos que nunca",
    frames: [
      {
        imageSrc: "/story/hg/s06-a.webp",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.2,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/sad-wind.mp3", volume: 0.15 },
        narrationSrc: "/narration/s06-a.mp3",
        dialogues: [
          { text: "Pero los tiempos de escasez no habían pasado. Una noche, los niños volvieron a oír desde la cama la misma conversación de siempre." },
        ],
      },
      {
        imageSrc: "/story/hg/s06-b.webp",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.25,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/tension.mp3", volume: 0.15 },
        narrationSrc: "/narration/s06-b.mp3",
        dialogues: [
          {
            text: "Hänsel se levantó para recoger piedrecitas… pero la puerta estaba cerrada con llave.",
          },
          {
            speaker: "Hänsel",
            text: "No llores, Gretel. Seguro que Dios nos ayuda.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s06-c.webp",
        effects: {
          lightColor: "#2d5016",
          lightIntensity: 0.2,
          particleType: "leaves",
          parallaxIntensity: 0.4,
        },
        narrationSrc: "/narration/s06-c.mp3",
        dialogues: [
          {
            text: "A la mañana siguiente les dieron un trozo de pan aún más pequeño que la vez anterior. En el camino hacia el bosque, Hänsel fue desmigajándolo a escondidas y dejando las migajas en el suelo.",
          },
        ],
      },
    ],
  },

  // 07 — MIGAS DESAPARECEN (PÁJAROS) + PERDIDOS (bosque oscuro)
  {
    id: "s07",
    index: 6,
    title: "Sin rastro",
    frames: [
      {
        imageSrc: "/story/hg/s07-a.webp",
        effects: {
          lightColor: "#4a90e2",
          lightIntensity: 0.2,
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/night-crickets.mp3", volume: 0.15 },
        narrationSrc: "/narration/s07-a.mp3",
        dialogues: [
          { text: "Cuando salió la luna y Hänsel buscó las migas, habían desaparecido. Miles de pájaros del bosque se las habían comido todas." },
        ],
      },
      {
        imageSrc: "/story/hg/s07-b.webp",
        effects: {
          lightColor: "#2d3a1a",
          lightIntensity: 0.2,
          particleType: "rain",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/rain.mp3", volume: 0.2 },
        narrationSrc: "/narration/s07-b.mp3",
        dialogues: [
          {
            text: "Anduvieron durante toda la noche y todo el día siguiente sin encontrar un camino para salir de aquel bosque interminable. Solo encontraban raíces y bayas para comer.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s07-c.webp",
        videoSrc: "/story/hg/s07-c.webm",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.25,
          particleType: "rain",
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/rain.mp3", volume: 0.18 },
        narrationSrc: "/narration/s07-c.mp3",
        dialogues: [
          {
            text: "Al final del tercer día, sus piernas se negaban a sostenerlos. Se tumbaron debajo de un árbol y se durmieron, exhaustos y sin esperanza.",
          },
        ],
      },
    ],
  },

  // 08 — PÁJARO BLANCO + CASA DE PAN (mágico → dulce/cálido)
  {
    id: "s08",
    index: 7,
    title: "La casa imposible",
    frames: [
      {
        imageSrc: "/story/hg/s08-a.webp",
        effects: {
          lightColor: "#c0d8ff",
          lightIntensity: 0.3,
          particleType: "snow",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/forest-birds.mp3", volume: 0.2 },
        narrationSrc: "/narration/s08-a.mp3",
        dialogues: [
          { text: "Al amanecer, un precioso pájaro blanco como la nieve se posó en una rama cercana. Su canto era tan dulce y hermoso que los niños se detuvieron a escucharlo, hipnotizados." },
        ],
      },
      {
        imageSrc: "/story/hg/s08-b.webp",
        effects: {
          lightColor: "#ff9944",
          lightIntensity: 0.35,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.2 },
        narrationSrc: "/narration/s08-b.mp3",
        dialogues: [
          { text: "Cuando terminó de cantar, el pájaro levantó el vuelo. Los niños lo siguieron sin dudar, como si algo les dijera que debían confiar en él." },
        ],
      },
      {
        imageSrc: "/story/hg/s08-c.webp",
        effects: {
          lightColor: "#ff6b00",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.18 },
        narrationSrc: "/narration/s08-c.mp3",
        dialogues: [
          {
            text: "¡La casa estaba hecha de pan y cubierta de pasteles!",
          },
          { speaker: "Hänsel", text: "¡Yo comeré del tejado!" },
          {
            speaker: "Gretel",
            text: "¡Y yo probaré la ventana de azúcar!",
          },
        ],
      },
    ],
  },

  // 09 — LA BRUJA ATRAPA (siniestro, verde/rojo)
  {
    id: "s09",
    index: 8,
    title: "La bruja",
    frames: [
      {
        imageSrc: "/story/hg/s09-a.webp",
        effects: {
          lightColor: "#44cc44",
          lightIntensity: 0.25,
          parallaxIntensity: 0.4,
          blur: 0.5,
        },
        audio: { soundFx: "/sounds/tension.mp3", volume: 0.2 },
        narrationSrc: "/narration/s09-a.mp3",
        dialogues: [
          {
            text: "Se abrió la puerta y apareció una anciana apoyada en un bastón.",
          },
          {
            speaker: "Bruja",
            text: "¡Oh, qué bien, unos niños! Pasad, no tengáis miedo.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s09-b.webp",
        effects: {
          lightColor: "#44cc44",
          lightIntensity: 0.3,
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.15, delay: 300 },
        narrationSrc: "/narration/s09-b.mp3",
        dialogues: [
          {
            text: "Pero era una bruja. A Hänsel lo encerró en el establo.",
          },
          {
            speaker: "Bruja",
            text: "¡Saca un dedo, que vea si engordas!",
          },
          { text: "Pero Hänsel siempre sacaba un hueso." },
        ],
      },
      {
        imageSrc: "/story/hg/s09-c.webp",
        effects: {
          lightColor: "#cc2222",
          lightIntensity: 0.35,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/tension.mp3", volume: 0.2 },
        narrationSrc: "/narration/s09-c.mp3",
        dialogues: [
          {
            speaker: "Bruja",
            text: "Métete dentro y mira si el horno está caliente.",
          },
          { text: "Gretel se percató de sus intenciones." },
        ],
      },
    ],
  },

  // 10 — HORNO + TESORO (fuego → oro) — SECCIÓN INTERACTIVA
  {
    id: "s10",
    index: 9,
    title: "¡Ahora!",
    frames: [
      {
        imageSrc: "/story/hg/s10-a.webp",
        effects: {
          lightColor: "#ff4400",
          lightIntensity: 0.5,
          particleType: "sparks",
          parallaxIntensity: 0.6,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.25 },
        narrationSrc: "/narration/s10-a.mp3",
        dialogues: [
          { speaker: "Gretel", text: "¿Cómo entro?" },
          {
            speaker: "Bruja",
            text: "¡Estúpida! Mira, hasta yo cabría.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s10-b.webp",
        videoSrc: "/story/hg/s10-b.webm",
        effects: {
          lightColor: "#ffcc00",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/fire-oven.mp3", volume: 0.25 },
        narrationSrc: "/narration/s10-b.mp3",
        dialogues: [
          {
            text: "En ese instante, Gretel la empujó con todas sus fuerzas dentro del horno y cerró la puerta de hierro. Después corrió al establo y liberó a su hermano.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s10-c.webp",
        effects: {
          lightColor: "#88ccff",
          lightIntensity: 0.3,
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/forest-birds.mp3", volume: 0.2 },
        narrationSrc: "/narration/s10-c.mp3",
        dialogues: [
          {
            speaker: "Gretel",
            text: "¡Hänsel, somos libres! ¡La bruja ha muerto!",
          },
          {
            text: "En cada rincón encontraron cajas de perlas y piedras preciosas.",
          },
          {
            speaker: "Hänsel",
            text: "Son más bonitas que las piedras blancas.",
          },
        ],
      },
    ],
  },

  // 11 — DE VUELTA A CASA (luz cálida → final feliz)
  {
    id: "s11",
    index: 10,
    title: "De vuelta a casa",
    frames: [
      {
        imageSrc: "/story/hg/s11-a.webp",
        effects: {
          lightColor: "#ff4400",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.2 },
        narrationSrc: "/narration/s11-a.mp3",
        dialogues: [
          {
            speaker: "Hänsel",
            text: "¡Vámonos! Alejémonos del bosque de las brujas.",
          },
          { text: "Corrieron sin mirar atrás mientras la casa ardía." },
        ],
      },
      {
        imageSrc: "/story/hg/s11-b.webp",
        effects: {
          lightColor: "#ffcc66",
          lightIntensity: 0.35,
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/forest-birds.mp3", volume: 0.2 },
        narrationSrc: "/narration/s11-b.mp3",
        dialogues: [
          { text: "Un gran lago les cortó el paso... cruzaron el lago sobre el lomo de un gran pato." },
          {
            speaker: "Gretel",
            text: "Mi señor don pato, ¿nos podría llevar?",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s11-c.webp",
        effects: {
          lightColor: "#ffaa33",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.2 },
        narrationSrc: "/narration/s11-c.mp3",
        dialogues: [
          {
            text: "Gretel sacudió su delantal y las perlas rodaron por el suelo. Terminaron sus penurias y pudieron vivir felices para siempre.",
          },
        ],
      },
    ],
  },
];
