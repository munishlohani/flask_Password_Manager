import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import TableRow from "./TableRow";
import { Spiral as Hamburger } from "hamburger-react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState([]);

  const nav = useNavigate();
  const [isOpen, setOpen] = useState(false);

  const [siteName, setSiteName] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [siteURL, setSiteURL] = useState("");

  const [createSuccess, setCreateSuccess] = useState(true);

  const [filterText,setFilterText]=useState("")

  const auth = useCallback(async () => {
    try {
      const response = await api.get("/dashboard");

      if (response.status === 200) {
        setData(response.data);
        setPassword(response.data.passwords);
      } else {
        nav("/");
      }
    } catch (e) {
      console.log(e);
      nav("/");
    }
  }, [nav]);
  const [icon, setIcon] = useState(<AiFillEyeInvisible size={"1.5em"} />);
  const [type, setType] = useState("password");
  useEffect(() => {
    auth();
  }, [auth]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      var data = {
        site_name: siteName,
        site_password: createPassword,
        site_url: siteURL,
      };
      try {
        const response = await api.post("/dashboard/create", data);
        console.log(response);
        setCreateSuccess(true);
        setOpen(!open);
        auth();

        setCreatePassword("");
        setSiteName("");
        setSiteURL("");
      } catch (e) {
        console.log(e);
        setCreateSuccess(false);
      }
    },
    [siteName, createPassword, siteURL, auth]
  );

  const handleLogOut=async(e)=>{
    e.preventDefault();

    try{
      const response=await api.post("/logout")
      if(response.status==200){
        nav("/")
      }

    }catch (e){
      console.log(e)
    }
  }
  




  const handleEye = () => {
    setType((prev) => (prev === "password" ? "text" : "password"));
    setIcon((prev) =>
      prev.type === AiFillEyeInvisible ? (
        <AiFillEye size={"1.5em"} />
      ) : (
        <AiFillEyeInvisible size={"1.5em"} />
      )
    );
  };

  return (
    <>
      <div className="w-[95vw] overflow-hidden h-[100vh] flex relative z-50">
        {/* Hamburger Menu */}
        <div className="z-50 absolute">
          <Hamburger toggled={isOpen} toggle={setOpen} color="#ffffff" />
        </div>

        {/* Left Sidebar */}
        <div
          className={`left z-30 absolute md:fixed transition-all duration-300 ease-in ${
            isOpen
              ? "opacity-100 md:translate-x-0 w-[40] md:w-[22vw]"
              : "invisible opacity-0 md:-translate-x-[1000%]"
          } md:w-[20vw] bg-zinc-900 h-full m-0 p-0 rounded-md w-[60vw]`}
        >
          <div className="absolute z-40 md:w-[20vw] bg-zinc-900 h-full m-0 p-0 rounded-md">
            <div className="flex flex-col h-full mt-[10vh] p-2 gap-3">
              <h4 className="font-bold text-lg md:text-xl">Add Password</h4>
              <h5
                className={`text-red-500 font-light ${
                  !createSuccess ? "visible opacity-100" : "invisible opacity-0"
                } transition-opacity duration-200 m-0 p-0`}
              >
                Invalid Input
              </h5>
              <form action="" method="POST" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="border-1 border-zinc-600 mb-2 p-1 rounded-sm w-full"
                  name="site_name"
                  id="site_name"
                  placeholder="Enter Site Name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
                <div className="flex relative justify-between gap-0">
                  <input
                    type={type}
                    className={`border-1 border-zinc-600 mb-2 p-1 rounded-sm w-full`}
                    name="site_password"
                    id="site_password"
                    placeholder="Enter Site Password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                  />
                  <span
                    className="flex items-center top-1 absolute right-1"
                    onClick={handleEye}
                  >
                    {icon}
                  </span>
                </div>
                <input
                  type="text"
                  className="border-1 border-zinc-600 mb-2 p-1 rounded-sm w-full"
                  name="site_url"
                  id="site_url"
                  value={siteURL}
                  onChange={(e) => setSiteURL(e.target.value)}
                  placeholder="Enter Site URL"
                />
                <button className="block w-full bg-white rounded-sm text-black font-bold cursor-pointer hover:bg-white/70 active:bg-white/60 transition-all duration-200">
                  Submit
                </button>
              </form>
            </div>


            <div className="signout absolute bottom-5 left-5">
              <button id="signout" className="py-2 px-3 bg-red-600 hover:bg-red-500 active:bg-red-800 rounded-md cursor-pointer" onClick={handleLogOut} ><span id="signout">Sign Out</span></button>
            </div>
          </div>

          <div className="md:h-screen md:w-screen bg-zinc-800/5 backdrop-blur-sm duration-100 absolute z-10"></div>
        </div>



        {/* Right Content */}
        <div className="right flex flex-col w-full p-1 sm:ml-[15vw]">
          <h1 className="text-3xl font-bold ml-[10vw] md:ml-3 p-1 mb-3">Dashboard</h1>
          <div className="search ">
            <input className="p-1  w-1/2 m-3 rounded-md border-zinc-600 border-1" type="text" name="search" id="search" placeholder="Search using Site URL" value={filterText} onChange={(e)=>setFilterText(e.target.value)} />
          </div>
          {data && (
            <div className=" flex flex-col ">
              <div className="header flex gap-3  w-full md:text-xl justify-between md:justify-evenly items-center content-center md:text-left p-2 border-y-1  border-zinc-700 text-[10px] invisible md:visible">
                <h4 className="w-1/4">Site Name</h4>
                <h4 className="w-1/4">Site Password</h4>
                <h4 className="md:visible md:w-1/4 invisible">Site Url</h4>
                <h4 className="w-1/6">Operation</h4>
              </div>

              {password &&
                password.length > 0 &&
                password.filter((item)=>item.site_name.toLowerCase().includes(filterText.toLowerCase())).map((item, _) => {
                  const { password_id, site_name, site_password, site_url } =
                    item;

                    if(site_name===""){
                      return ("Not Found :(")
                    }else{

                      return (
                        <div
                        key={password_id}
                      className="md:odd:bg-zinc-800 md:rounded-sm "
                    >
                      <TableRow
                        site_name={site_name}
                        site_password={site_password}
                        site_url={site_url}
                        id={password_id}
                        refr={auth}
                        
                        />
                    </div>
                  );
                }
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
