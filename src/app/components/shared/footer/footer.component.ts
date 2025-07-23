import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  socialLinks = [
    { 
      icon: 'fab fa-whatsapp', 
      url: 'https://wa.me/9766046101',
      label: 'WhatsApp' 
    },
    { icon: 'fab fa-facebook-f', url: 'https://facebook.com', label: 'Facebook' },
    { icon: 'fab fa-instagram', url: 'https://www.instagram.com/soham_realty_pune?igsh=ZmZhd3V5MnpqYnY=', label: 'Instagram' }
  ];
}