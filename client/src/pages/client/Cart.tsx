import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import supabase from "../../config/supabase";
import api from "../../api/requests/cartRequest";
import productAPI from "../../api/requests/productRequest";

import toast from "react-hot-toast";
import Button from "../../widgets/Button";
import { LuMinus, LuPlus, LuTrash2, LuShoppingBasket, LuArrowRight } from "react-icons/lu";
import type { ProductWithVariants } from "../../api/requests/productRequest";

interface CartItem {
  id: string;
  quantity: number;
  is_checked: boolean;

  product_variants: {
    id: string;
    label: string | null;
    price: number;
    products: {
      id: string;
      name: string;
      image_url: string;
    };
  };

  available_variants: {
    id: string;
    label: string | null;
    price: number;
  }[];
}

function Cart() {
  // ---------------------------------------- utilities ------------------------------------------
  const nav = useNavigate();

  // ---------------------------------------- states ---------------------------------------------

  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [recommended, setRecommended] = React.useState<ProductWithVariants[]>(
    [],
  );

  // -------------------------------------------- functions --------------------------------------------

  const fetchRecommended = async () => {
    setRecommended(await productAPI.getRequest());
  };

  const updateQuantity = async (id: string, num: number) => {
    const item = cart.find((c) => c.id === id);

    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + num);

    try {
      await api.updateItem(id, { quantity: newQuantity });
      setCart((prev) =>
        prev.map((c) => (c.id === id ? { ...c, quantity: newQuantity } : c)),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    }
  };

  const updateVariant = async (id: string, variantId: string) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;

    const selectedVariant = item.available_variants.find(
      (v) => v.id === variantId,
    );

    if (!selectedVariant) {
      toast.error("Selected variant not found.");
      return;
    }

    try {
      await api.updateItem(id, { variantId });

      setCart((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                product_variants: {
                  ...selectedVariant,
                  products: item.product_variants.products,
                },
              }
            : item,
        ),
      );

      toast.success("Variant updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change variant.");
    }
  };

  const removeItem = async (id: string) => {
    try {
      await api.removeFromCart(id);
      setCart((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item removed.");
    } catch (err) {
      console.error(err);
      toast.error("Could not remove item.");
    }
  };

  const toggleChecked = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_checked: !item.is_checked } : item,
      ),
    );
  };

  const checkedItems = cart.filter((item) => item.is_checked);
  const subtotal = checkedItems.reduce(
    (sum, item) => sum + item.quantity * item.product_variants.price,
    0,
  );

  const allChecked = cart.every((item) => item.is_checked);

  const toggleSelectAll = () => {
    const shouldCheckAll = !allChecked;

    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        is_checked: shouldCheckAll,
      })),
    );
  };

  const handleCheckout = () => {
    nav('/checkout', { state: { checked_items: checkedItems } })
  }

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

  // -------------------------------------------- useEffect ---------------------------------

  React.useEffect(() => {
    async function loadCart() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        nav("/login");
        return;
      }

      try {
        const data = await api.getCartItems();
        setCart(data.map((item: CartItem) => ({ ...item, is_checked: false })));
      } catch (err) {
        console.error(err);
        toast.error("Could not load your cart.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();
  }, []);

  React.useEffect(() => {
    fetchRecommended().catch((err) => console.error(err));
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-foreground/60">Loading your cart...</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-8 lg:py-12 lg:px-10">
      {
        cart.length === 0 ?

      <div className="flex flex-col items-center justify-center gap-4 px-6 text-center">
        <LuShoppingBasket className="h-12 w-12 text-foreground/30" />
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <p className="text-sm text-foreground/60">
          Add a pizza from the menu to get started.
        </p>
        <div className="mt-2 w-48">
          <Button.Solid
            name="Browse menu"
            type="button"
            onClick={() => nav("/menu")}
          />
        </div>
      </div>
      :
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Your cart
        </h1>
        <p className="mt-1 text-sm text-foreground/60">
          {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-5">
          {/* Select all Isle*/}
          <div className="rounded-xl border border-foreground/10 p-4 shadow-sm sm:p-5 lg:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleSelectAll}
                className="h-4 w-4 shrink-0 accent-primary"
              />
              <span className="text-sm font-medium">Select all</span>
            </label>
          </div>

          {/* Item list */}
          <div className="grid gap-4 lg:col-span-2">
            {cart.map((item) => {
              const { label, price, products } = item.product_variants;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-foreground/10 p-4 shadow-sm sm:p-5 hover:bg-foreground/5"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.is_checked}
                      onChange={() => toggleChecked(item.id)}
                      className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    />
                  </div>

                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-foreground/5 sm:h-24 sm:w-24">
                    <img
                      src={products.image_url}
                      alt={products.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="truncate font-semibold">
                            {products.name}
                          </h2>
                          {item.available_variants.length === 1 ? (
                            <p className="text-xs text-foreground/50">
                              {label == "" ? "Standard" : label}
                            </p>
                          ) : (
                            <select
                              name="variant"
                              value={item.product_variants.id}
                              onChange={(e) =>
                                updateVariant(item.id, e.target.value)
                              }
                              aria-label={`Choose variant for ${products.name}`}
                              className="max-w-full cursor-pointer appearance-none rounded-md bg-transparent py-1 pr-5 text-xs font-medium text-foreground/70 outline-none transition-colors sm:text-sm accent-primary"
                              style={{
                                backgroundImage:
                                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right center",
                              }}
                            >
                              {item.available_variants.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.label ?? "Standard"}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 text-foreground/40 transition-colors hover:text-primary"
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-foreground/15 px-3 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-foreground/60 hover:text-primary"
                        >
                          <LuMinus className="h-4 w-4" />
                        </button>
                        <span className="w-4 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-foreground/60 hover:text-primary"
                        >
                          <LuPlus className="h-4 w-4" />
                        </button>
                      </div>

                      <span className="font-semibold text-primary">
                        ₱{(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="sticky top-6 rounded-xl border border-foreground/10 p-5 shadow-sm sm:p-6">
            <h2 className="font-semibold">Order summary</h2>

            <div className="mt-4 flex items-center justify-between text-sm text-foreground/60">
              <span>
                Subtotal ({checkedItems.length}{" "}
                {checkedItems.length === 1 ? "item" : "items"})
              </span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-5 border-t border-foreground/10 pt-5">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold text-primary">
                  ₱{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <Button.Solid
                name="Checkout"
                type="button"
                disabled={checkedItems.length === 0 ? true : false}
                onClick={handleCheckout}
              />
            </div>
          </div>
        </div>
      </div>
      }
      

      {/* Recommendations */}
      <div className="mt-auto pt-8">
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

export default Cart;
