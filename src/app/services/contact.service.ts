import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginatedResponse } from '../models/api-paginatedresponse.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  getAllContacts(page: number = 1, limit: number = 5): Observable<PaginatedResponse<Contact>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<PaginatedResponse<Contact>>(this.apiUrl, { params });
  }

  createContact(contact: Omit<Contact, 'id'>): Observable<ApiResponse<Contact>> {
    return this.http.post<ApiResponse<Contact>>(this.apiUrl, contact);
  }

  deleteContact(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  updateContactStatus(id: number, status: string): Observable<ApiResponse<Contact>> {
    return this.http.patch<ApiResponse<Contact>>(`${this.apiUrl}/${id}/status`, { status });
  }
  getPropertyNameById(propertyId: number): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${this.apiUrl}/property/${propertyId}/name`);
  }
}
