import React from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

export function Empty() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate(`/invoicer/invoice/${v4()}`)}>
        New Invoice
      </button>
    </div>
  );
}
