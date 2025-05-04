import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const AdminPanel = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newLeaveType, setNewLeaveType] = useState({
    name: "",
    description: "",
    active: true,
  });
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/leave-types",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLeaveTypes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leave types");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLeaveType = async () => {
    try {
      await axios.post(
        "http://localhost:8081/api/admin/leave-types",
        newLeaveType,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNewLeaveType({ name: "", description: "", active: true });
      fetchLeaveTypes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create leave type");
    }
  };

  const handleUpdateLeaveType = async () => {
    try {
      await axios.put(
        `http://localhost:8081/api/admin/leave-types/${selectedLeaveType.id}`,
        selectedLeaveType,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSelectedLeaveType(null);
      fetchLeaveTypes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update leave type");
    }
  };

  const handleDeleteLeaveType = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      try {
        await axios.delete(
          `http://localhost:8081/api/admin/leave-types/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchLeaveTypes();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete leave type");
      }
    }
  };

  const handleEditLeaveType = (leaveType) => {
    setSelectedLeaveType(leaveType);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Admin Panel</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header">
                          <h5>Create New Leave Type</h5>
                        </div>
                        <div className="card-body">
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleCreateLeaveType();
                            }}
                          >
                            <div className="form-group mb-3">
                              <label>Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={newLeaveType.name}
                                onChange={(e) =>
                                  setNewLeaveType({
                                    ...newLeaveType,
                                    name: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="form-group mb-3">
                              <label>Description</label>
                              <textarea
                                className="form-control"
                                value={newLeaveType.description}
                                onChange={(e) =>
                                  setNewLeaveType({
                                    ...newLeaveType,
                                    description: e.target.value,
                                  })
                                }
                                rows="3"
                              ></textarea>
                            </div>
                            <div className="form-group mb-3">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={newLeaveType.active}
                                  onChange={(e) =>
                                    setNewLeaveType({
                                      ...newLeaveType,
                                      active: e.target.checked,
                                    })
                                  }
                                />
                                <label className="form-check-label">
                                  Active
                                </label>
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary">
                              Create Leave Type
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-header">
                          <h5>Leave Types</h5>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Description</th>
                                  <th>Status</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {leaveTypes.map((leaveType) => (
                                  <tr key={leaveType.id}>
                                    <td>{leaveType.name}</td>
                                    <td>{leaveType.description}</td>
                                    <td>
                                      <span
                                        className={`badge badge-${
                                          leaveType.active
                                            ? "success"
                                            : "danger"
                                        }`}
                                      >
                                        {leaveType.active
                                          ? "Active"
                                          : "Inactive"}
                                      </span>
                                    </td>
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleEditLeaveType(leaveType)
                                        }
                                        className="btn btn-primary btn-sm mr-2"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteLeaveType(leaveType.id)
                                        }
                                        className="btn btn-danger btn-sm"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
