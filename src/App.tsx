import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { planets, nearbyStars, galaxies, universeFacts, scaleComparison, CelestialBody } from './data';

type ViewMode = 'solar' | 'inner' | 'outer' | 'universe' | 'compare' | 'tour';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('solar');
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(planets.map((_, i) => (i * Math.PI * 2) / planets.length + Math.random() * 0.5));
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showFacts, setShowFacts] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);
  const [cometAngle, setCometAngle] = useState(0);
  const [tourIndex, setTourIndex] = useState(0);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Animation loop
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const delta = (time - lastTimeRef.current) / 1000;
    lastTimeRef.current = time;

    if (isPlaying) {
      setAngles(prev => prev.map((angle, i) => angle + planets[i].speed * speed * delta * 0.3));
      setCometAngle(prev => prev + delta * speed * 0.8);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  // Rotate facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % universeFacts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Tour mode
  useEffect(() => {
    if (viewMode === 'tour' && isPlaying) {
      const interval = setInterval(() => {
        setTourIndex(prev => {
          const next = (prev + 1) % planets.length;
          setSelectedBody(planets[next]);
          return next;
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [viewMode, isPlaying]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.3, Math.min(3, prev - e.deltaY * 0.001)));
  }, []);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('solar-bg')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Stars background
  const stars = useMemo(() => {
    const s = [];
    for (let i = 0; i < 300; i++) {
      const size = Math.random() * 2 + 0.3;
      s.push(
        <div
          key={i}
          className="star"
          style={{
            width: size,
            height: size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            '--duration': `${Math.random() * 4 + 2}s`,
            '--delay': `${Math.random() * 5}s`,
          } as React.CSSProperties}
        />
      );
    }
    return s;
  }, []);

  // Asteroid belt particles
  const asteroidBelt = useMemo(() => {
    const asteroids = [];
    for (let i = 0; i < 80; i++) {
      const angle = (i / 80) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 210 + Math.random() * 30;
      const size = Math.random() * 2 + 0.5;
      asteroids.push({ angle, dist, size });
    }
    return asteroids;
  }, []);

  // Kuiper belt particles
  const kuiperBelt = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 460 + Math.random() * 50;
      const size = Math.random() * 1.5 + 0.3;
      particles.push({ angle, dist, size });
    }
    return particles;
  }, []);

  // Get planet position
  const getPlanetPosition = (index: number, scale: number = 1) => {
    const planet = planets[index];
    const angle = angles[index];
    const orbit = planet.orbitRadius * scale;
    const x = Math.cos(angle) * orbit;
    const y = Math.sin(angle) * orbit * 0.4;
    return { x, y };
  };

  // Filter planets by view mode
  const getVisiblePlanets = () => {
    switch (viewMode) {
      case 'inner': return planets.slice(0, 5);
      case 'outer': return planets.slice(4);
      default: return planets;
    }
  };

  const visiblePlanets = getVisiblePlanets();
  const orbitScale = viewMode === 'inner' ? 1.8 : viewMode === 'outer' ? 0.7 : 1;

  // Comet position
  const getCometPosition = () => {
    const angle = cometAngle;
    const dist = 100 + Math.abs(Math.sin(angle * 0.3)) * 350;
    const x = Math.cos(angle * 0.7) * dist;
    const y = Math.sin(angle * 0.7) * dist * 0.4;
    return { x, y };
  };

  // Render Solar System view
  const renderSolarSystem = () => (
    <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}>
      {/* Sun */}
      <div 
        className="sun-glow absolute rounded-full cursor-pointer z-5 group"
        style={{
          width: 55,
          height: 55,
          background: 'radial-gradient(circle at 35% 35%, #fff5d0, #ffd700, #ff8c00, #ff4500)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        onClick={() => setSelectedBody({
          id: 'sun',
          name: 'Sun',
          nameRu: 'Солнце',
          type: 'star',
          radius: 27,
          orbitRadius: 0,
          realRadius: '696 340 км',
          distanceFromSun: '0 (центр системы)',
          orbitalPeriod: '~225-250 млн лет (вокруг центра Галактики)',
          color: '#FFD700',
          gradient: 'radial-gradient(circle at 35% 35%, #fff5d0, #ffd700, #ff8c00)',
          speed: 0,
          description: 'Наша звезда — жёлтый карлик спектрального класса G2V. Содержит 99,86% всей массы Солнечной системы. Возраст: ~4,6 миллиарда лет.',
          facts: [
            'Температура поверхности: ~5 500°C',
            'Температура ядра: ~15 000 000°C',
            'Состав: 73% водород, 25% гелий',
            'Свет достигает Земли за 8 минут 20 секунд',
            'Через ~5 млрд лет станет красным гигантом',
            'Масса: 1,989 × 10³⁰ кг (333 000 Земель)',
          ],
          moons: undefined,
          temperature: '5 500°C (поверхность)',
          gravity: '274 м/с²',
          atmosphere: 'Плазма (H, He)',
        })}
      >
        {showLabels && (
          <div className="absolute text-white/80 text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium"
            style={{
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              textShadow: '0 0 8px rgba(0,0,0,0.9)',
            }}
          >
            Солнце ☀
          </div>
        )}
      </div>

      {/* Orbit paths */}
      {showOrbits && planets.map((planet, i) => (
        <div
          key={`orbit-${i}`}
          className="orbit-path"
          style={{
            width: planet.orbitRadius * 2 * orbitScale,
            height: planet.orbitRadius * 0.8 * orbitScale,
            borderColor: planet.type === 'dwarf_planet' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
            borderStyle: planet.type === 'dwarf_planet' ? 'dashed' : 'solid',
          }}
        />
      ))}

      {/* Asteroid belt */}
      {asteroidBelt.map((a, i) => {
        const animAngle = a.angle + (isPlaying ? cometAngle * 0.1 : 0);
        const x = Math.cos(animAngle) * a.dist * orbitScale;
        const y = Math.sin(animAngle) * a.dist * 0.4 * orbitScale;
        return (
          <div
            key={`asteroid-${i}`}
            className="absolute rounded-full"
            style={{
              width: a.size,
              height: a.size,
              background: `rgba(150, 140, 120, ${0.3 + Math.random() * 0.4})`,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
          />
        );
      })}

      {/* Kuiper belt */}
      {kuiperBelt.map((p, i) => {
        const animAngle = p.angle + (isPlaying ? cometAngle * 0.02 : 0);
        const x = Math.cos(animAngle) * p.dist * orbitScale;
        const y = Math.sin(animAngle) * p.dist * 0.4 * orbitScale;
        return (
          <div
            key={`kuiper-${i}`}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: `rgba(100, 120, 160, ${0.2 + Math.random() * 0.3})`,
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
          />
        );
      })}

      {/* Planets */}
      {planets.map((planet, i) => {
        const pos = getPlanetPosition(i, orbitScale);
        const isHovered = hoveredPlanet === planet.id;
        return (
          <div key={`planet-group-${i}`}>
            <div
              className="planet group"
              style={{
                width: planet.radius * 2,
                height: planet.radius * 2,
                background: planet.gradient,
                left: `calc(50% + ${pos.x}px - ${planet.radius}px)`,
                top: `calc(50% + ${pos.y}px - ${planet.radius}px)`,
                boxShadow: isHovered 
                  ? `0 0 ${planet.radius * 2}px ${planet.color}80, inset -${planet.radius/3}px -${planet.radius/3}px ${planet.radius/2}px rgba(0,0,0,0.4)`
                  : `0 0 ${planet.radius}px ${planet.color}40, inset -${planet.radius/3}px -${planet.radius/3}px ${planet.radius/2}px rgba(0,0,0,0.4)`,
                opacity: viewMode === 'inner' && i > 4 ? 0.2 : viewMode === 'outer' && i < 4 ? 0.2 : 1,
              }}
              onClick={() => setSelectedBody(planet)}
              onMouseEnter={() => setHoveredPlanet(planet.id)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              {/* Saturn ring */}
              {planet.hasRing && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    width: planet.radius * 3.8,
                    height: planet.radius * 1.3,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%) rotateX(70deg)',
                    border: `3px solid rgba(210, 180, 140, 0.5)`,
                    borderRadius: '50%',
                    boxShadow: `inset 0 0 5px rgba(210, 180, 140, 0.2)`,
                  }}
                />
              )}
              {/* Earth's moon */}
              {planet.id === 'earth' && (
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 3,
                    height: 3,
                    background: 'radial-gradient(circle at 30% 30%, #e0e0e0, #a0a0a0)',
                    left: `calc(50% + ${Math.cos(angles[i] * 12) * 15}px - 1.5px)`,
                    top: `calc(50% + ${Math.sin(angles[i] * 12) * 6}px - 1.5px)`,
                    boxShadow: '0 0 3px rgba(200,200,200,0.3)',
                  }}
                />
              )}
              {/* Hover label */}
              {showLabels && (
                <div 
                  className="absolute text-white text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium"
                  style={{
                    bottom: planet.radius * 2 + 8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textShadow: '0 0 8px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,1)',
                    fontSize: '11px',
                  }}
                >
                  {planet.nameRu}
                  {planet.type === 'dwarf_planet' && <span className="text-[9px] text-white/50 ml-1">(карлик.)</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Comet */}
      {(() => {
        const cPos = getCometPosition();
        const tailAngle = Math.atan2(cPos.y, cPos.x) * 180 / Math.PI + 180;
        return (
          <div className="absolute pointer-events-none" style={{
            left: `calc(50% + ${cPos.x}px)`,
            top: `calc(50% + ${cPos.y}px)`,
            zIndex: 8,
          }}>
            {/* Comet tail - dust tail */}
            <div className="absolute" style={{
              width: 80,
              height: 3,
              background: 'linear-gradient(to right, rgba(200,220,255,0.5), rgba(150,180,255,0.2), transparent)',
              transform: `rotate(${tailAngle}deg)`,
              transformOrigin: 'left center',
              borderRadius: '0 2px 2px 0',
              filter: 'blur(1px)',
              top: -1,
            }} />
            {/* Comet tail - ion tail */}
            <div className="absolute" style={{
              width: 60,
              height: 1.5,
              background: 'linear-gradient(to right, rgba(100,150,255,0.6), rgba(80,120,255,0.2), transparent)',
              transform: `rotate(${tailAngle + 5}deg)`,
              transformOrigin: 'left center',
              borderRadius: '0 1px 1px 0',
              top: 1,
            }} />
            {/* Comet nucleus */}
            <div className="w-2.5 h-2.5 rounded-full" style={{ 
              background: 'radial-gradient(circle at 40% 40%, #ffffff, #aaccff, #6699cc)',
              boxShadow: '0 0 8px #fff, 0 0 15px #88ccff, 0 0 25px rgba(100,150,255,0.3)',
              position: 'relative',
              top: -1,
              left: -1,
            }} />
            {/* Coma (fuzzy glow around nucleus) */}
            <div className="absolute rounded-full" style={{
              width: 12,
              height: 12,
              background: 'radial-gradient(circle, rgba(200,230,255,0.3), transparent)',
              top: -6,
              left: -6,
            }} />
          </div>
        );
      })()}
    </div>
  );

  // Render Universe view
  const renderUniverse = () => (
    <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `scale(${zoom})` }}>
      {/* Deep space nebulae */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(80, 20, 120, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, rgba(20, 60, 120, 0.08) 0%, transparent 40%),
          radial-gradient(ellipse at 50% 20%, rgba(120, 40, 60, 0.06) 0%, transparent 35%),
          radial-gradient(ellipse at 20% 80%, rgba(40, 80, 120, 0.05) 0%, transparent 30%),
          radial-gradient(ellipse at 85% 15%, rgba(60, 20, 80, 0.04) 0%, transparent 25%)
        `,
      }} />

      {/* Cosmic dust particles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={`cosmic-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 0.5,
            height: Math.random() * 2 + 0.5,
            background: `rgba(${150 + Math.random() * 100}, ${150 + Math.random() * 100}, 255, ${0.1 + Math.random() * 0.2})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Milky Way galaxy */}
      <div className="absolute galaxy-spin" style={{ width: 500, height: 500 }}>
        <svg viewBox="-250 -250 500 500" className="w-full h-full">
          <defs>
            <radialGradient id="galaxyGrad">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9" />
              <stop offset="15%" stopColor="#ffaa00" stopOpacity="0.5" />
              <stop offset="40%" stopColor="#6a4a8a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer halo */}
          <ellipse cx="0" cy="0" rx="230" ry="140" fill="rgba(60, 40, 100, 0.05)" />
          <ellipse cx="0" cy="0" rx="200" ry="120" fill="rgba(80, 60, 120, 0.06)" />
          
          {/* Spiral arms */}
          {[0, 1, 2, 3].map(arm => (
            <g key={arm} transform={`rotate(${arm * 90 + 20})`}>
              <path
                d={`M 0,0 C 40,20 80,50 120,90 S 180,150 200,180`}
                fill="none"
                stroke="rgba(140, 120, 200, 0.25)"
                strokeWidth="25"
                filter="url(#softGlow)"
              />
              <path
                d={`M 0,0 C 40,20 80,50 120,90 S 180,150 200,180`}
                fill="none"
                stroke="rgba(180, 160, 230, 0.15)"
                strokeWidth="10"
              />
              {/* Star clusters along arms */}
              {Array.from({ length: 8 }).map((_, j) => {
                const t = (j + 1) / 9;
                const cx = t * 200 * Math.cos(t * 1.2);
                const cy = t * 180 * Math.sin(t * 0.8) * 0.6;
                return (
                  <circle
                    key={j}
                    cx={cx}
                    cy={cy}
                    r={Math.random() * 1.2 + 0.3}
                    fill={`rgba(200, 200, 255, ${0.3 + Math.random() * 0.5})`}
                  />
                );
              })}
            </g>
          ))}
          
          {/* Dust lanes */}
          {[0, 1, 2].map(i => (
            <path
              key={`dust-${i}`}
              d={`M ${-50 + i * 30},${-20 + i * 10} Q ${50 + i * 20},${30 + i * 15} ${150 + i * 10},${80 + i * 20}`}
              fill="none"
              stroke="rgba(40, 20, 60, 0.2)"
              strokeWidth="4"
              transform={`rotate(${i * 120})`}
            />
          ))}
          
          {/* Center bulge */}
          <circle cx="0" cy="0" r="50" fill="url(#galaxyGrad)" />
          <circle cx="0" cy="0" r="20" fill="#ffd700" opacity="0.5" filter="url(#glow)" />
          <circle cx="0" cy="0" r="8" fill="#fff5d0" opacity="0.7" />
          
          {/* Scattered stars */}
          {Array.from({ length: 150 }).map((_, i) => {
            const armAngle = (i % 4) * (Math.PI / 2) + 0.3;
            const spiralT = (i / 150) * 3;
            const baseAngle = armAngle + spiralT * 1.5;
            const dist = 25 + spiralT * 60 + Math.random() * 20;
            const x = Math.cos(baseAngle) * dist;
            const y = Math.sin(baseAngle) * dist * 0.6;
            const brightness = Math.max(0.1, 0.7 - spiralT * 0.15);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={Math.random() * 1.2 + 0.2}
                fill={`rgba(220, 220, 255, ${brightness})`}
              />
            );
          })}
          
          {/* Sun position */}
          <circle cx="85" cy="35" r="4" fill="#FFD700" filter="url(#glow)">
            <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.6;1" dur="3s" repeatCount="indefinite" />
          </circle>
          <text x="95" y="30" fill="#FFD700" fontSize="9" opacity="0.9" fontWeight="bold">☀ Солнце</text>
          <text x="95" y="42" fill="rgba(255,215,0,0.5)" fontSize="7">Вы здесь</text>
        </svg>
      </div>

      {/* Distance scale indicator */}
      <div className="absolute bottom-4 right-4 text-white/20 text-[9px] text-right">
        <div>Масштаб: не в пропорции</div>
        <div>Расстояния между звёздами ~световые годы</div>
      </div>

      {/* Nearby stars */}
      {nearbyStars.filter(s => s.id !== 'sun').map((star) => (
        <div
          key={star.id}
          className="absolute cursor-pointer group"
          style={{
            left: `calc(50% + ${star.x}px)`,
            top: `calc(50% + ${star.y}px)`,
          }}
          onClick={() => {
            setSelectedBody({
              id: star.id,
              name: star.name,
              nameRu: star.nameRu,
              type: 'star',
              radius: star.size,
              orbitRadius: 0,
              realRadius: star.type,
              distanceFromSun: star.distance,
              orbitalPeriod: '-',
              color: star.color,
              gradient: `radial-gradient(circle at 30% 30%, white, ${star.color})`,
              speed: 0,
              description: star.description,
              facts: [
                star.description,
                `Расстояние от Солнца: ${star.distance}`,
                `Спектральный класс: ${star.type}`,
              ],
            });
          }}
        >
          <div
            className="rounded-full transition-transform group-hover:scale-150"
            style={{
              width: star.size,
              height: star.size,
              background: `radial-gradient(circle at 30% 30%, white, ${star.color})`,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}80, 0 0 ${star.size * 4}px ${star.color}30`,
            }}
          />
          <div className="absolute text-white/70 text-[9px] whitespace-nowrap left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-1.5 py-0.5 rounded">
            <div className="font-medium">{star.nameRu}</div>
            <div className="text-white/40 text-[8px]">{star.distance}</div>
          </div>
        </div>
      ))}

      {/* Connection lines from Sun to nearby stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.15 }}>
        {nearbyStars.filter(s => s.id !== 'sun').map((star) => (
          <line
            key={`line-${star.id}`}
            x1="50%"
            y1="50%"
            x2={`calc(50% + ${star.x}px)`}
            y2={`calc(50% + ${star.y}px)`}
            stroke="rgba(100, 150, 255, 0.3)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}
      </svg>

      {/* Distant galaxies */}
      {galaxies.filter(g => g.id !== 'milky-way').map((galaxy) => (
        <div
          key={galaxy.id}
          className="absolute cursor-pointer group"
          style={{
            left: `calc(50% + ${galaxy.x}px)`,
            top: `calc(50% + ${galaxy.y}px)`,
          }}
          onClick={() => {
            setSelectedBody({
              id: galaxy.id,
              name: galaxy.name,
              nameRu: galaxy.nameRu,
              type: 'planet',
              radius: galaxy.size / 4,
              orbitRadius: 0,
              realRadius: galaxy.type,
              distanceFromSun: galaxy.distance,
              orbitalPeriod: '-',
              color: galaxy.color1,
              gradient: `radial-gradient(ellipse at center, ${galaxy.color1}, ${galaxy.color2})`,
              speed: 0,
              description: galaxy.description,
              facts: [
                galaxy.description,
                `Расстояние: ${galaxy.distance}`,
                `Тип: ${galaxy.type}`,
              ],
            });
          }}
        >
          <div
            className="transition-transform group-hover:scale-110"
            style={{
              width: galaxy.size,
              height: galaxy.size * 0.45,
              background: `radial-gradient(ellipse at center, ${galaxy.color1}cc, ${galaxy.color2}88, transparent)`,
              transform: `rotate(${galaxy.rotation}deg)`,
              boxShadow: `0 0 ${galaxy.size/3}px ${galaxy.color1}30, 0 0 ${galaxy.size}px ${galaxy.color1}15`,
              borderRadius: '50%',
              opacity: 0.8,
            }}
          />
          {/* Galaxy core */}
          <div
            className="absolute rounded-full"
            style={{
              width: galaxy.size * 0.15,
              height: galaxy.size * 0.15,
              background: `radial-gradient(circle, ${galaxy.color1}ee, transparent)`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div className="absolute text-white/50 text-[9px] whitespace-nowrap left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-center bg-black/40 px-2 py-1 rounded">
            <div className="font-medium text-white/70">{galaxy.nameRu}</div>
            <div className="text-[8px] text-white/30">{galaxy.distance}</div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render Size Comparison view
  const renderComparison = () => {
    const radii = ['2 439 км', '6 052 км', '6 371 км', '3 390 км', '69 911 км', '58 232 км', '25 362 км', '24 622 км'];
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <div className="text-center mb-4">
          <h2 className="text-white/80 text-lg font-medium">Сравнительные размеры планет</h2>
          <p className="text-white/30 text-xs mt-1">Не в реальном масштабе (Юпитер в 11 раз больше Земли)</p>
        </div>
        <div className="flex items-end gap-4 md:gap-8 px-4">
          {scaleComparison.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-2 fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div
                className="rounded-full transition-all duration-300 cursor-pointer hover:scale-125 hover:brightness-125"
                style={{
                  width: p.size,
                  height: p.size,
                  background: `radial-gradient(circle at 30% 30%, ${p.color}ff, ${p.color}99, ${p.color}55)`,
                  boxShadow: `0 0 ${p.size/2}px ${p.color}30, inset -${p.size/4}px -${p.size/4}px ${p.size/3}px rgba(0,0,0,0.4)`,
                }}
                onClick={() => {
                  const planet = planets.find(pl => pl.nameRu === p.name);
                  if (planet) setSelectedBody(planet);
                }}
              />
              <span className="text-white/60 text-[10px] text-center whitespace-nowrap font-medium">{p.name}</span>
              <span className="text-white/30 text-[8px]">{radii[i]}</span>
            </div>
          ))}
        </div>
        {/* Size reference bar */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400/50" />
            <span className="text-white/30 text-[9px]">Земля = 6 371 км</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400/30" />
            <span className="text-white/30 text-[9px]">Юпитер = 11× Земли</span>
          </div>
        </div>
      </div>
    );
  };

  // Render Tour view
  const renderTour = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center fade-in">
        <div className="mb-8">
          <div
            key={tourIndex}
            className="mx-auto rounded-full mb-4 planet-appear"
            style={{
              width: 120,
              height: 120,
              background: planets[tourIndex].gradient,
              boxShadow: `0 0 40px ${planets[tourIndex].color}60, 0 0 80px ${planets[tourIndex].color}30`,
            }}
          />
          <h2 className="text-white text-3xl font-bold mb-2">{planets[tourIndex].nameRu}</h2>
          <p className="text-white/40 text-sm">{planets[tourIndex].name}</p>
        </div>
        <p className="text-white/70 text-base max-w-md mx-auto mb-6 leading-relaxed">
          {planets[tourIndex].description}
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/40 text-[10px] uppercase tracking-wider">Радиус</div>
            <div className="text-white text-sm font-medium">{planets[tourIndex].realRadius}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/40 text-[10px] uppercase tracking-wider">Период</div>
            <div className="text-white text-sm font-medium">{planets[tourIndex].orbitalPeriod}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/40 text-[10px] uppercase tracking-wider">От Солнца</div>
            <div className="text-white text-sm font-medium">{planets[tourIndex].distanceFromSun}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/40 text-[10px] uppercase tracking-wider">Спутники</div>
            <div className="text-white text-sm font-medium">{planets[tourIndex].moons ?? 0}</div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          {planets.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === tourIndex ? 'bg-indigo-500 w-6' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-[#050510] select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Stars background */}
      <div className="absolute inset-0 solar-bg">{stars}</div>

      {/* Nebula background effect */}
      <div className="absolute inset-0 solar-bg" style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(60, 20, 80, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(20, 40, 80, 0.1) 0%, transparent 40%), radial-gradient(ellipse at 50% 80%, rgba(40, 20, 60, 0.1) 0%, transparent 40%)',
      }} />

      {/* Main content */}
      {viewMode === 'solar' && renderSolarSystem()}
      {viewMode === 'inner' && renderSolarSystem()}
      {viewMode === 'outer' && renderSolarSystem()}
      {viewMode === 'universe' && renderUniverse()}
      {viewMode === 'compare' && renderComparison()}
      {viewMode === 'tour' && renderTour()}

      {/* Info Panel */}
      {selectedBody && viewMode !== 'tour' && (
        <div className="info-panel absolute top-4 right-4 w-80 max-h-[85vh] overflow-y-auto p-5 text-white fade-in z-50">
          <button
            onClick={() => setSelectedBody(null)}
            className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors text-lg w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            ✕
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div
              className="rounded-full flex-shrink-0"
              style={{
                width: 45,
                height: 45,
                background: selectedBody.gradient,
                boxShadow: `0 0 15px ${selectedBody.color}50`,
              }}
            />
            <div>
              <h2 className="text-xl font-bold">{selectedBody.nameRu}</h2>
              <p className="text-white/40 text-xs">{selectedBody.name}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${
                selectedBody.type === 'planet' ? 'bg-blue-500/20 text-blue-300' :
                selectedBody.type === 'dwarf_planet' ? 'bg-purple-500/20 text-purple-300' :
                'bg-yellow-500/20 text-yellow-300'
              }`}>
                {selectedBody.type === 'planet' ? 'Планета' : 
                 selectedBody.type === 'dwarf_planet' ? 'Карликовая планета' : 'Звезда'}
              </span>
            </div>
          </div>

          <p className="text-white/70 text-sm mb-4 leading-relaxed">
            {selectedBody.description}
          </p>

          <div className="space-y-2 mb-4">
            <InfoRow label="Радиус" value={selectedBody.realRadius} />
            <InfoRow label="Расстояние от Солнца" value={selectedBody.distanceFromSun} />
            <InfoRow label="Орбитальный период" value={selectedBody.orbitalPeriod} />
            {selectedBody.moons !== undefined && <InfoRow label="Спутники" value={String(selectedBody.moons)} />}
            {selectedBody.temperature && <InfoRow label="Температура" value={selectedBody.temperature} />}
            {selectedBody.gravity && <InfoRow label="Гравитация" value={selectedBody.gravity} />}
            {selectedBody.atmosphere && <InfoRow label="Атмосфера" value={selectedBody.atmosphere} />}
          </div>

          {/* Facts */}
          {selectedBody.facts && selectedBody.facts.length > 0 && (
            <div className="border-t border-white/10 pt-3">
              <h3 className="text-white/50 text-xs uppercase tracking-wider mb-2">Интересные факты</h3>
              <ul className="space-y-1.5">
                {selectedBody.facts.map((fact, i) => (
                  <li key={i} className="text-white/60 text-xs flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Rotating facts ticker */}
      {showFacts && viewMode !== 'universe' && viewMode !== 'tour' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 fade-in">
          <div className="controls-panel px-4 py-2 flex items-center gap-2">
            <span className="text-lg">{universeFacts[currentFact].icon}</span>
            <div>
              <div className="text-white text-xs font-medium">{universeFacts[currentFact].title}</div>
              <div className="text-white/50 text-[10px]">{universeFacts[currentFact].text}</div>
            </div>
          </div>
        </div>
      )}

      {/* View mode selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="controls-panel flex gap-1 p-1">
          {[
            { mode: 'solar' as ViewMode, label: '🌍 Вся система' },
            { mode: 'inner' as ViewMode, label: '☀️ Внутренние' },
            { mode: 'outer' as ViewMode, label: '🪐 Внешние' },
            { mode: 'universe' as ViewMode, label: '🌌 Вселенная' },
            { mode: 'compare' as ViewMode, label: '📏 Размеры' },
            { mode: 'tour' as ViewMode, label: '🎯 Тур' },
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => { setViewMode(mode); setZoom(1); setPan({ x: 0, y: 0 }); setSelectedBody(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                viewMode === mode
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      {viewMode !== 'universe' && viewMode !== 'compare' && viewMode !== 'tour' && (
        <div className="controls-panel absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 flex items-center gap-5 z-50">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-indigo-500/30"
            title={isPlaying ? 'Пауза' : 'Воспроизведение'}
          >
            {isPlaying ? (
              <svg width="12" height="14" viewBox="0 0 14 16" fill="white">
                <rect x="1" y="1" width="4" height="14" rx="1" />
                <rect x="9" y="1" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 14 16" fill="white">
                <path d="M2 1.5L12.5 8L2 14.5V1.5Z" />
              </svg>
            )}
          </button>

          {/* Speed */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-[10px] uppercase tracking-wider">Скорость</span>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="speed-slider w-24"
            />
            <span className="text-white font-mono text-xs min-w-[2.5rem] text-center">
              {speed.toFixed(1)}x
            </span>
          </div>

          {/* Speed presets */}
          <div className="flex gap-1">
            {[0.5, 1, 2, 5].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded text-[10px] transition-all ${
                  speed === s
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 border-l border-white/10 pl-4">
            <button
              onClick={() => setZoom(prev => Math.max(0.3, prev - 0.2))}
              className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center text-sm transition-all"
            >
              −
            </button>
            <span className="text-white/40 text-[10px] min-w-[2rem] text-center">{(zoom * 100).toFixed(0)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
              className="w-7 h-7 rounded bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center text-sm transition-all"
            >
              +
            </button>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className={`text-[10px] px-2 py-1 rounded transition-all ${showOrbits ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
            >
              ◯ Орбиты
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`text-[10px] px-2 py-1 rounded transition-all ${showLabels ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
            >
              🏷️ Названия
            </button>
          </div>

          {/* Reset view */}
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="text-white/40 hover:text-white text-[10px] transition-colors px-2 py-1 rounded hover:bg-white/10"
          >
            ↺ Сброс
          </button>

          {/* Facts toggle */}
          <button
            onClick={() => setShowFacts(!showFacts)}
            className={`text-[10px] transition-colors px-2 py-1 rounded ${showFacts ? 'bg-indigo-600/50 text-white' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
          >
            💡 Факты
          </button>
        </div>
      )}

      {/* Universe controls */}
      {viewMode === 'universe' && (
        <div className="controls-panel absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 flex items-center gap-4 z-50">
          <span className="text-white/60 text-xs">🌌 Наша Вселенная</span>
          <span className="text-white/30 text-[10px]">Млечный Путь • Ближайшие звёзды • Галактики</span>
          <button
            onClick={() => setShowFacts(!showFacts)}
            className={`px-3 py-1 rounded text-[10px] transition-all ${showFacts ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
          >
            {showFacts ? '📊 Скрыть факты' : '📊 Факты о Вселенной'}
          </button>
        </div>
      )}

      {/* Tour controls */}
      {viewMode === 'tour' && (
        <div className="controls-panel absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 flex items-center gap-4 z-50">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center transition-all"
          >
            {isPlaying ? (
              <svg width="12" height="14" viewBox="0 0 14 16" fill="white">
                <rect x="1" y="1" width="4" height="14" rx="1" />
                <rect x="9" y="1" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 14 16" fill="white">
                <path d="M2 1.5L12.5 8L2 14.5V1.5Z" />
              </svg>
            )}
          </button>
          <span className="text-white/60 text-xs">Автоматический тур по планетам</span>
          <div className="flex gap-1">
            {planets.map((_, i) => (
              <button
                key={i}
                onClick={() => { setTourIndex(i); setSelectedBody(planets[i]); }}
                className={`w-6 h-6 rounded-full text-[9px] transition-all ${
                  i === tourIndex ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Universe facts overlay */}
      {viewMode === 'universe' && showFacts && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 fade-in">
          <div className="controls-panel p-4 max-w-lg">
            <div className="grid grid-cols-2 gap-3">
              {universeFacts.map((fact, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                  <span className="text-lg">{fact.icon}</span>
                  <div>
                    <div className="text-white text-[10px] font-medium">{fact.title}</div>
                    <div className="text-white/50 text-[9px]">{fact.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Planet list sidebar */}
      {viewMode !== 'universe' && viewMode !== 'compare' && viewMode !== 'tour' && (
        <div className="absolute left-3 top-20 z-50 flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
          {planets.map((planet) => (
            <button
              key={planet.id}
              onClick={() => setSelectedBody(planet)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all text-left ${
                selectedBody?.id === planet.id
                  ? 'bg-white/15 text-white shadow-lg'
                  : 'text-white/40 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: planet.color, boxShadow: `0 0 4px ${planet.color}60` }}
              />
              <span className="text-[11px]">{planet.nameRu}</span>
              {planet.type === 'dwarf_planet' && <span className="text-[8px] text-purple-400/60">⬡</span>}
            </button>
          ))}
        </div>
      )}

      {/* Title */}
      <div className="absolute top-4 left-4 z-40">
        <h1 className="text-white text-lg font-bold tracking-wide flex items-center gap-2">
          {viewMode === 'universe' ? '🌌 Вселенная' : 
           viewMode === 'compare' ? '📏 Сравнение размеров' :
           viewMode === 'tour' ? '🎯 Тур по планетам' : '☀️ Солнечная система'}
        </h1>
        <p className="text-white/30 text-[10px] mt-0.5">
          {viewMode === 'universe' ? 'Масштабы космоса' : 
           viewMode === 'compare' ? 'Относительные размеры планет' :
           viewMode === 'tour' ? 'Автоматическая презентация' :
           'Кликните на планету • Колёсико мыши для зума • Перетаскивание для навигации'}
        </p>
      </div>

      {/* Zoom indicator */}
      {zoom !== 1 && viewMode !== 'universe' && viewMode !== 'compare' && viewMode !== 'tour' && (
        <div className="absolute bottom-20 right-4 z-40 text-white/30 text-[10px]">
          Зум: {(zoom * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}

// Info row component
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
      <span className="text-white/40 text-xs">{label}</span>
      <span className="text-white/90 text-xs font-medium text-right max-w-[55%]">{value}</span>
    </div>
  );
}

export default App;
