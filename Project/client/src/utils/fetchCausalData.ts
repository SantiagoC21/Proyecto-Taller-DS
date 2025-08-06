const BASE_URL = import.meta.env.VITE_API_BASE

export const fetchCausalModels = async () => {
  const response = await fetch(`${BASE_URL}/causal`, {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) throw new Error('Failed to fetch causal models');
  return response.json();
};

