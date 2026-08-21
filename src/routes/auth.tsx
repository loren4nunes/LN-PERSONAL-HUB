import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Área do Aluno | Lorena Nunes Personal Trainer" },
      {
        name: "description",
        content:
          "Acesse a Área do Aluno da consultoria online da Lorena Nunes para ver seu treino, plano e evolução.",
      },
      { property: "og:title", content: "Área do Aluno | Lorena Nunes" },
      {
        property: "og:description",
        content: "Entre para acompanhar seu treino e sua evolução.",
      },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/painel", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });
        if (error) throw error;
        navigate({ to: "/painel", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: { nome: nome.trim() },
          },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/painel", replace: true });
        } else {
          setMsg(
            "Conta criada! Confirme seu e-mail pelo link que enviamos para poder entrar.",
          );
        }
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível continuar.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setErro(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setErro("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/painel", replace: true });
  }

  return (
    <div className="min-h-screen bg-background px-6 py-16 font-outfit text-foreground">
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-lime"
        >
          ← Voltar ao site
        </Link>
        <h1 className="mt-6 text-4xl font-black uppercase italic tracking-tighter">
          Área do <span className="text-brand-lime">Aluno</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "login"
            ? "Entre para ver seu treino e sua evolução."
            : "Crie sua conta para começar o acompanhamento."}
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-brand-card p-8"
        >
          {mode === "signup" && (
            <Field
              id="nome"
              label="Nome completo"
              value={nome}
              onChange={setNome}
              type="text"
              placeholder="Seu nome"
            />
          )}
          <Field
            id="email"
            label="E-mail"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="seu@email.com"
          />
          <Field
            id="senha"
            label="Senha"
            value={senha}
            onChange={setSenha}
            type="password"
            placeholder="••••••••"
          />

          {erro && <p className="text-xs text-red-400">{erro}</p>}
          {msg && <p className="text-xs text-brand-lime">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-lime py-4 text-sm font-black uppercase tracking-widest text-brand-dark transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading
              ? "Aguarde..."
              : mode === "login"
                ? "Entrar"
                : "Criar minha conta"}
          </button>

          <button
            type="button"
            onClick={onGoogle}
            className="w-full border border-white/20 py-4 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-white/10"
          >
            Continuar com Google
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setErro(null);
              setMsg(null);
            }}
            className="block w-full text-center text-xs uppercase tracking-widest text-brand-lime"
          >
            {mode === "login"
              ? "Não tenho conta · cadastrar"
              : "Já tenho conta · entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        maxLength={120}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={type === "password" ? "current-password" : "on"}
        className="w-full border-b border-white/10 bg-transparent px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-brand-lime focus:outline-none"
      />
    </div>
  );
}
