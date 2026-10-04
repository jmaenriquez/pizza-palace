import React from 'react'

import Button from '../../../widgets/Button'
import SubHero from './SubHero'

import { LuArrowRight } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'



function Hero() {

  const nav = useNavigate();

  return (
    <div className='w-full h-full relative py-24 px-6 md:py-26 md:px-16  lg:p-24 xl:p-32'>
      
      <div>
        <img src="/Hero.png" alt="" 
        className='absolute inset-0 w-full h-70 md:h-120 lg:h-180 xl:h-210 object-cover -z-10'
        />
      </div>
      
      <div className='relative z-10 flex flex-col gap-1 md:gap-2 lg:gap-3 xl:gap-4 w-50 md:w-120 lg:w-140 xl:w-200'>
        
        <p 
          className='text-[10px] md:text-base lg:text-lg xl:text-2xl font-roboto font-semibold text-background/60 tracking-widest'
        >
          REAL PIZZA. ROYAL FLAVOR.
        </p>
        <h1 
          className='text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-primary'
        >
          Pizza fit <span className='text-secondary'>for Royalty</span>
        </h1>

        <div className='text-[10px] md:text-sm xl:text-xl text-background/60 mt-2 md:mt-4 lg:mt-8 font-roboto'>
          <p>Fresh ingredients. Perfectly baked.</p>
          <p>Unforgettable flavor in every slice.</p>
        </div>

        <div className='hidden md:block w-40 md:w-45 lg:w-55 xl:w-60 mt-2 lg:mt-3 xl:mt-4'>
          <Button.Hollow
            icon = {LuArrowRight}
            name='Order Now'
            type='button'
            iconRight = {true}
            onClick={() => nav('/menu')}
          />
        </div>

        <div className='hidden lg:block mt-12'>
          <SubHero/>
        </div>
      </div>
      
    </div>
  )
}

export default Hero