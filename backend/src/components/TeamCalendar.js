import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Alert } from "@mui/material";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

const TeamCalendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamCalendar = async () => {
      try {
        const response = await fetch(
          "http://localhost:8081/api/team-calendar",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch team calendar");
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Failed to fetch team calendar. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamCalendar();
  }, []);

  const tileContent = ({ date }) => {
    const dateStr = date.toISOString().split("T")[0];
    const eventsOnDate = events.filter((event) => event.date === dateStr);

    if (eventsOnDate.length === 0) return null;

    return (
      <Box sx={{ mt: 1 }}>
        {eventsOnDate.map((event, index) => (
          <Box
            key={index}
            sx={{
              p: 1,
              mb: 1,
              borderRadius: 1,
              bgcolor:
                event.status === "approved"
                  ? "success.light"
                  : event.status === "pending"
                  ? "warning.light"
                  : "error.light",
            }}
          >
            <Typography variant="caption">
              {event.employeeName} - {event.leaveType}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

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
            Team Calendar
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/leave-request")}
          >
            Apply Leave
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ height: "80vh", width: "100%" }}>
          <Calendar
            tileContent={tileContent}
            defaultView="month"
            calendarType="US"
            showNeighboringMonth={false}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default TeamCalendar;
