import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import data from "../data/portfolio.json";

// ── Motion Animation Variants ─────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 50, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 14, mass: 0.8 },
  },
};

const scaleUpSkew = {
  hidden: { opacity: 0, scale: 0.85, rotateY: 15, skewY: 3 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    skewY: 0,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60, rotateZ: -3 },
  visible: {
    opacity: 1,
    x: 0,
    rotateZ: 0,
    transition: { type: "spring", stiffness: 110, damping: 14 },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60, rotateZ: 3 },
  visible: {
    opacity: 1,
    x: 0,
    rotateZ: 0,
    transition: { type: "spring", stiffness: 110, damping: 14 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

// ── Dragon Mouse Follower Component ───────────────────────────────────
// ── Interactive Cursor & Custom Context Menu ───────────────────────────
function DragonCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTheme, setActiveTheme] = useState("dragon"); // "dragon" | "comet" | "phoenix"
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [rightClickPulses, setRightClickPulses] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [particles, setParticles] = useState([]);
  const [keyPops, setKeyPops] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const headRef = useRef(null);
  const segmentsRef = useRef([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const numSegments = 24;

  const themes = [
    { id: "dragon", name: "Dragon Serpent", icon: "🐉" },
    { id: "comet", name: "Cyber Comet", icon: "☄️" },
    { id: "phoenix", name: "Neon Phoenix", icon: "🔥" },
  ];

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setIsVisible(true);

    const positions = Array.from({ length: numSegments + 1 }, () => ({ x: -100, y: -100, angle: 0 }));

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".project-card") ||
        target.closest(".service-card") ||
        target.closest(".skill-card") ||
        target.closest("input") ||
        target.closest("textarea");

      setIsHovered(!!isInteractive);
    };

    const onContextMenu = (e) => {
      e.preventDefault();
      // Ensure menu fits within viewport
      const menuWidth = 250;
      const menuHeight = 180;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);
      setContextMenu({ visible: true, x, y });

      // Trigger right-click pulse animation
      const pulseId = Date.now() + Math.random();
      const newPulse = { id: pulseId, x: e.clientX, y: e.clientY };
      setRightClickPulses((prev) => [...prev.slice(-3), newPulse]);
      setTimeout(() => {
        setRightClickPulses((prev) => prev.filter((p) => p.id !== pulseId));
      }, 750);
    };

    // Physics state for break & spread effect on click
    const segmentVelocities = Array.from({ length: numSegments + 1 }, () => ({ vx: 0, vy: 0, vRot: 0, spreadOffsetX: 0, spreadOffsetY: 0 }));
    let breakTimer = 0; // > 0 when broken/exploding

    const onMouseClick = (e) => {
      setContextMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));

      // Trigger break & spread explosion for dragon segments!
      breakTimer = 35; // Frames to explode & snap back
      for (let i = 1; i <= numSegments; i++) {
        // Radial explosion vector outward from cursor
        const angle = (i / numSegments) * Math.PI * 2 + (Math.random() * 0.8 - 0.4);
        const force = 18 + Math.random() * 24 + i * 0.5;
        segmentVelocities[i].vx = Math.cos(angle) * force;
        segmentVelocities[i].vy = Math.sin(angle) * force;
        segmentVelocities[i].vRot = (Math.random() - 0.5) * 45;
      }

      // Trigger ripple
      const rippleId = Date.now() + Math.random();
      const newRipple = { id: rippleId, x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-5), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 650);

      // Trigger particle burst
      const numParticles = 12;
      const themeColors = {
        dragon: ["#22d3ee", "#38bdf8", "#c084fc", "#e879f9"],
        comet: ["#38bdf8", "#e0f2fe", "#818cf8", "#ffffff"],
        phoenix: ["#fde047", "#fb923c", "#f43f5e", "#ffedd5"],
      };
      const colors = themeColors[activeTheme] || themeColors.dragon;

      const newParticles = Array.from({ length: numParticles }, (_, i) => {
        const angle = (i / numParticles) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
        const dist = 40 + Math.random() * 40;
        return {
          id: Date.now() + Math.random() + i,
          x: e.clientX,
          y: e.clientY,
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
          color: colors[i % colors.length],
        };
      });

      setParticles((prev) => [...prev.slice(-20), ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
      }, 700);
    };

    const onKeyDown = (e) => {
      // Ignore modifier keys alone
      if (["Control", "Shift", "Alt", "Meta", "Tab", "CapsLock"].includes(e.key)) return;

      const displayChar = e.key === " " ? "SPACE" : e.key.length === 1 ? e.key.toUpperCase() : e.key.toUpperCase();
      const popId = Date.now() + Math.random();
      const driftX = (Math.random() - 0.5) * 80;
      const rot = (Math.random() - 0.5) * 36;

      // Spawn letter near current cursor head position
      const newKeyPop = {
        id: popId,
        char: displayChar,
        x: mousePos.current.x,
        y: mousePos.current.y,
        driftX: `${driftX}px`,
        rot: `${rot}deg`,
      };

      setKeyPops((prev) => [...prev.slice(-8), newKeyPop]);
      setTimeout(() => {
        setKeyPops((prev) => prev.filter((kp) => kp.id !== popId));
      }, 1200);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("click", onMouseClick);
    window.addEventListener("keydown", onKeyDown);

    // Multi-node inverse kinematics loop
    let animationFrameId;
    let time = 0;

    const animateDragon = () => {
      time += 0.05;
      const wave = Math.sin(time) * 4;

      // Smooth head tracking
      positions[0].x += (mousePos.current.x - positions[0].x) * 0.28;
      positions[0].y += (mousePos.current.y - positions[0].y) * 0.28;

      const dx = mousePos.current.x - positions[0].x;
      const dy = mousePos.current.y - positions[0].y;
      if (Math.hypot(dx, dy) > 0.001) {
        positions[0].angle = Math.atan2(dy, dx) * (180 / Math.PI);
      }

      if (headRef.current) {
        gsap.set(headRef.current, {
          x: positions[0].x,
          y: positions[0].y,
          rotation: positions[0].angle,
        });
      }

      const isBreaking = breakTimer > 0;
      if (isBreaking) {
        breakTimer--;
      }

      // Chain spine segments
      for (let i = 1; i <= numSegments; i++) {
        const prev = positions[i - 1];
        const current = positions[i];
        const vel = segmentVelocities[i];

        if (isBreaking) {
          // Explode/spread outward with friction damping
          vel.spreadOffsetX += vel.vx;
          vel.spreadOffsetY += vel.vy;
          vel.vx *= 0.82;
          vel.vy *= 0.82;
          current.angle += vel.vRot;
          vel.vRot *= 0.85;

          const renderX = current.x + vel.spreadOffsetX;
          const renderY = current.y + vel.spreadOffsetY;

          if (segmentsRef.current[i - 1]) {
            gsap.set(segmentsRef.current[i - 1], {
              x: renderX,
              y: renderY,
              rotation: current.angle,
              scale: 1 + (breakTimer / 35) * 0.4,
            });
          }
        } else {
          // Snap spread offset back to 0 smoothly
          vel.spreadOffsetX *= 0.7;
          vel.spreadOffsetY *= 0.7;

          const segDx = prev.x - current.x;
          const segDy = prev.y - current.y;
          const dist = Math.hypot(segDx, segDy);
          if (dist > 0.001) {
            current.angle = Math.atan2(segDy, segDx) * (180 / Math.PI);
          }

          // Inverse kinematics trailing elasticity with slight wave motion
          const easeFactor = 0.35 - i * 0.008;
          current.x += segDx * easeFactor + Math.cos(current.angle * Math.PI / 180 + Math.PI / 2) * (wave * (i / numSegments) * 0.4);
          current.y += segDy * easeFactor + Math.sin(current.angle * Math.PI / 180 + Math.PI / 2) * (wave * (i / numSegments) * 0.4);

          if (segmentsRef.current[i - 1]) {
            gsap.set(segmentsRef.current[i - 1], {
              x: current.x + vel.spreadOffsetX,
              y: current.y + vel.spreadOffsetY,
              rotation: current.angle,
              scale: 1,
            });
          }
        }
      }

      animationFrameId = requestAnimationFrame(animateDragon);
    };

    animateDragon();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("click", onMouseClick);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* ── Custom Right-Click Context Menu ── */}
      {contextMenu.visible && (
        <div
          className="custom-context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-menu-header">Cursor Animation</div>
          {themes.map((theme) => (
            <button
              key={theme.id}
              className={`context-menu-item ${activeTheme === theme.id ? "active" : ""}`}
              onClick={() => {
                setActiveTheme(theme.id);
                setContextMenu({ visible: false, x: 0, y: 0 });
              }}
            >
              <span className="context-menu-icon">{theme.icon}</span>
              <span>{theme.name}</span>
              {activeTheme === theme.id && <span className="context-menu-check">✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* ── Cursor Renderer ── */}
      <div className={`dragon-cursor-container ${isHovered ? "hovered" : ""}`}>
        {/* Head Element based on active theme */}
        <div ref={headRef} className="dragon-head">
          {activeTheme === "dragon" && (
            <svg viewBox="0 0 40 24" className="dragon-head-svg">
              <defs>
                <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <path d="M0,12 Q8,2 20,2 Q36,2 40,12 Q36,22 20,22 Q8,22 0,12 Z" fill="url(#cyanGlow)" />
              <circle cx="28" cy="8" r="2.5" fill="#fff" />
              <circle cx="28" cy="16" r="2.5" fill="#fff" />
              <path d="M12,2 Q6,-6 2,-8" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M12,22 Q6,30 2,32" stroke="#22d3ee" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          )}

          {activeTheme === "comet" && (
            <svg viewBox="0 0 32 32" className="dragon-head-svg">
              <defs>
                <radialGradient id="cometCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#818cf8" />
                </radialGradient>
              </defs>
              <circle cx="16" cy="16" r="12" fill="url(#cometCore)" filter="drop-shadow(0 0 10px #38bdf8)" />
              <polygon points="16,2 20,12 30,16 20,20 16,30 12,20 2,16 12,12" fill="#e0f2fe" opacity="0.8" />
            </svg>
          )}

          {activeTheme === "phoenix" && (
            <svg viewBox="0 0 36 28" className="dragon-head-svg">
              <defs>
                <linearGradient id="phoenixFire" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="45%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <path d="M4,14 C10,2 26,0 34,14 C26,28 10,26 4,14 Z" fill="url(#phoenixFire)" filter="drop-shadow(0 0 12px #fb923c)" />
              <circle cx="24" cy="10" r="2" fill="#fff" />
              <path d="M10,4 Q18,-4 26,2" stroke="#fde047" strokeWidth="2" fill="none" />
              <path d="M10,24 Q18,32 26,26" stroke="#fde047" strokeWidth="2" fill="none" />
            </svg>
          )}
        </div>

        {/* Trail Segments based on active theme */}
        {Array.from({ length: numSegments }).map((_, idx) => (
          <div
            key={idx}
            ref={(el) => (segmentsRef.current[idx] = el)}
            className={`dragon-segment segment-${idx} ${idx > numSegments - 5 ? "tail-tip" : ""}`}
          >
            {activeTheme === "dragon" && (
              <svg viewBox="0 0 24 24" className="dragon-segment-svg">
                <defs>
                  <linearGradient id={`cyanGlow-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r={Math.max(2, 9 - idx * 0.35)} fill={`url(#cyanGlow-${idx})`} />
                <path d="M12,2 L8,9 L16,9 Z" fill="#22d3ee" opacity={0.9 - idx * 0.03} />
                <path d="M12,22 L8,15 L16,15 Z" fill="#22d3ee" opacity={0.9 - idx * 0.03} />
              </svg>
            )}

            {activeTheme === "comet" && (
              <svg viewBox="0 0 24 24" className="dragon-segment-svg">
                <defs>
                  <radialGradient id={`cometGrad-${idx}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f0f9ff" stopOpacity={1 - idx * 0.04} />
                    <stop offset="60%" stopColor="#38bdf8" stopOpacity={0.9 - idx * 0.035} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="12" cy="12" r={Math.max(1.5, 11 - idx * 0.42)} fill={`url(#cometGrad-${idx})`} />
                {idx % 2 === 0 && (
                  <circle cx="12" cy="12" r={Math.max(1, 4 - idx * 0.15)} fill="#ffffff" opacity={0.8 - idx * 0.03} />
                )}
              </svg>
            )}

            {activeTheme === "phoenix" && (
              <svg viewBox="0 0 24 24" className="dragon-segment-svg">
                <defs>
                  <linearGradient id={`phoenixGrad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" stopOpacity={1 - idx * 0.035} />
                    <stop offset="50%" stopColor="#fb923c" stopOpacity={0.9 - idx * 0.035} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.8 - idx * 0.035} />
                  </linearGradient>
                </defs>
                <path
                  d="M12,2 C16,8 20,12 12,22 C4,12 8,8 12,2 Z"
                  fill={`url(#phoenixGrad-${idx})`}
                  transform={`scale(${Math.max(0.25, 1 - idx * 0.032)}) transform-origin(12 12)`}
                />
                <circle cx="12" cy="12" r={Math.max(1, 3 - idx * 0.1)} fill="#fde047" opacity={0.9 - idx * 0.03} />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* ── Click Ripple Rings ── */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={`cursor-click-ripple theme-${activeTheme}`}
          style={{ top: `${ripple.y}px`, left: `${ripple.x}px` }}
        />
      ))}

      {/* ── Click Particle Burst ── */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="cursor-click-particle"
          style={{
            top: `${p.y}px`,
            left: `${p.x}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            "--dx": p.dx,
            "--dy": p.dy,
          }}
        />
      ))}

      {/* ── Floating Keypress Pop Letters ── */}
      {keyPops.map((kp) => (
        <div
          key={kp.id}
          className="keyboard-letter-pop"
          style={{
            top: `${kp.y}px`,
            left: `${kp.x}px`,
            "--driftX": kp.driftX,
            "--rot": kp.rot,
          }}
        >
          {kp.char}
        </div>
      ))}

      {/* ── Right-Click Pulse Wave Ring ── */}
      {rightClickPulses.map((pulse) => (
        <div
          key={pulse.id}
          className="right-click-pulse"
          style={{ top: `${pulse.y}px`, left: `${pulse.x}px` }}
        />
      ))}
    </>
  );
}

// ── 3D Card Tilt Component ─────────────────────────────────────────────
function TiltCard({ children, className = "", style = {}, ...props }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(cardRef.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transformStyle: "preserve-3d", ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── Navbar Component ──────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // scroll spy
      const sections = data.navigation.map((n) => n.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`navbar ${scrolled ? "scrolled" : ""}`}
      >
        <div className="navbar-inner">
          <a href="#hero" className="navbar-logo" onClick={(e) => { e.preventDefault(); handleNav("hero"); }}>
            Mansura.
          </a>

          <div className="navbar-links">
            {data.navigation.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? "active" : ""}
                onClick={(e) => { e.preventDefault(); handleNav(item.id); }}
              >
                {item.label}
              </a>
            ))}
            <a href="#contact" className="navbar-cta" onClick={(e) => { e.preventDefault(); handleNav("contact"); }}>
              Get a Quote
            </a>
          </div>

          <div className={`mobile-menu-btn ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(!mobileOpen)}>
            <span /><span /><span />
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-nav open"
          >
            {data.navigation.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); handleNav(item.id); }}>
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Typewriter Hook ───────────────────────────────────────────────────
function useTypewriter(lines, typingSpeed = 70, pause = 2000) {
  const [text, setText] = useState("");
  const lineIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);

  useEffect(() => {
    const tick = () => {
      const currentLine = lines[lineIndex.current];

      if (!isDeleting.current) {
        charIndex.current++;
        setText(currentLine.slice(0, charIndex.current));

        if (charIndex.current === currentLine.length) {
          isDeleting.current = true;
          return setTimeout(tick, pause);
        }
      } else {
        charIndex.current--;
        setText(currentLine.slice(0, charIndex.current));

        if (charIndex.current === 0) {
          isDeleting.current = false;
          lineIndex.current = (lineIndex.current + 1) % lines.length;
        }
      }

      setTimeout(tick, isDeleting.current ? 35 : typingSpeed);
    };

    const timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, [lines, typingSpeed, pause]);

  return text;
}

// ── Hero Section ──────────────────────────────────────────────────────
function HeroSection() {
  const typed = useTypewriter(data.hero.typewriterLines);
  const heroRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll(".hero-glow-blob"),
        { scale: 0.8, opacity: 0.3 },
        {
          scale: 1.2,
          opacity: 0.7,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
    }
  }, []);

  return (
    <section id="hero" className="hero section" ref={heroRef}>
      <div className="hero-glow-blob hero-glow-1" />
      <div className="hero-glow-blob hero-glow-2" />

      <div className="container">
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="hero-badge">
            <span className="dot" />
            {data.hero.greeting}
          </motion.div>

          <motion.h1 variants={fadeInUp} className="hero-title">
            We Build <br />
            <span className="gradient-text">Digital Products</span>
            <br />That Matter
          </motion.h1>

          <motion.p variants={fadeInUp} className="hero-name">
            I'm <span>{data.profile.name}</span> — {data.profile.role}
          </motion.p>

          <motion.p variants={fadeInUp} className="hero-typewriter">
            {typed}<span className="cursor">|</span>
          </motion.p>

          <motion.p variants={fadeInUp} className="hero-description">
            {data.hero.subheadline}
          </motion.p>

          <motion.div variants={fadeInUp} className="hero-ctas">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="btn-primary"
              onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              🚀 {data.hero.ctaPrimary}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="btn-secondary"
              onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              📁 {data.hero.ctaSecondary}
            </motion.a>
          </motion.div>

          <motion.div variants={fadeInUp} className="hero-stats">
            {data.stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="hero-stat"
                whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.07)" }}
              >
                <div className="hero-stat-value">{stat.value}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Services Section ──────────────────────────────────────────────────
function ServicesSection() {
  return (
    <section id="services" className="section pattern-bg">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="section-header"
        >
          <span className="section-label">💼 What We Offer</span>
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            From concept to deployment, we provide end-to-end digital solutions
            tailored to your business needs.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="services-grid"
        >
          {data.services.map((service, i) => (
            <TiltCard
              key={i}
              variants={scaleUpSkew}
              className="service-card"
            >
              <span className="service-icon">{service.icon}</span>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-desc">{service.description}</p>
              <div className="service-tags">
                {service.tags.map((tag) => (
                  <span key={tag} className="service-tag">{tag}</span>
                ))}
              </div>
            </TiltCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Projects Section ──────────────────────────────────────────────────
function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeModalImages, setActiveModalImages] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = next (right-to-left), -1 = prev (left-to-right)

  const categories = ["all", ...new Set(data.projects.map((p) => p.category))];
  const filteredProjects = activeFilter === "all"
    ? data.projects
    : data.projects.filter((p) => p.category === activeFilter);

  const openPreview = (project, startIndex = 0) => {
    const images = project.screenshots || (project.image ? [project.image] : []);
    if (images.length > 0) {
      setActiveModalImages(images);
      setSelectedImageIndex(startIndex);
      setSlideDirection(1);
    }
  };

  const handleNextImage = () => {
    setSlideDirection(1);
    setSelectedImageIndex((prev) => (prev === activeModalImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setSlideDirection(-1);
    setSelectedImageIndex((prev) => (prev === 0 ? activeModalImages.length - 1 : prev - 1));
  };

  const handleDotClick = (idx) => {
    setSlideDirection(idx > selectedImageIndex ? 1 : -1);
    setSelectedImageIndex(idx);
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="section-header"
        >
          <span className="section-label">🛠️ Our Portfolio</span>
          <h2 className="section-title">Projects We've Delivered</h2>
          <p className="section-subtitle">
            Real projects, real results. From e-commerce platforms to mobile apps
            — we build products that perform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="projects-filter"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        <motion.div layout className="projects-grid">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <TiltCard
                layout
                initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                key={project.id}
                className="project-card"
                style={{ "--card-accent": project.accent }}
              >
              {project.image && (
                <div
                  className="project-banner"
                  onClick={() => openPreview(project, 0)}
                  style={{ cursor: "pointer" }}
                  title="Click to view screenshots"
                >
                  <img src={project.image} alt={project.name} loading="lazy" />
                  <span className="banner-hover-hint">🔍 View Screenshots</span>
                </div>
              )}
              <div className="project-icon">{project.icon}</div>
              <div className="project-type" style={{ color: project.accent }}>
                {project.type}
              </div>
              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
              <div className="project-links">
                {project.links.map((link, i) => {
                  const isImageLink = link.label.toLowerCase().includes("preview") || link.url.endsWith(".png") || link.url.endsWith(".jpg");
                  if (isImageLink) {
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => openPreview(project, 0)}
                        className="project-link"
                      >
                        🖼️ {link.label}
                      </button>
                    );
                  }
                  return (
                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="project-link">
                      {link.label} ↗
                    </a>
                  );
                })}
              </div>
            </TiltCard>
          ))}
        </AnimatePresence>
      </motion.div>
      </div>

      {/* Image Preview Lightbox Modal */}
      <AnimatePresence>
        {activeModalImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="image-modal-overlay"
            onClick={() => setActiveModalImages(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="image-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="image-modal-close"
                onClick={() => setActiveModalImages(null)}
                title="Close modal"
              >
                ✕
              </button>
              <div className="image-modal-main">
                {activeModalImages.length > 1 && (
                  <button
                    type="button"
                    className="image-modal-arrow image-modal-arrow-left"
                    onClick={handlePrevImage}
                    title="Previous image"
                  >
                    ❮
                  </button>
                )}
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.img
                    key={selectedImageIndex}
                    src={activeModalImages[selectedImageIndex]}
                    alt="Project screenshot"
                    custom={slideDirection}
                    initial={(dir) => ({
                      opacity: 0,
                      x: dir > 0 ? 80 : -80,
                      scale: 0.95,
                    })}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    }}
                    exit={(dir) => ({
                      opacity: 0,
                      x: dir > 0 ? -80 : 80,
                      scale: 0.95,
                    })}
                    transition={{
                      x: { type: "spring", stiffness: 350, damping: 30 },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 },
                    }}
                    className="image-modal-img"
                  />
                </AnimatePresence>
                {activeModalImages.length > 1 && (
                  <button
                    type="button"
                    className="image-modal-arrow image-modal-arrow-right"
                    onClick={handleNextImage}
                    title="Next image"
                  >
                    ❯
                  </button>
                )}
              </div>
              {activeModalImages.length > 1 && (
                <div className="image-modal-footer">
                  <span className="image-modal-counter">
                    {selectedImageIndex + 1} / {activeModalImages.length}
                  </span>
                  <div className="image-modal-dots">
                    {activeModalImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`image-modal-dot ${selectedImageIndex === idx ? "active" : ""}`}
                        onClick={() => handleDotClick(idx)}
                        title={`Go to image ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Skills Section ────────────────────────────────────────────────────
function SkillsSection() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const levelLabels = {
    Expertise: "★ Primary",
    Comfortable: "⚡ Proficient",
    Understanding: "📖 Familiar",
  };

  const currentGroup = data.skills[activeCategoryIndex] || data.skills[0];

  const handlePrev = () => {
    setActiveCategoryIndex((prev) => (prev === 0 ? data.skills.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveCategoryIndex((prev) => (prev === data.skills.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="skills" className="section pattern-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-label">🧠 Tech Stack</span>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            The tools and technologies our team uses to build world-class digital products.
          </p>
        </div>

        {/* Carousel Category Tabs + Navigation Arrows */}
        <div className="skills-carousel-nav">
          <div className="skills-tabs">
            {data.skills.map((group, idx) => (
              <button
                key={group.group}
                type="button"
                className={`skills-tab-btn ${activeCategoryIndex === idx ? "active" : ""}`}
                onClick={() => setActiveCategoryIndex(idx)}
              >
                <span>{group.icon}</span>
                <span>{group.group}</span>
              </button>
            ))}
          </div>

          <div className="skills-arrows">
            <button
              type="button"
              className="skills-arrow-btn"
              onClick={handlePrev}
              title="Previous Category"
            >
              ❮
            </button>
            <span className="skills-counter">
              {activeCategoryIndex + 1} / {data.skills.length}
            </span>
            <button
              type="button"
              className="skills-arrow-btn"
              onClick={handleNext}
              title="Next Category"
            >
              ❯
            </button>
          </div>
        </div>

        {/* Active Skill Category Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGroup.group}
            initial={{ opacity: 0, x: 40, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -40, rotateY: -10 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="skills-slide-container"
          >
            <div className="skill-group-header">
              <span className="skill-group-icon">{currentGroup.icon}</span>
              <span className="skill-group-title">{currentGroup.group}</span>
              <span className="skill-group-count">
                {currentGroup.items.length} {currentGroup.items.length === 1 ? "skill" : "skills"}
              </span>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="skills-grid"
            >
              {currentGroup.items.map((skill) => (
                <TiltCard
                  key={skill.name}
                  variants={fadeInUp}
                  className="skill-card"
                  style={{ "--skill-color": skill.color }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: skill.color,
                      opacity: 0.3,
                    }}
                  />

                  <div className="skill-top">
                    <div className="skill-name-row">
                      <span
                        className="skill-dot"
                        style={{ background: skill.color, boxShadow: `0 0 8px ${skill.color}66` }}
                      />
                      <span className="skill-name">{skill.name}</span>
                    </div>
                    <span className={`skill-badge ${skill.level.toLowerCase()}`}>
                      {levelLabels[skill.level]}
                    </span>
                  </div>

                  {skill.tags && (
                    <div className="skill-tags">
                      {skill.tags.map((tag) => (
                        <span key={tag} className="skill-tag-item">{tag}</span>
                      ))}
                    </div>
                  )}
                </TiltCard>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Experience Section ────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="section-header"
        >
          <span className="section-label">💼 Career Journey</span>
          <h2 className="section-title">Professional Experience</h2>
          <p className="section-subtitle">
            Our team's track record of delivering complex digital solutions.
          </p>
        </motion.div>

        <div className="experience-timeline">
          {data.experience.map((exp, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className={`timeline-item ${exp.current ? "current" : ""}`}
            >
              <div className="timeline-date">{exp.date}</div>
              <h3 className="timeline-role">{exp.role}</h3>
              <div className="timeline-company">@ {exp.company} · {exp.location}</div>
              <p className="timeline-desc">{exp.description}</p>
              <div className="timeline-tags">
                {exp.tags.map((tag) => (
                  <span key={tag} className="timeline-tag">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ width: "100%", maxWidth: "100%", margin: "48px 0 0" }}>
          <motion.h3
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 24, textAlign: "center" }}
          >
            Certifications & Achievements
          </motion.h3>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}
          >
            {data.achievements.map((ach, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{ padding: 24, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, transition: "var(--transition-fast)" }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{ach.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{ach.title}</div>
                <div style={{ fontSize: 13, color: "var(--accent-purple)", marginBottom: 6 }}>{ach.event}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{ach.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── About Section ─────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="section pattern-bg">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="section-header"
        >
          <span className="section-label">👥 Our Team</span>
          <h2 className="section-title">{data.about.headline}</h2>
          <p className="section-subtitle">{data.about.subtitle}</p>
        </motion.div>

        <div className="about-content">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            className="about-text-block"
          >
            <p className="about-text">{data.about.description}</p>
            <p className="about-text">{data.about.description2}</p>
            <div className="about-mission">
              💜 {data.about.mission}
            </div>
          </motion.div>

          <div className="about-sidebar">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              className="about-highlights"
            >
              <h3>What Sets Us Apart</h3>
              {data.about.teamHighlights.map((item, i) => (
                <div key={i} className="highlight-item">
                  <span className="highlight-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="education-cards"
            >
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                🎓 Education
              </h3>
              {data.education.map((edu) => (
                <motion.div
                  key={edu.id}
                  variants={fadeInUp}
                  whileHover={{ x: 4 }}
                  className="education-card"
                >
                  <div className="education-top">
                    <span className="education-uni">{edu.icon} {edu.university}</span>
                    <span className="education-period">{edu.period}</span>
                  </div>
                  <div className="education-degree">{edu.degree}</div>
                  {edu.gpa && <div className="education-gpa">{edu.gpa}</div>}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials Section ──────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="section-header"
        >
          <span className="section-label">💬 Client Feedback</span>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Don't just take our word for it — hear from the people we've worked with.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="testimonials-grid"
        >
          {data.testimonials.map((test, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="testimonial-card"
            >
              <div className="testimonial-quote">"</div>
              <div className="testimonial-stars">
                {"★".repeat(test.rating)}
              </div>
              <p className="testimonial-text">{test.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  {test.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="testimonial-info">
                  <div className="name">{test.name}</div>
                  <div className="role">{test.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Contact Section ───────────────────────────────────────────────────
function ContactSection() {
  const [status, setStatus] = useState("idle");
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form || !form.checkValidity()) return;

    setStatus("sending");
    const formData = new FormData(form);
    const name = formData.get("name");
    const userEmail = formData.get("email");
    const subject = formData.get("subject") || "New Portfolio Contact Message";
    const message = formData.get("message");

    const payload = {
      to: data.profile.email, // Send to mansuramira0273@gmail.com
      subject: `[Portfolio Inquiry] ${subject} from ${name}`,
      text: `Name: ${name}\nEmail: ${userEmail}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0a0a12; color: #f0f0f5; border-radius: 12px; border: 1px solid #a78bfa;">
          <h2 style="color: #a78bfa; margin-bottom: 16px;">🚀 New Portfolio Inquiry</h2>
          <div style="background-color: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${userEmail}" style="color: #60a5fa;">${userEmail}</a></p>
            <p style="margin: 6px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 8px; border-left: 4px solid #a78bfa;">
            <h3 style="margin-top: 0; color: #60a5fa;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #d1d5db;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #6b7280; text-align: center;">Sent via Mansura Mira Portfolio Contact Form</p>
        </div>
      `.trim(),
    };

    try {
      const res = await fetch("https://mailer-silk.vercel.app/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        throw new Error("Failed to send email");
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" className="section pattern-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-label">📬 Get In Touch</span>
          <h2 className="section-title">{data.contact.headline}</h2>
          <p className="section-subtitle">{data.contact.subtitle}</p>
        </div>

        <div className="contact-grid">
          {/* Left — info */}
          <div className="reveal">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              Let's Discuss Your Project
            </h3>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              Whether you need a complete web platform, a mobile app, or a scalable backend system — we're here to help. Reach out and let's make it happen.
            </p>

            <div className="contact-info-list">
              {data.contact.info.map((item, i) => (
                <a key={i} href={item.href} target={item.href.startsWith("mailto") ? "_self" : "_blank"} rel="noreferrer" className="contact-info-item">
                  <div className="contact-icon">{item.icon}</div>
                  <div>
                    <div className="contact-label">{item.label}</div>
                    <div className="contact-value">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="contact-form reveal">
            <h3>Send Us a Message</h3>
            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name <span className="required">*</span></label>
                <input name="name" type="text" required className="form-input" placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Your Email <span className="required">*</span></label>
                <input name="email" type="email" required className="form-input" placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input name="subject" type="text" className="form-input" placeholder="Project Inquiry" />
              </div>
              <div className="form-group">
                <label className="form-label">Message <span className="required">*</span></label>
                <textarea name="message" required className="form-textarea" placeholder="Tell us about your project..." rows={5} />
              </div>
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className={`form-submit ${status === "sent" ? "sent" : status === "error" ? "error" : ""}`}
              >
                {status === "sending" ? "Sending..." : status === "sent" ? "✓ Message Sent!" : status === "error" ? "Failed — Try Again" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────
function Footer() {
  const socials = [
    { icon: "🐙", href: data.profile.links.github },
    { icon: "💼", href: data.profile.links.linkedin },
    { icon: "💬", href: data.profile.links.whatsapp },
    { icon: "📧", href: `mailto:${data.profile.email}` },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-socials">
          {socials.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer" className="footer-social">
              {s.icon}
            </a>
          ))}
        </div>
        <p className="footer-text">
          © {new Date().getFullYear()} <strong>{data.profile.name}</strong>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ── Scroll Reveal Hook ────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function Index() {
  useScrollReveal();

  // Re-observe after filter changes
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const mutationObs = new MutationObserver(() => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => observer.observe(el));
    });

    mutationObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObs.disconnect();
    };
  }, []);

  return (
    <>
      <DragonCursor />
      <Navbar />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <ServicesSection />
        <div className="section-divider" />
        <ProjectsSection />
        <div className="section-divider" />
        <SkillsSection />
        <div className="section-divider" />
        <ExperienceSection />
        <div className="section-divider" />
        <AboutSection />
        <div className="section-divider" />
        <TestimonialsSection />
        <div className="section-divider" />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
