import React from 'react';

const ProductDetailsModal = ({ product, onClose, onEdit }) => {
  if (!product) return null;

  const isActive = product.is_active !== undefined ? product.is_active : true;

  return (
    <div className="product-modal-overlay product-details-modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="product-modal product-details-modal" onClick={(e) => e.stopPropagation()} style={{ padding: '1.5rem 1.75rem' }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{product?.name || 'N/A'}</h3>
              <span
                className={`product-status-badge-modal ${isActive ? 'product-status-active' : 'product-status-inactive'}`}
              >
                <span className="product-status-dot"></span>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #b88f02 0%, #d4a51a 100%)',
              color: 'white',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              letterSpacing: '0.02em',
            }}>
              {product?.category || 'N/A'}
            </span>
          </div>
          <button
            onClick={() => {
              onClose();
              if (onEdit) onEdit(product);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#b88f02',
              padding: '0.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              marginLeft: '0.75rem',
              transition: 'color 0.2s',
            }}
            title="Edit Product"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>edit</span>
          </button>
        </div>

        {/* Details card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #f1f5f9',
          padding: '1rem 1.25rem',
        }}>
          {/* Row 1: Product ID + Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product ID</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', fontWeight: 600, color: '#745b00' }}>{product?.id || 'N/A'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Price</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{"₹"+product?.price || 'N/A'}</p>
            </div>
          </div>

          {/* Row 2: Warranty Type + Quantity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Warranty Type</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', fontWeight: 500, color: '#0f172a' }}>{product?.warranty || 'N/A'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quantity</span>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', fontWeight: 500, color: '#0f172a' }}>{product?.quantity ?? '0'}</p>
            </div>
          </div>

          {/* Row 3: Description */}
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Description</span>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#475569', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {product?.description || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
