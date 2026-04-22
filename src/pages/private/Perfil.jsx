import { LogOut, ShieldCheck, Mail, User as UserIcon, Calendar, BarChart3 } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const navigate = useNavigate();
  
  // Pegamos o que já salvamos no localStorage durante o login
  const userRole = localStorage.getItem("role");
  const userLogin = localStorage.getItem("usuario"); // O email/login

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      
      {/* CABEÇALHO DO PERFIL */}
      <div className="flex items-center gap-6 mb-10 p-6 bg-zinc-900/30 rounded-2xl border border-zinc-900">
        <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-zinc-950 text-3xl font-black">
          {userLogin?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{userLogin}</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/20 font-black uppercase">
                {userRole}
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* INFORMAÇÕES DA CONTA */}
        <Card title="Dados da Conta">
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <Mail className="text-amber-500 w-5 h-5" />
              <div>
                <p className="text-zinc-500 text-xs">E-mail de acesso</p>
                <p className="text-zinc-200">{userLogin}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-amber-500 w-5 h-5" />
              <div>
                <p className="text-zinc-500 text-xs">Nível de Permissão</p>
                <p className="text-zinc-200">{userRole === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ATALHOS RÁPIDOS (DINÂMICO) */}
        <Card title="Ações Rápidas">
          <div className="grid grid-cols-1 gap-3">
            {userRole === 'ADMIN' ? (
              <Button variant="secondary" onClick={() => navigate("/financeiro")} className="justify-start gap-3">
                <BarChart3 size={18} /> Ver Faturamento
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => navigate("/agenda")} className="justify-start gap-3">
                <Calendar size={18} /> Novo Agendamento
              </Button> 
            )}
            
            <Button variant="outline" onClick={handleLogout} className="justify-start gap-3 text-red-500 border-red-500/20 hover:bg-red-500/10">
              <LogOut size={18} /> Sair do Sistema
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}