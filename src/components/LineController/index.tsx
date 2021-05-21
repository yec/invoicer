import React from "react";
import { LineForm, LineFormData, LineFormProps } from "../LineForm";

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
}

export const GST = 0.1;

export function calculateLine(data: LineFormData) {
  if (data.quantity && data.description) {
    return (
      parseFloat(`${data.quantity || 0}`) * parseFloat(`${data.rate || 0}`)
    );
  }
  return 0;
}

export function calculateSubtotal(lines: { [key: string]: LineFormData }) {
  return Object.entries(lines).reduce(
    (prev, [, lineData]) => prev + calculateLine(lineData),
    0
  );
}

export function calculateTotal(lines: { [key: string]: LineFormData }) {
  const subtotal = calculateSubtotal(lines);
  return subtotal + calculateGST(lines);
}

export function calculateGST(lines: { [key: string]: LineFormData }) {
  return calculateSubtotal(lines) * GST;
}

export function LineController(data: LineFormProps) {
  const [edit, setEdit] = React.useState(false);
  const onSave = (values: LineFormData) => {
    data.onSave && data.onSave(values);
    setEdit(false);
  };

  React.useEffect(() => {
    if (!data.edit) {
      setEdit(false);
    }
  }, [data.edit]);

  const onCancel = () => {
    setEdit(false);
  };

  const toggleEdit = () => {
    if (!edit && !data.edit) {
      return;
    }
    setEdit(!edit);
  };

  return edit ? (
    <td colSpan={4}>
      <LineForm {...{ ...data, onSave, onCancel }} />
    </td>
  ) : (
    <>
      <td className="pl-8 pt-3 pb-3" onClick={() => toggleEdit()}>
        {data.description}
      </td>
      <td className="text-right" onClick={() => toggleEdit()}>
        {data.quantity} days
      </td>
      <td className="text-right" onClick={() => toggleEdit()}>
        {formatCurrency(parseFloat(`${data.rate || 0}`))}
      </td>
      <td className="text-right pr-8" onClick={() => toggleEdit()}>
        {formatCurrency(calculateLine(data))}
      </td>
    </>
  );
}
