export const VALIDATION_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^[\+]?[1-9][\d]{0,15}$/,
    INDIAN_PHONE: /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/,
    ZIP_CODE: /^\d{6}$/,
    INSTAGRAM_URL: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[\w-]+\/?$/
  };
  
  export const FILE_CONSTRAINTS = {
    MAX_IMAGE_SIZE_MB: 5,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_IMAGES_COUNT: 5
  };
  
  export const VALIDATION_MESSAGES = {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PHONE_INVALID: 'Please enter a valid phone number',
    PASSWORD_MISMATCH: 'Passwords do not match',
    FILE_SIZE_EXCEEDED: 'File size exceeds maximum limit',
    INVALID_FILE_TYPE: 'Invalid file type'
  };