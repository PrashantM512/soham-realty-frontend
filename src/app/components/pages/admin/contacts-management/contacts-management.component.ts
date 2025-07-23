import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../../services/contact.service';
import { Contact } from '../../../../models/contact.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contacts-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-management.component.html',
  styleUrl: './contacts-management.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsManagementComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  showDeleteConfirm = false;
  contactToDelete: Contact | null = null;
  isLoading = true;

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  totalContacts = 0;
  paginatedContacts: Contact[] = [];

  private destroy$ = new Subject<void>();

  showDetailDialog = false;
selectedContact: any = null;

viewDetails(contact: any) {
  this.selectedContact = contact;
  this.showDetailDialog = true;
}

closeDetailDialog() {
  this.showDetailDialog = false;
  this.selectedContact = null;
}

  constructor(
    private contactService: ContactService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.contactService.getAllContacts(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.contacts = response.data;
          this.paginatedContacts = response.data;
          this.totalContacts = response.total;
          this.totalPages = response.totalPages;
          this.currentPage = response.page;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading contacts:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadContacts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadContacts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadContacts();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  confirmDelete(contact: Contact): void {
    this.contactToDelete = contact;
    this.showDeleteConfirm = true;
  }

  deleteContact(): void {
    if (this.contactToDelete && this.contactToDelete.id) {
      this.contactService.deleteContact(this.contactToDelete.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // If we're on the last page and deleting the last item, go to previous page
            if (this.paginatedContacts.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            }
            this.loadContacts();
            this.cancelDelete();
          },
          error: (error) => {
            console.error('Error deleting contact:', error);
            alert('Failed to delete contact. Please try again.');
            this.cancelDelete();
          }
        });
    }
  }

  cancelDelete(): void {
    this.contactToDelete = null;
    this.showDeleteConfirm = false;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  trackByContactId(index: number, contact: Contact): number {
    return contact.id || index;
  }
}
