import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface RoomVRProps {
    imageUrl?: string;
}

const RoomVR: React.FC<RoomVRProps> = ({ imageUrl = "/panorama.jpg" }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            1,
            1100
        );
        camera.position.set(0, 0, 0);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Create sphere geometry (inverted)
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        // Load texture
        const textureLoader = new THREE.TextureLoader();
        let mesh: THREE.Mesh | null = null;

        textureLoader.load(
            imageUrl,
            (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;

                const material = new THREE.MeshBasicMaterial({
                    map: texture
                });

                mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                setLoading(false);
                setError(null);
            },
            (progress) => {
                console.log('Loading:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
            },
            (err) => {
                console.error('Error loading texture:', err);
                setError('Failed to load image. Using fallback...');

                // Fallback: Create a gradient material
                const material = new THREE.MeshBasicMaterial({
                    color: 0x44aa88,
                    wireframe: false
                });
                mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                setLoading(false);
            }
        );

        // Mouse/touch controls
        let isUserInteracting = false;
        let onPointerDownPointerX = 0;
        let onPointerDownPointerY = 0;
        let lon = 0;
        let lat = 0;
        let onPointerDownLon = 0;
        let onPointerDownLat = 0;

        const onPointerDown = (event: PointerEvent) => {
            isUserInteracting = true;
            onPointerDownPointerX = event.clientX;
            onPointerDownPointerY = event.clientY;
            onPointerDownLon = lon;
            onPointerDownLat = lat;
        };

        const onPointerMove = (event: PointerEvent) => {
            if (isUserInteracting) {
                lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
                lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
            }
        };

        const onPointerUp = () => {
            isUserInteracting = false;
        };

        const onWheel = (event: WheelEvent) => {
            event.preventDefault();
            const fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.MathUtils.clamp(fov, 30, 90);
            camera.updateProjectionMatrix();
        };

        // Add event listeners
        container.addEventListener('pointerdown', onPointerDown);
        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerup', onPointerUp);
        container.addEventListener('wheel', onWheel, { passive: false });

        // Animation
        const animate = () => {
            requestAnimationFrame(animate);
            update();
        };

        const update = () => {
            if (!isUserInteracting) {
                lon += 0.05;
            }

            lat = Math.max(-85, Math.min(85, lat));

            const phi = THREE.MathUtils.degToRad(90 - lat);
            const theta = THREE.MathUtils.degToRad(lon);

            const x = 500 * Math.sin(phi) * Math.cos(theta);
            const y = 500 * Math.cos(phi);
            const z = 500 * Math.sin(phi) * Math.sin(theta);

            camera.lookAt(x, y, z);

            renderer.render(scene, camera);
        };

        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            container.removeEventListener('pointerdown', onPointerDown);
            container.removeEventListener('pointermove', onPointerMove);
            container.removeEventListener('pointerup', onPointerUp);
            container.removeEventListener('wheel', onWheel);
            window.removeEventListener('resize', handleResize);

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            renderer.dispose();
            geometry.dispose();
            if (mesh) {
                if (mesh.material instanceof THREE.Material) {
                    mesh.material.dispose();
                }
            }
        };
    }, [imageUrl]);

    return (
        <div style={{ width: '100%', height: '100vh', position: 'relative', backgroundColor: '#000' }}>
            {/* Loading */}
            {loading && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.8)',
                        padding: '20px 40px',
                        borderRadius: 10,
                        color: 'white',
                        zIndex: 100,
                        fontSize: 18,
                        fontWeight: 'bold',
                    }}
                >
                    ⏳ Loading 360° View...
                </div>
            )}

            {/* Error */}
            {error && (
                <div
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(239, 68, 68, 0.9)',
                        padding: '12px 24px',
                        borderRadius: 8,
                        color: 'white',
                        zIndex: 100,
                        fontSize: 14,
                    }}
                >
                    ⚠️ {error}
                </div>
            )}

            {/* Instructions */}
            <div
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    background: 'rgba(0,0,0,0.7)',
                    padding: '12px 20px',
                    borderRadius: 8,
                    color: 'white',
                    zIndex: 10,
                    fontSize: 14,
                    fontWeight: '500',
                }}
            >
                🖱️ Drag to look around | 🖲️ Scroll to zoom
            </div>

            {/* Info badge */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    background: 'rgba(0,0,0,0.7)',
                    padding: '8px 16px',
                    borderRadius: 8,
                    color: 'white',
                    zIndex: 10,
                    fontSize: 12,
                }}
            >
                🏨 360° Room View
            </div>

            {/* Three.js Canvas */}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'grab',
                    touchAction: 'none'
                }}
            />
        </div>
    );
};

export default RoomVR;