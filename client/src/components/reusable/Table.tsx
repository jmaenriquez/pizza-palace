import React from "react";

interface TableRow {
  id: string | number;
  [key: string]: string | number;
}

interface TableProps {
  head: string[];
  body: TableRow[];
  columns: string[];
}

function Table({ head, body, columns }: TableProps) {
  return (
    <div className="w-full">
      <table className="w-full mt-2 border-collapse rounded-lg shadow-sm/40">
        <thead>
          <tr>
            {head.map((title, index) => (
              <th key={index} className="px-4 py-5 text-center">
                {title}
              </th>
            ))}
            <th className="px-4 py-5 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {body.length === 0 || columns.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center text-gray-400 px-4 py-8"
              >
                <h1>No Records to Show.</h1>
              </td>
            </tr>
          ) : (
            body.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex}>
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex}
                    className="'px-4 py-3 text-sm text-center font-medium text-gray-800' "
                >
                    {row[col]}</td>
                ))}

                <td className="tooltip"></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
