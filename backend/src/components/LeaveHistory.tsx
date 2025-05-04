import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const LeaveHistory = () => {
  const navigate = useNavigate();
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "leaveType", headerName: "Leave Type", width: 130 },
    { field: "startDate", headerName: "Start Date", width: 130 },
    { field: "endDate", headerName: "End Date", width: 130 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "reason", headerName: "Reason", width: 200 },
    { field: "createdAt", headerName: "Requested On", width: 150 },
  ];

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const response = await fetch(
          "http://localhost:9090/api/leave-requests",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leave history");
        }

        const data = await response.json();
        setLeaveHistory(data);
      } catch (err) {
        setError("Failed to fetch leave history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveHistory();
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Leave History
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/leave-request")}
          >
            Apply New Leave
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={leaveHistory}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            getRowId={(row) => row.id}
            loading={loading}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default LeaveHistory;
