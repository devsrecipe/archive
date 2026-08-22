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
    scene.fog = new THREE.FogExp2(0x050507, 0.0016);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1200);
    camera.position.set(0, 0, 135);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 3. Central Brand Sculpture: DEVSRECIPE CHEF HAT + CIRCUIT BOARD + TERMINAL
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    // Initial scale and position
    logoGroup.position.set(24, -2, 0);
    logoGroup.scale.set(1.15, 1.15, 1.15);

    // --- A. CHEF HAT OUTLINE (3D Curved Splines) ---
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
    const hatTubeGeo = new THREE.TubeGeometry(hatCurve, 120, 0.8, 12, false);
    const hatTubeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,
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
      opacity: 0.25,
    });
    const hatWireMesh = new THREE.Mesh(new THREE.TubeGeometry(hatCurve, 60, 2.2, 8, false), hatWireMat);
    logoGroup.add(hatWireMesh);

    // --- B. BOTTOM TERMINAL CLI BASE (Obsidian Box with > _ ) ---
    const terminalGroup = new THREE.Group();
    terminalGroup.position.set(0, -11, 0);
    logoGroup.add(terminalGroup);

    // Terminal Box (Rounded Box / Wireframe)
    const boxGeo = new THREE.BoxGeometry(38, 18, 4);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const boxLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      linewidth: 2,
    });
    const boxMesh = new THREE.LineSegments(boxEdges, boxLineMat);
    terminalGroup.add(boxMesh);

    // Terminal Semi-Transparent Glass Body
    const boxBodyMat = new THREE.MeshBasicMaterial({
      color: 0x09090b,
      transparent: true,
      opacity: 0.85,
    });
    const boxBody = new THREE.Mesh(boxGeo, boxBodyMat);
    boxBody.position.z = -0.5;
    terminalGroup.add(boxBody);

    // CLI Prompt: Chevron '>'
    const chevronGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-12, 3, 2.2),
      new THREE.Vector3(-8, 0, 2.2),
      new THREE.Vector3(-12, -3, 2.2),
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
      new THREE.Vector3(-5, -3, 2.2),
      new THREE.Vector3(0, -3, 2.2),
    ]);
    const cursorLine = new THREE.Line(cursorGeo, promptMat.clone());
    terminalGroup.add(cursorLine);

    // Secondary line inside terminal
    const cmdLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(3, -3, 2.2),
      new THREE.Vector3(8, -3, 2.2),
    ]);
    const cmdLine = new THREE.Line(cmdLineGeo, new THREE.LineBasicMaterial({ color: 0x71717a, transparent: true, opacity: 0.5 }));
    terminalGroup.add(cmdLine);

    // --- C. CIRCUIT BOARD MOTHERBOARD TRACES & NODES ---
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
      opacity: 0.7,
    });

    const nodePositions = [];

    circuitBranches.forEach((branchPoints) => {
      const curve = new THREE.CatmullRomCurve3(branchPoints, false, "catmullrom", 0.1);
      circuitCurves.push(curve);

      // Render circuit trace tube
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.45, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, circuitTubeMat);
      logoGroup.add(tubeMesh);

      // Add endpoint node
      const endPt = branchPoints[branchPoints.length - 1];
      nodePositions.push(endPt);
    });

    // Circuit Nodes (Glowing Pads / Rings at ends of traces)
    const nodeRingGeo = new THREE.RingGeometry(0.8, 1.8, 16);
    const nodeRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });

    const nodeCoreGeo = new THREE.CircleGeometry(0.7, 16);
    const nodeCoreMat = new THREE.MeshBasicMaterial({
      color: 0x18181b,
      side: THREE.DoubleSide,
    });

    nodePositions.forEach((pos) => {
      const ring = new THREE.Mesh(nodeRingGeo, nodeRingMat);
      ring.position.copy(pos);
      ring.position.z += 0.2;
      logoGroup.add(ring);

      const core = new THREE.Mesh(nodeCoreGeo, nodeCoreMat);
      core.position.copy(pos);
      core.position.z += 0.25;
      logoGroup.add(core);
    });

    // --- D. LIGHTNING & ELECTRICAL DATA PULSES (Flowing through Circuit Pathways) ---
    const pulseCount = 14;
    const pulses = [];
    const pulseCanvas = document.createElement("canvas");
    pulseCanvas.width = 32;
    pulseCanvas.height = 32;
    const pCtx = pulseCanvas.getContext("2d");
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    pGrad.addColorStop(0.2, "rgba(255, 255, 255, 0.9)");
    pGrad.addColorStop(0.5, "rgba(228, 228, 231, 0.4)");
    pGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pulseTexture = new THREE.CanvasTexture(pulseCanvas);
    const pulseMat = new THREE.SpriteMaterial({
      map: pulseTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });

    for (let p = 0; p < pulseCount; p++) {
      const sprite = new THREE.Sprite(pulseMat.clone());
      sprite.scale.set(3.5, 3.5, 1);
      logoGroup.add(sprite);

      pulses.push({
        sprite,
        curveIndex: p % circuitCurves.length,
        progress: (p / pulseCount),
        speed: 0.25 + Math.random() * 0.2,
      });
    }

    // --- E. BACKGROUND 3D PARTICLE WAVE CONSTELLATION ---
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
      map: pulseTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, bgParticleMat);
    scene.add(particles);

    // Floating Specular Dust
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
      map: pulseTexture,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // --- F. MOUSE & SCROLL REACTION ---
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
      targetMouseX = (e.clientX - halfX) / halfX; // -1 to +1
      targetMouseY = (e.clientY - halfY) / halfY; // -1 to +1
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

    // --- G. ANIMATION LOOP ---
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Lerp mouse & scroll
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      currentScroll += (targetScroll - currentScroll) * 0.05;
      scrollVelocity *= 0.92;

      // Update Electrical Lightning Pulses flowing along the circuit traces
      pulses.forEach((p) => {
        p.progress += (p.speed + scrollVelocity * 0.5) * 0.012;
        if (p.progress >= 1) {
          p.progress = 0;
          p.curveIndex = (p.curveIndex + 1) % circuitCurves.length;
        }

        const curve = circuitCurves[p.curveIndex];
        const pt = curve.getPointAt(p.progress);
        p.sprite.position.copy(pt);
        p.sprite.position.z += 1.2;

        // Dynamic pulse brightness surge
        const intensity = 0.7 + Math.sin(elapsedTime * 8 + p.progress * 10) * 0.3;
        p.sprite.material.opacity = intensity;
      });

      // Terminal Cursor Blinking animation
      if (cursorLine && cursorLine.material) {
        cursorLine.material.opacity = Math.floor(elapsedTime * 2.2) % 2 === 0 ? 0.95 : 0.15;
      }

      // 3D Brand Logo Rotation & Perspective Tilt
      logoGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.15 + mouseX * 0.35;
      logoGroup.rotation.x = -mouseY * 0.25 + Math.cos(elapsedTime * 0.3) * 0.08;
      logoGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.04;

      // Move brand logo along scroll depth and screen position
      // In Hero: situated on right side (x: 24, y: 0)
      // As user scrolls: glides smoothly through perspective
      const targetLogoX = (width < 768 ? 0 : 28) + mouseX * 10 + Math.sin(currentScroll * Math.PI) * 15;
      const targetLogoY = -currentScroll * 90 + mouseY * -8 + Math.sin(elapsedTime * 0.8) * 2;
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

    // --- H. RESIZE & DISPOSAL ---
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Responsive scale for mobile vs desktop
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
      nodeRingMat.dispose();
      nodeCoreGeo.dispose();
      nodeCoreMat.dispose();
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
