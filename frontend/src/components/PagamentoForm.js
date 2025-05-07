import React, { useState } from 'react';
import { registrarPagamento, aprovarPagamento } from '../services/api'; // Supondo que você tenha essas funções na sua API

const PagamentoForm = ({ maquinaId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Simula um processo de pagamento
  const handlePagamento = async () => {
    if (!maquinaId) {
      setError("ID da máquina não fornecido para o pagamento.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Etapa 1: Registrar a tentativa de pagamento (poderia retornar um ID de transação)
      const registroResponse = await registrarPagamento({ maquina: maquinaId, aprovado: false }); // Inicialmente não aprovado
      const pagamentoId = registroResponse.data.id;
      setMessage(`Pagamento ${pagamentoId} registrado. Processando aprovação...`);

      // Simular um delay para aprovação (em um cenário real, isso seria um webhook ou polling)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Etapa 2: Marcar o pagamento como aprovado e atualizar a máquina
      // Em um cenário real, a aprovação viria de um sistema de pagamento externo.
      // Aqui, estamos apenas simulando a aprovação.
      await aprovarPagamento(pagamentoId); // Esta função na API deve mudar o status da máquina
      
      setMessage(`Pagamento ${pagamentoId} aprovado! A máquina ${maquinaId} foi reservada.`);
      if (onSuccess) {
        onSuccess(maquinaId); // Callback para atualizar a UI, se necessário
      }
    } catch (err) {
      setError("Erro ao processar o pagamento. Tente novamente.");
      console.error("Erro no pagamento:", err);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
      <h4 className="text-lg font-semibold text-gray-700 mb-3">Realizar Pagamento</h4>
      {message && <p className="text-green-600 bg-green-100 p-2 rounded mb-3">{message}</p>}
      {error && <p className="text-red-600 bg-red-100 p-2 rounded mb-3">{error}</p>}
      <p className="text-sm text-gray-600 mb-3">
        Clique no botão abaixo para simular o pagamento para a máquina ID: <strong>{maquinaId || "Não selecionada"}</strong>.
      </p>
      <button
        onClick={handlePagamento}
        disabled={loading || !maquinaId}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300"
      >
        {loading ? "Processando Pagamento..." : "Pagar Agora (Simulação)"}
      </button>
      {/* Em um formulário real, você teria campos para cartão de crédito, etc. */}
    </div>
  );
};

export default PagamentoForm;

