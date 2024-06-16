import React, { useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Resize, ContextMenu, Inject, Edit, Toolbar, Sort, Filter } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import DeliveryChallan from "../forms/DeliveryChallan";
import ChallanTools from "./ChallanTools";

const Challan = () => {
  const [open, setOpen] = useState(false);
  const [openn, setOpenn] = useState(false);
  const [service, setService] = useState([]);
  
  const { data: deliveryChallans = [],refetch } = useQuery({
    queryKey: ["deliveryChallans"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/all_delivery_challan/`);
      console.log(response);
      return response.data.delivery_challan;
    },
  });


  


  const challanGridColumns = [
    { field: "deliverychallan_id", headerText: "Challan ID", width: "150", textAlign: "Center" },
    { field: "received_date", headerText: "Received Date", width: "150", textAlign: "Center" },
    { field: "vendor_name", headerText: "Vendor Name", width: "150", textAlign: "Center" },
    { field: "shed_name", headerText: "Shed Name", width: "150", textAlign: "Center" },
    { field: "service", headerText: "Service ID", width: "150", textAlign: "Center" },
 
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
  };

  const handleDialogOpenn = () => {
    setOpenn(true);
  };

  const handleRowClick = async (args) => {
    const challanId = args.data.deliverychallan_id;
    console.log(challanId);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/delivery-challans/${challanId}/`
      );
      setService(response.data);
      handleDialogOpenn();
    } catch (error) {
      console.error("Error fetching delivery challan details:", error);
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <button className="bg-blue-500 rounded-sm py-2 px-4 text-white" onClick={handleDialogOpen}>
        Add Delivery Challan
      </button>
      <Header className="Page" title="Delivery Challans" />
      <GridComponent
        id="gridcomp"
        dataSource={deliveryChallans}
        width="auto"
        allowPaging
        allowSelection
        allowSorting
        pageSettings={{ pageSize: 5 }}
        toolbar={['Delete']}
        editSettings={{ allowDeleting: true, allowEditing: true }}
        allowExcelExport
          sortSettings={{ columns: [{ field: 'deliverychallan_id', direction: 'Descending' }] }} 
        allowPdfExport
        rowSelected={handleRowClick}
      >
        <ColumnsDirective>
          {challanGridColumns.map((item, index) => (
            <ColumnDirective key={index} {...item}></ColumnDirective>
          ))}
        </ColumnsDirective>
        <Inject
          services={[Toolbar, Resize, Sort, ContextMenu, Filter, Page, Edit]}
        />
      </GridComponent>
      <h2 className="mt-4 font-semibold text-[18px]">Click on records to view tools</h2>
      <DeliveryChallan open={open} handleClose={handleDialogClose} refetch={refetch} />
            <ChallanTools open={openn} handleClose={handleDialogClosee} transportOrder={service} />

    </div>
  );
};

export default Challan;
