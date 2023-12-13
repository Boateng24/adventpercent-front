import { Link } from "react-router-dom";
import SideImage from "../Components/sideImage";

const Forgot = () => {
  return (
    <div className="flex items-center flex-row w-screen h-screen">
      <section className="flex flex-col justify-between items-start flex-1 self-stretch">
        <form
          action=""
          className="flex w-[440px] flex-col items-center gap-6 px-10 py-8 rounded-lg border-b-2 border-[#135352] bg-white shadow-md ml-32 mt-44"
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
              Fogot Password?
            </h1>
          </header>
          <input
            type="text"
            className="flex p-2.5 px-3.5 items-center gap-2 self-stretch rounded-md border border-gray-300 bg-white shadow-xs"
            placeholder="Enter your email"
          />
          <div className="actions flex flex-col items-start gap-4 self-stretch">
            <button className="flex p-2 px-4 justify-center items-center gap-2 flex-1 rounded-md border border-[#135352] bg-[#135352] shadow-xs self-stretch">
              <span className="text-white">Send Resend Link</span>
            </button>

            <div className="flex justify-center items-start gap-1 self-stretch">
              <p className="text-gray-500 font-inter text-sm font-normal leading-5">
                Remember Password?
              </p>
              <Link to={"/login"}>
                <button className="flex justify-center items-center gap-2">
                  <p className="text-[#135352] font-inter text-sm font-medium leading-5">
                    Login
                  </p>
                </button>
              </Link>
            </div>
          </div>
        </form>
      </section>
      <section className="flex self-stretch flex-1">
        <SideImage />
      </section>
    </div>
  );
}

export default Forgot