import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

const LeaveBalance = () => {
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAccrualDialog, setShowAccrualDialog] = useState(false);
  const [showCarryoverDialog, setShowCarryoverDialog] = useState(false);

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  const fetchLeaveBalances = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8081/api/leave/balance',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLeaveBalances(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch leave balances');
    } finally {
      setLoading(false);
    }
  };

  const handleAccrueLeave = async () => {
    try {
      await axios.post(
        'http://localhost:8081/api/leave/accrue',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchLeaveBalances();
      setShowAccrualDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accrue leave');
    }
  };

  const handleProcessCarryover = async () => {
    try {
      await axios.post(
        'http://localhost:8081/api/leave/carryover',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchLeaveBalances();
      setShowCarryoverDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process carryover');
    }
  };

  return (
    <div>
      <Card>
        <CardHeader title="Leave Balance" />
        <CardBody>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowAccrualDialog(true)}
                >
                  Accrue Leave
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setShowCarryoverDialog(true)}
                  className="ml-2"
                >
                  Process Year-End Carryover
                </Button>
              </div>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Leave Type</TableCell>
                    <TableCell>Balance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaveBalances.map((balance) => (
                    <TableRow key={balance.leaveType}>
                      <TableCell>{balance.leaveType}</TableCell>
                      <TableCell>{balance.balance} days</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardBody>
      </Card>

      <Dialog open={showAccrualDialog} onClose={() => setShowAccrualDialog(false)}>
        <DialogTitle>Accrue Leave</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to accrue leave for all active leave types?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAccrualDialog(false)}>Cancel</Button>
          <Button onClick={handleAccrueLeave} color="primary">
            Accrue Leave
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showCarryoverDialog} onClose={() => setShowCarryoverDialog(false)}>
        <DialogTitle>Process Year-End Carryover</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to process year-end carryover for all leave types?
            Excess days will expire on January 31st.
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCarryoverDialog(false)}>Cancel</Button>
          <Button onClick={handleProcessCarryover} color="primary">
            Process Carryover
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaveBalance;
