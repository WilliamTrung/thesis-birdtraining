import React, { useEffect, useState } from 'react';
import { Alert, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import axios from 'axios';
// import { toast } from 'react-toastify';
import WorkshopDetailTemplateComponent from './WorkshopDetail';
import WorkshopViewComponent from './WorkshopViewComponent';
import {  getDetailsByWorkshop } from '../../workshopService';

export default function WorkshopDetailOverviewComponent({ workshop }) {
  const [details, setDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  
  async function fetchData(workshop){
    try {
      let response = await getDetailsByWorkshop(workshop);
      setDetails(response);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {      
    fetchData(workshop);
  }, []);
  const handleDetailClick = (detail) => {
    setSelectedDetail(detail);
    // console.log('slot component: ' +selectedDetail);
  };
  const handleDetailChange = () => {
    fetchData(workshop);
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <WorkshopViewComponent workshopId={workshop.id}/>
      </Grid>
    <Grid item xs={2}>
    <List>
            {details.map((detail, index) => (
                
                <ListItemButton
                  key={detail.id}
                  onClick={() => handleDetailClick(detail)}
                  selected={selectedDetail===detail}
                >
                    <ListItemText primary={`Slot ${index + 1}`}/>
                </ListItemButton>
              ))}
        </List>
    </Grid>
    <Grid item xs={10}>
      {selectedDetail ? (
          <WorkshopDetailTemplateComponent selectedDetail={selectedDetail}/>
      ) : (
          <Alert severity="info">No detail selected!</Alert>
      )}
    </Grid>
  </Grid>
  );
}
