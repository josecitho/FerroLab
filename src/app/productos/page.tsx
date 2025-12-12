"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function ProductosPage() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const { data: productos, refetch } = api.producto.getAll.useQuery();
  const { data: categorias } = api.categoria.getAll.useQuery();

  const crearProducto = api.producto.create.useMutation({
    onSuccess: () => {
      void refetch();
      setMostrarForm(false);
      resetForm();
    },
  });

  const actualizarProducto = api.producto.update.useMutation({
    onSuccess: () => {
      void refetch();
      setEditando(null);
      setMostrarForm(false);
      resetForm();
    },
  });

  const eliminarProducto = api.producto.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    stockMinimo: 5,
    imagenUrl: "",
    categoriaId: "",
    activo: true,
  });

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      stockMinimo: 5,
      imagenUrl: "",
      categoriaId: "",
      activo: true,
    });
    setEditando(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editando) {
      actualizarProducto.mutate({ id: editando, ...formData });
    } else {
      crearProducto.mutate(formData);
    }
  };

  const handleEdit = (producto: any) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: producto.precio,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo,
      imagenUrl: producto.imagenUrl ?? "",
      categoriaId: producto.categoriaId,
      activo: producto.activo,
    });
    setEditando(producto.id);
    setMostrarForm(true);
  };

  const productosFiltrados = productos?.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="mb-2 inline-block text-blue-400 hover:text-blue-300">
                ← Volver al Dashboard
              </Link>
              <h1 className="text-4xl font-bold text-white">📦 Productos</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setMostrarForm(!mostrarForm);
              }}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {mostrarForm ? "Cancelar" : "+ Nuevo Producto"}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {mostrarForm && (
          <div className="mb-8 rounded-xl bg-slate-800 p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {editando ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Martillo de Carpintero"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Categoría *</label>
                  <select
                    required
                    value={formData.categoriaId}
                    onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                    className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar...</option>
                    {categorias?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Precio *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.precio || ""}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value === "" ? 0 : parseFloat(e.target.value) })}
                    className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock || ""}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                    className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Stock Mínimo *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stockMinimo || ""}
                    onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                    className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">URL Imagen</label>
                  <input
                    type="url"
                    value={formData.imagenUrl}
                    onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                    className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción del producto..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={crearProducto.isPending || actualizarProducto.isPending}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {crearProducto.isPending || actualizarProducto.isPending ? "Guardando..." : editando ? "Actualizar" : "Crear Producto"}
                </button>
                <button
                  type="button"
                  onClick={() => { setMostrarForm(false); resetForm(); }}
                  className="rounded-lg bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar productos..."
            className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {productosFiltrados?.map((producto) => (
            <div key={producto.id} className="rounded-xl bg-slate-800 p-6 shadow-xl transition hover:shadow-2xl">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{producto.nombre}</h3>
                  <p className="text-sm text-blue-400">{producto.categoria.nombre}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${producto.stock <= producto.stockMinimo ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
                  Stock: {producto.stock}
                </span>
              </div>
              {producto.descripcion && <p className="mb-4 text-sm text-slate-400">{producto.descripcion}</p>}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-3xl font-bold text-green-400">${producto.precio.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Mín: {producto.stockMinimo}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(producto)}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => { if (confirm(`¿Desactivar "${producto.nombre}"?`)) { eliminarProducto.mutate({ id: producto.id }); } }}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {productosFiltrados?.length === 0 && (
          <div className="rounded-xl bg-slate-800 p-12 text-center">
            <p className="text-2xl text-slate-400">No se encontraron productos</p>
          </div>
        )}
      </div>
    </main>
  );
}