import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  AdminPanelSettings as AdminIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceResponse, requestsResponse] = await Promise.all([
          axios.get('http://localhost:8081/api/leave/balance', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://localhost:8081/api/leave/requests/recent', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setLeaveBalance(balanceResponse.data);
        setRecentRequests(requestsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.firstName}!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/leave-request')}
              >
                Request Leave
              </Button>
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/leave-history')}
              >
                View History
              </Button>
              <Button
                variant="outlined"
                startIcon={<CalendarIcon />}
                onClick={() => navigate('/team-calendar')}
              >
                Team Calendar
              </Button>
              {user?.role === 'ADMIN' && (
                <Button
                  variant="outlined"
                  startIcon={<AdminIcon />}
                  onClick={() => navigate('/admin')}
                >
                  Admin Panel
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Leave Balance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Leave Balance
              </Typography>
              {leaveBalance ? (
                <Grid container spacing={2}>
                  {Object.entries(leaveBalance).map(([type, balance]) => (
                    <Grid item xs={6} key={type}>
                      <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {type}
                        </Typography>
                        <Typography variant="h4">
                          {balance}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          days remaining
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography>No leave balance information available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Requests */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Leave Requests
              </Typography>
              {recentRequests.length > 0 ? (
                <List>
                  {recentRequests.map((request) => (
                    <React.Fragment key={request.id}>
                      <ListItem>
                        <ListItemText
                          primary={`${request.leaveType} Leave`}
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {new Date(request.startDate).toLocaleDateString()} -{' '}
                                {new Date(request.endDate).toLocaleDateString()}
                              </Typography>
                              <br />
                              <Typography
                                component="span"
                                variant="body2"
                                color={
                                  request.status === 'APPROVED'
                                    ? 'success.main'
                                    : request.status === 'REJECTED'
                                    ? 'error.main'
                                    : 'warning.main'
                                }
                              >
                                {request.status}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography>No recent leave requests</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Calendar Preview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Team Calendar
                </Typography>
                <Button
                  startIcon={<GroupIcon />}
                  onClick={() => navigate('/team-calendar')}
                >
                  View Full Calendar
                </Button>
              </Box>
              {/* Add a simple calendar preview here */}
              <Typography variant="body2" color="text.secondary">
                View your team's leave schedule and upcoming time off
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 