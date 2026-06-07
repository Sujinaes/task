import React, { useState, useEffect, useCallback } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { vendorService } from '../services/vendorService';

const DashboardTopbar = ({ title, onToggleSidebar, showCart }) => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    if (!showCart) return;
    try {
      const cart = await vendorService.getCart();
      let cartArray = [];
      if (Array.isArray(cart)) {
        cartArray = cart;
      } else if (cart && Array.isArray(cart.items)) {
        cartArray = cart.items;
      } else if (cart && Array.isArray(cart.cartItems)) {
        cartArray = cart.cartItems;
      } else if (cart && Array.isArray(cart.data)) {
        cartArray = cart.data;
      }
      const total = cartArray.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);
    } catch (err) {
      console.error('Failed to fetch cart count', err);
    }
  }, [showCart]);

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [fetchCartCount]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={onToggleSidebar}
          className="hamburger-btn"
          aria-label="Toggle Navigation"
        >
          <Menu size={24} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {showCart && (
          <Link 
            to="/vendor/cart" 
            className="action-btn cart-btn" 
            style={{ 
              background: '#0D1E33',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#e5c363',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '0.5rem',
              position: 'relative',
            }}
            title="View Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'linear-gradient(135deg, #e5c363, #d4a51a)',
                color: '#0D1E33',
                fontSize: '0.65rem',
                fontWeight: 800,
                minWidth: '18px',
                height: '18px',
                borderRadius: '99px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 2px 6px rgba(229,195,99,0.4)',
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {/* Logout Button */}
        <button 
          onClick={handleLogoutClick} 
          className="action-btn" 
          style={{ 
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(13, 30, 51, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          padding: '4.5rem 2.5rem 0 0',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '250px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            fontFamily: "var(--font-body, 'Outfit', sans-serif)"
          }}>
            <p style={{
              color: '#0f172a',
              fontSize: '0.875rem',
              fontWeight: 500,
              margin: '0 0 1rem'
            }}>
              Are you sure want to logout
            </p>
            
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              <button 
                onClick={confirmLogout}
                style={{
                  padding: '0.5rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Yes
              </button>
              <button 
                onClick={cancelLogout}
                style={{
                  padding: '0.5rem 1.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.25rem',
                  background: 'transparent',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardTopbar;
