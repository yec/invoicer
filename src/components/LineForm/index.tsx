import React from "react";
import { Button } from "../Button";
import { TextField } from "../TextField";

export type LineFormData = {
  description?: string;
  quantity?: number | string;
  rate?: number | string;
};

export type LineFormProps = LineFormData & {
  edit?: boolean;
  onSave?: (data: LineFormData) => void;
  onCancel?: () => void;
  onDelete?: () => void;
};

function getValue(e: React.FormEvent<HTMLFormElement>, name: string) {
  const element = e.currentTarget.elements.namedItem(name);
  if (element && "value" in element) {
    return element.value;
  }
  return "";
}

export function LineForm({
  description = "",
  quantity = "",
  rate = "",
  onSave,
  onCancel,
  onDelete,
}: LineFormProps) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = {
          description: getValue(e, "description"),
          quantity: getValue(e, "quantity"),
          rate: getValue(e, "rate"),
        };
        onSave && onSave(data);
      }}
    >
      <div className="border-black border p-4">
        <TextField
          defaultValue={description}
          name="description"
          label="Description"
        />
        <TextField defaultValue={quantity} name="quantity" label="Quantity" />
        <div className="flex-row flex items-center">
          <TextField defaultValue={rate} name="rate" label="Rate" />
          <div className="mb-5 ml-4">per day</div>
        </div>

        <div className="flex flex-row">
          <div className="mx-1">
            <Button
              onClick={() => onCancel && onCancel()}
              type="button"
              className="border border-blue-500 text-blue-500"
            >
              Cancel
            </Button>
          </div>
          <Button type="submit" className="mx-1 bg-blue-500">
            Save
          </Button>
          <Button
            onClick={() => onDelete && onDelete()}
            type="button"
            className="mx-1 border border-red-500 text-red-500"
          >
            Delete
          </Button>
        </div>
      </div>
    </form>
  );
}
