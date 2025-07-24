import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true
})
export class ImageUrlPipe implements PipeTransform {
  transform(imageUrl: string | null): string {
    if (!imageUrl) {
      return '';
    }
    // Return data URLs (for previews) unchanged
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl;
    }
    // Return full URLs (e.g., Cloudinary) unchanged
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // For dev environment, prepend the API URL
    return `${environment.apiUrl}/files/${imageUrl}`;
  }
}