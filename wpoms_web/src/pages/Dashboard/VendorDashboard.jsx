import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Dashboard.css';
import DashboardTopbar from '../../components/DashboardTopbar';
import { profileService } from '../../services/profileService';
import { Logo } from '../../components/logo/Logo';
const VendorDashboardLayout = () => {
  const [userName, setUserName] = useState("Loading...");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/vendor') {
      return currentPath === '/vendor' || currentPath === '/vendor/';
    }
    return currentPath.startsWith(path);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const data = await profileService.getVendorProfile(userId);
          setUserName(data?.vendorName || "Vendor");
        }
      } catch (err) {
        setUserName("Vendor");
        return err;
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'overlay-open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <Logo />
        </div>
        <nav className="sidebar-nav">
          <Link className={`nav-item ${isActive('/vendor') ? 'nav-item-active' : ''}`} to="/vendor" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="dashboard">dashboard</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link className={`nav-item ${isActive('/vendor/staffs') ? 'nav-item-active' : ''}`} to="/vendor/staffs" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="badge">badge</span>
            <span className="nav-text">Staffs</span>
          </Link>
          <Link className={`nav-item ${isActive('/vendor/product-catalog') ? 'nav-item-active' : ''}`} to="/vendor/product-catalog" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="inventory_2">inventory_2</span>
            <span className="nav-text">Product Catalog</span>
          </Link>
          <a className="nav-item" href="#" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="verified_user">verified_user</span>
            <span className="nav-text">Warranties</span>
          </a>
          <Link className={`nav-item ${isActive('/vendor/my-orders') ? 'nav-item-active' : ''}`} to="/vendor/my-orders" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="shopping_cart">shopping_cart</span>
            <span className="nav-text">My Orders</span>
          </Link>
          {/* <a className="nav-item" href="#">
                <span className="material-symbols-outlined nav-icon" data-icon="inventory_2">inventory_2</span>
                <span className="nav-text">Archive</span>
              </a> */}
        </nav>

        <div className="sidebar-footer">
          <Link to="/vendor/profile" className="user-profile-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#CBD5E1' }}>account_circle</span>
            <div className="user-info">
              <p className="user-name">{userName}</p>
              <p className="user-role">Vendor</p>
            </div>
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <DashboardTopbar title="Vendor Dashboard" onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showCart={true} />

        <div className="dashboard-content">
          <Outlet />
        </div>

        <div className="dashboard-bg-glow"></div>
      </main>


    </div>
  );
};

export default VendorDashboardLayout;
