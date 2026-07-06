
-- Public read + admin write policies for the cv bucket
CREATE POLICY "cv public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'cv');
CREATE POLICY "cv admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cv' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "cv admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cv' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'cv' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "cv admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cv' AND public.has_role(auth.uid(), 'admin'));
