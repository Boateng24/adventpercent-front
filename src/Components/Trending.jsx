import { trending } from "../data/trending";
import { staticImageById } from "../helpers/findImage";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { Link } from "react-router-dom";

const Trending = () => {
    const [isHovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
      setHovered(true);
    };

    const handleMouseLeave = () => {
      setHovered(false);
    };

  return (
    <div className="w-1/4 sticky right-0 top-0 h-screen">
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="bg-gray-300  rounded-full w-10 h-10 right-0 top-0 absolute cursor-pointer">
          <FontAwesomeIcon
            icon={faUser}
            className="right-0 top-0 absolute m-3  w-4"
          />
          {isHovered && (
            <ul className="absolute top-8 right-5 w-24 border border-gray-300 divide-y divide-gray-200 rounded-md ">
              <Link to={"/signup"}>
                <li value="signup" className="px-2 py-2 hover:bg-slate-100">
                  Sign up
                </li>
              </Link>
              <Link to={"/login"}>
                <li value="login" className="px-2 py-2 hover:bg-slate-100">
                  Login
                </li>
              </Link>
            </ul>
          )}
        </div>
      </div>
      <th className="text-[#334054] font-bold text-lg pl-2">Trending Songs</th>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {trending.map((song) => (
            <tr key={song.id} className=" hover:bg-lime-500 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {/* You would dynamically load images here */}
                    <img className="h-14 w-14" src={song.imageSrc} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {song.title}
                    </div>
                    <div className="text-sm text-gray-500">{song.artist}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {song.duration}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="mt-1">
                  <img src={staticImageById(6)} alt="" />
                </button>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="mt-1">
                  <img src={staticImageById(14)} alt="" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Trending