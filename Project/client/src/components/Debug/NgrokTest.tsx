import React, { useEffect, useState } from 'react';

const NgrokTest: React.FC = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://077c4779f807.ngrok-free.app/data', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        console.log('✅ Respuesta del backend:', text);
        setResponse(text);
      })
      .catch(err => {
        console.error('❌ Error al conectar con ngrok:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Prueba de conexión con ngrok</h2>
      {response && <p className="text-green-600">✅ Respuesta: {response}</p>}
      {error && <p className="text-red-600">❌ Error: {error}</p>}
      {!response && !error && <p>⌛ Conectando...</p>}
    </div>
  );
};

export default NgrokTest;
