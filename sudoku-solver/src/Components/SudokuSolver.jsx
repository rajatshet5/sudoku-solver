import {Box, Button, Slider, Typography } from '@material-ui/core';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { SudokuGrid } from './Grid';
import { makeStyles } from "@material-ui/core";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';


export function SudokuSolver() {
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [fixedBoxes, setFixedBoxes] = useState([]);
  const [changed, setChanged] = useState(false);
  const speed = useRef(0);
  // console.log("rerendered")
  const delay = (t) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve();
          }, t);
      });
  }
  useEffect(() => {
    handleFixedBoxes();
  }, [changed])

  const inpArr = [
    `0 0 8 4 0 0 0 0 3
    0 0 0 9 1 0 6 0 0
    1 0 7 6 0 3 2 0 0
    0 1 9 0 6 0 0 0 0
    7 0 4 0 9 0 0 6 0
    0 0 0 1 0 0 0 7 0
    4 0 0 2 0 0 0 0 1
    0 5 0 0 4 0 0 2 0
    0 0 0 0 0 0 3 0 5`,
    `0 0 0 4 0 0 0 0 9
    0 3 8 0 0 6 7 0 0
    9 5 0 0 0 0 6 0 2
    2 1 3 0 9 5 0 7 6
    0 0 0 2 0 0 0 5 3
    7 9 0 3 6 4 0 8 1
    0 0 0 0 8 9 0 0 7
    0 2 9 7 4 0 0 0 0
    8 0 0 0 0 0 3 0 0`,
    `0 4 0 0 0 0 1 7 9
  0 0 2 0 0 8 0 5 4 
  0 0 6 0 0 5 0 0 8 
  0 8 0 0 7 0 9 1 0 
  0 5 0 0 9 0 0 3 0 
  0 1 9 0 6 0 0 4 0 
  3 0 0 4 0 0 7 0 0 
  5 7 0 1 0 0 2 0 0 
  9 2 8 0 0 0 0 6 0`
  ]
  // const inp =
  // `0 4 0 0 0 0 1 7 9
  // 0 0 2 0 0 8 0 5 4 
  // 0 0 6 0 0 5 0 0 8 
  // 0 8 0 0 7 0 9 1 0 
  // 0 5 0 0 9 0 0 3 0 
  // 0 1 9 0 6 0 0 4 0 
  // 3 0 0 4 0 0 7 0 0 
  // 5 7 0 1 0 0 2 0 0 
  // 9 2 8 0 0 0 0 6 0`;
  const toMat = (a) => {
    let matB = a.split("\n").map(function(rows) {
    return rows.trim().split(" ").map(Number);
    });
    return matB;
  }
  const [mat, setMat] = useState(toMat(inpArr[2]));
  useEffect(() => {
    // toMat();
  }, []);
  function solve(mat) {
    if (running) {
      return;
    }
    setSolved(false);
    var found = false;
    for (var i = 0; i < 9; i++) {
      if (found) {
        break;
      }
      for (var j = 0; j < 9; j++) {
        if (mat[i][j] === 0) {
          found = true;
          i--;
          break;
        }
      }
    }
    guess(i, j).then(() => {
      setRunning(false);
      console.log("success", mat);
      setSolved(true);
    })
  }
  
  function presentInRow(n, i, j) {
    for(var e = 0; e < 9; e++) {
      if(mat[i][e] === n) {
        return true;
      }
    }
    return false;
  } 
  
  function presentInCol(n, i, j) {
    for(var e = 0; e < 9; e++) {
      if(mat[e][j] === n) {
        return true;
      }
    }
    return false;
  }
  
  function presentInGrid(n, i, j) {
    var rowG, colG;
    if(i < 3) {
      rowG = 0;
    } else if(i >= 6) {
      rowG = 6;
    } else {
      rowG = 3;
    }
    if(j < 3) {
      colG = 0;
    } else if(j >= 6) {
      colG = 6;
    } else {
      colG = 3;
    }
    for(var e1 = rowG; e1 < rowG + 3; e1++) {
      for(var e2 = colG; e2 < colG + 3; e2++) {
        if(mat[e1][e2] === n) {
          return true;
        }
      }
    }
    return false;
  }
        
  async function guess(i, j) {
    if (!running) {
      setRunning(true);
    }
    // console.log("recs")
    for (var n = 1; n <= 9; n++) {
      if (!presentInRow(n, i, j) && !(presentInCol(n, i, j)) && !(presentInGrid(n, i, j))) {
        // console.log("current speed", speed.current)
        await delay(speed.current);
        mat[i][j] = n;
        setMat([...mat]);
        var newI = i;
        var newJ = j;
        if (i === 8 && j === 8) {
          // console.log("lrlc")
          return true;
        }
        while (mat[newI][newJ] != 0) {
          if (newJ === 8) {
            newI = newI + 1;
            newJ = 0;
            if (newI === 9 && newJ === 0) {
              // console.log("ano")
              return true;
            }
          } else {
            newJ = newJ + 1;
          }
        }
        var temp = await guess(newI, newJ);
        if (temp) {
          return true;
        } else {
          // console.log("current speed", speed.current)
          await delay(speed.current)
          mat[i][j] = 0;
          setMat([...mat]);
        }
      }
    }
    return false;
  }
  const useStyles = makeStyles({
    speedSlider: {
      width:"70%"
    },
    container: {
      display: "flex",
      justifyContent: "space-around",
    },
    // gridContainer: {
    //   display: "flex",
    //   alignItems: "center",
    // },
    customize: {
      margin: "130px 0px"
    }
  })
  const classes = useStyles();
  const handleChange = (e, newValue) => {
    // console.log(newValue);
    speed.current = (newValue * 15);
  }
  const loadEasy = () => {
    setSolved(false);
    setMat(toMat(inpArr[1]))
    setChanged(!changed);
  }
  const loadMedium = () => {
    setSolved(false);
    setMat(toMat(inpArr[2]))
    setChanged(!changed);
  }
  const loadDifficult = () => {
    setSolved(false);
    setMat(toMat(inpArr[0]))
    setChanged(!changed);
  }
  const handleFixedBoxes = () => {
    const fixedPos = [];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (mat[i][j] !== 0) {
          fixedPos.push([i, j]);
        }
      }
    }
    setFixedBoxes(fixedPos);
  }
  const inpRef = useRef();
  const handleManualInput = () => {
    let invalid = false;
    const data = inpRef.current.value;
    let newData = data.split("\n").map(function(rows) {
      return rows.trim().split("").map(Number);
    });
    console.log(data, newData);
    if (newData.length !== 9) {
      invalid = true;
      alert("Invalid Input: Length of one (or more) of the rows is not equal to 9");
    } else {
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].length !== 9) {
          invalid = true;
          alert("Invalid Input: Length of one (or more) of the columns is not equal to 9");
          break;
        }
      }
      if (!invalid) {
        for (let i = 0; i < newData.length; i++) {
          for (let j = 0; j < 9; j++) {
            if (!(newData[i][j] <= 9 && newData[i][j] >= 0)) {
              invalid = true;
              alert("Invalid Inuput: Each box should contain a number between 0 and 9");
              break;
            }
          }
        }
      }
    }
    if (!invalid) {
      for (let i = 0; i < 9; i++) {
        let freq = {};
        if (invalid) {
          break;
        }
        for (let j = 0; j < 9; j++) {
          if (freq[newData[i][j]] === undefined) {
            freq[newData[i][j]] = 1;
          } else {
            freq[newData[i][j]]++;
          }
        }
        for (let key in freq) {
          if (freq[key] > 1 && key !== "0") {
            invalid = true;
            console.log(newData, freq, key);
            alert("Invalid Input: Duplicates Found (in one or more rows)");
            break;
          }
        }
      }
    }
    if (!invalid) {
      for (let i = 0; i < 9; i++) {
        let freq = {}
        if (invalid) {
          break;
        }
        for (let j = 0; j < 9; j++) {
          if (freq[newData[j][i]] === undefined) {
            freq[newData[j][i]] = 1;
          } else {
            freq[newData[j][i]]++;
          }
        }
        for (let key in freq) {
          if (freq[key] > 1 && key !== "0") {
            console.log(newData, freq, key);
            invalid = true;
            alert("Invalid Input: Duplicates Found (in one or more columns)");
            break;
          }
        }
      }
    }

    if (!invalid) {
      // console.log(newData);
      setMat(newData);
      setChanged(!changed);
    }
  }
  const handleConstraints = (e) => {
    console.log(inpRef.current.value.length);

  }
  return <>
    <Typography style={{ margin: "13px", textAlign: "center", backgroundColor: "cream" }} variant="h4"><p style={{margin:"0px auto", padding:"8px", borderBottom:"1px solid lightgrey", width:"590px" }}>Sudoku Solver</p></Typography>
    <Box className={classes.container}>
    <Box className={classes.gridContainer}>
        <SudokuGrid fixedBoxes={fixedBoxes} running={running} solved={solved} mat={mat} />
          {/* {running ? <p style={{height:"29px", fontSize:"15px", margin:"0px", cursor:"pointer"}} onClick={() => window.location.href = "/"}>Stop</p> : null} */}
    </Box>
    <Box className={classes.customize}>
    {/* <h1>{speed.current}</h1> */}
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-evenly"}}>
          <div style={{ display: "flex", justifyContent:"flex-end", alignItems:"center" }}><p style={{color:"lightmaroon", fontSize:"13px",padding:"8px 0px", borderRadius:"5px"}}>Set Delay</p><DoubleArrowIcon/></div>
        <Slider
        // track="inverted"
      className={classes.speedSlider}
      aria-label="custom thumb label"
      defaultValue={23}
      onChange={handleChange}
          />
          </div>
          <div style={{marginLeft:"110px",display:"flex",justifyContent:"space-between", width:"460px"}}>
            <p style={{marginTop:"0px", marginBottom:"59px", fontSize:"10px", color:"grey"}}>Speed: Max</p>
            <p style={{marginTop:"0px", marginBottom:"59px", fontSize:"10px", color:"grey"}}>Speed: Min</p>
        </div>
        <div style={{width:"100%", textDecoration:"none",display:"flex", justifyContent:"space-evenly"}}>
        <Button disabled={running} style={{fontSize:"13px", textTransform:"none"}} variant="outlined" color="primary" onClick={loadEasy}>Load Sudoku: Easy</Button>
        <Button disabled={running} style={{fontSize:"13px", textTransform:"none"}} variant="outlined" color="primary" onClick={loadMedium}>Load Sudoku: Medium</Button>
          <Button disabled={running} style={{fontSize:"13px", textTransform:"none"}} variant="outlined" color="primary" onClick={loadDifficult}>Load Sudoku: Difficult</Button>
        </div>
        <div style={{margin:"32px auto", flexDirection:"column",width:"180px"}}>
          <Button disabled={running || solved} style={{ width: "180px" }} variant="contained" color="primary" onClick={() => solve(mat)}>Solve</Button>
          </div>
        <div>
          <textarea onChange={ handleConstraints } rows={10} cols={10} ref={inpRef} style={{width:"280px", height:"250px", fontSize:"23px"}}>

          </textarea>
          <Button onClick={handleManualInput}>Load</Button>
        </div>
      </Box>
    </Box>
    </>
}