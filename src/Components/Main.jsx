import BottomMusic from "./BottomMusic";
import { dynamicImageById } from "../helpers/findImage";


const Main = () => {
  return (
    <div className="w-2/4 mt-2 h-full">
      <div
        className="flex w-full h-[339px] relative bg-cover rounded-sm text-white"
        style={{ backgroundImage: `url(${dynamicImageById(1)})` }}
      ></div>
     <BottomMusic/>
     
    </div>
  );
}

export default Main