import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Home, PhoneCall, ShoppingBag, ShoppingCart, Settings, HelpCircle } from 'lucide-react';
import { getCart } from '@/services/cartClient';

interface MobileBottomNavProps {
  storefront?: boolean;
}

export function MobileBottomNav({ storefront = false }: MobileBottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    getCart()
      .then((c) => {
        if (c?.items) {
          const total = c.items.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      })
      .catch(() => setCartCount(0));
  }, [location.pathname]);

  const navItems = storefront
    ? [
        { path: '/', label: 'الرئيسية', icon: Home },
        { path: '/products', label: 'المنتجات', icon: ShoppingBag },
        { path: '/education', label: 'الإرشادات', icon: BookOpen },
        { path: '/cart', label: 'السلة', icon: ShoppingCart, badge: cartCount },
        { path: 'tel:+967712275038', label: 'اتصال', icon: PhoneCall, external: true },
      ]
    : [
        { path: '/', label: 'الرئيسية', icon: Home },
        { path: '/products', label: 'المنتجات', icon: ShoppingBag },
        { path: '/cart', label: 'السلة', icon: ShoppingCart, badge: cartCount },
        { path: '/settings', label: 'الإعدادات', icon: Settings },
        { path: '/support', label: 'الدعم', icon: HelpCircle },
      ];

  return (
    <nav
      aria-label="التنقل السريع للهاتف"
      className="fixed inset-x-0 bottom-0 z-40 flex w-full max-w-full items-center justify-around overflow-x-hidden border-t border-[var(--gs-border)] bg-[var(--gs-surface)]/95 px-1 py-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur-md lg:hidden"
      dir="rtl"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

        return (
          <button
            key={item.path}
            aria-label={item.label}
            type="button"
            onClick={() => {
              if (item.external) {
                window.location.href = item.path;
                return;
              }
              navigate(item.path);
            }}
            className={`relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1.5 min-h-[48px] transition-all touch-manipulation ${
              isActive
                ? 'text-emerald-600 font-bold bg-emerald-500/10'
                : 'text-[var(--gs-foreground-secondary)] hover:text-[var(--gs-foreground)]'
            }`}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {Boolean(item.badge && item.badge > 0) && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white shadow-sm">
                  {item.badge! > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
