import React from 'react';

const CurrencyInput = ({ value, handleChange, handleClear }) => (
  <div className="currency-input">
    <input
      type="number"
      name="increment"
      className="form-control"
      placeholder="0.00"
      min="0.00"
      step="1.00"
      value={value}
      onChange={handleChange}
    />
    {value && (
      <span className="clear-input-button" onClick={handleClear}>
        &times;
      </span>
    )}
  </div>
);

export default CurrencyInput;
