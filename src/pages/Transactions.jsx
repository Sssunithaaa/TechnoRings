import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import CalibrationDialog from "../forms/CalibrationDialog";
const Transactions = () => {
 
  const id= useParams()
  const [service,setService] = useState([])
  const [transportOrder,setTransportOrder] = useState([])
  const location = useLocation();  
  const { state } = location;  
  const { instrument } = state || {}; 
  const fetchToolData = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-transport-history/${id}/`);
        const response1 = await axios.get(`${process.env.REACT_APP_URL}/instrument-service-history/${id}/`);

        setService(response1?.data?.service_history)
        setTransportOrder(response?.data?.transport_orders)
    } catch (error) {
        console.error("Error fetching tool data:", error);
    }

}; 
useEffect(()=> {
  fetchToolData(id["id"])
},[])
  
  
  const [shedDetails, setShedDetails] = useState({}); // State to store shed details
  let grid;
  // Fetch shed details from the server
  


   
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
    { field: "source_shed_name", headerText: "Source shed", width: "150", textAlign: "Center" },
    { field: "destination_shed_name", headerText: "Destination shed", width: "150", textAlign: "Center" },
    { field: "tool_count", headerText: "Tool count", width: "150", textAlign: "Center" }
  ];

  // Template function to display source shed name
 
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
     const handleActionComplete=async (args)=> {
      if (args.requestType === "delete") {
    try {
      console.log(args.data[0].movement_id)
     await axios.post(`${process.env.REACT_APP_URL}/transport_order/${args.data[0].movement_id}/delete/`);
      toast.success("Transport order deleted successfully")
    } catch (error) {
      toast.error(error.message)
      console.error("Error deleting data:", error);
    }
  }
     }
     const handleActionComplete1=async (args)=> {
      if (args.requestType === "delete") {
    try {
      console.log(args.data[0].service_id)
     await axios.post(`${process.env.REACT_APP_URL}/service_order/${args.data[0].service_id}/delete/`);
            toast.success("Service order deleted successfully")

    } catch (error) {
            toast.error(error.message)

      console.error("Error deleting data:", error);
    }
  }
     }
    const rowSelected2 = async (args) => {
        console.log(args.data);
        const id = Object.values(args.data)[0]
        
    
        try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/shed/${id}/delete/`);
      console.log(response)
    } catch (error) {
      console.error("Error deleting data:", error);
    }
    };
    
  const handleAcknowledgment = async (props) => {
  try {
     await axios.post(`${process.env.REACT_APP_URL}/transport_acknowledge_tools/${props.movement_id}/`);
    toast.success("Transport acknowledged successfully");
  } catch (error) {
    toast.error(error.message);
    
    console.log("Error acknowledging transport:", error);
  }
};
const navigate=useNavigate()
const handleDelete =async () => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_URL}/instrument/${instrument.instrument_no}/delete/`);
  console.log(response);
      toast.success("Instrument deleted successfully");
    setTimeout(()=> {
      navigate(-1);
    },3000)
  } catch (error) {
        toast.error("Error deleting tool!! Try again!!");

  }
}
 const renderInstrumentDetails = (instrument) => {
    return (
      <div className="instrument-details bg-white flex mx-auto rounded-md flex-col w-[90%] gap-y-2">
        <p><strong>Instrument No:</strong> {instrument.instrument_no}</p>
        <p><strong>Instrument Code:</strong> {instrument.instrument_name}</p>
        <p><strong>Instrument Range:</strong> {instrument.instrument_range}</p>
        <p><strong>Instrument Name:</strong> {instrument.type_of_tool_name}</p>
           <p><strong>Current Shed:</strong> {instrument.current_shed_name}</p>
        <button       className="bg-blue-500 rounded-md py-2 px-4 text-white" 
 onClick={handleDialogOpen}>Update Instrument</button>
                  <button className="px-5 py-2 bg-red-500 rounded-md text-white font-semibold" onClick={handleDelete}>Delete tool</button>

      </div>
    );
  };
      const [open, setOpen] = useState(false);

    const handleDialogClose = () => {
        setOpen(false);
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };
      const handleUpdate =async (data) => {
      
        try {
          console.log(`${process.env.REACT_APP_URL}update_instrument/${instrument.instrument_no}/`)
        
                const response = await axios.post(`${process.env.REACT_APP_URL}/update_instrument/${instrument.instrument_no}/`, data);
               
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
            toast.success("Tool updated successfully", {
                    position: "top-center",
                    autoClose: 1000,
                    style: { width: "auto", style: "flex justify-center" },
                    closeButton: false,
                    progress: undefined,
                });
                setTimeout(()=> {
                     setOpen(false);
                 },2000)
              
                }
            } catch (error) {
                console.log("Error inserting data:", error);
            }
    };
  return (
    <div>
     <div className="flex justify-start ml-10 mt-10">
       <BackButton/>
     </div>
     <div>
     
     </div>
     <div className="bg-white p-5 flex flex-col mx-auto w-[30%]">
        <Header className="Page" title="Instrument Details" />
        {instrument && renderInstrumentDetails(instrument)}
     </div>
      <div className="m-2 md:m-10 mt-20 p-2 md:p-10 bg-white rounded-3xl">
        <Header className="Page" title="Service orders" />
        <ToastContainer/>
        <GridComponent
          dataSource={service}
          width="auto"
          allowGrouping
          allowPaging
          allowFiltering
          allowSorting
          allowDeleting
          toolbar={['PdfExport','Delete']}
          allowPdfExport
          pdfExportComplete={pdfExportComplete}
          editSettings={{allowDeleting:true}}
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
          toolbar={['PdfExport','Delete']}
          allowPdfExport
            sortSettings={{ columns: [{ field: 'movement_id', direction: 'Descending' }] }} 
          pdfExportComplete={pdfExportComplete}
                            actionComplete={handleActionComplete}
                    editSettings={{allowDeleting:true}}

          toolbarClick={toolbarClick}
        >
          <ColumnsDirective>
            {transportGridColumns.map((item, index) => (
              <ColumnDirective key={index} {...item}></ColumnDirective>
            ))}
         
          </ColumnsDirective>
          <Inject services={[Group, Toolbar, Sort, Filter, Page, Edit, PdfExport]} />
        </GridComponent>
      </div> 
                  <CalibrationDialog open={open} handleClose={handleDialogClose} handleUpdate={handleUpdate} instrument={instrument} />

    </div>
  );
};

export default Transactions;
