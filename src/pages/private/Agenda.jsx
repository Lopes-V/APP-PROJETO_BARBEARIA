import { useState, useEffect } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { agendamentoService } from "../../services/agendamento";
import { barbeiroService } from "../../services/barbeiro";
import { servicoService } from "../../services/servico";

export default function Agendamento() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [barbeiroId, setBarbeiroId] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [dataHora, setDataHora] = useState("");

  useEffect(() => {
    async function carregarDados() {
      const b = await barbeiroService.getAll();
      const s = await servicoService.getAll();
      setBarbeiros(b);
      setServicos(s);
    }
    carregarDados();
  }, []);

  async function handleAgendar(e) {
    e.preventDefault();
    setLoading(true);

    const userLogin = localStorage.getItem("usuario") || "Cliente";

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
    } catch (err) {
      alert("Erro ao agendar: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card title="Reservar seu Horário">
        <form onSubmit={handleAgendar} className="flex flex-col gap-6">
          <div>
            <label className="text-zinc-400 text-sm mb-2 block">
              Selecione o Serviço
            </label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
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
            <label className="text-zinc-400 text-sm mb-2 block">
              Escolha o Barbeiro
            </label>
            <select
              className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-zinc-100 outline-none focus:border-amber-500"
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

          <Button type="submit" isLoading={loading}>
            Confirmar Agendamento
          </Button>
        </form>
      </Card>
    </div>
  );
}
