export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: number;
  propertyTitle?: string;
  createdAt?: Date;
  status?: 'New' | 'Contacted' | 'Resolved';
}