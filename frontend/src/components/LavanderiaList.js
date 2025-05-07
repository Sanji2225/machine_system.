import React, { useEffect, useState } from 'react';
import { getLavanderias } from '../services/api';

const LavanderiaList = () => {
  const [lavanderias, setLavanderias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLavanderias = async () => {
      try {
        setLoading(true);
        const response = await getLavanderias();
        setLavanderias(response.data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar lavanderias. Verifique a conexão e se o backend está rodando.');
        console.error("Erro ao buscar lavanderias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLavanderias();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Carregando lavanderias...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 bg-red-100 p-3 rounded">{error}</p>;
  }

  if (lavanderias.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma lavanderia encontrada.</p>;
  }

  return (
    <div className="space-y-4">
      {lavanderias.map(lavanderia => (
        <div key={lavanderia.id} className="p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">{lavanderia.nome}</h2>
          <p className="text-gray-700 mb-1"><span className="font-medium">Endereço:</span> {lavanderia.endereco}</p>
          <p className="text-gray-700 mb-1">
            <span className="font-medium">Status:</span> 
            <span className={lavanderia.status === 'aberta' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {lavanderia.status === 'aberta' ? 'Aberta' : 'Fechada'}
            </span>
          </p>
          <p className="text-gray-700"><span className="font-medium">Localização:</span> Latitude {lavanderia.latitude}, Longitude {lavanderia.longitude}</p>
          {/* Aqui podem ser adicionadas informações sobre as máquinas desta lavanderia no futuro */}
        </div>
      ))}
    </div>
  );
};

export default LavanderiaList;

