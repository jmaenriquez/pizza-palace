import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { type ProductWithVariants } from "../../api/requests/productRequest";

import api from "../../api/requests/cartRequest";
import productAPI from '../../api/requests/productRequest'
import supabase from "../../config/supabase";

import toast from "react-hot-toast";
import Button from "../../widgets/Button";
import { LuArrowLeft, LuArrowRight, LuMinus, LuPlus, LuShoppingBasket } from "react-icons/lu";

function Item() {
  // ----------------------------------------------------- utilities ---------------------------------------------
  const nav = useNavigate();
  const loc = useLocation();

  const product = loc.state?.products as ProductWithVariants | undefined;

  // --------------------------------------------------------- states ------------------------------------------------

  const [selectedVariantId, setSelectedVariantId] = React.useState(
    product?.product_variants.reduce<
      (typeof product.product_variants)[number] | null
    >(
      (lowest, variant) =>
        !lowest || Number(variant.price) < Number(lowest.price)
          ? variant
          : lowest,
      null,
    )?.id ?? "",
  );

  const [quantity, setQuantity] = React.useState(1);

  const [recommended, setRecommended] = React.useState<ProductWithVariants[]>(
    [],
  );

  // ------------------------------------------------------ functions --------------------------------------------------

  const addQuantity = () => {
    setQuantity(quantity + 1);
  };

  const subQuantity = () => {
    setQuantity(quantity - 1);
  };

  const fetchRecommended = async () => {
    setRecommended(await productAPI.getRequest());
  };

  const onItemClick = (p: ProductWithVariants) => {
    nav(`/menu/view/${p.id}`, {
      state: {
        products: p,
      },
    });
  };

  function shuffle<T>(items: T[]): T[] {
    const a = [...items];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
    return a;
  }

  const picks = React.useMemo(
    () => shuffle(recommended).slice(0, 6),
    [recommended],
  );

  if (!product) {
    return (
      <div className="p-6">
        <p>Product not found.</p>
        <button onClick={() => nav("/menu")} className="mt-3 text-primary">
          Back to Menu
        </button>
      </div>
    );
  }

  const sortedVariants = [...product.product_variants].sort(
    (a, b) => Number(a.price) - Number(b.price),
  );

  const selectedVariant = product.product_variants.find(
    (v) => v.id === selectedVariantId,
  );

  const price = Number(selectedVariant?.price ?? 0) * quantity;

  const handleAddToCart = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      if (!selectedVariant) {
        toast.error("Please select a variant.");
        return;
      }

      if (!session) {
        nav("/login");
        return;
      }

      await api.addToCart({ variantId: selectedVariant.id, quantity });
      toast.success(`${product.name} has been added to cart.`);
    } catch (err) {
      console.error(err);
      toast.error(
        `${product.name} cannot be added to cart, please try again later.`,
      );
    }
  };

  // ---------------------------------------------- useEffect ----------------------------------------------------

  React.useEffect(() => {
      fetchRecommended().catch((err) => console.error(err));
    }, []);


  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:py-12 lg:px-10 xl:px-12">
      <button
        type="button"
        onClick={() => nav("/menu")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-primary hover:cursor-pointer transition-all hover:gap-3"
      >
        <LuArrowLeft />
        <p>Back to Menu</p>
      </button>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
        <section className="min-w-0">
          <div className="flex w-full items-center justify-center overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/2">
            <img
              src={product.image_url}
              alt={product.name}
              className="block h-auto max-h-150 w-full object-cover"
            />
          </div>

          <div className="mt-5 space-y-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <p className="text-sm leading-6 text-foreground/65 sm:text-base line-clamp-2">
              {product.description || "A delicious addition to your meal."}
            </p>
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Customize your order
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Choose your variant
            </h2>

            <p className="mt-2 text-sm text-foreground/60">
              Select the option that suits you best.
            </p>
          </div>

          <div className="space-y-3">
            {sortedVariants.map((v) => {
              const isSelected = selectedVariantId === v.id;

              return (
                <label
                  key={v.id}
                  htmlFor={`variant-${v.id}`}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-foreground/15 hover:border-primary/50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <input
                      type="radio"
                      id={`variant-${v.id}`}
                      name="variants"
                      value={v.id}
                      checked={isSelected}
                      onChange={() => setSelectedVariantId(v.id)}
                      className="h-4 w-4 shrink-0 accent-primary"
                    />

                    <span className="font-medium">{v.label || "Standard"}</span>
                  </div>

                  <span className="shrink-0 font-semibold">
                    ₱{Number(v.price).toFixed(2)}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <button onClick={subQuantity}>
              <LuMinus className="w-5 h-5 hover:cursor-pointer" />
            </button>

            <input
              type="text"
              value={quantity}
              className="w-12 p-2 font-semibold text-center"
              maxLength={2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                if (raw === "") {
                  setQuantity(0);
                  return;
                }
                setQuantity(Math.min(Number(raw), 30));
              }}
            />

            <button onClick={addQuantity}>
              <LuPlus className="w-5 h-5 hover:cursor-pointer" />
            </button>
          </div>

          <div className="mt-6 border-t border-foreground/10 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-foreground/60">Total price</span>

              <span className="text-2xl font-bold text-primary sm:text-3xl">
                ₱{price.toFixed(2)}
              </span>
            </div>

            <div className="mt-5">
              <Button.Solid
                icon={LuShoppingBasket}
                name="Add to cart"
                type="button"
                iconRight={true}
                onClick={() => {
                  handleAddToCart();
                }}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Recommendations */}
      <div className="mt-auto pt-20">
        <h1 className="text-lg md:text-xl font-semibold flex justify-between items-center">
          Recommended{" "}
          <NavLink
            className="flex items-center text-sm gap-4 text-gray-400 hover:text-primary transition-colors delay-50"
            to={'/menu'}
          >
            VIEW ALL <LuArrowRight />
          </NavLink>
        </h1>

        {/* card container */}
        <div className="py-8 md:py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-2 gap-y-6 lg:gap-x-4 lg:gap-y-12">
          {picks.slice(0, 6).map((item) => {
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
        <div></div>
      </div>
    </main>
  );
}

export default Item;
