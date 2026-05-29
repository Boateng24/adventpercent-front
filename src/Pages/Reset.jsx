import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { RightImage } from "../Components/RightImage";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../features/passwordReset.slice";
import { Spin } from "antd";
import { CheckCircle, AlertTriangle } from "lucide-react";

const Reset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { loading, success, error } = useSelector((state) => state.passwordReset);
  const [inputs, setInputs] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!inputs.newPassword) errs.newPassword = "New password is required";
    else if (inputs.newPassword.length < 6) errs.newPassword = "Password must be at least 6 characters";
    if (!inputs.confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (inputs.newPassword !== inputs.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(resetPassword({ token, ...inputs })).then((result) => {
      if (result.type === "passwordReset/reset/fulfilled") {
        setTimeout(() => navigate("/login"), 2500);
      }
    });
  };

  const inputClass = (field) =>
    `flex p-2.5 px-3.5 items-center gap-2 self-stretch rounded-md border w-full ${
      errors[field] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
    } bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#135352]`;

  // No token in URL — link is invalid
  if (!token) {
    return (
      <div className="flex flex-col lg:flex-row w-screen min-h-screen bg-white dark:bg-gray-950">
        <section className="flex flex-col justify-center items-center flex-1 self-stretch px-4 sm:px-8 py-8 lg:py-0">
          <div className="w-full max-w-[440px] flex flex-col items-center gap-6 px-5 sm:px-10 py-8 rounded-lg border-b-2 border-red-400 bg-white dark:bg-gray-900 shadow-md text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Invalid Reset Link</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This password reset link is missing or invalid. Request a new one below.
              </p>
            </div>
            <Link to="/forgot">
              <span className="text-[#135352] font-medium hover:underline text-sm">Request a new link</span>
            </Link>
          </div>
        </section>
        <section className="hidden lg:flex self-stretch flex-1">
          <RightImage />
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-screen min-h-screen bg-white dark:bg-gray-950">
      <section className="flex flex-col justify-center items-center flex-1 self-stretch px-4 sm:px-8 py-8 lg:py-0">
        <form
          className="w-full max-w-[440px] flex flex-col items-center gap-6 px-5 sm:px-10 py-8 rounded-lg border-b-2 border-[#135352] bg-white dark:bg-gray-900 shadow-md"
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
              Set New Password
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center leading-relaxed -mt-2">
              Choose a strong password for your account.
            </p>
          </header>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4 w-full text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Password updated!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Redirecting you to sign in…
                </p>
              </div>
              <Link to="/login">
                <span className="text-[#135352] font-medium hover:underline text-sm">Go to Sign In</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="w-full">
                <input
                  type="password"
                  className={inputClass("newPassword")}
                  placeholder="New password"
                  name="newPassword"
                  value={inputs.newPassword}
                  onChange={handleChange}
                />
                {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
              </div>

              <div className="w-full">
                <input
                  type="password"
                  className={inputClass("confirmPassword")}
                  placeholder="Confirm new password"
                  name="confirmPassword"
                  value={inputs.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              {error && (
                <p className="w-full text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <button
                className="flex p-2 px-4 justify-center items-center gap-2 flex-1 rounded-md border border-[#135352] bg-[#135352] shadow-xs self-stretch w-full hover:bg-[#0e3d3c] transition-colors disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spin style={{ color: "whitesmoke" }} /> : <span className="text-white">Reset Password</span>}
              </button>
            </>
          )}

          <div className="flex justify-center items-center gap-1 self-stretch">
            <p className="text-gray-500 dark:text-gray-400 font-inter text-sm font-normal leading-5">
              Remember your password?
            </p>
            <Link to="/login">
              <span className="text-[#135352] font-inter text-sm font-medium leading-5 hover:underline">
                Sign in
              </span>
            </Link>
          </div>
        </form>
      </section>

      <section className="hidden lg:flex self-stretch flex-1">
        <RightImage />
      </section>
    </div>
  );
};

export default Reset;
