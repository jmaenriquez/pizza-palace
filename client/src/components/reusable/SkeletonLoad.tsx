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

export default { ProductCardSkeleton, RecommendedCardSkeleton, CartItemSkeleton };