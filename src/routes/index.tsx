import { createFileRoute } from "@tanstack/react-router";

import logo from "@/assets/logo-lorena.png.asset.json";
import heroTraining from "@/assets/hero-training.jpg";
import results01 from "@/assets/results-01.jpg";
import results02 from "@/assets/results-02.jpg";
import results03 from "@/assets/results-03.jpg";
import results04 from "@/assets/results-04.jpg";

const WHATSAPP = "https://wa.me/5565996392871";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Lorena Nunes | Consultoria Online e Treino Avulso",
      },
      {
        name: "description",
        content:
          "Consultoria online de personal trainer com Lorena Nunes (CREF 011334). Acompanhamento mensal a distância e planos de treino avulso com duração de 2 meses.",
      },
      {
        property: "og:title",
        content: "Lorena Nunes | Consultoria Online e Treino Avulso",
      },
      {
        property: "og:description",
        content:
          "Acompanhamento online mensal e plano de treino avulso personalizados para a sua rotina e seus objetivos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background font-outfit text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <img
            src={logo.url}
            alt="Logo Lorena Nunes Personal Trainer"
            width={559}
            height={400}
            className="h-9 w-auto"
          />
          <div className="leading-none">
            <div className="text-sm font-bold uppercase tracking-[0.25em]">
              Lorena Nunes
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-brand-lime">
              Personal Trainer
            </div>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-widest md:flex">
          <a href="#como-funciona" className="transition-colors hover:text-brand-lime">
            Como funciona
          </a>
          <a href="#sou-aluno" className="transition-colors hover:text-brand-lime">
            Sou aluno
          </a>
          <a href="#planos" className="transition-colors hover:text-brand-lime">
            Planos
          </a>
          <a href="#resultados" className="transition-colors hover:text-brand-lime">
            Resultados
          </a>
        </nav>
        <a
          href="#planos"
          className="border border-brand-lime px-5 py-2 text-xs font-bold uppercase tracking-widest text-brand-lime transition-all hover:bg-brand-lime hover:text-brand-dark"
        >
          Começar
        </a>
      </header>

      {/* Hero */}
      <section className="grid items-center gap-12 px-6 py-12 md:grid-cols-2 md:px-12 md:py-24">
        <div className="relative z-10">
          <div className="mb-6 inline-block border border-brand-lime/40 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-lime">
            Consultoria Online · CREF 011334
          </div>
          <h1 className="text-balance text-5xl font-black uppercase italic leading-[0.9] tracking-tighter md:text-7xl">
            Treino sob medida <br />
            <span className="text-brand-lime">onde você estiver</span>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
            Acompanhamento online mensal e planos de treino avulso montados para
            a sua rotina, seu nível e seus objetivos — com ajustes conforme o
            seu progresso.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-lime px-8 py-4 text-sm font-black uppercase text-brand-dark transition-transform hover:scale-105"
            >
              Agendar minha avaliação
            </a>
            <a
              href="#planos"
              className="border border-white/20 px-8 py-4 text-sm font-black uppercase transition-colors hover:bg-white/10"
            >
              Ver planos
            </a>
          </div>
        </div>
        <div className="relative">
          <img
            src={heroTraining}
            alt="Treino de força com acompanhamento profissional"
            width={800}
            height={1008}
            className="aspect-[4/5] w-full bg-brand-card object-cover outline outline-1 -outline-offset-1 outline-white/5"
            fetchPriority="high"
          />
          <div className="absolute -bottom-6 -left-6 hidden bg-brand-lime p-6 text-brand-dark md:block">
            <div className="text-3xl font-black italic tracking-tighter">
              100% online
            </div>
            <div className="text-[10px] font-bold uppercase leading-none tracking-widest">
              Treine em casa, no parque ou na academia
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="bg-white/5 px-6 py-24 md:px-12">
        <div className="mb-12 max-w-xl">
          <h2 className="text-balance text-4xl font-black uppercase italic tracking-tighter md:text-5xl">
            Como funciona a <span className="text-brand-lime">consultoria</span>
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Avaliação inicial",
              d: "Conversamos sobre histórico, rotina, limitações e objetivos para definir o ponto de partida ideal.",
            },
            {
              n: "02",
              t: "Planejamento individualizado",
              d: "Você recebe o treino montado exclusivamente para você, com vídeos e orientações de execução.",
            },
            {
              n: "03",
              t: "Acompanhamento e ajustes",
              d: "Suporte por WhatsApp, correção de execução e evolução das cargas conforme o seu progresso.",
            },
          ].map((item) => (
            <article
              key={item.n}
              className="border-l-2 border-brand-lime bg-brand-card p-8"
            >
              <div className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-lime">
                {item.n}
              </div>
              <h3 className="mb-4 text-2xl font-bold">{item.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.d}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Receber o treino */}
      <section id="receber-treino" className="px-6 py-24 md:px-12">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-balance text-4xl font-black uppercase italic tracking-tighter md:text-5xl">
            Seu treino, <span className="text-brand-lime">na palma da mão</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tudo organizado para você não perder tempo na academia e treinar com
            segurança, mesmo sem eu estar do seu lado.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              t: "Treino enviado no WhatsApp",
              d: "Planilha ou app com o treino completo, séries, repetições, descanso e observações de execução.",
            },
            {
              t: "Vídeos demonstrativos",
              d: "Cada exercício acompanha vídeos gravados por mim com a técnica correta e principais erros.",
            },
            {
              t: "Ajustes em tempo real",
              d: "Mande um áudio ou vídeo durante o treino e eu corrijo a execução ou substituo o exercício.",
            },
            {
              t: "Progressão semanal",
              d: "Acompanho suas cargas e evolução para aumentar a intensidade no momento certo.",
            },
          ].map((item) => (
            <article
              key={item.t}
              className="rounded-2xl border border-white/10 bg-brand-card p-8 transition-colors hover:border-brand-lime/40"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center bg-brand-lime text-brand-dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-bold">{item.t}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.d}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 rounded-2xl border border-brand-lime/30 bg-brand-lime/10 p-8 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <h3 className="text-xl font-black uppercase italic tracking-tight">
              Quer ver um exemplo de como vem o treino?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre em contato pelo WhatsApp e peça uma amostra do material que
              você vai receber.
            </p>
          </div>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-lime px-8 py-4 text-sm font-black uppercase text-brand-dark transition-transform hover:scale-105"
          >
            Pedir amostra no WhatsApp
          </a>
        </div>
      </section>

      {/* Resultados */}
      <section id="resultados" className="px-6 py-24 md:px-12">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <h2 className="text-balance text-4xl font-black uppercase italic tracking-tighter md:text-6xl">
            Resultados que <br />
            <span className="text-brand-lime">Falam</span>
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            Consistência, técnica e um plano feito para a sua realidade.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { src: results01, alt: "Aluno em treino de força" },
            { src: results02, alt: "Aluna em treino funcional" },
            { src: results03, alt: "Evolução de postura e condicionamento" },
            { src: results04, alt: "Execução de levantamento terra" },
          ].map((img) => (
            <figure
              key={img.alt}
              className="aspect-[3/4] overflow-hidden bg-brand-card"
            >
              <img
                src={img.src}
                alt={img.alt}
                width={704}
                height={944}
                loading="lazy"
                className="h-full w-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
              />
            </figure>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="bg-brand-card px-6 py-24 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter md:text-5xl">
            Tabela de Planos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Escolha o formato ideal para a sua rotina e objetivos.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <article className="relative flex flex-col overflow-hidden rounded-3xl bg-brand-lime p-10">
            <div className="absolute right-4 top-4 rounded-full bg-brand-dark/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
              Mais procurado
            </div>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-dark/70">
              Acompanhamento Online
            </h3>
            <div className="my-6 flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter text-brand-dark">
                R$ 280
              </span>
              <span className="text-sm text-brand-dark/60">/mês</span>
            </div>
            <ul className="mb-10 flex-grow space-y-4 text-sm text-brand-dark/80">
              {[
                "Avaliação inicial e anamnese completa",
                "Treino individualizado atualizado mensalmente",
                "Vídeos e orientações de execução",
                "Suporte e ajustes conforme o progresso",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="font-bold">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl bg-brand-dark py-3 text-center text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand-dark/90"
            >
              Quero acompanhamento
            </a>
          </article>

          <article className="flex flex-col rounded-3xl border border-white/10 p-10">
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
              Plano de Treino Avulso
            </h3>
            <div className="my-6 flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter">
                R$ 180
              </span>
              <span className="text-sm text-muted-foreground">
                pagamento único
              </span>
            </div>
            <ul className="mb-6 flex-grow space-y-4 text-sm text-muted-foreground">
              {[
                "Plano de treino com duração de 2 meses",
                "Montado conforme seu objetivo e estrutura disponível",
                "Orientações de execução, séries e cargas",
                "Sem mensalidade e sem fidelidade",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="text-brand-lime">✓</span> {f}
                </li>
              ))}
            </ul>
            <p className="mb-8 rounded-xl border border-brand-lime/30 bg-brand-lime/10 p-4 text-xs font-bold uppercase leading-relaxed tracking-wide text-brand-lime">
              Aluno iniciante ganha + 2 semanas de treino de adaptação
            </p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl border border-white/20 py-3 text-center text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10"
            >
              Quero meu treino
            </a>
          </article>
        </div>

        <p className="mt-10 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Todos os planos incluem planejamento individualizado, orientações e
          ajustes conforme o progresso.
        </p>
      </section>

      {/* CTA / Contato */}
      <footer
        id="contato"
        className="bg-brand-lime px-6 py-16 text-center text-brand-dark md:px-12"
      >
        <h2 className="text-balance text-4xl font-black uppercase italic tracking-tighter md:text-6xl">
          Vamos começar?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm font-medium text-brand-dark/80">
          O primeiro passo é decidir por você e pela sua saúde. Estou aqui para
          te ajudar a construir uma rotina mais saudável e consistente.
        </p>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block bg-brand-dark px-12 py-5 font-black uppercase tracking-[0.2em] text-white transition-transform hover:scale-105"
        >
          WhatsApp (65) 99639-2871
        </a>
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-brand-dark/10 pt-12 text-[10px] font-bold uppercase tracking-widest md:flex-row md:justify-between">
          <div>© 2026 Lorena Nunes · CREF 011334</div>
          <div className="flex gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70"
            >
              Instagram
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
