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

const ServiceTool = ({ open, handleClose, transportOrder }) => {
  
  
  return (
    <Dialog open={open} onClose={handleClose}  maxWidth="md">
      <DialogTitle>Service Order Details</DialogTitle>
      <DialogContent>
        {transportOrder && transportOrder ? (
          <div>
            <p><strong>Service ID:</strong> {transportOrder?.service_order?.service_id}</p>
            <p><strong> Date:</strong> {transportOrder?.service_order?.date}</p>
            <p><strong>Amount:</strong> {transportOrder?.service_order?.amount}</p>
            <p><strong>Description:</strong> {transportOrder?.service_order?.description}</p>
            <p><strong>Tool count:</strong> {transportOrder?.service_order?.tool_count}</p>
            <p><strong>Vendor:</strong> {transportOrder?.service_order?.vendor_name}</p>
            <h3>Service Tools</h3>
            {transportOrder?.service_tools?.map((tool) => (
              <div key={tool.transporttool_id}>
                <p><strong>Remarks:</strong> {tool.service_remarks}</p>
                <p><strong>Tool ID:</strong> {tool.tool_name}</p>
                <p><strong>Remarks:</strong> {tool.vendor_name}</p>
                <p><strong>Tool ID:</strong> {tool.service_type_name}</p>
                
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

export default ServiceTool;
