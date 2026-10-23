import { useNavigate } from "react-router-dom";
import {
  LuClock3,
  LuCrown,
  LuFlame,
  LuHeart,
  LuMapPin,
  LuPhone,
} from "react-icons/lu";

import Button from "../../widgets/Button";

const values = [
  {
    icon: LuFlame,
    title: "Baked fresh, every order",
    text: "Dough is stretched by hand and every pizza goes into the oven only after you order it. Nothing sits under a heat lamp.",
  },
  {
    icon: LuCrown,
    title: "Fit for royalty, priced for everyone",
    text: "From the Emperor Supreme to the King Pepperoni, we keep the toppings generous and the prices friendly.",
  },
  {
    icon: LuHeart,
    title: "Made for sharing",
    text: "Platters, sides and big pizzas for family dinners, barkada nights and birthdays.",
  },
];

function AboutUs() {
  const nav = useNavigate();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8 lg:py-12">
      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Every pizza
            <br />
            deserves a crown.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-foreground/60">
            Pizza Palace is a neighborhood pizzeria in Somewhere City. We bake
            big, cheesy, generously topped pizzas and serve them like the royal
            feast they are.
          </p>
          <div className="mt-7 w-44">
            <Button.Solid
              name="Browse the menu"
              type="button"
              onClick={() => nav("/menu")}
            />
          </div>
        </div>

        <div className="relative">
          <div className="max-w-120 aspect-square overflow-hidden rounded-3xl bg-foreground/5 shadow-md">
            <img
              src="/Menu/Pizzas/Emperor Supreme.webp"
              alt="Emperor Supreme pizza"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-xl bg-primary px-4 py-3 text-white shadow-lg sm:left-6">
            <p className="text-sm font-semibold">Emperor Supreme</p>
            <p className="text-xs text-white/80">Our most-ordered pizza</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto mt-20 lg:mt-28 flex flex-col-reverse lg:flex-row gap-8 items-center">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-foreground/5 shadow-md">
            <img
              src="storefront.png"
              alt="Emperor Supreme pizza"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-xl bg-primary px-4 py-3 text-white shadow-lg sm:left-6">
            <p className="text-sm font-semibold">Where it all started</p>
            <p className="text-xs text-white/80 flex gap-1 items-center">
              <LuMapPin strokeWidth={3} /> Some City, Philippines
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            How the palace got its throne
          </h2>
          <div className="mt-5 grid gap-4 text-base leading-relaxed text-foreground/65">
            <p>
              It started with a simple idea: pizza night should feel like an
              occasion. We wanted a place where the crust is properly chewy, the
              cheese stretches, and nobody leaves hungry.
            </p>
            <p>
              Today our kitchen still works the same way. We make the dough
              fresh, choose toppings we would happily put on our own tables, and
              name every pizza after the kingdom it came from, so ordering is
              half the fun.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mt-20 lg:mt-28">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          What we care about
        </h2>
        <div className="mt-8 divide-y divide-foreground/10 border-y border-foreground/10">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="grid gap-3 py-6 sm:grid-cols-[auto_1fr] sm:gap-6 md:grid-cols-[auto_1fr_2fr]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="self-center text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-foreground/60 sm:col-start-2 md:col-start-3 md:self-center">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section className="mt-8 overflow-hidden rounded-3xl bg-primary text-white lg:mt-10">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Come say hi, or let us come to you
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
              Pick up your order at the store or have it delivered to your door.
              Either way, it reaches you hot.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => nav("/menu")}
                className="cursor-pointer rounded-lg bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
              >
                Order now
              </button>
              <button
                type="button"
                onClick={() => nav("/cart")}
                className="cursor-pointer rounded-lg border border-white/50 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                View cart
              </button>
            </div>
          </div>

          <ul className="grid gap-4 text-sm">
            <li className="flex items-start gap-3">
              <LuMapPin className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                <span className="block font-semibold">
                  Pizza Palace Main Store
                </span>
                <span className="text-white/80">
                  123 Sample Street, Some City, Some Place, Philippines
                </span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <LuClock3 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                <span className="block font-semibold">Open daily</span>
                <span className="text-white/80">10:00 AM to 10:00 PM</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <LuPhone className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                <span className="block font-semibold">Call us</span>
                <span className="text-white/80">0900 000 0000</span>
              </span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

export default AboutUs;
