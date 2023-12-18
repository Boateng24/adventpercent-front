import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import songService from '../api/songs/songs'
import axios from "axios";
const SongDetails = () => {
    const [song, setSong] = useState(null)
    const {id} = useParams();

    useEffect(() => {
      const fetchSongById = async () => {
        const response = await axios.get(`http://localhost:5000/songs/song/${id}`);
        setSong(response.data.song)
      }
      fetchSongById()
    }, [id])

  
  return (
      <div className="flex flex-col items-center justify-center h-screen ml-[460px]">
        <h1>{song?.title ? song.title : "Music tune"}</h1>
        <img
          src={
            song?.image ? song.image : "/src/assets/songImgs/sda-music-img.jpg"
          }
          alt={song?.title}
          className="w-96 rounded-md items-center justify-center"
        />
        <h3>{song?.artist ? song.artist : "Musician"}</h3>
        {song?.track ? (
          <audio controls autoPlay className="w-full">
            <source src={song.track} type="audio/mpeg" />
          </audio>
        ) : (
          <p>Loading audio...</p>
        )}
      </div>
  
  );
}

export default SongDetails