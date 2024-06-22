import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddInstrumentGroupDialog = ({ open, handleClose, instrumentGroup }) => {
  const [toolGroupName, setToolGroupName] = useState('');
  const [toolGroupCode, setToolGroupCode] = useState('');

  useEffect(() => {
    const fetchInstrumentGroupData = async () => {
      if (instrumentGroup) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/update_instrument_group/${instrumentGroup}/`);
          const data = response.data.data;
          setToolGroupName(data.tool_group_name || '');
          setToolGroupCode(data.tool_group_code || '');
        } catch (error) {
          toast.error("Failed to fetch instrument group data.");
        }
      }
    };

    fetchInstrumentGroupData();
  }, [instrumentGroup]);

  const handleSave = async () => {
    const data = {
      toolGroupName,
      toolGroupCode,
    };
    console.log(data);

    try {
      if (instrumentGroup) {
        // Update existing instrument group
        await axios.put(`${process.env.REACT_APP_URL}/update_instrument_group_master/${instrumentGroup.id}/`, data);
        toast.success("Instrument group master updated successfully");
      } else {
        // Add new instrument group
        await axios.post(`${process.env.REACT_APP_URL}/add_instrument_group_master/`, data);
        toast.success("Instrument group master added successfully");
      }
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      toast.error("Unknown error!");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{instrumentGroup ? "Update Instrument Group" : "Add Instrument Group"}</DialogTitle>
      <ToastContainer />
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tool Group Name"
          type="text"
          fullWidth
          variant="outlined"
          value={toolGroupName}
          onChange={(e) => setToolGroupName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Tool Group Code"
          type="text"
          fullWidth
          variant="outlined"
          value={toolGroupCode}
          onChange={(e) => setToolGroupCode(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          {instrumentGroup ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInstrumentGroupDialog;
