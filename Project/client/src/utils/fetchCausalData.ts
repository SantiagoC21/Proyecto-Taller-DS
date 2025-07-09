export const fetchCausalModels = async () => {
  const response = await fetch('http://localhost:5000/causal');
  if (!response.ok) throw new Error('Failed to fetch causal models');
  return response.json();
};

