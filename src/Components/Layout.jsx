import { Outlet } from "react-router-dom";
import AudioPlayer from "./AudioPlayer/AudioPlayer";

const Layout = () => {
  return (
    <main>
      <Outlet />
      <AudioPlayer />
    </main>
  );
};

export default Layout;
