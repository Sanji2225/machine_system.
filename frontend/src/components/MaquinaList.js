import React, { useEffect, useState } from 'react';
import { getMaquinas, getMaquinaStatus } from '../services/api'; // Supondo que você terá uma função para buscar máquinas por lavanderia ou todas

const MaquinaList = ({ lavanderiaId }) => {
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaquinas = async () => {
      try {
        setLoading(true);
        // Se lavanderiaId for fornecido, busca máquinas daquela lavanderia, senão busca todas (ajuste a API conforme necessário)
        const response = await getMaquinas(lavanderiaId);
        // Para cada máquina, buscar seu status mais recente
        const maquinasComStatus = await Promise.all(
          response.data.map(async (maquina) => {
            try {
              const statusResponse = await getMaquinaStatus(maquina.id);
              return { ...maquina, ...statusResponse.data };
            } catch (statusError) {
              console.error(`Erro ao buscar status da máquina ${maquina.id}:`, statusError);
              return { ...maquina, status: 'desconhecido', previsao_liberacao: 'N/A' }; // Fallback em caso de erro
            }
          })
        );
        setMaquinas(maquinasComStatus);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar máquinas. Verifique a conexão e se o backend está rodando.');
        console.error("Erro ao buscar máquinas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaquinas();
  }, [lavanderiaId]);

  if (loading) {
    return <p className="text-center text-gray-500">Carregando máquinas...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 bg-red-100 p-3 rounded">{error}</p>;
  }

  if (maquinas.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma máquina encontrada{lavanderiaId ? ' para esta lavanderia' : ''}.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Máquinas Disponíveis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {maquinas.map(maquina => (
          <div key={maquina.id} className="p-4 border rounded-lg shadow-md bg-gray-50">
            <h4 className="text-lg font-semibold text-blue-500">Máquina ID: {maquina.id}</h4>
            <p className="text-gray-600">
              Status: 
              <span className={maquina.status === 'livre' ? 'text-green-500 font-bold' : 'text-yellow-500 font-bold'}>
                {maquina.status === 'livre' ? 'Livre' : 'Ocupada'}
              </span>
            </p>
            {maquina.status === 'ocupado' && maquina.previsao_liberacao && (
              <p className="text-gray-600">Previsão de Liberação: {new Date(maquina.previsao_liberacao).toLocaleString()}</p>
            )}
             <p className="text-sm text-gray-500">Lavanderia ID: {maquina.lavanderia}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaquinaList;

