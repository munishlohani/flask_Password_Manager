import { AiFillDelete } from "react-icons/ai";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { useState } from "react";
import api from "../api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function TableRow({
  site_name,
  site_password,
  site_url,
  id,
  refr,
}) {
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState(<AiFillEyeInvisible size={"1.5em"} />);
  const [type, setType] = useState("password");

  const openHandler = (e) => {
    e.preventDefault();
    setOpen(!open);
  };

  const deleteFnct = async (e) => {
    e.preventDefault();

    try {
      const password_id = id;

      const response = await api.delete(`/dashboard/delete/${password_id}`);
      if (response.status == 200) {
        refr();
      }
    } catch (e) {
      console.log(e);
    }
  };

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



  let password_hash="";

  for(let i=0;i<String(site_password).length;i++){
      password_hash+="*"
  }


  return (
    <>
      <div className="text-white flex gap-3 p-2 border-x-1 w-full md:relative rounded-sm absolute  border-zinc-700 justify-evenly text-left text-sm md:text-xl h-full invisible md:visible shadow-white/40 shadow-sm ">
        <h4 className="w-1/4">{site_name}</h4>
        <div className="password relative w-1/4">
          <h4 className="w-1/4">{type=="password"?password_hash :site_password}</h4>
          <span
            className="flex items-center top-1 absolute right-1"
            onClick={handleEye}
          >
            {icon}
          </span>
        </div>
        <h4 className="md:visible  md:w-1/4 overflow-x-hidden invisible">
          {site_url}
        </h4>
        <div className="operations flex w-1/6 absolute md:relative ">
          <button
            type="submit"
            onClick={deleteFnct}
            className="cursor-pointer hover:shadow-amber-50"
          >
            <AiFillDelete color="white" />
          </button>
        </div>
      </div>

      <div className="mobile md:hidden w-full h-full px-2 m-2 ">
        <div className="siteName py-3 px-1 bg-zinc-800 flex justify-around rounded-md  relative">
          <h4 className="w-1/2 font-bold">{site_name}</h4>
          <button type="submit" onClick={deleteFnct} className="cursor-pointer">
            <AiFillDelete color="white" />
          </button>
          <button onClick={openHandler}>
            {!open ? (
              <IoMdArrowDropdownCircle color="white" />
            ) : (
              <IoMdArrowDropupCircle color="white" />
            )}
          </button>
        </div>
        <div
          className={`password flex py-2 z-10 justify-around transition-all duration-300 ease-in    ${
            open
              ? " max-h-[100px] opacity-100"
              : "max-h-0 overflow-hidden  opacity-0"
          }`}
        >
        <div className="password relative w-1/4 flex items-center">
          <h4 className="w-1/2">{type=="password"?password_hash :site_password}</h4>
          <span
            className="flex items-center top-0 absolute right-1"
            onClick={handleEye}
          >
            {icon}
          </span>
        </div>        </div>
      </div>
    </>
  );
}
