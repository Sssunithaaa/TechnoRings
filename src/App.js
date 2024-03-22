import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import { useStateContext } from "./context/ContextProvider";
import { useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Navbar, Footer, Sidebar,ThemeSettings } from "./components";
import {
  Ecommerce,
  Orders,
  Calendar,
  Employees,
  ColorPicker,
  Area,
  Bar,
  ColorMapping,
  Customers,
  
} from "./pages";
import CreateMovement from "./forms/Transport";
import CreateService from "./forms/Service";
import Employee from "./pages/Employee";
import Kanban from "./pages/Kanban";
import Shed from "./pages/Shed";
import Calibration from "./pages/Calibration";
function App() {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);
  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                onClick={()=> setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: "50%" }}
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>
               {themeSettings && (<ThemeSettings />)}
              <Routes>
                <Route exact path="/" element={<Ecommerce />}></Route>

                <Route path="/orders" element={<Orders />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/vendors" element={<Employee />} />
                <Route path="/shed" element={<Shed />} />
                <Route path="/calibration" element={<Calibration />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/color-picker" element={<ColorPicker />} />
                <Route
                  path="/transactions"
                  element={<CreateMovement />}
                ></Route>
                <Route path="/services" element={<CreateService />}></Route>
                <Route path="/line" element="line" />
                <Route path="/pie" element="pie" />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
