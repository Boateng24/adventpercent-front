// import { Link } from "react-router-dom";
// import Banner from "../Components/Banner";
// import Navbar from "../Components/Navbar";
import Trending from "../Components/Trending";
import Sidebar from "../Components/Sidebar";
import Main from "../Components/Main";
import MainPlayer from "../Components/MainPlayer";
const Home = () => {
  return (
    <div className="flex w-[100vw] absolute ">
      <Sidebar/>
      <Main/>
      <Trending/>
      <MainPlayer/>
    </div>
  );
};

export default Home;
