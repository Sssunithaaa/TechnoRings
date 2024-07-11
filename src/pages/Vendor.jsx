import React, { useState } from "react";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Edit,
  Page,
  Toolbar,
  Group,
  ExcelExport,
  PdfExport
  
} from "@syncfusion/ej2-react-grids";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CreateVendor from "../forms/AddVendor";
import { Header } from "../components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const Vendor = () => {
  const [open,setOpen] = useState(false)
  const navigate = useNavigate()
 let grid;

const employeesGrid = [
  {
    field: "vendor_id",
    headerText: "Vendor ID",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "name",
    headerText: "Name",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "location",
    headerText: "Location",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "address",
    headerText: "Address",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "phone_number",
    headerText: "Phone number",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "email",
    headerText: "Email",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "vendor_type_name",
    headerText: "Vendor Type",
    width: "150",
    textAlign: "Center",
    template: (data) => {
      const vendorTypes = ["Manufacturer", "Dealer", "Calibration Agency"];
      return vendorTypes[data.vendor_type - 1]; // Assuming vendor_type is 1, 2, or 3
    },
  },
 
];


const toolbarClick = (args) => {
    console.log(args);

    const exportPattern = /(excelexport|pdfexport)$/;

    if (exportPattern.test(args.item.id)) {
        if (args.item.id.endsWith('pdfexport')) {
            grid.pdfExport({
                pageOrientation: 'Landscape'
            });
        } else if (args.item.id.endsWith('excelexport')) {
            grid.excelExport();
        }
    }
};



  const fetchVendorData = async (vendor_id) => {
    try {
      await axios.get(`${process.env.REACT_APP_URL}/vendor_details/${vendor_id}/`);

        navigate(`${vendor_id}`);
    } catch (error) {
        console.error("Error fetching tool data:", error);
    }
};
   
  const editing = { allowDeleting: true, allowEditing: true,allowAdding:true,mode:'Dialog' }; 
  const { data: vendors,refetch } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/vendor/`);
      console.log(response.data)
      return response.data;
    },
  });
const handleActionComplete = async (args) => {
  if (args.requestType === "save") {
    try {
      console.log(args.data)
      const response = await axios.post(`${process.env.REACT_APP_URL}/add_vendor/`, args.data);
      console.log(response.data)
      if (response.data.success === false) {
        // Parse the error message from the response and toast it
        const errors = JSON.parse(response.data.errors);
        const errorMessage = errors.phone_number[0].message;
        toast.error(errorMessage);
      } else {
        toast.success("Successfully added vendor");
        refetch()
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("An error occurred while adding vendor");
    }
    refetch()
  } else if (args.requestType === "delete") {
    try {
      console.log(args.vendor_id)
      await axios.delete(`${process.env.REACT_APP_URL}/${args.data[0].id}`);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
}; 
 const handleDialogClose = () => {
        setOpen(false);
        refetch()
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };
 const rowSelected = (args) => {
        console.log(args.data);
        const selectedRecord = args.data["vendor_id"];
        fetchVendorData(selectedRecord);
    };
  
  return (
    <div className=" m-2  pt-2  md:m-10 mt-24  md:p-10 bg-white rounded-3xl">
          <button       className="bg-blue-500 rounded-sm py-2 px-4 text-white" 
 onClick={handleDialogOpen}>Add Vendor</button>
      <Header category="Page" title="Vendors" />
      <ToastContainer/>
      <GridComponent
        dataSource={vendors?.vendors}
        width="auto"
        toolbar={["Search","ExcelExport","PdfExport"]}
        allowPaging
        allowSorting
        allowAdding
        allowEditing
        allowExcelExport
        toolbarClick={toolbarClick}
        allowPdfExport
        allowGrouping
        allowDeleting
        pageSettings={{ pageSize: 5 }}
        editSettings={editing}
          sortSettings={{ columns: [{ field: 'vendor_id', direction: 'Descending' }] }} 
        actionComplete={handleActionComplete}
        rowSelected={rowSelected}
         ref={g => grid = g}
        
        // toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {employeesGrid.map((item, index) => (
            <ColumnDirective
              key={index}
              field={item.field}
              width={item.width}
              textAlign={item.textAlign}
              headerText={item.headerText}
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Search,Toolbar,Edit,Group,ExcelExport,PdfExport, Page]} />
      </GridComponent>
                        <CreateVendor open={open} handleClose={handleDialogClose} />

    </div>
  );
};
export default Vendor;
