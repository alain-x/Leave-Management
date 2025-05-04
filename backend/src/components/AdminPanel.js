import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";

const AdminPanel = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState({
    name: "",
    description: "",
    active: true,
    monthlyAccrual: 1.66,
    maxCarryover: 5,
    requiresMedicalCertificate: false,
  });
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showLeaveTypeDialog, setShowLeaveTypeDialog] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [typesResponse, requestsResponse] = await Promise.all([
          axios.get("http://localhost:8081/api/admin/leave-types", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:8081/api/leave/requests", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setLeaveTypes(typesResponse.data);
        setLeaveRequests(requestsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8081/api/leave/requests/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLeaveRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
      setSuccessMessage(`Request ${id} updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setError("Failed to update status");
    }
  };

  const handleCreateLeaveType = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/api/admin/leave-types",
        newLeaveType,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLeaveTypes([...leaveTypes, response.data]);
      setNewLeaveType({
        name: "",
        description: "",
        active: true,
        monthlyAccrual: 1.66,
        maxCarryover: 5,
        requiresMedicalCertificate: false,
      });
      setShowLeaveTypeDialog(false);
      setSuccessMessage("Leave type created successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create leave type");
    }
  };

  const handleUpdateLeaveType = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/admin/leave-types/${selectedLeaveType.id}`,
        selectedLeaveType,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLeaveTypes(
        leaveTypes.map((type) =>
          type.id === selectedLeaveType.id ? response.data : type
        )
      );
      setSelectedLeaveType(null);
      setShowLeaveTypeDialog(false);
      setSuccessMessage("Leave type updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update leave type");
    }
  };



  const filteredRequests =
    filter === "ALL"
      ? leaveRequests
      : leaveRequests.filter((req) => req.status === filter);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Leave Management Dashboard
      </Typography>

      {(error || successMessage) && (
        <Box mb={3}>
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" onClose={() => setSuccessMessage("")}>
              {successMessage}
            </Alert>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Leave Types Section */}
        <Grid item xs={12} md={6}>
          {/* Leave Types Table (already handled in your code) */}
        </Grid>

        {/* Leave Requests Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Leave Requests
              </Typography>
              <FormControl size="small">
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="REJECTED">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table size={isMobile ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Employee
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Period</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRequests.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell>{req.employeeName}</TableCell>
                          <TableCell>{req.leaveTypeName}</TableCell>
                          <TableCell>
                            {formatDate(req.startDate)} -{" "}
                            {formatDate(req.endDate)}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={req.status}
                              color={
                                req.status === "APPROVED"
                                  ? "success"
                                  : req.status === "REJECTED"
                                  ? "error"
                                  : "warning"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            {req.status === "PENDING" && (
                              <>
                                <Button
                                  color="success"
                                  size="small"
                                  onClick={() =>
                                    handleStatusChange(req.id, "APPROVED")
                                  }
                                  sx={{ mr: 1 }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    handleStatusChange(req.id, "REJECTED")
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog for Create/Edit Leave Type */}
      <Dialog
        open={showLeaveTypeDialog}
        onClose={() => setShowLeaveTypeDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedLeaveType ? "Edit Leave Type" : "Create Leave Type"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={selectedLeaveType?.name || newLeaveType.name}
            onChange={(e) =>
              selectedLeaveType
                ? setSelectedLeaveType({
                    ...selectedLeaveType,
                    name: e.target.value,
                  })
                : setNewLeaveType({ ...newLeaveType, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={selectedLeaveType?.description || newLeaveType.description}
            onChange={(e) =>
              selectedLeaveType
                ? setSelectedLeaveType({
                    ...selectedLeaveType,
                    description: e.target.value,
                  })
                : setNewLeaveType({
                    ...newLeaveType,
                    description: e.target.value,
                  })
            }
          />
          <TextField
            label="Monthly Accrual"
            type="number"
            fullWidth
            margin="normal"
            value={
              selectedLeaveType?.monthlyAccrual || newLeaveType.monthlyAccrual
            }
            onChange={(e) =>
              selectedLeaveType
                ? setSelectedLeaveType({
                    ...selectedLeaveType,
                    monthlyAccrual: e.target.value,
                  })
                : setNewLeaveType({
                    ...newLeaveType,
                    monthlyAccrual: e.target.value,
                  })
            }
          />
          <TextField
            label="Max Carryover"
            type="number"
            fullWidth
            margin="normal"
            value={selectedLeaveType?.maxCarryover || newLeaveType.maxCarryover}
            onChange={(e) =>
              selectedLeaveType
                ? setSelectedLeaveType({
                    ...selectedLeaveType,
                    maxCarryover: e.target.value,
                  })
                : setNewLeaveType({
                    ...newLeaveType,
                    maxCarryover: e.target.value,
                  })
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={selectedLeaveType?.active ?? newLeaveType.active}
                onChange={(e) =>
                  selectedLeaveType
                    ? setSelectedLeaveType({
                        ...selectedLeaveType,
                        active: e.target.checked,
                      })
                    : setNewLeaveType({
                        ...newLeaveType,
                        active: e.target.checked,
                      })
                }
              />
            }
            label="Active"
          />
          <FormControlLabel
            control={
              <Switch
                checked={
                  selectedLeaveType?.requiresMedicalCertificate ??
                  newLeaveType.requiresMedicalCertificate
                }
                onChange={(e) =>
                  selectedLeaveType
                    ? setSelectedLeaveType({
                        ...selectedLeaveType,
                        requiresMedicalCertificate: e.target.checked,
                      })
                    : setNewLeaveType({
                        ...newLeaveType,
                        requiresMedicalCertificate: e.target.checked,
                      })
                }
              />
            }
            label="Requires Medical Certificate"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeaveTypeDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={
              selectedLeaveType ? handleUpdateLeaveType : handleCreateLeaveType
            }
          >
            {selectedLeaveType ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
