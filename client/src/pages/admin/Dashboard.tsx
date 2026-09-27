import React from 'react'
import Heading from '../admin/Header'
import { LuArrowDown, LuArrowUp, LuUser, LuReceipt, LuChartNoAxesCombined} from 'react-icons/lu';
import { useHeaderData } from '../../utils/hooks/useHeaderData';


function Dashboard() {

  const name = 'JM';
  const cardItems = [
    { icon: LuReceipt, iconBg: 'bg-primary', title: 'Completed Orders', subject: '42', percentage: '12%', increase: true},
    { icon: LuChartNoAxesCombined, iconBg: 'bg-secondary', title: 'Total Revenue', subject: '₱12,480', percentage: '12%', increase: false},
    { icon: LuUser, iconBg: 'bg-tertiary', title: 'Active Users', subject: '127', percentage: '12%', increase: true}
  ]

  useHeaderData(`Welcome back, Admin ${name}`, "Here's what's happening with your shop." )

  return (
    <div className='px-12 w-full flex flex-col gap-4'>
      
      {/* sub-container */}
      <div className='flex flex-col gap-16'>

        {/* Card Container */}
        <div className='grid lg:grid-cols-3 gap-8 w-full'>
          {
            cardItems.map((items, index) => (

              // Card
              <div
                key={index} 
                className='w-full border flex flex-col gap-4 border-foreground/10 rounded-xl shadow-md/10 p-6'
              >
                <div className='flex gap-4 xl:gap-6'>
                  <div 
                    className={`${items.iconBg}  border w-12 lg:w-15 xl:w-17 full flex justify-center items-center rounded-lg text-background`}
                  >
                    <items.icon 
                      className='w-6 h-6 lg:w-8 lg:h-8'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <h3 className='font-medium text-xs xl:text-lg'>{items.title}</h3>
                    <h1 className='text-xl xl:text-3xl font-semibold'>{items.subject}</h1>
                  </div>
                </div>

                <div>
                  <p className={`flex justify-end text-xs md:text-sm items-center gap-1
                        ${items.increase ? 'text-tertiary' : 'text-primary'}
                    `}>
                    {
                      items.increase 
                      ? <LuArrowUp/>
                      : <LuArrowDown/>
                      
                    }
                    <span>{items.percentage} since last month.</span>
                    
                  </p>
                </div>
                
              </div>
            ))
          }
        </div>
        
        <div className='flex gap-12'>

          {/* Chart */}
          <div>This is chart</div>

          {/* Recent Orders */}
          <div>this is another card</div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard