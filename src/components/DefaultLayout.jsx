import { Outlet, useNavigate, Link } from "react-router-dom";
import {
  Scissors,
  LogOut,
  User,
  Calendar,
  Package,
  BarChart3,
  Users2,
} from "lucide-react";

export function DefaultLayout() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* --- HEADER PRESETADO --- */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto h-20 flex items-center justify-between px-8">
          {/* LOGO E TÍTULO (Lado Esquerdo) */}
          <Link to="/home" className="flex items-center gap-3 group">
            <img
              src="/assets/logo-barbearia.png"
              alt="Logo Barbearia Lopes"
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="text-xl font-bold tracking-tighter">
              BARBEARIA <span className="text-amber-500">LOPES</span>
            </span>
          </Link>

          {/* NAVEGAÇÃO E BOTÕES (Lado Direito) */}
          <div className="flex items-center gap-10">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link
                to="/agenda"
                className="hover:text-amber-500 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Agenda
              </Link>

              <Link
                to="/perfil"
                className="hover:text-amber-500 transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Perfil
              </Link>

              {/* ÁREA DO ADMINISTRADOR */}
              {userRole === "ADMIN" && (
                <div className="flex items-center gap-8 border-l border-zinc-800 pl-8">
                  <Link
                    to="/estoque"
                    className="flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors"
                  >
                    <Package className="w-4 h-4" /> Estoque
                  </Link>

                  <Link
                    to="/financeiro"
                    className="flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" /> Financeiro
                  </Link>

                  <Link
                    to="/barbeiros"
                    className="flex items-center gap-2 text-zinc-100 hover:text-amber-500 transition-colors"
                  >
                    <Users2 className="w-4 h-4" /> Equipe
                  </Link>
                </div>
              )}
            </nav>

            {/* BOTÃO SAIR */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-zinc-500 hover:text-red-500 transition-colors text-sm font-medium border-l border-zinc-800 pl-6"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO DA PÁGINA --- */}
      <main className="">
        <Outlet />
      </main>

      {/* --- RODAPÉ PRESETADO --- */}
      <footer className="border-t border-zinc-900 bg-black/20 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Barbearia Lopes. Sistema de Gestão
            Interna.
          </div>
          <div className="flex gap-6 text-zinc-600 text-xs uppercase tracking-widest">
            <span>Privacidade</span>
            <span>Suporte</span>
            <span>v1.0.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
