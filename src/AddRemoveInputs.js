import React, { useState, useEffect } from "react";

export const AddRemoveInputs = ({ data, onChange }) => {
  const [count, setCount] = useState(data);
  const onClick = () => {
    setCount(count + 1);
  };
  const remove = () => {
    setCount(count - 1);
  };

  useEffect(() => {
    onChange(count);
  }, [count]);
  return (
    <div>
      <button onClick={onClick}>+</button>
      {count > 1 && <button onClick={remove}>-</button>}
    </div>
  );
};
