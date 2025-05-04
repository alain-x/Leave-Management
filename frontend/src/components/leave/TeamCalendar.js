// src/components/leave/TeamCalendar.js

import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = momentLocalizer(moment);

const TeamCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaveEvents();
  }, []);

  const fetchLeaveEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/leave/requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const calendarEvents = response.data.map((leave) => ({
        title: `${leave.user.firstName} ${leave.user.lastName} - ${leave.leaveType}`,
        start: new Date(leave.startDate),
        end: new Date(leave.endDate),
        allDay: true,
        status: leave.status,
      }));

      setEvents(calendarEvents);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch leave events");
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      backgroundColor: getStatusColor(event.status),
      borderRadius: "0px",
      opacity: 0.8,
      color: "white",
      border: "none",
    };

    return {
      style: style,
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "#28a745"; // green
      case "PENDING":
        return "#ffc107"; // yellow
      case "REJECTED":
        return "#dc3545"; // red
      default:
        return "#6c757d"; // gray
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Team Calendar</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  views={["month", "week", "day"]}
                  eventPropGetter={eventStyleGetter}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCalendar;
