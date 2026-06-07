import React from 'react';

const OrderFilters = ({ filters, onFilterChange, onReset }) => {
  const STATUS_OPTIONS = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  return (
    <div className="m-orders__filters-card">
      <div className="m-orders__filters-grid">
        {/* Search Input */}
        <div className="m-orders__filter-field m-orders__filter-field--search">
          <label className="m-orders__filter-label">Search</label>
          <div className="m-orders__search-wrapper">
            <span className="material-symbols-outlined m-orders__search-icon">search</span>
            <input
              type="text"
              name="searchQuery"
              className="m-orders__filter-input"
              placeholder="Search by Order ID or Vendor..."
              value={filters.searchQuery}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="m-orders__filter-field">
          <label className="m-orders__filter-label">Status</label>
          <div className="m-orders__select-wrapper">
            <select
              name="status"
              className="m-orders__filter-input m-orders__filter-select"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="ALL">All Statuses</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="m-orders__filter-field m-orders__filter-field--date">
          <label className="m-orders__filter-label">From Date</label>
          <input
            type="date"
            name="fromDate"
            className="m-orders__filter-input"
            value={filters.fromDate}
            onChange={handleChange}
          />
        </div>
        <div className="m-orders__filter-field m-orders__filter-field--date">
          <label className="m-orders__filter-label">To Date</label>
          <input
            type="date"
            name="toDate"
            className="m-orders__filter-input"
            value={filters.toDate}
            onChange={handleChange}
          />
        </div>

        {/* Reset Button */}
        <div className="m-orders__filter-field m-orders__filter-field--actions">
          <button 
            className="m-orders__reset-btn" 
            onClick={onReset}
            title="Reset Filters"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
