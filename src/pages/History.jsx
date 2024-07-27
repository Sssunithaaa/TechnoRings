import React,{useState,useEffect} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Resize,Inject,Edit,Toolbar,Sort,Filter, PdfExport, ExcelExport, Group} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import CreateMovement from "../forms/Transport";
import ToolDialog from "./ToolDialog";
import { useSelector } from "react-redux";
const History = () => {
      const [open, setOpen] = useState(false);
         const [openn, setOpenn] = useState(false);
  const [selectedTransportOrder, setSelectedTransportOrder] = useState(null);
 const { role,user } = useSelector((state) => state.auth);
  const { data: transportOrders, refetch } = useQuery({
  queryKey: ["transportorders"],
  queryFn: async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL}/all_transport_orders/`);
    let transformedData = response.data.transport_orders.map(order => ({
      ...order,
      acknowledgment: order.acknowledgment ? "accepted" : "not accepted"
    }));
  
    if(role === "shed"){
      transformedData = transformedData.filter((order)=> order.destination_shed_name === user || order.source_shed_name === user)
    }
   
    return transformedData;
  },
});


 
      const handleDialogClose = () => {
        setOpen(false);
        refetch()
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };
     const handleDialogClosee = () => {
        setOpenn(false);
        refetch()
    };
  const handleDialogOpenn = () => {
        setOpenn(true);
    };
 
  useEffect(()=> {
    window.scrollTo(0,0);
  },[])
   const transportGridColumns = [
    
    { field: "movement_id", headerText: "Movement ID", width: "150", textAlign: "Center" },
    { field: "movement_date", headerText: "Movement date", width: "150", textAlign: "Center" },
    { field: "acknowledgment", headerText: "Status", width: "150", textAlign: "Center" },
    { field: "source_shed_name", headerText: "Source shed", width: "150", textAlign: "Center" },
    { field: "destination_shed_name", headerText: "Destination shed", width: "150", textAlign: "Center" },
    { field: "tool_count", headerText: "Tool count", width: "150", textAlign: "Center" }
  ];
    const handleRowClick = async (args) => {
    const movementId = args.data.movement_id;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/transport_orders/${movementId}/`
      );
      setSelectedTransportOrder(response.data);
      handleDialogOpenn();
    } catch (error) {
      console.error("Error fetching transport order details:", error);
    }
  };
    const date = new Date().toISOString().split('T')[0];

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
                                    colSpan: transportGridColumns.length, // Adjust according to your column span
                                    value: 'TechnoRings, Shimoga',
                                    style: { fontColor: '#000000', fontSize: 20, hAlign: 'Center', bold: true }
                                }
                            ]
                        }, {
                            cells: [
                                {
                                    colSpan: transportGridColumns.length, // Adjust according to your column span
                                    value: `List of monitoring and measuring equipments including calibration schedule and calibration history of all sheds planned on ${date}`,
                                    style: { fontColor: '#000000', fontSize: 10, hAlign: 'Center',wAlign:'Center', bold: true }
                                }
                            ] 
                        }
                    ]
                }
        
                
            };
            grid.excelExport(excelExportProperties);
        }
    };
      const toolbarClickk = (args) => {
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
                                    colSpan: transportGridColumns.length, // Adjust according to your column span
                                    value: 'TechnoRings, Shimoga',
                                    style: { fontColor: '#000000', fontSize: 20, hAlign: 'Center', bold: true }
                                }
                            ]
                        }, {
                            cells: [
                                {
                                    colSpan: transportGridColumns.length, // Adjust according to your column span
                                    value: `List of monitoring and measuring equipments including calibration schedule and calibration history of all sheds planned on ${date}`,
                                    style: { fontColor: '#000000', fontSize: 10, hAlign: 'Center',wAlign:'Center', bold: true }
                                }
                            ] 
                        }
                    ]
                }
        
                
            };
            grid.excelExport(excelExportProperties);
        }
    };
  let grid;
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <button       className="bg-blue-500 rounded-sm py-2 px-4 text-white" 
 onClick={handleDialogOpen}>Add Instrument Movement</button>
 
      <Header className="Page" title="Instrument movement" />

      <GridComponent
        id="gridcomp"
        dataSource={transportOrders}
        width="auto"
        allowFiltering
        allowGrouping
        allowPaging
        allowSelection
        allowSorting
        toolbar={["ExcelExport","PdfExport"]}
         pageSettings={{ pageSize: 10 }}
        editSettings={{ allowDeleting:true,allowEditing:true}}
        toolbarClick={toolbarClick}
        allowExcelExport
          sortSettings={{ columns: [{ field: 'movement_id', direction: 'Descending' }] }} 
        allowPdfExport
                rowSelected={handleRowClick} // Add rowSelected event handler
           ref={g => grid = g}
        
      >
        <ColumnsDirective>
          {transportGridColumns.map((item, index) => (
            <ColumnDirective key={index} {...item}></ColumnDirective>
          ))}
        </ColumnsDirective>
        <Inject
          services={[
           Group,
          Toolbar,
                        Sort,
                        Filter,
                        Page,
                        Resize,
                        Edit,
                        PdfExport,
                        ExcelExport
          ]}
        />
      </GridComponent>
      <h2 className="mt-4 font-semibold text-[18px]">Click on records to view tools</h2>
                  <CreateMovement open={open} handleClose={handleDialogClose} />
<ToolDialog open={openn} handleClose={handleDialogClosee} transportOrder={selectedTransportOrder}></ToolDialog>
    </div>
  );
};

export default History;
