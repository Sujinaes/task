import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  return (
    <div className="profile-wrapper">
      {/* SideNavBar Component */}
      <aside className="profile-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">WPOMS</h1>
          <p className="sidebar-subtitle">Enterprise Management</p>
        </div>

        <nav className="sidebar-nav">
          <Link className="nav-item" to="/dashboard">
            <span className="material-symbols-outlined nav-icon">dashboard</span>
            <span className="nav-text">Dashboard</span>
          </Link>
          <a className="nav-item" href="#">
            <span className="material-symbols-outlined nav-icon">verified_user</span>
            <span className="nav-text">Warranties</span>
          </a>
          <a className="nav-item" href="#">
            <span className="material-symbols-outlined nav-icon">shopping_cart</span>
            <span className="nav-text">Purchase Orders</span>
          </a>
          <a className="nav-item" href="#">
            <span className="material-symbols-outlined nav-icon">inventory_2</span>
            <span className="nav-text">Archive</span>
          </a>
          <a className="nav-item" href="#">
            <span className="material-symbols-outlined nav-icon">settings</span>
            <span className="nav-text">Settings</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <Link className="nav-item nav-item-active" to="/profile">
            <span className="material-symbols-outlined nav-icon" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
            <span className="nav-text">User Profile</span>
          </Link>
        </div>
      </aside>

      {/* TopAppBar Component */}
      <header className="profile-topbar">
        <div className="topbar-left">
          <div className="search-box">
            <span className="material-symbols-outlined search-icon">search</span>
            <input className="search-input" placeholder="Search archive..." type="text" />
          </div>
        </div>
        <div className="topbar-right">
          <div className="topbar-actions">
            <button className="action-btn"><span className="material-symbols-outlined">notifications</span></button>
            <button className="action-btn"><span className="material-symbols-outlined">help_outline</span></button>
          </div>
          <button className="btn-create-new gold-gradient">
            Create New
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="profile-main">
        <div className="profile-container">

          {/* User Hero Section */}
          <section className="hero-section">
            <div className="avatar-wrapper">
              <div className="user-avatar-large gold-gradient">
                AM
              </div>
              <button className="btn-edit-avatar">
                <span className="material-symbols-outlined icon-small">edit</span>
              </button>
            </div>

            <div className="hero-info">
              <div className="hero-title-row">
                <h2 className="user-name-large">Alexander Mercer</h2>
                <span className="role-badge">
                  Manufacturer
                </span>
              </div>
              <p className="user-email">a.mercer@wpoms-enterprise.com</p>

              <button className="btn-link">
                Edit Avatar
                <span className="material-symbols-outlined icon-small">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Settings Grid */}
          <div className="settings-grid">

            {/* Left Column: Personal Info */}
            <div className="settings-card">
              <div className="card-header">
                <h3 className="card-title">Personal Information</h3>
                <span className="material-symbols-outlined card-icon">person</span>
              </div>

              <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" type="text" defaultValue="Alexander" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" type="text" defaultValue="Mercer" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" defaultValue="a.mercer@wpoms-enterprise.com" />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" defaultValue="+1 (555) 012-3456" />
                </div>

                <div className="form-group">
                  <label className="form-label">Corporate Address</label>
                  <textarea className="form-input form-textarea" rows="3" defaultValue="1200 Industrial Way, Suite 400&#13;&#10;New York, NY 10001"></textarea>
                </div>

                <button className="btn-save gold-gradient" type="button">
                  Save Changes
                </button>
              </form>
            </div>


          </div>

          {/* Background Decoration */}
          <div className="bg-decoration">
            <span className="decoration-text">ARCHIVE</span>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Profile;
