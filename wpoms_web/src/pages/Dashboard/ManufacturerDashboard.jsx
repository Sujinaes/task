import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { LogoWithoutSubtitle as Logo } from '../../components/logo/Logo';
import DashboardTopbar from '../../components/DashboardTopbar';
import { profileService } from '../../services/profileService';


const ManufacturerDashboardLayout = () => {
  const [userName, setUserName] = useState("Loading...");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    if (path === '/manufacturer') {
      return currentPath === '/manufacturer' || currentPath === '/manufacturer/';
    }
    return currentPath.startsWith(path);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const data = await profileService.getManufacturerProfile(userId);
          setUserName(data?.companyName || "Manufacturer");
        }
      } catch (err) {
        setUserName("Manufacturer");
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
          <Link className={`nav-item ${isActive('/manufacturer') ? 'nav-item-active' : ''}`} to="/manufacturer" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="dashboard">dashboard</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link className={`nav-item ${isActive('/manufacturer/staffs') ? 'nav-item-active' : ''}`} to="/manufacturer/staffs" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="badge">badge</span>
            <span className="nav-text">Staffs</span>
          </Link>
          <Link className={`nav-item ${isActive('/manufacturer/product-catalog') ? 'nav-item-active' : ''}`} to="/manufacturer/product-catalog" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="inventory_2">inventory_2</span>
            <span className="nav-text">Product Catalog</span>
          </Link>
          <a className="nav-item" href="#" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="verified_user">verified_user</span>
            <span className="nav-text">Warranties</span>
          </a>
          <Link className={`nav-item ${isActive('/manufacturer/orders') ? 'nav-item-active' : ''}`} to="/manufacturer/orders" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined nav-icon" data-icon="shopping_cart">shopping_cart</span>
            <span className="nav-text">Purchase Orders</span>
          </Link>
          {/* <a className="nav-item" href="#">
            <span className="material-symbols-outlined nav-icon" data-icon="inventory_2">inventory_2</span>
            <span className="nav-text">Archive</span>
          </a> */}
        </nav>

        <div className="sidebar-footer">
          <Link to="/manufacturer/profile" className="user-profile-link" onClick={() => setIsSidebarOpen(false)}>
            <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: '#CBD5E1' }}>account_circle</span>
            <div className="user-info">
              <p className="user-name">{userName}</p>
              <p className="user-role">Manufacturer</p>
            </div>
          </Link>
        </div>
      </aside>

      <main className="dashboard-main">
        <DashboardTopbar title="Manufacturer Dashboard" onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="dashboard-content">
          <Outlet />
        </div>

        <div className="dashboard-bg-glow"></div>
      </main>


    </div>
  );
};

export default ManufacturerDashboardLayout;
