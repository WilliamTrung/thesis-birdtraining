import { useState, useEffect } from "react";
import classManagementService from "../../../services/class-management.service";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import addonService from "../../../services/addon.service";
import WorkshopViewComponent from "../detail-overview/WorkshopViewComponent";
import { AddCircleOutlineOutlined } from "@mui/icons-material";
import { ochreTheme } from "../../themes/Theme";
import { toast } from "react-toastify";

export default function ClassOverviewComponent({ workshop, callbackClassSelect }) {
  const [classes, setClasses] = useState([]); // Initialize as an empty array
  const [selectedClass, setSelectedClass] = useState();
  useEffect(() => {
    async function fetchClasses() {
      try {
        let params = {
          workshopId: workshop.id,
        };
        const response = await classManagementService.getClasses(params);
        setClasses(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    if (workshop) {
      fetchClasses();
    }
  }, [workshop]);

  function handleClassSelect(classItem) {
    callbackClassSelect(classItem.id);
  }
  function formatRegistrationAmount(inVal) {
    return `${inVal.registered}/${inVal.maximum}`;
  }
  function loadListClasses() {
    return (
      <>
        {classes && classes.length > 0 ? (
          classes.map((classItem) => (
            <TableRow
              hover
              // selected
              key={workshop.id}
              onClick={() => handleClassSelect(classItem)}
              // style={{
              //     // cursor: 'pointer',
              //     background: selectedWorkshop === workshop.id ? '#f0f0f0' : 'white',
              // }}
              className={classItem.id === selectedClass ? "Mui-selected" : ""}
            >
              <TableCell align="center">{workshop.title} </TableCell>
              <TableCell align="center">
                {addonService.formatDate(classItem.startTime)}
              </TableCell>
              <TableCell align="center">
                {addonService.formatDate(classItem.registerEndDate)}
              </TableCell>
              <TableCell align="center">
                <>{formatRegistrationAmount(classItem.registrationAmount)}</>
              </TableCell>
              <TableCell align="center">{classItem.status}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              No record!
            </TableCell>
          </TableRow>
        )}
      </>
    );
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <WorkshopViewComponent workshopId={workshop.id} />
        </Grid>
        <Grid
          container
          item
          xs={12}
          // bgcolor={"#E3D026"}
          borderRadius={"5px"}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6">Classes (filter-bar-here)</Typography>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Workshop</TableCell>
                  <TableCell align="center">Created Date</TableCell>
                  <TableCell align="center">Closed Registration</TableCell>
                  <TableCell align="center">Registration</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadListClasses()}
                <TableRow hover>
                  <TableCell colSpan={12} align="center">
                    <AddCircleOutlineOutlined scale={"150%"} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}