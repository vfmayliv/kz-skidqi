
/**
 * Utility functions for image handling
 */

/**
 * Converts an image to WebP format
 * @param file The image file to convert
 * @param quality Quality of the WebP image (0-1)
 * @returns Promise that resolves to a Blob in WebP format
 */
export const convertToWebP = async (file: File, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image to WebP'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a File object from a Blob
 * @param blob The Blob to convert to a File
 * @param originalFile The original File to get metadata from
 * @returns A new File object with WebP extension
 */
export const createWebPFile = (blob: Blob, originalFile: File): File => {
  // Get the filename without extension
  const filenameParts = originalFile.name.split('.');
  filenameParts.pop(); // Remove the extension
  const filenameWithoutExt = filenameParts.join('.');
  
  // Create a new filename with WebP extension
  const newFilename = `${filenameWithoutExt}.webp`;
  
  // Create a new File object
  return new File([blob], newFilename, {
    type: 'image/webp',
    lastModified: Date.now()
  });
};

/**
 * Process an image for upload - converts to WebP and optimizes
 * @param file The image file to process
 * @returns Promise that resolves to a processed File in WebP format
 */
export const processImageForUpload = async (file: File): Promise<File> => {
  // Check if the file is already a WebP image
  if (file.type === 'image/webp') {
    return file;
  }
  
  // Check if the file is an image
  if (!file.type.startsWith('image/')) {
    return file; // Return original file if not an image
  }
  
  try {
    // Convert to WebP
    const webpBlob = await convertToWebP(file);
    
    // Create a new File object
    return createWebPFile(webpBlob, file);
  } catch (error) {
    console.error('Failed to convert image to WebP:', error);
    return file; // Return original file on error
  }
};

/**
 * Process multiple images for upload
 * @param files Array of image files to process
 * @returns Promise that resolves to an array of processed Files
 */
export const processImagesForUpload = async (files: File[]): Promise<File[]> => {
  const processedFiles: File[] = [];
  
  for (const file of files) {
    const processedFile = await processImageForUpload(file);
    processedFiles.push(processedFile);
  }
  
  return processedFiles;
};

/**
 * Creates an image URL for a given file (for preview)
 * @param file File to create URL for
 * @returns URL of the image
 */
export const createImagePreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes an image URL to free up memory
 * @param url URL to revoke
 */
export const revokeImagePreviewUrl = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Upload an image to the server (mock implementation)
 * @param file The file to upload
 * @param uploadFn Optional custom upload function
 * @returns A promise that resolves to the uploaded image URL
 */
export const uploadImage = async (file: File, uploadFn?: (blob: Blob, filename: string) => Promise<string>): Promise<string> => {
  // First, process the image to WebP format
  const processedFile = await processImageForUpload(file);
  
  // If a custom upload function is provided, use it
  if (uploadFn) {
    return uploadFn(processedFile, processedFile.name);
  }
  
  // In a real app, you would upload the file to a server here
  console.log('Uploading image:', processedFile.name);
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo, just return a placeholder URL
  return `https://placehold.co/600x400?text=${encodeURIComponent(processedFile.name)}`;
};

/**
 * Upload multiple images to the server (mock implementation)
 * @param files The files to upload
 * @returns A promise that resolves to an array of uploaded image URLs
 */
export const uploadImages = async (files: File[]): Promise<string[]> => {
  const urls: string[] = [];
  
  for (const file of files) {
    const url = await uploadImage(file);
    urls.push(url);
  }
  
  return urls;
};
