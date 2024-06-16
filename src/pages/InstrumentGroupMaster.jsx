import React,{useState,useEffect} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import AddInstrumentGroupDialog from "../forms/GroupMaster";
import { Button } from "@mui/material";
const GroupMaster = () => {
      const [open, setOpen] = useState(false);
 
     const { data: masters,refetch } = useQuery({
    queryKey: ["masters"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-group-master-tools/`);
      return response.data.instrument_group_masters;
    },
  });
 
 

      const handleDialogClose = () => {
        setOpen(false);
        refetch()
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };
  
  // Template function to display destination shed name
 
  useEffect(()=> {
    window.scrollTo(0,0);
  },[])
   const transportGridColumns = [
    
    { field: "tool_id", headerText: "Tool ID", width: "150", textAlign: "Center" },
    { field: "tool_group_name", headerText: "Tool group name", width: "150", textAlign: "Center" },
    { field: "tool_group_code", headerText: "Tool group code", width: "150", textAlign: "Center" },
    { field: "instrument_type", headerText: "Instrument type", width: "150", textAlign: "Center" },
  
  ];
//     const handleRowClick = async (args) => {
//     const movementId = args.data.movement_id;
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_URL}/transport_orders/${movementId}/`
//       );
//       setSelectedTransportOrder(response.data);
//       handleDialogOpenn();
//     } catch (error) {
//       console.error("Error fetching transport order details:", error);
//     }
//   };
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Add Instrument Group
      </Button>
       <AddInstrumentGroupDialog open={open} handleClose={handleDialogClose} />

      <Header className="Page" title="Instrument group masters" />

      <GridComponent
        id="gridcomp"
        dataSource={masters}
        width="auto"
        
        allowPaging
        allowSelection
        allowSorting
        toolbar={['Delete']}
         pageSettings={{ pageSize: 5 }}
        editSettings={{ allowDeleting:true,allowEditing:true}}
        allowExcelExport
          sortSettings={{ columns: [{ field: 'tool_id', direction: 'Descending' }] }} 
        allowPdfExport
                // rowSelected={handleRowClick} // Add rowSelected event handler

        
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
          ]}
        />
      </GridComponent>
   

    </div>
  );
};

export default GroupMaster;
