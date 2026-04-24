import { useState, useEffect, useCallback } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { agendamentoService } from "../../services/agendamento";
import { barbeiroService } from "../../services/barbeiro";
import { servicoService } from "../../services/servico";
import { Calendar, Clock, User, Scissors, Trash2, PlusCircle, RefreshCw } from "lucide-react";

export default function Agendamento() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);

  const [barbeiroId, setBarbeiroId] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [dataHora, setDataHora] = useState("");

  const userRole = localStorage.getItem("role");
  const userLogin = localStorage.getItem("usuario") || "Cliente";

  const carregarDados = useCallback(async () => {
    setLoadingDados(true);
    try {
      const [b, s, a] = await Promise.all([
        barbeiroService.getAll(),
        servicoService.getAll(),
        agendamentoService.getAll()
      ]);
      
      setBarbeiros(b || []);
      setServicos(s || []);
      
      // Filtra agendamentos se não for admin
      if (userRole !== "ADMIN") {
        setAgendamentos((a || []).filter(item => item.nomeCliente === userLogin));
      } else {
        setAgendamentos(a || []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoadingDados(false);
    }
  }, [userRole, userLogin]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function handleAgendar(e) {
    e.preventDefault();
    setLoading(true);

    const servicoSelecionado = servicos.find(s => s.id_servico === Number(servicoId));
    
    // Calcula data fim baseado na duração do serviço
    let dataFim = null;
    if (servicoSelecionado && dataHora) {
      const inicio = new Date(dataHora);
      const fim = new Date(inicio.getTime() + servicoSelecionado.duracaoServico * 60000);
      dataFim = fim.toISOString().split('.')[0]; // Formato aceito pelo LocalDateTime (sem milisegundos e Z)
    }

    const dados = {
      nomeCliente: userLogin,
      barbeiroId: Number(barbeiroId),
      serviceId: Number(servicoId),
      dataInicio: dataHora,
      dataFim: dataFim,
      statusAgendamento: "PENDENTE",
    };

    try {
      await agendamentoService.create(dados);
      alert("Agendamento realizado com sucesso!");
      setBarbeiroId("");
      setServicoId("");
      setDataHora("");
      carregarDados();
    } catch (err) {
      alert("Erro ao agendar: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletar(id) {
    if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;

    try {
      await agendamentoService.delete(id);
      setAgendamentos(prev => prev.filter(a => a.id !== id));
      alert("Agendamento cancelado!");
    } catch (err) {
      alert("Erro ao deletar: " + err.message);
    }
  }

  const getBarbeiroNome = (id) => barbeiros.find(b => b.id_barbeiro === id)?.nome || "Não informado";
  const getServicoNome = (id) => servicos.find(s => s.id_servico === id)?.nome || "Não informado";

  if (loadingDados) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-amber-500 gap-4 bg-zinc-950">
        <RefreshCw className="w-10 h-10 animate-spin" />
        <p className="font-medium">Carregando sua agenda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* FORMULÁRIO */}
        <div className="md:w-1/3 space-y-6">
          <div className="mb-2">
            <h1 className="text-3xl font-black text-zinc-100 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-amber-500" />
              Agenda
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Marque seu próximo estilo.</p>
          </div>

          <Card title="Novo Agendamento">
            <form onSubmit={handleAgendar} className="flex flex-col gap-5">
              <div>
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2">
                  <Scissors className="w-3.5 h-3.5 text-amber-500" /> Serviço
                </label>
                <select
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none"
                  value={servicoId}
                  onChange={(e) => setServicoId(e.target.value)}
                  required
                >
                  <option value="">Escolha um serviço...</option>
                  {servicos.map((s) => (
                    <option key={s.id_servico} value={s.id_servico}>
                      {s.nome} — R$ {s.preco} ({s.duracaoServico}min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-amber-500" /> Profissional
                </label>
                <select
                  className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-zinc-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all appearance-none"
                  value={barbeiroId}
                  onChange={(e) => setBarbeiroId(e.target.value)}
                  required
                >
                  <option value="">Selecione o barbeiro...</option>
                  {barbeiros.filter(b => b.ativo).map((b) => (
                    <option key={b.id_barbeiro} value={b.id_barbeiro}>
                      {b.nome}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Data e Horário"
                type="datetime-local"
                value={dataHora}
                onChange={(e) => setDataHora(e.target.value)}
                required
              />

              <Button type="submit" isLoading={loading} className="mt-4 py-4 rounded-xl">
                <PlusCircle className="w-5 h-5 mr-1" /> Confirmar Horário
              </Button>
            </form>
          </Card>
        </div>

        {/* LISTAGEM */}
        <div className="md:w-2/3">
          <Card title={userRole === "ADMIN" ? "Todos os Agendamentos" : "Seus Agendamentos"}>
            {agendamentos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-600 border-2 border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20">
                <Clock className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg">Nenhum compromisso marcado.</p>
                <p className="text-sm">Agende um horário para começar.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {agendamentos.sort((a,b) => new Date(a.dataInicio) - new Date(b.dataInicio)).map((a) => (
                  <div 
                    key={a.id} 
                    className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-amber-500/40 transition-all group relative overflow-hidden"
                  >
                    <div className="flex flex-col gap-1.5 z-10">
                      <div className="flex items-center gap-3 text-zinc-100 font-bold text-lg">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                          <Scissors className="w-5 h-5 text-amber-500" />
                        </div>
                        {getServicoNome(a.serviceId)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <User className="w-4 h-4 text-zinc-500" />
                          <span className="text-zinc-500">Barbeiro:</span>
                          <span className="text-zinc-200 font-medium">{getBarbeiroNome(a.barbeiroId)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <Clock className="w-4 h-4 text-zinc-500" />
                          <span className="text-zinc-500">Horário:</span>
                          <span className="text-zinc-200 font-medium">
                            {new Date(a.dataInicio).toLocaleString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {userRole === "ADMIN" && (
                          <div className="flex items-center gap-2 text-sm text-zinc-400 sm:col-span-2">
                            <span className="text-zinc-500">Cliente:</span>
                            <span className="text-amber-500/80 font-bold uppercase text-xs tracking-widest">{a.nomeCliente}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        a.statusAgendamento === "PENDENTE" ? "bg-amber-500/5 text-amber-500 border-amber-500/20" :
                        a.statusAgendamento === "CONCLUIDO" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/20" :
                        "bg-red-500/5 text-red-500 border-red-500/20"
                      }`}>
                        {a.statusAgendamento}
                      </span>
                      
                      <button 
                        onClick={() => handleDeletar(a.id)}
                        className="p-2.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Cancelar Agendamento"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
