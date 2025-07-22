ALTER TABLE "public"."all_words" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable read access for all users"
ON "public"."all_words" FOR SELECT USING (true);