import { LineFormData } from "../components/LineForm";

export type NET_30 = {
  days: 30;
  label: "Net 30";
};

export type NET_7 = {
  days: 7;
  label: "Net 7";
};

export type Terms = NET_30 | NET_7;

export type Status = "locked" | "unlocked";

export const invoiceState: InvoiceState = {
  _id: "28b5d13b-9697-4038-9408-efaa6fe9da98",
  company: {
    name: "Company Name",
    address: "Company Address",
    abn: "ABN No.",
    acn: "ACN No.",
    email: "Email Address",
    phone: "Phone",
  },
  client: { name: "Client Name", address: "Client Address" },
  invoiceNumber: "1",
  dueDate: "",
  issueDate: "",
  terms: { days: 30, label: "Net 30" },
  payment: "Payment Details",
  comments: "Comments",
  lines: {
    "4c8f34d7-9431-44a6-a8ad-391df1704f8e": {
      description: "4 Jan - 10 Jan",
      quantity: 5,
      rate: 150,
    },
  },
  files: {},
  status: "unlocked",
};

export type FileData = {
  name: string;
  data: string;
  type: string;
  lastModified: number;
  size: number;
};

export type SetFileData = {
  name?: string;
};

export type Company = {
  name: string;
  address: string;
  email: string;
  phone: string;
  abn?: string;
  acn?: string;
};

export type Client = Pick<Company, "name" | "address">;

export type SetCompany = Partial<Company>;

export type InvoiceState = {
  _id: string;
  status?: Status;
  company: Company;
  client: Client;
  invoiceNumber: string;
  issueDate: string;
  terms: Terms;
  dueDate: string;
  payment: string;
  comments: string;
  lines: { [key: string]: LineFormData };
  files: { [key: string]: FileData };
};

export type SetInvoiceState = {
  status?: Status;
  company?: SetCompany;
  client?: Partial<Client>;
  invoiceNumber?: string;
  issueDate?: string;
  terms?: Terms;
  dueDate?: string;
  payment?: string;
  comments?: string;
  lines?: { [key: string]: LineFormData };
  files?: { [key: string]: SetFileData };
};
