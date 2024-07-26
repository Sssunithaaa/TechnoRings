import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport, ExcelExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import AddShedTools from "../forms/AddShedTool";
import axios from "axios";
import BackButton from "../components/BackButton";
import UpdateShed from "../forms/UpdateShed";
import { toast,ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import CalibrationDialog from "../forms/CalibrationDialog";
const ShedTools = () => {
  const [shedTools, setShedTools] = useState([]);
  const [tools, setTools] = useState([]);
  const [name, setName] = useState();
  const [shed,setShed] = useState();

  const id = useParams();

const [open,setOpen] = useState(false)
    const [openn,setOpenn] = useState(false)
  const { refetch } = useQuery({
    queryKey: ["shedtools"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/shed_detail/${id["id"]}/`);
      setShed(response?.data.shed)
     
      setName(response?.data?.shed?.name)
      setShedTools(response?.data?.shed_tools);
  
    },
  });

  const fetchToolsData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
      setTools(response?.data?.instrument_models);
    } catch (error) {
      console.error("Error fetching tool data:", error);
    }
  };

  useEffect(() => {
    // fetchToolData(id["id"]);
    fetchToolsData();
  }, []);

  // Merge shedTools and tools data
  const mergedToolsData = shedTools.map(shedTool => {
    const toolDetails = tools.find(tool => tool.instrument_no === shedTool.using_tool.instrument_no);
    return { ...shedTool.using_tool, ...toolDetails };
  });

 const toolbarClick = (args) => {
    const exportPattern = /(excelexport|pdfexport)$/;

    if (exportPattern.test(args.item.id)) {
        if (args.item.id.endsWith('pdfexport')) {
            grid.pdfExport({
                pageOrientation: 'Landscape'
            });
        } else if (args.item.id.endsWith('excelexport')) {
            grid.excelExport();
        }
    }
};



  const [showAddShedTools, setShowAddShedTools] = useState(false);
  const addShedTools = () => {
    setShowAddShedTools(true);
  };

 
  const navigate=useNavigate();
  const handleDelete = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/shed/${id["id"]}/delete/`);
      if(response.data.success){
        toast.success(response.data.message)
        setTimeout(()=> {
          navigate(-1);
        },2000)
      } else {
        toast.error("Error deleting shed!!")
      }
    } catch (error) {
      toast.error("Error deleting shed!!")
      console.error("Error deleting data:", error);
    }
  };
  const handleAddTool =async (data) => {
      
        try {
                const response = await axios.post(`${process.env.REACT_APP_URL}/add_instrument1/`, data);
                if(response.data.success === false){
                     setOpenn(false)
                toast.error("An error occured! Try again..", {
                    position: "top-center",
                    autoClose: 1000,
                    style: { width: "auto", style: "flex justify-center" },
                    closeButton: false,
                    progress: undefined,
                });
               
                   
               
            } else{
                       setOpenn(false);
            toast.success("Tool added successfully", {
                    position: "top-center",
                    autoClose: 1000,
                    style: { width: "auto", style: "flex justify-center" },
                    closeButton: false,
                    progress: undefined,
                });
             
            
              
                
                 refetch()
                }
            } catch (error) {
                console.log("Error inserting data:", error);
            }
    };
const handleDialogOpenn = ()=> {
  setOpenn(true);

}
const handleDialogClosee=()=> {
  setOpenn(false)
} 
  const serviceGrid = [
    { field: "instrument_no", headerText: "Tool Number", width: "150", textAlign: "Center" },
    { field: "instrument_name", headerText: "Instrument code", width: "150", textAlign: "Center" },
    { field: "manufacturer_name", headerText: "Manufacturer", width: "150", textAlign: "Center" },
    { field: "calibration_frequency", headerText: "Calibration Frequency", width: "150", textAlign: "Center" },
    { field: "type_of_tool_name", headerText: "Instrument name", width: "150", textAlign: "Center" },
    { field: "year_of_purchase", headerText: "Year of Purchase", width: "150", textAlign: "Center" },
    { field: "gst", headerText: "GST", width: "150", textAlign: "Center" },
    { field: "description", headerText: "Description", width: "150", textAlign: "Center" },
    { field: "instrument_range", headerText: "Range", width: "150", textAlign: "Center" },
    { field: "least_count", headerText: "Least Count", width: "150", textAlign: "Center" },
    
  ];

  let grid;
  const handleDialogOpen = ()=> {
    setOpen(true);
  }
   const handleDialogClose = ()=> {
    setOpen(false);
    refetch()
  }
  const updateShed = () => {
    
  }

  const handleClose = ()=> {
    setShowAddShedTools(false)
    refetch()
  }
  return (
    <div>
      <div className="flex justify-start ml-10 mt-10">
        <BackButton />
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        {showAddShedTools && <AddShedTools setClose={handleClose} />}
        <ToastContainer/>
        <div className="flex flex-row justify-between gap-x-5 my-4">
          <button className="px-5 py-2 bg-blue-500 rounded-md text-white font-semibold" onClick={handleDialogOpen}>Update shed</button>

          <button className="px-5 py-2 bg-red-500 rounded-md text-white font-semibold" onClick={handleDelete}>Delete shed</button>
        </div>
        <Header className={`Shed tools`} title={name}/>
        
        <div>
                <button className="px-5 py-2 bg-blue-500 rounded-md mb-3 text-white font-semibold" onClick={handleDialogOpenn}>Add instrument</button>

        </div>
        <GridComponent
          id="gridcomp"
          dataSource={mergedToolsData}
          width="auto"
          allowGrouping
          allowPaging
          allowFiltering
          allowSorting
          allowExcelExport
          toolbar={['PdfExport','ExcelExport']}
          allowPdfExport
           ref={g => grid = g}
          toolbarClick={toolbarClick}
        >
          <ColumnsDirective>
            {serviceGrid.map((item, index) => (
              <ColumnDirective key={index} {...item}></ColumnDirective>
            ))}
          </ColumnsDirective>
          <Inject
            services={[Group, Toolbar, Sort, Filter, Page, Edit, PdfExport,ExcelExport]}
          />
        </GridComponent>
                    <UpdateShed open={open} handleClose={handleDialogClose} shed={shed} />
                <CalibrationDialog open={openn} handleClose={handleDialogClosee} shed={shed} handleAdd={handleAddTool}/>

      </div>
    </div>
  );
};

export default ShedTools;
