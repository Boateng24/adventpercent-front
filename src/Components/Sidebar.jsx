import { staticImageById } from "../helpers/findImage";
import { sideMusic } from "../data/sidedata";
const Sidebar = () => {
  return (
    <div className="w-1/4 sticky left-0 top-0 h-screen">
      <img src={staticImageById(1)} alt="" className="mt-5 ml-3" />
      <div className="bg-[#135352] flex p-5 m-5 cursor-pointer hover:bg-lime-500">
        <img src={staticImageById(7)} alt="" />
        <h1 className="text-white ml-5 font-extrabold text-2xl">Home</h1>
      </div>
      <div className="flex p-3 m-3 cursor-pointer hover:bg-lime-500">
        <img src={staticImageById(4)} alt="" />
        <h2 className="text-[#334054] font-semibold text-xl ml-5">Favorites</h2>
      </div>
      <div className="flex p-3 m-3 cursor-pointer hover:bg-lime-500">
        <img src={staticImageById(8)} alt="" />
        <h2 className="text-[#334054] font-semibold text-xl ml-5">Library</h2>
      </div>
      <div className="mt-10">
        {sideMusic.map((song) => (
          <p
            key={song.id}
            className="text-[#334054] font-semibold p-2 m-3 ml-14 cursor-pointer hover:text-[#C7AF4E] text-xl"
          >
            {song.title}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar