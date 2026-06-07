import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { profileService } from '../../services/profileService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const vendorSchema = z.object({
  vendorName: z.string().min(1, 'Vendor Name is required'),
  vendorEmail: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  gstNumber: z.string().min(1, 'GST Number is required'),
  address: z.string().optional().or(z.literal('')),
});

const VendorProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorSchema),
  });

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const data = await profileService.getVendorProfile(userId);
        setProfileData(data);
        reset(data);
      } else {
        toast.error("You are not logged in");
        navigate("/login");
      }
    } catch (err) {
      return err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (data) => {
    try {
      const userId = localStorage.getItem('userId');
      await profileService.updateVendor(userId, data);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
      return err;
    }
  };


  if (loading) {
    return <div className="profile-wrapper"><div className="profile-main"><div className="profile-container" style={{ padding: '2rem' }}>Loading profile...</div></div></div>;
  }

  return (
    <div className="profile-wrapper">


      {/* Main Content Canvas */}
      <main className="profile-main">
        <div className="profile-container">

          {/* User Hero Section */}
          <section className="hero-section">
            <div className="avatar-wrapper">
              <div className="user-avatar-large gold-gradient">
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#fff' }}>account_circle</span>
              </div>
            </div>

            <div className="hero-info">
              <div className="hero-title-row">
                <h2 className="user-name-large">{profileData?.vendorName || localStorage.getItem('username') || "Rahul Kumar"}</h2>
                <span className="role-badge">Vendor</span>
              </div>
              <p className="user-email">{profileData?.vendorEmail || "vendor@alliance.com"}</p>
            </div>
          </section>
          {/* Vendor Info */}
          <div className="settings-card">
            <div className="card-header">
              <h3 className="card-title">Vendor Information</h3>
              <span className="material-symbols-outlined card-icon">local_shipping</span>
            </div>

            <form className="settings-form" onSubmit={handleSubmit(handleSave)}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Vendor Name</label>
                  <input className={`form-input ${errors.vendorName ? 'error' : ''}`} {...register("vendorName")} type="text" disabled={!isEditing} />
                  {errors.vendorName && <span className="error-text">{errors.vendorName.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Vendor Email</label>
                  <input className={`form-input ${errors.vendorEmail ? 'error' : ''}`} {...register("vendorEmail")} type="email" disabled={!isEditing} />
                  {errors.vendorEmail && <span className="error-text">{errors.vendorEmail.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className={`form-input ${errors.phone ? 'error' : ''}`} {...register("phone")} type="tel" disabled={!isEditing} />
                  {errors.phone && <span className="error-text">{errors.phone.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input className={`form-input ${errors.gstNumber ? 'error' : ''}`} {...register("gstNumber")} type="text" disabled={!isEditing} />
                  {errors.gstNumber && <span className="error-text">{errors.gstNumber.message}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className={`form-input form-textarea ${errors.address ? 'error' : ''}`} {...register("address")} rows="3" disabled={!isEditing}></textarea>
                {errors.address && <span className="error-text">{errors.address.message}</span>}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {!isEditing ? (
                  <button className="btn-save gold-gradient" type="button" onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                ) : (
                  <>
                    <button className="btn-save gold-gradient" style={{ background: '#666', flex: 1 }} type="button" onClick={() => { setIsEditing(false); reset(profileData); }}>
                      Cancel
                    </button>
                    <button className="btn-save gold-gradient" type="submit" style={{ flex: 1 }}>
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default VendorProfile;
