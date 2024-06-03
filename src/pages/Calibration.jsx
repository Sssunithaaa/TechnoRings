import React, { useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport, ExcelExport } from '@syncfusion/ej2-react-grids';
import { CalibrationGrid } from '../data/apps';
import { useNavigate } from "react-router-dom";
import { Header } from "../components";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CalibrationDialog from "../forms/CalibrationDialog";
import AddInstrumentGroupDialog from "../forms/GroupMaster";
import { Button } from "@mui/material";
const Calibration = () => {
    let grid;
    const { data: calibrationData } = useQuery({
        queryKey: ["calibration"],
        queryFn: async () => {
            const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
            return response.data;
        },
    });
    const navigate = useNavigate();
    const [toolData, setToolData] = useState(null);
    const [service, setService] = useState(null);
    const [open, setOpen] = useState(false);

    const fetchToolData = async (instrument_no) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-transport-history/${instrument_no}/`);
            const response1 = await axios.get(`${process.env.REACT_APP_URL}/instrument-service-history/${instrument_no}/`);
            setToolData(response.data);
            setService(response1.data);
            navigate(`${instrument_no}`, { state: { service: response1.data, transport_order: response.data } });
        } catch (error) {
            console.error("Error fetching tool data:", error);
        }
    };
   
    const handleActionComplete = async (args) => {
        if (args.requestType === "save") {
            try {
                const response = await axios.post(`${process.env.REACT_APP_URL}/add_instrument1/`, args.data);
                toast.success("Tool added successfully", {
                    position: "top-center",
                    autoClose: 1000,
                    style: { width: "auto", style: "flex justify-center" },
                    closeButton: false,
                    progress: undefined,
                });
            } catch (error) {
                console.error("Error inserting data:", error);
            }
        } else if (args.requestType === "delete") {
            try {
                await axios.delete(`your-backend-endpoint/${args.data[0].id}`);
            } catch (error) {
                console.error("Error deleting data:", error);
            }
        }
    };

    const handleViewTransportHistory = (props) => {
        const instrument_no = props["instrument_no"];
        fetchToolData(instrument_no);
    };

    const rowSelected = (args) => {
        const selectedRecord = args.data["instrument_no"];
        fetchToolData(selectedRecord);
    };

    const toolbarClick = (args) => {
        if (args.item.id === 'gridcomp_pdfexport') {
            grid.showSpinner();
            grid.pdfExport();
        }
        if (args.item.id === 'Add') {
            setOpen(true);
        }
    };

    const pdfExportComplete = () => {
        grid.hideSpinner();
    };

    const handleDialogClose = () => {
        setOpen(false);
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };
      const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpenn = () => {
    setDialogOpen(true);
  };

  const handleDialogClosee = () => {
    setDialogOpen(false);
  };
    const handleAddTool =async (data) => {
        console.log("New tool data:", data);
      
        try {
                const response = await axios.post(`${process.env.REACT_APP_URL}/add_instrument1/`, data);
                console.log(response)
                if(response.data.success === false){
                toast.error("An error occured! Try again..", {
                    position: "top-center",
                    autoClose: 1000,
                    style: { width: "auto", style: "flex justify-center" },
                    closeButton: false,
                    progress: undefined,
                });
            } else{
            toast.success("Tool added successfully", {
                    position: "top-center",
                    autoClose: 1000,
                    style: { width: "auto", style: "flex justify-center" },
                    closeButton: false,
                    progress: undefined,
                });
                setTimeout(()=> {
                     setOpen(false);
                 },3000)
                }
            } catch (error) {
                console.log("Error inserting data:", error);
            }
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <ToastContainer />
            <div className="flex justify-between">
                <div>
                <button       className="bg-blue-500 rounded-sm py-2 px-4 text-white" 
 onClick={handleDialogOpen}>Add Instrument</button>
            </div>
 <div>
      <Button variant="contained" color="primary" onClick={handleDialogOpenn}>
        Add Instrument Group
      </Button>
      <AddInstrumentGroupDialog open={dialogOpen} handleClose={handleDialogClosee} />
    </div>
            </div>
            <Header className="Page" title="Instrument details" />
            <GridComponent
                id="gridcomp"
                dataSource={calibrationData?.instrument_models}
                width="auto"
                allowGrouping
                allowPaging
                allowFiltering
                allowSorting
                toolbar={['Delete', 'Edit', 'PdfExport', 'Add']}
                editSettings={{ allowAdding: true, allowDeleting: true, allowEditing: true, mode: 'Dialog' }}
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
                    <ColumnDirective headerText="View Transport History" width="150" template={(props) => (
                        <button className="bg-blue-500 rounded-sm py-2 px-4 text-white" onClick={() => handleViewTransportHistory(props)}>
                            View History
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
            <CalibrationDialog open={open} handleClose={handleDialogClose} handleAdd={handleAddTool} />
        </div>
    );
};

export default Calibration;
