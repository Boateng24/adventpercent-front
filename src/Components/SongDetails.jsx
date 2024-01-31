import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import songService from '../api/songs/songs'
import axios from "axios";
// import ReactPlayer from "react-player";
import AudioPlayer from "./Player";
import { songBase } from "../api/backend.api";
const SongDetails = () => {
    const [song, setSong] = useState(null)
    const {id} = useParams();

    useEffect(() => {
      const fetchSongById = async () => {
        const response = await axios.get(`${songBase}/song/${id}`);
        setSong(response.data.song)
        console.log('song response', response)
      }
      fetchSongById()
    }, [id])

  
  return (
    <div className="flex flex-col items-center justify-center w-[100%]">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[#135352] font-semibold mb-4">
          {song?.title ? song.title : "Music tune"}
        </h1>
        <img
          src={
            song?.image ? song.image : "/assets/songImgs/sda-music-img.jpg"
          }
          alt={song?.title}
          className="w-96 rounded-md items-center justify-center"
        />
        <h3>{song?.artist ? song.artist : "Musician"}</h3>
        {song?.track ? (
          <AudioPlayer
            src={song.track}
            songName={song.title}
          />
        ) : (
          <p>Loading audio...</p>
        )}
      </div>
    </div>
  );
}

export default SongDetails