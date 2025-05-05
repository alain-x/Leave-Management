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
  Paper,
  IconButton,
  Tooltip,
  Chip,
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
  Person,
  Logout,
  Refresh,
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
  Tooltip as RechartsTooltip,
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

  const renderWelcomeSection = () => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
        color: 'white',
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'white',
              color: theme.palette.primary.main,
              fontSize: '2rem',
            }}
          >
            {user?.firstName?.charAt(0)}
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.firstName}!
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
            {user?.role} Dashboard
          </Typography>
        </Grid>
        <Grid item>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh Dashboard">
              <IconButton onClick={fetchDashboardData} sx={{ color: 'white' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton onClick={logout} sx={{ color: 'white' }}>
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  const renderQuickActions = () => (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
      </Grid>
      {[
        {
          title: "Request Leave",
          icon: <Add />,
          route: "/leave-request",
          color: theme.palette.primary.main,
        },
        {
          title: "View Calendar",
          icon: <CalendarToday />,
          route: "/team-calendar",
          color: theme.palette.success.main,
        },
        {
          title: "Leave History",
          icon: <Assignment />,
          route: "/leave-history",
          color: theme.palette.info.main,
        },
        {
          title: "Notifications",
          icon: <Notifications />,
          route: "/notifications",
          color: theme.palette.warning.main,
        },
      ].map((action, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Button
            fullWidth
            variant="contained"
            startIcon={action.icon}
            onClick={() => navigate(action.route)}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: action.color,
              '&:hover': {
                backgroundColor: action.color,
                opacity: 0.9,
              },
            }}
          >
            {action.title}
          </Button>
        </Grid>
      ))}
    </Grid>
  );

  const renderStatCard = (stat) => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 0,
        border: `1px solid ${theme.palette.divider}`,
        background: stat.color,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {stat.label}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {stat.value}
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: "transparent",
              width: 48,
              height: 48,
              color: theme.palette.primary.main,
            }}
          >
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

  const renderLeaveRequests = () => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 0,
        border: `1px solid ${theme.palette.divider}`,
        height: '100%',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Recent Leave Requests
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
          {teamLeaveRequests.map((req) => (
            <React.Fragment key={req.id}>
              <ListItem
                onClick={() => navigate(`/leave-request/${req.id}`)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {req.employee?.name?.charAt(0) || "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={req.employee?.name || "Unknown User"}
                  secondary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        size="small"
                        label={req.status}
                        color={
                          req.status === "APPROVED"
                            ? "success"
                            : req.status === "PENDING"
                            ? "warning"
                            : "error"
                        }
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {renderWelcomeSection()}
      {renderQuickActions()}
      {renderQuickStats()}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {renderLeaveRequests()}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 0,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Leave Statistics
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={5}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {user?.role === "ADMIN" && renderAdminPanel()}
    </Container>
  );
};

export default Dashboard;
