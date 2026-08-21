import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel | Lorena Nunes Personal Trainer" },
      {
        name: "description",
        content: "Painel de acompanhamento da consultoria online Lorena Nunes.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Painel,
  errorComponent: ({ error }) => (
    <Shell>
      <p className="text-sm text-red-400">
        Não foi possível carregar o painel: {error.message}
      </p>
    </Shell>
  ),
  notFoundComponent: () => (
    <Shell>
      <p className="text-sm text-muted-foreground">Conteúdo não encontrado.</p>
    </Shell>
  ),
});

type Profile = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  objetivo: string | null;
  plano: string | null;
  valor: number | null;
  vencimento: string | null;
  status_pagamento: string;
  treino: string | null;
  treino_link: string | null;
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background px-6 py-10 font-outfit text-foreground md:px-12">
      {children}
    </div>
  );
}

function Painel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const me = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user!;
      const [{ data: admin }, { data: profile }] = await Promise.all([
        supabase.rpc("is_admin"),
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      ]);
      let perfil = profile as Profile | null;
      if (!perfil) {
        const { data: inserted } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email ?? "",
            nome:
              (user.user_metadata?.["nome"] as string | undefined) ??
              (user.user_metadata?.["full_name"] as string | undefined) ??
              "",
          })
          .select("*")
          .maybeSingle();
        perfil = inserted as Profile | null;
      }
      return { isAdmin: Boolean(admin), perfil, email: user.email ?? "" };
    },
  });

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (me.isLoading) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </Shell>
    );
  }

  if (me.error) {
    return (
      <Shell>
        <p className="text-sm text-red-400">
          Erro ao carregar seus dados: {me.error.message}
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-lime">
            {me.data?.isAdmin ? "Painel da Personal" : "Área do Aluno"}
          </div>
          <h1 className="mt-2 text-3xl font-black uppercase italic tracking-tighter md:text-4xl">
            {me.data?.isAdmin ? "Meus alunos" : "Meu treino"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">{me.data?.email}</p>
        </div>
        <button
          onClick={sair}
          className="border border-white/20 px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white/10"
        >
          Sair
        </button>
      </header>

      {me.data?.isAdmin ? (
        <AdminPanel />
      ) : (
        <AlunoPanel perfil={me.data?.perfil ?? null} />
      )}
    </Shell>
  );
}

/* ------------------------------- ADMIN ---------------------------------- */

function AdminPanel() {
  const queryClient = useQueryClient();
  const [selecionado, setSelecionado] = useState<string | null>(null);

  const alunos = useQuery({
    queryKey: ["alunos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });

  const salvar = useMutation({
    mutationFn: async (p: Partial<Profile> & { id: string }) => {
      const { id, ...campos } = p;
      const { error } = await supabase.from("profiles").update(campos).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
    },
  });

  if (alunos.isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando alunos...</p>;
  }
  if (alunos.error) {
    return (
      <p className="text-sm text-red-400">
        Erro ao carregar alunos: {alunos.error.message}
      </p>
    );
  }

  const lista = alunos.data ?? [];
  const atual = lista.find((a) => a.id === selecionado) ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {lista.length} aluno(s)
        </div>
        {lista.length === 0 && (
          <p className="rounded-2xl border border-white/10 bg-brand-card p-6 text-sm text-muted-foreground">
            Nenhum aluno cadastrado ainda. Assim que alguém criar conta na Área
            do Aluno, aparece aqui.
          </p>
        )}
        {lista.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelecionado(a.id)}
            className={`w-full rounded-2xl border p-5 text-left transition-colors ${
              a.id === selecionado
                ? "border-brand-lime bg-brand-lime/10"
                : "border-white/10 bg-brand-card hover:border-white/25"
            }`}
          >
            <div className="text-sm font-bold">{a.nome || a.email}</div>
            <div className="mt-1 text-xs text-muted-foreground">{a.email}</div>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
              <span className="border border-white/15 px-2 py-1 text-muted-foreground">
                {a.plano || "sem plano"}
              </span>
              <span
                className={`px-2 py-1 ${
                  a.status_pagamento === "pago"
                    ? "bg-brand-lime text-brand-dark"
                    : "border border-white/15 text-muted-foreground"
                }`}
              >
                {a.status_pagamento}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div>
        {atual ? (
          <AlunoEditor
            key={atual.id}
            aluno={atual}
            salvando={salvar.isPending}
            onSalvar={(campos) => salvar.mutate({ id: atual.id, ...campos })}
          />
        ) : (
          <p className="rounded-3xl border border-white/10 bg-brand-card p-8 text-sm text-muted-foreground">
            Selecione um aluno para ver e editar plano, pagamento, treino e
            anotações.
          </p>
        )}
      </div>
    </div>
  );
}

function AlunoEditor({
  aluno,
  onSalvar,
  salvando,
}: {
  aluno: Profile;
  onSalvar: (campos: Partial<Profile>) => void;
  salvando: boolean;
}) {
  const [form, setForm] = useState({
    plano: aluno.plano ?? "",
    valor: aluno.valor != null ? String(aluno.valor) : "",
    vencimento: aluno.vencimento ?? "",
    status_pagamento: aluno.status_pagamento,
    treino: aluno.treino ?? "",
    treino_link: aluno.treino_link ?? "",
    telefone: aluno.telefone ?? "",
    objetivo: aluno.objetivo ?? "",
  });

  useEffect(() => {
    setForm({
      plano: aluno.plano ?? "",
      valor: aluno.valor != null ? String(aluno.valor) : "",
      vencimento: aluno.vencimento ?? "",
      status_pagamento: aluno.status_pagamento,
      treino: aluno.treino ?? "",
      treino_link: aluno.treino_link ?? "",
      telefone: aluno.telefone ?? "",
      objetivo: aluno.objetivo ?? "",
    });
  }, [aluno]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-brand-card p-8">
        <h2 className="text-xl font-black uppercase italic tracking-tighter">
          {aluno.nome || aluno.email}
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Campo
            label="WhatsApp"
            value={form.telefone}
            onChange={(v) => setForm({ ...form, telefone: v })}
          />
          <Campo
            label="Objetivo"
            value={form.objetivo}
            onChange={(v) => setForm({ ...form, objetivo: v })}
          />
          <Campo
            label="Plano"
            value={form.plano}
            onChange={(v) => setForm({ ...form, plano: v })}
            placeholder="Acompanhamento Online"
          />
          <Campo
            label="Valor (R$)"
            value={form.valor}
            onChange={(v) => setForm({ ...form, valor: v })}
            type="number"
            placeholder="280"
          />
          <Campo
            label="Vencimento"
            value={form.vencimento}
            onChange={(v) => setForm({ ...form, vencimento: v })}
            type="date"
          />
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Status do pagamento
            </label>
            <select
              value={form.status_pagamento}
              onChange={(e) =>
                setForm({ ...form, status_pagamento: e.target.value })
              }
              className="w-full border-b border-white/10 bg-transparent py-3 text-sm focus:border-brand-lime focus:outline-none"
            >
              <option value="pendente" className="bg-brand-dark">
                Pendente
              </option>
              <option value="pago" className="bg-brand-dark">
                Pago
              </option>
              <option value="atrasado" className="bg-brand-dark">
                Atrasado
              </option>
              <option value="encerrado" className="bg-brand-dark">
                Encerrado
              </option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <Campo
            label="Link do treino (PDF, planilha, vídeo)"
            value={form.treino_link}
            onChange={(v) => setForm({ ...form, treino_link: v })}
            placeholder="https://..."
          />
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Ficha de treino
            </label>
            <textarea
              rows={8}
              maxLength={8000}
              value={form.treino}
              onChange={(e) => setForm({ ...form, treino: e.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-transparent p-4 text-sm leading-relaxed focus:border-brand-lime focus:outline-none"
              placeholder={"Treino A - Inferiores\n1) Agachamento 4x10..."}
            />
          </div>
        </div>

        <button
          onClick={() =>
            onSalvar({
              plano: form.plano || null,
              valor: form.valor ? Number(form.valor) : null,
              vencimento: form.vencimento || null,
              status_pagamento: form.status_pagamento,
              treino: form.treino || null,
              treino_link: form.treino_link || null,
              telefone: form.telefone || null,
              objetivo: form.objetivo || null,
            })
          }
          disabled={salvando}
          className="mt-8 bg-brand-lime px-8 py-3 text-xs font-black uppercase tracking-widest text-brand-dark transition-transform hover:scale-105 disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </section>

      <Anotacoes studentId={aluno.id} podeEditar />
    </div>
  );
}

/* ------------------------------- ALUNO ---------------------------------- */

function AlunoPanel({ perfil }: { perfil: Profile | null }) {
  const queryClient = useQueryClient();
  const [nome, setNome] = useState(perfil?.nome ?? "");
  const [telefone, setTelefone] = useState(perfil?.telefone ?? "");
  const [objetivo, setObjetivo] = useState(perfil?.objetivo ?? "");

  const salvar = useMutation({
    mutationFn: async () => {
      if (!perfil) return;
      const { error } = await supabase
        .from("profiles")
        .update({
          nome: nome.trim(),
          telefone: telefone.trim() || null,
          objetivo: objetivo.trim() || null,
        })
        .eq("id", perfil.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  if (!perfil) {
    return (
      <p className="text-sm text-muted-foreground">
        Seu perfil ainda está sendo criado. Atualize a página em instantes.
      </p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-3xl border border-white/10 bg-brand-card p-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
          Meu treino
        </h2>
        {perfil.treino_link && (
          <a
            href={perfil.treino_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-brand-lime px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-dark"
          >
            Abrir treino
          </a>
        )}
        <pre className="mt-6 whitespace-pre-wrap font-outfit text-sm leading-relaxed text-muted-foreground">
          {perfil.treino || "Seu treino ainda não foi publicado pela Lorena."}
        </pre>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Meu plano
          </div>
          <div className="mt-2">{perfil.plano || "Sem plano definido"}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {perfil.valor != null && `R$ ${perfil.valor} · `}
            {perfil.vencimento
              ? `vence em ${new Date(`${perfil.vencimento}T12:00:00`).toLocaleDateString("pt-BR")} · `
              : ""}
            {perfil.status_pagamento}
          </div>
        </div>
      </section>

      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-brand-card p-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
            Meus dados
          </h2>
          <div className="mt-6 space-y-5">
            <Campo label="Nome" value={nome} onChange={setNome} />
            <Campo label="WhatsApp" value={telefone} onChange={setTelefone} />
            <Campo label="Objetivo" value={objetivo} onChange={setObjetivo} />
          </div>
          <button
            onClick={() => salvar.mutate()}
            disabled={salvar.isPending}
            className="mt-6 border border-brand-lime px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-lime transition-colors hover:bg-brand-lime hover:text-brand-dark disabled:opacity-60"
          >
            {salvar.isPending ? "Salvando..." : "Salvar"}
          </button>
        </section>

        <Anotacoes studentId={perfil.id} podeEditar={false} />
      </div>
    </div>
  );
}

/* ----------------------------- ANOTAÇÕES -------------------------------- */

type Nota = {
  id: string;
  nota: string;
  peso: number | null;
  medidas: string | null;
  created_at: string;
};

function Anotacoes({
  studentId,
  podeEditar,
}: {
  studentId: string;
  podeEditar: boolean;
}) {
  const queryClient = useQueryClient();
  const [nota, setNota] = useState("");
  const [peso, setPeso] = useState("");
  const [medidas, setMedidas] = useState("");

  const notas = useQuery({
    queryKey: ["notas", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_notes")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Nota[];
    },
  });

  const criar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("student_notes").insert({
        student_id: studentId,
        nota: nota.trim(),
        peso: peso ? Number(peso) : null,
        medidas: medidas.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNota("");
      setPeso("");
      setMedidas("");
      queryClient.invalidateQueries({ queryKey: ["notas", studentId] });
    },
  });

  return (
    <section className="rounded-3xl border border-white/10 bg-brand-card p-8">
      <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
        Anotações e evolução
      </h2>

      {podeEditar && (
        <div className="mt-6 space-y-4">
          <textarea
            rows={3}
            maxLength={2000}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Observação do acompanhamento..."
            className="w-full rounded-2xl border border-white/10 bg-transparent p-4 text-sm focus:border-brand-lime focus:outline-none"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Campo
              label="Peso (kg)"
              value={peso}
              onChange={setPeso}
              type="number"
            />
            <Campo
              label="Medidas"
              value={medidas}
              onChange={setMedidas}
              placeholder="Cintura 78 / Quadril 98"
            />
          </div>
          <button
            onClick={() => nota.trim() && criar.mutate()}
            disabled={criar.isPending || !nota.trim()}
            className="bg-brand-lime px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-dark disabled:opacity-50"
          >
            {criar.isPending ? "Salvando..." : "Adicionar anotação"}
          </button>
        </div>
      )}

      <ul className="mt-8 space-y-4">
        {(notas.data ?? []).length === 0 && (
          <li className="text-sm text-muted-foreground">
            Nenhuma anotação registrada.
          </li>
        )}
        {(notas.data ?? []).map((n) => (
          <li key={n.id} className="border-l-2 border-brand-lime pl-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {new Date(n.created_at).toLocaleDateString("pt-BR")}
              {n.peso != null && ` · ${n.peso} kg`}
              {n.medidas && ` · ${n.medidas}`}
            </div>
            <p className="mt-1 text-sm leading-relaxed">{n.nota}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Campo({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        maxLength={200}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-white/10 bg-transparent py-3 text-sm focus:border-brand-lime focus:outline-none"
      />
    </div>
  );
}
