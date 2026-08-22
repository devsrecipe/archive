import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.0018);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 140);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Central Geometry: High-end Monochrome Wireframe + Points Torus Knot & Icosahedron
    const group = new THREE.Group();
    scene.add(group);

    // Main Torus Knot (Outer wireframe sculpture)
    const torusGeo = new THREE.TorusKnotGeometry(22, 5.5, 120, 24, 2, 3);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    group.add(torusMesh);

    // Inner Icosahedron with subtle silver glow
    const icoGeo = new THREE.IcosahedronGeometry(13, 2);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xd4d4d8,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    group.add(icoMesh);

    // Inner points (Luminous vertices)
    const icoPointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.8,
      transparent: true,
      opacity: 0.85,
    });
    const icoPoints = new THREE.Points(icoGeo, icoPointsMat);
    group.add(icoPoints);

    // 4. Interactive 3D Particle Wave Field
    const particleCount = 1800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalY = new Float32Array(particleCount);
    const scales = new Float32Array(particleCount);

    const rangeX = 260;
    const rangeZ = 200;

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * rangeX;
      const z = (Math.random() - 0.5) * rangeZ;
      const y = (Math.sin(x * 0.04) + Math.cos(z * 0.04)) * 6 - 25;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalY[i] = y;
      scales[i] = Math.random() * 1.5 + 0.8;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle Material (Pure White / Silver dots with soft depth fade)
    const particleCanvas = document.createElement("canvas");
    particleCanvas.width = 16;
    particleCanvas.height = 16;
    const ctx = particleCanvas.getContext("2d");
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.6)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);

    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2.2,
      map: particleTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Floating Dust / Specular Sparkles Field
    const dustCount = 350;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 220;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 180;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      map: particleTexture,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // 6. Smooth Mouse Parallax & Physics Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      targetX = (e.clientX - windowHalfX) * 0.05;
      targetY = (e.clientY - windowHalfY) * 0.05;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 7. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Group rotation (Central Sculpture)
      group.rotation.x = elapsedTime * 0.15 + mouseY * 0.01;
      group.rotation.y = elapsedTime * 0.2 + mouseX * 0.01;
      group.rotation.z = Math.sin(elapsedTime * 0.1) * 0.1;
      group.position.x = mouseX * 0.3;
      group.position.y = -mouseY * 0.3 + 4;

      // Pulse the central wireframe scales subtly
      const scale = 1 + Math.sin(elapsedTime * 0.8) * 0.03;
      torusMesh.scale.set(scale, scale, scale);

      // Undulate Particle Field
      const posArr = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const x = posArr[i * 3];
        const z = posArr[i * 3 + 2];
        posArr[i * 3 + 1] =
          originalY[i] +
          Math.sin(elapsedTime * 1.5 + x * 0.05 + z * 0.03) * 4 +
          Math.cos(elapsedTime * 1.2 + z * 0.05) * 3;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Rotate dust particles slowly
      dustParticles.rotation.y = elapsedTime * 0.02;
      dustParticles.rotation.x = elapsedTime * 0.015;

      // Camera parallax
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handling
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth || window.innerWidth;
      const newHeight = containerRef.current.clientHeight || window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // 9. Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
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
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
