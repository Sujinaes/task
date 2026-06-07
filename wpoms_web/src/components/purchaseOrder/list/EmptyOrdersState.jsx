import React from 'react';

const EmptyOrdersState = ({ hasFilters }) => {
  return (
    <div className="m-orders__empty">
      <div className="m-orders__empty-icon-wrapper">
        <span className="material-symbols-outlined m-orders__empty-icon">
          {hasFilters ? 'search_off' : 'inventory_2'}
        </span>
      </div>
      <h3 className="m-orders__empty-title">
        {hasFilters ? 'No matches found' : 'No purchase orders available'}
      </h3>
      <p className="m-orders__empty-subtitle">
        {hasFilters 
          ? 'Try adjusting your search criteria or resetting the filters to see more results.'
          : 'You currently do not have any purchase orders to review.'}
      </p>
    </div>
  );
};

export default EmptyOrdersState;
