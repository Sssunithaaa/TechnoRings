import React from "react";
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

const CreateVendor = ({ open, handleClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("location", data.location);
      formData.append("address", data.address);
      formData.append("phone_number", data.phone_number);
      formData.append("email", data.email);
      formData.append("vendor_type", data.vendor_type);
      if (data.nabl_number) {
        formData.append("nabl_number", data.nabl_number);
      }
      if (data.certificate && data.certificate.length > 0) {
        formData.append("certificate", data.certificate[0]);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_URL}/add_vendor/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      toast.success("Vendor added successfully");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add vendor. Please try again later.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Vendor</DialogTitle>
      <ToastContainer />
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          <TextField
            {...register("name", { required: "Vendor name is required" })}
            type="text"
            label="Vendor Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            {...register("location", { required: "Location is required" })}
            type="text"
            label="Location"
            fullWidth
            margin="normal"
            error={!!errors.location}
            helperText={errors.location?.message}
          />

          <TextField
            {...register("address", { required: "Address is required" })}
            type="text"
            label="Address"
            fullWidth
            margin="normal"
            error={!!errors.address}
            helperText={errors.address?.message}
          />

          <TextField
            {...register("phone_number", { required: "Phone number is required" })}
            type="tel"
            label="Phone Number"
            fullWidth
            margin="normal"
            error={!!errors.phone_number}
            helperText={errors.phone_number?.message}
          />

          <TextField
            {...register("email", { required: "Email is required" })}
            type="email"
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register("vendor_type", { required: "Vendor type is required" })}
            select
            label="Vendor Type"
            fullWidth
            margin="normal"
            error={!!errors.vendor_type}
            helperText={errors.vendor_type?.message}
          >
            <MenuItem value="1">Manufacturer</MenuItem>
            <MenuItem value="2">Dealer</MenuItem>
            <MenuItem value="3">Calibration Agency</MenuItem>
          </TextField>

          {watch("vendor_type") === "3" && (
            <>
              <TextField
                {...register("nabl_number", { required: "NABL Number is required for Calibration Agency" })}
                type="text"
                label="NABL Number"
                fullWidth
                margin="normal"
                error={!!errors.nabl_number}
                helperText={errors.nabl_number?.message}
              />
              <TextField
                {...register("certificate", { required: "Certificate is required for Calibration Agency" })}
                type="file"
                label="Certificate"
                fullWidth
                margin="normal"
                inputProps={{ accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png" }}
                error={!!errors.certificate}
                helperText={errors.certificate?.message}
              />
            </>
          )}

          <div className="flex flex-row justify-between">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "20px 0" }}
            >
              Add Vendor
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

export default CreateVendor;
