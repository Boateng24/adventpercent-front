/* eslint-disable react/prop-types */
// import { recommended } from "../data/recommendation";
// import { recentPlayed } from "../data/newlyPlayed";
// import { staticImageById } from "../helpers/findImage";
import { useEffect, useState, useRef, useCallback } from "react";
import songService from "../api/songs/songs";
import { Spin } from "antd";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { songBase } from "../api/backend.api";


const BottomMusic = ({ onSongChange }) => {
  const [newSongs, setNewSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(null);
   const audioRef = useRef(new Audio());

  //  const [song, setSong] = useState(null);
  //  const { id } = useParams();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const fetchedSongs = await songService.recommendedSongs(page);
        console.log("songData", fetchedSongs);
        setNewSongs((prev) => [...prev, ...fetchedSongs]);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    audioRef.current.addEventListener('ended', playNextSong)
  
    return () => {
      audioRef.current.removeEventListener('ended', playNextSong)
    }
  }, [newSongs, currentSongId, isPlaying])
  


    const playSong = (songUrl, songId) => {
      const isCurrentSong = currentSongId === songId;
      if (isPlaying && isCurrentSong) {
        audioRef.current.pause();
        setIsPlaying(false); // Update playing state
      } else {
        if (!isCurrentSong) {
          audioRef.current.src = songUrl; // Set new source if song changed
          setCurrentSongId(songId); // Update currently playing song ID
          const songDetails = newSongs.find((song) => song?.id === songId);
          if (songDetails) {
            onSongChange({
              id: songDetails?.id,
              image: songDetails?.image,
              title: songDetails?.title,
              artist: songDetails?.artist,
              // Add any other relevant song details you want to share with the parent component
            });
          }
        }
        audioRef.current.play();
        setIsPlaying(true); // Update playing state
      }
    };

    const playNextSong = useCallback(() => {
     const  currentIndex = newSongs.findIndex(song => song?.id === currentSongId);
      const nextIndex = currentIndex + 1;
      const firstSong = newSongs[0]

      if(nextIndex < newSongs.length) {
        const nextSong = newSongs[nextIndex]
        playSong(nextSong?.track, nextSong?.id)
      } else if(firstSong) {
        playSong(firstSong?.track, firstSong?.id)
      }
      else {
        setIsPlaying(false)
      }
    })
  return (
    <div>
      <div className="newreleases overflow-y-scroll">
        <div>
          <div className="flex mt-5 justify-between items-center">
            <h1 className="text-[#334054] font-bold text-lg">New Releases</h1>
          </div>
          <div className="flex flex-wrap mt-3 w-full">
            {isLoading ? (
              <div style={{ textAlign: "center", width: "100%" }}>
                <Spin />
              </div>
            ) : (
              newSongs.slice(0, newSongs.length).map((item) => (
                <div
                  key={item?.id}
                  className="w-1/4 p-2 box-border"
                  onClick={() => playSong(item?.track, item?.id)}
                >
                  <div className="relative group">
                    <img
                      src={
                        item?.image
                          ? item.image
                          : "/assets/songImgs/sda-music-img.jpg"
                      }
                      alt="recentImg"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                     {isPlaying && currentSongId === item?.id ? (
                        <img src="/assets/Exclude.svg" alt="pause" className="opacity-0 group-hover:opacity-100"/>
                     ): (
                       <img src="/assets/coolicon.svg" alt="play" className="opacity-0 group-hover:opacity-100"/>
                     )}
                    </div>
                  </div>
                  <h3 className="text-[#135352] font-semibold truncate">
                    {item?.title ? item?.title : "Music tune"}
                  </h3>
                  <p className="text-[#334054] truncate">
                    {item?.artist ? item.artist : "Musician"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomMusic;
