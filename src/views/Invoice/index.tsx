import React from "react";
import { useParams } from "react-router";
import { v4 } from "uuid";
import { Button } from "../../components/Button";
import { ContentEditable } from "../../components/ContentEditable";
import { FileDrop } from "../../components/FileDrop";
import { Layout } from "../../components/Layout";
import {
  calculateGST,
  calculateSubtotal,
  calculateTotal,
  LineController,
  formatCurrency,
} from "../../components/LineController";
import { LineForm } from "../../components/LineForm";
import { FileData, invoiceState, SetInvoiceState } from "../../state";
import { InvoiceService } from "../../services/InvoiceService";
import { useInvoice } from "../../useInvoice";
import { useAuth } from "../../hooks/useAuth";
import imageString from "./imageString";
import fsDelete from "./fsDelete";
import FSImage from "./FSImage";
import { dbName } from "../../dbName";

type FileID = string;

export function InputField({
  label,
  value,
  onBlur,
  edit = true,
}: {
  label: string;
  value: string;
  onBlur: React.FocusEventHandler<HTMLDivElement>;
  edit?: boolean;
}) {
  return (
    <div className="flex flex-row justify-end">
      <div className="text-right font-bold">{label}</div>
      <ContentEditable edit={edit} className="text-right w-20" onBlur={onBlur}>
        {value}
      </ContentEditable>
    </div>
  );
}

export function EditContext({ element }: { element: React.ReactElement }) {
  // const [{ _id }] = useInvoiceContext();
  // const { status } = useInvoice(_id) || { status: "locked" };
  const status = "locked";
  return status === "locked"
    ? React.cloneElement(<div />, element.props)
    : React.cloneElement(element, element.props);
}

export function Invoice() {
  const { user, loaded } = useAuth();
  const [showAddRow, setShowAddRow] = React.useState(false);
  const { invoiceid } = useParams();
  const state = useInvoice(invoiceid) || invoiceState;

  const invoiceService = React.useMemo(() => {
    return !loaded
      ? undefined
      : new InvoiceService(user ? dbName(user.uid) : "invoices");
  }, [user, loaded]);

  const setInvoiceState = (obj: SetInvoiceState) => {
    invoiceService?.put(invoiceid, obj);
  };

  React.useEffect(() => {
    invoiceService?.getOrCreate(invoiceid);
  }, [invoiceid, invoiceService]);

  return (
    <div className="text-gray-700 font-medium">
      <Layout pagenumber={`1/${Object.keys(state.files).length + 1}`}>
        <div>
          <div className="float-right text-right pr-8 pt-8 text-xs">
            <div>
              <ContentEditable
                edit={state.status === "unlocked"}
                className="inline-flex"
                onBlur={(ele) => {
                  setInvoiceState({
                    company: { address: ele.target.innerText },
                  });
                }}
              >
                {state.company.address}
              </ContentEditable>
            </div>
            <div>
              <ContentEditable
                edit={state.status === "unlocked"}
                className="inline-flex"
                onBlur={(ele) => {
                  setInvoiceState({
                    company: { email: ele.target.innerText },
                  });
                }}
              >
                {state.company.email}
              </ContentEditable>
            </div>
            <div>
              <ContentEditable
                edit={state.status === "unlocked"}
                className="inline-flex"
                onBlur={(ele) => {
                  setInvoiceState({
                    company: { phone: ele.target.innerText },
                  });
                }}
              >
                {state.company.phone}
              </ContentEditable>
            </div>
            <div>
              ABN:{" "}
              <ContentEditable
                edit={state.status === "unlocked"}
                className="inline-flex"
                onBlur={(ele) => {
                  setInvoiceState({ company: { abn: ele.target.innerText } });
                }}
              >
                {state.company.abn}
              </ContentEditable>
            </div>
          </div>
          <div className="absolute top-44 pl-8">
            <ContentEditable
              edit={state.status === "unlocked"}
              className="text-4xl inline-flex text-gray-700 font-extrabold"
              onBlur={(ele) => {
                setInvoiceState({ company: { name: ele.target.innerText } });
              }}
            >
              {state.company.name}
            </ContentEditable>
            <div className="flex flex-row mt-6 text-xs">
              <div className="font-bold">Bill To:</div>
              <div className="ml-2">
                <ContentEditable
                  edit={state.status === "unlocked"}
                  className=""
                  onBlur={(ele) => {
                    setInvoiceState({ client: { name: ele.target.innerText } });
                  }}
                >
                  {state.client.name}
                </ContentEditable>
                <ContentEditable
                  edit={state.status === "unlocked"}
                  className=""
                  onBlur={(ele) => {
                    setInvoiceState({
                      client: { address: ele.target.innerText },
                    });
                  }}
                >
                  {state.client.address || ""}
                </ContentEditable>
              </div>
            </div>
          </div>
          <div className="clear-both float-right text-right pr-8 pt-12">
            <div className="text-2xl font-extrabold text-blue-400">Invoice</div>
          </div>
          <div className=" clear-both float-right text-right pr-8 pt-4 text-xs">
            <InputField
              edit={state.status === "unlocked"}
              label="Invoice No:"
              value={state.invoiceNumber}
              onBlur={(ele) => {
                setInvoiceState({ invoiceNumber: ele.target.innerText });
              }}
            />
            <InputField
              edit={state.status === "unlocked"}
              label="Date:"
              value={state.issueDate}
              onBlur={(ele) => {
                setInvoiceState({ issueDate: ele.target.innerText });
              }}
            />
            <div className="flex flex-row justify-end relative">
              <div className="text-right font-bold">Terms:</div>
              <div className="text-right w-20 uppercase">
                {state.terms.label}
              </div>
            </div>
            <InputField
              edit={state.status === "unlocked"}
              label="Due Date:"
              value={state.dueDate}
              onBlur={(ele) => {
                setInvoiceState({ dueDate: ele.target.innerText });
              }}
            />
          </div>
          <div className="clear-both pt-10">
            <div className="group">
              <table className="table-fixed w-full text-xs">
                <thead className="border-t-4 border-blue-400 bg-blue-50">
                  <tr>
                    <th className="text-left pl-8 pt-3 pb-3">Description</th>
                    <th className="text-right">Quantity</th>
                    <th className="text-right">Rate</th>
                    <th className="text-right pr-8">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(state.lines).map((key) => {
                    const lineData = state.lines[key];
                    return (
                      <tr key={key}>
                        <LineController
                          edit={state.status === "unlocked"}
                          onSave={(values) => {
                            setInvoiceState({ lines: { [key]: values } });
                          }}
                          onDelete={() => {
                            invoiceService?.deleteLine(invoiceid, key);
                          }}
                          {...lineData}
                        />
                      </tr>
                    );
                  })}
                  {showAddRow && (
                    <tr>
                      <td colSpan={4}>
                        <LineForm
                          onCancel={() => setShowAddRow(false)}
                          onSave={(values) => {
                            setInvoiceState({ lines: { [v4()]: values } });
                            setShowAddRow(false);
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="h-20">
                {!showAddRow && state.status !== "locked" && (
                  <div className="pl-8 pt-2 pb-2 print:invisible">
                    <Button
                      size="small"
                      onClick={() => setShowAddRow(true)}
                      className="bg-gray-400 group-hover:bg-green-400 opacity-10 group-hover:opacity-100"
                    >
                      Add row
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="float-right text-xs">
              <div className="flex flex-row">
                <div className="w-52 text-right">Subtotal</div>
                <div className="w-52 text-right pr-8 ml-auto">
                  {formatCurrency(calculateSubtotal(state.lines))}
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-52 text-right">GST 10%</div>
                <div className="w-52 text-right pr-8 ml-auto">
                  {formatCurrency(calculateGST(state.lines))}
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-52 text-right">Total</div>
                <div className="w-52 text-right pr-8 ml-auto">
                  {formatCurrency(calculateTotal(state.lines))}
                </div>
              </div>
            </div>
            <div className="text-2xl font-medium text-gray-700 flex flex-row clear-both float-right mt-4 pt-2 pb-2 border-t-4 border-b-4 border-blue-300">
              <div className="w-52 text-right">Balance Due</div>
              <div className="w-52 text-right pr-8">
                {formatCurrency(calculateTotal(state.lines))}
              </div>
            </div>
          </div>
          <div className="pl-8 mt-8 text-xs">
            <div>
              <div className="font-bold leading-loose">Payment Details</div>
              <ContentEditable
                edit={state.status === "unlocked"}
                className="inline-flex"
                onBlur={(ele) => {
                  setInvoiceState({ payment: ele.target.innerText });
                }}
              >
                {state.payment}
              </ContentEditable>
            </div>
            <div className="pt-8">
              <div className="font-bold leading-loose">Comments</div>
              <ContentEditable
                edit={state.status === "unlocked"}
                className="inline-flex"
                onBlur={(ele) => {
                  setInvoiceState({ comments: ele.target.innerText });
                }}
              >
                {state.comments}
              </ContentEditable>
            </div>
          </div>
        </div>
      </Layout>
      {Object.keys(state.files).map((key, i) => {
        const file = state.files[key];

        if (file.type.search("image") < 0) {
          return null;
        }

        return (
          <Layout
            key={key}
            pagenumber={`${i + 2}/${Object.keys(state.files).length + 1}`}
          >
            <div className="pl-8 pt-8">
              <ContentEditable
                edit={state.status === "unlocked"}
                className="inline-flex font-bold text-xs"
                onBlur={(ele) => {
                  setInvoiceState({
                    files: { [key]: { name: ele.target.innerText } },
                  });
                }}
              >
                {file.name}
              </ContentEditable>
            </div>
            <div className="group">
              <div className="ml-auto mr-auto w-10/12 w-10/12 mt-8">
                {file.fullPath ? (
                  <FSImage fullPath={file.fullPath} />
                ) : (
                  <img src={file.data} alt={file.name} />
                )}
              </div>
              {state.status !== "locked" && (
                <div className="ml-auto mr-auto mt-8 w-10/12 w-10/12 print:invisible">
                  <Button
                    size="small"
                    className=" bg-gray-400 group-hover:bg-red-400 opacity-10 group-hover:opacity-100"
                    onClick={() => {
                      fsDelete(file.fullPath);
                      invoiceService?.deleteFile(invoiceid, key);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </Layout>
        );
      })}
      {state.status !== "locked" && (
        <div className="w-full md:w-a4w md:ml-8 mb-4 print:hidden">
          <FileDrop
            className=""
            onFiles={(files) => {
              const filesState: Record<FileID, FileData> = {};

              Promise.all(files.map(imageString)).then((res) => {
                res.forEach(({ src, snapshot }, i) => {
                  const { name, type, size, lastModified } = files[i];
                  filesState[v4()] = {
                    name,
                    type,
                    size,
                    lastModified,
                    data: "",
                    fullPath: snapshot.metadata.fullPath,
                  };
                });
                setInvoiceState({ files: filesState });
              });
            }}
          />
        </div>
      )}
      <div className="print:hidden sticky bottom-0 z-30 lg:z-50 w-full bg-white h-12 flex items-center justify-end pl-8 pr-8 pb-2-safe shadow-inner">
        <div className="text-red-500 mr-auto">{state.invoiceNumber}</div>
        <div>
          {state.client.name} {formatCurrency(calculateTotal(state.lines))}
        </div>
        <Button
          onClick={() => window.print()}
          size="small"
          className="ml-8 text-blue-400 border-2 border-blue-400"
        >
          Print
        </Button>
      </div>
    </div>
  );
}
