import React, { useState,useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from "@mui/material";
import axios from "axios"
import { ToastContainer,toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
const CalibrationDialog = ({ open, handleClose, handleAdd }) => {
    const date=new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
   
    instrument_name: "",
    manufacturer_name: "",
    year_of_purchase: date,
    gst: "",
    description: "",
    least_count: "",
    instrument_range: "",
    calibration_frequency: "",
    type_of_tool_id: ""
  });

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value
    }));
  };

  const handleFormAdd = () => {
    console.log(formData)
    handleAdd(formData);
  };
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
  const convertToSentenceCase = (str) => {
    return str
      .replace(/_/g, " ")
      .replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  };
 const [masters,setMasters] = useState([]);
     useEffect(() => {
    const fetchData = async () => {
      try {
        const toolResponse = await axios.get(`${process.env.REACT_APP_URL}/instrument-group-master-tools//`);
        
        setMasters(toolResponse.data.instrument_group_masters);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch vendors or tools data.");
      }
    };

    fetchData();
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Instrument</DialogTitle>
      <DialogContent>
        <ToastContainer/>
        {Object.keys(formData).map((field) => (
          field === "type_of_tool_id" ? (
            <TextField
              key={field}
              select
              label={convertToSentenceCase(field)}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              variant="outlined"
              fullWidth
              size="large"
              margin="normal"
            >
              {masters.map((tool) => (
              <MenuItem key={tool.tool_id} value={tool.tool_id}>
                {tool.tool_group_name}
              </MenuItem>
            ))}
            </TextField>
          ) : field === "year_of_purchase" ? (
            <TextField
              type="date"
              key={field}
              label={convertToSentenceCase(field)}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              variant="outlined"
              fullWidth
              size="large"
              margin="normal"
            />
          ) :  (
            <TextField
              key={field}
              label={convertToSentenceCase(field)}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              variant="outlined"
              fullWidth
              size="large"
              margin="normal"
            />
          )
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleFormAdd} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalibrationDialog;
