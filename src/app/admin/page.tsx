'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus, 
  AlertCircle,
  Eye,
  DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentOrders: any[];
  topProducts: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    recentOrders: [],
    topProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Pour l'instant, on simule des données
      // Plus tard, ces données viendront de vraies APIs
      setStats({
        totalProducts: 45,
        totalOrders: 127,
        totalCustomers: 89,
        totalRevenue: 28950,
        lowStockProducts: 3,
        recentOrders: [
          { id: '1', customer: 'Marie Dubois', total: 229, status: 'pending' },
          { id: '2', customer: 'Jean Martin', total: 245, status: 'completed' },
          { id: '3', customer: 'Sophie Laurent', total: 215, status: 'shipped' }
        ],
        topProducts: [
          { name: 'ABYSS', sales: 23, revenue: 5267 },
          { name: 'ETHEREA', sales: 18, revenue: 4122 },
          { name: 'SHIMMER', sales: 15, revenue: 3435 }
        ]
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products'
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      href: '/admin/orders'
    },
    {
      title: 'Clients',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/customers'
    },
    {
      title: 'Revenus',
      value: `${stats.totalRevenue.toLocaleString()}€`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      href: '/admin/analytics'
    }
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 h-32 bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de votre boutique LUJIA</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Ajouter un produit
          </Link>
        </div>
      </div>

      {/* Alertes */}
      {stats.lowStockProducts > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="text-orange-500 mr-3" size={20} />
            <div>
              <h3 className="font-medium text-orange-800">Stock faible</h3>
              <p className="text-orange-700 text-sm">
                {stats.lowStockProducts} produit{stats.lowStockProducts > 1 ? 's' : ''} avec un stock faible
              </p>
            </div>
            <Link
              href="/admin/products?filter=low-stock"
              className="ml-auto text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              Voir →
            </Link>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href}>
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                <div className="flex items-center">
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Commandes récentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Commandes récentes</h2>
              <Link
                href="/admin/orders"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir tout →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">Commande #{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.total}€</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status === 'completed' ? 'Terminée' :
                       order.status === 'shipped' ? 'Expédiée' : 'En attente'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top produits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Produits populaires</h2>
              <Link
                href="/admin/analytics"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Analytics →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.topProducts.map((product, index) => (
              <div key={product.name} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{product.revenue.toLocaleString()}€</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <Plus size={20} className="text-gray-400 mr-3" />
            <span className="text-gray-600">Nouveau produit</span>
          </Link>
          
          <Link
            href="/admin/products?filter=low-stock"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <AlertCircle size={20} className="text-gray-400 mr-3" />
            <span className="text-gray-600">Stock faible</span>
          </Link>
          
          <Link
            href="/admin/orders?status=pending"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <ShoppingCart size={20} className="text-gray-400 mr-3" />
            <span className="text-gray-600">Commandes en attente</span>
          </Link>
          
          <Link
            href="/admin/analytics"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <TrendingUp size={20} className="text-gray-400 mr-3" />
            <span className="text-gray-600">Voir les stats</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
