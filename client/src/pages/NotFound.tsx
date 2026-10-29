import React from 'react'
import Button from '../widgets/Button'
import { LuArrowLeft } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

function NotFound() {

    const nav = useNavigate();
  return (
    <div>
        404 Not Found <Button.Solid icon={LuArrowLeft} name='Go Back' type='button' onClick={() => nav(-1)} />
    </div>
  )
}

export default NotFound