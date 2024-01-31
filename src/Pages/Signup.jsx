import { Link, useNavigate } from "react-router-dom";
import { useState} from "react";
import {RightImage} from "../Components/RightImage";
import { useDispatch, useSelector} from "react-redux";
import { signupUser } from "../features/signupUser.slice";
import { toast } from "react-toastify";
import { Spin } from 'antd';
import { validate } from "../helpers/displayErrors";
 

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.signupUser);

  const InitialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [errors, setErrors] = useState({});
  const [signup, setSignup] = useState(true);
  const [inputs, setInputs] = useState(InitialState);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const { username, email, password, confirmPassword } = inputs;
  const resetState = () => {
    setSignup(!signup);
    setInputs(InitialState);
    console.log(signup);
    console.log(inputs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, email, password, confirmPassword);
    if (validate(inputs, setErrors)) {
      console.log('entered')
      dispatch(signupUser({ username, email, password, confirmPassword }))
        .then((result) => {
          console.log("result", result);
          console.log("error", errors);
          if (result.payload?.status === 201) {
            toast.success("Signup successful");
            resetState();
            navigate("/login");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  };

  return (
    <div className="flex items-center flex-row w-screen h-screen">
      <section className="flex flex-col justify-between items-start flex-1 self-stretch">
        <form
          action=""
          className="flex w-[440px] flex-col items-center gap-6 px-10 py-8 rounded-lg border-b-2 border-[#135352] bg-white shadow-md ml-32 mt-10"
          onSubmit={handleSubmit}
        >
          <header className="flex flex-col items-center gap-6 self-stretch">
            <Link to={"/"}>
              <img
                src="/assets/advlogo.svg"
                alt="signuplogo"
                className="w-16 h-16 rounded-full lightgray 50% / cover no-repeat"
              />
            </Link>
            <h1 className="self-stretch text-gray-900 text-center font-inter font-semibold text-xl">
              Create Free Account
            </h1>
          </header>
          <input
            type="text"
            className={`flex p-2.5 px-3.5 items-center gap-2 self-stretch rounded-md border ${
              errors?.username ? "border-red-500" : "border-gray-300"
            } bg-white shadow-xs`}
            placeholder="Enter your username"
            name="username"
            value={inputs.username}
            onChange={handleChange}
          />
          {errors?.username && (
            <p style={{ color: "red", marginTop: "-20px", fontSize: "14px" }}>
              {errors?.username}
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
          {errors?.email && (
            <p style={{ color: "red", marginTop: "-20px", fontSize: "14px" }}>
              {errors?.email}
            </p>
          )}
          <input
            type="password"
            className={`flex p-2.5 px-3.5 items-center gap-2 self-stretch rounded-md border ${
              errors?.email ? "border-red-500" : "border-gray-300"
            } bg-white shadow-xs`}
            placeholder="Create a password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
          {errors?.password && (
            <p style={{ color: "red", marginTop: "-20px", fontSize: "14px" }}>
              {errors?.password}
            </p>
          )}
          <input
            type="password"
            className={`flex p-2.5 px-3.5 items-center gap-2 self-stretch rounded-md border ${
              errors?.confirmPassword ? "border-red-500" : "border-gray-300"
            } bg-white shadow-xs`}
            placeholder="Confirm your password"
            name="confirmPassword"
            value={inputs.confirmPassword}
            onChange={handleChange}
          />
          {errors?.confirmPassword && (
            <p style={{ color: "red", marginTop: "-20px", fontSize: "14px" }}>
              {errors?.confirmPassword}
            </p>
          )}
          <div className="actions flex flex-col items-start gap-4 self-stretch">
            <button className="flex p-2 px-4 justify-center items-center gap-2 flex-1 rounded-md border border-[#135352] bg-[#135352] shadow-xs self-stretch"
              type="submit"
            >
              {loading ? (
                <Spin style={{ color: "whitesmoke" }} />
              ) : (
                <span className="text-white">Get Started</span>
              )}
            </button>
            <div className="socialbuttongroup flex flex-col justify-center items-center gap-3 self-stretch">
              <button className="google flex p-2.5 px-4 justify-center items-center gap-3 self-stretch rounded-md border border-gray-300 bg-white shadow-xs">
                <img src="/assets/google.svg" alt="google" />
                Sign up with Google
              </button>
              <button className="facebook flex p-2.5 px-4 justify-center items-center gap-3 self-stretch rounded-md border border-gray-300 bg-white shadow-xs">
                <img src="/assets/facebook.svg" alt="facebook" />
                Sign up with Facebook
              </button>
            </div>
            <div className="flex justify-center items-start gap-1 self-stretch">
              <p className="text-gray-500 font-inter text-sm font-normal leading-5">
                Already have an account?
              </p>
              <Link to={"/login"}>
                <button className="flex justify-center items-center gap-2">
                  <p className="text-[#135352] font-inter text-sm font-medium leading-5">
                    Log in
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
}

export default Signup