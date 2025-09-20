ALTER TABLE "payment" ADD COLUMN "scene" text;--> statement-breakpoint
CREATE INDEX "payment_scene_idx" ON "payment" USING btree ("scene");