import { useEffect, useRef } from "react";
import * as THREE from "three";

type InfraSceneProps = {
  scrollProgress: number;
};

function InfraScene({ scrollProgress }: InfraSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(scrollProgress);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.35, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeometry = new THREE.IcosahedronGeometry(1.12, 2);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x79f7d0,
      emissive: 0x0c6a5b,
      emissiveIntensity: 0.42,
      metalness: 0.32,
      roughness: 0.18,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const innerCoreGeometry = new THREE.DodecahedronGeometry(0.46, 0);
    const innerCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0x11263f,
      emissive: 0x80ffe2,
      emissiveIntensity: 0.38,
      metalness: 0.18,
      roughness: 0.24,
    });
    const innerCore = new THREE.Mesh(innerCoreGeometry, innerCoreMaterial);
    group.add(innerCore);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.86,
    });
    const rings = [1.75, 2.16, 2.58].map((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 8, 128), ringMaterial.clone());
      ring.rotation.set(index * 0.55, index * 0.28, index * 0.34);
      group.add(ring);
      return ring;
    });

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2f7ff,
      emissive: 0x234bff,
      emissiveIntensity: 0.22,
      roughness: 0.28,
    });
    const nodeGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const nodes = Array.from({ length: 32 }, (_, index) => {
      const angle = (index / 32) * Math.PI * 2;
      const radius = 2.05 + (index % 4) * 0.26;
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(Math.cos(angle) * radius, Math.sin(index * 1.7) * 0.72, Math.sin(angle) * radius * 0.36);
      group.add(node);
      return node;
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x80ffe2,
      transparent: true,
      opacity: 0.18,
    });
    const linePoints = nodes.flatMap((node) => [new THREE.Vector3(0, 0, 0), node.position.clone()]);
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    scene.add(new THREE.AmbientLight(0xb8dcff, 0.78));
    const keyLight = new THREE.PointLight(0x8bfff0, 2.1, 12);
    keyLight.position.set(3.2, 2.8, 4.6);
    scene.add(keyLight);
    const warmLight = new THREE.PointLight(0xffbf69, 1.1, 10);
    warmLight.position.set(-3.6, -2.4, 3.8);
    scene.add(warmLight);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      camera.aspect = Math.max(width, 1) / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    let animationFrame = 0;
    const startedAt = performance.now();
    const render = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const scrollTurn = scrollRef.current * Math.PI * 1.8;
      group.rotation.y = scrollTurn + elapsed * (reduceMotion ? 0 : 0.12);
      group.rotation.x = -0.18 + scrollRef.current * 0.45;
      core.rotation.x = elapsed * (reduceMotion ? 0 : 0.32);
      core.rotation.z = elapsed * (reduceMotion ? 0 : 0.22);
      innerCore.rotation.y = -elapsed * (reduceMotion ? 0 : 0.28);
      rings.forEach((ring, index) => {
        ring.rotation.z += reduceMotion ? 0 : 0.0028 * (index + 1);
        ring.rotation.y += reduceMotion ? 0 : 0.0018 * (index + 1);
      });
      nodes.forEach((node, index) => {
        const pulse = Math.sin(elapsed * 1.8 + index) * 0.045;
        node.scale.setScalar(1 + (reduceMotion ? 0 : pulse));
      });
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    render();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerCoreGeometry.dispose();
      innerCoreMaterial.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="infra-scene" ref={mountRef} aria-hidden="true" />;
}

export default InfraScene;
