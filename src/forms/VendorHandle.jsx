import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const CreateVendorHandleData = ({ open, handleClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [vendors, setVendors] = useState([]);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    // Fetch vendors and tools data from your backend API
    const fetchData = async () => {
      try {
        const vendorResponse = await axios.get(`${process.env.REACT_APP_URL}/vendor`);
        const toolResponse = await axios.get(`${process.env.REACT_APP_URL}/instrument-tools/`);
        setVendors(vendorResponse.data.vendors);
        setTools(toolResponse.data.instrument_models);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch vendors or tools data.");
      }
    };

    fetchData();
  }, []);

  const submitHandler = async (data) => {
    try {
      // Make a POST request to your backend API to add a new vendor handle data
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/add_vendor_handles/`,
        data
      );
      console.log(response);
      // Display success message using toast
      toast.success("Vendor handle data added successfully");

      // Close the dialog on successful submission
      handleClose();
    } catch (error) {
      console.log(error);
      // Display error message using toast
      toast.error("Failed to add vendor handle data. Please try again later.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Vendor Handle Data</DialogTitle>
      <ToastContainer />
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          <TextField
            {...register("vendor", { required: "Vendor is required" })}
            select
            label="Vendor"
            fullWidth
            margin="normal"
            error={!!errors.vendor}
            helperText={errors.vendor?.message}
          >
            {vendors.map((vendor) => (
              <MenuItem key={vendor.vendor_id} value={vendor.vendor_id}>
                {vendor.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            {...register("tool", { required: "Tool is required" })}
            select
            label="Tool"
            fullWidth
            margin="normal"
            error={!!errors.tool}
            helperText={errors.tool?.message}
          >
            {tools.map((tool) => (
              <MenuItem key={tool.instrument_no} value={tool.instrument_no}>
                {tool.instrument_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            {...register("turnaround_time", { required: "Turnaround time is required" })}
            type="text"
            label="Turnaround Time"
            fullWidth
            margin="normal"
            error={!!errors.turnaround_time}
            helperText={errors.turnaround_time?.message}
          />

          <TextField
            {...register("cost", { required: "Cost is required" })}
            type="number"
            label="Cost"
            fullWidth
            margin="normal"
            error={!!errors.cost}
            helperText={errors.cost?.message}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ margin: "20px 0" }}
          >
            Add Vendor Handle Data
          </Button>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default CreateVendorHandleData;
