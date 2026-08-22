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

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1200);
    camera.position.set(0, 0, 140);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Central 3D Geometry Cluster (Multi-tier Wireframe Core)
    const cluster = new THREE.Group();
    scene.add(cluster);

    // Main Outer Torus Knot
    const torusGeo = new THREE.TorusKnotGeometry(24, 6, 140, 24, 2, 3);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    cluster.add(torusMesh);

    // Inner Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(14, 2);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xd4d4d8,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    cluster.add(icoMesh);

    // Glowing Vertices
    const icoPointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.0,
      transparent: true,
      opacity: 0.9,
    });
    const icoPoints = new THREE.Points(icoGeo, icoPointsMat);
    cluster.add(icoPoints);

    // Secondary Floating Monoliths (Orbiting Geometric Elements)
    const monolithCount = 4;
    const monoliths = [];
    for (let m = 0; m < monolithCount; m++) {
      const geo = new THREE.OctahedronGeometry(6 + m * 2, 0);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (m / monolithCount) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 75, (m - 1.5) * 40, Math.sin(angle) * 60);
      scene.add(mesh);
      monoliths.push({ mesh, angle, speed: 0.15 + m * 0.05, radius: 70 + m * 15, yOffset: (m - 1.5) * 45 });
    }

    // 4. Interactive 3D Particle Wave Field (Spanning Entire Depth)
    const particleCount = 2400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalY = new Float32Array(particleCount);
    const originalX = new Float32Array(particleCount);
    const originalZ = new Float32Array(particleCount);

    const rangeX = 360;
    const rangeZ = 450;
    const depthSpan = 300;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * rangeX;
      const z = (Math.random() - 0.5) * rangeZ;
      const y = (Math.sin(x * 0.03) + Math.cos(z * 0.03)) * 8 - ((z + 200) / 400) * depthSpan + 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalX[i] = x;
      originalY[i] = y;
      originalZ[i] = z;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle Texture
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 16;
    particleCanvas.height = 16;
    const ctx = particleCanvas.getContext("2d");
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.65)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);

    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.4,
      map: particleTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Floating Ambient Sparkles / Deep Dust Field
    const dustCount = 450;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 320;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 280;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.4,
      map: particleTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 6. Smooth Mouse & Scroll Physics State
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
      targetMouseX = (e.clientX - halfX) / halfX; // Normalized -1 to +1
      targetMouseY = (e.clientY - halfY) / halfY; // Normalized -1 to +1
    };

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      targetScroll = window.scrollY / maxScroll; // Normalized 0 to 1
      const delta = window.scrollY - lastScrollY;
      scrollVelocity = Math.abs(delta) * 0.05;
      lastScrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial sync
    handleScroll();

    // 7. Animation Loop with Spring Lerp
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp for mouse & scroll
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;
      currentScroll += (targetScroll - currentScroll) * 0.05;
      scrollVelocity *= 0.92; // Decay scroll velocity

      // Camera motion: descends & pivots as user scrolls through different sections
      const targetCamY = -currentScroll * 120 + mouseY * -12;
      const targetCamX = mouseX * 20 + Math.sin(currentScroll * Math.PI * 2) * 15;
      const targetCamZ = 135 - Math.sin(currentScroll * Math.PI) * 35;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(
        mouseX * 10,
        camera.position.y * 0.7,
        -50
      );

      // Central Cluster rotation & positioning along scroll
      cluster.rotation.x = elapsedTime * 0.15 + currentScroll * Math.PI * 1.5 + mouseY * 0.4;
      cluster.rotation.y = elapsedTime * 0.2 + currentScroll * Math.PI * 2 + mouseX * 0.5;
      cluster.rotation.z = Math.sin(elapsedTime * 0.12) * 0.15;

      cluster.position.x = mouseX * 15 + Math.sin(currentScroll * Math.PI * 2) * 20;
      cluster.position.y = -currentScroll * 100 + 10 + mouseY * -8;

      // Pulse the central wireframe scales subtly
      const scale = 1 + Math.sin(elapsedTime * 0.8) * 0.04 + scrollVelocity * 0.08;
      torusMesh.scale.set(scale, scale, scale);

      // Orbiting Monoliths
      for (let m = 0; m < monoliths.length; m++) {
        const item = monoliths[m];
        const curAngle = item.angle + elapsedTime * item.speed + currentScroll * Math.PI;
        item.mesh.position.x = Math.cos(curAngle) * item.radius + mouseX * 10;
        item.mesh.position.z = Math.sin(curAngle) * item.radius;
        item.mesh.position.y = item.yOffset - currentScroll * 90 + Math.sin(elapsedTime + m) * 6;
        item.mesh.rotation.x += 0.01;
        item.mesh.rotation.y += 0.015;
      }

      // Dynamic Particle Wave Undulation + Mouse Interaction + Scroll Surge
      const posArr = particleGeo.attributes.position.array;
      const waveFreq = 1.6 + scrollVelocity * 1.5;

      for (let i = 0; i < particleCount; i++) {
        const x = originalX[i];
        const z = originalZ[i];

        // Distance from mouse projection
        const dx = x - mouseX * 80;
        const dz = z - (mouseY * 60 - currentScroll * 100);
        const dist = Math.sqrt(dx * dx + dz * dz);
        const mouseRipple = dist < 70 ? (1 - dist / 70) * 12 : 0;

        posArr[i * 3 + 1] =
          originalY[i] +
          Math.sin(elapsedTime * waveFreq + x * 0.035 + z * 0.025) * 5 +
          Math.cos(elapsedTime * 1.2 + z * 0.04) * 4 +
          mouseRipple -
          currentScroll * 60;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Dust rotation
      dustParticles.rotation.y = elapsedTime * 0.015 + currentScroll * 0.5;
      dustParticles.rotation.x = elapsedTime * 0.01 + mouseY * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Handling
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 9. Complete WebGL Lifecycle Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      torusGeo.dispose();
      torusMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      icoPointsMat.dispose();

      monoliths.forEach((m) => {
        m.mesh.geometry.dispose();
        m.mesh.material.dispose();
      });

      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
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
