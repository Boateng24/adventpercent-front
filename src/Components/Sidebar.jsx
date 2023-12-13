import { staticImageById } from "../helpers/findImage";
import { sideMusic } from "../data/sidedata";
const Sidebar = () => {
  return (
    <div className="w-1/4 sticky top-0 left-0 h-screen">
      <img src={staticImageById(1)} alt="" className="mt-5 ml-3" />
      <div className="bg-[#135352] flex p-5 m-5 cursor-pointer hover:bg-lime-500">
        <img src={staticImageById(7)} alt="" />
        <h1 className="text-white ml-5 font-extrabold text-2xl">Home</h1>
      </div>
      <div className="flex p-5 m-5 cursor-pointer hover:bg-lime-500">
        <img src={staticImageById(4)} alt="" />
        <h2 className="text-[#334054] font-semibold text-xl ml-5">Favorites</h2>
      </div>
      <div className="flex p-5 m-5 cursor-pointer hover:bg-lime-500">
        <img src={staticImageById(8)} alt="" />
        <h2 className="text-[#334054] font-semibold text-xl ml-5">Library</h2>
      </div>
      {sideMusic.map((song) => (
        <p
          key={song.id}
          className="text-[#334054] font-bold ml-10 pt-5 cursor-pointer hover:text-[#C7AF4E]"
        >
          {song.title}
        </p>
      ))}
    </div>
  );
}

export default Sidebar