import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { profileService } from '../../services/profileService';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const manufacturerSchema = z.object({
  companyName: z.string().min(1, 'Company Name is required'),
  companyEmail: z.string().email('Invalid email address'),
  companyPhone: z.string().min(10, 'Phone must be at least 10 characters'),
  gstNumber: z.string().min(1, 'GST Number is required'),
  companyAddress: z.string().optional().or(z.literal('')),
});

const ManufacturerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(manufacturerSchema),
  });

  const fetchProfile = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const data = await profileService.getManufacturerProfile(userId);
        data.companyPhone = data.phone;
        data.companyAddress = data.address;
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
      await profileService.updateManufacturer(userId, data);
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
                <h2 className="user-name-large">{profileData?.companyName || localStorage.getItem('username') || "Manufacturer Enterprises"}</h2>
                <span className="role-badge">Manufacturer</span>
              </div>
              <p className="user-email">{profileData?.companyEmail || "contact@manufacturer.com"}</p>
            </div>
          </section>


          {/* Company Info */}
          <div className="settings-card">
            <div className="card-header">
              <h3 className="card-title">Company Information</h3>
              <span className="material-symbols-outlined card-icon">store</span>
            </div>

            <form className="settings-form" onSubmit={handleSubmit(handleSave)}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input className={`form-input ${errors.companyName ? 'error' : ''}`} {...register("companyName")} type="text" disabled={!isEditing} />
                  {errors.companyName && <span className="error-text">{errors.companyName.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Company Email</label>
                  <input className={`form-input ${errors.companyEmail ? 'error' : ''}`} {...register("companyEmail")} type="email" disabled={!isEditing} />
                  {errors.companyEmail && <span className="error-text">{errors.companyEmail.message}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Phone</label>
                  <input className={`form-input ${errors.companyPhone ? 'error' : ''}`} {...register("companyPhone")} type="tel" disabled={!isEditing} />
                  {errors.companyPhone && <span className="error-text">{errors.companyPhone.message}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input className={`form-input ${errors.gstNumber ? 'error' : ''}`} {...register("gstNumber")} type="text" disabled={!isEditing} />
                  {errors.gstNumber && <span className="error-text">{errors.gstNumber.message}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company Address</label>
                <textarea className={`form-input form-textarea ${errors.companyAddress ? 'error' : ''}`} {...register("companyAddress")} rows="3" disabled={!isEditing}></textarea>
                {errors.companyAddress && <span className="error-text">{errors.companyAddress.message}</span>}
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

export default ManufacturerProfile;
