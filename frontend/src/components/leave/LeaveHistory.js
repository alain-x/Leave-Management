import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Removed GridColDef

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
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
      setError(err.response?.data?.message || "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (id) => {
    try {
      await axios.put(
        `http://localhost:8081/api/leave/requests/${id}/approve`,
        { comment: "Approved" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchLeaveRequests();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to approve leave request"
      );
    }
  };

  const rejectLeave = async (id) => {
    try {
      await axios.put(
        `http://localhost:8081/api/leave/requests/${id}/reject`,
        { comment: "Rejected" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchLeaveRequests();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject leave request");
    }
  };

  const columns = [
    { field: "leaveType", headerName: "Leave Type", width: 150 },
    { field: "startDate", headerName: "Start Date", width: 150 },
    { field: "endDate", headerName: "End Date", width: 150 },
    { field: "reason", headerName: "Reason", width: 300 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <span className={`badge badge-${getStatusClass(params.value)}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => {
        if (
          (user?.role === "ADMIN" || user?.role === "MANAGER") &&
          params.row.status === "PENDING"
        ) {
          return (
            <div>
              <button
                className="btn btn-success btn-sm me-2"
                onClick={() => approveLeave(params.row.id)}
              >
                Approve
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => rejectLeave(params.row.id)}
              >
                Reject
              </button>
            </div>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Leave History</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <div style={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={leaveRequests}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.id}
                    components={{ Toolbar: GridToolbar }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "danger";
    default:
      return "secondary";
  }
};

export default LeaveHistory;
