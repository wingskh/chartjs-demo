import CssBaseline from '@mui/material/CssBaseline';
import { NormalBarChart } from './Components/NormalBarChart';
import { IconLabelBarChart } from './Components/IconLabelBarChart';
import { MultiAxesBarChart } from './Components/MultiAxesBarChart';
import { IconWithMultiAxis } from './Components/IconWithMultiAxis';
import { RemoveTrailingSlash } from './Components/RemoveTrailingSlash';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


function App() {
  const [barChartType, setBarChartType] = React.useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    setBarChartType(event.target.value);

    navigate(event.target.value, {
      state: {},
    })
  };

  return (
    <main
      style={{
        backgroundColor: '#ffffff',
      }}
      className="main"
    >
      <RemoveTrailingSlash />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '80%' }}>
          <div style={{ marginBottom: '10px', height: '100%' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/normal" replace />} />
              <Route exact path="/normal" element={<NormalBarChart />} />
              <Route exact path="/icon-label" element={<IconLabelBarChart />} />
              <Route exact path="/multi-axes" element={<MultiAxesBarChart />} />
              <Route exact path="/icon-multi-axes" element={<IconWithMultiAxis />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <center>
            <div style={{ width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Bar Chart Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={barChartType}
                  label="BarChartType"
                  onChange={handleChange}
                >
                  <MenuItem value={'normal'}>Normal</MenuItem>
                  <MenuItem value={'icon-label'}>Icon Label</MenuItem>
                  <MenuItem value={'multi-axes'}>Multi Axes</MenuItem>
                  <MenuItem value={'icon-multi-axes'}>Icon With Multi Axes</MenuItem>
                </Select>
              </FormControl>
            </div>
          </center>
        </div>
      </div>
    </main >
  );
}
export default App;