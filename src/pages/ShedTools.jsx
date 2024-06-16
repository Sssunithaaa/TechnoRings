import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import AddShedTools from "../forms/AddShedTool";
import axios from "axios";
import BackButton from "../components/BackButton";

const ShedTools = () => {
  const location = useLocation();
  const [shedTools, setShedTools] = useState([]);
  const [tools, setTools] = useState([]);
  const [name, setName] = useState()
  const state = location.state;
  const id = useParams();

  const fetchToolData = async (shed_id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/shed_detail/${shed_id}/`);
      setName(response?.data?.shed?.name)
      setShedTools(response?.data?.shed_tools);
    } catch (error) {
      console.error("Error fetching tool data:", error);
    }
  };

  const fetchToolsData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
      setTools(response?.data?.instrument_models);
    } catch (error) {
      console.error("Error fetching tool data:", error);
    }
  };

  useEffect(() => {
    fetchToolData(id["id"]);
    fetchToolsData();
  }, []);

  // Merge shedTools and tools data
  const mergedToolsData = shedTools.map(shedTool => {
    const toolDetails = tools.find(tool => tool.instrument_no === shedTool.using_tool.instrument_no);
    return { ...shedTool.using_tool, ...toolDetails };
  });

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
  const addShedTools = () => {
    setShowAddShedTools(true);
  };

  const shed_id = state?.shed_tools?.shed["shed_id"];

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/shed/${shed_id}/delete/`);
      console.log(response);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const serviceGrid = [
    { field: "instrument_no", headerText: "Tool Number", width: "150", textAlign: "Center" },
    { field: "instrument_name", headerText: "Tool Name", width: "150", textAlign: "Center" },
    { field: "manufacturer_name", headerText: "Manufacturer", width: "150", textAlign: "Center" },
    { field: "year_of_purchase", headerText: "Year of Purchase", width: "150", textAlign: "Center" },
    { field: "gst", headerText: "GST", width: "150", textAlign: "Center" },
    { field: "description", headerText: "Description", width: "150", textAlign: "Center" },
    { field: "instrument_range", headerText: "Range", width: "150", textAlign: "Center" },
    { field: "least_count", headerText: "Least Count", width: "150", textAlign: "Center" },
    { field: "calibration_frequency", headerText: "Calibration Frequency", width: "150", textAlign: "Center" },
    { field: "service_status", headerText: "Service Status", width: "150", textAlign: "Center" },
    { field: "type_of_tool_name", headerText: "Type of Tool", width: "150", textAlign: "Center" }
  ];

  let grid;

  return (
    <div>
      <div className="flex justify-start ml-10 mt-10">
        <BackButton />
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        {showAddShedTools && <AddShedTools setClose={setShowAddShedTools} />}
        <Header className={`Shed tools`} title={name}/>
        <div className="flex flex-row justify-between gap-x-5 my-4">
          <button className="px-5 py-2 bg-blue-500 rounded-md text-white font-semibold" onClick={addShedTools}>Add shed tools</button>
          <button className="px-5 py-2 bg-red-500 rounded-md text-white font-semibold" onClick={handleDelete}>Delete shed</button>
        </div>
        <GridComponent
          id="gridcomp"
          dataSource={mergedToolsData}
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
          </ColumnsDirective>
          <Inject
            services={[Group, Toolbar, Sort, Filter, Page, Edit, PdfExport]}
          />
        </GridComponent>
      </div>
    </div>
  );
};

export default ShedTools;
