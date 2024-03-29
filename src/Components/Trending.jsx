// import { trending } from "../data/trending";
// import { staticImageById } from "../helpers/findImage";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogout } from '../features/loginUser.slice.js';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { songBase } from "../api/backend.api.js";
import { truncateString } from "../helpers/truncate.js";

const Trending = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.loginUser)
    const [isHovered, setHovered] = useState(false);
    const [trending, setTrending] = useState([])

    const handleMouseEnter = () => {
      setHovered(true);
    };

    const handleMouseLeave = () => {
      setHovered(false);
    };

      const logoutUser = () => {
        dispatch(userLogout());
        navigate("/login");
        window.location.reload();
      };


  useEffect(() => {
    const fetchTrendings = async () => {
        try {
          const response = await axios.get(`${songBase}/trendings`);
          setTrending(
            response.data.trendingSongs.map((songItem) => ({
              ...songItem.song, // Spread the song details
            }))
          );
        } catch (error) {
          console.log(error)
        }
    }
  fetchTrendings();
  
  }, [])
  

  return (
    <div className="w-1/4 sticky right-0 top-0 h-screen">
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="bg-gray-300  rounded-full w-10 h-10 right-0 top-0 absolute cursor-pointer">
          <FontAwesomeIcon
            icon={faUser}
            className="right-0 top-0 absolute m-3  w-4"
          />
          {isAuthenticated && isHovered && (
            <ul className="absolute top-8 right-5 w-24 border border-gray-300 divide-y divide-gray-200 rounded-md ">
              <Link to={"/login"} onClick={logoutUser}>
                <li value="logout" className="px-2 py-2 hover:bg-slate-100">
                  Logout
                </li>
              </Link>
            </ul>
          )}
        </div>
      </div>
      <th className="text-[#334054] font-bold text-lg pl-2">
        Trending Songs for the Week
      </th>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          {trending.map((song) => (
            <tr key={song?.id} className=" hover:bg-lime-500 cursor-pointer">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {/* You would dynamically load images here */}
                    <img
                      className="h-14 w-14"
                      src={
                        song?.image
                          ? song.image
                          : "/assets/songImgs/sda-music-img.jpg"
                      }
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {song?.title ?  truncateString(song.title, 15) : "Music tune"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {song?.artist ?  truncateString(song.artist, 15) : "Musician"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {Math.floor(song.duration / 60)}:
                {String(song.duration % 60).padStart(2, "0")} min
              </td>
              {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="mt-1">
                  <img src={staticImageById(6)} alt="" />
                </button>
              </td> */}

              {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="mt-1">
                  <img src={staticImageById(14)} alt="" />
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Trending