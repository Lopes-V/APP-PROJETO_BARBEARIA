import { useState, useEffect } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { agendamentoService } from "../../services/agendamento";
import { barbeiroService } from "../../services/barbeiro";
import { servicoService } from "../../services/servico";
import { Calendar, Clock, User, Scissors, Trash2, PlusCircle } from "lucide-react";

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

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoadingDados(true);
    try {
      const [b, s, a] = await Promise.all([
        barbeiroService.getAll(),
        servicoService.getAll(),
        agendamentoService.getAll()
      ]);
      setBarbeiros(b);
      setServicos(s);
      
      // Se for cliente, filtra apenas os seus agendamentos
      if (userRole !== "ADMIN") {
        setAgendamentos(a.filter(item => item.nomeCliente === userLogin));
      } else {
        setAgendamentos(a);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoadingDados(false);
    }
  }

  async function handleAgendar(e) {
    e.preventDefault();
    setLoading(true);

    const dados = {
      nomeCliente: userLogin,
      barbeiroId: Number(barbeiroId),
      serviceId: Number(servicoId),
      dataInicio: dataHora,
      statusAgendamento: "PENDENTE",
    };

    try {
      await agendamentoService.create(dados);
      alert("Agendamento realizado com sucesso!");
      setBarbeiroId("");
      setServicoId("");
      setDataHora("");
      carregarDados(); // Recarrega a lista
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
      setAgendamentos(agendamentos.filter(a => a.id !== id));
      alert("Agendamento cancelado!");
    } catch (err) {
      alert("Erro ao deletar: " + err.message);
    }
  }

  const getBarbeiroNome = (id) => barbeiros.find(b => b.id === id)?.nome || "Não informado";
  const getServicoNome = (id) => servicos.find(s => s.id === id)?.nome || "Não informado";

  if (loadingDados) {
    return (
      <div className="flex justify-center items-center h-screen text-amber-500">
        Carregando dados da agenda...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-8">
      {/* Coluna da Esquerda: Formulário */}
      <div className="md:w-1/3">
        <Card title="Novo Agendamento">
          <form onSubmit={handleAgendar} className="flex flex-col gap-6">
            <div>
              <label className="text-zinc-400 text-sm mb-2 block flex items-center gap-2">
                <Scissors className="w-4 h-4" /> Selecione o Serviço
              </label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-amber-500 transition-colors"
                value={servicoId}
                onChange={(e) => setServicoId(e.target.value)}
                required
              >
                <option value="">Escolha um serviço...</option>
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome} - R$ {s.preco}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-400 text-sm mb-2 block flex items-center gap-2">
                <User className="w-4 h-4" /> Escolha o Barbeiro
              </label>
              <select
                className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-amber-500 transition-colors"
                value={barbeiroId}
                onChange={(e) => setBarbeiroId(e.target.value)}
                required
              >
                <option value="">Qualquer barbeiro...</option>
                {barbeiros.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nome}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Data e Hora"
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              required
            />

            <Button type="submit" isLoading={loading} className="mt-2">
              <PlusCircle className="w-5 h-5 mr-2" /> Confirmar
            </Button>
          </form>
        </Card>
      </div>

      {/* Coluna da Direita: Listagem */}
      <div className="md:w-2/3">
        <Card title="Seus Agendamentos">
          {agendamentos.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
              Nenhum agendamento encontrado.
            </div>
          ) : (
            <div className="grid gap-4">
              {agendamentos.map((a) => (
                <div 
                  key={a.id} 
                  className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-xl flex justify-between items-center hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-zinc-100 font-medium">
                      <Scissors className="w-4 h-4 text-amber-500" />
                      {getServicoNome(a.serviceId)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <User className="w-4 h-4" />
                      Barbeiro: {getBarbeiroNome(a.barbeiroId)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Clock className="w-4 h-4 text-amber-500/50" />
                      {new Date(a.dataInicio).toLocaleString("pt-BR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                    {userRole === "ADMIN" && (
                      <div className="text-xs text-zinc-500 italic mt-1">
                        Cliente: {a.nomeCliente}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wider ${
                      a.statusAgendamento === "PENDENTE" ? "bg-amber-500/10 text-amber-500" :
                      a.statusAgendamento === "CONCLUIDO" ? "bg-green-500/10 text-green-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      {a.statusAgendamento}
                    </span>
                    
                    <button 
                      onClick={() => handleDeletar(a.id)}
                      className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
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
  );
}

