import React from "react";
import toast from "react-hot-toast";
import supabase from "../config/supabase";

import Button from "../widgets/Button";
import Fields from "../widgets/Fields";

import { NavLink, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";

interface UserCreds {
  email: string;
  password: string;
  fname: string;
  mname: string;
  lname: string;
  contact: string;
  birthday: string;
}

function Register() {

  // ---------------------------------utilities--------------------------

  const nav = useNavigate();

  //--------------------------States-------------------------------

  const [user, setUser] = React.useState<UserCreds>({
    email: "",
    password: "",
    fname: "",
    mname: "",
    lname: "",
    contact: "",
    birthday: "",
  });

  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [navStep, setNavStep] = React.useState(0);

  //--------------------------Functions-----------------------------

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setUser((u) => ({ ...u, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
       setNavStep( navStep + 1)
  }

  const handleBack = () => {
       setNavStep( navStep - 1)
  }

  const handleSubmit = async () => {
    try{
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
      })

      if(authError){
        console.error('Failed to create account:', authError.message)
        toast.error(authError.message)
        return
      }

      if(!authData.user){
        console.error('Signup success but no user was returned' );
        return; 
      }

      const { error: profileError } = await supabase
      .from('user_infos')
      .insert({
        id: authData.user.id,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        birthday: user.birthday,
        contact: user.contact,
      })

      if(profileError){
        console.error('Failed to save user info: ', profileError.message );
        toast.error(profileError.message);
        return
      }

      toast.success('User created successfully.')
      setUser({ email: "", password: "", fname: "", mname: "", lname: "", contact: "", birthday: "" });
      nav('/login');
    }catch(err){
      console.error(err);
    } 
  }

  const confirmPasswordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  return (
    <div className="w-full">
      <div className="grid gap-8">
        <div className="grid gap-4">

          <div className="flex justify-center items-center md:hidden">
            <img src="/logo.png" alt="" className="w-32" />
          </div>

          <h1 className="font-poppins font-semibold text-center text-lg lg:text-2xl ">
            Create an Account
          </h1>

          <div className="flex justify-center">
            <div className="w-50 h-0.5 rounded-full bg-gray-300 flex items-center justify-between">
              <div
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-gray-300 ${
                  navStep == 0? "bg-primary" : ''
                }`}
              />

              <div
                className={`w-2.5 h-2.5 rounded-full bg-gray-300 ${
                  navStep == 1? "bg-primary" : ''
                }`}
              />

              <div
                className={`w-2.5 h-2.5 rounded-full bg-gray-300 ${
                  navStep == 2? "bg-primary" : ''
                }`}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            {
              navStep === 0 &&
              <>
                <div className="">
                  <Fields.Input
                    name="fname"
                    placeholder="First Name"
                    value={user.fname}
                    type="text"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Fields.Input
                    name="mname"
                    placeholder="Middle Name"
                    value={user.mname}
                    type="text"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Fields.Input
                    name="lname"
                    placeholder="Last Name"
                    value={user.lname}
                    type="text"
                    onChange={handleChange}
                  />
                </div>
              </>
            }

            {
              navStep === 1 &&
              <>
                <div className="">
                  <Fields.Input
                    name="birthday"
                    placeholder=""
                    value={user.birthday}
                    type="date"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Fields.Input
                    name="contact"
                    placeholder="Contact Number"
                    value={user.contact}
                    type="text"
                    onChange={handleChange}
                  />
                </div>
              </>
            }

            {
              navStep === 2 &&
              <>
                <div className="">
                  <Fields.Input
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    type="text"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Fields.Input
                    name="password"
                    placeholder="Password"
                    value={user.password}
                    type="password"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Fields.Input
                    name="confirm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    type="password"
                    onChange={confirmPasswordOnChange}
                  />
                </div>
              </>
            }
          </form>

          <div className="grid gap-2">

            {
              navStep !== 2 ?
              <Button.Solid
                name="Next"
                type="button"
                onClick={handleNext}
              />
              :
              <Button.Solid
                name="Sign Up"
                type="button"
                onClick={handleSubmit}
              />
            }

            {
              navStep !== 0 &&
              <Button.Hollow
                name="Back"
                type="button"
                onClick={handleBack}
              />
            }

            <div className="flex justify-center mt-2">
              <p className="font-poppins text-xs md:text-sm text-gray-400">Already have an account?
                <NavLink to={'/login'} replace className={'text-primary'}> Log in </NavLink>
              </p>
            </div>
          </div>



          <div className="flex justify-between gap-4 items-center">
            <div className="w-full h-0.5 bg-gray-300 rounded-full" />
            <p className="shrink whitespace-nowrap text-xs lg:text-sm text-gray-600">
              or sign up with
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

export default Register;
