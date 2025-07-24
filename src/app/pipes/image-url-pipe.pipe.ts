import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    // Handle null/undefined values
    if (!value) {
      return 'assets/images/no-image-available.png'; // Make sure you have this default image
    }

    // Fix the incorrect URL format from database
    // Example: /api/files/http://res.cloudinary.com/daz7kufro/image/upload/v1753345678/bh6dsypl2yjqe2ytyhav.png
    if (value.includes('/api/files/http')) {
      // Extract the Cloudinary URL
      const cloudinaryUrl = value.substring(value.indexOf('http'));
      return cloudinaryUrl;
    }

    // Handle direct Cloudinary URLs
    if (value.includes('cloudinary.com')) {
      // Remove any /api/files/ prefix if present
      return value.replace('/api/files/', '');
    }

    // Handle full URLs (http or https)
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    // Handle local file references (for backward compatibility)
    if (value.startsWith('/api/files/')) {
      return `${environment.apiUrl}${value}`;
    }

    // Default case - assume it's a relative path
    return `${environment.apiUrl}/api/files/${value}`;
  }
}