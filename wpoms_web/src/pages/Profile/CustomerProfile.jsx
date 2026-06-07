import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { profileService } from '../../services/profileService';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const customerSchema = z.object({
  customerName: z.string().min(1, 'Name is required'),
  phoneNo: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().optional().or(z.literal('')),
  contactPreference: z.string().optional().or(z.literal('')),
  shippingAddress: z.string().optional().or(z.literal('')),
});

const CustomerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
  });

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const data = await profileService.getCustomerProfile(userId);
        setProfileData(data);
        reset(data);
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
      await profileService.updateCustomer(userId, data);
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
                <h2 className="user-name-large">{profileData?.customerName || localStorage.getItem('username') || "Reshma M"}</h2>
                <span className="role-badge">Customer</span>
              </div>
              <p className="user-email">{profileData?.customerEmail || "reshma.m@example.com"}</p>
            </div>
          </section>

          {/* Settings Grid */}


          {/* Centered Column: Customer Info */}
          <div className="settings-card">
            <div className="card-header">
              <h3 className="card-title">Personal Information</h3>
              <span className="material-symbols-outlined card-icon">person</span>
            </div>

            <form className="settings-form" onSubmit={handleSubmit(handleSave)}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Customer Name</label>
                  <input className={`form-input ${errors.customerName ? 'error' : ''}`} {...register("customerName")} type="text" disabled={!isEditing} />
                  {errors.customerName && <span className="error-text">{errors.customerName.message}</span>}
                </div>

                <div className="form-group" style={{ visibility: 'hidden' }}>
                  {/* Empty space holder to maintain grid consistency, or you can adjust row styling */}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className={`form-input ${errors.phoneNo ? 'error' : ''}`} {...register("phoneNo")} type="tel" disabled={!isEditing} />
                  {errors.phoneNo && <span className="error-text">{errors.phoneNo.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className={`form-input ${errors.dateOfBirth ? 'error' : ''}`} {...register("dateOfBirth")} type="date" disabled={!isEditing} />
                  {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth.message}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Preference</label>
                <input className={`form-input ${errors.contactPreference ? 'error' : ''}`} {...register("contactPreference")} type="text" disabled={!isEditing} />
                {errors.contactPreference && <span className="error-text">{errors.contactPreference.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Shipping Address</label>
                <textarea className={`form-input form-textarea ${errors.shippingAddress ? 'error' : ''}`} {...register("shippingAddress")} rows="3" disabled={!isEditing}></textarea>
                {errors.shippingAddress && <span className="error-text">{errors.shippingAddress.message}</span>}
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

export default CustomerProfile;
