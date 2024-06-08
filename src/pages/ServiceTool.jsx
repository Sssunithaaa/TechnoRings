import React, { useEffect, useState } from "react";
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
import axios from "axios";

const ServiceTool = ({ open, handleClose, transportOrder }) => {
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    if (transportOrder) {
      const fetchBillData = async () => {
        try {
          const response = await axios.get(`https://practicehost.pythonanywhere.com/generate_bill/${transportOrder.service_order.service_id}/`);
          setBillData(response.data);
        } catch (error) {
          console.error("Error fetching bill data:", error);
        }
      };

      fetchBillData();
    }
  }, [transportOrder]);

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
              <strong>Total Amount:</strong> {billData?.total_amount}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {transportOrder?.service_order?.description}
            </p>
            <p>
              <strong>Tool count:</strong>{" "}
              {transportOrder?.service_order?.tool_count}
            </p>

            <h3 className="mt-3 font-bold text-[18px]">Service Tools</h3>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tool Name</TableCell>
                    <TableCell>Service Remarks</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transportOrder?.service_tools?.map((tool, index) => {
                    const billItem = billData?.bill_items?.find(item => item.tool === tool.tool_name);
                    return (

                      <TableRow key={index}>
                        <TableCell>{tool.tool_name}</TableCell>
                        <TableCell>{tool.service_remarks}</TableCell>
                        <TableCell>{tool.service_type_name}</TableCell>
                        <TableCell>{billItem?.amount || "N/A"}</TableCell>
                      </TableRow>
                      
                    );
                   
                  })}
                 
                </TableBody>
                  
              </Table>
            </Paper>
                          <p className="font-semibold my-4 text-[16px]">Total amount: {billData?.total_amount}</p>

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
