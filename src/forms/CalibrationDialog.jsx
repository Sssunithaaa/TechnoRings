import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from "@mui/material";

const CalibrationDialog = ({ open, handleClose, handleAdd }) => {
  const [formData, setFormData] = useState({
   
    instrument_name: "",
    manufacturer_name: "",
    year_of_purchase: "",
    gst: "",
    description: "",
    least_count: "",
    instrument_range: "",
    calibration_frequency: "",
    type_of_tool: ""
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

  const convertToSentenceCase = (str) => {
    return str
      .replace(/_/g, " ")
      .replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Instrument</DialogTitle>
      <DialogContent>
        {Object.keys(formData).map((field) => (
          field === "type_of_tool" ? (
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
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
            </TextField>
          ) : (
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
