import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.producto.findMany({
      orderBy: { nombre: "asc" },
      include: {
        categoria: true,
      },
    });
  }),

  getActivos: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.producto.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
      include: {
        categoria: true,
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.producto.findUnique({
        where: { id: input.id },
        include: {
          categoria: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        nombre: z.string().min(1, "El nombre es requerido"),
        descripcion: z.string().optional(),
        precio: z.number().positive("El precio debe ser mayor a 0"),
        stock: z.number().int().min(0, "El stock no puede ser negativo"),
        stockMinimo: z.number().int().min(0).default(5),
        imagenUrl: z.string().url().optional().or(z.literal("")),
        categoriaId: z.string().min(1, "La categoría es requerida"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.producto.create({
        data: {
          nombre: input.nombre,
          descripcion: input.descripcion,
          precio: input.precio,
          stock: input.stock,
          stockMinimo: input.stockMinimo,
          imagenUrl: input.imagenUrl || null,
          categoriaId: input.categoriaId,
        },
        include: {
          categoria: true,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        nombre: z.string().min(1, "El nombre es requerido"),
        descripcion: z.string().optional(),
        precio: z.number().positive("El precio debe ser mayor a 0"),
        stock: z.number().int().min(0, "El stock no puede ser negativo"),
        stockMinimo: z.number().int().min(0),
        imagenUrl: z.string().url().optional().or(z.literal("")),
        categoriaId: z.string().min(1, "La categoría es requerida"),
        activo: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.producto.update({
        where: { id: input.id },
        data: {
          nombre: input.nombre,
          descripcion: input.descripcion,
          precio: input.precio,
          stock: input.stock,
          stockMinimo: input.stockMinimo,
          imagenUrl: input.imagenUrl || null,
          categoriaId: input.categoriaId,
          activo: input.activo,
        },
        include: {
          categoria: true,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.producto.update({
        where: { id: input.id },
        data: { activo: false },
      });
    }),
});
