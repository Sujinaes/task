import React from 'react';

const CartItem = ({ item, isSelected, onToggleSelect, onIncrease, onDecrease, onRemove, isRemoving }) => {
  const { name, category, price, quantity } = item;
  const subtotal = price * quantity;

  return (
    <div className={`cart-item ${isRemoving ? 'cart-item-removing' : ''} ${isSelected ? 'cart-item-selected' : ''}`}>
      <label className="cart-item-checkbox-label">
        <input type="checkbox" className="cart-checkbox" checked={isSelected} onChange={onToggleSelect} />
        <span className="checkbox-custom"></span>
      </label>

      <div className="item-details">
        <h4 className="item-name">{name}</h4>
        {category && <span className="item-category">{category}</span>}
        <div className="item-price">₹{price.toLocaleString()}</div>
      </div>

      <div className="item-controls">
        <div className="quantity-control">
          <button className="qty-btn" onClick={onDecrease} disabled={quantity <= 1}>
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="qty-value">{quantity}</span>
          <button className="qty-btn" onClick={onIncrease}>
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      <div className="item-subtotal">
        <span className="subtotal-label">Subtotal</span>
        <span className="subtotal-amount">₹{subtotal.toLocaleString()}</span>
      </div>

      <button className="btn-remove" onClick={onRemove} disabled={isRemoving} title="Remove item">
        <span className="material-symbols-outlined">{isRemoving ? 'progress_activity' : 'delete'}</span>
      </button>
    </div>
  );
};

export default CartItem;