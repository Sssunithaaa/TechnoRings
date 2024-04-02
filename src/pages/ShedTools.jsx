import React,{useState} from "react";
import { useLocation } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import AddShedTools from "../forms/AddShedTool";
const ShedTools = () => {
  const location = useLocation();
  const state = location.state;
  const service = state.shed_tools;
  console.log(service)
 const usingTools = service?.shed_tools?.map(item => item.using_tool);
console.log(usingTools); 
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
   const [close,setClose] = useState(true)
  return (
    <div>
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <button className="px-5 py-2 bg-blue-500 rounded-md text-white font-semibold" onClick={addShedTools}>Add shed tools</button>
         {showAddShedTools && <AddShedTools setClose={setShowAddShedTools} />}

            <Header className="Page" title="Shed tools" />
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
