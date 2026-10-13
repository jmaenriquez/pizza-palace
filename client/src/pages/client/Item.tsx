
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type ProductWithVariants } from "../../api/requests/productRequest";

import toast from "react-hot-toast";
import Button from "../../widgets/Button";
import { LuArrowLeft, LuShoppingBasket } from "react-icons/lu";

function Item() {
  const loc = useLocation();
  const nav = useNavigate();

  const product = loc.state?.products as
    | ProductWithVariants
    | undefined;

  const [selectedVariantId, setSelectedVariantId] =
    React.useState(product?.product_variants[0]?.id ?? "");

  if (!product) {
    return (
      <div className="p-6">
        <p>Product not found.</p>
        <button
          onClick={() => nav("/menu")}
          className="mt-3 text-primary"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  // Sort a copy, so the original product array isn't mutated.
  const sortedVariants = [...product.product_variants].sort(
    (a, b) => Number(a.price) - Number(b.price)
  );

  const selectedVariant = product.product_variants.find(
    (v) => v.id === selectedVariantId
  );

  const price = Number(selectedVariant?.price ?? 0);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-10 xl:px-12">
      <button
        type="button"
        onClick={() => nav("/menu")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
      >
        <LuArrowLeft />
        Back to Menu
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

                    <span className="font-medium">
                      {v.label || "Standard"}
                    </span>
                  </div>

                  <span className="shrink-0 font-semibold">
                    ₱{Number(v.price).toFixed(2)}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Price summary */}
          <div className="mt-6 border-t border-foreground/10 pt-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-foreground/60">
                Total price
              </span>

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
                  if (!selectedVariant) {
                    toast.error("Please select a variant.");
                    return;
                  }

                  console.log("Product:", product);
                  console.log("Selected variant:", selectedVariant);
                  console.log("Price:", price);
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Item;
