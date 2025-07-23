import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  agentInfo = {
    name: 'Soham Realty',
    title: 'Building Trust. Creating Homes. Shaping Futures.',
    image: 'assets/Soham Realty Logo.jpg?w=800&h=800&fit=crop',
    description: `Soham Realty is a modern real estate firm rooted in trust, transparency, and a client-first mindset. Our mission is to simplify property buying and selling with expert guidance, ethical practices, and personalized service. Inspired by the Art of Living, we bring mindfulness and clarity to every step of the journey. We uniquely combine advanced digital tools virtual tours, real-time data, and secure documentation with a human touch, ensuring clients feel informed and supported. We offer high-quality property solutions for homebuyers, investors, and sellers always with integrity and professionalism...`,
    phone: ' +91 9766046101',
    email: ' dangevishal02@gmail.com',
    specialties: [
      'Residential Sales',
      'Luxury Properties',
      'First-Time Buyers',
      'Investment Properties'
    ],
    achievements: [
      '100% Client Satisfaction',
      'Fast-Growing Local Presence',
      'Technology-Driven Approach',
      'Dedicated to Ethical Real Estate Practices'
    ]
  };
}