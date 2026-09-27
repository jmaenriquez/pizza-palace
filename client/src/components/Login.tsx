import React from "react";
import Register from "./Register";
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

  const nav = useNavigate()

  const [user, setUser] = React.useState<Creds>({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setUser((u) => ({ ...u, [e.target.name]: e.target.value }));
  };
  return (

    <div className="w-full">

      <div className="w-full">

        <div className="grid gap-4">
          <div className="flex justify-center items-center md:hidden">
            <img 
              src="/logo.png" alt=""
              className="w-32"
            />
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
              onClick={() => console.log("Login Clicked")}
            />

            <Button.Hollow
              name="Sign Up"
              type="button"
              onClick={() => { nav('/signup') }}
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
