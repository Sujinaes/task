import React, { useState, useEffect, useCallback, useRef } from 'react';
import StatusBadge from '../StatusBadge';
import { purchaseOrderService } from '../../../services/purchaseOrderService';
import AcceptSection from '../AcceptSection';
import RejectSection from '../RejectSection';
import { toast } from 'sonner';

/* ── helpers ── */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (amount) => {
  const num = Number(amount);
  if (amount == null || isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(num);
};

/**
 * Smart field reader: given an item object and a list of candidate keys,
 * returns the first value that is a usable number > 0, or 0 as fallback.
 */
const readNumeric = (obj, keys) => {
  for (const key of keys) {
    const val = obj?.[key];
    const num = Number(val);
    if (val != null && !isNaN(num)) return num;
  }
  // Also check inside nested `product` object
  if (obj?.product) {
    for (const key of keys) {
      const val = obj.product[key];
      const num = Number(val);
      if (val != null && !isNaN(num)) return num;
    }
  }
  return 0;
};

/**
 * Normalise a single line-item from the order details API response.
 * Covers every known backend field name variation.
 */
const normaliseItem = (item) => {
  // ── Product name ──
  const name =
    item.productName ||
    item.name ||
    item.product_name ||
    item.itemName ||
    item.item_name ||
    (item.product &&
      (item.product.productName ||
        item.product.name ||
        item.product.product_name)) ||
    'Unknown Product';

  // ── Category ──
  const category =
    item.category ||
    item.productCategory ||
    item.product_category ||
    (item.product &&
      (item.product.category ||
        item.product.productCategory)) ||
    '—';

  // ── Quantity ──
  const quantity = readNumeric(item, [
    'quantity', 'qty', 'orderQuantity', 'order_quantity',
    'requestedQuantity', 'itemQuantity',
  ]);

  // ── Unit price ──
  const price = readNumeric(item, [
    'unitPrice', 'unit_price', 'price', 'rate',
    'sellingPrice', 'selling_price', 'costPrice', 'cost_price',
    'amount', 'itemPrice',
  ]);

  // ── Subtotal ──
  const computedSubtotal = price * quantity;
  const subtotal =
    readNumeric(item, [
      'subtotal', 'subTotal', 'sub_total',
      'lineTotal', 'line_total', 'total', 'itemTotal',
    ]) || computedSubtotal;

  return {
    id: item.id,
    name,
    category,
    quantity,
    price,
    subtotal,
  };
};

/**
 * Extract the items array from a raw API detail response.
 * Handles every known nesting pattern.
 */
const extractItems = (data) => {
  if (!data) return [];

  // The response might itself be an array of items
  if (Array.isArray(data)) return data.map(normaliseItem);

  // Try all known top-level array keys
  const ARRAY_KEYS = [
    'items', 'orderItems', 'products', 'purchaseOrderItems',
    'lineItems', 'orderProducts', 'order_items',
  ];

  for (const key of ARRAY_KEYS) {
    if (Array.isArray(data[key]) && data[key].length >= 0) {
      return data[key].map(normaliseItem);
    }
  }

  // Last resort: scan all keys for the first array value
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key])) {
      console.log(`[OrderRow] Found items array under key: "${key}"`);
      return data[key].map(normaliseItem);
    }
  }

  return [];
};

/* ─────────────────────────────────────────
   Inline expanded details + action panel
   ───────────────────────────────────────── */
const ExpandedDetails = ({ order, onStatusUpdate, onClose }) => {
  const [items, setItems] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState(null);

  // Cache: once fetched, never re-fetch unless explicitly retried
  const fetchedRef = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMsg, setActionMsg] = useState(null); // { type: 'success'|'error', text }
  const [resolved, setResolved] = useState(false);

  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [localStatus, setLocalStatus] = useState(
    order?.status?.toUpperCase() || 'PENDING'
  );

  const isPending = !resolved && localStatus === 'PENDING';

  /* ── The numeric PK — used for every API call ── */
  // order.id is correctly extracted by ManufacturerOrders.jsx normaliseOrder.
  // We explicitly fallback to extracting it from orderId if missing.
  const numericId = order.id || (order.orderId ? parseInt(order.orderId.replace(/\D/g, ''), 10) : null);

  /* ── Fetch order details from GET /api/manufacturer/orders/{id} ── */
  const fetchDetails = useCallback(async () => {
    if (!numericId) {
      setDetailsError('Invalid order ID — cannot fetch details.');
      setDetailsLoading(false);
      return;
    }

    console.log('Fetching order details for:', numericId);
    setDetailsLoading(true);
    setDetailsError(null);
    fetchedRef.current = false;

    try {
      const data = await purchaseOrderService.getOrderById(numericId);

      // ── Deep diagnostic logs ──
      console.log('Expanded Order Details:', data);
      console.log('Products:', data?.products);

      const extracted = extractItems(data);
      console.log('Extracted & normalised items:', extracted);

      setItems(extracted);
      fetchedRef.current = true;
    } catch (err) {
      console.error('Order details fetch error:', err);
      setDetailsError(err.message || 'Failed to load order details.');
    } finally {
      setDetailsLoading(false);
    }
  }, [numericId]);

  // Fetch once on mount; do NOT re-fetch on every render
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  /* ── Grand total (computed from normalised items) ── */
  const grandTotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  /* ── Accept ── */
  const handleAccept = async (deliveryDate) => {
    setIsSubmitting(true);
    setActionMsg(null);
    try {
      console.log('Accepting order:', numericId, 'delivery:', deliveryDate);
      await purchaseOrderService.acceptOrder(numericId, deliveryDate);
      onStatusUpdate(numericId, 'ACCEPTED', deliveryDate);
      setLocalStatus('ACCEPTED');
      setResolved(true);
      setActionMsg({
        type: 'success',
        text: 'Order accepted successfully! Status updated to ACCEPTED.',
      });
      toast.success('Purchase Order Accepted Successfully', { duration: 4000 });

      setShowAccept(false);
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.message || 'Failed to accept order.',
      });
      toast.error(`${err.message}`)
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Reject ── */
  const handleReject = async (reason) => {
    setIsSubmitting(true);
    setActionMsg(null);
    try {
      console.log('Rejecting order:', numericId, 'reason:', reason);
      await purchaseOrderService.rejectOrder(numericId, reason);
      onStatusUpdate(numericId, 'REJECTED');
      setLocalStatus('REJECTED');
      setResolved(true);
      setActionMsg({
        type: 'success',
        text: 'Order rejected. Status updated to REJECTED.',
      });
      setShowReject(false);
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.message || 'Failed to reject order.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-orders__expanded-panel">
      {/* Close button */}
      <button
        className="m-orders__expanded-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close details"
      >
        <span className="material-symbols-outlined">close</span>
      </button>


      {/* ── Loading ── */}
      {detailsLoading && (
        <div className="m-orders__expanded-skeleton">
          <div className="m-orders__skeleton m-orders__skeleton--row" />
          <div className="m-orders__skeleton m-orders__skeleton--row" />
          <div className="m-orders__skeleton m-orders__skeleton--row" />
        </div>
      )}

      {/* ── Error ── */}
      {!detailsLoading && detailsError && (
        <div className="m-orders__expanded-error">
          <span className="material-symbols-outlined">warning</span>
          {detailsError}
          <button onClick={fetchDetails}>Retry</button>
        </div>
      )}

      {/* ── Products ── */}
      {!detailsLoading && !detailsError && (
        <>
          {items.length === 0 ? (
            <div className="m-orders__expanded-empty">
              <span className="material-symbols-outlined">inventory_2</span>
              <p>No product details available for this order.</p>
            </div>
          ) : (
            <div className="m-orders__products-wrapper">
              <div className="m-orders__products-header">
                <span className="material-symbols-outlined">inventory_2</span>
                <span>
                  Product Details
                  <em className="m-orders__item-count">
                    {items.length} item{items.length > 1 ? 's' : ''}
                  </em>
                </span>
              </div>
              <div className="m-orders__products-table-wrap">
                <table className="m-orders__products-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th className="m-orders__right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={item.id ?? idx}>
                        <td className="m-orders__td-idx">{idx + 1}</td>
                        <td className="m-orders__td-name">{item.name}</td>
                        <td>
                          <span className="m-orders__category-pill">
                            {item.category}
                          </span>
                        </td>
                        <td className="m-orders__td-qty">{item.quantity}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td className="m-orders__right m-orders__td-subtotal">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} className="m-orders__total-label">
                        Total Amount
                      </td>
                      <td className="m-orders__right m-orders__grand-total">
                        {formatCurrency(grandTotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Action Message ── */}
      {actionMsg && (
        <div
          className={`m-orders__action-msg m-orders__action-msg--${actionMsg.type}`}
        >
          <span className="material-symbols-outlined">
            {actionMsg.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {actionMsg.text}
        </div>
      )}

      {/* ── Action Panel (PENDING) ── */}
      {isPending && (
        <div className="m-orders__action-panel">
          <div className="oa-panel__buttons">
            <button
              className={`oa-panel__btn oa-panel__btn--reject ${showReject ? 'oa-panel__btn--active' : ''}`}
              onClick={() => {
                setShowReject((p) => !p);
                setShowAccept(false);
              }}
              disabled={isSubmitting}
              id={`reject-btn-${numericId}`}
            >
              <span className="material-symbols-outlined">close</span>
              Reject Order
            </button>
            <button
              className={`oa-panel__btn oa-panel__btn--accept ${showAccept ? 'oa-panel__btn--active' : ''}`}
              onClick={() => {
                setShowAccept((p) => !p);
                setShowReject(false);
              }}
              disabled={isSubmitting}
              id={`accept-btn-${numericId}`}
            >
              <span className="material-symbols-outlined">check</span>
              Accept Order
            </button>
          </div>

          <AcceptSection
            orderId={order.orderId}
            isOpen={showAccept}
            onConfirm={handleAccept}
            onCancel={() => setShowAccept(false)}
            isSubmitting={isSubmitting}
          />

          <RejectSection
            orderId={order.orderId}
            isOpen={showReject}
            onConfirm={handleReject}
            onCancel={() => setShowReject(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* ── Resolved State (non-PENDING) ── */}
      {!isPending && (
        <div className="m-orders__action-panel">
          <div className="oa-panel__status-resolved">
            <StatusBadge status={localStatus} />
            <span className="oa-panel__status-text">
              This order has been{' '}
              <strong>{localStatus?.toLowerCase()}</strong>.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────
   Main row component
   ───────────────────────────────────────── */
const OrderRow = ({ order, isExpanded, onToggle, onStatusUpdate }) => {

  // We wrap the onToggle call to ensure it strictly fires correctly and stops propagation
  const handleRowClick = (e) => {
    // Only toggle if we didn't click inside the expanded details panel
    if (!e.target.closest('.m-orders__expanded-row')) {
      onToggle();
    }
  };

  return (
    <>
      {/* ── Summary Row ── */}
      <tr
        className={`m-orders__row ${isExpanded ? 'm-orders__row--expanded' : ''}`}
        onClick={handleRowClick}
        style={{ cursor: 'pointer' }}
      >
        {/* Purchase Order ID (display only) */}
        <td className="m-orders__cell m-orders__cell--id">
          <strong>{order.orderId || `PO-${order.id}`}</strong>
        </td>

        {/* Vendor */}
        <td className="m-orders__cell m-orders__cell--vendor">
          <div className="m-orders__vendor-info">
            <span className="material-symbols-outlined m-orders__vendor-icon">
              storefront
            </span>
            {order.vendorName || 'Unknown Vendor'}
          </div>
        </td>

        {/* Purchase Date */}
        <td className="m-orders__cell m-orders__cell--date">
          {formatDate(order.orderDate)}
        </td>

        {/* Delivery Date */}
        <td className="m-orders__cell m-orders__cell--date">
          {formatDate(order.deliveryDate)}
        </td>

        {/* Status */}
        <td className="m-orders__cell m-orders__cell--status">
          <StatusBadge status={order.status} />
        </td>

        {/* Expand toggle */}
        <td
          className="m-orders__cell m-orders__cell--toggle"
          onClick={(e) => {
            // Guarantee that clicking the cell itself strictly toggles and stops here
            e.stopPropagation();
            onToggle();
          }}
        >
          <span
            className={`m-orders__expand-icon material-symbols-outlined ${isExpanded ? 'm-orders__expand-icon--open' : ''
              }`}
            onClick={(e) => {
              // Guarantee that clicking the span itself strictly toggles
              e.stopPropagation();
              onToggle();
            }}
          >
            expand_more
          </span>
        </td>
      </tr>

      {/* ── Expanded Row ── */}
      {isExpanded && (
        <tr className="m-orders__expanded-row">
          <td colSpan={6} className="m-orders__expanded-cell">
            <ExpandedDetails
              order={order}
              onStatusUpdate={onStatusUpdate}
              onClose={onToggle}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export const convertPoNumberToId = (poNumber) => {
  if (!poNumber) return null;
  return parseInt(poNumber.replace("PO-", ""), 10);
};

export default OrderRow;
