import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  Button,
  FormControlLabel,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CreateMovement from "../forms/Transport";

const ToolDialog = ({ open, handleClose, transportOrder }) => {
  const [selectedToolIds, setSelectedToolIds] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const { data: calibrationData } = useQuery({
    queryKey: ["calibration"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
      return response.data.instrument_models;
    },
  });

  useEffect(() => {
    if (transportOrder) {
      const allToolIds = transportOrder.transport_tools.map(tool => tool.tool);
      setSelectedToolIds(allToolIds);
    }
  }, [transportOrder]);

  const handleCheckboxChange = (toolId) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedToolIds([]);
    } else {
      const allToolIds = transportOrder.transport_tools.map(tool => tool.tool);
      setSelectedToolIds(allToolIds);
    }
    setAllSelected(!allSelected);
  };

  const acknowledgeTools = async () => {
    if (!transportOrder) return;
    console.log(selectedToolIds)
    console.log(transportOrder.transport_order.movement_id)
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/transport_acknowledge_tools/${transportOrder.transport_order.movement_id}/`, {
        tool_ids: selectedToolIds,
      });
      handleClose();
    } catch (error) {
      console.error("Failed to acknowledge tools:", error);
    }
  };
  const [openn,setOpenn] = useState(false);
  const handleDialogOpenn=()=> {
    setOpenn(true)
  }
  const handleDialogClosee=()=> {
    setOpenn(false)
  }
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle className="text-center">Transport Order Details</DialogTitle>
      <DialogContent>
        {transportOrder ? (
          <div className="px-10">
            <p><strong>Movement ID:</strong> {transportOrder.transport_order.movement_id}</p>
            <p><strong>Movement Date:</strong> {transportOrder.transport_order.movement_date}</p>
            <p><strong>Acknowledgment:</strong> {transportOrder.transport_order.acknowledgment ? "Yes" : "No"}</p>
            <p><strong>Tool Count:</strong> {transportOrder.transport_order.tool_count}</p>
            <p><strong>Source Shed:</strong> {transportOrder.transport_order.source_shed_name}</p>
            <p><strong>Destination Shed:</strong> {transportOrder.transport_order.destination_shed_name}</p>
            <h3>Transport Tools</h3>
           
            {transportOrder.transport_tools.map((tool) => (
              <div key={tool.tool}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedToolIds.includes(tool.tool)}
                      onChange={() => handleCheckboxChange(tool.tool)}
                    />
                  }
                  label={<><strong>Tool ID:</strong> {tool.tool_name}</>}
                />
                <p><strong>Remarks:</strong> {tool.tool_movement_remarks}</p>
              </div>
            ))}
             <Button onClick={handleSelectAll} color="primary">
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
              <div className="flex mx-auto justify-center items-center">
                   <button className="px-5 py-2 bg-blue-500 mx-auto text-[14px] rounded-md text-white font-semibold" onClick={handleDialogOpenn}>Update transport order details
</button>
              </div>
      </DialogContent>

      <DialogActions>
        <button className="px-5 py-2 bg-red-500 text-[14px] rounded-md text-white font-semibold" onClick={handleClose}>
          Close
        </button>
        {
          !transportOrder?.transport_order.acknowledgment && (
            <button className="px-5 py-2 bg-blue-500 text-[14px] rounded-md text-white font-semibold" onClick={acknowledgeTools}>
              Acknowledge
            </button>
          )
        }
      </DialogActions>
      <CreateMovement open={openn} handleClose={handleDialogClosee} transportOrder={transportOrder}/>
    </Dialog>
  );
};

export default ToolDialog;
