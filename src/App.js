import React, { useState } from 'react';
import './App.css'; // You can create this CSS file for styling

function App() {
  const [numColumns, setNumColumns] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [uploadedNames, setUploadedNames] = useState([]);
  const [usedNames, setUsedNames] = useState([]);
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentColIndex, setCurrentColIndex] = useState(0);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (numColumns > 0) {
      const initialTable = generateInitialTable();
      setTableData(initialTable);
    } else {
      alert('Please enter a valid number of columns (greater than zero).');
    }
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value);
    setNumColumns(value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      const namesArray = contents.split(/\r?\n|\s/).filter(name => name.trim() !== '');
      setUploadedNames(namesArray);
    };

    reader.readAsText(file);
  };

  const handleNameClick = (name, index) => {
    const updatedTableData = [...tableData];

    // Determine the row based on currentRowIndex and currentColIndex
    let rowIndex, colIndex;
    if (currentRowIndex % 6 === 2 || currentRowIndex % 6 === 4) {
      rowIndex = currentRowIndex; // Rows 3, 5 - Right to left
      colIndex = numColumns - 1 - currentColIndex; // Place from highest to lowest index
    } else {
      rowIndex = currentRowIndex; // Rows 1, 2, 4, 6 - Left to right
      colIndex = currentColIndex; // Place from lowest to highest index
    }

    updatedTableData[rowIndex][colIndex] = name;
    setTableData(updatedTableData);

    const updatedUsedNames = [...usedNames];
    updatedUsedNames.push(name);
    setUsedNames(updatedUsedNames);

    // Determine the next cell indices in snaking order
    if (currentRowIndex % 6 === 0 || currentRowIndex % 6 === 1 || currentRowIndex % 6 === 3 || currentRowIndex % 6 === 5) {
      // Left to right
      if (currentColIndex === numColumns - 1) {
        setCurrentRowIndex(currentRowIndex + 1);
        setCurrentColIndex(0); // Start at column 0 for the next row
      } else {
        setCurrentColIndex(currentColIndex + 1);
      }
    } else {
      // Right to left
      if (currentColIndex === numColumns - 1) {
        setCurrentRowIndex(currentRowIndex + 1);
        setCurrentColIndex(0); // Start at the last column for the next row
      } else {
        setCurrentColIndex(currentColIndex + 1);
      }
    }
    if (isTableFullyFilled()) {
      disableAllButtons();
    }
  };
  
  const isTableFullyFilled = () => {
    for (let i = 0; i < tableData.length; i++) {
      for (let j = 0; j < tableData[i].length; j++) {
        if (tableData[i][j] === '') {
          return false;
        }
      }
    }
    return true;
  };
  
  const disableAllButtons = () => {
    const buttons = document.querySelectorAll('.name-buttons button');
    buttons.forEach(button => {
      button.disabled = true;
    });
  };

  const generateInitialTable = () => {
    const initialTable = [];
    for (let i = 0; i < 6; i++) { // Changed to 6 rows
      initialTable.push(Array.from({ length: numColumns }, () => ''));
    }
    return initialTable;
  };

  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            {Array.from({ length: numColumns }, (_, index) => (
              <th key={index}>Team {index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="App">
      <div id = "title">SPL Mock Draft Creator</div>
      <div className="upload-container">
        <h2>Upload Players .txt File</h2>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
        />
        <h2></h2>
      </div>

      <form onSubmit={handleFormSubmit}>
        <label htmlFor="numColumns">Number of Teams: </label>
        <input
          type="number"
          id="numColumns"
          name="numColumns"
          value={numColumns}
          onChange={handleInputChange}
          min="1"
          required
        />
        <button type="submit">Create Draft Grid</button>
      </form>

      <div>
        {renderTable()}

        <div className="name-buttons">
          <h2>Draftable Players</h2>
          <div className="name-grid">
            {uploadedNames.map((name, index) => (
              !usedNames.includes(name) && (
                <button key={index} onClick={() => handleNameClick(name, index)} disabled={usedNames.includes(name)}>
                  {name}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
