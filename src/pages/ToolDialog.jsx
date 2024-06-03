import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ToolDialog = ({ open, handleClose, transportOrder }) => {
  const { data: calibrationData } = useQuery({
    queryKey: ["calibration"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
      return response.data.instrument_models;
    },
  });

  const getToolName = (toolId) => {
    const tool = calibrationData?.find((tool) => tool.instrument_no === toolId);
    return tool ? tool.instrument_name : "Unknown tool";
  };

  const acknowledgeTools = async () => {
    if (!transportOrder) return;

    const toolIds = transportOrder.transport_tools.map(tool => tool.transporttool_id);
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/transport/${transportOrder.transport_order.movement_id}/acknowledge/`, {
        tool_ids: toolIds,
      });
       console.log(response)
      handleClose();
    } catch (error) {
      console.error("Failed to acknowledge tools:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Transport Order Details</DialogTitle>
      <DialogContent>
        {transportOrder ? (
          <div>
            <p><strong>Movement ID:</strong> {transportOrder.transport_order.movement_id}</p>
            <p><strong>Movement Date:</strong> {transportOrder.transport_order.movement_date}</p>
            <p><strong>Acknowledgment:</strong> {transportOrder.transport_order.acknowledgment ? "Yes" : "No"}</p>
            <p><strong>Tool Count:</strong> {transportOrder.transport_order.tool_count}</p>
            <p><strong>Source Shed:</strong> {transportOrder.transport_order.source_shed}</p>
            <p><strong>Destination Shed:</strong> {transportOrder.transport_order.destination_shed}</p>
            <h3>Transport Tools</h3>
            {transportOrder.transport_tools.map((tool) => (
              <div key={tool.transporttool_id}>
                <p><strong>Tool ID:</strong> {getToolName(tool.transporttool_id)}</p>
                <p><strong>Remarks:</strong> {tool.tool_movement_remarks}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      {
        !transportOrder?.transport_order.acknowledgment &&   <Button onClick={acknowledgeTools} color="primary">
          Acknowledge
        </Button>
      }
      </DialogActions>
    </Dialog>
  );
};

export default ToolDialog;
