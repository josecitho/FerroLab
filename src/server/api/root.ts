import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { categoriaRouter } from "./routers/categoria";
import { productoRouter } from "./routers/producto";

export const appRouter = createTRPCRouter({
  categoria: categoriaRouter,
  producto: productoRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);