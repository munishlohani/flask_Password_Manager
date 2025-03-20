import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Create from "./components/Create";

const router = createBrowserRouter([
 
  { path: "/", element: <Home /> },
  { path: "/dashboard", element: <Dashboard />},
  { path: "/create", element: <Create />},
]);

export default router;
