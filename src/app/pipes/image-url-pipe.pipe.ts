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
      return 'assets/images/no-image-available.png';
    }

    // Handle direct Cloudinary URLs (prod)
    if (value.includes('cloudinary.com')) {
      return value;
    }

    // Handle local file references (dev)
    if (value.startsWith('/api/files/')) {
      return `${environment.apiUrl}${value}`;
    }

    // Handle filenames without prefix (legacy or dev)
    return `${environment.apiUrl}/api/files/${value}`;
  }
}