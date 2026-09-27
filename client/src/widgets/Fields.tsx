import React from 'react'
import type { IconType } from 'react-icons'

interface InputProps{
  icon?: IconType
  name: string
  value: string
  type: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface SelectProps{
  name: string,
  value: string | number,
  optionsArray: string[]
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

function Input({ icon: Icon, name, value, type, placeholder, onChange }: InputProps) {
  return (
    <div className='relative flex items-center w-full'>
      {Icon && (
        <div className='absolute left-0 px-4 text-gray-400 pointer-events-none'>
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
          ${!Icon ? 'p-3 sm:p-3 xl:p-4' : 'pl-9 pr-3 sm:pl-9 xl:pl-10 py-3 xl:py-4'}
        `}
      />
    </div>
  )
}

function Select({ name, value, placeholder, optionsArray, onChange}: SelectProps){
    return(
        <div>
          <select 
            name={name}
            value={value}
            onChange={onChange}
            className='border p-2 sm:p-3 xl:p-4 font-poppins text-sm w-full rounded-md border-gray-300 focus:border-primary focus:outline-none'
          >
            <option value="" disabled>
              {placeholder}
            </option>

            {
              optionsArray.map(opt => (

                <option
                  key = {opt}
                  value={opt}
                >
                  {opt}
                </option>
              ))
            }
          </select>
        </div>
    )
}

export default { Input, Select }