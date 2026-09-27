import type { IconType } from 'react-icons'

interface ButtonProps{
    icon?: IconType
    name?:string,
    type: "button" | "submit"
    onClick: () => void
    iconRight?: boolean
}

function Small({ icon: Icon, type, onClick }:ButtonProps ) {
  return (
    <div>
        <button
          type={type}
          onClick={onClick}
          className='flex gap-4 font-poppins justify-center items-center font-semibold p-1 sm:p-2.5 xl:p-3 text-sm xl:text-md rounded-md w-full bg-primary text-background transition active:scale-95 ease-in-out duration-150 cursor-pointer'
        >
            {Icon && <Icon className='w-5 h-5' strokeWidth={3} />}
        </button>
    </div>
  )
}

function Solid({ icon: Icon, name, type, iconRight, onClick }:ButtonProps ) {
  return (
    <div>
        <button
          type={type}
          onClick={onClick}
          className='font-poppins font-semibold p-2 sm:p-3 text-sm xl:text-md rounded-md w-full bg-primary text-background transition active:scale-95 ease-in-out duration-150 cursor-pointer'
        >
          {
            iconRight === true ?
              <span className='flex gap-4 justify-center items-center'>
              {name} {Icon && <Icon size={20}/>}
            </span>
            :
            <span className='flex gap-4 justify-center items-center'>
              {Icon && <Icon size={20}/>}  {name}
            </span>
          }
        </button>
    </div>
  )
}

function Hollow({ icon: Icon, name, type, iconRight, onClick }:ButtonProps ) {
  return (
    <div>
        <button
          type={type}
          onClick={onClick}
          className='font-poppins font-semibold p-2 sm:p-3 text-sm xl:text-md rounded-md w-full border border:bg-primary text-primary transition active:scale-95 ease-in-out duration-150 cursor-pointer'
        >
          {
            iconRight === true ?
              <span className='flex gap-4 justify-center items-center'>
              {name} {Icon && <Icon size={20}/>}
            </span>
            :
            <span className='flex gap-4 justify-center items-center'>
              {Icon && <Icon size={20}/>}  {name}
            </span>
          }
        </button>
    </div>
  )
}


export default { Solid, Hollow, Small }