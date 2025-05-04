import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Assignment,
  Notifications,
  CalendarToday,
  CheckCircle,
  PendingActions,
  Cancel,
  People,
  Settings,
  Add,
} from "@mui/icons-material";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";

const COLORS = {
  approved: "#4caf50",
  pending: "#ff9800",
  rejected: "#f44336",
  primary: "#1976d2",
  secondary: "#9c27b0",
};

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [teamLeaveRequests, setTeamLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalRequests: 24,
    approved: 15,
    pending: 6,
    rejected: 3,
  });

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [balanceRes, requestsRes] = await Promise.all([
        axios.get("http://localhost:8081/api/leave/balance", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8081/api/leave/requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setLeaveBalance(balanceRes.data);
      setTeamLeaveRequests(requestsRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const quickStats = [
    {
      label: "Total Requests",
      value: stats.totalRequests,
      icon: <Assignment color="primary" />,
      color: theme.palette.primary.light,
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: <CheckCircle color="success" />,
      color: "#e8f5e9",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: <PendingActions color="warning" />,
      color: "#fff3e0",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: <Cancel color="error" />,
      color: "#ffebee",
    },
  ];

  const pieData = [
    { name: "Approved", value: stats.approved, color: COLORS.approved },
    { name: "Pending", value: stats.pending, color: COLORS.pending },
    { name: "Rejected", value: stats.rejected, color: COLORS.rejected },
  ];

  const renderStatCard = (stat) => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 0,
        border: `1px solid ${theme.palette.divider}`,
        background: stat.color,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {stat.value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: "transparent", width: 48, height: 48 }}>
            {stat.icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const renderQuickStats = () => (
    <Grid container spacing={3} mb={3}>
      {quickStats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          {renderStatCard(stat)}
        </Grid>
      ))}
    </Grid>
  );

  const renderAdminPanel = () => (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom mb={2}>
        Admin Tools
      </Typography>
      <Grid container spacing={3} mb={4}>
        {[
          {
            title: "Manage Leave Types",
            icon: <Settings />,
            route: "/admin/leave-types",
          },
          {
            title: "Manage Employees",
            icon: <People />,
            route: "/admin/employees",
          },
          {
            title: "Leave Balances",
            icon: <CalendarToday />,
            route: "/admin/leave-balances",
          },
          {
            title: "System Settings",
            icon: <Settings />,
            route: "/admin/settings",
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={item.icon}
              onClick={() => navigate(item.route)}
              sx={{
                p: 3,
                borderRadius: 2,
                borderColor: theme.palette.divider,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light + "20",
                },
              }}
            >
              {item.title}
            </Button>
          </Grid>
        ))}
      </Grid>
    </>
  );

  const renderManagerPanel = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 0,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Team Leave Requests
              </Typography>
              <Button
                size="small"
                variant="text"
                endIcon={<Add />}
                onClick={() => navigate("/leave-approvals")}
              >
                View All
              </Button>
            </Box>
            <List sx={{ maxHeight: 400, overflow: "auto" }}>
              {teamLeaveRequests.slice(0, 5).map((req) => (
                <React.Fragment key={req.id}>
                  <ListItem
                    onClick={() => navigate(`/leave-request/${req.id}`)}
                    sx={{
                      borderRadius: 2,
                      backgroundColor:
                        req.status === "APPROVED"
                          ? COLORS.approved + "20"
                          : req.status === "PENDING"
                          ? COLORS.pending + "20"
                          : COLORS.rejected + "20",
                      color:
                        req.status === "APPROVED"
                          ? COLORS.approved
                          : req.status === "PENDING"
                          ? COLORS.pending
                          : COLORS.rejected,
                      border: `1px solid ${
                        req.status === "APPROVED"
                          ? COLORS.approved
                          : req.status === "PENDING"
                          ? COLORS.pending
                          : COLORS.rejected
                      }`,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        cursor: "pointer",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>{req.employee?.name?.charAt(0) || "U"}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${req.employee?.name || "Unknown User"}`}
                      secondary={`Status: ${req.status}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={5}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 0,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Leave Statistics
            </Typography>
            <Box height={250}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={5}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>
      {renderQuickStats()}
      {user?.role === "ADMIN" && renderAdminPanel()}
      {(user?.role === "MANAGER" || user?.role === "ADMIN") &&
        renderManagerPanel()}
    </Container>
  );
};

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

export default Dashboard;
