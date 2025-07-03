
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { Upload, File, AlertCircle, CheckCircle2, FileSpreadsheet } from 'lucide-react';

type ImportEntityType = 'categories' | 'users' | 'listings';

const CsvImporter = () => {
  const { language } = useAppContext();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportEntityType>('categories');
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        variant: "destructive",
        title: language === 'ru' ? "Неверный формат файла" : "Файл форматы дұрыс емес",
        description: language === 'ru' ? "Пожалуйста, выберите файл CSV" : "CSV файлын таңдаңыз"
      });
      return;
    }

    setSelectedFile(file);
    parseCsvPreview(file);
  };

  const parseCsvPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(header => header.trim());
      
      // Set available fields based on import type
      let fields: string[] = [];
      if (importType === 'categories') {
        fields = ['id', 'name_ru', 'name_kk', 'parentId', 'iconName'];
      } else if (importType === 'users') {
        fields = ['id', 'email', 'name', 'phone', 'role'];
      } else if (importType === 'listings') {
        fields = ['id', 'title_ru', 'title_kk', 'description_ru', 'description_kk', 
                 'price', 'discountPrice', 'categoryId', 'userId', 'city', 'isFeatured'];
      }
      
      setAvailableFields(fields);
      
      // Create default mappings (if CSV header matches expected field, map it automatically)
      const defaultMappings: Record<string, string> = {};
      headers.forEach(header => {
        if (fields.includes(header.replace(/[\s-]/g, '_').toLowerCase())) {
          defaultMappings[header] = header.replace(/[\s-]/g, '_').toLowerCase();
        }
      });
      
      setMappings(defaultMappings);
      
      // Parse preview data (first 5 rows)
      const previewRows = lines.slice(0, Math.min(6, lines.length)).map(line => 
        line.split(',').map(cell => cell.trim())
      );
      
      setPreviewData(previewRows);
    };
    
    reader.readAsText(file);
  };

  const handleImport = useCallback(() => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    setProgress(0);
    
    // Simulate import process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (currentProgress >= 100) {
        clearInterval(interval);
        currentProgress = 100;
        setProgress(100);
        
        setTimeout(() => {
          setIsImporting(false);
          toast({
            title: language === 'ru' ? "Импорт завершен" : "Импорт аяқталды",
            description: language === 'ru' 
              ? `Файл ${selectedFile.name} успешно импортирован`
              : `${selectedFile.name} файлы сәтті импортталды`
          });
          
          // Reset state
          setSelectedFile(null);
          setProgress(0);
          setPreviewData([]);
        }, 500);
      } else {
        setProgress(Math.min(currentProgress, 95));
      }
    }, 300);
    
    // In a real implementation, you would process the CSV file here
    // and import the data to your system
    
    return () => clearInterval(interval);
  }, [selectedFile, language, toast]);

  const entityTypeLabel = (type: ImportEntityType): string => {
    switch (type) {
      case 'categories':
        return language === 'ru' ? 'Категории' : 'Санаттар';
      case 'users':
        return language === 'ru' ? 'Пользователи' : 'Пайдаланушылар';
      case 'listings':
        return language === 'ru' ? 'Объявления' : 'Хабарландырулар';
      default:
        return type;
    }
  };

  const importTypeOptions: ImportEntityType[] = ['categories', 'users', 'listings'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {language === 'ru' ? 'Импорт данных из CSV' : 'CSV-дан деректерді импорттау'}
        </CardTitle>
        <CardDescription>
          {language === 'ru' 
            ? 'Импортируйте данные из файла CSV в систему'
            : 'CSV файлынан деректерді жүйеге импорттаңыз'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>
              {language === 'ru' ? 'Тип импорта' : 'Импорт түрі'}
            </Label>
            <Select 
              value={importType} 
              onValueChange={(value) => setImportType(value as ImportEntityType)}
              disabled={isImporting}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={language === 'ru' ? 'Выберите тип' : 'Түрін таңдаңыз'} />
              </SelectTrigger>
              <SelectContent>
                {importTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {entityTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {!selectedFile ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground" />
              <h3 className="mt-3 text-lg font-medium">
                {language === 'ru' ? 'Загрузите CSV файл' : 'CSV файлын жүктеңіз'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === 'ru' 
                  ? `Файл должен содержать данные для импорта ${entityTypeLabel(importType).toLowerCase()}`
                  : `Файл ${entityTypeLabel(importType).toLowerCase()} импорттау үшін деректерді қамтуы керек`}
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('csv-file-input')?.click()}
                  disabled={isImporting}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {language === 'ru' ? 'Выбрать файл' : 'Файлды таңдау'}
                </Button>
                <input 
                  id="csv-file-input" 
                  type="file" 
                  accept=".csv" 
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isImporting}
                />
              </div>
            </div>
          ) : (
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">
                  {language === 'ru' ? 'Предпросмотр' : 'Алдын ала қарау'}
                </TabsTrigger>
                <TabsTrigger value="mapping">
                  {language === 'ru' ? 'Сопоставление полей' : 'Өрістерді салыстыру'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="bg-muted rounded-md p-4 flex items-center">
                  <File className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <div className="ml-auto">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      disabled={isImporting}
                    >
                      {language === 'ru' ? 'Выбрать другой файл' : 'Басқа файлды таңдау'}
                    </Button>
                  </div>
                </div>
                
                {previewData.length > 0 && (
                  <div className="border rounded-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted">
                          {previewData[0].map((header, index) => (
                            <th 
                              key={index} 
                              className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {previewData.slice(1).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="px-4 py-2 text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="mapping" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      {language === 'ru' 
                        ? 'Сопоставление полей CSV с полями системы' 
                        : 'CSV өрістерін жүйе өрістерімен салыстыру'}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setMappings({})}
                      disabled={isImporting}
                    >
                      {language === 'ru' ? 'Сбросить' : 'Қайта орнату'}
                    </Button>
                  </div>
                  
                  {previewData[0]?.map((header, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1/3">
                        <Label className="text-sm">
                          {header} (CSV)
                        </Label>
                      </div>
                      <div className="w-1/3">
                        <Select 
                          value={mappings[header] || ''} 
                          onValueChange={(value) => {
                            setMappings(prev => ({...prev, [header]: value}));
                          }}
                          disabled={isImporting}
                        >
                          <SelectTrigger>
                            <SelectValue 
                              placeholder={language === 'ru' 
                                ? 'Выберите поле системы' 
                                : 'Жүйе өрісін таңдаңыз'} 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">
                              {language === 'ru' ? '-- Не импортировать --' : '-- Импорттамау --'}
                            </SelectItem>
                            {availableFields.map(field => (
                              <SelectItem key={field} value={field}>
                                {field}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-1/3 flex items-center">
                        {mappings[header] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                        )}
                        <span className="text-sm">
                          {mappings[header] 
                            ? (language === 'ru' ? 'Сопоставлено' : 'Салыстырылған') 
                            : (language === 'ru' ? 'Не сопоставлено' : 'Салыстырылмаған')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{language === 'ru' ? 'Импорт...' : 'Импорттау...'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedFile(null)}
              disabled={!selectedFile || isImporting}
            >
              {language === 'ru' ? 'Отмена' : 'Болдырмау'}
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!selectedFile || isImporting || Object.keys(mappings).length === 0}
            >
              {isImporting 
                ? (language === 'ru' ? 'Импорт...' : 'Импорттау...') 
                : (language === 'ru' ? 'Начать импорт' : 'Импортты бастау')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvImporter;
