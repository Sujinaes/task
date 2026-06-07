import React, { useMemo } from 'react';

const ProductTable = ({ products = [] }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const grandTotal = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  );

  if (!products.length) {
    return (
      <div className="product-table-card product-table-card--empty">
        <span className="material-symbols-outlined">inventory_2</span>
        <p>No products found in this order.</p>
      </div>
    );
  }

  return (
    <div className="product-table-card">
      <div className="product-table-card__header">
        <span className="material-symbols-outlined">inventory_2</span>
        <h3>Product Details</h3>
        <span className="product-table-card__count">{products.length} item{products.length > 1 ? 's' : ''}</span>
      </div>

      <div className="product-table-card__wrapper">
        <table className="po-product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Warranty</th>
              <th className="po-product-table__right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id || index}>
                <td className="po-product-table__index">{index + 1}</td>
                <td className="po-product-table__name">{product.name}</td>
                <td>
                  <span className="po-product-table__category">{product.category}</span>
                </td>
                <td className="po-product-table__qty">{product.quantity}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.warranty || '—'}</td>
                <td className="po-product-table__right po-product-table__subtotal">
                  {formatCurrency(product.price * product.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="po-product-table__total-label">Grand Total</td>
              <td className="po-product-table__right po-product-table__grand-total">
                {formatCurrency(grandTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
