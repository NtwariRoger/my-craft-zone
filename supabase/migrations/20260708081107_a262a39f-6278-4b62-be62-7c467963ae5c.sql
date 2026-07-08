
-- 1) Profiles: add INSERT policy and lock update user_id
CREATE POLICY "profiles insert own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles update own" ON public.profiles;
CREATE POLICY "profiles update own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2) Storage: remove public read on cv bucket (signed URLs are used instead)
DROP POLICY IF EXISTS "cv public read" ON storage.objects;
CREATE POLICY "cv admin read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cv' AND public.has_role(auth.uid(), 'admin'));

-- 3) Restrict direct execution of SECURITY DEFINER has_role to service_role only.
-- RLS policies referencing this function continue to work because policy expressions
-- are evaluated by the RLS engine, not by direct EXECUTE from the client.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
