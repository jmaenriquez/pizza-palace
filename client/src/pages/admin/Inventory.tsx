import React from "react";

import Button from "../../widgets/Button";
import Fields from '../../widgets/Fields'
import Form from '../../components/reusable/Form'

import { useHeaderData } from "../../utils/hooks/useHeaderData";
import type { IconType } from "react-icons";
import { LuEllipsisVertical, LuPlus, LuSearch } from "react-icons/lu";

interface stockItems {
  sku: string;
  img: string;
  name: string;
  description: string;
  price: number;
  stocks: number;
  actions: IconType;
}

function Inventory() {
  const items: stockItems[] = [
    {
      sku: "ES-260901",
      img: "/Menu/Pizzas/Emperor Supreme.webp",
      name: "Emperor Supreme",
      description:
        "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
      price: 349,
      stocks: 9999,
      actions: LuEllipsisVertical,
    },

    {
      sku: "ES-260902",
      img: "/Menu/Pizzas/Emperor Supreme.webp",
      name: "Emperor Supreme",
      description:
        "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
      price: 349,
      stocks: 9999,
      actions: LuEllipsisVertical,
    },

    {
      sku: "ES-260903",
      img: "/Menu/Pizzas/Emperor Supreme.webp",
      name: "Emperor Supreme",
      description:
        "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
      price: 349,
      stocks: 9999,
      actions: LuEllipsisVertical,
    },

    {
      sku: "ES-260904",
      img: "/Menu/Pizzas/Emperor Supreme.webp",
      name: "Emperor Supreme",
      description:
        "A royal combination of savory pepperoni, juicy sausage, fresh veggies, and melted mozzarella on a golden, crispy crust. Every bite is loaded with bold flavors and cheesy goodness fit for a pizza king!",
      price: 349,
      stocks: 9999,
      actions: LuEllipsisVertical,
    },
  ];


  // -------------------------------States----------------------------------------
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState(null)


  // -------------------------------Functions-------------------------------------
  const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value )
  }

  useHeaderData("Menu");

  return (
    <div className="px-12 pb-12 w-full h-full flex flex-col gap-8">

      {
        isFormOpen &&
        <Form
          addTitle="Add Menu"
          editTitle={`Edit Menu`}
          selectedItem={selectedItem}
          items={selectedItem || {}}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onOutsideClick={() => setIsFormOpen(false)}
          fields={[
            { fieldtype: 'input', name: 'img', type: 'image'},
            { fieldtype: 'input', name: 'name', type: 'text', placeholder: 'Name'},
            { fieldtype: 'input', name: 'description', type: 'text', placeholder: 'Description'},
            { fieldtype: 'input', name: 'price', type: 'number', placeholder: 'Price'},
            { fieldtype: 'input', name: 'stocks', type: 'number', placeholder: 'Stocks'}
          ]}
          onSubmit={() => console.log('Submit Clicked')}
        />
      }

      <div className="flex gap-4 items-center">
        <Fields.Input
          icon={LuSearch}
          name="search"
          type="text"
          value={search}
          placeholder="Search menu, or sku number..."
          onChange={searchOnChange}
        />

        <div className="hidden xl:flex w-12 xl:w-40 shrink-0">
          <Button.Solid
            icon={LuPlus}
            type="button"
            name="Add Menu"
            onClick={() => setIsFormOpen(true)}
          />
        </div>

        <div className="xl:hidden">
          <Button.Small
            icon={LuPlus}
            type="button"
            onClick={() => setIsFormOpen(true)}
          />
        </div>

      </div>

      {/* Card Container */}
      <div className=" lg:overflow-y-auto grid grid-cols-2 lg:grid-cols-1 gap-4 w-full">
        {
          items.map(item => 

            <div
              key={item.sku}
              className="lg:flex gap-4 border border-foreground/10 rounded-lg items-center shadow-md/10 w-full"
            >
              <div className="lg:w-56 relative aspect-square shrink-0 overflow-hidden">
                <img 
                  src={item.img} alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 lg:p-0 w-full">
                <div className="flex justify-between font-semibold text-md lg:text-xl">
                  <h1>{item.name}</h1>
                  <p>₱{item.price}</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <p className="text-xs lg:text-base text-foreground/50 font-semibold">{item.sku}</p>
                  <p className="xl:w-[75%] text-foreground/50 text-xs xl:text-sm line-clamp-2 lg:line-clamp-3 xl:line-clamp-none">{item.description}</p>
                </div>

                <p className="mt-4">
                  {
                    item.stocks === 0 ? 
                    <span className="text-primary">Out of Stocks</span>
                    :
                    <p className="font-semibold text-xs md:text-base">Stocks: {item.stocks}</p>
                  }
                  
                </p>
              </div>

              <div className="hidden lg:px-8  h-full lg:flex items-center cursor-pointer">
                <item.actions className="w-6 h-6"/>
              </div>

            </div>
          )
        }
      </div>
    </div>
  );
}

export default Inventory;
