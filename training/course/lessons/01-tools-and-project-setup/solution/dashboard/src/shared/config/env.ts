// Course version (lesson 01) — becomes the full RailPass version in lesson 05.
const DEFAULT_API_URL = 'http://localhost:3000/api';

function readApiUrl() {
  const value = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
  if (!URL.canParse(value)) throw new Error(`VITE_API_URL must be an absolute URL, received "${value}".`);
  return value;
}

export const env = {
  apiUrl: readApiUrl(),
} as const;
