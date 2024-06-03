import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";


const ChallanTools = ({ open, handleClose, transportOrder }) => {
  const getToolName = (toolId) => {
    const tool = transportOrder.delivery_challan_tools.find(
      (tool) => tool.tool === toolId
    );
    return tool ? tool.tool_name : "Unknown tool";
  };


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delivery Challan Details</DialogTitle>
      <DialogContent>
        {transportOrder ? (
          <div>
            <p>
              <strong>Received Date:</strong>{" "}
              {transportOrder.delivery_challan?.received_date}
            </p>
            <p>
              <strong>Vendor:</strong> {transportOrder.delivery_challan?.vendor_name}
            </p>
            <p>
              <strong>Shed:</strong> {transportOrder.delivery_challan?.shed_name}
            </p>
            <h3>Delivery Challan Tools</h3>
            {transportOrder?.delivery_challan_tools?.map((tool) => (
              <div key={tool.deliverychallantool_id}>
                <p>
                  <strong>Tool ID:</strong> {getToolName(tool.tool)}
                </p>
                <p>
                  <strong>Calibration Report:</strong>{" "}
                  {tool.calibration_report}
                </p>
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
      
      </DialogActions>
    </Dialog>
  );
};

export default ChallanTools;
