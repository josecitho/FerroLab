import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoriaRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.categoria.findMany({
      orderBy: { nombre: "asc" },
      include: {
        _count: {
          select: { productos: true },
        },
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.categoria.findUnique({
        where: { id: input.id },
        include: {
          productos: {
            orderBy: { nombre: "asc" },
          },
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        nombre: z.string().min(1, "El nombre es requerido"),
        descripcion: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.categoria.create({
        data: {
          nombre: input.nombre,
          descripcion: input.descripcion,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string().min(1, "El nombre es requerido"),
        descripcion: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.categoria.update({
        where: { id: input.id },
        data: {
          nombre: input.nombre,
          descripcion: input.descripcion,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.categoria.delete({
        where: { id: input.id },
      });
    }),
});