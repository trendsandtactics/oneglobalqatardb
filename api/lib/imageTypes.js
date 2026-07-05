// SVG is deliberately excluded: it can embed <script> and executes in the
// browser when loaded directly, making it a stored-XSS vector for an
// "image" upload endpoint.
export const ALLOWED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);
