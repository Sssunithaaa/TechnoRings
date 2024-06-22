import React,{useState,useEffect} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
const MasterToolsDialog = ({  }) => {
  const {id} = useParams();
   const { data: tools, refetch } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      console.log(id)
      const response = await axios.get(`${process.env.REACT_APP_URL}/instruments_by_tool_group/${id}/`);
      return response.data.instruments;
    },
  });
  
   const CalibrationGrid = [

  {
    field: "instrument_no",
    headerText: "Instrument Number",
    width: "80",
    textAlign: "Center",
  },
  
  {
    field: "instrument_name",
    headerText: "Instrument Code",
    width: "150",
    textAlign: "Center",
  },
    {
    field: "type_of_tool_name",
    headerText: "Instrument Name",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "current_shed_name",
    headerText: "Shed",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "manufacturer_name",
    headerText: "Manufacturer Name",
    width: "150",
    textAlign: "Center",
  },
 
  {
    field: "year_of_purchase",
    headerText: "Year of purchase",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "gst",
    headerText: "GST",
    width: "120",
    textAlign: "Center",
  },
 
  {
    field: "least_count",
    headerText: "Least Count",
    width: "100",
    textAlign: "Center",
  },

 

];
   return (
    <div>
       <div className="flex justify-start ml-10 mt-10">
       <BackButton/>
     </div>
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
     

      <Header className="Page" title="Instrument group masters tools" />

      <GridComponent
        id="gridcomp"
        dataSource={tools}
        width="auto"
        allowPaging
        allowSelection
        allowSorting
        toolbar={['Delete']}
        pageSettings={{ pageSize: 5 }}
        editSettings={{ allowDeleting: true, allowEditing: true }}
        allowExcelExport
        sortSettings={{ columns: [{ field: 'tool_group_id', direction: 'Descending' }] }}
        allowPdfExport
      >
        <ColumnsDirective>
          {CalibrationGrid.map((item, index) => (
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
    </div>
   )
}


export default MasterToolsDialog