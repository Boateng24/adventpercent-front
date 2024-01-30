import { Link, useNavigate } from "react-router-dom";
import {RightImage} from "../Components/RightImage";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { loginUser } from "../features/loginUser.slice";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { validate } from "../helpers/displayErrors";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loginUser);
  const InitialState = {
    email: "",
    password: "",
  };
  const [errors, setErrors] = useState({});
  const [login, setLogin] = useState(true);
  const [inputs, setInputs] = useState(InitialState);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const { email, password } = inputs;
  const resetState = () => {
    setLogin(!login);
    setInputs(InitialState);
    console.log(login);
    console.log(inputs);
  };

 const handleSubmit = (e) => {
   e.preventDefault();
   console.log(email, password);
    console.log('entered')
    if(validate(inputs, setErrors)) {
     dispatch(loginUser({ email, password }))
       .then((result) => {
         console.log("result", result);
         console.log("error", errors);
         if (result.payload?.status === 200) {
           toast.success("Login Successful");
           resetState();
           navigate("/");
         }
       })
       .catch((error) => {
         console.log("error", error);
       });
      }
 };
  return (
    <div className="flex flex-row w-screen h-screen">
      <section className="flex flex-col justify-between items-start flex-1 self-stretch">
        <form
          action=""
          className="flex w-[440px] flex-col items-center gap-6 px-10 py-8 rounded-lg border-b-2 border-[#135352] bg-white shadow-md ml-32 mt-32"
          onSubmit={handleSubmit}
        >
          <header className="flex flex-col items-center gap-6 self-stretch">
            <Link to={"/"}>
              <img
                src="/src/assets/advlogo.svg"
                alt="signuplogo"
                className="w-16 h-16 rounded-full lightgray 50% / cover no-repeat"
              />
            </Link>
            <h1 className="self-stretch text-gray-900 text-center font-inter font-semibold text-xl">
              Sign in
            </h1>
          </header>
          {errors?.email && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "-20px"}}>
              {errors?.email}
            </p>
          )}
          <input
            type="text"
            className={`flex p-2.5 px-3.5 items-center gap-2 self-stretch rounded-md border ${
              errors?.email ? "border-red-500" : "border-gray-300"
            } bg-white shadow-xs`}
            placeholder="Enter your email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
          {errors?.password && (
            <p
              style={{ color: "red", marginBottom: "-20px", fontSize: "14px" }}
            >
              {errors?.password}
            </p>
          )}
          <input
            type="password"
            className={`flex p-2.5 px-3.5 items-center gap-2 self-stretch rounded-md border ${
              errors?.password ? "border-red-500" : "border-gray-300"
            } bg-white shadow-xs`}
            placeholder="Enter your password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
          <div className="actions flex flex-col items-start gap-4 self-stretch">
            <button className="flex p-2 px-4 justify-center items-center gap-2 flex-1 rounded-md border border-[#135352] bg-[#135352] shadow-xs self-stretch"
            type="submit"
            >
              {loading ? (
                <Spin style={{ color: "whitesmoke" }} />
              ) : (
                <span className="text-white">Sign In</span>
              )}
            </button>

            <div className="socialbuttongroup flex flex-col justify-center items-center gap-3 self-stretch">
              <button className="google flex p-2.5 px-4 justify-center items-center gap-3 self-stretch rounded-md border border-gray-300 bg-white shadow-xs">
                <img src="/src/assets/google.svg" alt="google" />
                Sign in with Google
              </button>
              <button className="facebook flex p-2.5 px-4 justify-center items-center gap-3 self-stretch rounded-md border border-gray-300 bg-white shadow-xs">
                <img src="/src/assets/facebook.svg" alt="facebook" />
                Sign in with Facebook
              </button>
            </div>
            <div className="flex justify-center items-start gap-1 self-stretch">
              <p className="text-gray-500 font-inter text-sm font-normal leading-5">
                Don&apos;t have an account?
              </p>
              <Link to={"/signup"}>
                <button className="flex justify-center items-center gap-2">
                  <p className="text-[#135352] font-inter text-sm font-medium leading-5">
                    Sign up
                  </p>
                </button>
              </Link>
            </div>
            <div className="flex justify-center items-start gap-1 self-stretch">
              <p className="text-gray-500 font-inter text-sm font-normal leading-5">
                Forgot Password?
              </p>
              <Link to={"/reset"}>
                <button className="flex justify-center items-center gap-2">
                  <p className="text-[#135352] font-inter text-sm font-medium leading-5">
                    Click Here
                  </p>
                </button>
              </Link>
            </div>
          </div>
        </form>
      </section>
      <section className="flex self-stretch flex-1">
        <RightImage />
      </section>
    </div>
  );
};

export default Login;
