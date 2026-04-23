import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  CheckCircle,
  Clock,
  X,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { financeiroService } from "../../services/financeiro";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const TIPOS_LANCAMENTO = ["RECEITA", "DESPESA"];
const STATUS_LANCAMENTO = ["PENDENTE", "PAGO", "CANCELADO"];

const FORMAS_PAGAMENTO = [
  { value: "DINHEIRO", label: "💵 Dinheiro" },
  { value: "PIX", label: "⚡ Pix" },
  { value: "CARTAO_CREDITO", label: "💳 Crédito" },
  { value: "CARTAO_DEBITO", label: "💳 Débito" },
];

function formatBRL(value) {
  if (value == null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function StatCard({ icon: Icon, label, value, color, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 flex flex-col gap-3 shadow-lg">
      <div
        className={`absolute inset-0 opacity-10 ${gradient}`}
        style={{ pointerEvents: "none" }}
      />
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-zinc-400 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
    </div>
  );
}

export default function Financeiro() {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth() + 1);

  const [lancamentos, setLancamentos] = useState([]);
  const [balanco, setBalanco] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    tipoLancamento: "RECEITA",
    dataLancamento: new Date().toISOString().split("T")[0],
    statusLancamento: "PENDENTE",
    formasPagamento: "DINHEIRO",
  });
  
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState(null);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const [listaRes, balancoRes] = await Promise.allSettled([
        financeiroService.getByMes(ano, mes),
        financeiroService.getBalanco(ano, mes),
      ]);

      const listaDados = listaRes.status === "fulfilled" ? listaRes.value : [];
      setLancamentos(Array.isArray(listaDados) ? listaDados : []);
      
      setBalanco(balancoRes.status === "fulfilled" ? balancoRes.value : null);
      
    } catch {
      setErro("Não foi possível carregar os dados financeiros.");
      setLancamentos([]);
    } finally {
      setLoading(false);
    }
  }, [ano, mes]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function handleMarcarPago(id) {
    if (!id) {
      alert("ID do lançamento não encontrado. Verifique o Back-end.");
      return;
    }
    
    try {
      await financeiroService.markWithPayment(id);
      setLancamentos((prev) =>
        prev.map((l) => {
          const itemId = l.id_financeiro || l.id;
          return itemId === id ? { ...l, statusLancamento: "PAGO" } : l;
        })
      );
    } catch {
      console.log("Erro ao marcar lançamento como pago.");
    }
  }

  async function handleCriarLancamento(e) {
    e.preventDefault();
    setSalvando(true);
    setErroForm(null);
    try {
      const novo = await financeiroService.create({
        ...formData,
        valor: parseFloat(formData.valor),
      });
      
      setLancamentos((prev) => [novo, ...(Array.isArray(prev) ? prev : [])]);
      setModalAberto(false);
      
      setFormData({
        descricao: "",
        valor: "",
        tipoLancamento: "RECEITA",
        dataLancamento: new Date().toISOString().split("T")[0],
        statusLancamento: "PENDENTE",
        formasPagamento: "DINHEIRO",
      });
      
      carregarDados();
    } catch (err) {
      setErroForm(err.message || "Erro ao criar lançamento.");
    } finally {
      setSalvando(false);
    }
  }

  const receitas = balanco?.totalReceitas ?? 0;
  const despesas = balanco?.totalDespesas ?? 0;
  const lucro = balanco?.saldo ?? receitas - despesas;

  const anosDisponiveis = Array.from(
    { length: 5 },
    (_, i) => hoje.getFullYear() - 2 + i
  );

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-amber-400" />
              Financeiro
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Gestão de receitas, despesas e balanço mensal — acesso exclusivo do administrador
            </p>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-100 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Novo Lançamento
          </button>
        </div>

        {/* FILTRO MÊS/ANO */}
        <div className="flex flex-wrap items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <span className="text-zinc-400 text-sm font-medium">Filtrar por:</span>

          <select
            className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
          >
            {MESES.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
          >
            {anosDisponiveis.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <button
            onClick={carregarDados}
            disabled={loading}
            className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>

          <span className="ml-auto text-zinc-500 text-sm">
            {MESES[mes - 1]} de {ano}
          </span>
        </div>

        {/* ERRO GERAL */}
        {erro && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-xl px-5 py-4 text-sm">
            {erro}
          </div>
        )}

        {/* CARDS DE BALANÇO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={TrendingUp}
            label="Total de Receitas"
            value={formatBRL(receitas)}
            color="bg-emerald-500"
            gradient="bg-gradient-to-br from-emerald-500 to-transparent"
          />
          <StatCard
            icon={TrendingDown}
            label="Total de Despesas"
            value={formatBRL(despesas)}
            color="bg-red-500"
            gradient="bg-gradient-to-br from-red-500 to-transparent"
          />
          <StatCard
            icon={DollarSign}
            label="Lucro Líquido"
            value={formatBRL(lucro)}
            color={lucro >= 0 ? "bg-amber-500" : "bg-red-600"}
            gradient={
              lucro >= 0
                ? "bg-gradient-to-br from-amber-500 to-transparent"
                : "bg-gradient-to-br from-red-600 to-transparent"
            }
          />
        </div>

        {/* TABELA DE LANÇAMENTOS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-zinc-100 font-semibold text-lg">
              Lançamentos do Mês
            </h2>
            <span className="text-zinc-500 text-sm">
              {lancamentos?.length || 0} registro(s)
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-zinc-500 gap-3">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Carregando...
            </div>
          ) : !lancamentos?.length ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-600 gap-2">
              <BarChart3 className="w-10 h-10 opacity-30" />
              <p className="text-sm">
                Nenhum lançamento encontrado para este período.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wide border-b border-zinc-800">
                    <th className="text-left px-6 py-3">Descrição</th>
                    <th className="text-left px-6 py-3">Tipo</th>
                    <th className="text-left px-6 py-3">Pagamento</th>
                    <th className="text-left px-6 py-3">Data</th>
                    <th className="text-right px-6 py-3">Valor</th>
                    <th className="text-center px-6 py-3">Status</th>
                    <th className="text-center px-6 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {lancamentos.map((l, index) => {
                    const itemId = l.id_financeiro || l.id;
                    
                    return (
                      <tr
                        key={itemId || `fallback-key-${index}`}
                        className="hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-zinc-100 font-medium">
                          {l.descricao}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              l.tipoLancamento === "RECEITA"
                                ? "bg-emerald-900/50 text-emerald-400"
                                : "bg-red-900/50 text-red-400"
                            }`}
                          >
                            {l.tipoLancamento === "RECEITA" ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {l.tipoLancamento}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-400 text-xs">
                          {l.formasPagamento?.replace("_", " ") ?? "—"}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                          {l.dataLancamento
                            ? new Date(
                                l.dataLancamento + "T00:00:00"
                              ).toLocaleDateString("pt-BR")
                            : "—"}
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-bold ${
                            l.tipoLancamento === "RECEITA"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {l.tipoLancamento === "DESPESA" ? "- " : "+ "}
                          {formatBRL(l.valor)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {l.statusLancamento === "PAGO" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                              <CheckCircle className="w-4 h-4" /> Pago
                            </span>
                          ) : l.statusLancamento === "CANCELADO" ? (
                            <span className="inline-flex items-center gap-1 text-zinc-500 text-xs font-semibold">
                              <X className="w-4 h-4" /> Cancelado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400 text-xs font-semibold">
                              <Clock className="w-4 h-4" /> Pendente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {l.statusLancamento !== "PAGO" &&
                            l.statusLancamento !== "CANCELADO" && (
                              <button
                                onClick={() => handleMarcarPago(itemId)}
                                className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Marcar pago
                              </button>
                            )}
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

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" /> Novo Lançamento
            </h2>

            {erroForm && (
              <p className="text-red-400 text-sm mb-4 bg-red-900/30 border border-red-700 rounded-lg px-4 py-2">
                {erroForm}
              </p>
            )}

            <form
              onSubmit={handleCriarLancamento}
              className="flex flex-col gap-5"
            >
              {/* Descrição */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm font-medium">
                  Descrição
                </label>
                <input
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 placeholder-zinc-600"
                  placeholder="Ex: Compra de produtos para barba"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  required
                />
              </div>

              {/* Valor */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm font-medium">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 placeholder-zinc-600"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) =>
                    setFormData({ ...formData, valor: e.target.value })
                  }
                  required
                />
              </div>

              {/* Tipo Lançamento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm font-medium">
                  Tipo
                </label>
                <div className="flex gap-3">
                  {TIPOS_LANCAMENTO.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, tipoLancamento: t })
                      }
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                        formData.tipoLancamento === t
                          ? t === "RECEITA"
                            ? "bg-emerald-600 border-emerald-500 text-white"
                            : "bg-red-600 border-red-500 text-white"
                          : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      {t === "RECEITA" ? "📈 Receita" : "📉 Despesa"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Forma de Pagamento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm font-medium">
                  Forma de Pagamento
                </label>
                <select
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.formasPagamento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      formasPagamento: e.target.value,
                    })
                  }
                  required
                >
                  {FORMAS_PAGAMENTO.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm font-medium">
                  Status
                </label>
                <select
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.statusLancamento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statusLancamento: e.target.value,
                    })
                  }
                >
                  {STATUS_LANCAMENTO.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data do Lançamento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-zinc-400 text-sm font-medium">
                  Data do Lançamento
                </label>
                <input
                  type="date"
                  className="bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                  value={formData.dataLancamento}
                  onChange={(e) =>
                    setFormData({ ...formData, dataLancamento: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={salvando}
                className="mt-2 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {salvando ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Criar Lançamento
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}