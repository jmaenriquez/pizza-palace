import React from "react";
import { LuBell, LuLogOut, LuShoppingCart, LuUserRound } from "react-icons/lu";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Button from "../widgets/Button";
import supabase from "../config/supabase";
import { useCart } from "../context/CartContext";

interface Links {
  name: string;
  to: string;
  key: string;
}

function Topnav() {
  // ------------------------------Utilities--------------

  const nav = useNavigate();
  const { pathname } = useLocation();
  const { cartCount } = useCart();

  const { session, sessionLoading } = useAuth();

  const link: Links[] = [
    { to: "/", name: "Home", key: "home" },
    { to: "/menu", name: "Menu", key: "menu" },
    { to: "/about", name: "About Us", key: "about" },
  ];

  const heroRoutes = ["/"];
  const hasHero = heroRoutes.includes(pathname);

  // -----------------------------States-----------------------
  const [scrollY, setScrollY] = React.useState(0);
  const isSolid = !hasHero || scrollY > 50;
  const [isUserOpen, setIsUserOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // --------------------------------useEffects--------------------------

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={` w-full z-50 transition-colors duration-300
      ${hasHero ? "fixed" : "relative bg-foreground/60 backdrop-blur-sm border border-foreground/70"}
      ${isSolid ? "bg-foreground/40 backdrop-blur-sm border border-foreground/50" : ""}
    `}
    >
      <div className="flex justify-between items-center py-4 px-8">
        <div className="w-16 md:w-20">
          <img src="/logo.png" alt="" />
        </div>

        <nav className="hidden md:flex gap-4">
          {link.map((item) => (
            <NavLink key={item.key} to={item.to}>
              <span
                className={`font-poppins text-background transition-all duration-100 hover:border-b hover:border-secondary hover:text-secondary
                    ${item.to == pathname ? " border-b border-secondary text-secondary" : ""}
                  `}
              >
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        <div>
          {sessionLoading ? (
            <div></div>
          ) : session ? (
            <div className="flex items-center gap-8 text-background">
              <button>
                <LuBell className="w-5 h-5 cursor-pointer" strokeWidth={3} />
              </button>

              <button className="relative">
                <LuShoppingCart
                  className="w-5 h-5 cursor-pointer"
                  strokeWidth={3}
                  onClick={() => nav("/cart")}
                />

                <span
                  className={`${cartCount === 0 ? "hidden" : ""}  absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-background`}
                >
                  {cartCount}
                </span>
              </button>

              <div
                ref={userMenuRef}
                className="relative hidden md:flex items-center"
              >
                <button
                  type="button"
                  className="flex items-center"
                  onClick={() => setIsUserOpen((o) => !o)}
                >
                  <LuUserRound
                    className="w-5 h-5 cursor-pointer"
                    strokeWidth={3}
                  />
                </button>

                {isUserOpen && (
                  <div
                    className="absolute right-0 top-full mt-3 w-48 rounded-lg p-2
        bg-foreground/90 backdrop-blur-sm shadow-lg
        border border-background/10 text-background"
                  >
                    <div className="flex flex-col">
                      <NavLink
                        to="/profile"
                        onClick={() => setIsUserOpen(false)}
                        className="px-3 py-2 rounded-md font-poppins text-sm cursor-pointer
            hover:bg-background/10 hover:text-secondary transition-colors"
                      >
                        Profile
                      </NavLink>

                      <button
                        type="button"
                        onClick={() => setIsUserOpen(false)}
                        className="text-left px-3 py-2 rounded-md font-poppins text-sm cursor-pointer
            hover:bg-background/10 hover:text-secondary transition-colors"
                      >
                        Settings
                      </button>
                    </div>

                    <div className="my-2 border-t border-background/10" />

                    <Button.Solid
                      icon={LuLogOut}
                      name="Log out"
                      type="button"
                      onClick={async () => {
                        setIsUserOpen(false);
                        await supabase.auth.signOut();
                      }}
                      iconRight={true}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-4 shrink-0">
              <Button.Hollow
                name="Sign Up"
                type="button"
                onClick={() => nav("/signup")}
              />
              <Button.Solid
                name="Log In"
                type="button"
                onClick={() => nav("/login")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topnav;
