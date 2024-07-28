import React, { useState, useEffect } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport, ExcelExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import AddShedTools from "../forms/AddShedTool";
import axios from "axios";
import BackButton from "../components/BackButton";
import UpdateShed from "../forms/UpdateShed";
import { toast,ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import CalibrationDialog from "../forms/CalibrationDialog";
import { useSelector } from "react-redux";
const ShedTools = () => {
  const [shedTools, setShedTools] = useState([]);
  const [tools, setTools] = useState([]);
  const [name, setName] = useState();
  const [shed,setShed] = useState();
 const date = new Date().toISOString().split('T')[0];
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
const {  user } = useSelector(state => state.auth);
  // Merge shedTools and tools data
 // Merge shedTools and tools data
const mergedToolsData = shedTools.map((shedTool, index) => {
  // Find matching tool details
  const toolDetails = tools.find(
    (tool) => tool.instrument_no === shedTool.using_tool.instrument_no
  );

  // Merge shedTool and toolDetails
  return {
    sl_no: index + 1, // Add serial number
    ...shedTool.using_tool, // Include shed tool data
    ...toolDetails, // Include additional tool details if found
  };
});

  const serviceGrid = [
    { field: "sl_no", headerText: "Sl No", width: "120", textAlign: "Center" },
     { field: "type_of_tool_name", headerText: "Instrument Name", width: "150", textAlign: "Center" },
        { field: "manufacturer_name", headerText: "Manufacturer", width: "150", textAlign: "Center" },
    { field: "instrument_name", headerText: "Instrument No", width: "150", textAlign: "Center" },
  { field: "instrument_range", headerText: "Range", width: "150", textAlign: "Center" },
  { field: "least_count", headerText: "Least Count", width: "150", textAlign: "Center" },
    { field: "calibration_frequency", headerText: "Calibration Frequency", width: "150", textAlign: "Center" },
   
    { field: "year_of_purchase", headerText: "Year of Purchase", width: "150", textAlign: "Center" },
    { field: "gst", headerText: "GST", width: "150", textAlign: "Center" },
    { field: "description", headerText: "Remarks", width: "150", textAlign: "Center" },
   
    
    
  ];
 const toolbarClick = (args) => {
    const exportPattern = /(excelexport|pdfexport)$/;

    if (exportPattern.test(args.item.id)) {
        if (args.item.id.endsWith('pdfexport')) {
            const pdfExportProperties = {
                pageOrientation: 'Landscape',
                header: {
                    fromTop: 0,
                    height: 130,
                    contents: [
                        {
                            type: 'Text',
                            value: 'TechnoRings, Shimoga',
                            position: { x: 0, y: 50 },
                            style: { textBrushColor: '#000000', fontSize: 20 }
                        }
                    ]
                }
            };
            grid.pdfExport(pdfExportProperties);
        } else if (args.item.id.endsWith('excelexport')) {
            const excelExportProperties = {
                header: {
                    headerRows: 2,
                    rows: [
                        {
                            cells: [
                                {
                                    colSpan: 11, // Adjust according to your column span
                                    value: 'TechnoRings, Shimoga',
                                    style: { fontColor: '#000000', fontSize: 22, hAlign: 'Center', bold: true }
                                }
                            ]
                        },{
                            cells: [
                                {
                                    colSpan: serviceGrid.length, // Adjust according to your column span
                                    value: `LIST OF MONITORING & MEASURING EQUIPMENTS INCLUDING CALIBRATION SCHEDULE & CALIBRATION HISTORY - ${user} PLANNED ON ${date}`,
                                    style: { fontColor: '#000000', fontSize: 14, hAlign: 'Center', bold: true }
                                }
                            ] 
                        }
                    ]
                }
        
                
            };
            grid.excelExport(excelExportProperties);
        }
    }
};




  const [showAddShedTools, setShowAddShedTools] = useState(false);
 
 
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
                toast.error("Error inserting data:");
            }
    };
const handleDialogOpenn = ()=> {
  setOpenn(true);

}
const handleDialogClosee=()=> {
  setOpenn(false)
} 


  let grid;
  const handleDialogOpen = ()=> {
    setOpen(true);
  }
   const handleDialogClose = ()=> {
    setOpen(false);
    refetch()
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
          pageSettings={{pageSize:10}}
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
