
import React, { useEffect, useRef, useState } from 'react';
import { X, Maximize, Minimize, ChevronsUp, ChevronsDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useAppContext } from '@/contexts/AppContext';

// Добавляем типы для Three.js
type ThreeScene = {
  scene: any;
  camera: any;
  renderer: any;
  cube: any;
};

interface PropertyTourViewerProps {
  imageUrl: string;
  propertyId: string;
  title: string;
}

export const PropertyTourViewer = ({ imageUrl, propertyId, title }: PropertyTourViewerProps) => {
  const { language } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ThreeScene | null>(null);
  
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    
    // Загрузка необходимых скриптов для 3D
    const loadThreeJS = async () => {
      try {
        setIsLoading(true);
        
        // В реальном проекте здесь бы загружалась полноценная 3D-модель помещения
        // Здесь мы создаем упрощенный пример с кубом для демонстрации
        if (typeof window !== 'undefined' && containerRef.current) {
          // Если THREE еще не загружен - загрузить
          if (!(window as any).THREE) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.async = true;
            
            await new Promise((resolve) => {
              script.onload = resolve;
              document.body.appendChild(script);
            });
          }
          
          const THREE = (window as any).THREE;
          
          // Инициализация сцены Three.js
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0xf0f0f0);
          
          const camera = new THREE.PerspectiveCamera(75, 
            containerRef.current.clientWidth / containerRef.current.clientHeight, 
            0.1, 1000);
          camera.position.z = 5;
          
          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
          
          // Очищаем контейнер перед добавлением нового канваса
          if (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
          containerRef.current.appendChild(renderer.domElement);
          
          // Добавление освещения
          const ambientLight = new THREE.AmbientLight(0x404040, 1);
          scene.add(ambientLight);
          
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(1, 1, 1);
          scene.add(directionalLight);
          
          // Создание простой сцены с текстурированным кубом
          const textureLoader = new THREE.TextureLoader();
          const texture = textureLoader.load(imageUrl, () => {
            setIsLoading(false);
          });
          
          const materials = [
            new THREE.MeshBasicMaterial({ map: texture }),
            new THREE.MeshBasicMaterial({ map: texture }),
            new THREE.MeshBasicMaterial({ map: texture }),
            new THREE.MeshBasicMaterial({ map: texture }),
            new THREE.MeshBasicMaterial({ map: texture }),
            new THREE.MeshBasicMaterial({ map: texture }),
          ];
          
          const geometry = new THREE.BoxGeometry(3, 3, 3);
          const cube = new THREE.Mesh(geometry, materials);
          scene.add(cube);
          
          // Сохраняем ссылки для анимации и управления
          sceneRef.current = { scene, camera, renderer, cube };
          
          // Функция анимации
          const animate = () => {
            if (!sceneRef.current) return;
            
            requestAnimationFrame(animate);
            
            sceneRef.current.cube.rotation.x += 0.005;
            sceneRef.current.cube.rotation.y += 0.005;
            
            sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
          };
          
          // Обработчик изменения размера окна
          const handleResize = () => {
            if (!containerRef.current || !sceneRef.current) return;
            
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            
            sceneRef.current.camera.aspect = width / height;
            sceneRef.current.camera.updateProjectionMatrix();
            sceneRef.current.renderer.setSize(width, height);
          };
          
          window.addEventListener('resize', handleResize);
          
          // Запуск анимации
          animate();
          
          // Очистка при размонтировании
          return () => {
            window.removeEventListener('resize', handleResize);
            if (sceneRef.current) {
              sceneRef.current.renderer.dispose();
              sceneRef.current = null;
            }
          };
        }
      } catch (error) {
        console.error('Error initializing 3D tour:', error);
        setIsLoading(false);
      }
    };
    
    loadThreeJS();
  }, [isOpen, imageUrl]);
  
  const resetCamera = () => {
    if (!sceneRef.current) return;
    
    sceneRef.current.camera.position.z = 5;
    sceneRef.current.camera.position.y = 0;
    sceneRef.current.camera.position.x = 0;
    sceneRef.current.camera.rotation.set(0, 0, 0);
  };
  
  const zoomIn = () => {
    if (!sceneRef.current) return;
    sceneRef.current.camera.position.z -= 0.5;
  };
  
  const zoomOut = () => {
    if (!sceneRef.current) return;
    sceneRef.current.camera.position.z += 0.5;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-2 gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
        >
          <Maximize className="h-4 w-4" />
          {language === 'ru' ? '3D-тур помещения' : '3D тур бөлмесі'}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[90vw] h-[80vh] p-0">
        <div className="relative w-full h-full flex flex-col">
          {/* Заголовок */}
          <div className="p-4 bg-background flex justify-between items-center border-b">
            <h3 className="text-lg font-semibold">
              {language === 'ru' ? '3D-тур: ' : '3D тур: '} {title}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Контейнер для 3D */}
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {language === 'ru' ? 'Загрузка 3D-тура...' : '3D турды жүктеу...'}
                  </p>
                </div>
              </div>
            )}
            
            <div ref={containerRef} className="w-full h-full"></div>
            
            {/* Элементы управления */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button variant="secondary" size="icon" onClick={zoomIn}>
                <ChevronsUp className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={zoomOut}>
                <ChevronsDown className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={resetCamera}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Информация */}
            <div className="absolute bottom-4 left-4 p-3 bg-background/80 rounded-md shadow-sm">
              <p className="text-xs text-muted-foreground">
                {language === 'ru' ? 'Используйте мышь для вращения, колесико для приближения' : 'Айналдыру үшін тышқанды, жақындату үшін дөңгелекті пайдаланыңыз'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
