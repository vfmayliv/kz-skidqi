
import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ListingGalleryProps {
  images: string[];
  title: string;
  language: string;
}

export const ListingGallery = ({ images, title, language }: ListingGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  return (
    <div className="bg-white rounded-lg p-2 shadow-sm">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="flex aspect-video items-center justify-center p-1">
                <img 
                  src={image} 
                  alt={`${title} - ${index + 1}`} 
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      
      {/* Thumbnails */}
      <div className="flex mt-2 overflow-x-auto gap-2 pb-2">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`w-20 h-16 flex-shrink-0 rounded cursor-pointer ${index === selectedImageIndex ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <img 
              src={image} 
              alt={`Thumbnail ${index + 1}`} 
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
