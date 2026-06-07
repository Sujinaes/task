import React, { useState, useRef, useEffect } from 'react';

const AcceptSection = ({ orderId, isOpen, onConfirm, onCancel, isSubmitting }) => {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [error, setError] = useState('');
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Tomorrow as the minimum selectable date
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Measure content height whenever open state or error changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, error]);

  // Reset form when section is closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setDeliveryDate('');
        setError('');
      }, 350); // Wait for collapse animation to finish
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!deliveryDate) {
      setError('Please select a delivery date.');
      return;
    }

    const selected = new Date(deliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected <= today) {
      setError('Delivery date must be a future date.');
      return;
    }

    setError('');
    onConfirm(deliveryDate);
  };

  return (
    <div
      className={`oa-expand-wrapper oa-expand-wrapper--accept ${isOpen ? 'oa-expand-wrapper--open' : ''}`}
      style={{ maxHeight: isOpen ? `${contentHeight + 40}px` : '0px' }}
    >
      <div className="oa-expand-section oa-expand-section--accept" ref={contentRef}>
        {/* Section Header */}
        <div className="oa-expand-section__header">
          <div className="oa-expand-section__icon-circle oa-expand-section__icon-circle--accept">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div>
            <h3 className="oa-expand-section__title">Accept Order</h3>
            <p className="oa-expand-section__subtitle">
              Set a delivery date for order <strong>{orderId}</strong>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="oa-expand-section__form">
          <label className="oa-expand-section__field">
            <span className="oa-expand-section__label">
              <span className="material-symbols-outlined">calendar_month</span>
              Delivery Date <span className="oa-expand-section__required">*</span>
            </span>
            <input
              type="date"
              className={`oa-expand-section__input ${error ? 'oa-expand-section__input--error' : ''}`}
              value={deliveryDate}
              onChange={(e) => { setDeliveryDate(e.target.value); setError(''); }}
              min={getMinDate()}
              disabled={isSubmitting}
              id="accept-delivery-date"
            />
            {error && (
              <span className="oa-expand-section__error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </span>
            )}
          </label>

          <div className="oa-expand-section__actions">
            <button
              type="button"
              className="oa-expand-section__btn oa-expand-section__btn--cancel"
              onClick={onCancel}
              disabled={isSubmitting}
              id="accept-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="oa-expand-section__btn oa-expand-section__btn--accept"
              disabled={isSubmitting}
              id="accept-confirm-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="oa-expand-section__spinner" />
                  Processing…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">check</span>
                  Confirm Accept
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptSection;
