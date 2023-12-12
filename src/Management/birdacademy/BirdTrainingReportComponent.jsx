import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Paper,
  ThemeProvider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import addOnService from "../../services/addon.service";
import trainingCourseManagementService from "../../../src/services/trainingcourse-management.service";
import { Tab } from "@coreui/coreui";
import { ochreTheme } from "../themes/Theme";
import ReportModifyComponent from "./ReportModifyComponent";

const BirdTrainingReportComponent = ({
  selectedProgress,
  birdSkillId,
  callbackAssigned,
}) => {
  const [reportList, setReportList] = useState([]);
  const [selectedReport, setSelectedReport] = useState();
  const [renderModifyReport, setRenderModifyReport] = useState(false);

  // Simulate fetching bird information based on customerId
  // Replace this with your actual API call or data fetching logic
  const fetchReportData = async () => {
    try {
      // Replace this URL with your actual API endpoint //https://localhost:7176
      console.log(selectedProgress);
      let params = {
        progressId: selectedProgress.id,
      };
      let response =
        await trainingCourseManagementService.getBirdTrainingReportByProgressId(
          params
        );
      console.log(response);
      setReportList(response);
    } catch (error) {
      console.error("Error fetching bird trainingProgress data:", error);
    }
  };
  useEffect(() => {
    fetchReportData();
  }, [selectedProgress]);

  function handleCallBackSkillButton() {
    callbackAssigned();
  }

  const handleModifyClick = (reportId) => {
    console.log("mod click");
    console.log("reportId: " + reportId);
    setSelectedReport(reportId);
    setRenderModifyReport(true);
  };

  const onCallbackModify = async () => {
    console.log("call back mod");
    fetchReportData();
    setRenderModifyReport(false);
    setSelectedReport(null);
  };
  return (
    <div style={{ padding: 20 }}>
      <ThemeProvider theme={ochreTheme}>
        {reportList != null && reportList.length > 0 && (
          <TableContainer style={{ padding: 20 }}>
            <h2>Bird Training Report {selectedProgress.id}</h2>
            <Table>
              <TableHead>
                <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  Slot
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  Trainer Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  Trainer Email
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "1rem" }}>
                  Status
                </TableCell>
                <TableCell></TableCell>
              </TableHead>
              {reportList.map((rsl) => (
                <TableBody>
                  <TableRow
                    key={rsl.reportId}
                    style={{
                      cursor: "pointer",
                      background:
                        selectedReport === rsl.reportId ? "#f0f0f0" : "white",
                    }}
                  >
                    <TableCell>{rsl.slotId}</TableCell>
                    <TableCell>{addOnService.formatDate(rsl.date)}</TableCell>
                    <TableCell>{rsl.trainerName}</TableCell>
                    <TableCell>{rsl.trainerEmail}</TableCell>
                    <TableCell>{rsl.status}</TableCell>
                    <TableCell>
                      {rsl.status === "NotYet" && (
                        <Button
                          sx={{ float: "right", marginBottom: "20px" }}
                          variant="contained"
                          color="ochre"
                          onClick={() => handleModifyClick(rsl.reportId)}
                        >
                          Modify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>

            <div
              className="main-button-container"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                sx={{
                  marginTop: 3,
                  padding: "5px 25px 5px 25px",
                  boxShadow:
                    "0px 2px 4px 2px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
                }}
                className="button"
                onClick={() => handleCallBackSkillButton()}
              >
                Back
              </Button>
            </div>
          </TableContainer>
        )}
      </ThemeProvider>
      {renderModifyReport && (
        <ReportModifyComponent
          reportId={selectedReport}
          birdSkillId={birdSkillId}
          callbackModify={onCallbackModify}
        />
      )}
    </div>
  );
};

export default BirdTrainingReportComponent;
