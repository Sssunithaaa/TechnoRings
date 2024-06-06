import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import { useStateContext } from "./context/ContextProvider";
import { useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Navbar, Sidebar,ThemeSettings } from "./components";
import Dashboard from "./pages/dashboard";
import {

  Orders,
  Calendar,
 
  
  
} from "./pages";
import VendorsDetail from "./pages/VendorsDetail";
import CreateMovement from "./forms/Transport";
import CreateService from "./forms/Service";
import VendorHandle from "./forms/VendorHandle";
import Kanban from "./pages/Kanban";
import Shed from "./pages/Shed";
import Calibration from "./pages/Calibration";
import Vendor from "./pages/Vendor";
import Transactions from "./pages/Transactions";
import ShedTools from "./pages/ShedTools";
import CalibrationDetailsForm from "./forms/CalibrationDetails";
import InstrumentGroup from "./forms/InstrumentGroup";
import Instruments from "./pages/Instruments";
import History from "./pages/History";
import ServiceHistory from "./pages/ServiceHistory";
import GenerateBill from "./pages/GenerateBill";
import Challan from "./pages/Challan";

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
  useEffect(()=> {
    window.scrollTo(0,0);
  },[])
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
            <div className="w-72 fixed sidebar">
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
                ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen overflow-x-auto md:ml-72 w-full  "
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>
               {themeSettings && (<ThemeSettings />)}
              <Routes>
                <Route exact path="/" element={<Dashboard />}></Route>
                <Route path="/orders" element={<Orders />} />
                <Route path="/vendors" element={<Vendor />} />
                <Route path="/shed" element={<Shed />} />
                <Route path="/calibration" element={<Calibration />} />
                                <Route path="/calibration/:id" element={<Transactions />} />
                 <Route path="/shed/:id" element={<ShedTools />} />
                 <Route path="/vendors/:id" element={<VendorsDetail />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/calibrationreport" element={<CalibrationDetailsForm />} />
                  <Route path="/transport-history" element={<History />} />
                              <Route path="/service-history" element={<ServiceHistory />} />

                <Route
                  path="/transactions"
                  element={<CreateMovement />}
                ></Route>
                <Route
                  path="/vendorhandle"
                  element={<VendorHandle />}
                ></Route>
                <Route
                  path="/deliverychallan"
                  element={<Challan />}
                ></Route>
                 <Route
                  path="/generate-bill/:id"
                  element={<GenerateBill />}
                ></Route>
                <Route path="/services" element={<CreateService />}></Route>
              
                <Route path="/instrument-group" element={<InstrumentGroup/>}></Route>
                <Route path="/instruments" element={<Instruments/>}></Route>
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
