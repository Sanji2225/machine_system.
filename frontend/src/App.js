import React, { useEffect, useState } from 'react';
import LavanderiaList from './components/LavanderiaList';
import MaquinaList from './components/MaquinaList';
import MapaLavanderias from './components/MapaLavanderias';
import PagamentoForm from './components/PagamentoForm'; // Importar o formulário de pagamento
import { getLavanderias, getAllMaquinasStatus } from './services/api';

function App() {
  const [lavanderiasParaMapa, setLavanderiasParaMapa] = useState([]);
  const [loadingMapa, setLoadingMapa] = useState(true);
  const [errorMapa, setErrorMapa] = useState(null);
  const [maquinasParaPagamento, setMaquinasParaPagamento] = useState([]);
  const [selectedMaquinaId, setSelectedMaquinaId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingMapa(true);
        const [lavanderiasResponse, maquinasStatusResponse] = await Promise.all([
          getLavanderias(),
          getAllMaquinasStatus() // Busca todas as máquinas para o formulário de pagamento
        ]);
        setLavanderiasParaMapa(lavanderiasResponse.data);
        setMaquinasParaPagamento(maquinasStatusResponse.data);
        if (maquinasStatusResponse.data.length > 0) {
            // Seleciona a primeira máquina como padrão para o formulário de pagamento
            // Em um app real, o usuário selecionaria a máquina
            setSelectedMaquinaId(maquinasStatusResponse.data[0].id);
        }
        setErrorMapa(null);
      } catch (err) {
        setErrorMapa('Erro ao carregar dados iniciais.');
        console.error("Erro ao buscar dados iniciais:", err);
      } finally {
        setLoadingMapa(false);
      }
    };

    fetchData();
  }, []);

  const handlePagamentoSuccess = (maquinaId) => {
    console.log(`Pagamento para máquina ${maquinaId} realizado com sucesso. Atualizando listas...`);
    // Adicionar lógica para re-buscar dados das máquinas ou atualizar o estado local
    // Exemplo: Chamar novamente getAllMaquinasStatus() ou uma função específica para atualizar a máquina afetada.
    const fetchMaquinas = async () => {
        try {
            const maquinasStatusResponse = await getAllMaquinasStatus();
            setMaquinasParaPagamento(maquinasStatusResponse.data);
        } catch (error) {
            console.error("Erro ao re-buscar máquinas após pagamento:", error);
        }
    };
    fetchMaquinas();
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <header className="mb-10 text-center py-6 bg-blue-600 text-white rounded-lg shadow-xl">
        <h1 className="text-5xl font-extrabold tracking-tight">Lavanderia Moderna</h1>
        <p className="text-xl text-blue-100 mt-2">Sua solução completa para gerenciamento de lavanderias</p>
      </header>
      <main className="space-y-12">
        <section id="lavanderias">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">Nossas Lavanderias</h2>
          <LavanderiaList />
        </section>
        
        <section id="maquinas">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">Status das Máquinas</h2>
          <MaquinaList /> {/* Mostra todas as máquinas por padrão, pode ser filtrado no futuro */}
        </section>

        <section id="mapa">
           <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">Localização no Mapa</h2>
          {loadingMapa && <p className="text-center text-gray-500">Carregando mapa...</p>}
          {errorMapa && <p className="text-center text-red-500 bg-red-100 p-3 rounded">{errorMapa}</p>}
          {!loadingMapa && !errorMapa && <MapaLavanderias lavanderias={lavanderiasParaMapa} />}
        </section>

        <section id="pagamento">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">Pagamento</h2>
          {maquinasParaPagamento.length > 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <label htmlFor="maquina-select" className="block text-sm font-medium text-gray-700 mb-2">Selecione uma Máquina para Pagamento:</label>
              <select 
                id="maquina-select"
                value={selectedMaquinaId || ''}
                onChange={(e) => setSelectedMaquinaId(e.target.value)}
                className="mb-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              >
                <option value="" disabled>-- Selecione --</option>
                {maquinasParaPagamento.map(m => (
                  <option key={m.id} value={m.id} disabled={m.status === 'ocupado'}>
                    Máquina {m.id} (Status: {m.status === 'livre' ? 'Livre' : 'Ocupada'}{m.status === 'ocupado' && m.previsao_liberacao ? ` - Libera às ${new Date(m.previsao_liberacao).toLocaleTimeString()}` : ''})
                  </option>
                ))}
              </select>
              <PagamentoForm maquinaId={selectedMaquinaId} onSuccess={handlePagamentoSuccess} />
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhuma máquina disponível para seleção de pagamento no momento.</p>
          )}
        </section>

        {/* TODO: Adicionar seções para Tela de Admin e Tela de Cliente */}

      </main>
      <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Lavanderia Moderna Inc. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;

