import React from "react";
import toast from "react-hot-toast";
import { LuArrowRight } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";

import api from "../../api/requests/productRequest";

import type { ProductWithVariants } from "../../api/requests/productRequest";
import SkeletonLoad from "./SkeletonLoad";

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function Recommended() {
// --------------------------------------= utilities -----------------------------------------
    const nav = useNavigate();

  // -------------------------------------------- states -----------------------------------------

  const [recommended, setRecommended] = React.useState<ProductWithVariants[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(true);

  //   -------------------------------------------- functions ---------------------------------------------
  const onItemClick = (p: ProductWithVariants) => {
    nav(`/menu/view/${p.id}`, {
      state: {
        products: p,
      },
    });
  };

  // ----------------------------------------- useEffect -------------------------------------------

  React.useEffect(() => {
    let cancelled = false;

    const loadRecommended = async () => {
      try {
        const data = await api.getRequest();
        if (!cancelled) setRecommended(shuffle(data).slice(0, 6));
      } catch (err) {
        console.error(err);
        if (!cancelled) toast.error("Failed to load recommended products.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadRecommended();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-lg md:text-xl font-semibold flex justify-between items-center">
        Recommended
        <NavLink
          className="flex items-center text-sm gap-4 text-gray-400 hover:text-primary transition-colors delay-50"
          to={"/menu"}
        >
          VIEW ALL <LuArrowRight />
        </NavLink>
      </h1>

      {/* card container */}
      <div className="py-8 md:py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-2 gap-y-6 lg:gap-x-4 lg:gap-y-12">
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => (
              <SkeletonLoad.RecommendedCardSkeleton key={i} />
            ))
          : recommended.slice(0, 6).map((item) => {
              const prices = item.product_variants.map((v) => v.price);
              const lowestPrice = Math.min(...prices);
              return (
                // Cards
                <div
                  key={item.id}
                  onClick={() => onItemClick(item)}
                  className="flex flex-col overflow-hidden border border-foreground/20 rounded-lg shadow-md/40
                hover:border-primary hover:cursor-pointer hover:scale-102 transition-all ease-in-out duration-100"
                >
                  <div className="aspect-square shrink-0 w-full overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-4 flex flex-col gap-2">
                    <h1 className="text-sm font-semibold text-foreground leading-6 line-clamp-2">
                      {item.name}
                    </h1>

                    <h3 className="mt-auto pt-2 text-base font-semibold text-primary">
                      ₱{lowestPrice}
                    </h3>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default Recommended;
