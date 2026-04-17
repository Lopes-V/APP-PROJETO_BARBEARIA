import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Card } from "../../components/Card";
import { loginService } from "../../services/login";
import { LogIn, UserPlus } from "lucide-react";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const dados = { "login": usuario, "senha": senha };
      await loginService.logar(dados);
      setLoading(false)
      navigate("/home")
    } catch (err) {
      console.error(err);
      setErro(err.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-zinc-950 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
            <img
              src="/assets/logo-barbearia.png"
              alt="Logo Barbearia Lopes"
              className="relative w-40 h-40 object-contain mb-4"
            />
          </div>

          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">
            Barbearia <span className="text-amber-500">Lopes</span>
          </h1>
        </div>

        <Card>
          <h2 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-amber-500" />
            Login
          </h2>

          <form onSubmit={handleSubmit} className=" flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              placeholder="Digite seu email"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />

            <div className="md:col-span-2 mt-4">
              <Button
                variant="primary"
                type="submit"
                isLoading={loading}
                className="py-4"
              >
                Entrar
              </Button>
            </div>
          </form>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-4">
              <p className="text-red-500 text-xs text-center font-medium">
                {erro}
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col items-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center justify-center gap-2 w-full text-zinc-400 hover:text-zinc-100 transition-colors text-sm"
            >
              Ainda não tem acesso? Faça o cadastro
            </button>
          </div>
        </Card>

        <p className="text-center text-zinc-600 text-xs mt-8">
          &copy; 2026 Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
