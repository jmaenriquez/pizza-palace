import React from 'react'
import { useHeaderData } from '../../utils/hooks/useHeaderData'

function Users() {

  useHeaderData('Users')
  return (
    <div className='px-12 w-full'>
        Users content
    </div>
  )
}

export default Users