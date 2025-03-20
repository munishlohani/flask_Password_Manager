import { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Create() {
  const [password, setPassword] = useState("");
  const [password_again, setPasswordAgain] = useState("");

  const [icon, setIcon] = useState(<AiFillEyeInvisible size={"1.5em"} />);
  const [type, setType] = useState("password");
  const [username, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    username: "",
    password: "",
    email: "",
    general: "",
    passwordAgain:""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error.general) {
      const timer = setTimeout(() => {
        setError((prev) => ({ ...prev, general: "" }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error.general]);

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ username: "", password: "", email: "",passwordAgain:"", general: "" });

    if (!username) {
      setError((prev) => ({ ...prev, username: "This is a required field." }));
      setLoading(false);
      return;
    }
    if (!(email)) {
      setError((prev) => ({ ...prev, email: "This is required field" }));
      setLoading(false);
      return;
    }
    if (!password) {
      setError((prev) => ({ ...prev, password: "This is a required field." }));
      setLoading(false);
      return;
    }
    if (!(password===password_again)) {
      setError((prev) => ({ ...prev, passwordAgain: "Password Mismatch" }));
      setLoading(false);
      return;
    }
    if (!(password_again)) {
      setError((prev) => ({ ...prev, password_again: "This is required field" }));
      setLoading(false);
      return;
    }
    if (email !== "") {
      if (!validateEmail(email)) {
        setError((prev) => ({
          ...prev,
          email: "Please enter a valid email address.",
        }));
        setLoading(false);
        return;
      }
    }

    try {
      const data = { username, password, email,password_again };
      const response = await api.post("/register", data);


      

      if (response.status === 201) {
        navigate("/");
      } else {
        console.log(response.status)
        
        setError((prev) => ({ ...prev, general: "Invalid credentials." }));
      }
    } catch (err) {
      setError((prev) => ({ ...prev, general: "Invalid Credentials" }));
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="page w-full h-screen flex flex-col justify-center items-center">
      <div className="logo text-white absolute top-[2vh] left-[12vw] m-2">
        Password Manager
      </div>

      {/* Error Popup */}
      <div
        className={`transition-opacity duration-300 absolute w-[20vw] h-[5vh] bg-red-500/60 top-3 rounded-sm p-2 ${
          error.general ? "opacity-100" : "opacity-0 invisible"
        }`}
      >
        <h4>{error.general}</h4>
      </div>

      <div className="flex justify-center items-center">
        <div className="box w-[75vw] h-[50vh] md:w-[500px] md:h-[450px] bg-zinc-800 rounded-xl border-[0.5px] border-neutral-700 p-3 flex flex-col gap-4">
          <h3 className="ml-2 text-lg md:text-xl font-semibold font-mono">
            Create an Account
          </h3>

          <div className="form ml-2">
            <form onSubmit={handleCreate} className="select-none">
              <div className="username flex gap-2 items-center">
                <span className="block text-zinc-400 my-1 mb-2 bg-zinc-800">
                  Username
                </span>
                <span
                  className={`block text-red-400 my-1 mb-2 font-normal text-sm ${
                    error.username ? "visible" : "invisible"
                  }`}
                >
                  {error.username}
                </span>
              </div>
              <input
                className="text-zinc-400 w-full select-text rounded-sm p-[2px] border-[0.5px] border-zinc-600 mb-2"
                type="text"
                name="username"
                placeholder="Enter your Name"
                value={username}
                onChange={(e) => setUser(e.target.value)}
              />

              <div className="email flex gap-2 items-center">
                <span className="block text-zinc-400 my-1 mb-2 bg-zinc-800">
                  Email
                </span>
                <span
                  className={`block text-red-400 my-1 mb-2 font-normal text-sm ${
                    error.email ? "visible" : "invisible"
                  }`}
                >
                  {error.email}
                </span>
              </div>
              <input
                className="text-zinc-400 select-text w-full rounded-sm p-[2px] border-[0.5px] border-zinc-600 mb-2"
                type="text"
                name="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="password flex gap-2 items-center">
                <span className="block text-zinc-400 my-1 mb-2 bg-zinc-800">
                  Password
                </span>
                <span
                  className={`block text-red-400 my-1 mb-2 font-normal text-sm ${
                    error.password ? "visible" : "invisible"
                  }`}
                >
                  {error.password}
                </span>
              </div>
              <div className="password flex relative items-center">
                <input
                  className="text-zinc-400 w-full rounded-sm p-[2px] border-[0.5px] border-zinc-600 mb-2 select-none"
                  type={type}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="flex items-center absolute right-2 top-0.5"
                  onClick={handleEye}
                >
                  {icon}
                </span>
              </div>
              <div className="password flex gap-2 items-center">
                <span className="block text-zinc-400 my-1 mb-2 bg-zinc-800">
                  Password Again
                </span>
                <span
                  className={`block text-red-400 my-1 mb-2 font-normal text-sm ${
                    error.passwordAgain ? "visible" : "invisible"
                  }`}
                >
                  {error.passwordAgain}
                </span>
              </div>
              <div className="password flex relative items-center">
                <input
                  className="text-zinc-400 w-full rounded-sm p-[2px] border-[0.5px] border-zinc-600 mb-2 select-none"
                  type={type}
                  name="password_again"
                  placeholder="Enter your password"
                  value={password_again}
                  onChange={(e) => setPasswordAgain(e.target.value)}
                />
                <span
                  className="flex items-center absolute right-2 top-0.5"
                  onClick={handleEye}
                >
                  {icon}
                </span>
              </div>

              <button
                type="submit"
                className="bg-white text-zinc-800 px-3 py-1 w-full rounded-md hover:bg-white/50 transition-all duration-300 active:bg-white/30 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Creating new user..." : "Submit"}
              </button>
            </form>
            <a href="/" className="underline text-blue-600">Have an Account? Login </a>

          </div>
        </div>
      </div>
    </div>
  );
}
