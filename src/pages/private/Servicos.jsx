import { useState, useEffect, useCallback } from "react";
import { Scissors, Plus, Trash2, Edit, RefreshCw, X, Clock, DollarSign } from "lucide-react";
import { servicoService } from "../../services/servico";

const FORM_INICIAL = {
  nome: "",
  duracaoServico: "",
  preco: "",
};

export default function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await servicoService.getAll();
      setServicos(data || []);
    } catch (err) {
      setErro("Não foi possível carregar os serviços.");
      setServicos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  function abrirModal(servico = null) {
    if (servico) {
      setEditandoId(servico.id_servico);
      setFormData({
        nome: servico.nome,
        duracaoServico: servico.duracaoServico,
        preco: servico.preco,
      });
    } else {
      setEditandoId(null);
      setFormData(FORM_INICIAL);
    }
    setModalAberto(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      const payload = {
        ...formData,
        duracaoServico: parseInt(formData.duracaoServico),
        preco: parseFloat(formData.preco),
      };

      if (editandoId) {
        await servicoService.update(editandoId, payload);
      } else {
        await servicoService.create(payload);
      }
      setModalAberto(false);
      carregarDados();
    } catch (err) {
      alert(err.message || "Erro ao salvar serviço.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id) {
    if (!window.confirm("Tem certeza que deseja remover este serviço?")) return;
    try {
      await servicoService.delete(id);
      carregarDados();
    } catch (err) {
      alert("Erro ao excluir serviço: " + err.message);
    }
  }

  function formatBRL(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
              <Scissors className="w-8 h-8 text-amber-400" />
              Serviços & Preços
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Gerencie o catálogo de serviços, durações e valores da barbearia.
            </p>
          </div>

          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-3 rounded-xl transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" /> Novo Serviço
          </button>
        </div>

        {erro && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-5 py-4">
            {erro}
          </div>
        )}

        {/* LISTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-10 text-zinc-500 gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" /> Carregando...
            </div>
          ) : servicos.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-zinc-600 gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <Scissors className="w-10 h-10 opacity-30" />
              <p>Nenhum serviço cadastrado.</p>
            </div>
          ) : (
            servicos.map(s => (
              <div key={s.id_servico} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group overflow-hidden">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => abrirModal(s)} className="text-zinc-400 hover:text-amber-400 bg-zinc-800 p-2 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeletar(s.id_servico)} className="text-zinc-400 hover:text-red-400 bg-zinc-800 p-2 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-zinc-100">{s.nome}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-sm text-zinc-400">{s.duracaoServico} min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-4 mt-2">
                  <span className="text-zinc-500 text-sm">Valor do serviço</span>
                  <span className="text-2xl font-black text-amber-400">
                    {formatBRL(s.preco)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative">
            <button onClick={() => setModalAberto(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-amber-400" /> 
              {editandoId ? "Editar Serviço" : "Novo Serviço"}
            </h2>

            <form onSubmit={handleSalvar} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm">Nome do Serviço</label>
                <input 
                  required 
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500" 
                  value={formData.nome} 
                  onChange={e => setFormData({...formData, nome: e.target.value})} 
                  placeholder="Ex: Corte Degradê"
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm">Duração (minutos)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="number" 
                    required 
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-500" 
                    value={formData.duracaoServico} 
                    onChange={e => setFormData({...formData, duracaoServico: e.target.value})} 
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm">Preço (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-amber-500" 
                    value={formData.preco} 
                    onChange={e => setFormData({...formData, preco: e.target.value})} 
                    placeholder="50,00"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={salvando} 
                className="mt-4 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
              >
                {salvando ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : null}
                {salvando ? "Salvando..." : "Salvar Serviço"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}