import React from 'react'
import type { IconType } from 'react-icons'

import Button from '../widgets/Button';
import { LuBadgeAlert, LuBadgeCheck, LuBadgeHelp, LuBadgeInfo, LuBadgeX } from 'react-icons/lu';

interface ModalProps{
    type?: "error" | "success" | "info" | "warning" | "question" ;
    title: string;
    message: string;
    isOpen: Boolean
    onConfirm: () => void;
    onClose: () => void;
}

function ConfirmationModal({ type, title, message, isOpen, onConfirm, onClose }: ModalProps) {

    if(!isOpen) return;
  return (
    <div
    onClick={onClose} 
    className='fixed inset-0 z-20 flex items-center justify-center bg-foreground/80'>
        <div className='p-6 max-w-120 bg-white rounded-lg shadow-md/20 flex flex-col items-center justify-center gap-8'>
        <div className='flex flex-col items-center gap-2'>

            { 
                type === "error" ? <LuBadgeX className='w-12 h-12 text-primary'/>  
                : type === "success" ? <LuBadgeCheck className='w-12 h-12 text-tertiary'/>  
                : type === "info" ? <LuBadgeInfo className='w-12 h-12 text-blue-400'/>
                : type === "warning" ? <LuBadgeAlert className='w-12 h-12 text-amber-600'/>
                : <LuBadgeHelp className='w-12 h-12 text-gray-500'/>
            }
            <h1 className='text-2xl text-center'>{title}</h1>
            <p className='text-center text-sm text-gray-600'>{message}</p>
        </div>

        <div className='flex gap-4'>
            <Button.Hollow
            name='Cancel'
            type='button'
            onClick={onClose}
            />

            <Button.Solid
            name='Confirm'
            type='button'
            onClick={onConfirm}
            />
        </div>
        </div>
    </div>
  )
}

export default ConfirmationModal