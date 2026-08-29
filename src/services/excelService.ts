import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Product } from '../types';

export const parseProductsExcelOrCsv = async (file: File): Promise<{ products: Partial<Product>[], errors: string[] }> => {
  return new Promise((resolve) => {
    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const errors: string[] = [];

    if (isCsv) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = processRawData(results.data, errors);
          resolve({ products: parsed, errors });
        },
        error: (error) => {
          errors.push(`CSV Parse Error: ${error.message}`);
          resolve({ products: [], errors });
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          const parsed = processRawData(json as any[], errors);
          resolve({ products: parsed, errors });
        } catch (error: any) {
          errors.push(`Excel Parse Error: ${error.message}`);
          resolve({ products: [], errors });
        }
      };
      reader.onerror = () => {
        errors.push("Failed to read the file.");
        resolve({ products: [], errors });
      };
      reader.readAsBinaryString(file);
    }
  });
};

const processRawData = (data: any[], errors: string[]): Partial<Product>[] => {
  const products: Partial<Product>[] = [];

  data.forEach((row, index) => {
    const title = row['Title'] || row['title'] || row['Name'];
    if (!title) {
      errors.push(`Row ${index + 2}: Missing required 'Title' field.`);
      return;
    }

    const categoryId = row['Category'] || row['categoryId'] || 'smartphones';
    const discountedPrice = parseFloat(row['Discounted Price'] || row['discountedPrice'] || row['Price'] || '0');
    const affiliateLink = row['Affiliate Link'] || row['affiliateLink'] || '';
    
    // Process Pros and Cons (split by pipe or comma)
    const rawPros = row['Pros'] || row['pros'] || '';
    const pros = rawPros.split(/[|,]+/).map((s: string) => s.trim()).filter(Boolean);

    const rawCons = row['Cons'] || row['cons'] || '';
    const cons = rawCons.split(/[|,]+/).map((s: string) => s.trim()).filter(Boolean);

    const rawRank = parseInt(row['Best Ranking'] || row['bestRanking'], 10);
    const bestRankings = !isNaN(rawRank) ? [{
      categorySlug: categoryId,
      rank: rawRank,
      label: row['Ranking Label'] || row['rankingLabel'] || "Editor's Choice"
    }] : [];

    products.push({
      title,
      categoryId: categoryId.toLowerCase(),
      brand: row['Brand'] || row['brand'] || 'Generic',
      model: row['Model'] || row['model'] || '',
      description: row['Description'] || row['description'] || '',
      bestFor: row['Best For'] || row['bestFor'] || '',
      originalPrice: parseFloat(row['Original Price'] || row['originalPrice'] || '0'),
      discountedPrice,
      affiliateLink,
      imageUrl: row['Image URL'] || row['imageUrl'] || 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      store: row['Store'] || row['store'] || 'Amazon',
      recommendationScore: parseFloat(row['Score'] || row['recommendationScore'] || '9.0'),
      recommendationLabel: row['Recommendation Label'] || row['recommendationLabel'] || '',
      pros: pros.length > 0 ? pros : undefined,
      cons: cons.length > 0 ? cons : undefined,
      bestRankings,
      active: true,
      published: true
    });
  });

  return products;
};

export const generateSampleTemplateCsv = (): string => {
  const headers = [
    'Title', 'Category', 'Brand', 'Model', 'Description', 'Best For', 
    'Original Price', 'Discounted Price', 'Affiliate Link', 'Image URL', 
    'Store', 'Score', 'Recommendation Label', 'Best Ranking', 'Ranking Label', 
    'Pros', 'Cons'
  ];
  
  const sampleRow = [
    'iPhone 15 Pro Max', 'smartphones', 'Apple', '15 Pro Max', 'Top tier flagship', 'Creators',
    '159900', '149900', 'https://amzn.to/sample', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'Amazon', '9.5', 'Editor\'s Choice', '1', 'Best Premium',
    'Amazing cameras|Great battery|Titanium build', 'Very expensive|Slow charging'
  ];

  return [headers.join(','), sampleRow.map(v => `"${v}"`).join(',')].join('\n');
};

export const downloadCsvFile = (filename: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
