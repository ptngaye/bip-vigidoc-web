const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.vigidoc.bip-tech.fr';

export const apiConfig = {
  baseUrl: API_BASE_URL,
} as const;
