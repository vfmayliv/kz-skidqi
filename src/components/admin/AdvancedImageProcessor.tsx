
import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Download, 
  AlertTriangle,
  CheckCircle2,
  X,
  Eye
} from 'lucide-react';

interface ImageProcessingResult {
  originalUrl: string;
  processedUrl?: string;
  fileName: string;
  size: number;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface AdvancedImageProcessorProps {
  images: ImageProcessingResult[];
  onImagesChange: (images: ImageProcessingResult[]) => void;
  maxImages?: number;
  allowedFormats?: string[];
  maxFileSize?: number; // MB
}

export const AdvancedImageProcessor = ({
  images,
  onImagesChange,
  maxImages = 10,
  allowedFormats = ['jpg', 'jpeg', 'png', 'webp'],
  maxFileSize = 10
}: AdvancedImageProcessorProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bulkUrls, setBulkUrls] = useState('');

  const processUrlsFromText = useCallback(async (urlText: string) => {
    const urls = urlText.split('\n')
      .map(url => url.trim())
      .filter(url => url && isValidUrl(url));

    if (urls.length === 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не найдено валидных URL изображений"
      });
      return;
    }

    if (images.length + urls.length > maxImages) {
      toast({
        variant: "destructive",
        title: "Превышен лимит",
        description: `Максимальное количество изображений: ${maxImages}`
      });
      return;
    }

    setIsProcessing(true);
    const newImages: ImageProcessingResult[] = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      setUploadProgress((i / urls.length) * 100);

      try {
        const result = await processImageUrl(url);
        newImages.push(result);
      } catch (error: any) {
        newImages.push({
          originalUrl: url,
          fileName: getFileNameFromUrl(url),
          size: 0,
          format: 'unknown',
          status: 'error',
          error: error.message
        });
      }
    }

    onImagesChange([...images, ...newImages]);
    setUploadProgress(100);
    setBulkUrls('');
    
    setTimeout(() => {
      setIsProcessing(false);
      setUploadProgress(0);
    }, 1000);

    toast({
      title: "Обработка завершена",
      description: `Обработано ${newImages.length} изображений`
    });
  }, [images, maxImages, onImagesChange, toast]);

  const processImageUrl = async (url: string): Promise<ImageProcessingResult> => {
    // Проверяем доступность изображения
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      throw new Error(`Изображение недоступно: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('URL не ссылается на изображение');
    }

    const contentLength = response.headers.get('content-length');
    const size = contentLength ? parseInt(contentLength) : 0;
    const format = contentType.split('/')[1];

    if (size > maxFileSize * 1024 * 1024) {
      throw new Error(`Размер файла превышает ${maxFileSize}MB`);
    }

    if (!allowedFormats.includes(format.toLowerCase())) {
      throw new Error(`Неподдерживаемый формат: ${format}`);
    }

    // В реальном приложении здесь была бы обработка и загрузка в Supabase Storage
    // Пока возвращаем исходный URL
    return {
      originalUrl: url,
      processedUrl: url,
      fileName: getFileNameFromUrl(url),
      size,
      format,
      status: 'completed'
    };
  };

  const uploadFiles = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      toast({
        variant: "destructive",
        title: "Превышен лимит",
        description: `Максимальное количество изображений: ${maxImages}`
      });
      return;
    }

    setIsProcessing(true);
    const newImages: ImageProcessingResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress((i / files.length) * 100);

      try {
        const result = await processFile(file);
        newImages.push(result);
      } catch (error: any) {
        newImages.push({
          originalUrl: '',
          fileName: file.name,
          size: file.size,
          format: file.type.split('/')[1] || 'unknown',
          status: 'error',
          error: error.message
        });
      }
    }

    onImagesChange([...images, ...newImages]);
    setUploadProgress(100);
    
    setTimeout(() => {
      setIsProcessing(false);
      setUploadProgress(0);
    }, 1000);
  };

  const processFile = async (file: File): Promise<ImageProcessingResult> => {
    // Проверки файла
    if (file.size > maxFileSize * 1024 * 1024) {
      throw new Error(`Размер файла превышает ${maxFileSize}MB`);
    }

    const format = file.type.split('/')[1];
    if (!allowedFormats.includes(format.toLowerCase())) {
      throw new Error(`Неподдерживаемый формат: ${format}`);
    }

    // В реальном приложении здесь была бы загрузка в Supabase Storage
    const tempUrl = URL.createObjectURL(file);

    return {
      originalUrl: tempUrl,
      processedUrl: tempUrl,
      fileName: file.name,
      size: file.size,
      format,
      status: 'completed'
    };
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split('/').pop() || 'image';
    } catch {
      return 'image';
    }
  };

  const getStatusIcon = (status: ImageProcessingResult['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Обработка изображений
          </CardTitle>
          <CardDescription>
            Загрузка и обработка изображений для объявлений ({images.length}/{maxImages})
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Загрузка файлов */}
          <div>
            <Label>Загрузка файлов</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Перетащите файлы или нажмите для выбора
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isProcessing || images.length >= maxImages}
              >
                Выбрать файлы
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept={allowedFormats.map(f => `.${f}`).join(',')}
                className="hidden"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Поддерживаемые форматы: {allowedFormats.join(', ').toUpperCase()}
                <br />Максимальный размер: {maxFileSize}MB
              </p>
            </div>
          </div>

          {/* Массовая загрузка по URL */}
          <div>
            <Label>Загрузка по URL</Label>
            <textarea
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Вставьте URL изображений (по одному на строку)"
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              disabled={isProcessing}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-muted-foreground">
                Введите URL изображений, по одному на строку
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => processUrlsFromText(bulkUrls)}
                disabled={!bulkUrls.trim() || isProcessing || images.length >= maxImages}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Загрузить
              </Button>
            </div>
          </div>

          {/* Прогресс обработки */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Обработка изображений...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Список изображений */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Загруженные изображения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {images.map((image, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(image.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {image.fileName}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {image.format.toUpperCase()}
                      </Badge>
                      {image.size > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {(image.size / 1024 / 1024).toFixed(1)}MB
                        </Badge>
                      )}
                    </div>
                    
                    {image.error && (
                      <p className="text-xs text-red-500 mt-1">{image.error}</p>
                    )}
                    
                    {image.originalUrl && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {image.originalUrl}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {image.processedUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(image.processedUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {images.length === 0 && (
        <Alert>
          <ImageIcon className="h-4 w-4" />
          <AlertDescription>
            Изображения не загружены. Добавьте изображения для объявлений.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
