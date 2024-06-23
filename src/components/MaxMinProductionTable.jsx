import React from 'react';
import { Table } from '@mantine/core';

const MaxMinProductionTable = ({ data }) => {

    // checking whether data is received or not
  if (!data.length) return <div>No data available</div>;

  return (
    <Table striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>Year</th>
          <th>Crop with Maximum Production</th>
          <th>Crop with Minimum Production</th>
        </tr>
      </thead>
      <tbody>
      {/* passing the processed data to the table  */}
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.year}</td>
            <td>{item.maxCrop}</td>
            <td>{item.minCrop}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MaxMinProductionTable;
