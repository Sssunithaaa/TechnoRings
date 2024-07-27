import React, { useState, useEffect } from "react";
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
import { toast, ToastContainer } from "react-toastify";

const ChallanTools = ({ open, handleClose, transportOrder }) => {
  const [calibrationReports, setCalibrationReports] = useState([]);

  useEffect(() => {
    if (open) {
      fetchCalibrationReports();
    }
  }, [open]);

  const fetchCalibrationReports = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/calibration_reports/`);
      const data = await response.json();
      setCalibrationReports(data.calibration_reports);
    } catch (error) {
      console.error("Error fetching calibration reports:", error);
    }
  };

  const getToolName = (toolId) => {
    const tool = transportOrder.delivery_challan_tools.find(
      (tool) => tool.tool === toolId
    );
    return tool ? tool.tool_name : "Unknown tool";
  };

  const getCalibrationReportsForTool = (toolId) => {
    return calibrationReports.filter(
      (report) => report.calibrationtool_id === toolId
    );
  };

  const handleDeleteChallan = async (id) => {
    const url = `${process.env.REACT_APP_URL}/delivery_challan/${id}/delete/`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {

        toast.success("Delivery Challan deleted successfully");
        setTimeout(()=> {
          handleClose()
        },2000)
        fetchCalibrationReports();
      } else {
        console.error('Failed to delete the tool.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
   const handleDeleteTool = async (toolId) => {
    const url = `${process.env.REACT_APP_URL}/delivery_challan_tool/${toolId}/delete/`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(response)
        toast.success("Challan tool deleted successfully");
        setTimeout(()=> {
          handleClose()
        },2000)
        fetchCalibrationReports();
      } else {
        console.error('Failed to delete the tool.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      <DialogTitle>Delivery Challan Details</DialogTitle>
      <ToastContainer/>
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
              <div className="mt-3" key={tool.deliverychallantool_id}>
                <p>
                  <strong>Tool ID:</strong> {getToolName(tool.tool)}
                </p>
                <p>
                  <strong>Calibration Report:</strong>{" "}
                  {tool.calibration_report}
                </p>
                <h4>Calibration Reports</h4>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Calibration Date</TableCell>
                        <TableCell>Report No</TableCell>
                        <TableCell>Agency</TableCell>
                        <TableCell>Result</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Next Calibration Date</TableCell>
                        <TableCell>Remark</TableCell>
                        <TableCell>Report File</TableCell>
                        <TableCell>Report File 2</TableCell>
                        <TableCell>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getCalibrationReportsForTool(tool.calibration_report).map((report) => (
                        <TableRow key={report.calibrationtool_id}>
                          <TableCell>{report.calibration_date}</TableCell>
                          <TableCell>{report.calibration_report_no}</TableCell>
                          <TableCell>{report.calibration_agency}</TableCell>
                          <TableCell>{report.result}</TableCell>
                          <TableCell>{report.action}</TableCell>
                          <TableCell>{report.next_calibration_date}</TableCell>
                          <TableCell>{report.remark}</TableCell>
                          <TableCell>
                            <a className="bg-indigo-700 px-3 py-1 text-white rounded-md" href={`https://practicehost.pythonanywhere.com${report.calibration_report_file}`} target="_blank" rel="noopener noreferrer">
                              View Report
                            </a>
                          </TableCell>
                          <TableCell>
                            <a className="bg-indigo-700 px-3 py-1 text-white rounded-md" href={`https://practicehost.pythonanywhere.com${report.calibration_report_file2}`} target="_blank" rel="noopener noreferrer">
                              View Report 2
                            </a>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleDeleteTool(tool.deliverychallantool_id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={()=> handleDeleteChallan(transportOrder?.delivery_challan?.deliverychallan_id)}  color="secondary">Delete</Button>
        <Button onClick={handleClose}  color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallanTools;
