import React from 'react';
import { Table } from '@mantine/core';

const AverageYieldAreaTable = ({ data }) => {

    // checking whether data is received or not
  if (!data.length) return <div>No data available</div>;

  return (
    <Table striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>Crop</th>
          <th>Average Yield (Kg/Ha)</th>
          <th>Average Cultivation Area (Ha)</th>
        </tr>
      </thead>
      <tbody>
        {/* passing the processed data to the table  */}
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.crop}</td>
            <td>{item.avgYield}</td>
            <td>{item.avgArea}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AverageYieldAreaTable;
