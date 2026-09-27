import React from 'react'
import { useHeaderData } from '../../utils/hooks/useHeaderData'

function Settings() {
  useHeaderData('Settings')
  return (
    <div className='px-12 w-full'>
        Settings content
    </div>
  )
}

export default Settings