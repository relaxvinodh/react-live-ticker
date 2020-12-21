import React from 'react';
/**
 * Loader used(mostly) for the async calls
 */

const BusyBox = () => (
  <svg
    width="20px"
    height="20px"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    style={{ verticalAlign: 'middle' }}
  >
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="#b7b7b7"
      strokeWidth="10"
      r="35"
      strokeDasharray="164.93361431346415 56.97787143782138"
      transform="rotate(229.847 50 50)"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        calcMode="linear"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
        dur="1.8s"
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default BusyBox;
