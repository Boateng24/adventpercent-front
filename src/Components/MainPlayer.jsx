


const MainPlayer = () => {
    // const [isPlaying, setIsPlaying] = useState(false);
    //  const audioRef = useRef(new Audio(src));
    //  const [song, setSong] = useState(null);
    //  const { id } = useParams();


    //  const handlePlayPause = () => {
    //    if (isPlaying) {
    //      audioRef.current.pause();5
    //    } else {
    //      audioRef.current.play();
    //    }
    //    setIsPlaying(!isPlaying);
    //  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-24 bg-[#f2f4f7] z-10 flex justify-center items-center">
      <div className=" w-[750px] h-20 rounded-full border-2 bg-custom-gradient">
        <div className="flex">
          <div className="p-6 ml-1 hover:cursor-pointer mt-1">
            <img src="/assets/backward.fill.svg" alt="" />
          </div>
          <div className="p-6 ml-1 hover:cursor-pointer mt-1">
            <img src="/assets/pause.fill.svg" alt="" />
          </div>
          <div className="p-6 ml-1 hover:cursor-pointer mt-1">
            <img src="/assets/Vector.svg" alt="" />
          </div>
          <div className=" w-80 h-14 m-2 border-2 mt-3 rounded-md flex">
            <img src="/public/assets/equalizer-image.svg" alt="" className="m-1" />
            <div className="block">
                <h5 className="text-white text-sm mt-2">Formular 1 theme</h5>
            <p className="text-white text-xs">Brian Tyler</p>
            </div>
          </div>
          <div className="p-6 ml-1 hover:cursor-pointer mt-1">
            <img src="/assets/list.bullet.svg" alt="" className="w-7" />
          </div>
          <div className="p-6 ml-1 hover:cursor-pointer mt-1">
            <img src="/assets/speaker.wave.3.fill.svg" alt="" className="w-7" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPlayer