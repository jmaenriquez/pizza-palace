import React from 'react'
import Hero from './components/Hero'

interface stockItems { 
  img: string;
  name: string;
  description: string;
  price: number;
}

function Dashboard() {

  const items: stockItems[] = [
      {
        img: "/Menu/Pizzas/Emperor Supreme.webp",
        name: "Emperor Supreme",
        description:
          "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
        price: 349
      },
      {
        img: "/Menu/Pizzas/Emperor Supreme.webp",
        name: "Emperor Supreme",
        description:
          "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
        price: 349
      },
      {
        img: "/Menu/Pizzas/Emperor Supreme.webp",
        name: "Emperor Supreme",
        description:
          "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
        price: 349
      },
      {
        img: "/Menu/Pizzas/Emperor Supreme.webp",
        name: "Emperor Supreme",
        description:
          "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
        price: 349
      },
      {
        img: "/Menu/Pizzas/Emperor Supreme.webp",
        name: "Emperor Supreme",
        description:
          "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
        price: 349
      },
      {
        img: "/Menu/Pizzas/Emperor Supreme.webp",
        name: "Emperor Supreme",
        description:
          "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
        price: 349
      },
      {
        img: "/Menu/Pizzas/Emperor Supreme.webp",
        name: "Emperor Supreme",
        description:
          "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
        price: 349
      },
      {
        img: "/Menu/Pizzas/Emperor Supreme.webp",
        name: "Emperor Supreme",
        description:
          "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
        price: 349
      }
    ]

  return (
    <div className='min-h-screen'>
        <Hero/>

        <div className='p-12'>
          <div>
            <h1 className='text-foreground text-3xl font-semibold'>Our Best Sellers</h1>

            {/* Card Container */}
            <div className='py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12'>
              {
                items.map((item, index) =>  
                
                  // Cards
                  <div
                    key={index}
                    className='overflow-hidden border border-foreground/20 rounded-lg shadow-md/40'
                  >
                    <div className='aspect-square'>
                      <img 
                        src={item.img} alt={item.name}
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div className='p-4 flex flex-col gap-4'>

                      <div className='flex flex-col gap-2'>
                        <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>{item.name}</h1>

                        <p className='line-clamp-2 text-foreground/60 text-xs md:text-sm lg:text-base'>{item.description}</p>
                      </div>

                      <h3 className='text-xl md:text-2xl lg:text-3xl font-semibold text-primary'>₱{item.price}</h3>
                    </div>

                  </div>
                )
              }
            </div>
          </div>

          <div>
            <h1 className='text-foreground text-3xl font-semibold'>Recommended</h1>

            {/* Card Container */}
            <div className='py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12'>
              {
                items.map((item, index) =>  
                
                  // Cards
                  <div
                    key={index}
                    className='overflow-hidden border border-foreground/20 rounded-lg shadow-md/40'
                  >
                    <div className='aspect-square'>
                      <img 
                        src={item.img} alt={item.name}
                        className='w-full h-full object-cover'
                      />
                    </div>

                    <div className='p-4 flex flex-col gap-4'>

                      <div className='flex flex-col gap-2'>
                        <h1 className='text-lg md:text-xl lg:text-2xl font-semibold'>{item.name}</h1>

                        <p className='line-clamp-2 text-foreground/60 text-xs md:text-sm lg:text-base'>{item.description}</p>
                      </div>

                      <h3 className='text-xl md:text-2xl lg:text-3xl font-semibold text-primary'>₱{item.price}</h3>
                    </div>

                  </div>
                )
              }
            </div>
          </div>
        </div>
    </div>
  )
}

export default Dashboard