import { groups } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Group = InferSelectModel<typeof groups>;