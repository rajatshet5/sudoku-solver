import {Box, Button, Slider, Typography } from '@material-ui/core';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { SudokuGrid } from './Grid';
import { makeStyles } from "@material-ui/core";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { Snackbar } from "@material-ui/core";
import styles from "./sudokuSolver.module.css";
// import { Alert } from "@material-ui/core";




export function SudokuSolver() {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [fixedBoxes, setFixedBoxes] = useState([]);
  const [changed, setChanged] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
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
    inpRef.current.value =
       `605900003\n200003000\n013008670\n398000465\n000380090\n000000030\n702000046\n460507000\n000006709`;
  }, []);
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
    setInvalidInput(false);
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
      let invInp = false;
      setRunning(false);
      for (let e = 0; e < 9; e++) {
        if (invInp) {
          break;
        }
        for (let g = 0; g < 9; g++) {
          if (mat[e][g] == 0) {
            invInp = true;
            break;
          }
        }
      }
      if (invInp) {
        setInvalidInput(true);
        setAlertMsg("Invalid Sudoku Input");
        setOpen(true);
      } else {
        setSolved(true);
      }
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
      margin: "10px 0px"
    }
  })
  const classes = useStyles();
  const handleChange = (e, newValue) => {
    // console.log(newValue);
    speed.current = (newValue * 15);
  }
  const loadEasy = () => {
    setInvalidInput(false);
    setSolved(false);
    setMat(toMat(inpArr[1]))
    setChanged(!changed);
  }
  const loadMedium = () => {
    setInvalidInput(false);
    setSolved(false);
    setMat(toMat(inpArr[2]))
    setChanged(!changed);
  }
  const loadDifficult = () => {
    setInvalidInput(false);
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
    setInvalidInput(false);
    let invalid = false;
    const data = inpRef.current.value;
    let newData = data.split("\n").map(function(rows) {
      return rows.trim().split("").map(Number);
    });
    // console.log(data, newData);
    if (newData.length !== 9) {
      invalid = true;
      setAlertMsg("Invalid Input: More than 9 rows present");
      setOpen(true);
      // alert("Invalid Input: More than 9 rows present");
    } else {
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].length !== 9) {
          invalid = true;
          setAlertMsg("Invalid Input: More than 9 columns present");
          setOpen(true);
          // alert("Invalid Input: More than 9 columns present");
          break;
        }
      }
      if (!invalid) {
        for (let i = 0; i < newData.length; i++) {
          for (let j = 0; j < 9; j++) {
            if (!(newData[i][j] <= 9 && newData[i][j] >= 0)) {
              invalid = true;
              setAlertMsg("Invalid Input: Each box should contain a number between 0 and 9");
              setOpen(true);
              // alert("Invalid Inuput: Each box should contain a number between 0 and 9");
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
            // console.log(newData, freq, key);
            setAlertMsg("Invalid Input: Duplicates Found (in one or more rows)");
            setOpen(true);
            // alert("Invalid Input: Duplicates Found (in one or more rows)");
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
            // console.log(newData, freq, key);
            invalid = true;
            setAlertMsg("Invalid Input: Duplicates Found (in one or more columns)");
            setOpen(true);
            // alert("Invalid Input: Duplicates Found (in one or more columns)");
            break;
          }
        }
      }
    }
    if (!invalid) {
      for (let i = 0; i <= 7; i += 3) {
        if (invalid) {
          break;
        }
        for (let j = 0; j <= 7; j += 3) {
          let freq = {};
          if (invalid) {
            break;
          }
          for (let k = i; k < i + 3; k++) {
            if (invalid) {
              break;
            }
            for (let l = j; l < j + 3; l++) {
              if (freq[newData[k][l]] === undefined) {
                freq[newData[k][l]] = 1;
              } else {
                freq[newData[k][l]]++;
              }
            }
          }
          for (let key in freq) {
          if (freq[key] > 1 && key !== "0") {
            // console.log(newData, freq, key);
            invalid = true;
            setAlertMsg("Invalid Input: Duplicates Found (in one or more 3 x 3 Grids)");
            setOpen(true);
            // alert("Invalid Input: Duplicates Found (in one or more 3 x 3 Grids)");
            break;
          }
        }
        }
      }
    }

    if (!invalid) {
      // console.log(newData);
      setMat(newData);
      setChanged(!changed);
      setSolved(false);
    }
  }
  // const handleConstraints = (e) => {
  //   // console.log(inpRef.current.value.length);
  // }
  // const handleClick = () => {
  //   setOpen(true);
  // };
  const handleClose = () => {
    setOpen(false);
  };
  return <>
    <Typography style={{ margin: "13px", textAlign: "center", backgroundColor: "cream" }} variant="h4"><p className={styles.title} >Sudoku Solver</p></Typography>
    <Box className={styles.container}>
    <Box className={styles.gridContainer}>
        <SudokuGrid fixedBoxes={fixedBoxes} running={running} invalidInput={invalidInput} solved={solved} mat={mat} />
          {running ? <p style={{height:"13px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"3px", width:"30px", fontSize:"11px", marginLeft:"19px", cursor:"pointer", padding:"3px", backgroundColor:"#da0700", color:"white"}} onClick={() => window.location.href = "/"}>Stop</p> : null}
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
          <div className={styles.speedInfoDiv} >
            <p className={styles.speedInfo} >Speed: Max</p>
            <p className={styles.speedInfo} >Speed: Min</p>
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
          <div>
            {/* <Button variant="outlined" onClick={handleClick}>
            Open success snackbar
          </Button> */}
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={open}
            autoHideDuration={5800}
            onClose={handleClose}
              message={alertMsg}
          />
          </div>
          <p className={styles.inpTitle}>Manual Input</p>
          <textarea className={styles.inpBox} ref={inpRef} style={{width:"150px", marginTop:0, height:"250px", fontSize:"23px"}}>

          </textarea>
          <Button disabled={running} style={{margin:"5px 30px", marginBottom:"39px", color:"white"}} variant="contained" color="primary" onClick={handleManualInput}>Load</Button>
        </div>
      </Box>
    </Box>
    </>
}