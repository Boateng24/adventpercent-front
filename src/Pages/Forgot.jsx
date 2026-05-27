import { useState } from "react";
import { Link } from "react-router-dom";
import { RightImage } from "../Components/RightImage";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/passwordReset.slice";
import { Spin } from "antd";
import { CheckCircle, Mail } from "lucide-react";

const Forgot = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.passwordReset);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validate = () => {
    if (!email.trim()) { setEmailError("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("Enter a valid email address"); return false; }
    setEmailError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(forgotPassword(email));
  };

  return (
    <div className="flex items-center flex-row w-screen h-screen bg-white dark:bg-gray-950">
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
              Forgot Password?
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center leading-relaxed -mt-2">
              Enter the email you registered with and we&apos;ll send you a link to reset your password.
            </p>
          </header>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-4 py-4 w-full text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Check your inbox</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We sent a reset link to <span className="font-medium text-[#135352]">{email}</span>.
                  It expires in 1 hour.
                </p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={() => dispatch(forgotPassword(email))}
                  className="text-[#135352] hover:underline font-medium"
                >
                  resend
                </button>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="w-full">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className={`flex p-2.5 pl-9 items-center gap-2 self-stretch rounded-md border w-full ${
                      emailError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                    } bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#135352]`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  />
                </div>
                {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
              </div>

              <button
                className="flex p-2 px-4 justify-center items-center gap-2 flex-1 rounded-md border border-[#135352] bg-[#135352] shadow-xs self-stretch w-full hover:bg-[#0e3d3c] transition-colors disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spin style={{ color: "whitesmoke" }} /> : <span className="text-white">Send Reset Link</span>}
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

      <section className="flex self-stretch flex-1">
        <RightImage />
      </section>
    </div>
  );
};

export default Forgot;
