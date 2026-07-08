-- Drop duplicate self-select policy on user_roles
DROP POLICY IF EXISTS "user_roles self read" ON public.user_roles;

-- Revoke public EXECUTE on has_role; keep only for authenticated (needed by RLS policies)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;