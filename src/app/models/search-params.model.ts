export interface SearchParams {
  search?: string; // Optional search query
  title?: string;  
    location?: string;
    priceRange?: string;
    propertyType?: string;
    bedrooms?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }