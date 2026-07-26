/** Neutral placeholder — avoids random external avatars (pravatar) */
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect fill="#0B1220" width="400" height="300"/>
      <text x="200" y="155" fill="#64748B" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16">No Image</text>
    </svg>`
  );
