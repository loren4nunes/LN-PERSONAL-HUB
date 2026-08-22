ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS situacao text NOT NULL DEFAULT 'aguardando',
  ADD COLUMN IF NOT EXISTS aprovado_em timestamptz,
  ADD COLUMN IF NOT EXISTS treino_atualizado_em date,
  ADD COLUMN IF NOT EXISTS protocolo_vence_em date;

CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.plano := OLD.plano;
    NEW.valor := OLD.valor;
    NEW.vencimento := OLD.vencimento;
    NEW.status_pagamento := OLD.status_pagamento;
    NEW.treino := OLD.treino;
    NEW.treino_link := OLD.treino_link;
    NEW.situacao := OLD.situacao;
    NEW.aprovado_em := OLD.aprovado_em;
    NEW.treino_atualizado_em := OLD.treino_atualizado_em;
    NEW.protocolo_vence_em := OLD.protocolo_vence_em;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  tipo text NOT NULL DEFAULT 'treino',
  inicio timestamptz NOT NULL,
  fim timestamptz,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY appointments_select ON public.appointments FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_admin());
CREATE POLICY appointments_insert_admin ON public.appointments FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());
CREATE POLICY appointments_update_admin ON public.appointments FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY appointments_delete_admin ON public.appointments FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  data date NOT NULL DEFAULT current_date,
  presente boolean NOT NULL DEFAULT true,
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, data)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY attendance_select ON public.attendance FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR public.is_admin());
CREATE POLICY attendance_insert_admin ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());
CREATE POLICY attendance_update_admin ON public.attendance FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY attendance_delete_admin ON public.attendance FOR DELETE TO authenticated
  USING (public.is_admin());