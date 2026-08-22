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
  situacao: string;
  aprovado_em: string | null;
  treino_atualizado_em: string | null;
  protocolo_vence_em: string | null;
};

type Appointment = {
  id: string;
  student_id: string | null;
  titulo: string;
  tipo: string;
  inicio: string;
  fim: string | null;
  observacoes: string | null;
};

type Attendance = {
  id: string;
  student_id: string;
  data: string;
  presente: boolean;
  observacao: string | null;
};

const hoje = () => new Date().toISOString().slice(0, 10);

function addMeses(dateStr: string, meses: number) {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
}

function fmtData(d: string | null) {
  if (!d) return "—";
  return new Date(d.length > 10 ? d : `${d}T12:00:00`).toLocaleDateString(
    "pt-BR",
  );
}


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

type Aba = "alunos" | "agenda" | "pendentes" | "novos";

function protocoloVencido(a: Profile) {
  if (a.situacao !== "ativo") return false;
  if (!a.protocolo_vence_em) return Boolean(a.plano);
  return a.protocolo_vence_em <= hoje();
}

function AdminPanel() {
  const queryClient = useQueryClient();
  const [aba, setAba] = useState<Aba>("alunos");
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
      const patch: Record<string, unknown> = { ...campos };
      if (campos.treino || campos.treino_link) {
        patch["treino_atualizado_em"] = hoje();
        patch["protocolo_vence_em"] = addMeses(hoje(), 2);
      }
      const { error } = await supabase.from("profiles").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
    },
  });

  const situacaoMut = useMutation({
    mutationFn: async ({ id, situacao }: { id: string; situacao: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          situacao,
          aprovado_em: situacao === "ativo" ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["alunos"] }),
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
  const ativos = lista.filter((a) => a.situacao === "ativo");
  const novos = lista.filter((a) => a.situacao !== "ativo");
  const pendentes = lista.filter(protocoloVencido);
  const atual = lista.find((a) => a.id === selecionado) ?? null;

  const itens: { id: Aba; label: string; badge?: number }[] = [
    { id: "alunos", label: "Meus alunos", badge: ativos.length },
    { id: "agenda", label: "Agenda" },
    { id: "pendentes", label: "Treinos pendentes", badge: pendentes.length },
    { id: "novos", label: "Novos alunos", badge: novos.length },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      <nav className="space-y-2 lg:sticky lg:top-10 lg:self-start">
        {itens.map((i) => (
          <button
            key={i.id}
            onClick={() => setAba(i.id)}
            className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left text-xs font-black uppercase tracking-widest transition-colors ${
              aba === i.id
                ? "border-brand-lime bg-brand-lime/10 text-brand-lime"
                : "border-white/10 bg-brand-card text-muted-foreground hover:border-white/25"
            }`}
          >
            <span>{i.label}</span>
            {i.badge ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  aba === i.id
                    ? "bg-brand-lime text-brand-dark"
                    : "bg-white/10 text-foreground"
                }`}
              >
                {i.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="min-w-0">
        {aba === "alunos" && (
          <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
            <ListaAlunos
              lista={ativos}
              selecionado={selecionado}
              onSelecionar={setSelecionado}
              vazio="Nenhum aluno ativo ainda. Aprove os novos alunos na aba Novos alunos."
            />
            <div>
              {atual && atual.situacao === "ativo" ? (
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
        )}

        {aba === "agenda" && <AgendaView alunos={ativos} />}

        {aba === "pendentes" && (
          <PendentesView
            pendentes={pendentes}
            salvando={salvar.isPending}
            onSalvar={(id, campos) => salvar.mutate({ id, ...campos })}
          />
        )}

        {aba === "novos" && (
          <NovosView
            novos={novos}
            salvando={situacaoMut.isPending}
            onSituacao={(id, situacao) => situacaoMut.mutate({ id, situacao })}
            onPagamento={(id, status) =>
              salvar.mutate({ id, status_pagamento: status })
            }
          />
        )}
      </div>
    </div>
  );
}

function ListaAlunos({
  lista,
  selecionado,
  onSelecionar,
  vazio,
}: {
  lista: Profile[];
  selecionado: string | null;
  onSelecionar: (id: string) => void;
  vazio: string;
}) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {lista.length} aluno(s)
      </div>
      {lista.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-brand-card p-6 text-sm text-muted-foreground">
          {vazio}
        </p>
      )}
      {lista.map((a) => (
        <button
          key={a.id}
          onClick={() => onSelecionar(a.id)}
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
            {protocoloVencido(a) && (
              <span className="bg-red-500/20 px-2 py-1 text-red-300">
                protocolo vencido
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- AGENDA --------------------------------- */

function AgendaView({ alunos }: { alunos: Profile[] }) {
  const queryClient = useQueryClient();
  const [dia, setDia] = useState(hoje());
  const [form, setForm] = useState({
    titulo: "",
    tipo: "treino",
    student_id: "",
    hora: "07:00",
    observacoes: "",
  });

  const compromissos = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("inicio", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Appointment[];
    },
  });

  const frequencia = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .order("data", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Attendance[];
    },
  });

  const criar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("appointments").insert({
        titulo: form.titulo.trim(),
        tipo: form.tipo,
        student_id: form.student_id || null,
        inicio: new Date(`${dia}T${form.hora}:00`).toISOString(),
        observacoes: form.observacoes.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setForm({ ...form, titulo: "", observacoes: "" });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  const remover = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const marcar = useMutation({
    mutationFn: async ({
      studentId,
      presente,
    }: {
      studentId: string;
      presente: boolean;
    }) => {
      const { error } = await supabase
        .from("attendance")
        .upsert(
          { student_id: studentId, data: dia, presente },
          { onConflict: "student_id,data" },
        );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["attendance"] }),
  });

  const doDia = (compromissos.data ?? []).filter(
    (c) => c.inicio.slice(0, 10) === dia,
  );
  const presencas = frequencia.data ?? [];
  const inicioMes = dia.slice(0, 8) + "01";

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-brand-card p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
              Agenda
            </h2>
            <p className="mt-2 text-2xl font-black uppercase italic tracking-tighter">
              {fmtData(dia)}
            </p>
          </div>
          <input
            type="date"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            className="border-b border-white/10 bg-transparent py-2 text-sm focus:border-brand-lime focus:outline-none"
          />
        </div>

        <ul className="mt-6 space-y-3">
          {doDia.length === 0 && (
            <li className="text-sm text-muted-foreground">
              Nenhum compromisso neste dia.
            </li>
          )}
          {doDia.map((c) => {
            const aluno = alunos.find((a) => a.id === c.student_id);
            return (
              <li
                key={c.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 p-4"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-brand-lime">
                    {new Date(c.inicio).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · {c.tipo}
                  </div>
                  <div className="mt-1 text-sm font-bold">{c.titulo}</div>
                  <div className="text-xs text-muted-foreground">
                    {aluno ? aluno.nome || aluno.email : "Sem aluno vinculado"}
                    {c.observacoes ? ` · ${c.observacoes}` : ""}
                  </div>
                </div>
                <button
                  onClick={() => remover.mutate(c.id)}
                  className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-red-400"
                >
                  Excluir
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 grid gap-5 border-t border-white/10 pt-6 md:grid-cols-2">
          <Campo
            label="Título do compromisso"
            value={form.titulo}
            onChange={(v) => setForm({ ...form, titulo: v })}
            placeholder="Treino presencial / Avaliação"
          />
          <Campo
            label="Hora"
            type="time"
            value={form.hora}
            onChange={(v) => setForm({ ...form, hora: v })}
          />
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Aluno
            </label>
            <select
              value={form.student_id}
              onChange={(e) => setForm({ ...form, student_id: e.target.value })}
              className="w-full border-b border-white/10 bg-transparent py-3 text-sm focus:border-brand-lime focus:outline-none"
            >
              <option value="" className="bg-brand-dark">
                Sem aluno
              </option>
              {alunos.map((a) => (
                <option key={a.id} value={a.id} className="bg-brand-dark">
                  {a.nome || a.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Tipo
            </label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              className="w-full border-b border-white/10 bg-transparent py-3 text-sm focus:border-brand-lime focus:outline-none"
            >
              {["treino", "avaliação", "consultoria", "pessoal"].map((t) => (
                <option key={t} value={t} className="bg-brand-dark">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Campo
              label="Observações"
              value={form.observacoes}
              onChange={(v) => setForm({ ...form, observacoes: v })}
            />
          </div>
        </div>
        <button
          onClick={() => form.titulo.trim() && criar.mutate()}
          disabled={criar.isPending || !form.titulo.trim()}
          className="mt-6 bg-brand-lime px-8 py-3 text-xs font-black uppercase tracking-widest text-brand-dark disabled:opacity-50"
        >
          {criar.isPending ? "Criando..." : "Criar compromisso"}
        </button>
      </section>

      <section className="rounded-3xl border border-white/10 bg-brand-card p-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
          Frequência dos alunos
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Marque a presença do dia selecionado ({fmtData(dia)}). O contador
          mostra os treinos do mês.
        </p>
        <ul className="mt-6 space-y-3">
          {alunos.length === 0 && (
            <li className="text-sm text-muted-foreground">
              Nenhum aluno ativo.
            </li>
          )}
          {alunos.map((a) => {
            const doMes = presencas.filter(
              (p) => p.student_id === a.id && p.presente && p.data >= inicioMes,
            ).length;
            const registro = presencas.find(
              (p) => p.student_id === a.id && p.data === dia,
            );
            return (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 p-4"
              >
                <div>
                  <div className="text-sm font-bold">{a.nome || a.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {doMes} treino(s) no mês
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      marcar.mutate({ studentId: a.id, presente: true })
                    }
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                      registro?.presente
                        ? "bg-brand-lime text-brand-dark"
                        : "border border-white/15 text-muted-foreground hover:border-brand-lime"
                    }`}
                  >
                    Presente
                  </button>
                  <button
                    onClick={() =>
                      marcar.mutate({ studentId: a.id, presente: false })
                    }
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                      registro && !registro.presente
                        ? "bg-red-500/30 text-red-200"
                        : "border border-white/15 text-muted-foreground hover:border-red-400"
                    }`}
                  >
                    Faltou
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

/* --------------------------- TREINOS PENDENTES --------------------------- */

function PendentesView({
  pendentes,
  salvando,
  onSalvar,
}: {
  pendentes: Profile[];
  salvando: boolean;
  onSalvar: (id: string, campos: Partial<Profile>) => void;
}) {
  const [aberto, setAberto] = useState<string | null>(null);
  const atual = pendentes.find((p) => p.id === aberto) ?? null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-brand-card p-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
          Treinos pendentes
        </h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Cada protocolo vale 2 meses. Ao salvar um novo treino, a validade é
          renovada automaticamente.
        </p>
        <ul className="mt-6 space-y-3">
          {pendentes.length === 0 && (
            <li className="text-sm text-muted-foreground">
              Nenhum protocolo vencido. Tudo em dia!
            </li>
          )}
          {pendentes.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-400/30 bg-red-500/5 p-4"
            >
              <div>
                <div className="text-sm font-bold">{a.nome || a.email}</div>
                <div className="text-xs text-muted-foreground">
                  Último protocolo: {fmtData(a.treino_atualizado_em)} · Venceu
                  em: {fmtData(a.protocolo_vence_em)}
                </div>
              </div>
              <button
                onClick={() => setAberto(aberto === a.id ? null : a.id)}
                className="bg-brand-lime px-5 py-2 text-[10px] font-black uppercase tracking-widest text-brand-dark"
              >
                {aberto === a.id ? "Fechar" : "Montar novo protocolo"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {atual && (
        <AlunoEditor
          key={atual.id}
          aluno={atual}
          salvando={salvando}
          onSalvar={(campos) => onSalvar(atual.id, campos)}
        />
      )}
    </div>
  );
}

/* ----------------------------- NOVOS ALUNOS ------------------------------ */

function NovosView({
  novos,
  salvando,
  onSituacao,
  onPagamento,
}: {
  novos: Profile[];
  salvando: boolean;
  onSituacao: (id: string, situacao: string) => void;
  onPagamento: (id: string, status: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-brand-card p-8">
      <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-brand-lime">
        Novos alunos
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">
        Quem cria conta fica aguardando. Confirme o pagamento e aceite o aluno
        na sua cartela.
      </p>
      <ul className="mt-6 space-y-4">
        {novos.length === 0 && (
          <li className="text-sm text-muted-foreground">
            Nenhum novo aluno aguardando.
          </li>
        )}
        {novos.map((a) => (
          <li key={a.id} className="rounded-2xl border border-white/10 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold">{a.nome || a.email}</div>
                <div className="text-xs text-muted-foreground">{a.email}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {a.telefone || "sem WhatsApp"} ·{" "}
                  {a.objetivo || "sem objetivo informado"}
                </div>
              </div>
              <span
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                  a.status_pagamento === "pago"
                    ? "bg-brand-lime text-brand-dark"
                    : "border border-white/15 text-muted-foreground"
                }`}
              >
                {a.status_pagamento}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => onPagamento(a.id, "pago")}
                disabled={a.status_pagamento === "pago"}
                className="border border-white/20 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white/10 disabled:opacity-40"
              >
                Marcar pagamento
              </button>
              <button
                onClick={() => onSituacao(a.id, "ativo")}
                disabled={salvando || a.status_pagamento !== "pago"}
                className="bg-brand-lime px-5 py-2 text-[10px] font-black uppercase tracking-widest text-brand-dark disabled:opacity-40"
              >
                Aceitar na cartela
              </button>
              <button
                onClick={() => onSituacao(a.id, "recusado")}
                disabled={salvando}
                className="border border-red-400/40 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-red-300 hover:bg-red-500/10 disabled:opacity-40"
              >
                Recusar
              </button>
            </div>
            {a.situacao === "recusado" && (
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-red-300">
                Recusado
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
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
