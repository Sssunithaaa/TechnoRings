import React from "react";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Edit,
  Page,
  Toolbar,
  Group
  
} from "@syncfusion/ej2-react-grids";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CreateVendor from "../components/CreateVendor";
import { Header } from "../components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


const Vendor = () => {
  const toolbarOptions = ["Search"];
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
    
  ];

  const fetchVendorData = async (vendor_id) => {
    try {
        const response = await axios.get(`http://localhost:8000/vendor_details/${vendor_id}/`);

        

        // Navigate after setting state
        navigate(`${vendor_id}`);
    } catch (error) {
        console.error("Error fetching tool data:", error);
    }
};
   
  const editing = { allowDeleting: true, allowEditing: true,allowAdding:true,mode:'Dialog' }; 
  const { data: vendors,refetch } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await axios.get(" http://127.0.0.1:8000/vendor");
      console.log(response.data)
      return response.data;
    },
  });
const handleActionComplete = async (args) => {
  if (args.requestType === "save") {
    try {
      console.log(args.data)
      const response = await axios.post("http://localhost:8000/add_vendor/", args.data);
      console.log(response.data)
      if (response.data.success === false) {
        // Parse the error message from the response and toast it
        const errors = JSON.parse(response.data.errors);
        const errorMessage = errors.phone_number[0].message;
        toast.error(errorMessage);
      } else {
        toast.success("Successfully added vendor");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error("An error occurred while adding vendor");
    }
    refetch()
  } else if (args.requestType === "delete") {
    try {
      console.log(args.vendor_id)
      await axios.delete(`your-backend-endpoint/${args.data[0].id}`);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
}; 
 const rowSelected = (args) => {
        console.log(args.data);
        const selectedRecord = args.data["vendor_id"];
        fetchVendorData(selectedRecord);
    };
  
  return (
    <div className=" m-2  pt-2  md:m-10 mt-24  md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Vendors" />
      <ToastContainer/>
      <GridComponent
        dataSource={vendors?.vendors}
        width="auto"
        toolbar={["Add","Search"]}
        allowPaging
        allowSorting
        allowAdding
        allowEditing
        allowGrouping
        allowDeleting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
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
        <Inject services={[Search,Toolbar,Edit,Group, Page]} />
      </GridComponent>
    </div>
  );
};
export default Vendor;
