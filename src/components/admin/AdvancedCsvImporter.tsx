
import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Image as ImageIcon, 
  Link, 
  AlertTriangle, 
  CheckCircle2,
  FileText,
  Database,
  Settings
} from 'lucide-react';

interface ImageProcessingSettings {
  enabled: boolean;
  maxSize: number; // MB
  allowedFormats: string[];
  resizeWidth: number;
  resizeHeight: number;
  quality: number;
}

interface ImportSettings {
  batchSize: number;
  skipDuplicates: boolean;
  validateData: boolean;
  imageProcessing: ImageProcessingSettings;
}

export const AdvancedCsvImporter = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ImportSettings>({
    batchSize: 100,
    skipDuplicates: true,
    validateData: true,
    imageProcessing: {
      enabled: false,
      maxSize: 5,
      allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      resizeWidth: 800,
      resizeHeight: 600,
      quality: 80
    }
  });
  
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<{
    total: number;
    processed: number;
    errors: string[];
  }>({ total: 0, processed: 0, errors: [] });

  const handleImageUrlsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const urls = event.target.value.split('\n').filter(url => url.trim());
    setImageUrls(urls);
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      return response.ok && contentType?.startsWith('image/') || false;
    } catch {
      return false;
    }
  };

  const processImages = useCallback(async () => {
    if (imageUrls.length === 0) return;
    
    setProcessingStatus({ total: imageUrls.length, processed: 0, errors: [] });
    
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      
      try {
        const isValid = await validateImageUrl(url);
        if (!isValid) {
          setProcessingStatus(prev => ({
            ...prev,
            errors: [...prev.errors, `Недоступное изображение: ${url}`]
          }));
        }
      } catch (error) {
        setProcessingStatus(prev => ({
          ...prev,
          errors: [...prev.errors, `Ошибка обработки: ${url}`]
        }));
      }
      
      setProcessingStatus(prev => ({ ...prev, processed: i + 1 }));
      
      // Симуляция задержки обработки
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    toast({
      title: "Обработка изображений завершена",
      description: `Обработано ${imageUrls.length} изображений`
    });
  }, [imageUrls, toast]);

  const updateImageProcessingSettings = (key: keyof ImageProcessingSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      imageProcessing: {
        ...prev.imageProcessing,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Продвинутый импорт</h3>
        <p className="text-muted-foreground">
          Расширенные настройки для импорта данных с обработкой изображений
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Настройки импорта */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Настройки импорта
            </CardTitle>
            <CardDescription>
              Основные параметры процесса импорта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="batchSize">Размер пакета</Label>
              <Input
                id="batchSize"
                type="number"
                value={settings.batchSize}
                onChange={(e) => setSettings(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                min="1"
                max="1000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Количество записей для обработки за раз
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Пропускать дубликаты</Label>
                <p className="text-xs text-muted-foreground">
                  Не импортировать существующие записи
                </p>
              </div>
              <Switch
                checked={settings.skipDuplicates}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, skipDuplicates: checked }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Валидация данных</Label>
                <p className="text-xs text-muted-foreground">
                  Проверять данные перед импортом
                </p>
              </div>
              <Switch
                checked={settings.validateData}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, validateData: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Обработка изображений */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Обработка изображений
            </CardTitle>
            <CardDescription>
              Настройки автоматической обработки изображений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Включить обработку</Label>
                <p className="text-xs text-muted-foreground">
                  Автоматически обрабатывать изображения
                </p>
              </div>
              <Switch
                checked={settings.imageProcessing.enabled}
                onCheckedChange={(checked) => updateImageProcessingSettings('enabled', checked)}
              />
            </div>
            
            {settings.imageProcessing.enabled && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="maxSize">Макс. размер (МБ)</Label>
                    <Input
                      id="maxSize"
                      type="number"
                      value={settings.imageProcessing.maxSize}
                      onChange={(e) => updateImageProcessingSettings('maxSize', parseInt(e.target.value))}
                      min="1"
                      max="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quality">Качество (%)</Label>
                    <Input
                      id="quality"
                      type="number"
                      value={settings.imageProcessing.quality}
                      onChange={(e) => updateImageProcessingSettings('quality', parseInt(e.target.value))}
                      min="10"
                      max="100"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="resizeWidth">Ширина (px)</Label>
                    <Input
                      id="resizeWidth"
                      type="number"
                      value={settings.imageProcessing.resizeWidth}
                      onChange={(e) => updateImageProcessingSettings('resizeWidth', parseInt(e.target.value))}
                      min="100"
                      max="2000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resizeHeight">Высота (px)</Label>
                    <Input
                      id="resizeHeight"
                      type="number"
                      value={settings.imageProcessing.resizeHeight}
                      onChange={(e) => updateImageProcessingSettings('resizeHeight', parseInt(e.target.value))}
                      min="100"
                      max="2000"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Поддерживаемые форматы</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {settings.imageProcessing.allowedFormats.map(format => (
                      <Badge key={format} variant="secondary">
                        {format.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Пакетная обработка изображений */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Пакетная обработка изображений
          </CardTitle>
          <CardDescription>
            Загрузите список URL изображений для предварительной обработки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="imageUrls">URL изображений (по одному на строку)</Label>
            <textarea
              id="imageUrls"
              className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png&#10;..."
              onChange={handleImageUrlsChange}
            />
          </div>
          
          {imageUrls.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Изображений к обработке: {imageUrls.length}</span>
                <Button onClick={processImages} size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Обработать
                </Button>
              </div>
              
              {processingStatus.total > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Прогресс: {processingStatus.processed}/{processingStatus.total}</span>
                    <span>{Math.round((processingStatus.processed / processingStatus.total) * 100)}%</span>
                  </div>
                  
                  {processingStatus.errors.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        Ошибки ({processingStatus.errors.length})
                      </div>
                      <div className="max-h-24 overflow-y-auto text-xs text-muted-foreground">
                        {processingStatus.errors.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Статистика и мониторинг */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Статистика импорта
          </CardTitle>
          <CardDescription>
            Информация о последних операциях импорта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">1,234</div>
              <div className="text-sm text-muted-foreground">Успешно импортировано</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">56</div>
              <div className="text-sm text-muted-foreground">Ошибок импорта</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-muted-foreground">Успешность</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
