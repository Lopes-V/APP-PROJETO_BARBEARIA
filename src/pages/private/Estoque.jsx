import { useState, useEffect, useCallback } from "react";
import { Package, Plus, ArrowUpCircle, ArrowDownCircle, AlertTriangle, RefreshCw, X } from "lucide-react";
import { estoqueService } from "../../services/estoque";

const FORM_INICIAL = {
  nomeItem: "",
  quantidadeAtual: "",
  quantidadeMinima: "",
};

export default function Estoque() {
  const [itens, setItens] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Modal Novo Item
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [formNovo, setFormNovo] = useState(FORM_INICIAL);
  const [salvandoNovo, setSalvandoNovo] = useState(false);
  const [erroNovo, setErroNovo] = useState(null);

  // Modal Movimentação
  const [modalMovAberto, setModalMovAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [qtdMov, setQtdMov] = useState("");
  const [tipoMov, setTipoMov] = useState("ENTRADA");
  const [salvandoMov, setSalvandoMov] = useState(false);
  const [erroMov, setErroMov] = useState(null);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const [itensRes, alertasRes] = await Promise.allSettled([
        estoqueService.getAll(),
        estoqueService.alert(),
      ]);

      setItens(itensRes.status === "fulfilled" ? itensRes.value : []);
      setAlertas(alertasRes.status === "fulfilled" ? alertasRes.value : []);
    } catch {
      setErro("Não foi possível carregar os dados do estoque.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function handleCriarItem(e) {
    e.preventDefault();
    setSalvandoNovo(true);
    setErroNovo(null);
    try {
      const novo = await estoqueService.create({
        nomeItem: formNovo.nomeItem,
        quantidadeAtual: Number(formNovo.quantidadeAtual),
        quantidadeMinima: Number(formNovo.quantidadeMinima),
      });
      setItens((prev) => [novo, ...prev]);
      setModalNovoAberto(false);
      setFormNovo(FORM_INICIAL);
      carregarDados();
    } catch (err) {
      setErroNovo(err.message || "Erro ao cadastrar item.");
    } finally {
      setSalvandoNovo(false);
    }
  }

  function abrirMovimentacao(item) {
    setItemSelecionado(item);
    setQtdMov("");
    setTipoMov("ENTRADA");
    setErroMov(null);
    setModalMovAberto(true);
  }

  async function handleMovimentar(e) {
    e.preventDefault();
    setSalvandoMov(true);
    setErroMov(null);
    try {
      const valor = tipoMov === "ENTRADA" ? Number(qtdMov) : -Number(qtdMov);
      await estoqueService.movimentation(itemSelecionado.id, valor);
      
      setModalMovAberto(false);
      carregarDados();
    } catch (err) {
      setErroMov(err.message || "Erro ao movimentar estoque.");
    } finally {
      setSalvandoMov(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
              <Package className="w-8 h-8 text-amber-400" />
              Estoque
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Gerencie os produtos e controle a quantidade mínima.
            </p>
          </div>

          <button
            onClick={() => setModalNovoAberto(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Novo Item
          </button>
        </div>

        {/* ALERTAS */}
        {alertas.length > 0 && (
          <div className="bg-red-900/30 border border-red-700 rounded-2xl p-5 shadow-lg">
            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" /> Itens Abaixo do Mínimo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {alertas.map(a => (
                <div key={a.id} className="bg-red-950/50 border border-red-800 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-red-300 font-medium text-sm truncate pr-2">{a.nomeItem}</span>
                  <span className="text-red-400 font-bold text-sm bg-red-900/50 px-2 py-1 rounded-lg">
                    {a.quantidadeAtual} / {a.quantidadeMinima}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ERRO GERAL */}
        {erro && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-5 py-4 text-sm">
            {erro}
          </div>
        )}

        {/* TABELA DE ESTOQUE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-zinc-100 font-semibold text-lg">Itens em Estoque</h2>
            <button
              onClick={carregarDados}
              disabled={loading}
              className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-zinc-500 gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" /> Carregando...
            </div>
          ) : itens.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-600 gap-2">
              <Package className="w-10 h-10 opacity-30" />
              <p className="text-sm">Nenhum item cadastrado no estoque.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wide border-b border-zinc-800">
                    <th className="text-left px-6 py-3">Item</th>
                    <th className="text-center px-6 py-3">Qtd Atual</th>
                    <th className="text-center px-6 py-3">Qtd Mínima</th>
                    <th className="text-center px-6 py-3">Status</th>
                    <th className="text-center px-6 py-3">Movimentar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {itens.map((i) => {
                    const alerta = i.quantidadeAtual < i.quantidadeMinima;
                    return (
                      <tr key={i.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4 text-zinc-100 font-medium">
                          {i.nomeItem}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-zinc-300">
                          {i.quantidadeAtual}
                        </td>
                        <td className="px-6 py-4 text-center text-zinc-500">
                          {i.quantidadeMinima}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {alerta ? (
                            <span className="inline-flex items-center gap-1 text-red-400 text-xs font-semibold bg-red-900/30 px-2 py-1 rounded-full">
                              <AlertTriangle className="w-3 h-3" /> Baixo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-900/30 px-2 py-1 rounded-full">
                              OK
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => abrirMovimentacao(i)}
                            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold px-3 py-1.5 rounded-lg transition-colors border border-zinc-700"
                          >
                            Movimentar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOVO ITEM */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative">
            <button
              onClick={() => setModalNovoAberto(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Novo Item
            </h2>

            {erroNovo && <p className="text-red-400 text-sm mb-4">{erroNovo}</p>}

            <form onSubmit={handleCriarItem} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm">Nome do Item</label>
                <input
                  required
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                  value={formNovo.nomeItem}
                  onChange={(e) => setFormNovo({ ...formNovo, nomeItem: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-zinc-400 text-sm">Qtd Inicial</label>
                  <input
                    type="number"
                    required min="0"
                    className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500 w-full"
                    value={formNovo.quantidadeAtual}
                    onChange={(e) => setFormNovo({ ...formNovo, quantidadeAtual: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-zinc-400 text-sm">Qtd Mínima</label>
                  <input
                    type="number"
                    required min="0"
                    className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500 w-full"
                    value={formNovo.quantidadeMinima}
                    onChange={(e) => setFormNovo({ ...formNovo, quantidadeMinima: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={salvandoNovo}
                className="mt-4 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl disabled:opacity-60"
              >
                {salvandoNovo ? "Salvando..." : "Cadastrar"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MOVIMENTAÇÃO */}
      {modalMovAberto && itemSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-sm p-8 relative">
            <button
              onClick={() => setModalMovAberto(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Movimentar Estoque</h2>
            <p className="text-zinc-400 text-sm mb-6">Item: <span className="font-bold text-amber-400">{itemSelecionado.nomeItem}</span></p>

            {erroMov && <p className="text-red-400 text-sm mb-4">{erroMov}</p>}

            <form onSubmit={handleMovimentar} className="flex flex-col gap-5">
              <div className="flex gap-2 p-1 bg-zinc-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTipoMov("ENTRADA")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    tipoMov === "ENTRADA" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" /> Entrada
                </button>
                <button
                  type="button"
                  onClick={() => setTipoMov("SAIDA")}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    tipoMov === "SAIDA" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ArrowDownCircle className="w-4 h-4" /> Saída
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm">Quantidade</label>
                <input
                  type="number"
                  required min="1"
                  placeholder="Ex: 5"
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 text-lg text-center"
                  value={qtdMov}
                  onChange={(e) => setQtdMov(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={salvandoMov}
                className="mt-2 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl disabled:opacity-60"
              >
                {salvandoMov ? "Processando..." : "Confirmar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
