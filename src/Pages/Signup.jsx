import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { RightImage } from "../Components/RightImage";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/signupUser.slice";
import { googleSignIn } from "../features/socialAuth.slice";
import { toast } from "react-toastify";
import { Spin } from "antd";
import { Headphones, Mic2 } from "lucide-react";

const ROLES = [
  { value: "user", label: "Listener", icon: Headphones, desc: "Discover & enjoy music" },
  { value: "artist", label: "Artist", icon: Mic2, desc: "Upload & share your songs" },
];

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.signupUser);
  const { loading: socialLoading } = useSelector((state) => state.socialAuth);

  const [userType, setUserType] = useState("user");
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!inputs.username.trim()) errs.username = "Username is required";
    if (!inputs.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(inputs.email)) errs.email = "Enter a valid email";
    if (!inputs.password) errs.password = "Password is required";
    else if (inputs.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (!inputs.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (inputs.password !== inputs.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(signupUser({ ...inputs, userType }))
      .then((result) => {
        if (result.payload?.status === 201) {
          toast.success("Account created! Please sign in.");
          navigate("/login");
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
    <div className="flex items-center flex-row w-screen h-screen bg-white dark:bg-gray-950">
      <section className="flex flex-col justify-center items-start flex-1 self-stretch px-8 overflow-y-auto">
        <form
          className="flex w-[440px] flex-col items-center gap-5 px-10 py-8 rounded-lg border-b-2 border-[#135352] bg-white dark:bg-gray-900 shadow-md mx-auto"
          onSubmit={handleSubmit}
        >
          <header className="flex flex-col items-center gap-4 self-stretch">
            <Link to={"/"}>
              <img
                src="/assets/advlogo.svg"
                alt="logo"
                className="w-16 h-16 rounded-full object-cover"
              />
            </Link>
            <h1 className="self-stretch text-gray-900 dark:text-white text-center font-inter font-semibold text-xl">
              Create Free Account
            </h1>
          </header>

          {/* Role selector */}
          <div className="flex w-full gap-3">
            {ROLES.map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setUserType(value)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-lg border-2 transition-all ${
                  userType === value
                    ? "border-[#135352] bg-[#135352]/10 dark:bg-[#135352]/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <Icon
                  size={20}
                  className={userType === value ? "text-[#135352]" : "text-gray-400 dark:text-gray-500"}
                />
                <span className={`text-sm font-medium ${userType === value ? "text-[#135352]" : "text-gray-600 dark:text-gray-400"}`}>
                  {label}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 text-center leading-tight">{desc}</span>
              </button>
            ))}
          </div>

          {/* Username */}
          <div className="w-full">
            <input
              type="text"
              className={inputClass("username")}
              placeholder="Enter your username"
              name="username"
              value={inputs.username}
              onChange={handleChange}
            />
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
          </div>

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
              placeholder="Create a password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="w-full">
            <input
              type="password"
              className={inputClass("confirmPassword")}
              placeholder="Confirm your password"
              name="confirmPassword"
              value={inputs.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="actions flex flex-col items-start gap-3 self-stretch">
            <button
              className="flex p-2 px-4 justify-center items-center gap-2 flex-1 rounded-md border border-[#135352] bg-[#135352] shadow-xs self-stretch hover:bg-[#0e3d3c] transition-colors disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? <Spin style={{ color: "whitesmoke" }} /> : <span className="text-white">Get Started</span>}
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
                  <span>Sign up with Google</span>
                </>
              )}
            </button>

            <div className="flex justify-center items-center gap-1 self-stretch">
              <p className="text-gray-500 dark:text-gray-400 font-inter text-sm font-normal leading-5">
                Already have an account?
              </p>
              <Link to="/login">
                <span className="text-[#135352] font-inter text-sm font-medium leading-5 hover:underline">
                  Log in
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

export default Signup;
