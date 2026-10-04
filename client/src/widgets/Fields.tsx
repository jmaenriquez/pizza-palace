import React from "react";
import type { IconType } from "react-icons";
import { LuPlus, LuTrash2 } from "react-icons/lu";

interface InputProps {
  icon?: IconType;
  name: string;
  value: string;
  type: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SelectProps {
  name: string;
  value: string | number;
  optionsArray: string[];
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

interface FileProps {
  name: string;
  file: File | null;
  existingUrl?: string;
  placeholder?: string;
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface Columns {
  name: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
}

export type Row = Record<string, string>

interface MultiInputProps{
  title?: string;
  columns: Columns[];
  rows: Row[]
  add_label?: string;
  min_rows?: number;
  onChange: (row: Row[]) => void;
}



export const emptyRow = (columns: Columns[]): Row => Object.fromEntries(columns.map(cols => [cols.name, '']));

const cell = 'border p-3 font-poppins text-xs lg:text-sm w-full rounded-sm border-gray-300 focus:border-primary focus:outline-none'

function Input({
  icon: Icon,
  name,
  value,
  type,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-0 px-4 text-gray-400 pointer-events-none">
          <Icon />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`border font-poppins w-full rounded-sm text-xs lg:text-sm border-gray-300 focus:border-primary focus:outline-none
          ${!Icon ? "p-3 sm:p-3 xl:p-4" : "pl-9 pr-3 sm:pl-9 xl:pl-10 py-3 xl:py-4"}
        `}
      />
    </div>
  );
}

function Select({
  name,
  value,
  placeholder,
  optionsArray,
  onChange,
}: SelectProps) {
  return (
    <div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 sm:p-3 xl:p-4 font-poppins text-xs lg:text-sm w-full rounded-md border-gray-300 focus:border-primary focus:outline-none"
      >
        <option className="text-gray-200" value="" disabled>
          {placeholder}
        </option>

        {optionsArray.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function File({
  name,
  file,
  existingUrl,
  placeholder,
  accept = "image/*",
  onChange,
}: FileProps) {
  const [preview, setPreview] = React.useState<string | undefined>(existingUrl);

  React.useEffect(() => {
    if (!file) {
      setPreview(existingUrl);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file, existingUrl]);

  return (
    <label className="flex flex-col items-center gap-2 cursor-pointer border border-dashed border-gray-300 rounded-sm p-4 text-xs lg:text-sm text-gray-500 font-poppins">
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="h-30 md:h-40 object-cover rounded-md"
        />
      )}
      <span>{file ? file.name : (placeholder ?? "Choose an image")}</span>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}

function MultipleInput({
  title,
  columns,
  rows,
  onChange,
  add_label = 'Add row',
  min_rows = 1,
}: MultiInputProps) {
  const update = (i: number, key: string, value: string) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)))

  const add = () => onChange([...rows, emptyRow(columns)])
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i))

  return (
    <div className='flex flex-col gap-2'>
      {title && <h1 className='font-poppins text-sm text-gray-500'>{title}</h1>}

      {rows.map((row, i) => (
        <div
          key={i}
          className='grid gap-2 items-center'
          style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr)) auto` }}
        >
          {columns.map(col => (
            <input
              key={col.name}
              name={col.name}
              type={col.type ?? 'text'}
              value={row[col.name] ?? ''}
              placeholder={col.placeholder}
              onChange={e => update(i, col.name, e.target.value)}
              className={cell}
            />
          ))}

          <button
            type='button'
            onClick={() => remove(i)}
            disabled={rows.length <= min_rows}
            aria-label='Remove row'
            className='text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'
          >
            <LuTrash2 className='w-4 h-4' />
          </button>
        </div>
      ))}

      <button
        type='button'
        onClick={add}
        className='flex items-center gap-1 self-start text-xs lg:text-sm font-poppins text-primary cursor-pointer'
      >
        <LuPlus className='w-4 h-4' /> {add_label}
      </button>
    </div>
  )
}


export default { Input, Select, File, MultipleInput };
