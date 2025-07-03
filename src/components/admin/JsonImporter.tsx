
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { categories, addCategory, addSubcategory, categoryExists } from '@/data/categories';
import { uploadImage } from '@/utils/imageUtils';
import { AlertCircle, FileJson, Check, X, Download, Upload, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Category } from '@/data/categories';

interface JsonCategory {
  single_name: string;
  plural_name: string;
  slug: string;
  active?: string;
  hidden?: string;
  premium?: string;
  bg_image?: string;
  icon?: string;
  description?: string;
  position?: number;
  children?: JsonCategory[];
}

interface JsonTaxonomy {
  single_name: string;
  plural_name: string;
  slug: string;
  parent: string;
  active?: string;
  hidden?: string;
  premium?: string;
  bg_image?: string;
  icon?: string;
  description?: string;
  position?: number;
}

interface JsonData {
  groups: JsonCategory[];
  taxonomies?: {
    [key: string]: JsonTaxonomy[];
  };
}

interface FieldMapping {
  [key: string]: string;
}

interface ImportStats {
  total: number;
  added: number;
  skipped: number;
  errors: number;
}

export const JsonImporter = () => {
  const { language } = useAppContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping>({
    single_name: 'name.ru',
    plural_name: 'name.kz',
    slug: 'slug',
    icon: 'icon',
  });
  const [importStats, setImportStats] = useState<ImportStats>({
    total: 0,
    added: 0,
    skipped: 0,
    errors: 0
  });
  const [progress, setProgress] = useState(0);
  
  const systemFields = [
    {
      label: language === 'ru' ? 'Название (RU)' : 'Атауы (RU)',
      value: 'name.ru',
    },
    {
      label: language === 'ru' ? 'Название (KZ)' : 'Атауы (KZ)',
      value: 'name.kz',
    },
    {
      label: language === 'ru' ? 'URL (slug)' : 'URL (slug)',
      value: 'slug',
    },
    {
      label: 'ID',
      value: 'id',
    },
    {
      label: language === 'ru' ? 'Иконка' : 'Белгіше',
      value: 'icon',
    },
  ];
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsLoading(true);
      setJsonFile(file);
      const text = await file.text();
      const data = JSON.parse(text) as JsonData;
      setJsonData(data);
      setImportStep(2);
      
      const groupsCount = data.groups?.length || 0;
      const taxonomiesCount = data.taxonomies ? 
        Object.values(data.taxonomies).reduce((sum, items) => sum + items.length, 0) : 0;
      
      toast({
        title: language === 'ru' ? 'Файл загружен' : 'Файл жүктелді',
        description: language === 'ru' 
          ? `Найдено ${groupsCount} категорий и ${taxonomiesCount} таксономий` 
          : `${groupsCount} санат және ${taxonomiesCount} таксономия табылды`,
      });
    } catch (error) {
      console.error('Error parsing JSON:', error);
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Қате',
        description: language === 'ru' 
          ? 'Не удалось прочитать JSON файл' 
          : 'JSON файлды оқу мүмкін болмады',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateFieldMapping = (jsonField: string, systemField: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [jsonField]: systemField,
    }));
  };
  
  // Обновленная функция подсчета общего количества категорий включая все уровни иерархии
  const countTotalCategories = (categories: JsonCategory[]): number => {
    let count = 0;
    
    // Рекурсивная функция для подсчета всех категорий на всех уровнях
    const countCategoriesRecursive = (cats: JsonCategory[]) => {
      count += cats.length;
      
      for (const cat of cats) {
        if (cat.children && cat.children.length > 0) {
          countCategoriesRecursive(cat.children);
        }
      }
    };
    
    countCategoriesRecursive(categories);
    return count;
  };
  
  // Функция для подсчета общего количества таксономий
  const countTotalTaxonomies = (taxonomies?: { [key: string]: JsonTaxonomy[] }): number => {
    if (!taxonomies) return 0;
    
    return Object.values(taxonomies).reduce((sum, items) => sum + items.length, 0);
  };
  
  // Обновленная функция преобразования JSON категории в системную
  const convertJsonCategoryToSystem = (jsonCategory: JsonCategory): Category => {
    return {
      id: jsonCategory.slug,
      slug: jsonCategory.slug,
      name: {
        ru: jsonCategory.single_name,
        kz: jsonCategory.plural_name || jsonCategory.single_name,
      },
      icon: jsonCategory.icon || 'Package',
      subcategories: jsonCategory.children?.map(convertJsonCategoryToSystem),
    };
  };
  
  // Обновленная функция импорта для корректной обработки всех уровней иерархии
  const handleImport = async () => {
    if (!jsonData) return;
    
    setIsLoading(true);
    setImportStep(3);
    
    const stats: ImportStats = {
      total: 0,
      added: 0,
      skipped: 0,
      errors: 0
    };
    
    const totalCategories = countTotalCategories(jsonData.groups || []);
    const totalTaxonomies = countTotalTaxonomies(jsonData.taxonomies);
    stats.total = totalCategories + totalTaxonomies;
    
    let processed = 0;
    
    // Карта соответствия slug -> id для отслеживания импортированных категорий
    const slugToIdMap = new Map<string, string>();
    
    // Рекурсивная функция для обработки категорий и их подкатегорий
    const processCategories = async (jsonCategories: JsonCategory[], parentId?: string) => {
      for (const jsonCategory of jsonCategories) {
        try {
          const systemCategory = convertJsonCategoryToSystem(jsonCategory);
          
          if (parentId) {
            // Это подкатегория
            const added = addSubcategory(parentId, {
              ...systemCategory,
              subcategories: [] // Уберем подкатегории, т.к. они будут добавлены в следующей итерации
            });
            
            if (added) {
              stats.added++;
              slugToIdMap.set(jsonCategory.slug, jsonCategory.slug); // Сохраняем соответствие slug -> id
            } else {
              stats.skipped++;
            }
          } else {
            // Это основная категория
            if (categoryExists(systemCategory.id)) {
              stats.skipped++;
            } else {
              addCategory({
                ...systemCategory,
                subcategories: [] // Уберем подкатегории, т.к. они будут добавлены в следующей итерации
              });
              stats.added++;
              slugToIdMap.set(jsonCategory.slug, jsonCategory.slug); // Сохраняем соответствие slug -> id
            }
          }
          
          // Увеличиваем счетчик обработанных категорий
          processed++;
          setProgress(Math.floor((processed / stats.total) * 100));
          
          // Обрабатываем подкатегории рекурсивно, если они есть
          if (jsonCategory.children && jsonCategory.children.length > 0) {
            await processCategories(jsonCategory.children, jsonCategory.slug);
          }
          
          // Добавляем небольшую задержку, чтобы UI мог обновиться
          await new Promise(resolve => setTimeout(resolve, 50));
          
        } catch (error) {
          stats.errors++;
          console.error('Error importing category:', error);
        }
      }
    };
    
    // Функция для импорта таксономий с учетом иерархии
    const processTaxonomies = async () => {
      if (!jsonData.taxonomies) return;
      
      // Для каждой группы таксономий
      for (const baseSlug in jsonData.taxonomies) {
        const items = jsonData.taxonomies[baseSlug];
        const imported = new Set<string>();
        
        // Сначала находим корневые элементы (с пустым parent)
        const rootItems = items.filter(item => !item.parent);
        const remainingItems = items.filter(item => item.parent);
        
        // Импортируем корневые элементы как подкатегории базовой категории
        for (const item of rootItems) {
          try {
            if (slugToIdMap.has(baseSlug)) {
              const baseId = slugToIdMap.get(baseSlug)!;
              
              const systemCategory: Category = {
                id: item.slug,
                slug: item.slug,
                name: {
                  ru: item.single_name,
                  kz: item.plural_name || item.single_name,
                },
                icon: item.icon || 'Package',
                subcategories: [],
              };
              
              const added = addSubcategory(baseId, systemCategory);
              
              if (added) {
                stats.added++;
                slugToIdMap.set(item.slug, item.slug);
                imported.add(item.slug);
              } else {
                stats.skipped++;
              }
              
              processed++;
              setProgress(Math.floor((processed / stats.total) * 100));
            }
          } catch (error) {
            stats.errors++;
            console.error('Error importing taxonomy root item:', error);
          }
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Теперь обрабатываем оставшиеся элементы в порядке зависимостей
        while (remainingItems.length > 0 && imported.size < items.length) {
          let importedThisRound = false;
          
          for (let i = 0; i < remainingItems.length; i++) {
            const item = remainingItems[i];
            
            // Если родитель уже импортирован
            if (slugToIdMap.has(item.parent)) {
              try {
                const parentId = slugToIdMap.get(item.parent)!;
                
                const systemCategory: Category = {
                  id: item.slug,
                  slug: item.slug,
                  name: {
                    ru: item.single_name,
                    kz: item.plural_name || item.single_name,
                  },
                  icon: item.icon || 'Package',
                  subcategories: [],
                };
                
                const added = addSubcategory(parentId, systemCategory);
                
                if (added) {
                  stats.added++;
                  slugToIdMap.set(item.slug, item.slug);
                  imported.add(item.slug);
                } else {
                  stats.skipped++;
                }
                
                // Удаляем обработанный элемент
                remainingItems.splice(i, 1);
                i--;
                
                importedThisRound = true;
                
                processed++;
                setProgress(Math.floor((processed / stats.total) * 100));
              } catch (error) {
                stats.errors++;
                console.error('Error importing taxonomy child item:', error);
              }
              
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }
          
          // Если за проход ничего не импортировано, значит есть циклические зависимости
          if (!importedThisRound) {
            stats.errors += remainingItems.length;
            console.error('Обнаружены циклические зависимости:', remainingItems);
            break;
          }
        }
      }
    };
    
    // Начинаем обработку категорий
    await processCategories(jsonData.groups || []);
    
    // Затем обрабатываем таксономии, если они есть
    await processTaxonomies();
    
    setImportStats(stats);
    setProgress(100);
    
    toast({
      title: language === 'ru' ? 'Импорт завершен' : 'Импорт аяқталды',
      description: language === 'ru' 
        ? `Добавлено: ${stats.added}, Пропущено: ${stats.skipped}, Ошибок: ${stats.errors}` 
        : `Қосылды: ${stats.added}, Өткізілді: ${stats.skipped}, Қателер: ${stats.errors}`,
    });
    
    setIsLoading(false);
    setImportStep(4);
  };
  
  const resetImport = () => {
    setJsonData(null);
    setJsonFile(null);
    setImportStep(1);
    setProgress(0);
    setImportStats({
      total: 0,
      added: 0,
      skipped: 0,
      errors: 0
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const downloadSampleJson = () => {
    const sampleData: JsonData = {
      groups: [
        {
          single_name: "Бесплатно",
          plural_name: "Тегін",
          slug: "free",
          icon: "Gift",
          active: "yes",
          hidden: "no",
          premium: "no",
          description: "Бесплатные товары и услуги"
        },
        {
          single_name: "Техника и Электроника",
          plural_name: "Техника және Электроника",
          slug: "electronics",
          icon: "Smartphone",
          active: "yes",
          hidden: "no",
          premium: "yes",
          description: "Электроника и техника",
          children: [
            {
              single_name: "Телефоны и гаджеты",
              plural_name: "Телефондар мен гаджеттер",
              slug: "phones",
              icon: "Smartphone",
              active: "yes",
              hidden: "no",
              premium: "no",
              children: [
                {
                  single_name: "Смартфоны",
                  plural_name: "Смартфондар",
                  slug: "smartphones",
                  icon: "Smartphone",
                  active: "yes",
                  hidden: "no",
                  premium: "no"
                },
                {
                  single_name: "Аксессуары для телефонов",
                  plural_name: "Телефон аксессуарлары",
                  slug: "phone-accessories",
                  icon: "Cable",
                  active: "yes",
                  hidden: "no",
                  premium: "no"
                }
              ]
            }
          ]
        }
      ],
      taxonomies: {
        "electronics": [
          {
            single_name: "Ноутбуки",
            plural_name: "Ноутбуки",
            slug: "notebooks",
            parent: "",
            icon: "Laptop",
            active: "yes",
            hidden: "no",
            premium: "no"
          },
          {
            single_name: "Игровые ноутбуки",
            plural_name: "Ойын ноутбуктері",
            slug: "gaming-notebooks",
            parent: "notebooks",
            icon: "Gamepad",
            active: "yes",
            hidden: "no",
            premium: "yes"
          },
          {
            single_name: "Ультрабуки",
            plural_name: "Ультрабуктер",
            slug: "ultrabooks",
            parent: "notebooks",
            icon: "Laptop",
            active: "yes",
            hidden: "no",
            premium: "no"
          },
          {
            single_name: "Аксессуары для ноутбуков",
            plural_name: "Ноутбук аксессуарлары",
            slug: "notebook-accessories",
            parent: "notebooks",
            icon: "Cable",
            active: "yes",
            hidden: "no",
            premium: "no"
          },
          {
            single_name: "Сумки для ноутбуков",
            plural_name: "Ноутбук сөмкелері",
            slug: "notebook-bags",
            parent: "notebook-accessories",
            icon: "Briefcase",
            active: "yes",
            hidden: "no",
            premium: "no"
          }
        ]
      }
    };
    
    const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-categories.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md">
        <FileJson className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">
          {language === 'ru' ? 'Выберите JSON файл с категориями' : 'JSON файлын таңдаңыз'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          {language === 'ru'
            ? 'Загрузите файл в формате JSON с категориями сайта Lisfinity'
            : 'Lisfinity сайтының санаттары бар JSON файлын жүктеңіз'}
        </p>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {language === 'ru' ? 'Выбрать файл' : 'Файлды таңдау'}
          </Button>
          <Button variant="secondary" onClick={downloadSampleJson}>
            <Download className="w-4 h-4 mr-2" />
            {language === 'ru' ? 'Скачать пример' : 'Мысалды жүктеу'}
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
      </div>
      
      <div className="bg-muted/50 rounded-md p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium">
              {language === 'ru' ? 'Информация о формате' : 'Формат туралы ақпарат'}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'ru'
                ? 'JSON файл должен содержать массив "groups" с категориями в формате Lisfinity.'
                : 'JSON файлы Lisfinity форматындағы санаттары бар "groups" массивін қамтуы керек.'}
            </p>
            <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
              {`{
  "groups": [
    {
      "single_name": "Название категории",
      "plural_name": "Множественное название",
      "slug": "category-slug",
      "icon": "IconName",
      "active": "yes",
      "hidden": "no",
      "premium": "no"
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {language === 'ru' ? 'Сопоставление полей' : 'Өрістерді салыстыру'}
        </h3>
        <div className="text-sm text-muted-foreground">
          {language === 'ru'
            ? `Файл: ${jsonFile?.name || ''}`
            : `Файл: ${jsonFile?.name || ''}`}
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">{language === 'ru' ? 'Поле в JSON' : 'JSON өрісі'}</TableHead>
              <TableHead className="w-1/3">{language === 'ru' ? 'Пример значения' : 'Мысал мәні'}</TableHead>
              <TableHead className="w-1/3">{language === 'ru' ? 'Поле в системе' : 'Жүйедегі өріс'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jsonData && jsonData.groups && jsonData.groups.length > 0 && 
              Object.keys(jsonData.groups[0]).filter(key => key !== 'children').map((field) => (
                <TableRow key={field}>
                  <TableCell className="font-medium">{field}</TableCell>
                  <TableCell>
                    {typeof jsonData.groups[0][field as keyof JsonCategory] === 'object' 
                      ? JSON.stringify(jsonData.groups[0][field as keyof JsonCategory]) 
                      : jsonData.groups[0][field as keyof JsonCategory]?.toString() || '-'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={fieldMapping[field] || ''}
                      onValueChange={(value) => updateFieldMapping(field, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={language === 'ru' ? 'Выберите поле' : 'Өрісті таңдаңыз'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          {language === 'ru' ? '-- Не импортировать --' : '-- Импортталмайды --'}
                        </SelectItem>
                        {systemFields.map((sysField) => (
                          <SelectItem key={sysField.value} value={sysField.value}>
                            {sysField.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-muted/50 rounded-md p-4">
        <h4 className="font-medium">
          {language === 'ru' ? 'Предварительный просмотр' : 'Алдын ала қарау'}
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          {language === 'ru'
            ? `Найдено ${jsonData?.groups?.length || 0} категорий и ${
                jsonData?.taxonomies ? Object.values(jsonData.taxonomies).reduce((sum, arr) => sum + arr.length, 0) : 0
              } таксономий`
            : `${jsonData?.groups?.length || 0} санат және ${
                jsonData?.taxonomies ? Object.values(jsonData.taxonomies).reduce((sum, arr) => sum + arr.length, 0) : 0
              } таксономия табылды`}
        </p>
        
        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">
              {language === 'ru' ? 'Категории' : 'Санаттар'}
            </TabsTrigger>
            <TabsTrigger value="taxonomies">
              {language === 'ru' ? 'Таксономии' : 'Таксономиялар'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories">
            <div className="border rounded-md max-h-60 overflow-y-auto bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID (slug)</TableHead>
                    <TableHead>{language === 'ru' ? 'Название (RU)' : 'Атауы (RU)'}</TableHead>
                    <TableHead>{language === 'ru' ? 'Название (KZ)' : 'Атауы (KZ)'}</TableHead>
                    <TableHead>{language === 'ru' ? 'Иконка' : 'Белгіше'}</TableHead>
                    <TableHead>{language === 'ru' ? 'Подкатегории' : 'Қосалқы санаттар'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jsonData?.groups?.slice(0, 5).map((category, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{category.slug}</TableCell>
                      <TableCell>{category.single_name}</TableCell>
                      <TableCell>{category.plural_name || category.single_name}</TableCell>
                      <TableCell>{category.icon || '-'}</TableCell>
                      <TableCell>{category.children?.length || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="taxonomies">
            <div className="border rounded-md max-h-60 overflow-y-auto bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID (slug)</TableHead>
                    <TableHead>{language === 'ru' ? 'Название (RU)' : 'Атауы (RU)'}</TableHead>
                    <TableHead>{language === 'ru' ? 'Родитель' : 'Ата-ана'}</TableHead>
                    <TableHead>{language === 'ru' ? 'Базовая категория' : 'Негізгі санат'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jsonData?.taxonomies && Object.entries(jsonData.taxonomies).flatMap(([baseSlug, items]) => 
                    items.slice(0, 10).map((item, index) => (
                      <TableRow key={`${baseSlug}-${index}`}>
                        <TableCell className="font-medium">{item.slug}</TableCell>
                        <TableCell>{item.single_name}</TableCell>
                        <TableCell>{item.parent || '-'}</TableCell>
                        <TableCell>{baseSlug}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={resetImport}>
          {language === 'ru' ? 'Назад' : 'Артқа'}
        </Button>
        <Button onClick={handleImport}>
          {language === 'ru' ? 'Начать импорт' : 'Импорттауды бастау'}
        </Button>
      </div>
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {language === 'ru' ? 'Импорт категорий' : 'Санаттарды импорттау'}
      </h3>
      
      <div className="bg-muted/50 rounded-md p-6 text-center">
        <h4 className="font-medium mb-4">
          {language === 'ru' ? 'Импорт выполняется...' : 'Импорт орындалуда...'}
        </h4>
        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-sm text-muted-foreground">
          {language === 'ru'
            ? `Обработано ${progress}% категорий`
            : `Санаттардың ${progress}% өңделген`}
        </p>
      </div>
    </div>
  );
  
  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {language === 'ru' ? 'Импорт завершен' : 'Импорт аяқталды'}
      </h3>
      
      <div className="bg-muted/50 rounded-md p-6">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="h-8 w-8 text-primary" />
          </div>
        </div>
        
        <h4 className="text-center font-medium mb-4">
          {language === 'ru' ? 'Результаты импорта' : 'Импорт нәтижелері'}
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background rounded-md p-4 text-center">
            <div className="text-2xl font-bold">{importStats.total}</div>
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Всего' : 'Барлығы'}
            </p>
          </div>
          <div className="bg-background rounded-md p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{importStats.added}</div>
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Добавлено' : 'Қосылды'}
            </p>
          </div>
          <div className="bg-background rounded-md p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">{importStats.skipped}</div>
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Пропущено' : 'Өткізілді'}
            </p>
          </div>
          <div className="bg-background rounded-md p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{importStats.errors}</div>
            <p className="text-sm text-muted-foreground">
              {language === 'ru' ? 'Ошибки' : 'Қателер'}
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={resetImport}>
            {language === 'ru' ? 'Начать новый импорт' : 'Жаңа импортты бастау'}
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'ru' ? 'Импорт категорий из JSON' : 'JSON-дан санаттарды импорттау'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {importStep === 1 && renderStep1()}
          {importStep === 2 && renderStep2()}
          {importStep === 3 && renderStep3()}
          {importStep === 4 && renderStep4()}
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonImporter;
