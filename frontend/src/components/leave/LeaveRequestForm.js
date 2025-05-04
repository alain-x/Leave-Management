// src/components/leave/LeaveRequestForm.js

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
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
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
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const multipartData = new FormData();

      // Convert the form data to a JSON string
      const requestJson = JSON.stringify({
        leaveType: formData.leaveType,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString().split("T")[0]
          : null,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString().split("T")[0]
          : null,
        reason: formData.reason,
      });

      // Append the JSON string as the request part
      multipartData.append("request", requestJson);

      files.forEach((file) => {
        multipartData.append("documents", file);
      });

      const response = await axios.post(
        "http://localhost:8081/api/leave/requests",
        multipartData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate("/leave-history");
      } else {
        setError("Unexpected error occurred");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Apply for Leave
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Leave Type</InputLabel>
            <Select
              name="leaveType"
              value={formData.leaveType}
              label="Leave Type"
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
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, startDate: date }))
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, endDate: date }))
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </Box>
          </LocalizationProvider>

          <TextField
            label="Reason for Leave"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            required
            sx={{ mb: 2 }}
          />

          <Button variant="contained" component="label">
            Upload Documents
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>

          {files.length > 0 && (
            <List sx={{ mt: 2 }}>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton onClick={() => handleRemoveFile(index)}>
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
          )}

          {loading && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress />
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LeaveRequestForm;
