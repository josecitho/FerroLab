"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function HomePage() {
  const { data: productos, isLoading: loadingProductos } =
    api.producto.getActivos.useQuery();
  const { data: categorias, isLoading: loadingCategorias } =
    api.categoria.getAll.useQuery();

  // Productos con stock bajo
  const productosStockBajo =
    productos?.filter((p) => p.stock <= p.stockMinimo) || [];

  // Estadísticas
  const totalProductos = productos?.length || 0;
  const valorInventario =
    productos?.reduce((acc, p) => acc + p.precio * p.stock, 0) || 0;
  const totalCategorias = categorias?.length || 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                🔨 <span className="text-blue-400">Ferro</span>Lab
              </h1>
              <p className="text-slate-400">Sistema de Inventario Inteligente</p>
            </div>
            <nav className="flex gap-4">
              <Link
                href="/productos"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Productos
              </Link>
              <Link
                href="/categorias"
                className="rounded-lg bg-slate-700 px-6 py-3 font-semibold text-white transition hover:bg-slate-600"
              >
                Categorías
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Estadísticas */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Productos</p>
                <p className="text-4xl font-bold">
                  {loadingProductos ? "..." : totalProductos}
                </p>
              </div>
              <div className="text-5xl opacity-50">📦</div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Valor Inventario</p>
                <p className="text-4xl font-bold">
                  {loadingProductos
                    ? "..."
                    : `$${valorInventario.toLocaleString()}`}
                </p>
              </div>
              <div className="text-5xl opacity-50">💰</div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Categorías</p>
                <p className="text-4xl font-bold">
                  {loadingCategorias ? "..." : totalCategorias}
                </p>
              </div>
              <div className="text-5xl opacity-50">📁</div>
            </div>
          </div>
        </div>

        {/* Alertas de Stock Bajo */}
        {productosStockBajo.length > 0 && (
          <div className="mb-8 rounded-xl border-2 border-red-500 bg-red-950/30 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <div>
                <h2 className="text-2xl font-bold text-red-400">
                  Alerta de Stock Bajo
                </h2>
                <p className="text-red-300">
                  {productosStockBajo.length} producto(s) necesitan reposición
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {productosStockBajo.slice(0, 5).map((producto) => (
                <div
                  key={producto.id}
                  className="flex items-center justify-between rounded-lg bg-red-900/30 p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{producto.nombre}</p>
                    <p className="text-sm text-red-300">
                      {producto.categoria.nombre}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-400">
                      {producto.stock}
                    </p>
                    <p className="text-xs text-red-300">
                      mín: {producto.stockMinimo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Productos Recientes */}
        <div className="rounded-xl bg-slate-800/50 p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Productos Recientes
            </h2>
            <Link
              href="/productos"
              className="text-blue-400 hover:text-blue-300"
            >
              Ver todos →
            </Link>
          </div>

          {loadingProductos ? (
            <div className="text-center text-slate-400">Cargando...</div>
          ) : productos && productos.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productos.slice(0, 6).map((producto) => (
                <div
                  key={producto.id}
                  className="rounded-lg bg-slate-700/50 p-4 transition hover:bg-slate-700"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {producto.nombre}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {producto.categoria.nombre}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        producto.stock <= producto.stockMinimo
                          ? "bg-red-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      Stock: {producto.stock}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-blue-400">
                      ${producto.precio.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-slate-400">
                No hay productos registrados aún
              </p>
              <Link
                href="/productos"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Agregar primer producto
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
