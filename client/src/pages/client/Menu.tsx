import React from "react";
import { useNavigate } from "react-router-dom";

import Fields from "../../widgets/Fields";

import api, {
  type ProductWithVariants,
} from "../../api/requests/productRequest";
import type { FormLists } from "../../components/reusable/Form";

import { LuSearch } from "react-icons/lu";
import { FaPizzaSlice } from "react-icons/fa";

interface FilterValues {
  name: string;
  value: string;
}

function Menu() {
  // -----------------------------------------utilities------------------------------------

  const nav = useNavigate();

  const filter: FilterValues[] = [
    { name: "All", value: "" },
    { name: "Classic", value: "Classic" },
    { name: "Royal Feast", value: "Meat" },
    { name: "Veggie Royale", value: "Vegetarian" },
    { name: "Court Treats", value: "Others" },
    { name: "Royal Refreshments", value: "Beverages" },
  ];

  // -----------------------------------------states--------------------------------------

  const [products, setProducts] = React.useState<ProductWithVariants[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  // -----------------------------------------functions------------------------------------

  const selectedName =
    filter.find((f) => f.value === filterValue)?.name ?? "All";

  const fetchData = async () => {
    setProducts(
      await api.getRequest({ category: filterValue, search: search }),
    );
  };

  const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onItemClick = (p: ProductWithVariants) => {
    nav(`view/${p.id}`, {
      state: {
        products: p,
      },
    });
  };

  // -----------------------------------------useEffects------------------------------------

  React.useEffect(() => {
    fetchData().catch((error) => console.error(error));
  }, [filterValue, search]);

  return (
    <div className="flex justify-center">
      <div className="p-4 md:p-12">
        {/* Top Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-foreground text-xl md:text-2xl lg:text-3xl font-semibold">
            Our Menu
          </h1>
          <h3 className="text-foreground/60 text-sm md:text-base">
            From classic favorites to bold new flavors.
          </h3>

          <div className="flex gap-4 items-center mt-2">
            <Fields.Input
              icon={LuSearch}
              name="search"
              type="text"
              value={search}
              placeholder="Search menu, or sku number..."
              onChange={searchOnChange}
            />
          </div>

          <div className="flex gap-2 mt-2">
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
                optionsArray={filter.map((items) => items.name)}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const match = filter.find((f) => f.name === e.target.value);
                  setFilterValue(match?.value ?? "");
                }}
              />
            </div>
          </div>
        </div>
        {products.length === 0 ? (
          <div className="mt-12 md:mt-0 h-full flex-1 flex flex-col items-center justify-center gap-4 text-gray-300">
            <FaPizzaSlice className="w-12 h-12" />
            <p className="text-sm text-center">
              The Pizzas are still being processed...
            </p>
          </div>
        ) : (
          /* Card Container */
          <div className="py-8 md:py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-2 gap-y-6 lg:gap-x-4 lg:gap-y-12">
            {products.map((item) => {
              const prices = item.product_variants.map((v) => v.price);
              const lowestPrice = Math.min(...prices);
              return (
                // Cards
                <div
                  key={item.id}
                  onClick={() => onItemClick(item)}
                  className="overflow-hidden border border-foreground/20 rounded-lg shadow-md/40 hover:border-primary hover:cursor-pointer hover:scale-102 transition-all ease-in-out duration-100"
                >
                  <div className="aspect-square shrink-0 w-full overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-base md:text-xl xg:text-2xl font-semibold text-foreground leading-7">
                        {item.name}
                      </h1>

                      <p className="min-h-10 line-clamp-2 text-foreground/60 leading-5 text-xs md:text-sm lg:text-base">
                        {item.description}
                      </p>
                    </div>

                    <h3 className="mt-auto pt-2 text-base md:text-xl lg:text-2xl font-semibold text-primary">
                      ₱{lowestPrice}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
