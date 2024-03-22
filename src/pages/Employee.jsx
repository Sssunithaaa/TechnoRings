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
  
} from "@syncfusion/ej2-react-grids";
import CreateVendor from "../components/CreateVendor";
import { Header } from "../components";

const Employee = () => {
  const toolbarOptions = ["Search"];
  const employeesData = [
    {
      MovementDate: "2022-03-17",
      Tool: "Hammer",
      SourceShed: "Shed A",
      DestinationShed: "Shed B",
      ToolCount: 5,
      InstrumentName: "Screwdriver",
    },
    {
      MovementDate: "2022-03-18",
      Tool: "Wrench",
      SourceShed: "Shed C",
      DestinationShed: "Shed D",
      ToolCount: 10,
      InstrumentName: "Pliers",
    },
    // Add more data entries as needed
  ];

  const employeesGrid = [
    {
      field: "MovementDate",
      headerText: "Movement Date",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "Tool",
      headerText: "Tool",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "SourceShed",
      headerText: "Source Shed",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "DestinationShed",
      headerText: "Destination Shed",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "ToolCount",
      headerText: "Tool Count",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "InstrumentName",
      headerText: "Instrument Name",
      width: "150",
      textAlign: "Center",
    },
  ];

   function dialogTemplate(props) {
    return <CreateVendor {...props} />
   }
  const editing = { allowDeleting: true, allowEditing: true,mode:'Dialog',template:dialogTemplate };

  return (
    <div className="dark:text-gray-200 dark:bg-secondary-dark-bg m-2  pt-2  md:m-10 mt-24  md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Tool movement" />
      <GridComponent
        dataSource={employeesData}
        width="auto"
        toolbar={["Search","Delete","Edit"]}
        allowPaging
        allowSorting
        allowAdding
        allowEditing
        allowDeleting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        
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
        <Inject services={[Search,Toolbar,Edit, Page]} />
      </GridComponent>
    </div>
  );
};
export default Employee;
