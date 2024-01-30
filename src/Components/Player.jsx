/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faPauseCircle,
  faStepForward,
  faStepBackward,
  faRotateLeft,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import {Menu} from "antd";
import downloadSong from "../helpers/download";



const AudioPlayer = ({ src, songName}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const audioRef = useRef(new Audio(src));
    const [downloadProgress, setDownloadProgress] = useState(null);

      const handleDownloadClick = () => {
        setVisibleMenu(false); // This will close the menu
        downloadSong(src, songName, (progress) => {
          setDownloadProgress(progress);
          if (progress === 100) {
            setTimeout(() => setDownloadProgress(null), 2000);
          }
        });
      };

  const menuItems = [
    {
      key: "download",
      label: "Download",
      onClick: handleDownloadClick,
    },
    { key: "share", label: "Share" },
  ];
  useEffect(() => {
    // Autoplay the audio when the component mounts
    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Autoplay was prevented: ", error);
        // Autoplay was prevented by the browser
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [src]); 



  const toggleMenu = () => {
    setVisibleMenu(!visibleMenu)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFastForward = () => {
    audioRef.current.currentTime += 10; // Fast forward by 10 seconds
  };

  const handleRewind = () => {
    audioRef.current.currentTime -= 10; // Rewind by 10 seconds
  };

  const handleRepeat = () => {
    audioRef.current.currentTime = 0; // Reset to start
    audioRef.current.play();
  };

  return (
    <div className="bg-[#135352] w-[100%] h-12 rounded-md relative">
      <div className=" my-4">
        <button onClick={handlePlayPause} className="mx-4">
          <FontAwesomeIcon
            icon={isPlaying ? faPauseCircle : faPlayCircle}
            style={{ color: "white", width: "40px", height: "20px" }}
          />
        </button>
        <button onClick={handleRewind} className="mx-4">
          <FontAwesomeIcon
            icon={faStepBackward}
            style={{ color: "white", width: "40px", height: "20px" }}
          />
        </button>
        <button onClick={handleFastForward} className="mx-4">
          <FontAwesomeIcon
            icon={faStepForward}
            style={{ color: "white", width: "40px", height: "20px" }}
          />
        </button>
        <button onClick={handleRepeat} className="mx-4">
          <FontAwesomeIcon
            icon={faRotateLeft}
            style={{ color: "white", width: "40px", height: "20px" }}
          />
        </button>
        <button className="mx-4" onClick={toggleMenu}>
          <FontAwesomeIcon
            icon={faEllipsisV}
            style={{ color: "white", width: "40px", height: "20px" }}
          />
        </button>
        {visibleMenu && (
          <div>
            <Menu
              items={menuItems}
              className="w-48 right-0 absolute mt-2 rounded-sm -top-24"
            />
          </div>
        )}

        {downloadProgress !== null && (
          <div className="text-[#135352] mt-3 text-xs">
            {downloadProgress < 100 && `Downloading... ${downloadProgress}%`}
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
