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

const Calibration = () => {
    let grid;
    const { data: calibrationData ,refetch} = useQuery({
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

    const fetchToolData = async (instrument_no,instrument) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-transport-history/${instrument_no}/`);
            const response1 = await axios.get(`${process.env.REACT_APP_URL}/instrument-service-history/${instrument_no}/`);
            setToolData(response.data);
            setService(response1.data);
            navigate(`${instrument_no}`);
        } catch (error) {
            console.error("Error fetching tool data:", error);
        }
    };
   
  
 

    const rowSelected = (args) => {
        const selectedRecord = args.data["instrument_no"];
        fetchToolData(selectedRecord,args.data);
    };

    const toolbarClick = (args) => {
        if (args.item.id === 'gridcomp_pdfexport') {
            grid.showSpinner();
            grid.pdfExport();
        } else if(args.item.id === 'gridcomp_excelexport') {
            grid.showSpinner();
            grid.excelExport();
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
                setTimeout(()=> {
                    setOpen(false)
                },3000)
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
                 refetch()
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
      
    </div>
            </div>
            <Header className="Page" title="Instrument details" />
            <GridComponent
                id="gridcomp"
                dataSource={calibrationData}
                width="auto"
                allowGrouping
                allowPaging
                allowFiltering
                allowSorting
                toolbar={['Delete',  'PdfExport','ExcelExport']}
                editSettings={{  allowDeleting: true, allowEditing: true, mode: 'Dialog' }}
                allowExcelExport
                allowPdfExport
                pageSettings={{pageSize:5}}
                rowSelected={rowSelected}
                pdfExportComplete={pdfExportComplete}
                          sortSettings={{ columns: [{ field: 'instrument_no', direction: 'Descending' }] }} 

                toolbarClick={toolbarClick}
                ref={g => grid = g}
            >
                <ColumnsDirective>
                    {CalibrationGrid.map((item, index) => (
                        <ColumnDirective key={index} {...item}></ColumnDirective>
                    ))}
                  {/*  <ColumnDirective headerText="View Transport History" width="150" template={(props) => (
                        <button className="bg-blue-500 rounded-sm py-2 px-4 text-white" onClick={() => handleViewTransportHistory(props)}>
                            View History
                        </button>
                    )}></ColumnDirective>*/}
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
