import React,{useState} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Selection,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import Service from "../forms/Service";
const ServiceHistory = () => {
        const [open, setOpen] = useState(false);

     const { data: serviceorders } = useQuery({
    queryKey: ["serviceorders"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/all_service_orders/`);
      console.log(response);
      return response.data.service_orders;
    },
  });
  
   const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/vendor/`);
      console.log(response);
      return response.data.vendors;
    },
  });
   const getVendorName = (vendorId) => {
    const vendor = vendors.find((vendor)=> vendor.vendor_id === vendorId)
    return vendor ? vendor.name : "Unknown vendor"
  }
    const vendorTemplate = (props)=> {
      return <div>
        {getVendorName(props.vendor)}
      </div>
    }
   const serviceGridColumns = [
    { type: 'checkbox', width: '50' },
    { field: "service_id", headerText: "Service ID", width: "150", textAlign: "Center" },
    { field: "vendor", headerText: "Vendor", width: "150", textAlign: "Center",template: vendorTemplate },
    { field: "date", headerText: "Date", width: "150", textAlign: "Center" },
    { field: "amount", headerText: "Amount", width: "150", textAlign: "Center" },
    { field: "description", headerText: "Description", width: "150", textAlign: "Center" },
    { field: "tool_count", headerText: "Tool count", width: "150", textAlign: "Center" }
  ];
   const handleDialogClose = () => {
        setOpen(false);
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };
    
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
       <button       className="bg-blue-500 rounded-sm py-2 px-4 text-white" 
 onClick={handleDialogOpen}>Add Service Order</button>
      <Header className="Page" title="Service Orders" />
      <GridComponent
        id="gridcomp"
        dataSource={serviceorders}
        width="auto"
        
        allowPaging
        allowSelection
        allowSorting
        toolbar={['Delete']}
        editSettings={{ allowDeleting:true,allowEditing:true}}
        allowExcelExport
        allowPdfExport
        
      >
        <ColumnsDirective>
          {serviceGridColumns.map((item, index) => (
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
                        <Service open={open} handleClose={handleDialogClose} />

    </div>
  );
};

export default ServiceHistory;
