import React from "react";
import { Link, NavLink } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { links } from "../data/info";
import { useSelector } from "react-redux";
import { useStateContext } from "../context/ContextProvider";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/actions';
const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize,setIsLoading } =
    useStateContext();
  const {  role,id ,user} = useSelector(state => state.auth);
  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
    dispatch(logout())
    setActiveMenu(false)
    setIsLoading(true)
    setTimeout(()=> {
      setIsLoading(false)
       navigate("/")
    },1000)
   
  }


  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  return (
    <div className="px-3 h-screen md:overflow-hidden bg-main-dark-bg left-0 overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/home"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <SiShopware /> <span>Techno Rings</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10 ">
           {
            role !== "admin" &&  <NavLink className={`flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2 bg-[#7352FF]`}>
          <span className="capitalize text-center font-semibold flex mx-auto">{user}</span>
              </NavLink>
           }
               
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-white m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  link.role.includes(role) && <NavLink
                    to={link.link === "shed-tools" ? `/${link.link}/${id}`:`/${link.link}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : "",
                    })}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            ))}
            <NavLink
                     
                    
                    onClick={handleLogout}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : "",
                    })}
                    className={`absolute bottom-0 w-[90%] flex mx-4 items-center left-0  justify-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2 ${currentColor}`}
                  >
                    
                    <span className="capitalize text-center font-semibold flex mx-auto">LOGOUT</span>
                  </NavLink>
           
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
