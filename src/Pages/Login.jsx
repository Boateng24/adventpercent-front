import { Link, useNavigate } from "react-router-dom";
import { RightImage } from "../Components/RightImage";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { loginUser } from "../features/loginUser.slice";
import { googleSignIn } from "../features/socialAuth.slice";
import { Spin } from "antd";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loginUser);
  const { loading: socialLoading } = useSelector((state) => state.socialAuth);

  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!inputs.email.trim()) errs.email = "Email is required";
    if (!inputs.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser(inputs)).then((result) => {
      if (result.type === "login/fulfilled") {
        navigate("/");
      }
    });
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(googleSignIn());
      if (result.type === "socialAuth/googleSignIn/fulfilled") {
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const inputClass = (field) =>
    `w-full flex p-2.5 px-3.5 items-center gap-2 rounded-md border ${
      errors[field] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
    } bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#135352]`;

  return (
    <div className="flex flex-row w-screen h-screen bg-white dark:bg-gray-950">
      <section className="flex flex-col justify-center items-start flex-1 self-stretch px-8">
        <form
          className="flex w-[440px] flex-col items-center gap-6 px-10 py-8 rounded-lg border-b-2 border-[#135352] bg-white dark:bg-gray-900 shadow-md mx-auto"
          onSubmit={handleSubmit}
        >
          <header className="flex flex-col items-center gap-6 self-stretch">
            <Link to={"/"}>
              <img
                src="/assets/advlogo.svg"
                alt="logo"
                className="w-16 h-16 rounded-full object-cover"
              />
            </Link>
            <h1 className="self-stretch text-gray-900 dark:text-white text-center font-inter font-semibold text-xl">
              Sign in
            </h1>
          </header>

          {/* Email */}
          <div className="w-full">
            <input
              type="text"
              className={inputClass("email")}
              placeholder="Enter your email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="w-full">
            <input
              type="password"
              className={inputClass("password")}
              placeholder="Enter your password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="actions flex flex-col items-start gap-3 self-stretch">
            <button
              className="flex p-2 px-4 justify-center items-center gap-2 flex-1 rounded-md border border-[#135352] bg-[#135352] shadow-xs self-stretch hover:bg-[#0e3d3c] transition-colors disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spin style={{ color: "whitesmoke" }} /> : <span className="text-white">Sign In</span>}
            </button>

            <div className="flex items-center gap-2 self-stretch">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <button
              className="flex p-2.5 px-4 justify-center items-center gap-3 self-stretch rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white shadow-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={handleGoogleSignIn}
              disabled={socialLoading}
              type="button"
            >
              {socialLoading ? (
                <Spin size="small" />
              ) : (
                <>
                  <img src="/assets/google.svg" alt="google" className="w-5 h-5" />
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            <div className="flex justify-center items-center gap-1 self-stretch">
              <p className="text-gray-500 dark:text-gray-400 font-inter text-sm font-normal leading-5">
                Don&apos;t have an account?
              </p>
              <Link to="/signup">
                <span className="text-[#135352] font-inter text-sm font-medium leading-5 hover:underline">
                  Sign up
                </span>
              </Link>
            </div>

            <div className="flex justify-center items-center gap-1 self-stretch">
              <p className="text-gray-500 dark:text-gray-400 font-inter text-sm font-normal leading-5">
                Forgot your password?
              </p>
              <Link to="/forgot">
                <span className="text-[#135352] font-inter text-sm font-medium leading-5 hover:underline">
                  Reset it
                </span>
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
