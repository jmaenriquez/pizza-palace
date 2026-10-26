import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import toast from "react-hot-toast";

import api, {
  type ProductWithVariants,
} from "../../api/requests/productRequest";

import Hero from "./components/Hero";
import Skeleton from "../../components/reusable/SkeletonLoad";
import { FaPizzaSlice } from "react-icons/fa";

function Dashboard() {
  // ------------------------------------------------ utilities -------------------------------------------

  const nav = useNavigate();

  // ------------------------------------------------- states -------------------------------------------

  const [products, setProducts] = React.useState<ProductWithVariants[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // --------------------------------------------- functions ----------------------------------------

  const fetchData = async () => {
    try {
      setProducts(await api.getRequest());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  const onItemClick = (p: ProductWithVariants) => {
    nav(`menu/view/${p.id}`, {
      state: {
        products: p,
      },
    });
  };

  // ------------------------------------------- useEffect --------------------------------------------------

  React.useEffect(() => {
    fetchData().catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />

      <div className="p-4 md:p-12 pb-20 md:pb-0">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-foreground text-xl md:text-2xl lg:text-3xl font-semibold">
              Our Best Sellers
            </h1>
            <div className="flex justify-center p-8">
              <NavLink
                className={
                  "flex items-center text-sm gap-4 text-gray-400 hover:text-primary transition-colors delay-50"
                }
                to={"/menu"}
              >
                VIEW ALL <LuArrowRight />
              </NavLink>
            </div>
          </div>

          {/* Card Container */}
          <div className="py-8 md:py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-2 gap-y-6 lg:gap-x-4 lg:gap-y-12">
            {isLoading ? (
              Array.from({ length: 3 }, (_, i) => (
                <Skeleton.ProductCardSkeleton key={i} />
              ))
            ) : products.length === 0 ? (
              <div className="mt-12 md:mt-0 h-full flex-1 flex flex-col items-center justify-center gap-4 text-gray-300">
                <FaPizzaSlice className="w-12 h-12" />
                <p className="text-sm text-center">
                  The Pizzas are still being processed...
                </p>
              </div>
            ) : (
              products.slice(0, 3).map((item) => {
                const price = Math.min(
                  ...item.product_variants.map((v) => v.price),
                );

                return (
                  // Cards
                  <div
                    onClick={() => onItemClick(item)}
                    key={item.id}
                    className="overflow-hidden border border-foreground/20 rounded-lg shadow-md/40 hover:border-primary hover:cursor-pointer hover:scale-102 transition-all ease-in-out delay-75"
                  >
                    <div className="aspect-square">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-base md:text-xl lg:text-2xl font-semibold">
                          {item.name}
                        </h1>

                        <p className="line-clamp-2 text-foreground/60 text-xs md:text-sm lg:text-base">
                          {item.description}
                        </p>
                      </div>

                      <h3 className="text-base md:text-xl lg:text-2xl font-semibold text-primary">
                        ₱{price}
                      </h3>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-foreground text-xl md:text-2xl lg:text-3xl font-semibold">
              Recommended
            </h1>
            <div className="flex justify-center p-8">
              <NavLink
                className={
                  "flex items-center text-sm gap-4 text-gray-400 hover:text-primary transition-colors delay-50"
                }
                to={"/menu"}
              >
                {" "}
                VIEW ALL <LuArrowRight />
              </NavLink>
            </div>
          </div>

          {/* Card Container */}
          <div className="py-8 md:py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-2 gap-y-6 lg:gap-x-4 lg:gap-y-12">
            {isLoading
              ? Array.from({ length: 3 }, (_, i) => (
                  <Skeleton.ProductCardSkeleton key={i} />
                ))
              : products.slice(0, 3).map((item) => {
                  const price = Math.min(
                    ...item.product_variants.map((v) => v.price),
                  );

                  return (
                    // Cards
                    <div
                      onClick={() => onItemClick(item)}
                      key={item.id}
                      className="overflow-hidden border border-foreground/20 rounded-lg shadow-md/40 hover:border-primary hover:cursor-pointer hover:scale-102 transition-all ease-in-out delay-75"
                    >
                      <div className="aspect-square">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4 flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          <h1 className="text-base md:text-xl lg:text-2xl font-semibold">
                            {item.name}
                          </h1>

                          <p className="line-clamp-2 text-foreground/60 text-xs md:text-sm lg:text-base">
                            {item.description}
                          </p>
                        </div>

                        <h3 className="text-base md:text-xl lg:text-2xl font-semibold text-primary">
                          ₱{price}
                        </h3>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
