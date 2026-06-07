import React from 'react';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    icon: 'schedule',
    className: 'status-badge--pending',
  },
  ACCEPTED: {
    label: 'Accepted',
    icon: 'check_circle',
    className: 'status-badge--accepted',
  },
  APPROVED: {
    label: 'Accepted',
    icon: 'check_circle',
    className: 'status-badge--accepted',
  },
  REJECTED: {
    label: 'Rejected',
    icon: 'cancel',
    className: 'status-badge--rejected',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: 'block',
    className: 'status-badge--cancelled',
  },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status?.toUpperCase()] ?? STATUS_CONFIG.PENDING;

  return (
    <span className={`status-badge ${config.className}`}>
      <span className="material-symbols-outlined status-badge__icon">
        {config.icon}
      </span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
