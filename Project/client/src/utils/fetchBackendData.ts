// src/utils/fetchBackendData.ts
export async function fetchBackendData(endpoint: string) {
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error('Error al cargar datos del backend');
  return response.json();
}