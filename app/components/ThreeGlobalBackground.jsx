import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeGlobalBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.0015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1200);
    camera.position.set(0, 0, 135);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Central Brand Sculpture: DEVSRECIPE CHEF HAT + CIRCUIT BOARD + TERMINAL
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Initial scale and position
    logoGroup.position.set(24, -2, 0);
    logoGroup.scale.set(1.15, 1.15, 1.15);

    // --- Texture Generator: High-Intensity Glowing Spark & Lens Flare ---
    const createGlowTexture = (size = 64) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const center = size / 2;
      const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(244, 244, 245, 0.85)");
      grad.addColorStop(0.45, "rgba(212, 212, 216, 0.35)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(canvas);
    };

    const glowTexture = createGlowTexture(64);

    // --- A. CHEF HAT OUTLINE (3D Curved Splines & Specular Halo) ---
    const hatPoints = [
      new THREE.Vector3(-18, 0, 0),
      new THREE.Vector3(-22, 4, 0),
      new THREE.Vector3(-28, 12, 0),
      new THREE.Vector3(-26, 24, 0),
      new THREE.Vector3(-18, 30, 0),
      new THREE.Vector3(-14, 38, 0),
      new THREE.Vector3(0, 44, 0),
      new THREE.Vector3(14, 38, 0),
      new THREE.Vector3(18, 30, 0),
      new THREE.Vector3(26, 24, 0),
      new THREE.Vector3(28, 12, 0),
      new THREE.Vector3(22, 4, 0),
      new THREE.Vector3(18, 0, 0),
    ];

    const hatCurve = new THREE.CatmullRomCurve3(hatPoints, false);
    const hatTubeGeo = new THREE.TubeGeometry(hatCurve, 120, 0.9, 12, false);
    const hatTubeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const hatMesh = new THREE.Mesh(hatTubeGeo, hatTubeMat);
    logoGroup.add(hatMesh);

    // Outer wireframe halo around the hat
    const hatWireMat = new THREE.MeshBasicMaterial({
      color: 0xa1a1aa,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const hatWireMesh = new THREE.Mesh(new THREE.TubeGeometry(hatCurve, 60, 2.4, 8, false), hatWireMat);
    logoGroup.add(hatWireMesh);

    // Continuous Rim Energy Wave (Glow Packet Orbiting Hat Contour)
    const rimPacketMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const rimPacket1 = new THREE.Sprite(rimPacketMat);
    rimPacket1.scale.set(6, 6, 1);
    logoGroup.add(rimPacket1);

    const rimPacket2 = new THREE.Sprite(rimPacketMat.clone());
    rimPacket2.scale.set(4.5, 4.5, 1);
    logoGroup.add(rimPacket2);

    // --- B. BOTTOM TERMINAL CLI BASE (Obsidian Box with Animated > _ ) ---
    const terminalGroup = new THREE.Group();
    terminalGroup.position.set(0, -11, 0);
    logoGroup.add(terminalGroup);

    // Terminal Box Outer Edges
    const boxGeo = new THREE.BoxGeometry(38, 18, 4);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });
    const boxMesh = new THREE.LineSegments(boxEdges, boxLineMat);
    terminalGroup.add(boxMesh);

    // Terminal Semi-Transparent Obsidian Glass Body
    const boxBodyMat = new THREE.MeshBasicMaterial({
      color: 0x09090b,
      transparent: true,
      opacity: 0.88,
    });
    const boxBody = new THREE.Mesh(boxGeo, boxBodyMat);
    boxBody.position.z = -0.5;
    terminalGroup.add(boxBody);

    // CLI Prompt: Chevron '>'
    const chevronGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-13, 3.5, 2.2),
      new THREE.Vector3(-8.5, 0, 2.2),
      new THREE.Vector3(-13, -3.5, 2.2),
    ]);
    const promptMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
    });
    const chevronLine = new THREE.Line(chevronGeo, promptMat);
    terminalGroup.add(chevronLine);

    // CLI Prompt: Underscore '_' Cursor
    const cursorGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-6, -3.5, 2.2),
      new THREE.Vector3(-0.5, -3.5, 2.2),
    ]);
    const cursorLine = new THREE.Line(cursorGeo, promptMat.clone());
    terminalGroup.add(cursorLine);

    // Command Stream Dots inside Terminal
    const cmdDotsGroup = new THREE.Group();
    terminalGroup.add(cmdDotsGroup);
    const cmdDots = [];
    for (let d = 0; d < 4; d++) {
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(0.6, 12),
        new THREE.MeshBasicMaterial({ color: 0xd4d4d8, transparent: true, opacity: 0.7 })
      );
      dot.position.set(2 + d * 3.2, -3.5, 2.2);
      cmdDotsGroup.add(dot);
      cmdDots.push(dot);
    }

    // --- C. CIRCUIT BOARD TRACES & NODES ---
    const circuitBranches = [
      // 1. Central main trunk
      [new THREE.Vector3(0, -2, 0), new THREE.Vector3(0, 14, 0), new THREE.Vector3(0, 32, 0)],
      // 2. Left high branch
      [new THREE.Vector3(0, 6, 0), new THREE.Vector3(-8, 16, 0), new THREE.Vector3(-12, 28, 0)],
      // 3. Left wide branch
      [new THREE.Vector3(0, 2, 0), new THREE.Vector3(-10, 10, 0), new THREE.Vector3(-20, 12, 0), new THREE.Vector3(-22, 20, 0)],
      // 4. Left outer ear branch
      [new THREE.Vector3(0, -1, 0), new THREE.Vector3(-14, 2, 0), new THREE.Vector3(-20, 4, 0)],
      // 5. Left vertical feeder
      [new THREE.Vector3(-8, 16, 0), new THREE.Vector3(-6, 24, 0), new THREE.Vector3(-6, 32, 0)],
      // 6. Right high branch
      [new THREE.Vector3(0, 6, 0), new THREE.Vector3(8, 16, 0), new THREE.Vector3(12, 28, 0)],
      // 7. Right wide branch
      [new THREE.Vector3(0, 2, 0), new THREE.Vector3(10, 10, 0), new THREE.Vector3(20, 12, 0), new THREE.Vector3(22, 20, 0)],
      // 8. Right outer ear branch
      [new THREE.Vector3(0, -1, 0), new THREE.Vector3(14, 2, 0), new THREE.Vector3(20, 4, 0)],
      // 9. Right vertical feeder
      [new THREE.Vector3(8, 16, 0), new THREE.Vector3(6, 24, 0), new THREE.Vector3(6, 32, 0)],
    ];

    const circuitCurves = [];
    const circuitTubeMat = new THREE.MeshBasicMaterial({
      color: 0x52525b,
      transparent: true,
      opacity: 0.75,
    });

    const nodePositions = [];
    const nodeMeshes = [];

    circuitBranches.forEach((branchPoints) => {
      const curve = new THREE.CatmullRomCurve3(branchPoints, false, "catmullrom", 0.1);
      circuitCurves.push(curve);

      // Render circuit trace tube
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.48, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, circuitTubeMat);
      logoGroup.add(tubeMesh);

      // Add endpoint node
      const endPt = branchPoints[branchPoints.length - 1];
      nodePositions.push(endPt);
    });

    // Circuit Nodes (Glowing Pads / Rings with Dynamic Capacitor Breathing)
    const nodeRingGeo = new THREE.RingGeometry(0.9, 2.0, 16);
    const nodeCoreGeo = new THREE.CircleGeometry(0.8, 16);

    nodePositions.forEach((pos, idx) => {
      const nodeSubGroup = new THREE.Group();
      nodeSubGroup.position.copy(pos);
      nodeSubGroup.position.z += 0.2;

      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(nodeRingGeo, ringMat);
      nodeSubGroup.add(ring);

      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x18181b,
        side: THREE.DoubleSide,
      });
      const core = new THREE.Mesh(nodeCoreGeo, coreMat);
      core.position.z += 0.05;
      nodeSubGroup.add(core);

      // Bright central diamond spark
      const spark = new THREE.Sprite(rimPacketMat.clone());
      spark.scale.set(2.5, 2.5, 1);
      spark.position.z += 0.1;
      nodeSubGroup.add(spark);

      logoGroup.add(nodeSubGroup);
      nodeMeshes.push({ group: nodeSubGroup, ringMat, spark, baseScale: 1, phase: idx * 0.7 });
    });

    // --- D. LIGHTNING & ELECTRICAL ENERGY PULSES WITH COMET TRAILS ---
    const pulseCount = 18;
    const pulses = [];

    for (let p = 0; p < pulseCount; p++) {
      // Main glowing photon head
      const sprite = new THREE.Sprite(rimPacketMat.clone());
      sprite.scale.set(4.2, 4.2, 1);
      logoGroup.add(sprite);

      // Trailing sub-glow comet spark
      const trail = new THREE.Sprite(rimPacketMat.clone());
      trail.scale.set(2.4, 2.4, 1);
      logoGroup.add(trail);

      pulses.push({
        sprite,
        trail,
        curveIndex: p % circuitCurves.length,
        progress: (p / pulseCount),
        speed: 0.35 + (p % 3) * 0.12,
      });
    }

    // Dynamic Electrical Arc Discharge Line (Lightning Arcs jumping between nodes)
    const arcGeo = new THREE.BufferGeometry();
    const arcPositions = new Float32Array(30 * 3);
    arcGeo.setAttribute("position", new THREE.BufferAttribute(arcPositions, 3));
    const arcMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      linewidth: 2,
    });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    logoGroup.add(arcLine);

    let arcActive = false;
    let arcTimer = 0;
    let arcStartNode = 0;
    let arcEndNode = 1;

    // --- E. EMITTED MICRO-SPARKS FROM CROWN NODES ---
    const sparkCount = 40;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkVelocities = [];

    for (let s = 0; s < sparkCount; s++) {
      sparkPositions[s * 3] = 0;
      sparkPositions[s * 3 + 1] = 0;
      sparkPositions[s * 3 + 2] = 0;
      sparkVelocities.push({
        x: (Math.random() - 0.5) * 0.4,
        y: Math.random() * 0.5 + 0.2,
        z: (Math.random() - 0.5) * 0.4,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        nodeIdx: Math.floor(Math.random() * nodePositions.length),
      });
    }

    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      map: glowTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    logoGroup.add(sparkParticles);

    // --- F. BACKGROUND 3D PARTICLE WAVE CONSTELLATION ---
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalY = new Float32Array(particleCount);
    const originalX = new Float32Array(particleCount);
    const originalZ = new Float32Array(particleCount);

    const rangeX = 360;
    const rangeZ = 420;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * rangeX;
      const z = (Math.random() - 0.5) * rangeZ;
      const y = (Math.sin(x * 0.03) + Math.cos(z * 0.03)) * 8 - 20;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalX[i] = x;
      originalY[i] = y;
      originalZ[i] = z;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const bgParticleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.8,
      map: glowTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, bgParticleMat);
    scene.add(particles);

    // Ambient Specular Dust
    const dustCount = 350;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 320;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 280;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 260;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      map: glowTexture,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // --- G. MOUSE & SCROLL STATE ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let currentScroll = 0;
    let targetScroll = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;

    const handleMouseMove = (e) => {
      const halfX = window.innerWidth / 2;
      const halfY = window.innerHeight / 2;
      targetMouseX = (e.clientX - halfX) / halfX;
      targetMouseY = (e.clientY - halfY) / halfY;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      targetScroll = window.scrollY / maxScroll;
      const delta = window.scrollY - lastScrollY;
      scrollVelocity = Math.abs(delta) * 0.04;
      lastScrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // --- H. ANIMATION LOOP ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      currentScroll += (targetScroll - currentScroll) * 0.05;
      scrollVelocity *= 0.92;

      // 1. Hat Rim Continuous Energy Pulses
      const rimT1 = (elapsedTime * 0.25) % 1;
      const rimPt1 = hatCurve.getPointAt(rimT1);
      rimPacket1.position.copy(rimPt1);
      rimPacket1.position.z += 1.0;

      const rimT2 = (elapsedTime * 0.25 + 0.5) % 1;
      const rimPt2 = hatCurve.getPointAt(rimT2);
      rimPacket2.position.copy(rimPt2);
      rimPacket2.position.z += 1.0;

      // 2. Circuit Lightning Pulses & Trailing Sparks
      pulses.forEach((p) => {
        p.progress += (p.speed + scrollVelocity * 0.6) * 0.014;
        if (p.progress >= 1) {
          p.progress = 0;
          p.curveIndex = (p.curveIndex + 1) % circuitCurves.length;
        }

        const curve = circuitCurves[p.curveIndex];
        const pt = curve.getPointAt(p.progress);
        p.sprite.position.copy(pt);
        p.sprite.position.z += 1.2;

        // Trailing comet spark
        const trailProgress = Math.max(p.progress - 0.08, 0);
        const trailPt = curve.getPointAt(trailProgress);
        p.trail.position.copy(trailPt);
        p.trail.position.z += 0.9;

        // Dynamic bloom surge
        const intensity = 0.75 + Math.sin(elapsedTime * 9 + p.progress * 12) * 0.25;
        p.sprite.material.opacity = intensity;
        p.trail.material.opacity = intensity * 0.5;
      });

      // 3. Circuit Nodes Breathing / Throbbing with Silver Sparkles
      nodeMeshes.forEach((node) => {
        const pulse = 1 + Math.sin(elapsedTime * 3.5 + node.phase) * 0.15;
        node.group.scale.set(pulse, pulse, 1);
        node.ringMat.opacity = 0.7 + Math.sin(elapsedTime * 4 + node.phase) * 0.28;
        node.spark.material.opacity = 0.6 + Math.sin(elapsedTime * 5 + node.phase) * 0.4;
      });

      // 4. Random Electrical Arc Lightning Discharges
      arcTimer++;
      if (arcTimer > 60 && Math.random() < 0.04) {
        arcActive = true;
        arcTimer = 0;
        arcStartNode = Math.floor(Math.random() * nodePositions.length);
        arcEndNode = (arcStartNode + 1 + Math.floor(Math.random() * (nodePositions.length - 1))) % nodePositions.length;
      }

      if (arcActive) {
        const p1 = nodePositions[arcStartNode];
        const p2 = nodePositions[arcEndNode];
        const arcArr = arcGeo.attributes.position.array;
        const segments = 10;

        for (let j = 0; j <= segments; j++) {
          const ratio = j / segments;
          const jitterX = (Math.random() - 0.5) * (j > 0 && j < segments ? 3.5 : 0);
          const jitterY = (Math.random() - 0.5) * (j > 0 && j < segments ? 3.5 : 0);
          const jitterZ = (Math.random() - 0.5) * (j > 0 && j < segments ? 2.5 : 0);

          arcArr[j * 3] = p1.x + (p2.x - p1.x) * ratio + jitterX;
          arcArr[j * 3 + 1] = p1.y + (p2.y - p1.y) * ratio + jitterY;
          arcArr[j * 3 + 2] = p1.z + (p2.z - p1.z) * ratio + jitterZ + 0.8;
        }

        arcGeo.attributes.position.needsUpdate = true;
        arcMat.opacity = 0.95;

        if (Math.random() < 0.25) {
          arcActive = false;
          arcMat.opacity = 0;
        }
      }

      // 5. Crown Node Emitted Micro-Sparks
      const sparkArr = sparkGeo.attributes.position.array;
      for (let s = 0; s < sparkCount; s++) {
        const vel = sparkVelocities[s];
        vel.life++;

        if (vel.life > vel.maxLife) {
          vel.life = 0;
          vel.nodeIdx = Math.floor(Math.random() * nodePositions.length);
          const origin = nodePositions[vel.nodeIdx];
          sparkArr[s * 3] = origin.x;
          sparkArr[s * 3 + 1] = origin.y;
          sparkArr[s * 3 + 2] = origin.z + 0.5;
          vel.x = (Math.random() - 0.5) * 0.35;
          vel.y = Math.random() * 0.4 + 0.15;
          vel.z = (Math.random() - 0.5) * 0.35;
        } else {
          sparkArr[s * 3] += vel.x;
          sparkArr[s * 3 + 1] += vel.y;
          sparkArr[s * 3 + 2] += vel.z;
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;

      // 6. Terminal Cursor Blinking & Animated Command Dots
      if (cursorLine && cursorLine.material) {
        cursorLine.material.opacity = Math.floor(elapsedTime * 2.2) % 2 === 0 ? 0.95 : 0.15;
      }

      cmdDots.forEach((dot, idx) => {
        const dotPhase = (elapsedTime * 2 + idx * 0.5) % 3;
        dot.material.opacity = dotPhase > 1 ? 0.85 : 0.2;
      });

      // 7. 3D Brand Logo Rotation, Sine Hover & Perspective Tilt
      logoGroup.rotation.y = Math.sin(elapsedTime * 0.45) * 0.18 + mouseX * 0.35;
      logoGroup.rotation.x = -mouseY * 0.25 + Math.cos(elapsedTime * 0.35) * 0.09;
      logoGroup.rotation.z = Math.sin(elapsedTime * 0.25) * 0.05;

      // Position along scroll depth
      const targetLogoX = (width < 768 ? 0 : 28) + mouseX * 10 + Math.sin(currentScroll * Math.PI) * 15;
      const targetLogoY = -currentScroll * 90 + mouseY * -8 + Math.sin(elapsedTime * 0.9) * 2.5;
      const targetLogoZ = -currentScroll * 60;

      logoGroup.position.x += (targetLogoX - logoGroup.position.x) * 0.05;
      logoGroup.position.y += (targetLogoY - logoGroup.position.y) * 0.05;
      logoGroup.position.z += (targetLogoZ - logoGroup.position.z) * 0.05;

      // Camera motion & parallax
      camera.position.x += (mouseX * 16 - camera.position.x) * 0.05;
      camera.position.y += (-currentScroll * 60 - mouseY * 10 - camera.position.y) * 0.05;
      camera.lookAt(0, camera.position.y * 0.4, 0);

      // Particle wave undulation
      const posArr = particleGeo.attributes.position.array;
      const waveFreq = 1.4 + scrollVelocity * 1.5;

      for (let i = 0; i < particleCount; i++) {
        const x = originalX[i];
        const z = originalZ[i];

        const dx = x - mouseX * 80;
        const dz = z - (mouseY * 60 - currentScroll * 100);
        const dist = Math.sqrt(dx * dx + dz * dz);
        const mouseRipple = dist < 65 ? (1 - dist / 65) * 10 : 0;

        posArr[i * 3 + 1] =
          originalY[i] +
          Math.sin(elapsedTime * waveFreq + x * 0.03 + z * 0.02) * 4 +
          Math.cos(elapsedTime * 1.1 + z * 0.035) * 3 +
          mouseRipple -
          currentScroll * 50;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Ambient dust drift
      dustParticles.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // --- I. RESIZE & DISPOSAL ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (width < 768) {
        logoGroup.scale.set(0.75, 0.75, 0.75);
      } else {
        logoGroup.scale.set(1.15, 1.15, 1.15);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      hatTubeGeo.dispose();
      hatTubeMat.dispose();
      boxGeo.dispose();
      boxEdges.dispose();
      boxLineMat.dispose();
      boxBodyMat.dispose();
      promptMat.dispose();
      circuitTubeMat.dispose();
      nodeRingGeo.dispose();
      nodeCoreGeo.dispose();
      arcGeo.dispose();
      arcMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      particleGeo.dispose();
      bgParticleMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
