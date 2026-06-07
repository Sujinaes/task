import React, { useState, useRef, useEffect } from 'react';

const REJECTION_REASONS = [
  'Out of Stock',
  'Pricing Issue',
  'Cannot Deliver on Time',
  'Invalid Request',
  'Others',
];


const RejectSection = ({ orderId, isOpen, onConfirm, onCancel, isSubmitting }) => {
  const [reason, setReason]       = useState('');
  const [customReason, setCustomReason] = useState('');
  const [error, setError]         = useState('');
  const contentRef                = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const isOther = reason === 'Others';

  // Re-measure height whenever anything that affects layout changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, error, reason, customReason]);

  // Reset form when section is closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setReason('');
        setCustomReason('');
        setError('');
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setCustomReason('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason) {
      setError('Please select a rejection reason.');
      return;
    }

    if (isOther && !customReason.trim()) {
      setError('Please enter the rejection reason');
      return;
    }

    setError('');
    const finalReason = isOther ? customReason.trim() : reason;
    onConfirm(finalReason);
  };

  return (
    <div
      className={`oa-expand-wrapper oa-expand-wrapper--reject ${isOpen ? 'oa-expand-wrapper--open' : ''}`}
      style={{ maxHeight: isOpen ? `${contentHeight + 40}px` : '0px' }}
    >
      <div className="oa-expand-section oa-expand-section--reject" ref={contentRef}>

        {/* Section Header */}
        <div className="oa-expand-section__header">
          <div className="oa-expand-section__icon-circle oa-expand-section__icon-circle--reject">
            <span className="material-symbols-outlined">cancel</span>
          </div>
          <div>
            <h3 className="oa-expand-section__title">Reject Order</h3>
            <p className="oa-expand-section__subtitle">
              Provide a reason for rejecting order <strong>{orderId}</strong>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="oa-expand-section__form">

          {/* Reason dropdown */}
          <label className="oa-expand-section__field">
            <span className="oa-expand-section__label">
              <span className="material-symbols-outlined">report</span>
              Rejection Reason <span className="oa-expand-section__required">*</span>
            </span>
            <select
              className={`oa-expand-section__input ${error && !reason ? 'oa-expand-section__input--error' : ''}`}
              value={reason}
              onChange={handleReasonChange}
              disabled={isSubmitting}
              id="reject-reason-select"
            >
              <option value="">— Select a reason —</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          {/* "Other" custom reason — slides in only when Other is selected */}
          <div className={`oa-other-reason-wrapper ${isOther ? 'oa-other-reason-wrapper--open' : ''}`}>
            <label className="oa-expand-section__field">
              <span className="oa-expand-section__label">
                <span className="material-symbols-outlined">edit_note</span>
                Specify Reason <span className="oa-expand-section__required">*</span>
              </span>
              <textarea
                className={`oa-expand-section__input oa-expand-section__input--textarea ${
                  error && isOther && !customReason.trim() ? 'oa-expand-section__input--error' : ''
                }`}
                value={customReason}
                onChange={(e) => { setCustomReason(e.target.value); setError(''); }}
                disabled={isSubmitting || !isOther}
                rows={3}
                placeholder="Enter rejection reason"
                id="reject-custom-reason-textarea"
              />
            </label>
          </div>

          {/* Inline error */}
          {error && (
            <span className="oa-expand-section__error">
              <span className="material-symbols-outlined">error</span>
              {error}
            </span>
          )}

          {/* Action buttons */}
          <div className="oa-expand-section__actions">
            <button
              type="button"
              className="oa-expand-section__btn oa-expand-section__btn--cancel"
              onClick={onCancel}
              disabled={isSubmitting}
              id="reject-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="oa-expand-section__btn oa-expand-section__btn--reject"
              disabled={isSubmitting}
              id="reject-confirm-btn"
            >
              {isSubmitting ? (
                <>
                  <span className="oa-expand-section__spinner" />
                  Processing…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">close</span>
                  Confirm Reject
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RejectSection;
