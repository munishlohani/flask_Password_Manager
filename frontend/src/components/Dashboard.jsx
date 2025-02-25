import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";
import TableRow from "./TableRow";
import { Spiral as Hamburger } from 'hamburger-react'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";





export default function Dashboard() {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState([]);

  const nav = useNavigate();
  const [isOpen, setOpen] = useState(false)


  const [siteName,setSiteName]=useState("");
  const [createPassword,setCreatePassword]=useState("");
  const [siteURL,setSiteURL]=useState("");

  const [createSuccess,setCreateSuccess]=useState(true);


    const [icon, setIcon] = useState(<AiFillEyeInvisible size={"1.5em"} />);
    const [type, setType] = useState("password");





  const handleSubmit=async(e)=>{
    e.preventDefault();

    var data={
      site_name:siteName,
      site_password:createPassword,
      site_url:siteURL
    }
    try{

      const response=await api.post("/dashboard/create",data)
      console.log(response)
      setCreateSuccess(true);
      setOpen(!open);

    }catch (e){
      console.log(e)
      setCreateSuccess(false);

    }

  }


  const handleEye = () => {
    setType((prev) => (prev === "password" ? "text" : "password"));
    setIcon((prev) => (prev.type === AiFillEyeInvisible ? <AiFillEye size={"1.5em"} /> : <AiFillEyeInvisible size={"1.5em"} />));
  };


  useEffect(() => {
    const auth = async () => {
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
    };

    auth();
  }, [nav,handleSubmit]);


  return (
    <>
      <div className="w-[95vw] h-screen p-2 flex gap-2 ab z-50">

        <div className="z-50 absolute">

        <Hamburger toggled={isOpen} toggle={setOpen}  color="#ffffff" />
        </div>
        <div className={`left  z-10 absolute md:fixed  transition-all duration-300 ease-in  ${isOpen?"translate-x-0 w-[40vw]":"-translate-x-[200%]"} md:w-[20vw] bg-zinc-800 h-full m-0 p-0 rounded-md `}>
            <div className=" absolute z-40 md:w-[20vw] bg-zinc-800 h-full m-0 p-0 rounded-md">
                <div className="flex flex-col h-full mt-[10vh] p-2 gap-3">
                  <h4 className="font-bold  text-lg md:text-xl">Add Password</h4>
                  <h5 className={`text-red-500 font-light ${!createSuccess?"visible opacity-100":"invisible opacity-0"} transition-opacity duration-200 m-0 p-0`}>Invalid Input</h5>
                  <form action="" method="POST" onSubmit={handleSubmit} >

                    <input type="text" className="border-1 border-zinc-600 mb-2 p-1 rounded-sm w-[80%]"  name="site_name" id="site_name" placeholder="Enter Site Name" value={siteName} onChange={(e)=>setSiteName(e.target.value)}/>
    <div className="flex relative justify-between gap-0">

                    <input type={type} className={`border-1 border-zinc-600 mb-2 p-1 rounded-sm w-[80%] `} name="site_password" id="site_password" placeholder="Enter Site Password" value={createPassword} onChange={(e)=>setCreatePassword(e.target.value)} />

                    <span className="flex items-center   top-0.5" onClick={handleEye}>
                  {icon}
                </span>


    </div>

                    <input type="text" className="border-1 border-zinc-600 mb-2 p-1 rounded-sm w-[80%]" name="site_url" id="site_url" value={siteURL} onChange={(e)=>setSiteURL(e.target.value)} placeholder="Enter Site URL"/>

                    <button className="block  w-[80%] bg-white rounded-sm text-black font-bold cursor-pointer hover:bg-white/70 active:bg-white/60 transition-all duration-200">Submit</button>
                    
                  </form>
                </div>


            </div>
            {/* <div className={` absolute transition-all duration-300 ease-in-out z-20 w-screen h-screen bg-gray-700/50 backdrop-blur-sm ${isOpen?"translate-x-0 w-[40vw]":"-translate-x-[2000%]"}`}></div> */}
        </div>
        
       
        <div className="right flex flex-col w-[65vw] p-1 sm: ml-[15vw] ">
          <h1 className="text-3xl font-bold ml-3 p-1 mb-3 ">Dashboard</h1>
          {data && (
            <div className="border-y-1 flex flex-col">
              <div className="header flex rounded-sm w-full text-sm md:text-xl justify-between md:justify-evenly items-center content-center text-left p-2 border-b-1 border-zinc-700">
                <h4>Site Name</h4>
                <h4>Site Password</h4>
                <h4 className='md:visible invisible'>Site Url</h4>
              </div>

              {password &&
                password.length > 0 &&
                password.map((item, _) => {
                  const { password_id, site_name, site_password, site_url } =
                    item;
                  return (
                    <div key={password_id} className="odd:bg-zinc-800 rounded-sm ">
                      <TableRow
                        site_name={site_name}
                        site_password={site_password}
                        site_url={site_url}
                        id={password_id}
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
