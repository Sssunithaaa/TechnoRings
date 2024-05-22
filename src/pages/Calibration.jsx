import React, { useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport, ExcelExport, Template } from '@syncfusion/ej2-react-grids';
import { CalibrationGrid } from '../data/apps';
import { Header } from "../components";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Calibration = () => {
    let grid;
    const { data: calibrationData } = useQuery({
        queryKey: ["calibration"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8000/instrument-tools/");
            return response.data;
        },
    });
    const navigate = useNavigate()
    const [toolData, setToolData] = useState(null);
    const [service,setService] = useState(null);

    // Function to fetch tool data
   const fetchToolData = async (instrument_no) => {
    try {
        const response = await axios.get(`http://localhost:8000/instrument-transport-history/${instrument_no}/`);
        const response1 = await axios.get(`http://localhost:8000/instrument-service-history/${instrument_no}/`);

        // Set toolData and service
        setToolData(response.data);
        setService(response1.data);

        // Navigate after setting state
        navigate(`${instrument_no}`,{state: {service:response1.data, transport_order:response.data}});
    } catch (error) {
        console.error("Error fetching tool data:", error);
    }
};

      const handleActionComplete = async (args) => {
    if (args.requestType === "save") {
      try {
        console.log(args.data)
        const response = await axios.post("http://localhost:8000/add_instrument1/", args.data);
        console.log(response)
          toast.success("Tool added successfully", {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: "auto",
          style: "flex justify-center",
        },
        closeButton: false,
        progress: undefined,
      });
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } else if (args.requestType === "delete") {
      try {
        console.log(args.data[0].shed_id)
        await axios.delete(`your-backend-endpoint/${args.data[0].id}`);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };
    // Function to handle the click event of the custom button
    const handleViewTransportHistory = (props) => {
        console.log(props)
        const instrument_no = props["instrument_no"];
        fetchToolData(instrument_no);
    };
    

    const rowSelected = (args) => {
        console.log(args.data);
        const selectedRecord = args.data["instrument_no"];
        fetchToolData(selectedRecord);
    };

    const toolbarClick = (args) => {
        if (args.item.id === 'gridcomp_pdfexport') {
            grid.showSpinner();
            grid.pdfExport();
        }
    };

    const pdfExportComplete = () => {
        grid.hideSpinner();
    };
    console.log(calibrationData?.instrument_models)
    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <ToastContainer/>
            <Header className="Page" title="Instrument details" />
            <GridComponent
                id="gridcomp"
                dataSource={calibrationData?.instrument_models}
                width="auto"
                allowGrouping
                allowPaging
                allowFiltering
                allowSorting
                toolbar={['Delete', 'Edit','PdfExport','Add']}
                editSettings={{ allowAdding: true, allowDeleting: true, allowEditing: true,mode:'Dialog' }}
                allowExcelExport
                allowPdfExport
                actionComplete={handleActionComplete}
                rowSelected={rowSelected}
                pdfExportComplete={pdfExportComplete}
                toolbarClick={toolbarClick}
                ref={g => grid = g}
            >
                <ColumnsDirective>
                    {CalibrationGrid.map((item, index) => (
                        <ColumnDirective key={index} {...item}></ColumnDirective>
                    ))}
                    {/* Custom column for the view transport history button */}
                    <ColumnDirective headerText="View Transport History" width="150" template={(props) => (
                        <button className="bg-blue-500 rounded-sm py-2 px-4 text-white">
                            <button onClick={() => handleViewTransportHistory(props)}>View History</button>
                        </button>
                    )}></ColumnDirective>
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
                        ExcelExport
                    ]}
                />
            </GridComponent>
            
        </div>
    );
};

export default Calibration;
