import React,{useState,useEffect} from "react";
import { useLocation, useParams } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import AddShedTools from "../forms/AddShedTool";
import axios from "axios";
const ShedTools = () => {
  const location = useLocation();
  const [shedTools,setShedTools] = useState([])
  const state = location.state;
  const service = state.shed_tools;
 
 const usingTools = shedTools?.map(item => item.using_tool);
console.log(usingTools); 
const id= useParams();
const fetchToolData = async (shed_id) => {
    try {
        const response = await axios.get(`http://localhost:8000/shed_detail/${shed_id}/`);

  
        setShedTools(response?.data?.shed_tools)
        console.log(shedTools)
      
    } catch (error) {
        console.error("Error fetching tool data:", error);
    }
};
useEffect(()=> {
  fetchToolData(id["id"])
},[])
//   const usingTools = service?.map(item => item.using_tool);
  let grid;
    const serviceGrid = [
    {
      field: "instrument_no", // Access nested field
      headerText: "Tool number",
      width: "150",
      textAlign: "Center",
    },
    {
      field:"instrument_name", // Access nested field
      headerText:"Tool name",
      width:"150",
      textAlign:"Center"
    },
    {
      field: "year_of_purchase", // Access nested field
      headerText: "Year of purchase",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "calibration_frequency", // Access nested field
      headerText: "Calibration frequency",
      width: "150",
      textAlign: "Center",
    },
  ];
 
    const toolbarClick = (args) => {
        if (args.item.id === 'gridcomp_pdfexport') {
            grid.showSpinner();
            grid.pdfExport();
        }
    };

    const pdfExportComplete = () => {
        grid.hideSpinner();
    };
    const [showAddShedTools, setShowAddShedTools] = useState(false);
    const addShedTools=()=>{
       setShowAddShedTools(true)



    }
    const shed_id = state?.shed_tools?.shed["shed_id"]
    console.log(shed_id)
     const handleDelete = async ()=> {
     try {
      const response = await axios.post(`http://127.0.0.1:8000/shed/${shed_id}/delete/`);
      console.log(response)
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
  return (
    <div>
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        
         {showAddShedTools && <AddShedTools  setClose={setShowAddShedTools} />}

            <Header className="Page" title="Shed tools" />
            <div className="flex flex-row justify-between gap-x-5 my-4">
              <button className="px-5 py-2 bg-blue-500 rounded-md text-white font-semibold" onClick={addShedTools}>Add shed tools</button>
        <button className="px-5 py-2 bg-blue-500 rounded-md text-white font-semibold"  onClick={handleDelete}>Delete shed</button>
            </div>
            <GridComponent
                id="gridcomp"
                dataSource={usingTools}
                width="auto"
                allowGrouping
                allowPaging
                allowFiltering
                allowSorting
                toolbar={['PdfExport']}
                allowPdfExport
                pdfExportComplete={pdfExportComplete}
                toolbarClick={toolbarClick}
            >
                <ColumnsDirective>
                    {serviceGrid.map((item, index) => (
                        <ColumnDirective key={index} {...item}></ColumnDirective>
                    ))}
                    {/* Custom column for the view transport history button */}
                </ColumnsDirective>
                <Inject
                    services={[
                        Group,
                        Toolbar,
                        Sort,
                        Filter,
                        Page,
                        Edit,
                        PdfExport,
                    ]}
                />
            </GridComponent>
        </div>
        </div>
  )
};

export default ShedTools;
