import { recentSongs } from "../data/recent";
import { recommended } from "../data/recommendation";
import { recentPlayed } from "../data/newlyPlayed";
import { staticImageById } from "../helpers/findImage";


const BottomMusic = () => {
  return (
    <div>
      <div className="newreleases">
        <div className="flex mt-5 justify-between">
          <h1 className="text-[#334054] font-bold text-lg">New Releases</h1>
          <img
            src={staticImageById(11)}
            alt=""
            className="ml-[-470px] cursor-pointer"
          />
          <p className="text-[#C7AF4E] cursor-pointer">See more</p>
        </div>
        <div className="flex gap-5 flex-wrap mt-3 w-full">
          {recentSongs.map((item) => (
            <div key={item.id} className="flex-1">
              <img
                src={item.imageSrc}
                alt="recentImg"
                className=" w-full h-44"
              />
              <h3 className="text-[#135352] font-semibold">{item.title}</h3>
              <p className="text-[#334054]">{item.artist}</p>
            </div>
          ))}
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