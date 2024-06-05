import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ServiceTool = ({ open, handleClose, transportOrder }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle>Service Order Details</DialogTitle>
      <DialogContent>
        {transportOrder ? (
          <div>
            <p>
              <strong>Service ID:</strong>{" "}
              {transportOrder?.service_order?.service_id}
            </p>
            <p>
              <strong>Date:</strong> {transportOrder?.service_order?.date}
            </p>
            <p>
              <strong>Amount:</strong> {transportOrder?.service_order?.amount}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {transportOrder?.service_order?.description}
            </p>
            <p>
              <strong>Tool count:</strong>{" "}
              {transportOrder?.service_order?.tool_count}
            </p>
            <p>
              <strong>Vendor:</strong> {transportOrder?.service_order?.vendor_name}
            </p>
            <h3 className="mt-3 font-bold text-[18px]">Service Tools</h3>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tool Name</TableCell>
                    <TableCell>Service Remarks</TableCell>
                    <TableCell>Vendor Name</TableCell>
                    <TableCell>Service Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transportOrder?.service_tools?.map((tool) => (
                    <TableRow key={tool.transporttool_id}>
                      <TableCell>{tool.tool_name}</TableCell>
                      <TableCell>{tool.service_remarks}</TableCell>
                      <TableCell>{tool.vendor_name}</TableCell>
                      <TableCell>{tool.service_type_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
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
