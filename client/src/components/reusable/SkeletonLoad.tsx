function ProductCardSkeleton() {
  return (
    <div className="animate-pulse duration-100 overflow-hidden rounded-2xl border border-foreground/10 bg-background">
      <div className="aspect-square w-full bg-foreground/20" />
      <div className="grid gap-2 p-4">
        <div className="h-4 w-3/4 rounded bg-foreground/20" />
        <div className="h-3 w-1/2 rounded bg-foreground/10" />
        <div className="h-9 w-full rounded-lg bg-foreground/15" />
      </div>
    </div>
  );
}

function RecommendedCardSkeleton() {
  return (
    <div className="animate-pulse duration-100 overflow-hidden rounded-2xl border border-foreground/10 bg-background">
      <div className="aspect-square w-full bg-foreground/20" />
      <div className="flex flex-col gap-4 p-4">
        <div className="h-4 w-3/4 rounded bg-foreground/20" />
        <div className="h-4 w-full rounded-lg bg-foreground/15" />
      </div>
    </div>
  );
}


function CartItemSkeleton() {
  return (
    <div className="flex animate-pulse gap-4 rounded-xl border border-foreground/10 p-4 shadow-sm sm:p-5">
      <div className="flex items-center">
        <div className="h-4 w-4 shrink-0 rounded bg-foreground/10" />
      </div>

      <div className="h-20 w-20 shrink-0 rounded-lg bg-foreground/10 sm:h-24 sm:w-24" />

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="h-4 w-2/3 rounded bg-foreground/10" />
            <div className="mt-2 h-3 w-1/4 rounded bg-foreground/10" />
          </div>
          <div className="h-4 w-4 shrink-0 rounded bg-foreground/10" />
        </div>

        <div className="mt-2 flex items-end justify-between">
          <div className="h-8 w-24 rounded-full bg-foreground/10" />
          <div className="h-5 w-16 rounded bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

function AdminMenuSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse flex-col lg:flex-row border border-foreground/10 rounded-lg shadow-md/10"
    >
      {/* image */}
      <div className="lg:w-50 aspect-square shrink-0 rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none bg-foreground/10" />

      <div className="flex-1 min-w-0 p-4 flex flex-col gap-3">
        {/* name + price */}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-2">
          <div className="h-4 lg:h-6 w-3/4 lg:w-1/3 rounded bg-foreground/10" />
          <div className="h-4 lg:h-6 w-1/3 lg:w-28 rounded bg-foreground/10" />
        </div>

        {/* description (third line only shows on lg, like your line-clamp) */}
        <div className="grid gap-2">
          <div className="h-3 w-full rounded bg-foreground/10" />
          <div className="h-3 w-4/5 rounded bg-foreground/10" />
          <div className="hidden lg:block h-3 w-2/3 rounded bg-foreground/10" />
        </div>

        {/* variant chips */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-14 rounded-full bg-foreground/10" />
          <div className="h-6 w-16 rounded-full bg-foreground/10" />
        </div>

        {/* stocks + mobile menu */}
        <div className="mt-auto flex items-center justify-between">
          <div className="h-4 w-20 rounded bg-foreground/10" />
          <div className="lg:hidden h-6 w-6 rounded bg-foreground/10" />
        </div>
      </div>

      {/* desktop menu */}
      <div className="hidden lg:flex items-center px-8">
        <div className="h-6 w-6 rounded bg-foreground/10" />
      </div>
    </div>
  );
}

export default { ProductCardSkeleton, RecommendedCardSkeleton, CartItemSkeleton, AdminMenuSkeleton };