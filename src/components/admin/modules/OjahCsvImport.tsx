
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Upload, File as FileIcon, CheckCircle2, FileSpreadsheet, ArrowLeft, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { AuthStatus } from './AuthStatus';

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface FieldMapping {
  csvField: string;
  systemField: string;
}

interface ImportSettings {
  categoryId: number | null;
  cityId: number | null;
  expiryDays: number;
}

interface AdminUser { // Оставим на случай, если понадобится где-то еще
  id: string;
  email: string;
}

interface Category {
  id: number;
  name_ru: string;
  name_kz: string;
  parent_id: number | null;
  level: number;
  children?: Category[];
}

// Поля CSV (только 6 рабочих)
const csvFields = [
  { key: 'title', label: 'Название (title)' },
  { key: 'description', label: 'Описание (description)' },
  { key: 'regular_price', label: 'Обычная цена (regular_price)' },
  { key: 'discount_price', label: 'Цена со скидкой (discount_price)' },
  { key: 'images', label: 'Изображения (images, URL через запятую)' },
  { key: 'source_link', label: 'Ссылка на источник (source_link/link)' },
];

// Поля системы, доступные для сопоставления
const systemFields = [
  { key: 'title', label: 'Название объявления' },
  { key: 'description', label: 'Описание объявления' },
  { key: 'regular_price', label: 'Обычная цена' },
  { key: 'discount_price', label: 'Цена со скидкой' },
  { key: 'images', label: 'Изображения (URL через запятую)' },
  { key: 'source_link', label: 'Ссылка на источник' },
];

// Функция для правильного парсинга цены
const parsePrice = (priceStr: string): number | null => {
  if (!priceStr || typeof priceStr !== 'string') return null;
  
  // Удаляем символы валюты (₸, $, €, etc.) и лишние пробелы в начале/конце
  let cleanPrice = priceStr.trim();
  
  // Удаляем символы валют
  cleanPrice = cleanPrice.replace(/[₸$€£¥₽]/g, '');
  
  // Удаляем лишние пробелы в начале и конце
  cleanPrice = cleanPrice.trim();
  
  // Заменяем запятые на точки для корректного парсинга десятичных чисел
  cleanPrice = cleanPrice.replace(',', '.');
  
  // Удаляем все пробелы (разделители тысяч)
  cleanPrice = cleanPrice.replace(/\s/g, '');
  
  // Конвертируем в число
  const numericPrice = parseFloat(cleanPrice);
  
  console.log(`Price parsing: "${priceStr}" -> "${cleanPrice}" -> ${numericPrice}`);
  
  return isNaN(numericPrice) ? null : Math.round(numericPrice);
};

// Улучшенная функция для очистки HTML из описания
const cleanHtmlDescription = (htmlStr: string): string => {
  if (!htmlStr || typeof htmlStr !== 'string') return '';
  
  // Создаем временный элемент для парсинга HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlStr;
  
  // Добавляем пробелы перед закрывающими тегами блочных элементов
  let processedHtml = htmlStr
    .replace(/<\/(div|p|h[1-6]|li|td|th|section|article|header|footer|main|aside)>/gi, ' </$1>')
    .replace(/<(br|hr)\s*\/?>/gi, ' ')
    .replace(/<\/(dt|dd)>/gi, ' </$1>')
    .replace(/,(?=\S)/g, ', '); // Добавляем пробел после запятых, если его нет
  
  tempDiv.innerHTML = processedHtml;
  
  // Получаем только текстовое содержимое
  let cleanText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Нормализуем пробелы и переносы строк
  cleanText = cleanText
    .replace(/\s+/g, ' ') // Заменяем множественные пробелы на одинарные
    .replace(/,\s*,/g, ',') // Убираем двойные запятые
    .replace(/\s*,\s*/g, ', ') // Нормализуем пробелы вокруг запятых
    .replace(/\.\s*\./g, '.') // Убираем двойные точки
    .replace(/\s*\.\s*/g, '. ') // Нормализуем пробелы вокруг точек
    .trim();
  
  console.log(`HTML cleaning: "${htmlStr.substring(0, 100)}..." -> "${cleanText.substring(0, 100)}..."`);
  
  return cleanText;
};

export const OjahCsvImport = () => {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importedCount, setImportedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<{ id: number; name_ru: string }[]>([]);
  
  const [importSettings, setImportSettings] = useState<ImportSettings>({
    categoryId: null,
    cityId: null,
    expiryDays: 30,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      // Загрузка категорий
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name_ru, name_kz, parent_id, level')
        .order('parent_id', { nullsFirst: true })
        .order('name_ru');
      
      if (categoriesError) {
        toast({ title: 'Ошибка загрузки категорий', description: categoriesError.message, variant: 'destructive' });
      } else if (categoriesData) {
        // Простая иерархия (только 2 уровня для примера)
        const topLevelCategories = categoriesData.filter(c => c.level === 1);
        const secondLevelCategories = categoriesData.filter(c => c.level === 2);
        const hierarchicalCategories = topLevelCategories.map(tlc => ({
            ...tlc,
            children: secondLevelCategories.filter(slc => slc.parent_id === tlc.id)
        }));
        setCategories(hierarchicalCategories);
      }

      // Загрузка городов
      const { data: citiesData, error: citiesError } = await supabase
        .from('cities')
        .select('id, name_ru')
        .order('name_ru');
      
      if (citiesError) {
        toast({ title: 'Ошибка загрузки городов', description: citiesError.message, variant: 'destructive' });
      } else {
        setCities(citiesData || []);
      }
    };

    fetchInitialData();
  }, [toast]);


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
        if (rows.length > 0) {
          setCsvData({ headers: rows[0], rows: rows.slice(1) });
          const autoMappings = csvFields
            .filter(cf => rows[0].includes(cf.key) || rows[0].includes(cf.label.split(' (')[0]))
            .map(cf => ({
              csvField: rows[0].find(header => header === cf.key || header === cf.label.split(' (')[0]) || '',
              systemField: cf.key,
            }));
          setFieldMappings(autoMappings);
          setCurrentStep(2);
        } else {
          toast({ title: 'Ошибка', description: 'CSV файл пуст или некорректен.', variant: 'destructive' });
        }
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  const handleMappingChange = (csvHeader: string, systemFieldKey: string) => {
    setFieldMappings(prev => {
      const existingMappingIndex = prev.findIndex(m => m.csvField === csvHeader);
      if (systemFieldKey === '') { // Если выбрано "не сопоставлять"
        return prev.filter(m => m.csvField !== csvHeader);
      }
      if (existingMappingIndex !== -1) {
        const updatedMappings = [...prev];
        updatedMappings[existingMappingIndex].systemField = systemFieldKey;
        return updatedMappings;
      }
      return [...prev, { csvField: csvHeader, systemField: systemFieldKey }];
    });
  };
  
  const startImport = async () => {
    setIsImporting(true);
    setImportProgress(0);
    setImportedCount(0);
    setErrorCount(0);
    console.log('Attempting to start import...');

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error('User session error during import:', userError);
        toast({
          variant: "destructive",
          title: "Ошибка авторизации",
          description: "Не удалось получить данные пользователя для импорта. Пожалуйста, войдите снова."
        });
        setIsImporting(false);
        return;
      }
      const currentAuthUserId = userData.user.id;
      console.log('Importing as user ID:', currentAuthUserId, 'Email:', userData.user.email);

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + (importSettings.expiryDays || 30)); 

      if (!csvData || !fieldMappings.length) {
        setIsImporting(false);
        toast({
          variant: "destructive",
          title: "Ошибка импорта",
          description: "Нет данных для импорта или не настроено сопоставление полей."
        });
        return;
      }
      if (!importSettings.categoryId || !importSettings.cityId) {
        setIsImporting(false);
        toast({
          variant: "destructive",
          title: "Ошибка настроек",
          description: "Пожалуйста, выберите категорию и город для импорта."
        });
        return;
      }

      const totalRows = csvData.rows.length;
      let localImportedCount = 0;
      let localErrorCount = 0;

      for (let i = 0; i < totalRows; i++) {
        const row = csvData.rows[i];
        if (row.every(cell => cell === null || cell === undefined || cell.trim() === '')) {
            console.warn(`Skipping empty CSV row at index ${i}`);
            setImportProgress(((i + 1) / totalRows) * 100);
            continue;
        }

        const mappedData: { [key: string]: string | undefined } = {};
        
        fieldMappings.forEach(mapping => {
          const csvHeaderIndex = csvData.headers.indexOf(mapping.csvField);
          if (csvHeaderIndex !== -1 && row[csvHeaderIndex] !== undefined && row[csvHeaderIndex] !== null && row[csvHeaderIndex].trim() !== '') {
            let value = row[csvHeaderIndex].trim();
            
            // Специальная обработка для описания - очищаем HTML
            if (mapping.systemField === 'description') {
              value = cleanHtmlDescription(value);
            }
            
            mappedData[mapping.systemField] = value;
          }
        });

        if (Object.keys(mappedData).length === 0 && csvData.headers.length > 0) {
            console.warn('Skipping row with no mapped data:', row);
            localErrorCount++;
            setErrorCount(prev => prev + 1);
            setImportProgress(((i + 1) / totalRows) * 100);
            continue;
        }
        
        const listingData: any = {
          title: mappedData.title || '',
          description: mappedData.description || '',
          regular_price: mappedData.regular_price ? parsePrice(mappedData.regular_price) : null,
          discount_price: mappedData.discount_price ? parsePrice(mappedData.discount_price) : null,
          images: mappedData.images ? mappedData.images.split(',').map(img => img.trim()).filter(img => img) : [],
          source_link: mappedData.source_link || '', 
          
          user_id: currentAuthUserId, 
          
          category_id: importSettings.categoryId,
          city_id: importSettings.cityId,
          expires_at: expiryDate.toISOString(),
          status: 'active', 
        };
        
        Object.keys(listingData).forEach(key => {
            if (listingData[key] === null || listingData[key] === undefined) {
                if (key !== 'regular_price' && key !== 'discount_price' && key !== 'images') {
                    delete listingData[key];
                }
            } else if (typeof listingData[key] === 'string' && listingData[key].trim() === '') {
                 if (key !== 'title' && key !== 'description' && key !== 'source_link') {
                    delete listingData[key];
                 }
            }
        });
        
        if (listingData.images && listingData.images.length === 0) {
          delete listingData.images; 
        }

        if (!listingData.title || !listingData.user_id || !listingData.category_id || !listingData.city_id) {
          console.error('Пропущены обязательные поля для строки:', row, listingData);
          toast({ title: 'Пропущены обязательные поля', description: `Строка ${i+1}: ${listingData.title || 'Без заголовка'}`, variant: 'destructive' });
          localErrorCount++;
          setErrorCount(prev => prev + 1);
          setImportProgress(((i + 1) / totalRows) * 100);
          continue; 
        }
        
        console.log("Attempting to insert listing:", JSON.stringify(listingData, null, 2));

        const { data: insertData, error: insertError } = await supabase
          .from('listings')
          .insert([listingData])
          .select(); 

        if (insertError) {
          console.error('Ошибка импорта строки:', insertError, 'Для данных:', listingData);
          toast({ title: 'Ошибка импорта строки', description: `${insertError.message} (строка CSV: ${i+1})`, variant: 'destructive' });
          localErrorCount++;
          setErrorCount(prev => prev + 1);
        } else {
          localImportedCount++;
          setImportedCount(prev => prev + 1);
          console.log('Успешно импортировано:', insertData);
        }
        setImportProgress(Math.round(((i + 1) / totalRows) * 100));
      }

      if (localImportedCount > 0) {
        toast({
          title: "Импорт завершен",
          description: `Успешно импортировано ${localImportedCount} объявлений. Ошибок: ${localErrorCount}.`
        });
      } else if (localErrorCount > 0 && totalRows > 0) {
          toast({
          variant: "destructive",
          title: "Импорт завершен с ошибками",
          description: `Не удалось импортировать объявления. Ошибок: ${localErrorCount}.`
        });
      } else if (totalRows === 0) {
          toast({
            variant: "default",
            title: "Импорт не выполнен",
            description: "Нет данных в CSV файле для импорта."
          });
      } else {
          toast({
            variant: "default",
            title: "Импорт завершен",
            description: "Нет данных для импорта или все строки были пропущены/содержали ошибки."
          });
      }
      
    } catch (error: any) {
      console.error("Import process error:", error);
      toast({
        variant: "destructive",
        title: "Критическая ошибка импорта",
        description: error.message || "Произошла неизвестная ошибка во время процесса импорта."
      });
    } finally {
      setIsImporting(false);
    }
  };

  const renderCategoryOptions = (category: Category, level = 0) => {
    const prefix = '\u00A0\u00A0'.repeat(level * 2);
    return (
      <>
        <SelectItem key={category.id} value={String(category.id)}>
          {prefix}{category.name_ru} ({category.name_kz})
        </SelectItem>
        {category.children && category.children.map(child => renderCategoryOptions(child, level + 1))}
      </>
    );
  };


  return (
    <div className="space-y-6">
      <AuthStatus />
      <Card>
        <CardHeader>
          <CardTitle>Импорт объявлений из CSV</CardTitle>
          <CardDescription>Загрузите CSV файл, сопоставьте поля и настройте параметры импорта. HTML теги в описании будут автоматически очищены.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Шаг 1: Загрузка CSV файла</h3>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted border-border"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
                    </p>
                    <p className="text-xs text-muted-foreground">CSV (UTF-8, разделитель запятая)</p>
                    {fileName && <p className="mt-2 text-xs text-green-500">Выбран файл: {fileName}</p>}
                  </div>
                  <Input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                </label>
              </div>
              {csvData && (
                <Button onClick={() => setCurrentStep(2)} className="w-full">
                  Далее <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}

          {currentStep === 2 && csvData && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Шаг 2: Сопоставление полей</h3>
              <Alert>
                <FileSpreadsheet className="w-4 h-4" />
                <AlertDescription>
                  Сопоставьте заголовки из вашего CSV файла с системными полями. 
                  Обязательные поля для импорта: Название, Описание. 
                  HTML теги в описании будут автоматически удалены и преобразованы в читаемый текст.
                  Категория и Город выбираются на следующем шаге для всех объявлений.
                  Срок публикации устанавливается автоматически.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {csvData.headers.map((header, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`mapping-${index}`}>"{header}" (из CSV)</Label>
                    <Select
                      value={fieldMappings.find(m => m.csvField === header)?.systemField || ''}
                      onValueChange={(value) => handleMappingChange(header, value)}
                    >
                      <SelectTrigger id={`mapping-${index}`}>
                        <SelectValue placeholder="Не сопоставлять" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Не сопоставлять</SelectItem>
                        {systemFields.map(sf => (
                          <SelectItem key={sf.key} value={sf.key} disabled={fieldMappings.some(m => m.systemField === sf.key && m.csvField !== header)}>
                            {sf.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Назад к загрузке
                </Button>
                <Button onClick={() => setCurrentStep(3)}>
                  Далее к настройкам <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Шаг 3: Настройки импорта</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="category">Категория (для всех объявлений)</Label>
                  <Select
                    value={importSettings.categoryId ? String(importSettings.categoryId) : ''}
                    onValueChange={(value) => setImportSettings(prev => ({ ...prev, categoryId: Number(value) }))}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => renderCategoryOptions(cat))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">Город (для всех объявлений)</Label>
                  <Select
                    value={importSettings.cityId ? String(importSettings.cityId) : ''}
                    onValueChange={(value) => setImportSettings(prev => ({ ...prev, cityId: Number(value) }))}
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Выберите город" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city.id} value={String(city.id)}>{city.name_ru}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="expiryDays">Срок публикации (дней)</Label>
                  <Input 
                    id="expiryDays" 
                    type="number" 
                    value={importSettings.expiryDays} 
                    onChange={(e) => setImportSettings(prev => ({ ...prev, expiryDays: Number(e.target.value) || 30 }))} 
                    min="1"
                    max="365"
                  />
                   <p className="text-xs text-muted-foreground">
                    Дата истечения будет установлена автоматически от даты импорта + указанное количество дней.
                  </p>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Alert variant="default">
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>
                    Пожалуйста, убедитесь, что вы авторизованы как администратор (Skidqi) перед началом импорта.
                    Все объявления будут опубликованы от вашего имени.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Назад к сопоставлению
                  </Button>
                  <Button 
                    onClick={startImport}
                    disabled={isImporting || !importSettings.categoryId || !importSettings.cityId}
                  >
                    {isImporting ? 'Импортируется...' : 'Начать импорт'}
                  </Button>
                </div>
              </div>
              
            
              {isImporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс импорта</span>
                    <span>{importProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    Импортировано: {importedCount}, Ошибок: {errorCount}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
