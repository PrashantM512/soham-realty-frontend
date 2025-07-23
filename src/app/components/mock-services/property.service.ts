// services/property.service.ts (MOCK VERSION - No backend required)
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { MOCK_PROPERTIES } from '../shared/property-data';
import { Property } from '../../models/property.model';
import { SearchParams } from '../../models/search-params.model';
import { PaginatedResponse } from '../../models/api-paginatedresponse.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private mockProperties: Property[] = MOCK_PROPERTIES;

  constructor() {}

  getAllProperties(searchParams?: SearchParams): Observable<PaginatedResponse<Property>> {
    return new Observable(observer => {
      setTimeout(() => {
        let filteredProperties = [...this.mockProperties];
        
        // Apply filters
        if (searchParams?.location) {
          const location = searchParams.location.toLowerCase();
          filteredProperties = filteredProperties.filter(p => 
            p.city.toLowerCase().includes(location) ||
            p.address.toLowerCase().includes(location) ||
            p.zip.includes(location)
          );
        }
        
        if (searchParams?.priceRange) {
          const [min, max] = searchParams.priceRange.split('-').map(p => parseInt(p));
          if (max) {
            filteredProperties = filteredProperties.filter(p => p.price >= min && p.price <= max);
          } else {
            filteredProperties = filteredProperties.filter(p => p.price >= min);
          }
        }
        
        if (searchParams?.propertyType && searchParams.propertyType !== 'All Types') {
          filteredProperties = filteredProperties.filter(p => p.propertyType === searchParams.propertyType);
        }
        
        if (searchParams?.bedrooms && searchParams.bedrooms !== 'Any') {
          const minBeds = parseInt(searchParams.bedrooms.replace('+', ''));
          filteredProperties = filteredProperties.filter(p => p.bedrooms >= minBeds);
        }
        
        // Apply sorting
        switch (searchParams?.sortBy) {
          case 'priceLow':
            filteredProperties.sort((a, b) => a.price - b.price);
            break;
          case 'priceHigh':
            filteredProperties.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
          default:
            filteredProperties.sort((a, b) => 
              new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
            );
            break;
        }
        
        // Apply pagination
        const page = searchParams?.page || 1;
        const limit = searchParams?.limit || 9;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredProperties.slice(startIndex, endIndex);
        
        const response: PaginatedResponse<Property> = {
          data: paginatedData,
          total: filteredProperties.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(filteredProperties.length / limit)
        };
        
        observer.next(response);
        observer.complete();
      }, 500); // Simulate network delay
    });
  }

  getPropertyById(id: number): Observable<ApiResponse<Property>> {
    return new Observable(observer => {
      setTimeout(() => {
        const property = this.mockProperties.find(p => p.id === id);
        if (property) {
          observer.next({
            success: true,
            data: property,
            message: 'Property found'
          });
        } else {
          observer.error({
            success: false,
            error: 'Property not found'
          });
        }
        observer.complete();
      }, 300);
    });
  }

  getFeaturedProperties(): Observable<ApiResponse<Property[]>> {
    return new Observable(observer => {
      setTimeout(() => {
        // Return first 3 available properties as featured
        const featured = this.mockProperties
          .filter(p => p.status === 'Available')
          .slice(0, 3);
        
        observer.next({
          success: true,
          data: featured,
          message: 'Featured properties loaded'
        });
        observer.complete();
      }, 400);
    });
  }

  createProperty(property: Omit<Property, 'id'>): Observable<ApiResponse<Property>> {
    return new Observable(observer => {
      setTimeout(() => {
        const newProperty: Property = {
          ...property,
          id: Math.max(...this.mockProperties.map(p => p.id)) + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        this.mockProperties.unshift(newProperty);
        
        observer.next({
          success: true,
          data: newProperty,
          message: 'Property created successfully'
        });
        observer.complete();
      }, 600);
    });
  }

  updateProperty(id: number, property: Partial<Property>): Observable<ApiResponse<Property>> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockProperties.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mockProperties[index] = {
            ...this.mockProperties[index],
            ...property,
            updatedAt: new Date()
          };
          
          observer.next({
            success: true,
            data: this.mockProperties[index],
            message: 'Property updated successfully'
          });
        } else {
          observer.error({
            success: false,
            error: 'Property not found'
          });
        }
        observer.complete();
      }, 600);
    });
  }

  deleteProperty(id: number): Observable<ApiResponse<void>> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockProperties.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mockProperties.splice(index, 1);
          observer.next({
            success: true,
            data: undefined,
            message: 'Property deleted successfully'
          });
        } else {
          observer.error({
            success: false,
            error: 'Property not found'
          });
        }
        observer.complete();
      }, 400);
    });
  }

  uploadImages(files: File[]): Observable<ApiResponse<string[]>> {
    return new Observable(observer => {
      setTimeout(() => {
        // Mock image URLs
        const imageUrls = files.map((_, index) => 
          `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&sig=${Date.now()}_${index}`
        );
        
        observer.next({
          success: true,
          data: imageUrls,
          message: 'Images uploaded successfully'
        });
        observer.complete();
      }, 1000);
    });
  }
}

