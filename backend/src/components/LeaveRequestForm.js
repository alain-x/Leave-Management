import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: null,
    endDate: null,
    reason: "",
  });

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Format dates properly
      const requestData = {
        leaveType: formData.leaveType,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString().split("T")[0]
          : null,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString().split("T")[0]
          : null,
        reason: formData.reason,
      };

      // Add JSON data as a blob
      formDataToSend.append(
        "request",
        new Blob([JSON.stringify(requestData)]),
        {
          type: "application/json",
        }
      );

      // Add files
      formData.files.forEach((file) => {
        formDataToSend.append("documents", file);
      });

      const response = await axios.post(
        "http://localhost:8081/api/leave/requests",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate("/leave-history");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Apply for Leave
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Leave request submitted successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={formData.leaveType}
              label="Leave Type"
              name="leaveType"
              onChange={handleChange}
              required
            >
              <MenuItem value="ANNUAL">Annual Leave</MenuItem>
              <MenuItem value="SICK">Sick Leave</MenuItem>
              <MenuItem value="MATERNITY">Maternity Leave</MenuItem>
              <MenuItem value="PATERNITY">Paternity Leave</MenuItem>
              <MenuItem value="UNPAID">Unpaid Leave</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, startDate: newValue }))
                }
                minDate={new Date()}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(newValue) =>
                  setFormData((prev) => ({ ...prev, endDate: newValue }))
                }
                minDate={formData.startDate || new Date()}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </Box>
          </LocalizationProvider>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Leave"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Button variant="contained" component="label">
              Upload Documents
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Upload supporting documents (if required)
            </Typography>
          </Box>

          {files.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Selected Files:</Typography>
              <List dense>
                {files.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024).toFixed(2)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {loading && (
            <Box sx={{ width: "100%", mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress.overall || 0}
              />
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading || !formData.startDate || !formData.endDate}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LeaveRequestForm;
