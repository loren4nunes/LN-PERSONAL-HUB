import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import logo from "@/assets/logo-lorena.png.asset.json";
import heroTraining from "@/assets/hero-training.jpg";

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

      {/* Sou Aluno / Onboarding */}
      <section id="sou-aluno" className="px-6 py-24 md:px-12">
        <OnboardingForm />
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

const onboardingSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo").max(100),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD")
    .max(20),
  objetivo: z.string().min(1, "Escolha seu principal objetivo"),
  experiencia: z.string().min(1, "Escolha seu nível de experiência"),
  diasPorSemana: z.string().min(1, "Escolha quantos dias pode treinar"),
  tempoPorSessao: z.string().min(1, "Escolha o tempo por sessão"),
  local: z.string().min(1, "Escolha onde vai treinar"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

function OnboardingForm() {
  const [form, setForm] = useState<OnboardingData>({
    nome: "",
    whatsapp: "",
    objetivo: "",
    experiencia: "",
    diasPorSemana: "",
    tempoPorSessao: "",
    local: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OnboardingData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OnboardingData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onboardingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof OnboardingData, string>> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof OnboardingData;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);

    const mensagem = [
      `Oi, Lorena! Me chamo ${form.nome} e quero começar a consultoria online.`,
      "",
      "*Respostas do onboarding:*",
      `Objetivo: ${form.objetivo}`,
      `Experiência: ${form.experiencia}`,
      `Disponibilidade: ${form.diasPorSemana} por semana`,
      `Tempo por sessão: ${form.tempoPorSessao}`,
      `Local de treino: ${form.local}`,
      `WhatsApp: ${form.whatsapp}`,
    ].join("%0A");

    window.open(`${WHATSAPP}?text=${mensagem}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-10 text-center">
        <h2 className="text-balance text-4xl font-black uppercase italic tracking-tighter md:text-5xl">
          Área do <span className="text-brand-lime">Aluno</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Preencha seu perfil de treino para eu montar o plano ideal para você.
        </p>
      </div>

      {submitted ? (
        <div className="rounded-3xl border border-brand-lime/30 bg-brand-lime/10 p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-brand-lime text-brand-dark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="text-xl font-black uppercase italic tracking-tight">
            Perfil enviado!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Você será redirecionado para o WhatsApp da Lorena para finalizar seu
            plano.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-white/10 bg-brand-card p-8 md:p-10"
          noValidate
        >
          <div>
            <label
              htmlFor="nome"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Nome completo
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              className="w-full border-b border-white/10 bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand-lime focus:outline-none"
            />
            {errors.nome && (
              <p className="mt-2 text-xs text-red-400">{errors.nome}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="(65) 99999-9999"
              className="w-full border-b border-white/10 bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand-lime focus:outline-none"
            />
            {errors.whatsapp && (
              <p className="mt-2 text-xs text-red-400">{errors.whatsapp}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="objetivo"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Principal objetivo
            </label>
            <select
              id="objetivo"
              name="objetivo"
              value={form.objetivo}
              onChange={handleChange}
              className="w-full border-b border-white/10 bg-transparent py-3 text-sm text-foreground focus:border-brand-lime focus:outline-none"
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Condicionamento físico">Condicionamento físico</option>
              <option value="Saúde e bem-estar">Saúde e bem-estar</option>
              <option value="Preparação para evento">Preparação para evento</option>
            </select>
            {errors.objetivo && (
              <p className="mt-2 text-xs text-red-400">{errors.objetivo}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="experiencia"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Nível de experiência
            </label>
            <select
              id="experiencia"
              name="experiencia"
              value={form.experiencia}
              onChange={handleChange}
              className="w-full border-b border-white/10 bg-transparent py-3 text-sm text-foreground focus:border-brand-lime focus:outline-none"
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="Iniciante">Iniciante</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
            {errors.experiencia && (
              <p className="mt-2 text-xs text-red-400">{errors.experiencia}</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="diasPorSemana"
                className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Dias por semana
              </label>
              <select
                id="diasPorSemana"
                name="diasPorSemana"
                value={form.diasPorSemana}
                onChange={handleChange}
                className="w-full border-b border-white/10 bg-transparent py-3 text-sm text-foreground focus:border-brand-lime focus:outline-none"
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="2 dias">2 dias</option>
                <option value="3 dias">3 dias</option>
                <option value="4 dias">4 dias</option>
                <option value="5 dias">5 dias</option>
                <option value="6 dias">6 dias</option>
              </select>
              {errors.diasPorSemana && (
                <p className="mt-2 text-xs text-red-400">{errors.diasPorSemana}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="tempoPorSessao"
                className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
              >
                Tempo por sessão
              </label>
              <select
                id="tempoPorSessao"
                name="tempoPorSessao"
                value={form.tempoPorSessao}
                onChange={handleChange}
                className="w-full border-b border-white/10 bg-transparent py-3 text-sm text-foreground focus:border-brand-lime focus:outline-none"
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="Até 30 min">Até 30 min</option>
                <option value="30 a 45 min">30 a 45 min</option>
                <option value="45 a 60 min">45 a 60 min</option>
                <option value="Mais de 60 min">Mais de 60 min</option>
              </select>
              {errors.tempoPorSessao && (
                <p className="mt-2 text-xs text-red-400">{errors.tempoPorSessao}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="local"
              className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
            >
              Local de treino
            </label>
            <select
              id="local"
              name="local"
              value={form.local}
              onChange={handleChange}
              className="w-full border-b border-white/10 bg-transparent py-3 text-sm text-foreground focus:border-brand-lime focus:outline-none"
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="Em casa">Em casa</option>
              <option value="Academia">Academia</option>
              <option value="Parque/área externa">Parque/área externa</option>
              <option value="Misto">Misto</option>
            </select>
            {errors.local && (
              <p className="mt-2 text-xs text-red-400">{errors.local}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-lime py-4 text-sm font-black uppercase tracking-widest text-brand-dark transition-transform hover:scale-[1.02]"
          >
            Enviar meu perfil
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Já é aluno?{" "}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold uppercase tracking-widest text-brand-lime transition-colors hover:text-brand-lime/80"
            >
              Falar no WhatsApp
            </a>
          </p>
        </form>
      )}
    </div>
  );
}
