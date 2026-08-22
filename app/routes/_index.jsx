import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import gsap from "gsap";
import ThreeGlobalBackground from "../components/ThreeGlobalBackground";
import {
  Globe,
  Smartphone,
  Zap,
  Cloud,
  ShoppingBag,
  Layout,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Eye,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
  Folder,
  Sparkles,
  Terminal,
  ShieldCheck,
  Layers,
  Cpu,
  Activity,
} from "lucide-react";
import data from "../data/portfolio.json";

// ── Custom SVG Icons ──────────────────────────────────────────────────
function LinkedInIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// ── Icon Registry ─────────────────────────────────────────────────────
const iconRegistry = {
  Globe,
  Smartphone,
  Zap,
  Cloud,
  ShoppingBag,
  Layout,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  Mail,
  Phone,
  MapPin,
  Linkedin: LinkedInIcon,
  Github: GitHubIcon,
  MessageSquare,
  Folder,
  Sparkles,
  Terminal,
  ShieldCheck,
  Layers,
  Cpu,
  Activity,
};

function RenderIcon({ name, size = 20, className = "" }) {
  const IconComponent = iconRegistry[name] || Sparkles;
  return <IconComponent size={size} className={className} />;
}

// ── Motion Animation Variants ─────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 35, rotateX: -6 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 15, mass: 0.8 },
  },
};

const scaleUpSkew = {
  hidden: { opacity: 0, scale: 0.92, y: 25 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 110, damping: 14 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

// ── Advanced 3D Tilt Card with Dynamic Cursor Spotlight Reflection ────
function TiltCard({ children, className = "", style = {}, ...props }) {
  const cardRef = useRef(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setGlare({ x, y, opacity: 1 });

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.35,
      ease: "power2.out",
      transformPerspective: 1200,
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{ transformStyle: "preserve-3d", position: "relative", ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Specular Glare Reflection */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 4,
          opacity: glare.opacity,
          transition: "opacity 0.25s ease",
          background: `radial-gradient(circle 260px at ${glare.x}px ${glare.y}px, rgba(255, 255, 255, 0.08) 0%, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ── Navigation Bar ────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = data.navigation.map((n) => n.id);
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`navbar ${scrolled ? "scrolled" : ""}`}
      >
        <div className="navbar-inner">
          <a href="#hero" className="navbar-logo" onClick={(e) => { e.preventDefault(); handleNav("hero"); }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Code2 size={22} style={{ color: "#ffffff" }} />
              {data.profile.name}
            </span>
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
              Start Project
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
function useTypewriter(lines, typingSpeed = 60, pause = 2200) {
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

      setTimeout(tick, isDeleting.current ? 30 : typingSpeed);
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

  return (
    <section id="hero" className="hero section" ref={heroRef} style={{ position: "relative" }}>
      {/* Subtle Specular Glow Cones */}
      <div className="hero-glow-blob hero-glow-1" />
      <div className="hero-glow-blob hero-glow-2" />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
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
            Cook Your Idea <br />
            <span className="gradient-text">with devsrecipe</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="hero-name">
            Custom web platforms, mobile apps & scalable cloud software built for founders and businesses.
          </motion.p>

          <motion.p variants={fadeInUp} className="hero-typewriter">
            {typed}<span className="cursor">|</span>
          </motion.p>

          <motion.p variants={fadeInUp} className="hero-description">
            {data.hero.subheadline}
          </motion.p>

          <motion.div variants={fadeInUp} className="hero-ctas">
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              href="#contact"
              className="btn-primary"
              onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <span>{data.hero.ctaPrimary}</span>
              <ArrowRight size={16} />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              href="#projects"
              className="btn-secondary"
              onClick={(e) => { e.preventDefault(); document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <Folder size={16} />
              <span>{data.hero.ctaSecondary}</span>
            </motion.a>
          </motion.div>

          <motion.div variants={fadeInUp} className="hero-stats">
            {data.stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="hero-stat"
                whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.06)" }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
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

// ── How It Works (How We Cook Your Idea) ─────────────────────────────
function HowItWorksSection() {
  return (
    <section id="recipe" className="section">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeInUp}
          className="section-header"
        >
          <span className="section-label">
            <Sparkles size={14} /> The Devsrecipe Method
          </span>
          <h2 className="section-title">How We Cook Your Idea</h2>
          <p className="section-subtitle">
            Zero tech knowledge required. You bring the business vision, and we prepare all the ingredients — from UI design to production coding, payments, and cloud launch.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {data.recipeSteps?.map((step) => (
            <TiltCard
              key={step.step}
              variants={scaleUpSkew}
              className="service-card"
              style={{ padding: "30px 24px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#ffffff",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    padding: "4px 12px",
                    borderRadius: 8,
                  }}
                >
                  {step.step}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
                  {step.subtitle}
                </span>
              </div>
              <h3 className="service-title" style={{ fontSize: 18, marginBottom: 8 }}>{step.title}</h3>
              <p className="service-desc" style={{ fontSize: 13, marginBottom: 0, lineHeight: 1.7 }}>{step.description}</p>
            </TiltCard>
          ))}
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
          <span className="section-label">
            <Briefcase size={14} /> What We Offer
          </span>
          <h2 className="section-title">Engineering Services</h2>
          <p className="section-subtitle">
            From technical discovery to cloud deployment, devsrecipe builds resilient software solutions for web and mobile.
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
              <div className="service-icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 10, background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.15)", marginBottom: 16 }}>
                <RenderIcon name={service.icon} size={22} />
              </div>
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
  const [slideDirection, setSlideDirection] = useState(1);

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
          <span className="section-label">
            <Code2 size={14} /> Engineering Portfolio
          </span>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Production systems, mobile platforms, and enterprise web applications architected by devsrecipe.
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
              >
                {project.image && (
                  <div
                    className="project-banner"
                    onClick={() => openPreview(project, 0)}
                    style={{ cursor: "pointer" }}
                    title="Click to view screenshots"
                  >
                    <img src={project.image} alt={project.name} loading="lazy" />
                    <span className="banner-hover-hint">
                      <Eye size={14} /> View Screenshots
                    </span>
                  </div>
                )}
                <div className="project-icon" style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <RenderIcon name={project.icon} size={20} />
                  <span className="project-type" style={{ color: "#a1a1aa", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {project.type}
                  </span>
                </div>
                <h3 className="project-name" style={{ marginTop: 8 }}>{project.name}</h3>
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
                          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                        >
                          <Eye size={14} /> {link.label}
                        </button>
                      );
                    }
                    return (
                      <a key={i} href={link.url} target="_blank" rel="noreferrer" className="project-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span>{link.label}</span>
                        <ExternalLink size={14} />
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
                <X size={20} />
              </button>
              <div className="image-modal-main">
                {activeModalImages.length > 1 && (
                  <button
                    type="button"
                    className="image-modal-arrow image-modal-arrow-left"
                    onClick={handlePrevImage}
                    title="Previous image"
                  >
                    <ChevronLeft size={24} />
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
                    <ChevronRight size={24} />
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
    Expertise: "Primary Stack",
    Proficient: "Proficient",
    Comfortable: "Proficient",
    Understanding: "Familiar",
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
          <span className="section-label">
            <Zap size={14} /> Skills & Stack
          </span>
          <h2 className="section-title">Technical Expertise</h2>
          <p className="section-subtitle">
            The core tools, languages, and frameworks devsrecipe leverages to build high-performance applications.
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
                <RenderIcon name={group.icon} size={16} />
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
              <ChevronLeft size={18} />
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
              <ChevronRight size={18} />
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
              <RenderIcon name={currentGroup.icon} size={20} />
              <span className="skill-group-title" style={{ marginLeft: 8 }}>{currentGroup.group}</span>
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
                  style={{ "--skill-color": "#ffffff" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "2px",
                      background: "rgba(255, 255, 255, 0.3)",
                    }}
                  />

                  <div className="skill-top">
                    <div className="skill-name-row">
                      <span
                        className="skill-dot"
                        style={{ background: "#ffffff", boxShadow: `0 0 8px rgba(255, 255, 255, 0.4)` }}
                      />
                      <span className="skill-name">{skill.name}</span>
                    </div>
                    <span className={`skill-badge ${skill.level.toLowerCase()}`}>
                      {levelLabels[skill.level] || skill.level}
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
          <span className="section-label">
            <Briefcase size={14} /> Career & Practice
          </span>
          <h2 className="section-title">Engineering Experience</h2>
          <p className="section-subtitle">
            Our timeline of leadership, architecture design, and production code delivery.
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
            Certifications & Technical Credentials
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
                whileHover={{ y: -4 }}
                style={{ padding: 24, background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: 16, transition: "var(--transition-fast)" }}
              >
                <div style={{ marginBottom: 12, color: "#ffffff" }}>
                  <RenderIcon name={ach.icon} size={26} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{ach.title}</div>
                <div style={{ fontSize: 13, color: "#a1a1aa", marginBottom: 6 }}>{ach.event}</div>
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
          <span className="section-label">
            <Globe size={14} /> Our Studio
          </span>
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
            <div className="about-mission" style={{ borderLeftColor: "#ffffff" }}>
              <Terminal size={18} style={{ display: "inline-block", marginRight: 8, verticalAlign: "middle" }} />
              {data.about.mission}
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
              <h3>Studio Highlights</h3>
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
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <GraduationCap size={18} /> Education & Academic Background
              </h3>
              {data.education.map((edu) => (
                <motion.div
                  key={edu.id}
                  variants={fadeInUp}
                  whileHover={{ x: 4 }}
                  className="education-card"
                >
                  <div className="education-top">
                    <span className="education-uni" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <RenderIcon name={edu.icon} size={16} />
                      {edu.university}
                    </span>
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
          <span className="section-label">
            <MessageSquare size={14} /> Client Endorsements
          </span>
          <h2 className="section-title">Client Feedback</h2>
          <p className="section-subtitle">
            What technical leads and founders say about collaborating with devsrecipe.
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
              whileHover={{ y: -6 }}
              className="testimonial-card"
            >
              <div className="testimonial-quote">"</div>
              <div className="testimonial-stars" style={{ color: "#ffffff" }}>
                {"★".repeat(test.rating)}
              </div>
              <p className="testimonial-text">{test.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: "rgba(255, 255, 255, 0.1)", color: "#ffffff", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
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
    const subject = formData.get("subject") || "New devsrecipe Project Inquiry";
    const message = formData.get("message");

    const payload = {
      to: data.profile.email,
      subject: `[devsrecipe Inquiry] ${subject} from ${name}`,
      text: `Name: ${name}\nEmail: ${userEmail}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #050505; color: #ffffff; border-radius: 12px; border: 1px solid #333333;">
          <h2 style="color: #ffffff; margin-bottom: 16px;">devsrecipe — New Technical Inquiry</h2>
          <div style="background-color: rgba(255, 255, 255, 0.05); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
            <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${userEmail}" style="color: #ffffff;">${userEmail}</a></p>
            <p style="margin: 6px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="background-color: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 8px; border-left: 4px solid #ffffff;">
            <h3 style="margin-top: 0; color: #ffffff;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #a1a1aa;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #71717a; text-align: center;">Sent via devsrecipe Contact Form</p>
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
        throw new Error("Failed to send message");
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
          <span className="section-label">
            <Mail size={14} /> Get In Touch
          </span>
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
              Whether you require custom web architecture, mobile application engineering, or cloud system optimization — devsrecipe is ready to help.
            </p>

            <div className="contact-info-list">
              {data.contact.info.map((item, i) => (
                <a key={i} href={item.href} target={item.href.startsWith("mailto") ? "_self" : "_blank"} rel="noreferrer" className="contact-info-item">
                  <div className="contact-icon" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
                    <RenderIcon name={item.icon} size={18} />
                  </div>
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
                <input name="subject" type="text" className="form-input" placeholder="Project Engineering Inquiry" />
              </div>
              <div className="form-group">
                <label className="form-label">Message <span className="required">*</span></label>
                <textarea name="message" required className="form-textarea" placeholder="Describe your software requirements and timeline..." rows={5} />
              </div>
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className={`form-submit ${status === "sent" ? "sent" : status === "error" ? "error" : ""}`}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {status === "sending" ? (
                  "Sending..."
                ) : status === "sent" ? (
                  <>
                    <Check size={16} /> Message Sent!
                  </>
                ) : status === "error" ? (
                  "Failed — Try Again"
                ) : (
                  <>
                    <span>Send Message</span>
                    <ArrowRight size={16} />
                  </>
                )}
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
    { icon: "Github", href: data.profile.links.github },
    { icon: "Linkedin", href: data.profile.links.linkedin },
    { icon: "Phone", href: data.profile.links.whatsapp },
    { icon: "Mail", href: `mailto:${data.profile.email}` },
  ];

  return (
    <footer className="footer" style={{ borderTop: "1px solid var(--border-subtle)", background: "#000000" }}>
      <div className="footer-inner">
        <div className="footer-socials">
          {socials.map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer" className="footer-social" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#ffffff" }}>
              <RenderIcon name={s.icon} size={18} />
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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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
      {/* Full-Website Interactive Three.js 3D WebGL Background (Mouse & Scroll Reactive) */}
      <ThreeGlobalBackground />

      {/* Scroll-Linked Framer Motion Progress Bar */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />
      <Navbar />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <HowItWorksSection />
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

