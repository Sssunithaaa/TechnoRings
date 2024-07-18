import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Select } from "@mui/material";
import axios from "axios";
import {  toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const CalibrationDialog = ({shed, open, handleClose, handleAdd, handleUpdate, instrument, family, familyAdd, id }) => {
  const date = new Date().toISOString().split('T')[0];
  const { data: shedDetailsData } = useQuery({
    queryKey: ["shed"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/shed-details/`);
      return response.data;
    },
  });


  const [formData, setFormData] = useState({
    instrument_name: "",
    manufacturer_name: "",
    year_of_purchase: date,
    gst: "",
    description: "",
    least_count: "",
    instrument_range: "",
    calibration_frequency: { years: 0, months: 0, days: 0 },
    type_of_tool_id: id || "",
    shed_id: "",
  });

  const [typeOfToolName, setTypeOfToolName] = useState("");
  const [typeOfToolID, setTypeOfToolID] = useState(familyAdd ? id : instrument ? instrument?.type_of_tool : "");
  const [masters, setMasters] = useState([]);
  const [shedId,setShedId] = useState(shed? shed.shed_id : instrument ? instrument.current_shed : "")
  
  useEffect(() => {
    setShedId(shed.shed_id)
  },[shed])
  useEffect(() => {
    if (instrument) {
      const { calibration_frequency, type_of_tool, current_shed, ...rest } = instrument;
      const [years, months, days] = convertDaysToUnits(calibration_frequency);

      setFormData({
        ...rest,
        calibration_frequency: { years, months, days },
        type_of_tool_id: type_of_tool || "",
        shed_id: current_shed || ""
      });

      const selectedTool = masters.find(tool => tool.tool_group_id === type_of_tool);
      setTypeOfToolName(selectedTool ? selectedTool.tool_group_name : "");
    } else {
      setFormData({
        instrument_name: "",
        manufacturer_name: "",
        year_of_purchase: date,
        gst: "",
        description: "",
        least_count: "",
        instrument_range: "",
        calibration_frequency: { years: 1, months: 0, days: 0 },
        type_of_tool_id: id,
        shed_id: shed ? shedId : ""
      });
      const selectedTool = masters.find(tool => tool.tool_group_id === family);
      setTypeOfToolName(selectedTool ? selectedTool.tool_group_name : "");
    }
  }, [instrument, date, masters,shed]);

  const handleChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value
    }));

    if (field === "type_of_tool_id") {
      const selectedTool = masters.find(tool => tool.tool_group_id === value);
      setTypeOfToolName(selectedTool ? selectedTool.tool_group_name : "");
      setTypeOfToolID(value);
    }
     if (field === "shed_id") {
   
      setShedId(value)
    }
  };

  const handleFrequencyChange = (unit, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      calibration_frequency: {
        ...prevFormData.calibration_frequency,
        [unit]: value
      }
    }));
  };

  const handleFormAddOrUpdate = () => {
  if (formData.gst === "") {
    toast.error("Please enter GST");
    return;
  }

  // Convert the calibration_frequency before creating the convertedFormData
  const convertedCalibrationFrequency = convertToDays(formData.calibration_frequency);

 

  const convertedFormData = {
    ...formData,
    calibration_frequency: convertedCalibrationFrequency
  };

  console.log("Converted formData:", convertedFormData);

  if (instrument) {
    handleUpdate(convertedFormData);
  } else {
    handleAdd(convertedFormData);
  }
};


  const convertToDays = (frequency) => {
    const { years, months, days } = frequency;
    return (parseInt(years, 10) * 365) + (parseInt(months, 10) * 30) + parseInt(days, 10);
  };

  const convertDaysToUnits = (days) => {
    const years = Math.floor(days / 365);
    days -= years * 365;
    const months = Math.floor(days / 30);
    days -= months * 30;
    return [years, months, days];
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
      }
    };

    fetchData();
  }, []);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{instrument ? "Update Instrument" : "Add New Instrument"}</DialogTitle>
      <DialogContent>
        {Object.keys(formData).map((field) => (
          field === "type_of_tool_id" ? (
            <div className="my-2">
              <Select
              key={field}
              label="Type of Tool"
              value={typeOfToolID}
              onChange={(e) => handleChange(field, e.target.value)}
              variant="outlined"
              fullWidth
              displayEmpty
              disabled={familyAdd ? true : false}
              margin="normal"
            >
              <MenuItem value="" disabled>
                <em>Select Instrument Family</em>
              </MenuItem>
              {masters.map((tool) => (
                <MenuItem key={tool.tool_group_id} value={tool.tool_group_id}>
                  {tool.tool_group_name}
                </MenuItem>
              ))}
            </Select>
            </div>
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
            <div key={field} style={{ marginBlock: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TextField
                  label="Years"
                  value={formData.calibration_frequency.years}
                  onChange={(e) => handleFrequencyChange("years", e.target.value)}
                  variant="outlined"
                  type="number"
                  fullWidth
                  size="large"
                />
                <TextField
                  label="Months"
                  value={formData.calibration_frequency.months}
                  onChange={(e) => handleFrequencyChange("months", e.target.value)}
                  variant="outlined"
                  type="number"
                  fullWidth
                  size="large"
                />
                <TextField
                  label="Days"
                  value={formData.calibration_frequency.days}
                  onChange={(e) => handleFrequencyChange("days", e.target.value)}
                  variant="outlined"
                  type="number"
                  fullWidth
                  size="large"
                />
              </div>
            </div>
          ) : field === "shed_id" ? (
            <div className="my-2">
              <Select
              key={field}
              label="Shed"
              value={shedId}
              onChange={(e) => handleChange(field, e.target.value)}
              variant="outlined"
              fullWidth
              disabled={shed ? true : false}
              displayEmpty
              
              margin="normal"
            >
              <MenuItem value="" disabled>
                <em>Select Shed</em>
              </MenuItem>
              {shedDetailsData?.shed_details.map((shed) => (
                <MenuItem key={shed.shed_id} value={shed.shed_id}>
                  {shed.name}
                </MenuItem>
              ))}
            </Select>
            </div>
          ) : field === "instrument_name" ? (
            <TextField
              key={field}
              label="Instrument code"
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              variant="outlined"
              fullWidth
              size="large"
              margin="normal"
            />
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
