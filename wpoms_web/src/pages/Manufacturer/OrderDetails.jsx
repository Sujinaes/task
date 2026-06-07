import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import OrderInfoCard from '../../components/purchaseOrder/OrderInfoCard';
import ProductTable from '../../components/purchaseOrder/ProductTable';
import OrderActionPanel from '../../components/purchaseOrder/OrderActionPanel';
import './OrderDetails.css';
import { convertPoNumberToId } from '../../components/purchaseOrder/list/OrderRow';


/* ─────────────────────────────────────────────────────────────
   Page Component
   ───────────────────────────────────────────────────────────── */
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ── Fetch single order ── */
  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await purchaseOrderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order:', err.message);
      setError(err.message || 'Failed to load order details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  /* ── Accept handler ── */
  const handleAccept = async (deliveryDate) => {
    try {
      setIsSubmitting(true);
      let orderId = convertPoNumberToId(order.poNumber)
      await purchaseOrderService.acceptOrder(orderId, deliveryDate);
      setOrder((prev) => ({ ...prev, status: 'ACCEPTED', deliveryDate }));
      toast.success('Purchase Order Accepted Successfully', { duration: 4000 });
    } catch (err) {
      toast.error(err.message || 'Failed to accept order');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Reject handler ── */
  const handleReject = async (reason) => {
    try {
      setIsSubmitting(true);
      let orderId = convertPoNumberToId(order.poNumber)
      console.log("order id from order rows.jsx : handleReject", orderId)
      await purchaseOrderService.rejectOrder(orderId, reason);
      setOrder((prev) => ({ ...prev, status: 'REJECTED', rejectionReason: reason }));
      toast.error('Purchase Order Rejected Successfully', { duration: 4000 });
    } catch (err) {
      toast.error(err.message || 'Failed to reject order');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════
     LOADING SKELETON
     ═══════════════════════════════════════════════════════════ */
  if (isLoading) {
    return (
      <div className="order-details-page">
        <div className="od-skeleton-header">
          <div className="od-skeleton od-skeleton--title" />
          <div className="od-skeleton od-skeleton--badge" />
        </div>
        <div className="od-skeleton-card">
          <div className="od-skeleton od-skeleton--line od-skeleton--w60" />
          <div className="od-skeleton od-skeleton--line od-skeleton--w80" />
          <div className="od-skeleton od-skeleton--line od-skeleton--w40" />
          <div className="od-skeleton od-skeleton--line od-skeleton--w70" />
        </div>
        <div className="od-skeleton-card">
          <div className="od-skeleton od-skeleton--line od-skeleton--w100" />
          <div className="od-skeleton od-skeleton--line od-skeleton--w100" />
          <div className="od-skeleton od-skeleton--line od-skeleton--w50" />
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     ERROR / EMPTY STATE
     ═══════════════════════════════════════════════════════════ */
  if (error || !order) {
    return (
      <div className="order-details-page">
        <div className="od-empty-state">
          <span className="material-symbols-outlined od-empty-state__icon">search_off</span>
          <h2>Order Not Found</h2>
          <p>{error || "The order you're looking for doesn't exist or may have been removed."}</p>
          <button className="od-empty-state__btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <div className="order-details-page">

      {/* ── Page Header ── */}
      <div className="od-page-header">
        <button className="od-back-btn" onClick={() => navigate(-1)} title="Go back">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="od-page-header__text">
          <h1 className="od-page-title">Order Review</h1>
          <p className="od-page-subtitle">
            Review and manage purchase order <strong>{order.orderId}</strong>
          </p>
        </div>
      </div>

      {/* ── Order Info Card ── */}
      <OrderInfoCard order={order} />

      {/* ── Product Details Table ── */}
      <ProductTable products={order.products} />

      {/* ── Accept / Reject Action Panel ── */}
      <OrderActionPanel
        order={order}
        onAccept={handleAccept}
        onReject={handleReject}
        isSubmitting={isSubmitting}
      />

    </div>
  );
};

export default OrderDetails;
