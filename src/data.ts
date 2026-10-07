export interface CelestialBody {
  id: string;
  name: string;
  nameRu: string;
  type: 'star' | 'planet' | 'dwarf_planet' | 'moon' | 'asteroid_belt' | 'comet';
  radius: number;
  orbitRadius: number;
  realRadius: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  color: string;
  gradient: string;
  speed: number;
  description: string;
  facts: string[];
  hasRing?: boolean;
  moons?: number;
  temperature?: string;
  gravity?: string;
  atmosphere?: string;
  initialAngle?: number;
  parentPlanet?: string;
  moonOrbitRadius?: number;
  moonSpeed?: number;
}

export const planets: CelestialBody[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameRu: 'Меркурий',
    type: 'planet',
    radius: 4,
    orbitRadius: 65,
    realRadius: '2 439 км',
    distanceFromSun: '57,9 млн км',
    orbitalPeriod: '88 дней',
    color: '#b5b5b5',
    gradient: 'radial-gradient(circle at 30% 30%, #d4d4d4, #8a8a8a, #5c5c5c)',
    speed: 4.15,
    description: 'Самая маленькая и ближайшая к Солнцу планета. Поверхность покрыта кратерами, похожа на Луну.',
    facts: [
      'Год на Меркурии длится 88 земных дней',
      'Температура от -180°C ночью до +430°C днём',
      'Нет атмосферы и спутников',
      'Самые большие перепады температур в Солнечной системе'
    ],
    moons: 0,
    temperature: 'от -180°C до +430°C',
    gravity: '3,7 м/с²',
    atmosphere: 'Практически отсутствует'
  },
  {
    id: 'venus',
    name: 'Venus',
    nameRu: 'Венера',
    type: 'planet',
    radius: 7,
    orbitRadius: 100,
    realRadius: '6 052 км',
    distanceFromSun: '108,2 млн км',
    orbitalPeriod: '225 дней',
    color: '#e8c56d',
    gradient: 'radial-gradient(circle at 30% 30%, #f5dfa0, #e8c56d, #c4943d)',
    speed: 1.62,
    description: 'Вторая планета от Солнца. Самая горячая планета из-за мощного парникового эффекта.',
    facts: [
      'Вращается в обратном направлении (ретроградно)',
      'День на Венере длиннее её года',
      'Давление на поверхности в 90 раз больше земного',
      'Облака из серной кислоты'
    ],
    moons: 0,
    temperature: '~465°C (постоянно)',
    gravity: '8,87 м/с²',
    atmosphere: 'CO₂ (96.5%), очень плотная'
  },
  {
    id: 'earth',
    name: 'Earth',
    nameRu: 'Земля',
    type: 'planet',
    radius: 8,
    orbitRadius: 140,
    realRadius: '6 371 км',
    distanceFromSun: '149,6 млн км',
    orbitalPeriod: '365,25 дней',
    color: '#4da6ff',
    gradient: 'radial-gradient(circle at 30% 30%, #7ec8e3, #4da6ff, #2d8a4e, #1a5276)',
    speed: 1.0,
    description: 'Наш дом! Единственная известная планета с жизнью. 71% поверхности покрыт водой.',
    facts: [
      'Единственная планета с жидкой водой на поверхности',
      'Магнитное поле защищает от солнечного ветра',
      'Возраст: ~4,54 миллиарда лет',
      'Атмосфера: 78% азот, 21% кислород'
    ],
    moons: 1,
    temperature: 'от -89°C до +57°C',
    gravity: '9,81 м/с²',
    atmosphere: 'N₂ (78%), O₂ (21%)'
  },
  {
    id: 'mars',
    name: 'Mars',
    nameRu: 'Марс',
    type: 'planet',
    radius: 6,
    orbitRadius: 180,
    realRadius: '3 390 км',
    distanceFromSun: '227,9 млн км',
    orbitalPeriod: '687 дней',
    color: '#e07040',
    gradient: 'radial-gradient(circle at 30% 30%, #f09070, #e07040, #a04020)',
    speed: 0.53,
    description: 'Красная планета. Имеет самую высокую гору в Солнечной системе — Олимп (21,9 км).',
    facts: [
      'Гора Олимп — высочайший вулкан (21,9 км)',
      'Каньон Маринер длиной 4000 км',
      'Есть полярные ледяные шапки',
      'Главный кандидат для колонизации'
    ],
    moons: 2,
    temperature: 'от -140°C до +20°C',
    gravity: '3,72 м/с²',
    atmosphere: 'CO₂ (95%), очень разреженная'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameRu: 'Юпитер',
    type: 'planet',
    radius: 20,
    orbitRadius: 250,
    realRadius: '69 911 км',
    distanceFromSun: '778,5 млн км',
    orbitalPeriod: '11,86 лет',
    color: '#d4a574',
    gradient: 'radial-gradient(circle at 30% 30%, #f0d0a0, #d4a574, #c08050, #8b5e3c)',
    speed: 0.084,
    description: 'Самая большая планета. Масса в 2,5 раза больше всех остальных планет вместе взятых.',
    facts: [
      'Большое Красное Пятно — шторм, бушующий 350+ лет',
      'Имеет 95 известных спутников',
      'Мог бы вместить 1300 Земель',
      'Самые короткие сутки — 9 ч 55 мин'
    ],
    moons: 95,
    temperature: '~-110°C (верхние облака)',
    gravity: '24,79 м/с²',
    atmosphere: 'H₂ (90%), He (10%)'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameRu: 'Сатурн',
    type: 'planet',
    radius: 17,
    orbitRadius: 320,
    realRadius: '58 232 км',
    distanceFromSun: '1 434 млн км',
    orbitalPeriod: '29,46 лет',
    color: '#e8d088',
    gradient: 'radial-gradient(circle at 30% 30%, #f5e8b0, #e8d088, #c4a858, #a08838)',
    speed: 0.034,
    description: 'Знаменита своими великолепными кольцами из льда и камней. Плотность меньше воды!',
    facts: [
      'Кольца шириной 282 000 км, но толщиной ~10 м',
      'Плотность меньше воды — мог бы плавать!',
      'Спутник Титан имеет плотную атмосферу',
      'Имеет 146 известных спутников'
    ],
    moons: 146,
    hasRing: true,
    temperature: '~-178°C',
    gravity: '10,44 м/с²',
    atmosphere: 'H₂ (96%), He (3%)'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameRu: 'Уран',
    type: 'planet',
    radius: 12,
    orbitRadius: 385,
    realRadius: '25 362 км',
    distanceFromSun: '2 871 млн км',
    orbitalPeriod: '84,01 лет',
    color: '#7de8e8',
    gradient: 'radial-gradient(circle at 30% 30%, #a0f5f5, #7de8e8, #50b8c8, #3090a0)',
    speed: 0.012,
    description: 'Ледяной гигант, вращающийся «на боку». Ось наклонена на 98° от плоскости орбиты.',
    facts: [
      'Ось вращения наклонена на 98°',
      'Самая холодная атмосфера: до -224°C',
      'Имеет 13 тусклых колец',
      'Открыт Уильямом Гершелем в 1781 году'
    ],
    moons: 28,
    temperature: 'до -224°C',
    gravity: '8,87 м/с²',
    atmosphere: 'H₂ (83%), He (15%), CH₄ (2%)'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameRu: 'Нептун',
    type: 'planet',
    radius: 11,
    orbitRadius: 440,
    realRadius: '24 622 км',
    distanceFromSun: '4 495 млн км',
    orbitalPeriod: '164,8 лет',
    color: '#4060ff',
    gradient: 'radial-gradient(circle at 30% 30%, #7090ff, #4060ff, #2040cc, #1020a0)',
    speed: 0.006,
    description: 'Самая дальняя планета. Ветры достигают 2 100 км/ч — самые сильные в Солнечной системе.',
    facts: [
      'Ветры до 2 100 км/ч — рекорд Солнечной системы',
      'Открыт математически, до наблюдения в телескоп',
      'Имеет 16 известных спутников',
      'Совершил один полный оборот в 2011 году'
    ],
    moons: 16,
    temperature: '~-218°C',
    gravity: '11,15 м/с²',
    atmosphere: 'H₂ (80%), He (19%), CH₄ (1%)'
  },
  // Карликовые планеты
  {
    id: 'pluto',
    name: 'Pluto',
    nameRu: 'Плутон',
    type: 'dwarf_planet',
    radius: 3,
    orbitRadius: 500,
    realRadius: '1 188 км',
    distanceFromSun: '5 906 млн км',
    orbitalPeriod: '248 лет',
    color: '#c4a882',
    gradient: 'radial-gradient(circle at 30% 30%, #e0c8a8, #c4a882, #8a7060)',
    speed: 0.004,
    description: 'Карликовая планета в поясе Койпера. Была девятой планетой до 2006 года.',
    facts: [
      'Переклассифицирован в карликовую планету в 2006',
      'Имеет сердце из азотного льда',
      'Большой спутник Харон почти такого же размера',
      'Орбита сильно вытянута и наклонена'
    ],
    moons: 5,
    temperature: '~-230°C',
    gravity: '0,62 м/с²',
    atmosphere: 'Очень разреженная (N₂, CH₄, CO)'
  },
  {
    id: 'ceres',
    name: 'Ceres',
    nameRu: 'Церера',
    type: 'dwarf_planet',
    radius: 2.5,
    orbitRadius: 215,
    realRadius: '473 км',
    distanceFromSun: '414 млн км',
    orbitalPeriod: '4,6 лет',
    color: '#8a8a7a',
    gradient: 'radial-gradient(circle at 30% 30%, #a8a898, #8a8a7a, #606058)',
    speed: 0.22,
    description: 'Крупнейший объект в поясе астероидов. Единственная карликовая планета внутри орбиты Нептуна.',
    facts: [
      'Содержит значительное количество водяного льда',
      'Обнаружены яркие пятна на поверхности',
      'Первый открытый астероид (1801 год)',
      'Зонд Dawn исследовал Цереру в 2015 году'
    ],
    moons: 0,
    temperature: '~-105°C',
    gravity: '0,28 м/с²',
    atmosphere: 'Практически отсутствует'
  }
];

export interface StarSystem {
  id: string;
  name: string;
  nameRu: string;
  distance: string;
  type: string;
  color: string;
  size: number;
  description: string;
  x: number;
  y: number;
}

export const nearbyStars: StarSystem[] = [
  { id: 'sun', name: 'Sun', nameRu: 'Солнце', distance: '0', type: 'Жёлтый карлик (G2V)', color: '#FFD700', size: 8, description: 'Наша звезда. Возраст ~4,6 млрд лет. Содержит 99,86% массы Солнечной системы.', x: 0, y: 0 },
  { id: 'alpha-centauri', name: 'Alpha Centauri', nameRu: 'Альфа Центавра', distance: '4,37 св. лет', type: 'Тройная система', color: '#FFE4B5', size: 6, description: 'Ближайшая звёздная система. Проксима Центавра имеет подтверждённые экзопланеты.', x: 120, y: -60 },
  { id: 'barnard', name: 'Barnard\'s Star', nameRu: 'Звезда Барнарда', distance: '5,96 св. лет', type: 'Красный карлик', color: '#FF6347', size: 3, description: 'Одна из ближайших звёзд. Красный карлик с высоким собственным движением.', x: -90, y: 80 },
  { id: 'sirius', name: 'Sirius', nameRu: 'Сириус', distance: '8,6 св. лет', type: 'Двойная система (A1V + DA2)', color: '#ADD8E6', size: 9, description: 'Ярчайшая звезда ночного неба. В 25 раз ярче Солнца.', x: 180, y: 100 },
  { id: 'proxima', name: 'Proxima Centauri', nameRu: 'Проксима Центавра', distance: '4,24 св. лет', type: 'Красный карлик (M5.5Ve)', color: '#FF4500', size: 2, description: 'Ближайшая звезда к Солнцу. Имеет планету в обитаемой зоне.', x: 110, y: -50 },
  { id: 'vega', name: 'Vega', nameRu: 'Вега', distance: '25 св. лет', type: 'Голубая звезда (A0V)', color: '#E0E8FF', size: 8, description: 'Пятая по яркости звезда. Была полярной звездой 12 000 лет до н.э.', x: -200, y: -150 },
  { id: 'betelgeuse', name: 'Betelgeuse', nameRu: 'Бетельгейзе', distance: '700 св. лет', type: 'Красный сверхгигант', color: '#FF4500', size: 14, description: 'Одна из крупнейших видимых звёзд. Взорвётся как сверхновая.', x: 280, y: -200 },
  { id: 'polaris', name: 'Polaris', nameRu: 'Полярная звезда', distance: '433 св. лет', type: 'Жёлтый сверхгигант', color: '#FFFACD', size: 7, description: 'Указывает на север. На самом деле тройная звёздная система.', x: 0, y: -280 },
];

export interface Galaxy {
  id: string;
  name: string;
  nameRu: string;
  distance: string;
  type: string;
  description: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  color1: string;
  color2: string;
}

export const galaxies: Galaxy[] = [
  {
    id: 'milky-way',
    name: 'Milky Way',
    nameRu: 'Млечный Путь',
    distance: 'Наша галактика',
    type: 'Спиральная с перемычкой (SBbc)',
    description: 'Наш дом во Вселенной. Содержит 100-400 миллиардов звёзд. Диаметр ~100 000 световых лет.',
    x: 0, y: 0, size: 180, rotation: 30,
    color1: '#4a3a6a', color2: '#1a1a3a'
  },
  {
    id: 'andromeda',
    name: 'Andromeda (M31)',
    nameRu: 'Андромеда',
    distance: '2,537 млн св. лет',
    type: 'Спиральная (SA(s)b)',
    description: 'Ближайшая крупная галактика. Столкнётся с Млечным Путём через ~4,5 млрд лет. Содержит ~1 триллион звёзд.',
    x: 350, y: -200, size: 120, rotation: -20,
    color1: '#5a4a7a', color2: '#2a1a4a'
  },
  {
    id: 'lmc',
    name: 'Large Magellanic Cloud',
    nameRu: 'Большое Магелланово Облако',
    distance: '163 000 св. лет',
    type: 'Неправильная галактика',
    description: 'Галактика-спутник Млечного Пути. Видна только из южного полушария.',
    x: -280, y: 250, size: 50, rotation: 45,
    color1: '#6a5a8a', color2: '#3a2a5a'
  },
  {
    id: 'triangulum',
    name: 'Triangulum (M33)',
    nameRu: 'Галактика Треугольника',
    distance: '2,73 млн св. лет',
    type: 'Спиральная (SA(s)cd)',
    description: 'Третья по величине галактика Местной группы. Возможно, спутник Андромеды.',
    x: -300, y: -300, size: 70, rotation: 60,
    color1: '#4a5a8a', color2: '#1a2a5a'
  },
];

export interface UniverseFact {
  title: string;
  text: string;
  icon: string;
}

export const universeFacts: UniverseFact[] = [
  { title: 'Возраст Вселенной', text: '~13,8 миллиардов лет', icon: '🕐' },
  { title: 'Наблюдаемая Вселенная', text: '93 млрд световых лет в диаметре', icon: '🔭' },
  { title: 'Галактик', text: 'Более 2 триллионов', icon: '🌌' },
  { title: 'Звёзд', text: '~2×10²³ (больше песчинок на Земле)', icon: '⭐' },
  { title: 'Тёмная энергия', text: '68% Вселенной', icon: '⚡' },
  { title: 'Тёмная материя', text: '27% Вселенной', icon: '🌑' },
  { title: 'Обычная материя', text: 'Всего 5% Вселенной', icon: '🔬' },
  { title: 'Температура реликтового излучения', text: '2,725 K (-270,4°C)', icon: '🌡️' },
];

export const scaleComparison = [
  { name: 'Меркурий', size: 4, color: '#b5b5b5' },
  { name: 'Венера', size: 9, color: '#e8c56d' },
  { name: 'Земля', size: 10, color: '#4da6ff' },
  { name: 'Марс', size: 5, color: '#e07040' },
  { name: 'Юпитер', size: 40, color: '#d4a574' },
  { name: 'Сатурн', size: 34, color: '#e8d088' },
  { name: 'Уран', size: 18, color: '#7de8e8' },
  { name: 'Нептун', size: 17, color: '#4060ff' },
];
