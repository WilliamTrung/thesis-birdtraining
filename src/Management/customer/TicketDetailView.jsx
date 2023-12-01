import {
  Button,
  Typography,
  Select,
  FormControl,
  MenuItem,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import ConsultantService from "../../services/consultant.service";
import addonService from "../../services/addon.service";
import { Close } from "@mui/icons-material";

const TicketDetailView = ({ ticketIdForDetail, isAssigned, onClose }) => {
  const [dateValue, setDateValue] = useState();
  const [slotValue, setSlotValue] = useState();

  const [assignedTrainer, setAssignedTrainer] = useState(null);
  const [ticketDetail, setTicketDetail] = useState({});
  useEffect(() => {
    ConsultantService.getConsultingTicketDetail({ ticketId: ticketIdForDetail })
      .then((res) => {
        console.log("success Consulting Ticket Detail test", res.data);
        setTicketDetail(res.data);
        setDateValue(res.data.appointmentDate);
        setSlotValue(res.data.slotStartId);
      })
      .catch((e) => console.log("fail Consulting Ticket Detail test", e));
  }, [ticketIdForDetail]);

  const [listOfFreeTrainer, setListOfFreeTrainer] = useState([]);
  useEffect(() => {
    ConsultantService.getFreeTrainerOnSlotDate({
      dateValue: dateValue,
      slotId: slotValue,
    })
      .then((res) => {
        console.log("success Free Trainer list test", res.data);
        setListOfFreeTrainer(res.data);
      })
      .catch((e) => console.log("fail Free Trainer list test", e));
  }, [slotValue]);

  const AssignTrainer = (trainer, ticketId) => {
    ConsultantService.assignTrainer({ trainerId: trainer, ticketId: ticketId })
      .then((res) => {
        console.log("success Assign Trainer test", res.data);
      })
      .catch((e) => console.log("fail Assign Trainer test", e));
  };

  const CancelTicket = (ticketId) => {
    ConsultantService.cancelConsultingTicket({ ticketId })
      .then((res) => {
        console.log("succes Cancel Ticket test", res.data);
      })
      .catch((e) => console.log("fail Cancel Ticket tes", e));
  };

  const ConfirmTicket = (ticketId) => {
    ConsultantService.approveConsultingTicket({ ticketId })
      .then((res) => {
        console.log("succes Confirm Ticket test", res.data);
      })
      .catch((e) => console.log("fail Confirm Ticket tes", e));
  };

  return (
    <>
      <AppBar position="static" color="ochre">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={onClose}
          >
            <Close />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Ticket Detail
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container>
        <Grid container xs={12} spacing={2} component={Paper}>
          <Grid item xs={12}>
            <Typography variant="h5"> Basic Information</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Ticket ID:</Typography>
          </Grid>
          <Grid item xs={2}>
            {ticketDetail.id}
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Service:</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              {ticketDetail.onlineOrOffline ? "Online" : "Offine"}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Date:</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              {addonService.formatDate(ticketDetail.appointmentDate)}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Time:</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography> {ticketDetail.actualSlotStart}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5"> Detail Information</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography style={{ fontWeight: "bold", color: "blue" }}>
              Customer:
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography style={{ color: "blue" }}>
              {ticketDetail.customerName}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography style={{ fontWeight: "bold", color: "blue" }}>
              Email:
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography style={{ color: "blue" }}>
              {ticketDetail.customerEmail}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Address:</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{ticketDetail.addressDetail}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Distance:</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{ticketDetail.distance}Km</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Trainer:</Typography>
          </Grid>
          <Grid item xs={2}>
            {isAssigned === 1 || isAssigned === 3 ? (
              <Typography>{ticketDetail.trainerName}</Typography>
            ) : isAssigned === 2 && listOfFreeTrainer ? (
              <FormControl>
                <Typography>
                  <Select
                    onChange={(e) => setAssignedTrainer(e.target.value)}
                    value={assignedTrainer}
                  >
                    {listOfFreeTrainer.map((trainer) => (
                      <MenuItem value={trainer.id}>{trainer.name}</MenuItem>
                    ))}
                  </Select>
                </Typography>
              </FormControl>
            ) : (
              <></>
            )}
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Type:</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{ticketDetail.consultingType}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Price:</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Price: {ticketDetail.price}VND</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography fontWeight={"bold"}>Status:</Typography>
          </Grid>
          <Grid item xs={2}>
            {ticketDetail.status === "Approved" ? (
              <Typography style={{ color: "green" }}>
                {ticketDetail.status}
              </Typography>
            ) : (
              <Typography style={{ color: "red" }}>
                {ticketDetail.status}
              </Typography>
            )}
          </Grid>
          {isAssigned === 1 ? (
            <>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="ochre"
                  onClick={() => {
                    ConfirmTicket(ticketIdForDetail);
                  }}
                >
                  Confirm
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="ochre"
                  onClick={() => {
                    CancelTicket(ticketIdForDetail);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </>
          ) : isAssigned === 2 ? (
            <>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="ochre"
                  onClick={() => {
                    AssignTrainer(assignedTrainer, ticketIdForDetail);
                  }}
                >
                  Assign
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="contained"
                  color="ochre"
                  onClick={() => {
                    CancelTicket(ticketIdForDetail);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default TicketDetailView;
