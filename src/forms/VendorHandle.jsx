import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,

  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const CreateVendorHandleData = ({ open, handleClose, id ,vendorName}) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm();

  const [vendors, setVendors] = useState([]);
  const [tools, setTools] = useState([]);
  const [defaultVendorName, setDefaultVendorName] = useState("");

  useEffect(() => {
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


  useEffect(()=> {

  },[defaultVendorName])

  const submitHandler = async (data) => {
    try {
      console.log(data)
      const vendorId = id.id;
      const formData = {
        ...data,
        vendor: vendorId,
      };
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/add_vendor_handles/`,
        formData
      );
      console.log(response)
      toast.success("Vendor handle data added successfully");
      setTimeout(()=> {
        handleClose();
      },2000)
    } catch (error) {
      console.log(error);
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

            value={vendorName}
            
            label="Vendor"
            fullWidth
            margin="normal"
          />

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

         <div className="flex flex-row justify-between">
           <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ margin: "20px 0" }}
          >
            Add Vendor Handle Data
          </Button>
           <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
         </div>
        </form>
      </DialogContent>
      
      <ToastContainer />
    </Dialog>
  );
};

export default CreateVendorHandleData;
