import { makeStyles, Paper } from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";


export function SudokuGrid({ mat, solved, running, fixedBoxes }) {
    const [a, setA] = useState([]);
    // console.log(fixedBoxes);
    useEffect(() => {
        const filtered = fixedBoxes.map((item) => (item[0]*10 + item[1]))
        // console.log(filtered);
        setA(filtered);
    }, [fixedBoxes])
    const useStyles = makeStyles({
    box: {
        border: "1px solid lightgrey",
        width: "50px",
        height: "46px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "darkbrown",
            fontSize: "19px",
        fontWeight:"499",
            backgroundColor: solved ? "#61ff41" : running ? "rgb(247, 254, 255)" : null,        
    },
    eachRow: {
        display: "flex"
    }
});
    const classes = useStyles();
    const Div = styled.div`
    display: flex;
    flex-direction: column;
    width: 450px;
        margin: 19px;
        `
    return (
        <div>
            <Div>
                {mat.map((row, i) => (
                    <div style={{display:"flex"}} key={i} className={classes.eachRow}>
                        {row.map((col, j) => (
                            <Paper key={j * 10} style={{backgroundColor:(a.includes((i*10) + j)? "rgb(73, 238, 95)":null),borderBottom:(i===2||i===5)?"0.15rem solid grey":null, borderRight:(j===2||j===5)?"0.15rem solid grey":null}} elevation={3} className={classes.box}>{col !== 0? col:null}</Paper>
                        ))}
                    </div>
                ))}
            </Div>
        </div>
    )
}