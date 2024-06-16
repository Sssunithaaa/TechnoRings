import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@tanstack/react-query";

const Instruments = () => {
  const [toolId, setToolId] = useState(""); // State to store the tool ID
  const [service, setService] = useState([]);
  const [transportOrder, setTransportOrder] = useState([]);
  const [shedDetails, setShedDetails] = useState({}); // State to store shed details
  let grid;

  const { data: calibrationData } = useQuery({
    queryKey: ["instruments"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
      return response.data;
    },
  });

  const fetchToolData = async (toolId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-transport-history/${toolId}/`);
      const response1 = await axios.get(`${process.env.REACT_APP_URL}/instrument-service-history/${toolId}/`);

      setService(response1?.data?.service_history);
      setTransportOrder(response?.data?.transport_orders);
    } catch (error) {
      console.error("Error fetching tool data:", error);
    }
  };

  // Fetch shed details from the server
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/shed-details/`)
      .then(response => {
        const shedMap = {};
        response.data.shed_details.forEach(shed => {
          shedMap[shed.shed_id] = shed.name;
        });
        // Set the shed details state
        setShedDetails(shedMap);
      })
      .catch(error => {
        console.error('Error fetching shed details:', error);
      });
  }, []);

  // Function to map shed IDs to shed names
  const mapShedIdToName = (id) => {
    return shedDetails[id] || 'Unknown'; // Return the shed name or 'Unknown' if not found
  };

  const sourceShedTemplate = (props) => {
    return <div>{mapShedIdToName(props.source_shed)}</div>;
  };

  const destinationShedTemplate = (props) => {
    return <div>{mapShedIdToName(props.destination_shed)}</div>;
  };

  // Columns configuration for the service grid
  const serviceGridColumns = [
    { type: 'checkbox', width: '50' },
    { field: "service_id", headerText: "Service ID", width: "150", textAlign: "Center" },
    { field: "vendor", headerText: "Vendor", width: "150", textAlign: "Center" },
    { field: "date", headerText: "Date", width: "150", textAlign: "Center" },
    { field: "amount", headerText: "Amount", width: "150", textAlign: "Center" },
    { field: "description", headerText: "Description", width: "150", textAlign: "Center" },
    { field: "tool_count", headerText: "Tool count", width: "150", textAlign: "Center" }
  ];

  // Columns configuration for the transport grid
  const transportGridColumns = [
    { field: "movement_id", headerText: "Movement ID", width: "150", textAlign: "Center" },
    { field: "movement_date", headerText: "Movement date", width: "150", textAlign: "Center" },
    { field: "acknowledgment", headerText: "Acknowledgment", width: "150", textAlign: "Center" },
    { field: "source_shed", headerText: "Source shed", width: "150", textAlign: "Center", template: sourceShedTemplate },
    { field: "destination_shed", headerText: "Destination shed", width: "150", textAlign: "Center", template: destinationShedTemplate },
    { field: "tool_count", headerText: "Tool count", width: "150", textAlign: "Center" }
  ];

  // Function to handle PDF export toolbar click
  const toolbarClick = (args) => {
    if (args.item.id === 'gridcomp_pdfexport') {
      grid.showSpinner();
      grid.pdfExport();
    }
  };

  // Function to handle PDF export completion
  const pdfExportComplete = () => {
    grid.hideSpinner();
  };

  const handleActionComplete = async (args) => {
    if (args.requestType === "delete") {
      try {
        await axios.post(`${process.env.REACT_APP_URL}/transport_order/${args.data[0].movement_id}/delete/`);
        toast.success("Transport order deleted successfully");
      } catch (error) {
        toast.error(error.message);
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleActionComplete1 = async (args) => {
    if (args.requestType === "delete") {
      try {
         await axios.post(`${process.env.REACT_APP_URL}/service_order/${args.data[0].service_id}/delete/`);
        toast.success("Service order deleted successfully");
      } catch (error) {
        toast.error(error.message);
        console.error("Error deleting data:", error);
      }
    }
  };

  const rowSelected2 = async (args) => {
    const id = Object.values(args.data)[0];
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/shed/${id}/delete/`);
      console.log(response);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleAcknowledgment = async (props) => {
    try {
      console.log(props)
       await axios.post(`${process.env.REACT_APP_URL}/transport/${props.movement_id}/acknowledge/`);
      toast.success("Transport acknowledged successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchToolData(toolId);
  };

  return (
    <div>
      {/* <div className="flex justify-start ml-10 mt-10">
        <BackButton />
      </div> */}
      <div className="w-[40%] mt-24 flex mx-auto flex-col justify-center items-center p-6 bg-white rounded-3xl">
        <div className="w-full flex">
          <div className="w-full max-w-md">
            <Header className="Page" title="Enter Tool ID" />
            <form onSubmit={handleFormSubmit} className="mb-4">
              <label htmlFor="toolId" className="block text-sm font-medium text-gray-700">
                Tool ID
              </label>
              <select
                id="toolId"
                value={toolId}
                onChange={(e) => setToolId(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled>Select Tool</option>
                {calibrationData?.instrument_models?.map((tool) => (
                  <option key={tool.instrument_no} value={tool.instrument_no}>
                    {tool.instrument_name}
                  </option>
                ))}
              </select>
              <button type="submit" className="mt-4 px-4 py-2 flex mx-auto bg-blue-500 text-white rounded-md">
                Submit
              </button>
            </form>
            <ToastContainer />
          </div>
          
        </div>
      </div>

      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header className="Page" title="Service orders" />
        <GridComponent
          dataSource={service}
          width="auto"
          allowGrouping
          allowPaging
          allowFiltering
          allowSorting
          allowDeleting
          toolbar={['PdfExport', 'Delete']}
          allowPdfExport
          pdfExportComplete={pdfExportComplete}
          editSettings={{ allowDeleting: true }}
          toolbarClick={toolbarClick}
          rowSelected={rowSelected2}
          actionComplete={handleActionComplete1}
        >
          <ColumnsDirective>
            {serviceGridColumns.map((item, index) => (
              <ColumnDirective key={index} {...item}></ColumnDirective>
            ))}
          </ColumnsDirective>
          <Inject services={[Group, Toolbar, Sort, Filter, Page, Edit, PdfExport]} />
        </GridComponent>
      </div>

      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <Header className="Page" title="Transport orders" />
        <GridComponent
          dataSource={transportOrder}
          width="auto"
          allowGrouping
          allowPaging
          allowFiltering
          allowSorting
          allowDeleting
          toolbar={['PdfExport', 'Delete']}
          allowPdfExport
          pdfExportComplete={pdfExportComplete}
          actionComplete={handleActionComplete}
          editSettings={{ allowDeleting: true }}
          toolbarClick={toolbarClick}
        >
          <ColumnsDirective>
            {transportGridColumns.map((item, index) => (
              <ColumnDirective key={index} {...item}></ColumnDirective>
            ))}
            {/* <ColumnDirective headerText="Acknowledge" width="150" template={(props) => (
              
              props.acknowledgment !== "true" && (
                <button
                  className="bg-blue-500 rounded-sm py-2 px-4 text-white"
                  onClick={() => handleAcknowledgment(props)}
                >
                  Acknowledge
                </button>
              )
            )}></ColumnDirective> */}
          </ColumnsDirective>
          <Inject services={[Group, Toolbar, Sort, Filter, Page, Edit, PdfExport]} />
        </GridComponent>
      </div>
    </div>
  );
};

export default Instruments;
