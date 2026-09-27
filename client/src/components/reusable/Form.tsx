import React, { type HTMLElementType } from 'react'
import Fields from '../../widgets/Fields'
import { LuCross, LuX } from 'react-icons/lu'


interface  FieldValues{
  name: string
  placeholder?: string
  fieldtype: 'input' | 'select'
  type: React.HTMLInputTypeAttribute
  options?: string[] //use only when field type is select
}

type FormItem = Record<string, string>

interface FormProps{
  addTitle?: string
  editTitle?: string
  selectedItem?: FormItem | null
  items: FormItem
  fields: FieldValues[]
  isOpen: boolean
  onClose: () => void
  onOutsideClick: () => void
  onSubmit: (item: FormItem) => void
}

function Form({ addTitle, editTitle, selectedItem, items, fields, isOpen, onClose, onOutsideClick, onSubmit }:FormProps) {

  const [item, setItem] = React.useState(() => {
    return fields.reduce((accumulator, field) => ({
      ...accumulator,
      [field.name]: items?.[field.name] ?? '',
    }), {} as FormItem)

  })

  const onChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> ) => {

    setItem(prevItem => ({...prevItem, [e.target.name]: e.target.value }))
  }

  if(!isOpen) return null;
  
  return (
    <div className='w-full fixed inset-0 bg-foreground/40 h-full flex justify-center items-center z-10'>

      <div className='bg-white w-80 md:w-120 shadow-lg/30 p-8 grid gap-8 '>

        <div className='flex items-center justify-between'>
          <h1 className='text-lg md:text-2xl'>
            {
              selectedItem 
              ? editTitle  
              : addTitle
            }
          </h1>

          <LuX 
            className='w-4 h-4 md:w-6 md:h-6 text-gray-400 cursor-pointer'
            onClick={onClose}
          />

        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          {
            fields.map(f => {
              if(f.fieldtype === 'input'){
                return(
                  <Fields.Input
                    key={f.name}
                    placeholder={f.placeholder}
                    name={f.name}
                    type={f.type}
                    value={item[f.name]}
                    onChange={onChange}
                  />
                )
              } else {
                return(
                  <Fields.Select
                    key={f.name}
                    name={f.name}
                    value={item[f.name]}
                    placeholder={f.placeholder}
                    optionsArray={f.options!}
                    onChange={onChange}
                  />
                )
              }
            })
          }
        </form>

        <div className='button'>
          
        </div>
      </div>
    </div>
  )
}

export default Form