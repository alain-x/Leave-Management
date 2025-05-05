import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LeaveRequest {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
  requestedAt: string;
  documents?: string[];
}

const LeaveHistory = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaveHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost:8081/api/leave/requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLeaveRequests(response.data);
    } catch (err) {
      setError("Failed to fetch leave history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Leave History
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/request-leave")}
              sx={{ mr: 2 }}
            >
              New Request
            </Button>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchLeaveHistory}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {leaveRequests.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Leave Requests Found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              You haven't submitted any leave requests yet.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/request-leave")}
            >
              Submit Your First Request
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {leaveRequests.map((request) => (
              <Grid item xs={12} key={request.id}>
                <Card
                  sx={{
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Leave Type
                        </Typography>
                        <Typography variant="h6">
                          {request.leaveType.replace("_", " ")}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {formatDate(request.startDate)} -{" "}
                          {formatDate(request.endDate)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {calculateDuration(request.startDate, request.endDate)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status) as any}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
                        {request.documents && request.documents.length > 0 && (
                          <Tooltip title="Download Documents">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                // Handle document download
                              }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Reason
                        </Typography>
                        <Typography variant="body2">{request.reason}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="text.secondary">
                          Requested on {formatDate(request.requestedAt)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default LeaveHistory;
