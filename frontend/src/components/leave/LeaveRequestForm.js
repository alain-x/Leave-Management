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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Chip,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Delete as DeleteIcon,
  Upload as UploadIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Category as CategoryIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const steps = ["Leave Details", "Documents", "Review & Submit"];

const LeaveRequestForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
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

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const multipartData = new FormData();
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
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  name="leaveType"
                  value={formData.leaveType}
                  label="Leave Type"
                  onChange={handleChange}
                  required
                  startAdornment={
                    <CategoryIcon sx={{ mr: 1, color: "text.secondary" }} />
                  }
                >
                  <MenuItem value="ANNUAL">Annual Leave</MenuItem>
                  <MenuItem value="SICK">Sick Leave</MenuItem>
                  <MenuItem value="MATERNITY">Maternity Leave</MenuItem>
                  <MenuItem value="PATERNITY">Paternity Leave</MenuItem>
                  <MenuItem value="UNPAID">Unpaid Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, startDate: date }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <CalendarIcon sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, endDate: date }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      InputProps={{
                        startAdornment: (
                          <CalendarIcon sx={{ mr: 1, color: "text.secondary" }} />
                        ),
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Reason for Leave"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                required
                InputProps={{
                  startAdornment: (
                    <DescriptionIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload Documents
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>

            {files.length > 0 && (
              <List>
                {files.map((file, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      mb: 1,
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveFile(index)}
                        color="error"
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
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Review Your Leave Request
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Leave Type
                    </Typography>
                    <Typography variant="body1">
                      {formData.leaveType}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1">
                      {formData.startDate?.toLocaleDateString()} -{" "}
                      {formData.endDate?.toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Reason
                    </Typography>
                    <Typography variant="body1">{formData.reason}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Attached Documents
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {files.map((file, index) => (
                        <Chip
                          key={index}
                          icon={<AttachFileIcon />}
                          label={file.name}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Apply for Leave
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <LinearProgress /> : null}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  activeStep === 0 &&
                  (!formData.leaveType ||
                    !formData.startDate ||
                    !formData.endDate ||
                    !formData.reason)
                }
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LeaveRequestForm;
