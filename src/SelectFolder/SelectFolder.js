import React, { useState } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  OutlinedInput,
  Button,
} from "@mui/material";

import "./SelectFolder.css";
import TimePicker from "../TimePicker/TimePicker";
import DataFormation from "../DataFomation/DataFormation";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectFolder() {
  const [selectedDirectory, setSelectedDirectory] = useState([]);
  const [targetFiles, setTargetFiles] = useState([]);
  const [personName, setPersonName] = React.useState([]);
  const [fromHours, setFromHours] = useState("00");
  const [fromMinutes, setFromMinutes] = useState("00");
  const [fromseconds, setFromSeconds] = useState("00");
  const [toHours, setToHours] = useState("00");
  const [toMinutes, setToMinutes] = useState("00");
  const [toSeconds, setToSeconds] = useState("00");
  const [showresults, setShowresults] = useState(false);
  const [showerror, setShowerror] = useState("");
  const [fileContent, setFileContent] = useState([]);

  const handleDirectoryChange = (event) => {
    setTargetFiles(event.target.files);
    const files = Array.from(event.target.files).map((file) => ({
      name: file.name,
      checked: false,
    }));
    setSelectedDirectory(files);
  };

  const handleChange = (event) => {
   
    const {
      target: { value },
    } = event;
    if (value.includes("All")) {
      // If 'All' is selected, either select or deselect all options
      setPersonName(
        personName.length === selectedDirectory.length ? [] : selectedDirectory
      );
    } else {
      setPersonName(typeof value === "string" ? value.split(",") : value);
    }
    // console.log("personName",personName);
  };
  const handleSubmit = async () => {
    const tempFileContents = [];
    if (
      fromHours === "00" ||
      fromMinutes === "00" ||
      toHours === "00" ||
      toMinutes === "00" ||
      selectedDirectory == []
    ) {
      setShowresults(false);
      setShowerror("Please select time");
    } else {
    
        await getData(personName);
      
      setShowerror(" ");
      setShowresults(true);
    }
  };

  const getData = async (personName) => {
    console.log("personName", personName);
    const tempFileContents = [];
    if (personName.length) {
      const selectedFileObj = Array.from(targetFiles).filter((file) => {
        if (personName.includes(file.name)) {
          return file;
        } else if (personName.includes("All")) {
          return targetFiles;
        } else {
          return null;
        }
      });
   
      for(const file of selectedFileObj){
        try{
          const text = await readFileAsText(file);
          tempFileContents.push(JSON.parse(text));
          
        }
        catch(e){
          console.error('Error readig file',file.name,e);
        }
        
      }
      setFileContent((prevContent) => [...prevContent,...tempFileContents]);
    }
  }
 
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsText(file);
    });
  }

  const isAllSelected = personName.length === selectedDirectory.length;
  return (
    <div className="mainDiv">
      <input
        className="directory-input"
        type="file"
        accept=".json"
        webkitdirectory="true"
        onChange={handleDirectoryChange}
      />
      <FormControl sx={{ m: 1, width: 300 }}>
        <div style={{ width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">
            Select files
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            style={{ width: 300 }}
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Select Files" />}
            renderValue={(selected) =>
              isAllSelected ? "All" : selected.join(", ")
            }
            MenuProps={MenuProps}
            disabled={selectedDirectory.length === 0}
          >
            <MenuItem value="All">
              <Checkbox
                checked={isAllSelected}
                indeterminate={personName.length > 0 && !isAllSelected}
              />
              <ListItemText primary="All" />
            </MenuItem>
            {selectedDirectory.map((file) => (
              <MenuItem key={file.name} value={file.name}>
                <Checkbox
                  checked={
                    isAllSelected
                      ? personName.every((item) => true)
                      : personName.indexOf(file.name) > -1
                  }
                />
             
                <ListItemText primary={file.name} />
              </MenuItem>
            ))}
          </Select>
        </div>
      </FormControl>
      <h3>Choose Time </h3>
      <div className="time-input-group">
        <TimePicker
          hours={fromHours}
          minutes={fromMinutes}
          seconds={fromseconds}
          label={"From:"}
          setHours={setFromHours}
          setMinutes={setFromMinutes}
          setSeconds={setFromSeconds}
        />
        <TimePicker
          hours={toHours}
          minutes={toMinutes}
          seconds={toSeconds}
          label={"To:"}
          setHours={setToHours}
          setMinutes={setToMinutes}
          setSeconds={setToSeconds}
        />
      </div>
      &nbsp;&nbsp;&nbsp;
      <div>
        <Button type="submit" variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      &nbsp;&nbsp;&nbsp;
      {showerror && <div style={{ color: "red" }}>{showerror}</div>}
      &nbsp;&nbsp;&nbsp;
      {showresults && (
        <div>
          <h3>Results</h3>
          <DataFormation 
          fileContent={fileContent} 
          tohours={toHours}
          tominutes={toMinutes}
          toseconds={toSeconds}
          fromhours={fromHours}
          fromminutes={fromMinutes}
          fromseconds={fromseconds}
          />
        </div>
      )}
    </div>
  );
}
