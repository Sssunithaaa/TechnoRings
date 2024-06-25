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

const CreateMovement = ({ open, handleClose, transportOrder }) => {
  const [toolCount, setToolCount] = useState(transportOrder ? transportOrder?.transport_tools?.length : 1);
  const [tools, setTools] = useState(transportOrder ? transportOrder?.transport_tools?.map((tool, index) => ({
    id: index + 1,
    tool: tool.tool,
    remark: tool.tool_movement_remarks
  })) : [{ id: 1, tool: "", remark: "" }]);
  const [shedTools, setShedTools] = useState([]);
  const [selectedShed, setSelectedShed] = useState(transportOrder ? transportOrder?.transport_order?.source_shed : null);
  const [sheds, setSheds] = useState([]);
 
  useEffect(() => {
    if (selectedShed) {
      axios
        .get(`${process.env.REACT_APP_URL}/shed_detail/${selectedShed}/`)
        .then((response) => {
          setShedTools(response.data.shed_tools);
        })
        .catch((error) => {
          console.error("Error fetching shed tools:", error);
        });
    }
  }, [selectedShed]);

  const handleToolChange = (index, key, value) => {
    const newTools = [...tools];
    if (!newTools[index]) {
      newTools[index] = { id: index + 1, tool: "", remark: "" };
    }
    newTools[index][key] = value;
    setTools(newTools);
  };

  const addToolField = () => {
    setToolCount((prevCount) => prevCount + 1);
    setTools((prevTools) => [
      ...prevTools,
      { id: toolCount + 1, tool: "", remark: "" },
    ]);
  };
  
  const subtractToolField = () => {
    if (toolCount > 1) {
      setToolCount(prevCount => prevCount - 1);
      setTools(prevTools => prevTools.slice(0, -1));
    }
  };

  const date = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      movementDate: transportOrder ? transportOrder.transport_order.movement_date : date,
      sourceShed: transportOrder ? transportOrder.transport_order.source_shed : 0,
      destinationShed: transportOrder ? transportOrder.transport_order.destination_shed : 0,
    },
    mode: "onChange",
  });
  const [dshed,setDshed] = useState();

  const submitHandler = async (data) => {
    try {
      const toolsArray = tools && tools?.map((tool) => ({
        tool: tool.tool,
        tool_movement_remarks: tool.remark,
      }));

      const requestData = {
        movement_date: data.movementDate,
        source_shed: data.sourceShed,
        destination_shed: data.destinationShed,
        tool_count: toolCount,
        tools: toolsArray,
      };

      if (transportOrder) {
        // Update existing transport order
        await axios.post(`${process.env.REACT_APP_URL}/update_transport_tools/${transportOrder.transport_order.movement_id}/`, requestData);
        toast.success("Tool movement updated successfully", {
          position: "top-center",
          autoClose: 1000,
          style: {
            width: "auto",
            style: "flex justify-center",
          },
          closeButton: false,
          progress: undefined,
        });
      } else {
        // Create new transport order
        await axios.post(`${process.env.REACT_APP_URL}/add-transport-order/`, requestData);
        toast.success("Tool movement added successfully", {
          position: "top-center",
          autoClose: 1000,
          style: {
            width: "auto",
            style: "flex justify-center",
          },
          closeButton: false,
          progress: undefined,
        });
      }
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    const fetchSheds = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/shed-details/`);
        setSheds(response.data);
      } catch (error) {
        console.error("Error fetching sheds:", error);
      }
    };

    fetchSheds();
  }, []);

  useEffect(() => {
    if (transportOrder) {
      reset({
        movementDate: transportOrder.transport_order.movement_date,
        sourceShed: transportOrder.transport_order.source_shed,
        destinationShed: transportOrder.transport_order.destination_shed,
      });
    }
  }, [transportOrder, reset]);

  const shed_details = sheds?.shed_details;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{transportOrder ? "Update Tool Movement" : "Add Tool Movement"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(submitHandler)}>
          <TextField
            {...register("movementDate", {
              required: "Movement date is required",
            })}
            type="date"
            label="Movement Date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
            error={!!errors.movementDate}
            helperText={errors.movementDate?.message}
          />

          <TextField
            {...register("sourceShed", {
              required: "Source shed is required",
            })}
            select
            label="Source Shed"
            fullWidth
            margin="normal"
            onChange={(e) => setSelectedShed(e.target.value)}
            error={!!errors.sourceShed}
            helperText={errors.sourceShed?.message}
            value={transportOrder ? transportOrder.transport_order.source_shed : ''}
          >
            <MenuItem value="">Select a Source Shed</MenuItem>
            {shed_details?.map((shed) => (
              <MenuItem key={shed.shed_id} value={shed.shed_id}>
                {shed.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            {...register("destinationShed", {
              required: "Destination shed is required",
            })}
            select
            label="Destination Shed"
            fullWidth
            margin="normal"
            error={!!errors.destinationShed}
            onChange = {(e)=> setDshed(e.target.value)}
            helperText={errors.destinationShed?.message}
            value={transportOrder ? dshed : ''}
          >
            <MenuItem value="">Select a Destination Shed</MenuItem>
            {shed_details?.map((shed) => (
              <MenuItem key={shed.shed_id} value={shed.shed_id}>
                {shed.name}
              </MenuItem>
            ))}
          </TextField>

          {Array.from({ length: toolCount }).map((_, index) => (
            <div key={index}>
              <TextField
                select
                label={`Tool ${index + 1}`}
                value={tools[index]?.tool || ""}
                onChange={(e) => handleToolChange(index, "tool", e.target.value)}
                fullWidth
                margin="normal"
                required
              >
                <MenuItem value="">Select a tool
</MenuItem>
                {shedTools?.map((shedTool) => (
                  <MenuItem
                    key={shedTool.shedtool_id}
                    value={shedTool.using_tool.instrument_no}
                  >
                    {shedTool.using_tool.instrument_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label={`Remark ${index + 1}`}
                value={tools[index]?.remark || ""}
                onChange={(e) => handleToolChange(index, "remark", e.target.value)}
                fullWidth
                margin="normal"
              />
            </div>
          ))}

          <div className="flex justify-between">
            <Button
              onClick={addToolField}
              variant="contained"
              color="primary"
              style={{ margin: "20px 0" }}
            >
              Add Another Tool
            </Button>
            <Button
              onClick={subtractToolField}
              variant="contained"
              color="secondary"
              style={{ margin: "20px 0" }}
            >
              Remove Tool
            </Button>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(submitHandler)} color="primary">
          {transportOrder ? "Update" : "Submit"}
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default CreateMovement;
