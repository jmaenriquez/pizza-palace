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

function OrderCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex animate-pulse items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      {/* left: id + status badge, item name, customer */}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-5 w-20 rounded-full bg-gray-200" />
        </div>
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
      </div>

      {/* right: total + action button */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <div className="h-5 w-14 rounded bg-gray-200" />
        <div className="h-9 w-20 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

function Bone({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-foreground/10 ${className}`} />
  );
}

function SkeletonCard({
  children,
  withSubtitle = false,
}: {
  children: React.ReactNode;
  withSubtitle?: boolean;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm">
      <div className="border-b border-dashed border-foreground/20 p-5 sm:p-6">
        <Bone className="h-5 w-40" />
        {withSubtitle && <Bone className="mt-2 h-4 w-64 max-w-full" />}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function ProfileSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading profile"
      className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:px-6 md:py-8 md:pb-8 lg:px-8 lg:py-12"
    >
      {/* Identity banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-sm">
        <div className="h-20 animate-pulse bg-foreground/10 sm:h-24" />
        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6">
          <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-full border-4 border-background bg-foreground/15 sm:h-24 sm:w-24" />
            <div className="grid gap-2 pb-1">
              <Bone className="h-6 w-48 sm:h-7" />
              <Bone className="h-4 w-36" />
            </div>
          </div>
          <Bone className="h-9 w-28 rounded-lg" />
        </div>

        <div className="grid grid-cols-3 divide-x divide-dashed divide-foreground/20 border-t border-dashed border-foreground/20">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 px-3 py-4 sm:py-5">
              <Bone className="h-6 w-8" />
              <Bone className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left column */}
        <div className="grid gap-6 lg:col-span-2">
          {/* Personal info */}
          <SkeletonCard withSubtitle>
            <div className="grid gap-5 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Bone className="h-9 w-9 shrink-0 rounded-lg" />
                  <div className="grid gap-2">
                    <Bone className="h-3 w-16" />
                    <Bone className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Addresses */}
          <SkeletonCard withSubtitle>
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="grid gap-3 rounded-xl border border-foreground/10 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Bone className="h-4 w-4 rounded-full" />
                    <Bone className="h-4 w-24" />
                  </div>
                  <Bone className="h-3 w-full" />
                  <Bone className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right column */}
        <div className="grid gap-6">
          {/* Recent orders */}
          <SkeletonCard>
            <ul className="grid gap-3">
              {[0, 1, 2].map((i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-foreground/10 p-3"
                >
                  <Bone className="h-10 w-10 shrink-0 rounded-lg" />
                  <div className="grid flex-1 gap-2">
                    <div className="flex justify-between gap-2">
                      <Bone className="h-4 w-20" />
                      <Bone className="h-4 w-14" />
                    </div>
                    <Bone className="h-3 w-28" />
                    <div className="flex justify-between gap-2">
                      <Bone className="h-4 w-16 rounded-full" />
                      <Bone className="h-3 w-16" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </SkeletonCard>

          {/* Account */}
          <SkeletonCard>
            <div className="grid gap-3">
              <Bone className="h-10 w-full rounded-lg" />
              <Bone className="h-10 w-full rounded-lg" />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </main>
  );
}

export default { ProductCardSkeleton, RecommendedCardSkeleton, CartItemSkeleton, AdminMenuSkeleton, OrderCardSkeleton, ProfileSkeleton };