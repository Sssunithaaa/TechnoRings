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
import { toast } from "react-toastify";

const Vendor = () => {
  const toolbarOptions = ["Search"];
  

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

   
  const editing = { allowDeleting: true, allowEditing: true,allowAdding:true,mode:'Dialog' }; 
  const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await axios.get(" http://127.0.0.1:8000/vendor");
      return response.data;
    },
  });
  const handleActionComplete = async (args) => {
    if (args.requestType === "save") {
      try {
        console.log(args.data)
        const response = await axios.post("http://localhost:8000/add_vendor/", args.data);
        console.log(response)
        toast.success("Successfull")
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    } else if (args.requestType === "delete") {
      try {
        console.log(args.data[0].shed_id)
        await axios.delete(`your-backend-endpoint/${args.data[0].id}`);
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };
  
  return (
    <div className=" m-2  pt-2  md:m-10 mt-24  md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Vendors" />
      <GridComponent
        dataSource={vendors?.vendor}
        width="auto"
        toolbar={["Add","Search","Delete","Edit"]}
        allowPaging
        allowSorting
        allowAdding
        allowEditing
        allowGrouping
        allowDeleting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        actionComplete={handleActionComplete}
        
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
