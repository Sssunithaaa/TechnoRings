import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const ToolsDialog = ({ open, tools, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Tools in Selected Group</DialogTitle>
    <DialogContent>
      {tools.length > 0 ? (
        <ul>
          {tools.map((tool, index) => (
            <li key={index}>{tool.instrument_no} - {tool.instrument_name}</li>
          ))}
        </ul>
      ) : (
        <p>No tools found in this group.</p>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);


export default ToolsDialog