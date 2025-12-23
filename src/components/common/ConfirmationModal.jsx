import React from 'react';
import { X, AlertTriangle, Trash2, Save, Info } from 'lucide-react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';


const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // default, danger, warning, info
  itemName = null,
  icon = null
}) => {
  // Icon mapping based on type
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'danger':
        return <Trash2 size={24} style={{ color: '#f44336' }} />;
      case 'warning':
        return <AlertTriangle size={24} style={{ color: '#ff9800' }} />;
      case 'info':
        return <Info size={24} style={{ color: '#2196f3' }} />;
      case 'save':
        return <Save size={24} style={{ color: '#4caf50' }} />;
      default:
        return <AlertTriangle size={24} style={{ color: '#757575' }} />;
    }
  };

  // Button color based on type
  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'primary';
      case 'save':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {getIcon()}
            <span style={{ fontWeight: 600 }}>{title}</span>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mt={1} mb={2}>
          <span>
            {message}
            {itemName && (
              <>
                {' '}<strong>"{itemName}"</strong>
              </>
            )}
          </span>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color={getConfirmButtonColor()} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;