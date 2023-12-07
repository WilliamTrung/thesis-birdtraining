import React, { useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  Stack,
  ThemeProvider,
  Typography,
  Box,
  Card,
  CardContent,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import trainingCourseManagementService from "../../../src/services/trainingcourse-management.service";
import { UploadComponent } from "../component/upload/Upload";
import Editor from "../component/text-editor/Editor";
import { ochreTheme } from "../themes/Theme";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";

const ReturnBirdComponent = ({ requestedId, callBackMainManagement }) => {
  const [trainingPricePolicies, setTrainingPricePolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState();
  const [actualPrice, setActualPrice] = useState();

  const [birdTrainingCourse, setBirdTrainingCourse] = useState(null);
  const [returnNote, setReturnNote] = useState("");
  const [tmpNote, setTmpNote] = useState("");
  const [pictures, setPictures] = useState([]);
  const [submittedImages, setSubmittedImages] = useState([]);

  const handleCancelClick = () => {
    callBackMainManagement();
  };

  const handleEditorChange = (value) => {
    setReturnNote(value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPictures(files);

    // Create an array of image names from the selected files
    const imageNames = files.map((file) => file.name);
    setSubmittedImages(imageNames);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a FormData object to hold the form datalet check = true;
    let check = true;
    if (!pictures || pictures.length < 1) {
      check = false;
      toast.error("Please provide return image");
    }
    if (!returnNote || returnNote.length < 1) {
      check = false;
      toast.error("Please provide return note");
    }

    if (check) {
      const formData = new FormData();
      formData.append("BirdTrainingCourseId", requestedId);
      formData.append("ReturnNote", returnNote);
      if (birdTrainingCourse?.status == "TrainingDone") {
        console.log("training done mac dinh 3");
        formData.append("TrainingPricePolicyId", 3);
      } else {
        console.log("not training done ");
        formData.append("TrainingPricePolicyId", selectedPolicyId);
      }

      // Append each file separately
      pictures.forEach((picture, index) => {
        formData.append(`ReturnPictures`, picture);
      });

      console.log(formData);

      try {
        let response = await trainingCourseManagementService.returnBirdForm(
          formData
        );
        if (response.status == 200) {
          toast.success("Submit return form success!");
          callBackMainManagement();
        }
      } catch (error) {
        console.log(error);
        toast.error("Error return form!");
      }
    }
  };
  async function fetchRequestedData() {
    try {
      let params = {
        $filter: `id eq ${requestedId}`,
      };
      let response =
        await trainingCourseManagementService.getAllBirdTrainingCourse(params);
      console.log(response[0]);
      setBirdTrainingCourse(response[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchPolicyData() {
    try {
      let params = {
        $filter: `status eq 'Active'`,
      };
      let response =
        await trainingCourseManagementService.getAllTrainingPricePolicies(
          params
        );
      console.log(response);
      setTrainingPricePolicies(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    fetchRequestedData();
    fetchPolicyData();
  }, [requestedId]);
  // useEffect(() => {
  //   if (birdTrainingCourse != null) {
  //     const current = birdTrainingCourse.find((e) => e.id == requestedId);
  //     console.log(current);
  //     if (current != null) {
  //       setActualPrice(current.actualPrice);
  //       if (current.status == "TrainingDone") {
  //         setSelectedPolicyId(3);
  //       }
  //     }
  //   }
  // }, [birdTrainingCourse]);
  const handleSelectPolicy = (event) => {
    console.log(event.target.value);
    setSelectedPolicyId(event.target.value);
    // const finalPrice =
    //   birdTrainingCourse.find((e) => e.id == requestedId).discountedPrice *
    //   event.target.value.chargeRate;
    const chargeRate = trainingPricePolicies.find(
      (e) => e.id == event.target.value
    );
    const finalPrice =
      birdTrainingCourse.discountedPrice * chargeRate.chargeRate;
    console.log(finalPrice);
    setActualPrice(finalPrice);
  };
  return (
    <ThemeProvider theme={ochreTheme}>
      <Grid sx={{ padding: 2 }}>
        <AppBar position="static" color="ochre">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              sx={{ mr: 2 }}
              onClick={callBackMainManagement}
            >
              <Close />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Return Bird Form
            </Typography>
          </Toolbar>
        </AppBar>
      </Grid>
      <div>
        {birdTrainingCourse != null && (
          // birdTrainingCourse
          //   .filter((request) => request.id == requestedId)
          //   .map((request) => (
          <Card
            style={{
              maxWidth: 610,
              margin: "auto",
              marginTop: 4,
            }}
          >
            <CardContent>
              <Grid
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 2,
                }}
                color="textPrimary"
              >
                Billing Details
              </Grid>
              <Grid
                style={{
                  fontSize: 20,
                  marginBottom: 2,
                }}
                color="textSecondary"
              >
                Requested Id: {birdTrainingCourse.id}
              </Grid>
              <Grid
                style={{
                  fontSize: 20,
                  marginBottom: 2,
                }}
                color="textSecondary"
              >
                Customer: {birdTrainingCourse.customerName}
              </Grid>

              <Grid
                style={{
                  fontSize: 20,
                  marginBottom: 2,
                }}
                color="textSecondary"
              >
                Course: {birdTrainingCourse.trainingCourseTitle}
              </Grid>

              <Grid
                style={{
                  fontSize: 20,
                  marginBottom: 2,
                }}
                color="textSecondary"
              >
                Status: {birdTrainingCourse.status}
              </Grid>

              <div
                style={{
                  marginTop: 2,
                }}
              >
                <Grid
                  style={{
                    fontSize: 20,
                    marginBottom: 2,
                  }}
                  variant="body1"
                  color="textPrimary"
                >
                  Total Price: {birdTrainingCourse.totalPrice.toFixed(2)}
                </Grid>

                <Grid
                  style={{
                    fontSize: 20,
                    marginBottom: 2,
                  }}
                  variant="body1"
                  color="textPrimary"
                >
                  Discounted Price:{" "}
                  {birdTrainingCourse.discountedPrice.toFixed(2)}
                </Grid>

                <Grid
                  style={{
                    fontSize: 20,
                    marginBottom: 2,
                  }}
                  variant="body1"
                  color="textPrimary"
                >
                  Actual Price:{" "}
                  {actualPrice != null
                    ? actualPrice
                    : birdTrainingCourse.actualPrice.toFixed(2)}
                </Grid>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="form-container">
          <form
            onSubmit={handleSubmit}
            className="form"
            encType="multipart/form-data"
          >
            {/* <Typography variant="h6" gutterBottom>
              Return bird form
            </Typography> */}
            {birdTrainingCourse?.status != "TrainingDone" && (
              <FormControl
                sx={{
                  marginTop: 4,
                  marginBottom: 3,
                  width: 600,
                  maxWidth: 610,
                }}
              >
                <InputLabel id="selectLabel_ChoosePolicy">
                  Choose Policy
                </InputLabel>
                <Select
                  labelId="selectLabel_ChoosePolicy"
                  label="Choose Policy"
                  value={selectedPolicyId}
                  // readOnly={
                  //   birdTrainingCourse?.status == "TrainingDone" ? true : false
                  // }
                  onChange={handleSelectPolicy}
                >
                  {trainingPricePolicies
                    .filter((policy) => policy.name != "Success Requested")
                    .map((policy) => (
                      <MenuItem value={policy.id}>{policy.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth required style={{ marginBottom: 10 }}>
              <Typography variant="h6" gutterBottom>
                Return Note
              </Typography>
              <Editor onGetHtmlValue={handleEditorChange} htmlValue={tmpNote} />
            </FormControl>
            <FormControl required style={{ marginBottom: 15 }}>
              <Typography variant="h6" gutterBottom>
                Pictures
              </Typography>
              <Button variant="contained" color="ochre">
                <UploadComponent onChange={handleFileChange} accept="image/*">
                  Upload image(s)
                </UploadComponent>
              </Button>
              {/* Display submitted files here */}
              <div>
                {submittedImages.map((imageName, index) => (
                  <div key={index}>{imageName}</div>
                ))}
              </div>
            </FormControl>
            <br />
            <Button
              sx={{ float: "right", marginBottom: "20px" }}
              variant="contained"
              color="ochre"
              type="submit"
            >
              Confirm check out
            </Button>

            <Button
              sx={{ float: "right", marginBottom: "20px" }}
              color="ochre"
              onClick={() => handleCancelClick()}
            >
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ReturnBirdComponent;
