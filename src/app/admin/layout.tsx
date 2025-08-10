'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus,
  TrendingUp
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Vérifier l'authentification admin
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (data.success && data.data.isOptician) {
        setIsAuthenticated(true);
        setUser(data.data);
      } else {
        router.push('/account?redirect=/admin');
      }
    } catch (error) {
      console.error('Erreur auth:', error);
      router.push('/account?redirect=/admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  };

  const menuItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Vue d\'ensemble'
    },
    {
      href: '/admin/products',
      label: 'Produits',
      icon: Package,
      description: 'Gestion catalogue'
    },
    {
      href: '/admin/orders',
      label: 'Commandes',
      icon: ShoppingCart,
      description: 'Suivi commandes'
    },
    {
      href: '/admin/customers',
      label: 'Clients',
      icon: Users,
      description: 'Base clients'
    },
    {
      href: '/admin/analytics',
      label: 'Analytics',
      icon: TrendingUp,
      description: 'Statistiques'
    },
    {
      href: '/admin/settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect en cours
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LUJIA</h1>
              <p className="text-sm text-gray-500">Admin Panel</p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={20} className="mr-3" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
              <Users size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-gray-500">Administrateur</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Admin LUJIA</h1>
            <div></div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
