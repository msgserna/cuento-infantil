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
        imageSrc: "/story/hg/s01-cover.png",
        videoSrc: "/story/hg/portada.mp4",
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
        imageSrc: "/story/hg/s02-a.png",
        videoSrc: "/story/hg/s02-a.mp4",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.15,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/sad-wind.mp3", volume: 0.3 },
        narrationSrc: "/narration/s02-a.mp3",
        dialogues: [
          {
            text: "Había una vez un leñador muy pobre que vivía junto a un enorme bosque con su esposa y sus dos hijos.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s02-b.png",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.2,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/sad-wind.mp3", volume: 0.25 },
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
        imageSrc: "/story/hg/s02-c.png",
        videoSrc: "/story/hg/s02-c.mp4",
        effects: {
          lightColor: "#2a1a1a",
          lightIntensity: 0.2,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/tension.mp3", volume: 0.35 },
        narrationSrc: "/narration/s02-c.mp3",
        dialogues: [
          {
            speaker: "Madrastra",
            text: "Entonces, ¿nos morimos de hambre los cuatro?",
          },
          {
            text: "Y no lo dejó tranquilo hasta que consiguió convencerlo.",
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
        imageSrc: "/story/hg/s03-a.png",
        videoSrc: "/story/hg/s03-a.mp4",
        effects: {
          lightColor: "#4a90e2",
          lightIntensity: 0.3,
          particleType: "snow",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/night-crickets.mp3", volume: 0.4 },
        narrationSrc: "/narration/s03-a.mp3",
        dialogues: [
          { text: "Los niños no podían dormirse. Lo habían oído todo." },
          { text: "Gretel lloraba en silencio." },
        ],
      },
      {
        imageSrc: "/story/hg/s03-b.png",
        videoSrc: "/story/hg/s03-b.mp4",
        effects: {
          lightColor: "#6ab0ff",
          lightIntensity: 0.4,
          particleType: "snow",
          parallaxIntensity: 0.6,
        },
        audio: { soundFx: "/sounds/night-crickets.mp3", volume: 0.35 },
        narrationSrc: "/narration/s03-b.mp3",
        dialogues: [
          {
            text: "Era noche de luna llena. Las piedrecitas brillaban como si fueran de plata.",
          },
          {
            text: "Hänsel se agachó y cogió cuantas le cabían en los bolsillos.",
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
        imageSrc: "/story/hg/s03-c.png",
        effects: {
          lightColor: "#4a90e2",
          lightIntensity: 0.35,
          particleType: "snow",
          parallaxIntensity: 0.5,
        },
        audio: {
          soundFx: "/sounds/magic-sparkle.mp3",
          volume: 0.5,
          delay: 400,
        },
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
        imageSrc: "/story/hg/s04-a.png",
        effects: {
          lightColor: "#2d5016",
          lightIntensity: 0.25,
          particleType: "leaves",
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/forest-wind.mp3", volume: 0.4 },
        narrationSrc: "/narration/s04-a.mp3",
        dialogues: [
          { text: "Al amanecer emprendieron la marcha." },
          {
            text: "Hänsel se detenía cada poco… para dejar caer una piedrecita blanca.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s04-b.png",
        effects: {
          lightColor: "#ff6b00",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.5 },
        dialogues: [
          {
            speaker: "Madrastra",
            text: "Tumbaos junto al fuego. Vuestro padre y yo vamos a cortar leña... Cuando terminemos, vendremos a buscaros.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s04-c.png",
        videoSrc: "/story/hg/s04-c.mp4",
        effects: {
          lightColor: "#ff8c33",
          lightIntensity: 0.35,
          particleType: "sparks",
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.4 },
        narrationSrc: "/narration/s04-c.mp3",
        dialogues: [
          {
            text: "Oían los golpes del hacha… pero era solo una rama golpeando al viento.",
          },
          { text: "Se quedaron dormidos." },
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
        imageSrc: "/story/hg/s05-a.png",
        effects: {
          lightColor: "#4a90e2",
          lightIntensity: 0.3,
          particleType: "snow",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/night-crickets.mp3", volume: 0.35 },
        narrationSrc: "/narration/s05-a.mp3",
        dialogues: [
          { text: "Cuando despertaron era noche cerrada." },
          {
            speaker: "Hänsel",
            text: "Espera a que la luna esté en lo alto y encontraremos el camino.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s05-b.png",
        effects: {
          lightColor: "#c0d8ff",
          lightIntensity: 0.45,
          particleType: "snow",
          parallaxIntensity: 0.6,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.5 },
        narrationSrc: "/narration/s05-b.mp3",
        dialogues: [
          {
            text: "Las piedrecitas brillaban bajo la luna, señalando el camino de vuelta.",
          },
          { text: "Caminaron durante toda la noche." },
        ],
      },
      {
        imageSrc: "/story/hg/s05-c.png",
        videoSrc: "/story/hg/s05-c.mp4",
        effects: {
          lightColor: "#ffcc66",
          lightIntensity: 0.25,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/forest-birds.mp3", volume: 0.4 },
        narrationSrc: "/narration/s05-c.mp3",
        dialogues: [
          { text: "Al amanecer, la casa apareció al fin." },
          {
            text: "El leñador se alegró muchísimo de verlos. Su conciencia no le había dejado dormir.",
          },
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
        imageSrc: "/story/hg/s06-a.png",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.2,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/sad-wind.mp3", volume: 0.3 },
        narrationSrc: "/narration/s06-a.mp3",
        dialogues: [
          { text: "Pero los tiempos de escasez no habían pasado." },
          {
            text: "Desde su cama, los niños volvieron a oír la misma conversación.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s06-b.png",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.25,
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/tension.mp3", volume: 0.3 },
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
        imageSrc: "/story/hg/s06-c.png",
        effects: {
          lightColor: "#2d5016",
          lightIntensity: 0.2,
          particleType: "leaves",
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/forest-wind.mp3", volume: 0.35 },
        narrationSrc: "/narration/s06-c.mp3",
        dialogues: [
          {
            text: "Recibieron un trozo de pan, más pequeño que la vez anterior.",
          },
          { text: "En el camino, Hänsel lo desmigajó a escondidas." },
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
        imageSrc: "/story/hg/s07-a.png",
        effects: {
          lightColor: "#4a90e2",
          lightIntensity: 0.2,
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/night-crickets.mp3", volume: 0.3 },
        narrationSrc: "/narration/s07-a.mp3",
        dialogues: [
          { text: "Cuando salió la luna… las migas habían desaparecido." },
          {
            text: "Los pájaros del bosque se las habían comido todas.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s07-b.png",
        effects: {
          lightColor: "#2d3a1a",
          lightIntensity: 0.2,
          particleType: "rain",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/rain.mp3", volume: 0.5 },
        narrationSrc: "/narration/s07-b.mp3",
        dialogues: [
          {
            text: "Anduvieron durante toda la noche y todo el día siguiente.",
          },
          {
            text: "No pudieron encontrar un camino para salir del bosque.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s07-c.png",
        videoSrc: "/story/hg/s07-c.mp4",
        effects: {
          lightColor: "#1a1a2e",
          lightIntensity: 0.25,
          particleType: "rain",
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/rain.mp3", volume: 0.45 },
        narrationSrc: "/narration/s07-c.mp3",
        dialogues: [
          {
            text: "Al final del día, sus piernas se negaban a sostenerlos.",
          },
          { text: "Se tumbaron debajo de un árbol y se durmieron." },
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
        imageSrc: "/story/hg/s08-a.png",
        effects: {
          lightColor: "#c0d8ff",
          lightIntensity: 0.3,
          particleType: "snow",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/forest-birds.mp3", volume: 0.45 },
        narrationSrc: "/narration/s08-a.mp3",
        dialogues: [
          { text: "Un precioso pájaro blanco se posó en una rama." },
          {
            text: "Su canto era tan dulce que se detuvieron a escucharlo.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s08-b.png",
        effects: {
          lightColor: "#ff9944",
          lightIntensity: 0.35,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.5 },
        narrationSrc: "/narration/s08-b.mp3",
        dialogues: [
          { text: "Cuando terminó de cantar, levantó el vuelo." },
          { text: "Los niños lo siguieron sin dudar." },
        ],
      },
      {
        imageSrc: "/story/hg/s08-c.png",
        effects: {
          lightColor: "#ff6b00",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.4 },
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
        imageSrc: "/story/hg/s09-a.png",
        effects: {
          lightColor: "#44cc44",
          lightIntensity: 0.25,
          parallaxIntensity: 0.4,
          blur: 0.5,
        },
        audio: { soundFx: "/sounds/tension.mp3", volume: 0.45 },
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
        imageSrc: "/story/hg/s09-b.png",
        effects: {
          lightColor: "#44cc44",
          lightIntensity: 0.3,
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.35, delay: 300 },
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
        imageSrc: "/story/hg/s09-c.png",
        effects: {
          lightColor: "#cc2222",
          lightIntensity: 0.35,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/tension.mp3", volume: 0.5 },
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
        imageSrc: "/story/hg/s10-a.png",
        effects: {
          lightColor: "#ff4400",
          lightIntensity: 0.5,
          particleType: "sparks",
          parallaxIntensity: 0.6,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.6 },
        dialogues: [
          { speaker: "Gretel", text: "¿Cómo entro?" },
          {
            speaker: "Bruja",
            text: "¡Estúpida! Mira, hasta yo cabría.",
          },
        ],
      },
      {
        imageSrc: "/story/hg/s10-b.png",
        videoSrc: "/story/hg/s10-b.mp4",
        effects: {
          lightColor: "#ffcc00",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.5 },
        narrationSrc: "/narration/s10-b.mp3",
        dialogues: [
          {
            text: "Gretel cerró la puerta de hierro y corrió el cerrojo.",
          },
          { text: "Salió corriendo a buscar a su hermano." },
        ],
      },
      {
        imageSrc: "/story/hg/s10-c.png",
        effects: {
          lightColor: "#88ccff",
          lightIntensity: 0.3,
          parallaxIntensity: 0.4,
        },
        audio: { soundFx: "/sounds/forest-birds.mp3", volume: 0.45 },
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
        imageSrc: "/story/hg/s11-a.png",
        effects: {
          lightColor: "#ff4400",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/fire-crackle.mp3", volume: 0.5 },
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
        imageSrc: "/story/hg/s11-b.png",
        effects: {
          lightColor: "#ffcc66",
          lightIntensity: 0.35,
          parallaxIntensity: 0.5,
        },
        audio: { soundFx: "/sounds/forest-birds.mp3", volume: 0.45 },
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
        imageSrc: "/story/hg/s11-c.png",
        effects: {
          lightColor: "#ffaa33",
          lightIntensity: 0.4,
          particleType: "sparks",
          parallaxIntensity: 0.3,
        },
        audio: { soundFx: "/sounds/magic-sparkle.mp3", volume: 0.5 },
        narrationSrc: "/narration/s11-c.mp3",
        dialogues: [
          {
            text: "Gretel sacudió su delantal y las perlas rodaron por la estancia.",
          },
          {
            text: "Terminaron sus penurias y pudieron vivir felices para siempre.",
          },
        ],
      },
    ],
  },
];
