import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Lock, AtSign, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { authService } from '../../services/authService';
import styles from './Login.module.css';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await authService.loginUser({
        email: data.email,
        password: data.password
      });

      const userRole = result?.role?.toLowerCase() || result?.user?.role?.toLowerCase() || 'manufacturer';

      if (result && result.id) {
        localStorage.setItem('userId', result.id);
        localStorage.setItem('roleId', result.roleId);
      } else if (result && result.userId) {
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('roleId', result.roleId);
      } else if (result && result.user && result.user.id) {
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('roleId', result.roleId);
      }

      // Store JWT Token
      const token = result?.token || result?.jwt || result?.accessToken;
      if (token) {
        localStorage.setItem('jwtToken', token);
      } else {
        throw new Error('Authentication failed: No valid token received from server');
      }

      // Store the user role inside localStorage
      if (userRole) {
        localStorage.setItem('role', userRole);
      }

      // Store the username / email
      const username = result?.username || result?.name || result?.user?.username || result?.user?.name || data.email;
      if (username) {
        localStorage.setItem('username', username);
      }

      navigate(`/${userRole}`);
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  const features = [
    {
      icon: <ShieldCheck size={22} />,
      title: 'Real-time tracking',
      desc: 'Track all purchased items and their warranty status in real time.',
    },
    {
      icon: <RefreshCw size={22} />,
      title: 'Automated workflows',
      desc: 'Notifications for order updates and approvals.',
    },
    
    {
      icon: <Lock size={22} />,
      title: 'Secure management',
      desc: 'Keeps all purchase and warranty data safe.',
    },
  ];

  return (
    <main className={styles.loginPage}>
      {/* ── Left: Branding Panel ── */}
      <section className={styles.brandingPanel}>
        <div className={styles.decorativeCircle1} />
        <div className={styles.decorativeCircle2} />

        <div className={styles.brandingContent}>
          {/* Logo */}
          <div className={styles.logoRow}>
            <div className={styles.logoMark}>
              <span className={styles.logoLetter}>W</span>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>WPOMS</span>
              <span className={styles.logoSubtitle}>Enterprise Management</span>
            </div>
          </div>

          {/* Headline */}
          <h2 className={styles.headline}>
            Warranty &amp; Purchase Order Management System
          </h2>

          {/* Feature bullets */}
          <ul className={styles.featureList}>
            {features.map((f, i) => (
              <li key={i} className={styles.featureItem}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <h3 className={styles.featureItemTitle}>{f.title}</h3>
                  <p className={styles.featureItemDesc}>{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Branding footer */}
        <div className={styles.brandingFooter}>
          <div className={styles.goldDivider} />
          <p className={styles.brandingTagline}>
            Making warranty and purchase data easy to store, track, and manage.
          </p>
        </div>
      </section>

      {/* ── Right: Form Panel ── */}
      <section className={styles.formPanel}>
        <div className={styles.formInner}>
          <header className={styles.formHeader}>
            <h1 className={styles.formTitle}>Welcome Back</h1>
            <p className={styles.formSubtitle}>
              Please enter your credentials to access the archive.
            </p>
          </header>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email Address
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                 
                  
                  {...register('email')}
                  autoComplete="email"
                />
                <span className={styles.inputIcon}>
                  <AtSign size={18} />
                </span>
              </div>
              {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">
                  Security Password
                </label>
                <a href="#" className={styles.forgotLink}>
                  Forgot Password?
                </a>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.input}
                  
                  {...register('password')}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.toggleBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
            </div>





            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <footer className={styles.formFooter}>
            <p className={styles.footerText}>
              Don&apos;t have an account?
              <Link to="/register" className={styles.footerLink}>
                Register here
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Login;
