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
      const date = new Date().toISOString().split('T')[0];

    const { data: calibrationData ,refetch} = useQuery({
        queryKey: ["calibration"],
        queryFn: async () => {
            const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
            
            return response.data;
        },
    });
  
    const navigate = useNavigate();
    // const [toolData, setToolData] = useState(null);
    // const [service, setService] = useState(null);
    const [open, setOpen] = useState(false);

   const fetchToolData = async (instrument_no, instrument) => {
    try {
        // const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-transport-history/${instrument_no}/`);
        // const response1 = await axios.get(`${process.env.REACT_APP_URL}/instrument-service-history/${instrument_no}/`);
        // setToolData(response.data);
        // setService(response1.data);
        navigate(`${instrument_no}`, { state: { instrument } }); // Passing instrument as state
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
        } else if (args.item.id === 'gridcomp_excelexport') {
            const excelExportProperties = {
                header: {
                    headerRows: 2,
                    rows: [
                        {
                            cells: [
                                {
                                    colSpan: 11, // Adjust according to your column span
                                    value: 'TechnoRings, Shimoga',
                                    style: { fontColor: '#000000', fontSize: 20, hAlign: 'Center', bold: true }
                                }
                            ]
                        }, {
                            cells: [
                                {
                                    colSpan: 11, // Adjust according to your column span
                                    value: `List of monitoring and measuring equipments including calibration schedule and calibration history of all sheds planned on ${date}`,
                                    style: { fontColor: '#000000', fontSize: 14, hAlign: 'Center', bold: true }
                                }
                            ] 
                        }
                    ]
                }
        
                
            };
            grid.excelExport(excelExportProperties);
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
      
        try {
                const response = await axios.post(`${process.env.REACT_APP_URL}/add_instrument1/`, data);
                if(response.data.success === false){
                     
                toast.error(response.data.errors, {
                    position: "top-center",
                    autoClose: 1000,
                    style: { width: "auto", style: "flex justify-center" },
                    closeButton: false,
                    progress: undefined,
                });
               
                   
               
            } else{
                       setOpen(false);
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
                toast.error(error.response.data.errors, {
                    position: "top-center",
                    autoClose: 1000,
                    style: { width: "auto", style: "flex justify-center" },
                    closeButton: false,
                    progress: undefined,
                })
            }
    };

    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
           <ToastContainer/>
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
                toolbar={[ 'PdfExport','ExcelExport']}
              
                allowExcelExport
                allowPdfExport
                pageSettings={{pageSize:10}}
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
            <ToastContainer/>
            <CalibrationDialog open={open} handleClose={handleDialogClose} handleAdd={handleAddTool} />
        </div>
    );
};

export default Calibration;
