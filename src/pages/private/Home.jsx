import { useState } from "react";

export default function BarberHero() {
  const [isHovered, setIsHovered] = useState(false);
  const abrirWhats = () => {
    window.open("https://wa.me/+5547996737867", "_blank");
    return;
  };
  return (
    <div>
      <section
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url(./public/assets/barbearia-hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay escuro para texto legível */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* Conteúdo centralizado */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl">
          {/* Título */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wide drop-shadow-lg">
            BARBEARIA
            <span className="block text-amber-400 drop-shadow-lg">LOPES</span>
          </h1>

          {/* Descrição */}
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-2xl mb-8 leading-relaxed drop-shadow-md">
            Corte clássico, barba terapia e o melhor ambiente da cidade.
            <br />
            Venha renovar seu estilo com quem entende do assunto.
          </p>

          {/* Botão Agendar */}
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => (window.location.href = "/agenda")}
            className={`px-6 sm:px-8 py-3 sm:py-4 bg-amber-400 hover:bg-amber-500 text-black font-bold text-base sm:text-lg rounded-sm transition-all duration-300 transform shadow-lg ${
              isHovered ? "scale-105 shadow-2xl shadow-amber-500/60" : ""
            }`}
          >
            AGENDAR HORÁRIO
          </button>

          {/* Texto adicional */}
          <p className="text-gray-300 text-xs sm:text-sm mt-6 drop-shadow-md">
            Clique para marcar seu horário
          </p>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="py-20 px-4 md:px-8 bg-black border-t-2 border-amber-400">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-400">
            Serviços & Preços
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div className="border border-amber-400 p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                Corte Social
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Tesoura ou máquina, acabamento perfeito.
              </p>
              <p className="text-2xl font-bold text-amber-400">R$ 50,00</p>
            </div>

            <div className="border border-amber-400 p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                Barba Premium
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Toalha quente, óleo essencial e massagem.
              </p>
              <p className="text-2xl font-bold text-amber-400">R$ 40,00</p>
            </div>

            <div className="border border-amber-400 p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                Combo Completo
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                O pacote completo para o seu visual.
              </p>
              <p className="text-2xl font-bold text-amber-400">R$ 80,00</p>
            </div>

            <div className="border border-amber-400 p-6">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                Pezinho/Acabamento
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Manutenção rápida entre cortes.
              </p>
              <p className="text-2xl font-bold text-amber-400">R$ 20,00</p>
            </div>
          </div>
        </div>
      </section>

      {/* BARBEIROS */}
      <section className="py-20 px-4 md:px-8 bg-black border-t-2 border-amber-400">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-400">
            Conheça Nossos Barbeiros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group cursor-pointer">
              <div className="text-8xl mb-4 ">👨‍💼</div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                João Silva
              </h3>
              <p className="text-amber-400 text-sm">
                Especialista em Barbas Lenhador
              </p>
              <div className="mt-4 h-1 w-12 bg-amber-400 mx-auto opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="text-8xl mb-4">💇‍♂️</div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                Carlos Santos
              </h3>
              <p className="text-amber-400 text-sm">Mestre do Degradê</p>
              <div className="mt-4 h-1 w-12 bg-amber-400 mx-auto opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="text-center group cursor-pointer">
              <div className="text-8xl mb-4">👨‍🎓</div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition">
                Pedro Costa
              </h3>
              <p className="text-amber-400 text-sm">
                Especialista em Fade & Undercut
              </p>
              <div className="mt-4 h-1 w-12 bg-amber-400 mx-auto opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 px-4 md:px-8 bg-black border-t-2 border-amber-400">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-400">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-amber-400 p-8">
              <div className="flex gap-1 mb-4">
                <span className="text-amber-400">★★★★★</span>
              </div>
              <p className="text-gray-300 mb-6 italic">
                "Melhor atendimento da região. A barboterapia é de outro mundo!"
              </p>
              <p className="text-amber-400 font-bold">— Ricardo S.</p>
            </div>

            <div className="border border-amber-400 p-8">
              <div className="flex gap-1 mb-4">
                <span className="text-amber-400">★★★★★</span>
              </div>
              <p className="text-gray-300 mb-6 italic">
                "Profissionalismo e qualidade impecável. Já sou cliente a 3
                anos!"
              </p>
              <p className="text-amber-400 font-bold">— Anderson T.</p>
            </div>

            <div className="border border-amber-400 p-8">
              <div className="flex gap-1 mb-4">
                <span className="text-amber-400">★★★★★</span>
              </div>
              <p className="text-gray-300 mb-6 italic">
                "Volta e meia estou lá. Corte perfeito, preço justo."
              </p>
              <p className="text-amber-400 font-bold">— Felipe M.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO E HORÁRIO */}
      <section className="py-20 px-4 md:px-8 bg-black border-t-2 border-amber-400">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-400">
            Visite-nos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mapa */}
            <div className="border-2 border-amber-400 overflow-hidden h-96">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.1234567890!2d-48.8801234!3d-26.3044722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dfe37e0000!2sBarbearia+Lopes!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center gap-8">
              {/* Endereço */}
              <div className="border-l-4 border-amber-400 pl-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  📍 Endereço
                </h3>
                <p className="text-gray-400">Rua das Tesouras, 123 - Centro</p>
              </div>

              {/* Horários */}
              <div className="border-l-4 border-amber-400 pl-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  🕐 Horários
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Segunda a Sexta</span>
                    <span className="font-bold text-amber-400">
                      09:00 às 20:00
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Sábado</span>
                    <span className="font-bold text-amber-400">
                      08:00 às 18:00
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Domingo</span>
                    <span className="font-bold text-amber-400">Fechado</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <button
                onClick={abrirWhats}
                className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-sm transition-all duration-300 w-full"
              >
                💬 Chamar no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
