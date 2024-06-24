import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const CalibrationDialog = ({ open, handleClose, handleAdd, handleUpdate, instrument }) => {
  const date = new Date().toISOString().split('T')[0];

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

  const [calibrationFrequencyUnit, setCalibrationFrequencyUnit] = useState("days");
  const [typeOfToolName, setTypeOfToolName] = useState("");
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    if (instrument) {
      setFormData({
        instrument_name: instrument.instrument_name || "",
        manufacturer_name: instrument.manufacturer_name || "",
        year_of_purchase: instrument.year_of_purchase || date,
        gst: instrument.gst || "",
        description: instrument.description || "",
        least_count: instrument.least_count || "",
        instrument_range: instrument.instrument_range || "",
        calibration_frequency: instrument.calibration_frequency || "",
        type_of_tool_id: instrument.type_of_tool_id || ""
      });
      setTypeOfToolName(instrument.type_of_tool_name || "");
      const days = parseInt(instrument.calibration_frequency, 10);
      if (!isNaN(days)) {
        if (days % 365 === 0) {
          setCalibrationFrequencyUnit("years");
          setFormData(prevFormData => ({ ...prevFormData, calibration_frequency: days / 365 }));
        } else if (days % 30 === 0) {
          setCalibrationFrequencyUnit("months");
          setFormData(prevFormData => ({ ...prevFormData, calibration_frequency: days / 30 }));
        } else {
          setCalibrationFrequencyUnit("days");
        }
      }
    } else {
      setFormData({
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
      setTypeOfToolName("");
    }
  }, [instrument, date]);

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value
    }));

    if (field === "type_of_tool_id") {
      const selectedTool = masters.find(tool => tool.tool_group_id === value);
      setTypeOfToolName(selectedTool ? selectedTool.tool_group_name : "");
    }
  };

  const handleFormAddOrUpdate = () => {
    const convertedFormData = {
      ...formData,
      calibration_frequency: convertToDays(formData.calibration_frequency, calibrationFrequencyUnit)
    };
    if (instrument) {
      handleUpdate(instrument.id, convertedFormData);
    } else {
      handleAdd(convertedFormData);
    }
  };

  const convertToDays = (frequency, unit) => {
    if (!frequency) return "";
    const freq = parseInt(frequency, 10);
    if (isNaN(freq)) return "";

    switch (unit) {
      case "days":
        return freq;
      case "months":
        return freq * 30; // Assuming an average month length of 30 days
      case "years":
        return freq * 365; // Assuming a year length of 365 days
      default:
        return freq;
    }
  };

  const { data: calibrationData } = useQuery({
    queryKey: ["calibration"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
      return response.data.instrument_models;
    },
  });

  const convertToSentenceCase = (str) => {
    return str
      .replace(/_/g, " ")
      .replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const toolResponse = await axios.get(`${process.env.REACT_APP_URL}/instrument-group-master-tools/`);
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
      <DialogTitle>{instrument ? "Update Instrument" : "Add New Instrument"}</DialogTitle>
      <DialogContent>
        <ToastContainer />
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
                <MenuItem key={tool.tool_group_id} value={tool.tool_group_id}>
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
          ) : field === "calibration_frequency" ? (
            <div key={field} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <TextField
                label={convertToSentenceCase(field)}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                variant="outlined"
                fullWidth
                size="large"
                sx={{ flex: 1 }}
              />
              <TextField
                select
                label="Unit"
                value={calibrationFrequencyUnit}
                onChange={(e) => setCalibrationFrequencyUnit(e.target.value)}
                variant="outlined"
                size="medium"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="days">Days</MenuItem>
                <MenuItem value="months">Months</MenuItem>
                <MenuItem value="years">Years</MenuItem>
              </TextField>
            </div>
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
        <Button onClick={handleFormAddOrUpdate} color="primary">
          {instrument ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalibrationDialog;
