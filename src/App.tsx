import { useState, useEffect, useRef, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  radius: number; // visual radius in px
  orbitRadius: number; // visual orbit radius in px
  realRadius: string; // real radius
  distanceFromSun: string; // distance from sun
  orbitalPeriod: string; // orbital period
  color: string;
  gradient: string;
  speed: number; // orbital speed factor
  description: string;
  hasRing?: boolean;
}

const planets: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 4,
    orbitRadius: 60,
    realRadius: '2 439 км',
    distanceFromSun: '57,9 млн км',
    orbitalPeriod: '88 дней',
    color: '#b5b5b5',
    gradient: 'radial-gradient(circle at 30% 30%, #d4d4d4, #8a8a8a, #5c5c5c)',
    speed: 4.15,
    description: 'Самая маленькая и ближайшая к Солнцу планета. Температура поверхности колеблется от -180°C до 430°C.'
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    radius: 7,
    orbitRadius: 95,
    realRadius: '6 052 км',
    distanceFromSun: '108,2 млн км',
    orbitalPeriod: '225 дней',
    color: '#e8c56d',
    gradient: 'radial-gradient(circle at 30% 30%, #f5dfa0, #e8c56d, #c4943d)',
    speed: 1.62,
    description: 'Вторая планета от Солнца. Самая горячая планета из-за парникового эффекта. Температура до 465°C.'
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    radius: 8,
    orbitRadius: 130,
    realRadius: '6 371 км',
    distanceFromSun: '149,6 млн км',
    orbitalPeriod: '365,25 дней',
    color: '#4da6ff',
    gradient: 'radial-gradient(circle at 30% 30%, #7ec8e3, #4da6ff, #1a6b3c, #2d5aa0)',
    speed: 1.0,
    description: 'Наш дом! Единственная известная планета с жизнью. 71% поверхности покрыт водой.'
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    radius: 6,
    orbitRadius: 170,
    realRadius: '3 390 км',
    distanceFromSun: '227,9 млн км',
    orbitalPeriod: '687 дней',
    color: '#e07040',
    gradient: 'radial-gradient(circle at 30% 30%, #f09070, #e07040, #a04020)',
    speed: 0.53,
    description: 'Красная планета. Имеет самую высокую гору в Солнечной системе — Олимп (21,9 км).'
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 18,
    orbitRadius: 230,
    realRadius: '69 911 км',
    distanceFromSun: '778,5 млн км',
    orbitalPeriod: '11,86 лет',
    color: '#d4a574',
    gradient: 'radial-gradient(circle at 30% 30%, #f0d0a0, #d4a574, #b07840, #8b5e3c)',
    speed: 0.084,
    description: 'Самая большая планета. Масса в 2,5 раза больше всех остальных планет вместе взятых.'
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 15,
    orbitRadius: 295,
    realRadius: '58 232 км',
    distanceFromSun: '1 434 млн км',
    orbitalPeriod: '29,46 лет',
    color: '#e8d088',
    gradient: 'radial-gradient(circle at 30% 30%, #f5e8b0, #e8d088, #c4a858, #a08838)',
    speed: 0.034,
    description: 'Знаменита своими кольцами из льда и камней. Плотность меньше воды — мог бы плавать!',
    hasRing: true
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 11,
    orbitRadius: 355,
    realRadius: '25 362 км',
    distanceFromSun: '2 871 млн км',
    orbitalPeriod: '84,01 лет',
    color: '#7de8e8',
    gradient: 'radial-gradient(circle at 30% 30%, #a0f5f5, #7de8e8, #50b8c8, #3090a0)',
    speed: 0.012,
    description: 'Ледяной гигант, вращающийся «на боку». Ось наклонена на 98° от плоскости орбиты.'
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 10,
    orbitRadius: 410,
    realRadius: '24 622 км',
    distanceFromSun: '4 495 млн км',
    orbitalPeriod: '164,8 лет',
    color: '#4060ff',
    gradient: 'radial-gradient(circle at 30% 30%, #7090ff, #4060ff, #2040cc, #1020a0)',
    speed: 0.006,
    description: 'Самая дальняя планета. Ветры достигают 2 100 км/ч — самые сильные в Солнечной системе.'
  }
];

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    if (isPlaying) {
      setAngles(prev => prev.map((angle, i) => {
        return angle + planets[i].speed * speed * delta * 0.5;
      }));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 200; i++) {
      const size = Math.random() * 2 + 0.5;
      stars.push(
        <div
          key={i}
          className="star"
          style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '--duration': `${Math.random() * 3 + 2}s`,
            '--delay': `${Math.random() * 5}s`,
          } as React.CSSProperties}
        />
      );
    }
    return stars;
  };

  const getPlanetPosition = (index: number) => {
    const planet = planets[index];
    const angle = angles[index];
    const x = Math.cos(angle) * planet.orbitRadius;
    const y = Math.sin(angle) * planet.orbitRadius * 0.4; // elliptical perspective
    return { x, y };
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#0a0a1a]">
      {/* Stars background */}
      <div className="absolute inset-0">
        {generateStars()}
      </div>

      {/* Solar system container */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Sun */}
        <div 
          className="sun-glow absolute rounded-full z-5"
          style={{
            width: 50,
            height: 50,
            background: 'radial-gradient(circle at 35% 35%, #fff5d0, #ffd700, #ff8c00, #ff4500)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Orbit paths */}
        {planets.map((planet, i) => (
          <div
            key={`orbit-${i}`}
            className="orbit-path"
            style={{
              width: planet.orbitRadius * 2,
              height: planet.orbitRadius * 0.8,
            }}
          />
        ))}

        {/* Planets */}
        {planets.map((planet, i) => {
          const pos = getPlanetPosition(i);
          return (
            <div
              key={`planet-${i}`}
              className="planet group"
              style={{
                width: planet.radius * 2,
                height: planet.radius * 2,
                background: planet.gradient,
                left: `calc(50% + ${pos.x}px - ${planet.radius}px)`,
                top: `calc(50% + ${pos.y}px - ${planet.radius}px)`,
                boxShadow: `0 0 ${planet.radius}px ${planet.color}40, inset -${planet.radius/3}px -${planet.radius/3}px ${planet.radius/2}px rgba(0,0,0,0.3)`,
              }}
              onClick={() => setSelectedPlanet(planet)}
            >
              {/* Saturn ring */}
              {planet.hasRing && (
                <div
                  className="saturn-ring"
                  style={{
                    width: planet.radius * 3.5,
                    height: planet.radius * 1.2,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) rotateX(70deg)',
                    borderColor: 'rgba(210, 180, 140, 0.6)',
                    borderWidth: 3,
                  }}
                />
              )}
              {/* Planet name label on hover */}
              <div 
                className="absolute text-white text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  bottom: planet.radius * 2 + 5,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textShadow: '0 0 5px rgba(0,0,0,0.8)',
                }}
              >
                {planet.nameRu}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Panel */}
      {selectedPlanet && (
        <div className="info-panel absolute top-4 right-4 w-80 p-6 text-white fade-in z-50">
          <button
            onClick={() => setSelectedPlanet(null)}
            className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: 50,
                height: 50,
                background: selectedPlanet.gradient,
                boxShadow: `0 0 20px ${selectedPlanet.color}60`,
              }}
            />
            <div>
              <h2 className="text-2xl font-bold">{selectedPlanet.nameRu}</h2>
              <p className="text-white/50 text-sm">{selectedPlanet.name}</p>
            </div>
          </div>

          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            {selectedPlanet.description}
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/50 text-sm">Радиус</span>
              <span className="text-white font-medium">{selectedPlanet.realRadius}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/50 text-sm">Расстояние от Солнца</span>
              <span className="text-white font-medium">{selectedPlanet.distanceFromSun}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/50 text-sm">Орбитальный период</span>
              <span className="text-white font-medium">{selectedPlanet.orbitalPeriod}</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls-panel absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 flex items-center gap-6 z-50">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-indigo-500/30"
          title={isPlaying ? 'Пауза' : 'Воспроизведение'}
        >
          {isPlaying ? (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
              <rect x="1" y="1" width="4" height="14" rx="1" />
              <rect x="9" y="1" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
              <path d="M2 1.5L12.5 8L2 14.5V1.5Z" />
            </svg>
          )}
        </button>

        {/* Speed control */}
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-xs uppercase tracking-wider">Скорость</span>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="speed-slider w-32"
          />
          <span className="text-white font-mono text-sm min-w-[3rem] text-center">
            {speed.toFixed(1)}x
          </span>
        </div>

        {/* Speed presets */}
        <div className="flex gap-1">
          {[0.5, 1, 2, 5].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                speed === s 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4 z-50">
        <h1 className="text-white text-xl font-bold tracking-wide">
          ☀️ Солнечная система
        </h1>
        <p className="text-white/40 text-xs mt-1">
          Нажмите на планету для получения информации
        </p>
      </div>

      {/* Planet list */}
      <div className="absolute left-4 top-20 z-50 flex flex-col gap-1">
        {planets.map((planet, i) => (
          <button
            key={i}
            onClick={() => setSelectedPlanet(planet)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-left ${
              selectedPlanet?.name === planet.name
                ? 'bg-white/15 text-white'
                : 'text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: planet.color }}
            />
            <span className="text-xs">{planet.nameRu}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
