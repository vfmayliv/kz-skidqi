
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import Papa from 'papaparse';

interface ImportRecord {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  contact: string;
  [key: string]: any;
}

interface ImportStats {
  total: number;
  success: number;
  errors: number;
}

export const OjahCsvImport = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Загружаем категории при монтировании компонента
  React.useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('listing_categories')
        .select('*')
        .order('name_ru');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setImportStats(null);
      setErrors([]);
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, выберите CSV файл"
      });
    }
  };

  const findCategoryByName = (categoryName: string) => {
    return categories.find(cat => 
      cat.name_ru.toLowerCase().includes(categoryName.toLowerCase()) ||
      cat.name_kz.toLowerCase().includes(categoryName.toLowerCase())
    );
  };

  const processRecord = async (record: ImportRecord, index: number) => {
    try {
      // Находим категорию по названию
      const category = findCategoryByName(record.category || '');
      if (!category) {
        throw new Error(`Категория "${record.category}" не найдена`);
      }

      // Парсим цену
      const price = parseInt(record.price?.replace(/[^\d]/g, '') || '0');

      // Создаем объявление
      const listingData = {
        title: record.title || `Объявление ${index + 1}`,
        description: record.description || '',
        regular_price: price > 0 ? price : null,
        is_free: price === 0,
        category_id: category.id,
        address: record.location || '',
        phone: record.contact || '',
        status: 'active',
        user_id: (await supabase.auth.getUser()).data.user?.id
      };

      const { error } = await supabase
        .from('listings')
        .insert([listingData]);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: `Строка ${index + 1}: ${error.message}` 
      };
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setImportStats(null);
    setErrors([]);

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const records = results.data as ImportRecord[];
          let successCount = 0;
          const errorList: string[] = [];

          for (let i = 0; i < records.length; i++) {
            const result = await processRecord(records[i], i);
            if (result.success) {
              successCount++;
            } else {
              errorList.push(result.error || `Ошибка в строке ${i + 1}`);
            }
          }

          setImportStats({
            total: records.length,
            success: successCount,
            errors: errorList.length
          });

          setErrors(errorList);

          if (successCount > 0) {
            toast({
              title: "Импорт завершен",
              description: `Успешно импортировано ${successCount} из ${records.length} записей`
            });
          }

          setImporting(false);
        },
        error: (error) => {
          console.error('Ошибка парсинга CSV:', error);
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Ошибка при обработке CSV файла"
          });
          setImporting(false);
        }
      });
    } catch (error) {
      console.error('Ошибка импорта:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при импорте"
      });
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: 'Название объявления',
        description: 'Описание товара или услуги',
        price: '1000',
        category: 'Электроника',
        location: 'г. Алматы, ул. Абая 1',
        contact: '+7 777 123 45 67'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Импорт объявлений из CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <Label htmlFor="csv-file">Выберите CSV файл</Label>
              <p className="text-sm text-muted-foreground">
                Файл должен содержать колонки: title, description, price, category, location, contact
              </p>
            </div>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Скачать шаблон
            </Button>
          </div>

          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={importing}
          />

          {file && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{file.name}</span>
              <Badge variant="secondary">
                {(file.size / 1024).toFixed(1)} KB
              </Badge>
            </div>
          )}

          <Button
            onClick={handleImport}
            disabled={!file || importing}
            className="w-full"
          >
            {importing ? 'Импортируется...' : 'Начать импорт'}
          </Button>
        </CardContent>
      </Card>

      {importStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Результаты импорта
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{importStats.total}</div>
                <div className="text-sm text-muted-foreground">Всего записей</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importStats.success}</div>
                <div className="text-sm text-muted-foreground">Успешно</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{importStats.errors}</div>
                <div className="text-sm text-muted-foreground">Ошибок</div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Ошибки импорта:
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
