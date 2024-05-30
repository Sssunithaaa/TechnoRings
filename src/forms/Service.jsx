import React,{useState,useEffect} from "react"
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, IconButton } from '@mui/material';

const Service = ({ open, handleClose }) => {
  const [toolCount, setToolCount] = useState(1);
  const [tools, setTools] = useState([{ id: 1, tool: "", service_type: "", service_remarks: "" }]);
  const [vendorTools, setVendorTools] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const date=new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (selectedVendor) {
      axios.get(`${process.env.REACT_APP_URL}/vendor_details/${selectedVendor}/`)
        .then(response => {
          setVendorTools(response.data.vendor_handles);
        })
        .catch(error => {
          console.error("Error fetching shed tools:", error);
        });
    }
  }, [selectedVendor]);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/service_types/`);
        setServiceTypes(response.data);
      } catch (error) {
        console.error("Error fetching service types:", error);
      }
    };

    fetchServiceTypes();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/vendor/`);
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const handleToolChange = (index, key, value) => {
    const newTools = [...tools];
    newTools[index][key] = value;
    setTools(newTools);
  };

  const addToolField = () => {
    setToolCount(prevCount => prevCount + 1);
    setTools(prevTools => [...prevTools, { id: toolCount + 1, tool: "", service_type: "", service_remarks: "" }]);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: date,
      amount: "",
      description: "",
      vendor: "",
    },
    mode: "onChange",
  });

  const submitHandler = async (data) => {
    const requestData = {
      date: data.date,
      amount: parseFloat(data.amount),
      description: data.description,
      tool_count: toolCount,
      vendor: parseInt(data.vendor),
      tools: tools.map(tool => ({
        tool: parseInt(tool.tool),
        service_type: parseInt(tool.service_type),
        service_remarks: tool.service_remarks,
        vendor: parseInt(data.vendor),
      })),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/service-order/`, requestData);
      toast.success("Service order added successfully", {
        position: "top-center",
        autoClose: 1000,
        closeButton: false,
      });
      handleClose();
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Service Order</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <TextField
            {...register("date", {
              required: "Date is required",
            })}
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.date}
            helperText={errors.date?.message}
            margin="normal"
            required
          />
          <TextField
            {...register("vendor", {
              required: "Vendor is required",
            })}
            select
            label="Vendor"
            fullWidth
            onChange={(e) => setSelectedVendor(e.target.value)}
            error={!!errors.vendor}
            helperText={errors.vendor?.message}
            margin="normal"
            required
          >
            <MenuItem value="">
              <em>Select a vendor</em>
            </MenuItem>
            {vendors?.vendors?.map((vendor) => (
              <MenuItem key={vendor.vendor_id} value={vendor.vendor_id}>
                {vendor.name} - {vendor.location}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            {...register("amount", {
              required: "Amount is required",
            })}
            label="Amount"
            type="number"
            fullWidth
            error={!!errors.amount}
            helperText={errors.amount?.message}
            margin="normal"
            required
          />
          <TextField
            {...register("description", {
              required: "Description is required",
            })}
            label="Description"
            type="text"
            fullWidth
            error={!!errors.description}
            helperText={errors.description?.message}
            margin="normal"
            required
          />
          {tools.map((_, index) => (
            <div key={index}>
              <TextField
                select
                label={`Service Tool ${index + 1}`}
                fullWidth
                value={tools[index]?.tool || ""}
                onChange={(e) => handleToolChange(index, "tool", e.target.value)}
                margin="normal"
                required
              >
                <MenuItem value="">
                  <em>Select a tool</em>
                </MenuItem>
                {vendorTools?.map((tool, toolIndex) => (
                  <MenuItem key={toolIndex} value={tool.tool}>
                    {tool.tool_name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label={`Service Type ${index + 1}`}
                fullWidth
                value={tools[index]?.service_type || ""}
                onChange={(e) => handleToolChange(index, "service_type", e.target.value)}
                margin="normal"
                required
              >
                <MenuItem value="">
                  <em>Select a service type</em>
                </MenuItem>
                {serviceTypes.map((serviceType) => (
                  <MenuItem key={serviceType.servicetype_id} value={serviceType.servicetype_id}>
                    {serviceType.service_type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={`Service Remarks ${index + 1}`}
                type="text"
                fullWidth
                value={tools[index]?.service_remarks || ""}
                onChange={(e) => handleToolChange(index, "service_remarks", e.target.value)}
                margin="normal"
              />
            </div>
          ))}
          <IconButton onClick={addToolField} color="primary" aria-label="add tool">
            
          </IconButton>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <ToastContainer />
    </Dialog>
  );
};

export default Service;
