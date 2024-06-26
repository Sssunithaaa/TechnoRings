import React,{useState,useEffect} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter, PdfExport, ExcelExport} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import CreateMovement from "../forms/Transport";
import ToolDialog from "./ToolDialog";
const History = () => {
      const [open, setOpen] = useState(false);
         const [openn, setOpenn] = useState(false);
  const [selectedTransportOrder, setSelectedTransportOrder] = useState(null);

     const { data: transportOrders,refetch } = useQuery({
    queryKey: ["transportorders"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/all_transport_orders/`);
      return response.data.transport_orders;
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
    { field: "acknowledgment", headerText: "Acknowledgment", width: "150", textAlign: "Center" },
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
   const toolbarClick = (args) => {
    console.log(args.item.id)
        if (args.item.id === 'gridcomp_pdfexport') {
            grid.pdfExport();
        } else if(args.item.id === 'gridcomp_excelexport') {
            grid.excelExport();
        }
        
    };
  let grid;
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <button       className="bg-blue-500 rounded-sm py-2 px-4 text-white" 
 onClick={handleDialogOpen}>Add Tool Movement</button>
 
      <Header className="Page" title="Transport Orders" />

      <GridComponent
        id="gridcomp"
        dataSource={transportOrders}
        width="auto"
        
        allowPaging
        allowSelection
        allowSorting
        toolbar={["ExcelExport","PdfExport"]}
         pageSettings={{ pageSize: 5 }}
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
            Toolbar,
            Resize,
            Sort,
            ContextMenu,
            Filter,
            Page,
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
