// services/contact.service.ts (MOCK VERSION)
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Contact } from '../../models/contact.model';
import { PaginatedResponse } from '../../models/api-paginatedresponse.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private mockContacts: Contact[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+91 9876543210',
      message: 'I am interested in the Luxury Koregaon Park Apartment. Please contact me.',
      propertyId: 1,
      createdAt: new Date('2024-01-15'),
      status: 'New'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+91 9876543211',
      message: 'Could you provide more information about the Baner Tech Park View Flat?',
      propertyId: 2,
      createdAt: new Date('2024-01-16'),
      status: 'New'
    }
  ];

  constructor() {}

  getAllContacts(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Contact>> {
    return new Observable(observer => {
      setTimeout(() => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = this.mockContacts.slice(startIndex, endIndex);
        
        const response: PaginatedResponse<Contact> = {
          data: paginatedData,
          total: this.mockContacts.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(this.mockContacts.length / limit)
        };
        
        observer.next(response);
        observer.complete();
      }, 300);
    });
  }

  createContact(contact: Omit<Contact, 'id'>): Observable<ApiResponse<Contact>> {
    return new Observable(observer => {
      setTimeout(() => {
        const newContact: Contact = {
          ...contact,
          id: Math.max(...this.mockContacts.map(c => c.id || 0)) + 1,
          createdAt: new Date(),
          status: 'New'
        };
        
        this.mockContacts.unshift(newContact);
        
        observer.next({
          success: true,
          data: newContact,
          message: 'Contact saved successfully'
        });
        observer.complete();
      }, 500);
    });
  }

  deleteContact(id: number): Observable<ApiResponse<void>> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.mockContacts.findIndex(c => c.id === id);
        if (index !== -1) {
          this.mockContacts.splice(index, 1);
          observer.next({
            success: true,
            data: undefined,
            message: 'Contact deleted successfully'
          });
        } else {
          observer.error({
            success: false,
            error: 'Contact not found'
          });
        }
        observer.complete();
      }, 300);
    });
  }

  updateContactStatus(id: number, status: string): Observable<ApiResponse<Contact>> {
    return new Observable(observer => {
      setTimeout(() => {
        const contact = this.mockContacts.find(c => c.id === id);
        if (contact) {
          contact.status = status as any;
          observer.next({
            success: true,
            data: contact,
            message: 'Contact status updated'
          });
        } else {
          observer.error({
            success: false,
            error: 'Contact not found'
          });
        }
        observer.complete();
      }, 300);
    });
  }
}
