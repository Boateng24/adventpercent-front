import { recommended } from "../data/recommendation";
import { recentPlayed } from "../data/newlyPlayed";
import { staticImageById } from "../helpers/findImage";
import { useEffect, useState } from "react";
import songService from '../api/songs/songs';
import { Spin } from "antd";
import { Link } from "react-router-dom";


const BottomMusic = () => {
  const [newSongs, setNewSongs] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

   const [visibleSongs, setVisibleSongs] = useState(4); // Initially show 4 songs
   const maxSongs = 20;
   const minSongs = 4;
  const toggleSongsVisibility = () => {
    setVisibleSongs((prevCount) => {
      // If we are showing the maximum number of songs, clicking the button should show fewer songs
      if (prevCount === maxSongs) {
        return minSongs;
      }
      // Otherwise, show more songs, but do not exceed the maximum number
      else {
        return Math.min(prevCount + 4, maxSongs);
      }
    });
  };
  
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const fetchedSongs = await songService.recommendedSongs();
        setNewSongs(fetchedSongs);
      } catch (err) {
        console.log(err.message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [])
  

  return (
    <div>
      <div className="newreleases">
        <div>
          <div className="flex mt-5 justify-between items-center">
            <h1 className="text-[#334054] font-bold text-lg">New Releases</h1>
            <p
              className="text-[#C7AF4E] cursor-pointer"
              onClick={toggleSongsVisibility}
            >
              {visibleSongs === maxSongs ? "See less" : "See more"}
            </p>
          </div>
          <div className="flex flex-wrap mt-3 w-full">
            {isLoading ? (
              <Spin />
            ) : (
              newSongs.slice(0, visibleSongs).map((item) => (
                <div key={item.id} className="w-1/4 p-2 box-border">
                  <Link to={`/song/${item?.id}`}>
                    <img
                      src={
                        item?.image
                          ? item.image
                          : "/assets/songImgs/sda-music-img.jpg"
                      }
                      alt="recentImg"
                      className="w-full h-44 object-cover"
                    />
                    <h3 className="text-[#135352] font-semibold truncate">
                      {item.title ? item?.title : "Music tune"}
                    </h3>
                    <p className="text-[#334054] truncate">
                      {item.artist ? item.artist : "Musician"}
                    </p>
                    {item?.track && (
                      <audio controls className="w-full mt-2 h-8">
                        <source src={item.track} type="audio/mpeg" />
                      </audio>
                    )}
                  </Link>
                </div>
              ))
            )}
          </div>
          <p
            className="text-[#C7AF4E] cursor-pointer"
            onClick={toggleSongsVisibility}
          >
            {visibleSongs === maxSongs ? "See less" : "See more"}
          </p>
        </div>
        <div className="flex mt-5 justify-between">
          <h1 className="text-[#334054] font-bold text-lg">
            Songs You May Like
          </h1>
          <p className="text-[#C7AF4E] cursor-pointer">See more</p>
        </div>
        <div className="flex gap-5 flex-wrap mt-3">
          {recommended.map((item) => (
            <div key={item.id} className="flex-1">
              <img
                src={item.imageSrc}
                alt="recentImg"
                className=" w-full h-44"
              />
              <h3 className="text-[#135352] font-semibold text-center">
                {item.title}
              </h3>
              <p className="text-[#334054] text-center">{item.artist}</p>
            </div>
          ))}
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="flex mt-8 justify-between">
            <h1 className="text-[#334054] font-bold text-lg">
              Recently Played
            </h1>
            <p className="text-[#C7AF4E] cursor-pointer">See more</p>
          </div>
          <table className="table-auto w-full">
            <tbody>
              {recentPlayed.map((song, index) => (
                <tr key={index} className="text-left align-middle">
                  <td className="p-2">
                    <img
                      src={song.image}
                      alt={song.title}
                      className="inline-block h-12 w-12 rounded-full mr-2 object-cover"
                    />
                    {song.title}
                  </td>
                  <td className="p-2">{song.artist}</td>
                  <td className="p-2">{song.album}</td>
                  <td className="p-2">{song.duration}</td>
                  <td className="p-2">
                    <button className="mt-1">
                      <img src={staticImageById(6)} alt="" />
                    </button>
                  </td>
                  <td className="p-2">
                    <button className="text-gray-500">
                      <img src={staticImageById(13)} alt="" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BottomMusic