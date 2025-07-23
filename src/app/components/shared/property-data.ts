// shared/property-data.ts (EXPANDED VERSION)

import { Property } from "../../models/property.model";

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    title: "Luxury Koregaon Park Apartment",
    price: 12500000,
    description: "Premium apartment near Osho Ashram with club access.",
    address: "24/7 North Main Road",
    city: "Pune",
    state: "Maharashtra",
    zip: "411001",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
    ],
    bedrooms: 3,
    bathrooms: 3,
    squareFootage: 1850,
    propertyType: "Apartment",
    status: "Available",
    videoLink: "https://www.instagram.com/reel/example1",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    title: "Baner Tech Park View Flat",
    price: 8995000,
    description: "2BHK with smart home features near IT parks.",
    address: "Sector 3, Balewadi High Street",
    city: "Pune",
    state: "Maharashtra",
    zip: "411045",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
    propertyType: "Apartment",
    status: "Available",
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 3,
    title: "Kothrud Traditional Bungalow",
    price: 27500000,
    description: "Spacious 4BHK independent house with pooja room.",
    address: "Paud Road Lane 5",
    city: "Pune",
    state: "Maharashtra",
    zip: "411038",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop"
    ],
    bedrooms: 4,
    bathrooms: 4,
    squareFootage: 4500,
    propertyType: "Independent House",
    status: "Sold",
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: 4,
    title: "Viman Nagar Studio Apartment",
    price: 5250000,
    description: "Compact studio near airport with modular kitchen.",
    address: "Ganga Constella Tower B",
    city: "Pune",
    state: "Maharashtra",
    zip: "411014",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
    ],
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 650,
    propertyType: "Studio Apartment",
    status: "Available",
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 5,
    title: "Aundh Luxury Villa",
    price: 32000000,
    description: "Gated community villa with private garden and pool.",
    address: "Vipul Greens Society",
    city: "Pune",
    state: "Maharashtra",
    zip: "411007",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
    ],
    bedrooms: 5,
    bathrooms: 5,
    squareFootage: 5500,
    propertyType: "Villa",
    status: "Available",
    videoLink: "https://www.instagram.com/reel/example2",
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 6,
    title: "Hinjewadi IT Professional Flat",
    price: 7850000,
    description: "3BHK near Rajiv Gandhi IT Park with metro access.",
    address: "Wakad-Hinjewadi Link Road",
    city: "Pune",
    state: "Maharashtra",
    zip: "411057",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1350,
    propertyType: "Apartment",
    status: "Available",
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 7,
    title: "Magarpatta City Penthouse",
    price: 42000000,
    description: "Premium terrace apartment with city skyline views.",
    address: "Cyprus Tower, Adenium Marg",
    city: "Pune",
    state: "Maharashtra",
    zip: "411028",
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop"
    ],
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 3200,
    propertyType: "Penthouse",
    status: "Available",
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: 8,
    title: "Kalyani Nagar Artist's Loft",
    price: 11000000,
    description: "Converted industrial loft with high ceilings near Koregaon Park.",
    address: "9th Street East Main Road",
    city: "Pune",
    state: "Maharashtra",
    zip: "411006",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
    ],
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1800,
    propertyType: "Loft",
    status: "Sold",
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: 9,
    title: "Model Colony Row House",
    price: 18500000,
    description: "3-story row house near Pune University.",
    address: "Bungalow No. 23, Lane 7",
    city: "Pune",
    state: "Maharashtra",
    zip: "411016",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop"
    ],
    bedrooms: 3,
    bathrooms: 3,
    squareFootage: 2400,
    propertyType: "Row House",
    status: "Available",
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: 10,
    title: "Pimple Saudagar Budget Flat",
    price: 4650000,
    description: "Affordable 1BHK near schools and markets.",
    address: "Sai Paradise Society",
    city: "Pune",
    state: "Maharashtra",
    zip: "411027",
    images: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=600&fit=crop"
    ],
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 550,
    propertyType: "Apartment",
    status: "Available",
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 11,
    title: "Shivajinagar Heritage Bungalow",
    price: 35000000,
    description: "Restored colonial-era property near FC Road.",
    address: "Connaught Road Plot 12",
    city: "Pune",
    state: "Maharashtra",
    zip: "411005",
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop"
    ],
    bedrooms: 5,
    bathrooms: 4,
    squareFootage: 6000,
    propertyType: "Bungalow",
    status: "Sold",
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-09')
  },
  {
    id: 12,
    title: "Wakad High-Rise Apartment",
    price: 6750000,
    description: "2BHK with balcony view in gated society.",
    address: "DSK Southern Park, Phase 2",
    city: "Pune",
    state: "Maharashtra",
    zip: "411057",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
    ],
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 950,
    propertyType: "Apartment",
    status: "Available",
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

// Constants for property types and other dropdown options
export const PROPERTY_TYPES = [
  'Farm House',
  'Flat',
  'Apartment', 
  'Condo',
  'Townhouse',
  'Villa',
  'Studio Apartment',
  'Penthouse',
  'Loft',
  'Row House',
  'Bungalow',
  'Independent House'
] as const;

export const PROPERTY_STATUS = [
  'Available',
  'Sold',
  'Pending'
] as const;

export const PRICE_RANGES = [
  { value: '0-500000', label: 'Under ₹5 Lakh' },
  { value: '500000-1000000', label: '₹5 Lakh - ₹10 Lakh' },
  { value: '1000000-2500000', label: '₹10 Lakh - ₹25 Lakh' },
  { value: '2500000-5000000', label: '₹25 Lakh - ₹50 Lakh' },
  { value: '5000000-10000000', label: '₹50 Lakh - ₹1 Crore' },
  { value: '10000000+', label: 'Above ₹1 Crore' }
];

export const BEDROOM_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+'];

export const CITIES = [
  'Pune',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Lucknow',
  'Nagpur',
  'Indore',
  'Coimbatore',
  'Visakhapatnam',
  'Patna',
  'Bhopal',
  'Vadodara',
  'Surat',
  'Nashik'
];


// Utility function to format price consistently
export function formatPrice(price: number): string {
  // For amounts less than 1 lakh (100,000), show in plain INR
  if (price < 100000) {
    return '₹' + new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(price);
  }
  
  // For amounts between 1 lakh and 1 crore (1,00,00,000)
  if (price < 10000000) {
    const lakhs = (price / 100000).toFixed(2);
    return '₹' + lakhs + ' Lakh';
  }
  
  // For amounts 1 crore and above
  const crores = (price / 10000000).toFixed(2);
  return '₹' + crores + ' Crore';
}