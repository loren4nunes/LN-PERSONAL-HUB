import { createFileRoute, Link } from "@tanstack/react-router";

import heroTraining from "@/assets/hero-training.jpg";
import results01 from "@/assets/results-01.jpg";
import results02 from "@/assets/results-02.jpg";
import results03 from "@/assets/results-03.jpg";
import results04 from "@/assets/results-04.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "AXON Performance Humana | Consultoria Online de Personal Trainer",
      },
      {
        name: "description",
        content:
          "Consultoria online de alta performance. Planilhas personalizadas, análise técnica por vídeo e suporte direto via WhatsApp para quem busca resultados reais.",
      },
      {
        property: "og:title",
        content:
          "AXON Performance Humana | Consultoria Online de Personal Trainer",
      },
      {
        property: "og:description",
        content:
          "Consultoria online de alta performance. Planilhas personalizadas, análise técnica por vídeo e suporte direto via WhatsApp.",
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
      <header className="flex items-center justify-between px-6 py-8 md:px-12">
        <div className="text-2xl font-black tracking-tighter">
          AXON<span className="text-brand-lime">.</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-widest md:flex">
          <a
            href="#metodologia"
            className="transition-colors hover:text-brand-lime"
          >
            Metodologia
          </a>
          <a
            href="#planos"
            className="transition-colors hover:text-brand-lime"
          >
            Planos
          </a>
          <a
            href="#resultados"
            className="transition-colors hover:text-brand-lime"
          >
            Resultados
          </a>
        </nav>
        <a
          href="#contato"
          className="border border-brand-lime px-6 py-2 text-xs font-bold uppercase tracking-widest text-brand-lime transition-all hover:bg-brand-lime hover:text-brand-dark"
        >
          Começar Agora
        </a>
      </header>

      {/* Hero Section */}
      <section className="grid items-center gap-12 px-6 py-12 md:grid-cols-2 md:px-12 md:py-24">
        <div className="relative z-10">
          <h1 className="text-balance text-6xl font-black uppercase italic leading-[0.9] tracking-tighter md:text-8xl">
            Treine <br />
            <span className="text-brand-lime">Sem Limites</span> <br />
            Geográficos.
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
            Consultoria online de alta performance. Planilhas personalizadas,
            análise técnica por vídeo e suporte direto via WhatsApp para quem
            busca resultados reais.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contato"
              className="bg-brand-lime px-8 py-4 text-sm font-black uppercase text-brand-dark transition-transform hover:scale-105"
            >
              Quero meu Plano Personalizado
            </a>
          </div>
        </div>
        <div className="relative">
          <img
            src={heroTraining}
            alt="Atleta treinando em academia com iluminação dramática"
            width={800}
            height={1008}
            className="aspect-[4/5] w-full bg-brand-card object-cover outline outline-1 -outline-offset-1 outline-white/5"
            fetchPriority="high"
          />
          <div className="absolute -bottom-6 -left-6 hidden bg-brand-lime p-6 text-brand-dark md:block">
            <div className="text-4xl font-black italic tracking-tighter">
              +500
            </div>
            <div className="text-[10px] font-bold uppercase leading-none tracking-widest">
              Alunos Transformados
            </div>
          </div>
        </div>
      </section>

      {/* Key Pillars */}
      <section id="metodologia" className="bg-white/5 px-6 py-24 md:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          <article className="border-l-2 border-brand-lime bg-brand-card p-8">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-lime">
              01. Precisão
            </div>
            <h3 className="mb-4 text-2xl font-bold">Bio-Individualidade</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Chega de treinos genéricos. Cada repetição e cada grama de
              macronutriente é calculada com base nos seus objetivos e rotina.
            </p>
          </article>
          <article className="border-l-2 border-brand-lime bg-brand-card p-8">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-lime">
              02. Acompanhamento
            </div>
            <h3 className="mb-4 text-2xl font-bold">Feedback em Vídeo</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Envie vídeos da sua execução e receba correções técnicas
              detalhadas para garantir segurança e máxima eficiência muscular.
            </p>
          </article>
          <article className="border-l-2 border-brand-lime bg-brand-card p-8">
            <div className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-lime">
              03. Mobilidade
            </div>
            <h3 className="mb-4 text-2xl font-bold">App Exclusivo</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Seus treinos na palma da mão, com vídeos explicativos, cronômetro
              integrado e registro de cargas direto no smartphone.
            </p>
          </article>
        </div>
      </section>

      {/* Results Teaser */}
      <section id="resultados" className="px-6 py-24 md:px-12">
        <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
          <h2 className="text-balance text-4xl font-black uppercase italic tracking-tighter md:text-6xl">
            Resultados que <br />
            <span className="text-brand-lime">Falam</span>
          </h2>
          <p className="max-w-xs text-sm text-muted-foreground">
            A transformação não é apenas estética, é uma mudança de mentalidade e
            saúde.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <figure className="aspect-[3/4] overflow-hidden bg-brand-card">
            <img
              src={results01}
              alt="Resultado de transformação física masculina"
              width={704}
              height={944}
              loading="lazy"
              className="h-full w-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
            />
          </figure>
          <figure className="aspect-[3/4] overflow-hidden bg-brand-card">
            <img
              src={results02}
              alt="Resultado de transformação física feminina"
              width={704}
              height={944}
              loading="lazy"
              className="h-full w-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
            />
          </figure>
          <figure className="aspect-[3/4] overflow-hidden bg-brand-card">
            <img
              src={results03}
              alt="Resultado de postura e condicionamento físico"
              width={704}
              height={944}
              loading="lazy"
              className="h-full w-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
            />
          </figure>
          <figure className="aspect-[3/4] overflow-hidden bg-brand-card">
            <img
              src={results04}
              alt="Atleta executando levantamento terra com força"
              width={704}
              height={944}
              loading="lazy"
              className="h-full w-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
            />
          </figure>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="bg-brand-card px-6 py-24 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter md:text-5xl">
            Planos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Escolha o nível de acompanhamento ideal para o seu objetivo.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article className="flex flex-col border border-white/10 p-8">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-lime">
              Essencial
            </span>
            <h3 className="mt-2 text-2xl font-bold">Start</h3>
            <div className="my-6 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tighter">
                R$ 297
              </span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            <ul className="mb-10 flex-grow space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">✓ Treino via app</li>
              <li className="flex items-center gap-2">
                ✓ Vídeos explicativos
              </li>
              <li className="flex items-center gap-2">
                ✓ Suporte por chat (48h)
              </li>
            </ul>
            <a
              href="#contato"
              className="w-full border border-white/20 py-3 text-center text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10"
            >
              Escolher Plano
            </a>
          </article>

          <article className="relative flex flex-col border-2 border-brand-lime p-8">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-lime px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
              Mais Popular
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-lime">
              Performance
            </span>
            <h3 className="mt-2 text-2xl font-bold">Pro</h3>
            <div className="my-6 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tighter">
                R$ 497
              </span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            <ul className="mb-10 flex-grow space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                ✓ Ajuste semanal de carga
              </li>
              <li className="flex items-center gap-2">
                ✓ Análise de vídeo da execução
              </li>
              <li className="flex items-center gap-2">
                ✓ WhatsApp direto e prioritário
              </li>
            </ul>
            <a
              href="#contato"
              className="w-full bg-brand-lime py-3 text-center text-xs font-bold uppercase tracking-widest text-brand-dark transition-transform hover:scale-[1.02]"
            >
              Começar Agora
            </a>
          </article>

          <article className="flex flex-col border border-white/10 p-8">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-lime">
              Elite
            </span>
            <h3 className="mt-2 text-2xl font-bold">VIP</h3>
            <div className="my-6 flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tighter">
                R$ 897
              </span>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
            <ul className="mb-10 flex-grow space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                ✓ Planejamento trimestral
              </li>
              <li className="flex items-center gap-2">
                ✓ Calls semanais de 30 min
              </li>
              <li className="flex items-center gap-2">
                ✓ Protocolo nutricional completo
              </li>
            </ul>
            <a
              href="#contato"
              className="w-full border border-white/20 py-3 text-center text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10"
            >
              Escolher Plano
            </a>
          </article>
        </div>
      </section>

      {/* CTA Footer */}
      <footer
        id="contato"
        className="bg-brand-lime px-6 py-16 text-center text-brand-dark md:px-12"
      >
        <h2 className="text-balance text-4xl font-black uppercase italic tracking-tighter md:text-7xl">
          Pronto para o próximo nível?
        </h2>
        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block bg-brand-dark px-12 py-5 font-black uppercase tracking-[0.2em] text-white transition-transform hover:scale-105"
        >
          Falar com Personal Agora
        </a>
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-brand-dark/10 pt-12 text-[10px] font-bold uppercase tracking-widest md:flex-row md:justify-between">
          <div>© 2026 AXON Performance Humana</div>
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
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70"
            >
              WhatsApp
            </a>
            <Link to="/" className="hover:opacity-70">
              Termos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
