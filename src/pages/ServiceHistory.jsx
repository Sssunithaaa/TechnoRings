import React,{useState} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Selection,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter, PdfExport, ExcelExport, Group, Search} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import Service from "../forms/Service";
import ServiceTool from "./ServiceTool";
const ServiceHistory = () => {
        const [open, setOpen] = useState(false);
  const [openn, setOpenn] = useState(false);
     const { data: serviceorders,refetch } = useQuery({
    queryKey: ["serviceorders"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/all_service_orders/`);
    
      return response.data.service_orders;
    },
  });
  
   const { data: vendors=[
    {
            "vendor_id": 1,
            "name": "Pruthviraj",
            "location": "Bengaluru",
            "address": "S-16",
            "phone_number": "7353647516",
            "email": "abc@gmail.com",
            "nabl_number": "1717171717",
            "nabl_certificate": "/media/vendor_certificates/samplereport.txt",
            "vendor_type": 2
        },
   ] } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/vendor/`);
    
      return response.data.vendors;
    },
  });
  
   const serviceGridColumns = [
  
    { field: "service_id", headerText: "Service ID", width: "150", textAlign: "Center" },
    { field: "vendor_name", headerText: "Vendor", width: "150", textAlign: "Center" },
    { field: "date", headerText: "Date", width: "150", textAlign: "Center" },
    { field: "amount", headerText: "Amount", width: "150", textAlign: "Center" },
    { field: "description", headerText: "Description", width: "150", textAlign: "Center" },
    { field: "tool_count", headerText: "Tool count", width: "150", textAlign: "Center" }
  ];
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
    const [service,setService] = useState([]);
    const handleRowClick = async (args) => {
    const serviceId = args.data.service_id;
 
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/service_orders/${serviceId}/`
      );
      setService(response.data)
      handleDialogOpenn();
    } catch (error) {
      console.error("Error fetching transport order details:", error);
    }
  };
   const toolbarClick = (args) => {
  
        if (args.item.id === 'gridcomp_pdfexport') {
            grid.pdfExport({
                pageOrientation: 'Landscape'
            });
        } else if(args.item.id === 'gridcomp_excelexport') {
            grid.excelExport();
        }
        
    };
  let grid;
    
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
       <button       className="bg-blue-500 rounded-sm py-2 px-4 text-white" 
 onClick={handleDialogOpen}>Add Service Order</button>
      <Header className="Page" title="Service Orders" />
      <GridComponent
        id="gridcomp"
        dataSource={serviceorders}
        width="auto"
          toolbar={["ExcelExport","PdfExport",'Search']}
        allowGrouping
        allowPaging
        allowFiltering
        
        allowSorting
         pageSettings={{ pageSize: 10 }}
        toolbarClick={toolbarClick}
        editSettings={{ allowEditing:true}}
        allowExcelExport
        sortSettings={{ columns: [{ field: 'service_id', direction: 'Descending' }] }} 

        allowPdfExport
        rowSelected={handleRowClick}
           ref={g => grid = g}
      >
        <ColumnsDirective>
          {serviceGridColumns.map((item, index) => (
            <ColumnDirective key={index} {...item}></ColumnDirective>
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Toolbar,
            Group,
            Sort,
            Search,
            Filter,
            Page,
            Edit,
            PdfExport,
            ExcelExport
          ]}
        />
      </GridComponent>
            <h2 className="mt-4 font-semibold text-[18px]">Click on records to view tools</h2>

                        <Service open={open} handleClose={handleDialogClose} />
       <ServiceTool open={openn} handleClose={handleDialogClosee} transportOrder={service}></ServiceTool>
    </div>
  );
};

export default ServiceHistory;
