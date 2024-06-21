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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        {
          !transportOrder?.transport_order.acknowledgment && (
            <Button onClick={acknowledgeTools} color="primary">
              Acknowledge
            </Button>
          )
        }
      </DialogActions>
    </Dialog>
  );
};

export default ToolDialog;
