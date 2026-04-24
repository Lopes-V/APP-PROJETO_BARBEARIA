import { useState, useEffect } from "react";
import { barbeiroService } from "../../services/barbeiro";
import { servicoService } from "../../services/servico";
import { Scissors, Star, MapPin, Clock, MessageSquare, User, RefreshCw } from "lucide-react";

export default function BarberHero() {
  const [isHovered, setIsHovered] = useState(false);
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [b, s] = await Promise.all([
          barbeiroService.getAll(),
          servicoService.getAll()
        ]);
        setBarbeiros(b || []);
        setServicos(s || []);
      } catch (err) {
        console.error("Erro ao carregar dados da home:", err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const abrirWhats = () => {
    window.open("https://wa.me/+5547996737867", "_blank");
  };

  const barberImages = [
    "https://images.unsplash.com/photo-1503460293376-303bbac90848?auto=format&fit=crop&q=80&w=400&h=400",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400&h=400",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400&h=400",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-zinc-100 overflow-x-hidden">
      {/* HERO SECTION */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1920')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-zinc-950"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-amber-500 text-xs font-bold tracking-widest uppercase">Referência em Estilo & Cuidado</span>
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
            BARBEARIA
            <span className="block text-amber-500">LOPES</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mb-10 leading-relaxed font-medium">
            Onde a tradição encontra a modernidade. Oferecemos o melhor em corte clássico, barboterapia e um ambiente feito para você.
          </p>

          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => (window.location.href = "/agenda")}
            className={`group relative px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-black text-lg rounded-xl transition-all duration-300 shadow-[0_0_40px_rgba(245,158,11,0.3)] ${
              isHovered ? "scale-105" : ""
            }`}
          >
            AGENDAR EXPERIÊNCIA
          </button>
          
          <div className="mt-12 flex gap-8 animate-bounce opacity-50">
            <Clock className="w-5 h-5" />
            <MapPin className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* SERVIÇOS DINÂMICOS */}
      <section className="py-32 px-4 md:px-8 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-4">Nossos Serviços</h2>
            <div className="h-1.5 w-24 bg-amber-500 mx-auto rounded-full"></div>
            <p className="text-zinc-500 mt-6 max-w-xl mx-auto italic">Excelência em cada detalhe, do corte clássico ao cuidado moderno.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicos.length > 0 ? (
              servicos.map((s, idx) => (
                <div key={s.id_servico || idx} className="group p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500 transition-colors">
                      <Scissors className="w-6 h-6 text-amber-500 group-hover:text-black" />
                    </div>
                    <span className="text-3xl font-black text-amber-500">R$ {s.preco}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{s.nome}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Duração: {s.duracaoServico} min</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-zinc-600">Nenhum serviço disponível no momento.</p>
            )}
          </div>
        </div>
      </section>

      {/* BARBEIROS DINÂMICOS */}
      <section className="py-32 px-4 md:px-8 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-4">Mestres do Estilo</h2>
            <div className="h-1.5 w-24 bg-amber-500 mx-auto rounded-full"></div>
            <p className="text-zinc-500 mt-6 max-w-xl mx-auto">Nossa equipe de especialistas pronta para transformar seu visual.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {barbeiros.filter(b => b.ativo).map((b, idx) => (
              <div key={b.id_barbeiro || idx} className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 transition-all duration-500 hover:border-amber-500/30">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={barberImages[idx % barberImages.length]} 
                    alt={b.nome}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                </div>
                
                <div className="p-6 text-center relative">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-500 text-black rounded-2xl flex items-center justify-center text-2xl font-black shadow-xl">
                    {b.nome.charAt(0)}
                  </div>
                  <h3 className="text-xl font-bold text-white mt-4">{b.nome}</h3>
                  <p className="text-amber-500 text-sm font-medium tracking-wide mt-1 uppercase">{b.especialidade}</p>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-center gap-4 text-zinc-500 group-hover:text-amber-500 transition-colors">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-32 px-4 md:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20 text-white italic">A Voz da Comunidade</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ricardo S.", text: "Melhor atendimento da região. A barboterapia é de outro mundo!" },
              { name: "Anderson T.", text: "Profissionalismo e qualidade impecável. Já sou cliente a 3 anos!" },
              { name: "Felipe M.", text: "Volta e meia estou lá. Corte perfeito, preço justo." }
            ].map((d, i) => (
              <div key={i} className="p-10 bg-zinc-900/40 border-l-4 border-amber-500 rounded-r-3xl">
                <div className="flex gap-1 mb-6 text-amber-500">
                  <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-zinc-300 mb-8 text-lg leading-relaxed italic">"{d.text}"</p>
                <p className="text-amber-500 font-black tracking-widest">— {d.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO E HORÁRIO */}
      <section className="py-32 px-4 md:px-8 bg-zinc-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]"></div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-amber-500/20 rounded-[40px] blur-2xl group-hover:bg-amber-500/30 transition-all duration-500"></div>
              <div className="relative rounded-[32px] overflow-hidden border-2 border-amber-500/30 h-[500px]">
                <iframe
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.1234567890!2d-48.8801234!3d-26.3044722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dfe37e0000!2sBarbearia+Lopes!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-5xl font-black text-white">Estamos <br/><span className="text-amber-500 underline decoration-4 underline-offset-8">Prontos</span> para te Receber</h2>
                <div className="flex items-start gap-4 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-amber-500/30 transition-all">
                  <MapPin className="w-8 h-8 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg text-white">Onde Estamos</h3>
                    <p className="text-zinc-500">Rua das Tesouras, 123 - Centro, Joinville - SC</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-amber-500" /> Horários de Atendimento
                </h3>
                <div className="space-y-4">
                  {[
                    { days: "Segunda a Sexta", hours: "09:00 às 20:00" },
                    { days: "Sábado", hours: "08:00 às 18:00" },
                    { days: "Domingo", hours: "Fechado", color: "text-red-500" }
                  ].map((h, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0">
                      <span className="text-zinc-400 font-medium">{h.days}</span>
                      <span className={`font-black ${h.color || "text-amber-500"}`}>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={abrirWhats}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20 group"
              >
                <MessageSquare className="w-6 h-6 group-hover:scale-125 transition-transform" />
                CONVERSAR NO WHATSAPP
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
