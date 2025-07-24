import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { Property } from '../models/property.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginatedResponse } from '../models/api-paginatedresponse.model';
import { SearchParams } from '../models/search-params.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/properties`;

  private featuredPropertiesCache$ = new BehaviorSubject<Property[]>([]);
  private propertyCache = new Map<number, Property>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000;

  constructor(private http: HttpClient) {}

  getAllProperties(searchParams: SearchParams): Observable<PaginatedResponse<Property>> {
    let params = new HttpParams();

    console.log('Sending search params to backend:', searchParams);
  
    if (searchParams.search) params = params.set('search', searchParams.search);
    if (searchParams.location) params = params.set('location', searchParams.location);
    if (searchParams.priceRange) params = params.set('priceRange', searchParams.priceRange);
    if (searchParams.propertyType) params = params.set('propertyType', searchParams.propertyType);
    if (searchParams.bedrooms) params = params.set('bedrooms', searchParams.bedrooms);
    if (searchParams.sortBy) params = params.set('sortBy', searchParams.sortBy);
    if (searchParams.page) params = params.set('page', searchParams.page.toString());
    if (searchParams.limit) params = params.set('limit', searchParams.limit.toString());

    return this.http.get<PaginatedResponse<Property>>(this.apiUrl, { params });
  }

  getFeaturedProperties(): Observable<ApiResponse<Property[]>> {
    const cacheKey = 'featured_properties';
    const now = Date.now();
  
    if (
      this.cacheExpiry.has(cacheKey) &&
      this.cacheExpiry.get(cacheKey)! > now &&
      this.featuredPropertiesCache$.value.length > 0
    ) {
      return of({
        success: true,
        data: this.featuredPropertiesCache$.value,
        message: 'Success'
      });
    }
  
    return this.http.get<ApiResponse<Property[]>>(`${this.apiUrl}/featured`).pipe(
      tap((response) => {
        this.featuredPropertiesCache$.next(response.data);
        this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
      }),
      shareReplay(1)
    );
  }

  getPropertyById(id: number): Observable<ApiResponse<Property>> {
    if (this.propertyCache.has(id)) {
      return of({
        success: true,
        data: this.propertyCache.get(id)!,
        message: 'Success'
      });
    }

    return this.http.get<ApiResponse<Property>>(`${this.apiUrl}/${id}`).pipe(
      tap((response) => {
        this.propertyCache.set(id, response.data);
      })
    );
  }

  createProperty(property: any): Observable<ApiResponse<Property>> {
    const { images, ...propertyData } = property;
    return this.http.post<ApiResponse<Property>>(this.apiUrl, propertyData).pipe(
      tap(() => this.clearCache())
    );
  }

  updateProperty(id: number, property: any): Observable<ApiResponse<Property>> {
    const { images, ...propertyData } = property;
    return this.http.put<ApiResponse<Property>>(`${this.apiUrl}/${id}`, propertyData).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteProperty(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  uploadPropertyImages(propertyId: number, files: File[]): Observable<ApiResponse<string[]>> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file); // Match backend endpoint parameter
    });

    return this.http.post<ApiResponse<string[]>>(`${this.apiUrl}/${propertyId}/images`, formData, {
      headers: { 'Accept': 'application/json' }
    });
}

  private clearCache(): void {
    this.featuredPropertiesCache$.next([]);
    this.propertyCache.clear();
    this.cacheExpiry.clear();
  }
}