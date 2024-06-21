import React,{useState,useEffect} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import AddInstrumentGroupDialog from "../forms/GroupMaster";
import { Button } from "@mui/material";
import ToolsDialog from "../forms/MasterDialog";
const GroupMaster = () => {
  const [open, setOpen] = useState(false);
  const [tools, setTools] = useState([]);
  const [toolsDialogOpen, setToolsDialogOpen] = useState(false);

  const { data: masters, refetch } = useQuery({
    queryKey: ["masters"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-group-master-tools/`);
      return response.data.instrument_group_masters;
    },
  });

  const handleDialogClose = () => {
    setOpen(false);
    refetch();
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleRowClick = async (args) => {
    const toolGroupId = args.data.tool_group_id;
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instruments_by_tool_group/${toolGroupId}/`);
      setTools(response.data.instruments); // Assuming the response contains an array of tools in response.data.tools
      setToolsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching tools for tool group:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const transportGridColumns = [
    { field: "tool_group_id", headerText: "Tool Group ID", width: "150", textAlign: "Center" },
    { field: "tool_group_name", headerText: "Tool group name", width: "150", textAlign: "Center" },
    { field: "tool_group_code", headerText: "Tool group code", width: "150", textAlign: "Center" },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Add Instrument Group
      </Button>
      <AddInstrumentGroupDialog open={open} handleClose={handleDialogClose} />

      <Header className="Page" title="Instrument group masters" />

      <GridComponent
        id="gridcomp"
        dataSource={masters}
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
        rowSelected={handleRowClick} // Add rowSelected event handler
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

      <ToolsDialog open={toolsDialogOpen} tools={tools} onClose={() => setToolsDialogOpen(false)} />
    </div>
  );
};

export default GroupMaster;
