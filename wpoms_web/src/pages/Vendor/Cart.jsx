import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./components/cart/CartItem";
import { vendorService } from "../../services/vendorService";
import { toast } from "sonner";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [placingOrderFor, setPlacingOrderFor] = useState(null);

  
  const [placedVendors, setPlacedVendors] = useState(new Set());

  // Track selected cart item IDs
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Order Summary Modal state
  const [orderModal, setOrderModal] = useState(null);
  const [vendorDetails, setVendorDetails] = useState({
    vendorName: "",
    vendorAddress: "",
    vendorLocation: "",
  });

  
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await vendorService.getCart();

      let cartArray = [];
      if (Array.isArray(data)) {
        cartArray = data;
      } else if (data && Array.isArray(data.items)) {
        cartArray = data.items;
      } else if (data && Array.isArray(data.cartItems)) {
        cartArray = data.cartItems;
      } else if (data && Array.isArray(data.data)) {
        cartArray = data.data;
      }
      
      const normalizedItems = cartArray.map(item => ({
        cartItemId: item.cartItemId || item.id,
        productId: item.productId,
        productName: item.productName || item.name,
        category: item.category,
        price: item.price || 0,
        quantity: item.quantity || 1,
        manufacturerName: item.manufacturerName || item.manufacturer,
        stock: item.stock || 99
      }));
      
      setCartItems(normalizedItems);
      const allIds = new Set(normalizedItems.map((item) => item.cartItemId));
      setSelectedIds(allIds);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      toast.error(err.message || "Failed to load cart");
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const groupedByManufacturer = useMemo(() => {
    const groups = {};
    cartItems.forEach((item) => {
      const mfgName = item.manufacturerName || "Unknown Manufacturer";
      if (!groups[mfgName]) groups[mfgName] = [];
      groups[mfgName].push(item);
    });
    return groups;
  }, [cartItems, placedVendors]);

  const manufacturerNames = Object.keys(groupedByManufacturer);

  // ── Selection helpers ─────────────────────────────────────────────────────
  const toggleSelectItem = (itemId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const toggleSelectAll = (manufacturerName) => {
    const groupItems = groupedByManufacturer[manufacturerName] || [];
    const groupIds = groupItems.map((item) => item.cartItemId);
    const allSelected = groupIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) groupIds.forEach((id) => next.delete(id));
      else groupIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const isAllSelected = (manufacturerName) => {
    const groupItems = groupedByManufacturer[manufacturerName] || [];
    if (groupItems.length === 0) return false;
    return groupItems.every((item) => selectedIds.has(item.cartItemId));
  };

  const isSomeSelected = (manufacturerName) => {
    const groupItems = groupedByManufacturer[manufacturerName] || [];
    return groupItems.some((item) => selectedIds.has(item.cartItemId));
  };

  const getSelectedItemsForMfg = (manufacturerName) => {
    const groupItems = groupedByManufacturer[manufacturerName] || [];
    return groupItems.filter((item) => selectedIds.has(item.cartItemId));
  };

  const getGroupTotals = (manufacturerName) => {
    const selectedItems = getSelectedItemsForMfg(manufacturerName);
    const totalItems = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    return { totalItems, totalPrice, selectedCount: selectedItems.length };
  };

  const removeItem = async (cartItemId) => {
    try {
      setRemovingId(cartItemId);
      await vendorService.removeFromCart(cartItemId);
      await fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  // Update quantity - NO page reload, NO "Updating..." message
  // Update quantity - Send the NEW quantity to backend
const updateQuantity = async (productId, cartItemId, delta, currentQuantity) => {
  const newQuantity = currentQuantity + delta;
  if (newQuantity < 1) return;
  
  try {
    // Send the NEW quantity to backend
    await vendorService.addToCart(productId, newQuantity);
    
    // Update local state immediately
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
    
  } catch (err) {
    toast.error(err.message || "Failed to update quantity");
    // If API fails, refresh cart to revert to correct state
    await fetchCart();
  }
};

  const openOrderModal = (manufacturerName) => {
    const selectedItems = getSelectedItemsForMfg(manufacturerName);
    if (selectedItems.length === 0) {
      toast.error("Please select at least one product to place an order.");
      return;
    }
    const { totalItems, totalPrice } = getGroupTotals(manufacturerName);
    setOrderModal({ manufacturerName, items: selectedItems, totalItems, totalPrice });
    setVendorDetails({ vendorName: "", vendorAddress: "", vendorLocation: "" });
  };

  const closeOrderModal = () => setOrderModal(null);

  // ── Place Order ───────────────────────────────────────────────────────────
  const confirmPlaceOrder = async () => {
    if (!orderModal) return;
    if (!vendorDetails.vendorName.trim()) {
      toast.error("Please enter the Vendor Name.");
      return;
    }
    if (!vendorDetails.vendorAddress.trim()) {
      toast.error("Please enter the Vendor Address.");
      return;
    }
    if (!vendorDetails.vendorLocation.trim()) {
      toast.error("Please enter the Vendor Location.");
      return;
    }

    const { manufacturerName, items } = orderModal;
    try {
      setPlacingOrderFor(manufacturerName);
      const selectedCartItemIds = items.map((item) => item.cartItemId);
      await vendorService.placeOrder(selectedCartItemIds, vendorDetails);
      toast.success(`Order placed for ${manufacturerName}!`);
      
      await fetchCart();
      closeOrderModal();
      // Stay on cart — other vendors may still have active items
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacingOrderFor(null);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="cart-header-wrapper">
          <div className="cart-title-container">
            <h2 className="cart-title">
              <span className="material-symbols-outlined title-icon">shopping_cart</span>
              Your Cart
            </h2>
          </div>
        </div>
        <div className="cart-loading">
          <span className="material-symbols-outlined loading-spinner">progress_activity</span>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-header-wrapper">
          <div className="cart-title-container">
            <h2 className="cart-title">
              <span className="material-symbols-outlined title-icon">shopping_cart</span>
              Your Cart
            </h2>
          </div>
        </div>
        <div className="cart-empty">
          <span className="material-symbols-outlined">production_quantity_limits</span>
          <p>Your cart is empty. Start adding products from the catalog!</p>
          <button className="btn-browse-catalog" onClick={() => navigate("/vendor/product-catalog")}>
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  // ── Cart with grouped items ───────────────────────────────────────────────
  return (
    <div className="cart-page">
      <div className="cart-header-wrapper">
        <div className="cart-title-container">
          <h2 className="cart-title">
            <span className="material-symbols-outlined title-icon">shopping_cart</span>
            Your Cart
          </h2>
          <p className="cart-subtitle">Review your items grouped by manufacturer and place your purchase orders.</p>
        </div>

        {/* Banner when at least one vendor has been ordered this session */}
        {placedVendors.size > 0 && (
          <div className="cart-placed-banner">
            <span className="material-symbols-outlined">check_circle</span>
            <span>
              {placedVendors.size} vendor order{placedVendors.size > 1 ? "s" : ""} placed
              {" — "}
              <button
                className="link-btn"
                onClick={() => navigate("/vendor/my-orders")}
              >
                View in My Orders
              </button>
            </span>
          </div>
        )}
      </div>

      <div className="cart-content">
        <div className="cart-groups-container">
          {manufacturerNames.map((mfgName) => {
            const groupItems = groupedByManufacturer[mfgName];
            const { totalItems, totalPrice, selectedCount } = getGroupTotals(mfgName);
            const allSel = isAllSelected(mfgName);
            const someSel = isSomeSelected(mfgName);
            const isOrdering = placingOrderFor === mfgName;

            return (
              <div key={mfgName} className="manufacturer-group">
                {/* Manufacturer Header */}
                <div className="manufacturer-header">
                  <div className="mfg-header-left">
                    <label className="select-all-label">
                      <input
                        type="checkbox"
                        className="cart-checkbox"
                        checked={allSel}
                        ref={(el) => { if (el) el.indeterminate = someSel && !allSel; }}
                        onChange={() => toggleSelectAll(mfgName)}
                      />
                      <span className="checkbox-custom"></span>
                    </label>
                    <h3><span className="material-symbols-outlined">factory</span>{mfgName}</h3>
                  </div>
                  <span className="mfg-item-count">{selectedCount} of {groupItems.length} selected</span>
                </div>

                {/* Cart Items */}
                <div className="cart-items-list">
                  {groupItems.map((item) => {
                    const itemId = item.cartItemId;
                    const isSelected = selectedIds.has(itemId);
                    return (
                      <CartItem
                        key={itemId}
                        item={{
                          id: itemId,
                          productId: item.productId,
                          name: item.productName,
                          category: item.category,
                          price: item.price,
                          quantity: item.quantity,
                          stock: item.stock,
                        }}
                        isSelected={isSelected}
                        onToggleSelect={() => toggleSelectItem(itemId)}
                        onIncrease={() => updateQuantity(item.productId, itemId, 1 , item.quantity)}
                        onDecrease={() => updateQuantity(item.productId, itemId, -1, item.quantity)}
                        onRemove={() => removeItem(itemId)}
                        isRemoving={removingId === itemId}
                      />
                    );
                  })}
                </div>

                {/* Group Summary + Place Order */}
                <div className="manufacturer-summary">
                  <div className="mfg-summary-details">
                    <div className="mfg-summary-stat">
                      <span className="stat-label">Selected Items:</span>
                      <span className="stat-value">{totalItems}</span>
                    </div>
                    <div className="mfg-summary-stat">
                      <span className="stat-label">Subtotal:</span>
                      <span className="stat-value price">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="btn-place-order" onClick={() => openOrderModal(mfgName)} disabled={isOrdering || selectedCount === 0}>
                    <span className="material-symbols-outlined">check_circle</span>
                    {isOrdering ? "Placing Order..." : `Place Order for ${mfgName}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary Modal */}
      {orderModal && (
        <div className="order-modal-overlay" onClick={closeOrderModal}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-modal-header">
              <div>
                <h3>Order Summary</h3>
                <p className="order-modal-subtitle">Review your order before confirming.</p>
              </div>
              <button className="order-modal-close" onClick={closeOrderModal}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="order-modal-section">
              <h4 className="order-modal-section-title"><span className="material-symbols-outlined">factory</span>Manufacturer</h4>
              <div className="order-modal-info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{orderModal.manufacturerName}</span>
              </div>
            </div>

            <div className="order-modal-section">
              <h4 className="order-modal-section-title"><span className="material-symbols-outlined">inventory_2</span>Products ({orderModal.totalItems} items)</h4>
              <table className="order-modal-table">
                <thead>
                  <tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                  {orderModal.items.map((item, idx) => {
                    const itemName = item.productName || "—";
                    const itemPrice = item.price || 0;
                    const itemQty = item.quantity || 1;
                    return (
                      <tr key={idx}>
                        <td className="modal-product-name">{itemName}</td>
                        <td>₹{itemPrice.toLocaleString()}</td>
                        <td>{itemQty}</td>
                        <td className="modal-subtotal">₹{(itemPrice * itemQty).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="order-modal-total">
                <span>Order Total</span>
                <span className="modal-total-value">₹{orderModal.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="order-modal-section">
              <h4 className="order-modal-section-title"><span className="material-symbols-outlined">store</span>Vendor Details</h4>
              <div className="order-modal-fields">
                <div className="order-modal-field">
                  <label>Vendor Name <span className="required">*</span></label>
                  <input type="text" placeholder="Enter vendor name" value={vendorDetails.vendorName} onChange={(e) => setVendorDetails(prev => ({ ...prev, vendorName: e.target.value }))} />
                </div>
                <div className="order-modal-field">
                  <label>Address <span className="required">*</span></label>
                  <input type="text" placeholder="Enter shipping address" value={vendorDetails.vendorAddress} onChange={(e) => setVendorDetails(prev => ({ ...prev, vendorAddress: e.target.value }))} />
                </div>
                <div className="order-modal-field">
                  <label>Location <span className="required">*</span></label>
                  <input type="text" placeholder="Enter city / location" value={vendorDetails.vendorLocation} onChange={(e) => setVendorDetails(prev => ({ ...prev, vendorLocation: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="order-modal-actions">
              <button className="btn-modal-cancel" onClick={closeOrderModal}>Cancel</button>
              <button className="btn-modal-confirm" onClick={confirmPlaceOrder} disabled={placingOrderFor !== null}>
                <span className="material-symbols-outlined">check_circle</span>
                {placingOrderFor ? "Placing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;