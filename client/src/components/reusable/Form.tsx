import React from "react";
import { type Columns,  type Row, emptyRow } from "../../widgets/Fields";

import Fields from "../../widgets/Fields";
import Button from "../../widgets/Button";

import { LuX } from "react-icons/lu";
import toast from "react-hot-toast";

interface FieldValues {
  name: string;
  placeholder?: string;
  title?: string;
  fieldtype: "input" | "select" | "file" | "multiple";
  type?: React.HTMLInputTypeAttribute;
  add_label?: string
  options?: string[]; // use only if field type is select
  columns?: Columns[]; // use only if field type is multiple
}

export type FormItem = Record<string, string>;
export type FormFiles = Record<string, File | null>;
export type FormLists = Record<string, Row[]>;

interface FormProps {
  addTitle?: string;
  editTitle?: string;
  selectedItem?: FormItem | null;
  fields: FieldValues[];
  isOpen: boolean;
  onClose: () => void;
  onOutsideClick: () => void;
  onSubmit: (
    item: FormItem,
    file: FormFiles,
    lists: FormLists,
  ) => void | Promise<void>;
}

const buildItem = (fields: FieldValues[], source?: FormItem | null) =>
  fields.reduce(
    (acc, f) => ({ ...acc, [f.name]: source?.[f.name] ?? "" }),
    {} as FormItem,
  );

const buildLists = (fields: FieldValues[]): FormLists =>
  Object.fromEntries(
    fields
      .filter((f) => f.fieldtype === "multiple")
      .map((f) => [f.name, [emptyRow(f.columns ?? [])]]),
  );

function Form({
  addTitle,
  editTitle,
  selectedItem,
  fields,
  isOpen,
  onClose,
  onOutsideClick,
  onSubmit,
}: FormProps) {
  const [item, setItem] = React.useState(() => buildItem(fields, selectedItem));
  const [file, setFile] = React.useState<FormFiles>({});

  // ------------------------------------Funtions--------------------------------------------

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setItem((prevItem) => ({ ...prevItem, [e.target.name]: e.target.value }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile((prev) => ({ ...prev, [e.target.name]: file }));
  };

  const [lists, setLists] = React.useState<FormLists>(() => buildLists(fields));

  const onListChange = (name: string, rows: Row[]) =>
    setLists((prev) => ({ ...prev, [name]: rows }));

  const submit = async () => {
    try {
      await onSubmit(item, file, lists);
      toast.success(
        selectedItem
        ? "Record edited successfully."
        : "Record added successfully.",
      );
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        !selectedItem ? "Failed to add record." : "Failed to edit record.",
      );
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    setItem(buildItem(fields, selectedItem));
    setFile({});
    setLists(buildLists(fields));
  }, [isOpen, selectedItem]);

  if (!isOpen) return;

  return (
    <div
      onClick={onOutsideClick}
      className="w-full fixed inset-0 bg-foreground/40 h-full flex justify-center items-center z-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-80 md:w-120 shadow-lg/30 p-8 grid gap-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-2xl">
            {selectedItem ? editTitle : addTitle}
          </h1>

          <LuX
            className="w-4 h-4 md:w-6 md:h-6 text-gray-400 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4"
        >
          {fields.map((f) => {
            if (f.fieldtype === "input") {
              return (
                <Fields.Input
                  key={f.name}
                  placeholder={f.placeholder}
                  name={f.name}
                  type={f.type ?? "text"}
                  value={item[f.name]}
                  onChange={onChange}
                />
              );
            } else if (f.fieldtype === "select") {
              return (
                <Fields.Select
                  key={f.name}
                  name={f.name}
                  value={item[f.name]}
                  placeholder={f.placeholder}
                  optionsArray={f.options!}
                  onChange={onChange}
                />
              );
            } else if (f.fieldtype === "file") {
              return (
                <Fields.File
                  key={f.name}
                  name={f.name}
                  file={file[f.name] ?? null}
                  existingUrl={item[f.name]}
                  placeholder={f.placeholder}
                  onChange={onFileChange}
                />
              );
            } else if (f.fieldtype === "multiple") {
              return (
                <Fields.MultipleInput
                  key={f.name}
                  title={f.title}
                  columns={f.columns ?? []}
                  rows={lists[f.name] ?? []}
                  onChange={(rows) => onListChange(f.name, rows)}
                  add_label={f.add_label}
                />
              );
            }
          })}
        </form>

        <div className="flex flex-col gap-1 md:gap-2">
          {selectedItem ? (
            <Button.Solid name="Save" type="button" onClick={submit} />
          ) : (
            <Button.Solid name="Submit" type="button" onClick={submit} />
          )}
          <Button.Hollow name="Cancel" type="button" onClick={onClose} />
        </div>
      </div>
    </div>
  );
}

export default Form;
