import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'daily protein club',
    short_name: 'dp club',
    description: 'track your daily protein intake, simply',
    start_url: '/',
    display: 'standalone',
    background_color: '#212121',
    theme_color: '#212121',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
