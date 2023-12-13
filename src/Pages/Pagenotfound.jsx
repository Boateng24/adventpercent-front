import { Link, useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-100vw flex justify-center h-screen items-center">
      <div className="p-4">
        <p className="text-xl text-[#344054]">404 error</p>
        <h1 className="text-6xl py-3 text-[#344054] font-normal">
          We can&apos;t find that page
        </h1>
        <p className="text-xl py-3 font-normal text-[#344054]">
          Sorry, the page you are looking for does not exist or has been moved
        </p>
        <div>
          <button
            className="w-[160px] border-2 mr-4 text-blue-500 border-blue-500 h-[44px] rounded-[8px] mt-6 cursor-pointer"
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            className="w-[160px] mr-4 bg-blue-700 hover:bg-blue-900 text-gray-50 h-[44px] rounded-[8px] mt-6 cursor-pointer"
            type="button"
          >
            <Link to="/">Take me home</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
