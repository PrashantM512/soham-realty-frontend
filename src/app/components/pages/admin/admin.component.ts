import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PropertiesManagementComponent } from './properties-management/properties-management.component';
import { ContactsManagementComponent } from './contacts-management/contacts-management.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, PropertiesManagementComponent, ContactsManagementComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  activeTab: 'properties' | 'contacts' = 'properties';

  constructor(private router: Router) {}

  setActiveTab(tab: 'properties' | 'contacts'): void {
    this.activeTab = tab;
  }
}