export interface Property {
    id: number;
    title: string;
    price: number;
    description: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    videoLink?: string;
    propertyType: 'Apartment' |'Condo' | 'Independent House' | 'Villa' | 'Studio Apartment' | 'Penthouse' | 'Loft' | 'Row House' | 'Bungalow' | 'Townhouse'| 'House';
    featured?: boolean;
    status?: 'Available' | 'Sold';
    createdAt?: Date;
    updatedAt?: Date;
  }
