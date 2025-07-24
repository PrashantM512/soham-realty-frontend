import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Property } from '../../../models/property.model';
import { Contact } from '../../../models/contact.model';
import { PropertyService } from '../../../services/property.service';
import { ContactService } from '../../../services/contact.service';
import { Subject, takeUntil } from 'rxjs';
import { UtilityService } from '../../shared/utility.service';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css'],
  imports: [ReactiveFormsModule, DecimalPipe, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  property: Property | null = null;
  currentImageIndex = 0;
  activeTab = 'overview';
  contactForm: FormGroup;
  isSubmitting = false;
  isLoading = true;
  error = '';
  submitSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private contactService: ContactService,
    private cdr: ChangeDetectorRef,
    private utilityService: UtilityService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      message: ['I am interested in this property. Please contact me with more details.', Validators.required]
    });
  }

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.loadProperty(+propertyId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProperty(id: number): void {
    this.isLoading = true;
    this.error = '';
    this.cdr.markForCheck(); // Trigger change detection

    this.propertyService.getPropertyById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.property = response.data;
          this.isLoading = false;
          this.cdr.markForCheck(); // Trigger change detection
        },
        error: (error) => {
          this.error = 'Failed to load property details';
          this.isLoading = false;
          console.error('Error loading property:', error);
          this.cdr.markForCheck();
        }
      });
  }

  onSubmitContact(): void {
    if (this.contactForm.valid && this.property) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.cdr.markForCheck();

      const contactData: Omit<Contact, 'id'> = {
        ...this.contactForm.value,
        propertyId: this.property.id,
        createdAt: new Date(),
        status: 'New'
      };

      this.contactService.createContact(contactData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.isSubmitting = false;
            this.submitSuccess = true;
            this.contactForm.reset({
              message: 'I am interested in this property. Please contact me with more details.'
            });
            this.cdr.markForCheck();
          },
          error: (error) => {
            this.isSubmitting = false;
            console.error('Contact submission error:', error);
            this.cdr.markForCheck();
          }
        });
    } else {
      this.markFormGroupTouched();
      this.cdr.markForCheck();
    }
  }

  nextImage(): void {
    if (this.property && this.currentImageIndex < this.property.images.length - 1) {
      this.currentImageIndex++;
      this.cdr.markForCheck();
    }
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.cdr.markForCheck();
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
    this.cdr.markForCheck();
  }
 
  previousImage(): void {
    if (this.property && this.property.images) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.property.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });
  }

  formatPrice(value: number): string {
    return this.utilityService.formatPrice(value);
  }
  

  openVideoLink(): void {
    if (this.property?.videoLink) {
      window.open(this.property.videoLink, '_blank');
    }
  }
}
