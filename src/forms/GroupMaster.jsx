import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
const AddInstrumentGroupDialog = ({ open, handleClose }) => {
  const [toolGroupName, setToolGroupName] = useState('');
  const [toolGroupCode, setToolGroupCode] = useState('');
  const [instrumentType, setInstrumentType] = useState('');

  const handleSave =async () => {
    // Handle the save action (e.g., send the data to an API or update state)
    const data = {
      toolGroupName,
      toolGroupCode,
      instrumentType,
    };
    console.log(data);
    const response = await axios.post(`${process.env.REACT_APP_URL}/add_instrument_group_master/`,)
    // After saving, close the dialog
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Instrument Group</DialogTitle>
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
        <TextField
          margin="dense"
          label="Instrument Type"
          type="text"
          fullWidth
          variant="outlined"
          value={instrumentType}
          onChange={(e) => setInstrumentType(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddInstrumentGroupDialog