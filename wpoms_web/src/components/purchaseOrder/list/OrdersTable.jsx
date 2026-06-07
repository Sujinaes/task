import React, { useState } from 'react';
import OrderRow from './OrderRow';
import EmptyOrdersState from './EmptyOrdersState';

const OrdersTable = ({ orders, hasFilters, onStatusUpdate }) => {
  // Track which order row is currently expanded (by numeric id)
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (numericId) => {
    setExpandedId((prev) => (prev === numericId ? null : numericId));
  };

  if (orders.length === 0) {
    return <EmptyOrdersState hasFilters={hasFilters} />;
  }

  return (
    <div className="m-orders__table-card">
      <div className="m-orders__table-wrapper">
        <table className="m-orders__table">
          <thead>
            <tr>
              <th>Purchase Order ID</th>
              <th>Vendor</th>
              <th>Purchase Date</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const trackingId = order.id ?? order.orderId;
              return (
                <OrderRow
                  key={trackingId}
                  order={order}
                  isExpanded={expandedId === trackingId}
                  onToggle={() => handleToggle(trackingId)}
                  onStatusUpdate={onStatusUpdate}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
