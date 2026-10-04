import React from "react";
import toast from "react-hot-toast";
import supabase from "../config/supabase";

import Button from "../widgets/Button";
import Fields from "../widgets/Fields";

import { useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { LuLock, LuUserRound } from "react-icons/lu";

interface Creds {
  email: string;
  password: string;
}

function Login() {
  // ----------------------------------utilities--------------------
  const nav = useNavigate();

  // ----------------------------------states----------------------------
  const [user, setUser] = React.useState<Creds>({
    email: "",
    password: "",
  });

  // ------------------------------Functions------------------------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setUser((u) => ({ ...u, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
      });

      if (error) {
        console.log("Error Logging in: ", error.message);
        toast.error(error.message);

        return;
      }

      const { data: profile } = await supabase
        .from("user_infos")
        .select("role")
        .eq("id", data.user.id)
        .single();

      toast.success("Login success.");

      if (profile?.role === "Admin") {
        nav("/admin");
      } else {
        nav("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="grid gap-4">
          <div className="flex justify-center items-center md:hidden">
            <img src="/logo.png" alt="" className="w-32" />
          </div>

          <h1 className="font-poppins mb-8 font-semibold text-center text-lg lg:text-2xl ">
            Login to Pizza Palace
          </h1>
        </div>

        <div className="grid gap-8">
          <form
            onSubmit={(e) => e.preventDefault}
            className="flex flex-col gap-4"
          >
            <div className="">
              <Fields.Input
                icon={LuUserRound}
                name="email"
                placeholder="Email"
                value={user.email}
                type="text"
                onChange={handleChange}
              />
            </div>

            <div>
              <Fields.Input
                icon={LuLock}
                name="password"
                placeholder="Password"
                value={user.password}
                type="password"
                onChange={handleChange}
              />
            </div>
          </form>

          <div className="grid gap-2">
            <Button.Solid
              name="Log In"
              type="button"
              onClick={handleLogin}
            />

            <Button.Hollow
              name="Sign Up"
              type="button"
              onClick={() => {
                nav("/signup");
              }}
            />
          </div>

          <div className="flex justify-between gap-4 items-center">
            <div className="w-full h-0.5 bg-gray-300 rounded-full" />
            <p className="shrink whitespace-nowrap text-xs lg:text-sm text-gray-500">
              or sign in with
            </p>
            <div className="w-full h-0.5 bg-gray-300 rounded-full" />
          </div>

          <div className=" grid lg:grid-cols-2 gap-2 lg:gap-4">
            <Button.Hollow
              icon={FaFacebook}
              name="Facebook"
              type="button"
              onClick={() => console.log("Facebook Clicked")}
            />

            <Button.Hollow
              icon={FaGoogle}
              name="Google"
              type="button"
              onClick={() => console.log("Google Clicked")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
