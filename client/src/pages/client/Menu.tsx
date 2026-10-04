import React from "react";
import Fields from "../../widgets/Fields";

interface FilterValues {
  name: string;
  value: string;
}

interface stockItems { 
  img: string;
  name: string;
  description: string;
  price: number;
}

function Menu() {
  // -----------------------------------------utilities------------------------------------

  const filter: FilterValues[] = [
    { name: "All", value: "" },
    { name: "Classic", value: "Classic" },
    { name: "Royal Feast", value: "Meat" },
    { name: "Veggie Royale", value: "Vegetarian" },
    { name: "Court Treats", value: "Others" },
    { name: "Royal Refreshments", value: "Beverages" }
  ];

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

  // -----------------------------------------states--------------------------------------

  const [filterValue, setFilterValue] = React.useState("");

  // -----------------------------------------functions------------------------------------

  const selectedName = filter.find(f => f.value === filterValue)?.name ?? "All"

  return (
    <div className="p-4 md:p-12">

      {/* Top Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-foreground text-xl md:text-2xl lg:text-3xl font-semibold">Our Menu</h1>
        <h3 className="text-foreground/60 text-sm md:text-base">
          From classic favorites to bold new flavors.
        </h3>

        <div className="flex gap-2">
          {filter.map((items) => (
            <button
              key={items.name}
              className={`hidden xl:inline border border-gray-300 text-gray-400 py-1 px-4 rounded-xl cursor-pointer
                      ${filterValue === items.value ? "bg-primary text-white border-primary" : ""}
                      `}
              onClick={() => {
                setFilterValue(items.value);
              }}
            >
              {items.name}
            </button>
          ))}

          <div className=" xl:hidden mt-2">
            <Fields.Select
              name="filter"
              value={selectedName}
              optionsArray={filter.map(items => items.name)}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const match = filter.find(f => f.name === e.target.value)
                setFilterValue(match?.value ?? "")
              }}
            />
          </div>
        </div>
      </div>
      

      {/* Card Container */}
      <div className='py-8 md:py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-6 lg:gap-x-8 lg:gap-y-12'>
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

                    <div className='p-4 flex flex-col gap-2'>

                      <div className='flex flex-col gap-2'>
                        <h1 className='text-base md:text-xl lg:text-2xl font-semibold'>{item.name}</h1>

                        <p className='line-clamp-2 text-foreground/60 text-xs md:text-sm lg:text-base'>{item.description}</p>
                      </div>

                      <h3 className='text-base md:text-xl lg:text-2xl font-semibold text-primary'>₱{item.price}</h3>
                    </div>

                  </div>
                )
              }
            </div>
    </div>
  );
}

export default Menu;
