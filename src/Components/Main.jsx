import BottomMusic from "./BottomMusic";
import { dynamicImageById } from "../helpers/findImage";
import { useState } from "react";


const Main = () => {
  const [currentSong, setCurrentSong] = useState({
    id: null,
    image: null,
    title: null,
    artist: null
  })

  const handleSongChange = (songDetails) => {
    setCurrentSong(songDetails);
  };

  const getdynamicImageById = () => {
    return currentSong.image || dynamicImageById(1)
  }
  return (
    <div className="w-2/4 mt-2 h-full">
      <div
        className="flex w-full h-[170px] bg-cover rounded-sm text-white sticky top-0 z-10"
        style={{ backgroundImage: `url(${getdynamicImageById()})` }}
      >
        <div className="flex text-white bottom-0 right-0 justify-end items-end absolute">
          <div className="text-right mr-5">
            <h1 className="text-2xl">Now Playing:</h1>
            <div>
              <h2 className="text-md truncate w-56">
                {currentSong?.title || "No Title Found"}
              </h2>
              <p className="text-sm truncate w-56">
                {currentSong?.artist || "Unknown Artist"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <BottomMusic onSongChange={handleSongChange} />
    </div>
  );
}

export default Main