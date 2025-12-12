"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function CategoriasPage() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);

  // Queries
  const { data: categorias, refetch } = api.categoria.getAll.useQuery();

  // Mutations
  const crearCategoria = api.categoria.create.useMutation({
    onSuccess: () => {
      void refetch();
      setMostrarForm(false);
      resetForm();
    },
  });

  const actualizarCategoria = api.categoria.update.useMutation({
    onSuccess: () => {
      void refetch();
      setEditando(null);
      setMostrarForm(false);
      resetForm();
    },
  });

  const eliminarCategoria = api.categoria.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
    });
    setEditando(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editando) {
      actualizarCategoria.mutate({ id: editando, ...formData });
    } else {
      crearCategoria.mutate(formData);
    }
  };

  const handleEdit = (categoria: { id: string; nombre: string; descripcion: string | null }) => {
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? "",
    });
    setEditando(categoria.id);
    setMostrarForm(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="mb-2 inline-block text-blue-400 hover:text-blue-300"
              >
                ← Volver al Dashboard
              </Link>
              <h1 className="text-4xl font-bold text-white">
                📁 Categorías
              </h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setMostrarForm(!mostrarForm);
              }}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {mostrarForm ? "Cancelar" : "+ Nueva Categoría"}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Formulario */}
        {mostrarForm && (
          <div className="mb-8 rounded-xl bg-slate-800 p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {editando ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Herramientas Eléctricas"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción de la categoría..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={
                    crearCategoria.isPending || actualizarCategoria.isPending
                  }
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {crearCategoria.isPending || actualizarCategoria.isPending
                    ? "Guardando..."
                    : editando
                      ? "Actualizar"
                      : "Crear Categoría"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarForm(false);
                    resetForm();
                  }}
                  className="rounded-lg bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Categorías */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categorias?.map((categoria) => (
            <div
              key={categoria.id}
              className="rounded-xl bg-slate-800 p-6 shadow-xl"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white">
                  {categoria.nombre}
                </h3>
                {categoria.descripcion && (
                  <p className="mt-2 text-slate-400">{categoria.descripcion}</p>
                )}
              </div>

              <div className="mb-4 flex items-center gap-2 text-blue-400">
                <span className="text-2xl">📦</span>
                <span className="font-semibold">
                  {categoria._count.productos} producto(s)
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(categoria)}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (categoria._count.productos > 0) {
                      alert(
                        "No se puede eliminar una categoría con productos asociados"
                      );
                      return;
                    }
                    if (
                      confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)
                    ) {
                      eliminarCategoria.mutate({ id: categoria.id });
                    }
                  }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {categorias?.length === 0 && (
          <div className="rounded-xl bg-slate-800 p-12 text-center">
            <p className="text-2xl text-slate-400">
              No hay categorías creadas aún
            </p>
            <button
              onClick={() => setMostrarForm(true)}
              className="mt-4 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Crear primera categoría
            </button>
          </div>
        )}
      </div>
    </main>
  );
}