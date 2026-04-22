import { useState, useEffect, useCallback } from "react";
import { Users2, Plus, Trash2, Edit, RefreshCw, X, Scissors } from "lucide-react";
import { barbeiroService } from "../../services/barbeiro";

const FORM_INICIAL = {
  nome: "",
  especialidade: "",
  comissao: "",
  ativo: true,
};

export default function Barbeiros() {
  const [barbeiros, setBarbeiros] = useState([]);
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
      const data = await barbeiroService.getAll();
      setBarbeiros(data || []);
    } catch {
      setErro("Não foi possível carregar os barbeiros.");
      setBarbeiros([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  function abrirModal(barbeiro = null) {
    if (barbeiro) {
      setEditandoId(barbeiro.id);
      setFormData({
        nome: barbeiro.nome,
        especialidade: barbeiro.especialidade,
        comissao: barbeiro.comissao,
        ativo: barbeiro.ativo,
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
        comissao: parseFloat(formData.comissao),
      };

      if (editandoId) {
        await barbeiroService.update(editandoId, payload);
      } else {
        await barbeiroService.create(payload);
      }
      setModalAberto(false);
      carregarDados();
    } catch (err) {
      alert(err.message || "Erro ao salvar barbeiro.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(id) {
    if (!window.confirm("Tem certeza que deseja remover este barbeiro?")) return;
    try {
      await barbeiroService.delete(id);
      carregarDados();
    } catch (err) {
      alert("Erro ao excluir barbeiro: " + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
              <Users2 className="w-8 h-8 text-amber-400" />
              Equipe de Barbeiros
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Gerencie os barbeiros, especialidades e comissões.
            </p>
          </div>

          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-3 rounded-xl transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" /> Cadastrar Barbeiro
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
          ) : barbeiros.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-zinc-600 gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <Scissors className="w-10 h-10 opacity-30" />
              <p>Nenhum barbeiro cadastrado.</p>
            </div>
          ) : (
            barbeiros.map(b => (
              <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group overflow-hidden">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => abrirModal(b)} className="text-zinc-400 hover:text-amber-400 bg-zinc-800 p-2 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeletar(b.id)} className="text-zinc-400 hover:text-red-400 bg-zinc-800 p-2 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500 text-black rounded-full flex items-center justify-center text-xl font-black">
                    {b.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-100">{b.nome}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${b.ativo ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                      {b.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-800 pt-4 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Especialidade</span>
                    <span className="text-zinc-200">{b.especialidade}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Comissão</span>
                    <span className="text-amber-400 font-bold">{b.comissao}%</span>
                  </div>
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
              {editandoId ? "Editar Barbeiro" : "Novo Barbeiro"}
            </h2>

            <form onSubmit={handleSalvar} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm">Nome</label>
                <input required className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm">Especialidade</label>
                <input required className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={formData.especialidade} onChange={e => setFormData({...formData, especialidade: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm">Comissão (%)</label>
                <input type="number" step="0.1" required className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500" value={formData.comissao} onChange={e => setFormData({...formData, comissao: e.target.value})} />
              </div>
              <label className="flex items-center gap-3 text-zinc-300 mt-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-amber-500" checked={formData.ativo} onChange={e => setFormData({...formData, ativo: e.target.checked})} />
                Barbeiro está ativo
              </label>

              <button type="submit" disabled={salvando} className="mt-4 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl disabled:opacity-60">
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
