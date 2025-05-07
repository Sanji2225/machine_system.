import React from 'react';

const MaquinaStatus = ({ maquina }) => {
  if (!maquina) {
    return <p className="text-sm text-gray-400">Dados da máquina não disponíveis.</p>;
  }

  return (
    <div className={`p-3 rounded-md shadow ${maquina.status === 'livre' ? 'bg-green-100' : 'bg-yellow-100'}`}>
      <p className="font-semibold text-md">
        Máquina ID: {maquina.id} - Status: 
        <span className={maquina.status === 'livre' ? 'text-green-700 font-bold' : 'text-yellow-700 font-bold'}>
          {maquina.status === 'livre' ? 'Livre' : 'Ocupada'}
        </span>
      </p>
      {maquina.status === 'ocupado' && maquina.previsao_liberacao && (
        <p className="text-sm text-gray-600">
          Previsão de Liberação: {new Date(maquina.previsao_liberacao).toLocaleTimeString()}
        </p>
      )}
      {!maquina.previsao_liberacao && maquina.status === 'ocupado' && (
         <p className="text-sm text-gray-600">Previsão de Liberação: N/A</p>
      )}
    </div>
  );
};

export default MaquinaStatus;

