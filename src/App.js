import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MantineProvider, Container } from '@mantine/core';
import MaxMinProductionTable from './components/MaxMinProductionTable';
import AverageYieldAreaTable from './components/AverageYieldAreaTable';
import './App.css';

const App = () => {

  // State variables to store the processed data
  const [maxMinData, setMaxMinData] = useState([]);
  const [avgYieldAreaData, setAvgYieldAreaData] = useState([]);

  // Fetching data from the local JSON file
  useEffect(() => {

    axios.get('/data.json')
      .then(response => {
        const data = response.data;
        console.log("Fetched data:", data);
        processMaxMinData(data);
        processAvgYieldAreaData(data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // Process data to find the crop with maximum and minimum production for each year
  const processMaxMinData = (data) => {
    const yearData = {};

    // Group data by year
    data.forEach(entry => {
      const year = entry.Year.match(/\d{4}/)[0];
      if (!yearData[year]) {
        yearData[year] = [];
      }
      yearData[year].push(entry);
    });

    // Find the crop with maximum and minimum production for each year
    const result = Object.keys(yearData).map(year => {
      const crops = yearData[year];
      const maxCrop = crops.reduce((max, crop) => crop['Crop Production (UOM:t(Tonnes))'] > max['Crop Production (UOM:t(Tonnes))'] ? crop : max, crops[0]);
      const minCrop = crops.reduce((min, crop) => crop['Crop Production (UOM:t(Tonnes))'] < min['Crop Production (UOM:t(Tonnes))'] ? crop : min, crops[0]);
      return {
        year,
        maxCrop: maxCrop['Crop Name'] || 'N/A',
        minCrop: minCrop['Crop Name'] || 'N/A'
      };
    });

    console.log("MaxMin Data:", result);
    setMaxMinData(result);
  };

  // Process data to calculate the average yield and cultivation area for each crop
  const processAvgYieldAreaData = (data) => {
    const cropData = {};

    // Accumulate total yield and total area for each crop
    data.forEach(entry => {
      const cropName = entry['Crop Name'];
      if (!cropData[cropName]) {
        cropData[cropName] = { totalYield: 0, totalArea: 0, count: 0 };
      }
      cropData[cropName].totalYield += entry['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))'] || 0;
      cropData[cropName].totalArea += entry['Area Under Cultivation (UOM:Ha(Hectares))'] || 0;
      cropData[cropName].count += 1;
    });

    // Calculate average yield and area for each crop
    const result = Object.keys(cropData).map(crop => {
      return {
        crop,
        avgYield: (cropData[crop].totalYield / cropData[crop].count).toFixed(3),
        avgArea: (cropData[crop].totalArea / cropData[crop].count).toFixed(3)
      };
    });

    console.log("AvgYieldArea Data:", result);
    setAvgYieldAreaData(result);
  };

  return (
    //Passing the processed data into components and finally building the table
    <MantineProvider>
      <div className="App">
        <Container size="xl">
          <h1>Crop Data Aggregation</h1>
          <h2>Crop Production Data</h2>
          <MaxMinProductionTable data={maxMinData} />
          <h2>Average Yield and Cultivation Area</h2>
          <AverageYieldAreaTable data={avgYieldAreaData} />
        </Container>
      </div>
    </MantineProvider>
  );
};

export default App;
