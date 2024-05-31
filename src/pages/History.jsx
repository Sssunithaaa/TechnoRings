import React,{useState,useEffect} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Selection,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import CreateMovement from "../forms/Transport";
const History = () => {
      const [open, setOpen] = useState(false);

     const { data: transportOrders } = useQuery({
    queryKey: ["transportorders"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/all_transport_orders/`);
      console.log(response);
      return response.data.transport_orders;
    },
  });
  const [shedDetails, setShedDetails] = useState({}); // State to store shed details
  let grid;
  // Fetch shed details from the server
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/shed-details/`)
      .then(response => {
        const shedMap = {};
        console.log(response.data.shed_details)
        response.data?.shed_details?.forEach(shed => {
          shedMap[shed.shed_id] = shed.name;
        });
        console.log(shedMap)
        // Set the shed details state
        setShedDetails(shedMap);
      })
      .catch(error => {
        console.error('Error fetching shed details:', error);
      });
  }, []);
  const mapShedIdToName = (id) => {
    return shedDetails[id] || 'Unknown'; // Return the shed name or 'Unknown' if not found
  };
   const sourceShedTemplate = (props) => {
    return <div>
      {mapShedIdToName(props.source_shed)}
    </div>;
  };
      const handleDialogClose = () => {
        setOpen(false);
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };
  // Template function to display destination shed name
  const destinationShedTemplate = (props) => {
    return <div>
      {mapShedIdToName(props.destination_shed)}
    </div>;
  };
  useEffect(()=> {
    window.scrollTo(0,0);
  },[])
   const transportGridColumns = [
    
    { field: "movement_id", headerText: "Movement ID", width: "150", textAlign: "Center" },
    { field: "movement_date", headerText: "Movement date", width: "150", textAlign: "Center" },
    { field: "acknowledgment", headerText: "Acknowledgment", width: "150", textAlign: "Center" },
    { field: "source_shed", headerText: "Source shed", width: "150", textAlign: "Center", template: sourceShedTemplate },
    { field: "destination_shed", headerText: "Destination shed", width: "150", textAlign: "Center", template: destinationShedTemplate },
    { field: "tool_count", headerText: "Tool count", width: "150", textAlign: "Center" }
  ];
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
        toolbar={['Delete']}
         pageSettings={{ pageCount: 5 }}
        editSettings={{ allowDeleting:true,allowEditing:true}}
        allowExcelExport
        allowPdfExport
        
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
                  <CreateMovement open={open} handleClose={handleDialogClose} />

    </div>
  );
};

export default History;
