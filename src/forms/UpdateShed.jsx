import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const UpdateShed = ({ open, handleClose,shed }) => {
  const [shedId, setShedId] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (shed) {
      setShedId(shed.shed_id || '');
      setName(shed.name || '');
      setLocation(shed.location || '');
      setPhoneNumber(shed.phone_number || '');
    }
  }, [shed]);

  const handleSave = async () => {
    const data = {
      shed_id: shedId,
      name:name,
      location:location,
      phone_number: phoneNumber,
    };

    console.log(data);
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/update_shed/${shedId}`, data);
      toast.success("Shed details updated successfully");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.log(error)
      toast.error("Unknown error!");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Shed Details</DialogTitle>
      <ToastContainer />
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Shed ID"
          type="text"
          fullWidth
          variant="outlined"
          value={shedId}
          onChange={(e) => setShedId(e.target.value)}
          disabled
        />
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Location"
          type="text"
          fullWidth
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Phone Number"
          type="text"
          fullWidth
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateShed;
