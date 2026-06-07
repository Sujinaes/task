import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { toast } from 'sonner';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="product-page">
        <div className="product-page-header">
          <div>
            <h2>Product Details</h2>
          </div>
        </div>
        <div className="empty-row" style={{ marginTop: '2rem' }}>
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-page-header">
          <div>
            <h2>Product Details</h2>
          </div>
          <button className="btn-add-product" onClick={() => navigate(-1)} style={{ background: 'var(--text-color, #4a5568)' }}>
            Back
          </button>
        </div>
        <div className="empty-row" style={{ marginTop: '2rem' }}>
          Product not found.
        </div>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="product-page-header">
        <div>
          <h2>Product Details</h2>
          <p>Detailed view of product information.</p>
        </div>
        <button className="btn-add-product" onClick={() => navigate(-1)} style={{ background: 'var(--text-color, #b88f02)' }}>
          Back to Catalog
        </button>
      </div>

      <div className="product-details-card" style={{
        background: 'var(--surface-color, #fff)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        marginTop: '2rem',
        border: '1px solid var(--border-color, #e2e8f0)',
        maxWidth: '800px'
      }}>
        <div style={{ borderBottom: '1px solid var(--border-color, #e2e8f0)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color, #1a202c)', marginBottom: '0.5rem' }}>{product?.name || 'N/A'}</h3>
          <span style={{
            display: 'inline-block',
            background: 'var(--primary-color, #b88f02)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {product?.category || 'N/A'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted, #718096)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Product ID</h4>
            <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-color, #1a202c)' }}>{product?.id || 'N/A'}</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted, #718096)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Price</h4>
            <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-color, #1a202c)' }}>{product?.price || 'N/A'}</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted, #718096)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Quantity</h4>
            <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-color, #1a202c)' }}>{product?.quantity ?? '0'}</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', color: 'var(--text-muted, #718096)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Warranty Type</h4>
            <p style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-color, #1a202c)' }}>{product?.warranty || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'var(--text-color, #1a202c)', marginBottom: '0.75rem' }}>Description</h4>
          <p style={{ color: 'var(--text-secondary, #4a5568)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {product?.description || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
