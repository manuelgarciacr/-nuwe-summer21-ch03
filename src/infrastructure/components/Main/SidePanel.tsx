import React, { useState } from "react";

import Search from "./SearchComponent";
import CustomSlider from "./CustomSlider";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import useStyles from "./styles";

interface IProps {
    center: tt.LngLat,
    handleState: (value: any, categorySet: string, radius: number, status: "idle" | "searching" | "success") => void
}

const SidePanel = (props: IProps) => {
    const { center, handleState } = props;
    const classes = useStyles();
    const [ categoryCode, setCategoryCode ] = useState(0);
    const [ radius, setRadius ] = useState<number>(3000)
    const [ state, setState ] = useState<"idle" | "searching" | "success">("idle")

    const isSelected = (code: number) => (categoryCode & code) === code;
    
    const handleCategorySet = () => {
        const categorySet = [];
        if (isSelected(1))
            categorySet.push("7315");
        if (isSelected(2))
            categorySet.push(...["9362", "9927", "9927003"]);
        if (isSelected(4))
            categorySet.push("9379004");
        return categorySet.join();
    }

    const handleSelection = (code: number) => {
        let newCategoryCode = categoryCode;
        if (isSelected(code))
            newCategoryCode -= code;
        else
            newCategoryCode += code;
        setCategoryCode(newCategoryCode);

        if (state !== "searching" && newCategoryCode)
            setState("searching");
    }

    const handleAutocompleteState = (value: any, autocompleteState: "idle" | "searching" | "success") => {
        if (autocompleteState !== "idle") {
            setState("idle");
            setCategoryCode(0);
            handleState(value, "", radius, autocompleteState)
        }
    }

    return (
        <Card className={classes.search}>
            <Divider></Divider>
            <Search center={center} radius={radius} nearbyState={state} handleAutocompleteState={handleAutocompleteState}/>

            <Divider style={{margin: 16, height: 2, backgroundColor: "white"}}></Divider>
            
            <Typography style={{marginBottom: 10}}>Lugares más cercanos:</Typography>
            
            <Button onClick={() => handleSelection(1)} 
                variant="outlined"
                color={`${isSelected(1) ? "primary" : "default"}`}>
                    Restaurantes
            </Button>
            <Button onClick={() => handleSelection(2)} 
                variant="outlined"
                color={`${isSelected(2) ? "primary" : "default"}`}>
                    Parques y sitios al aire libre
            </Button>
            <Button onClick={() => handleSelection(4)} 
                variant="outlined"
                color={`${isSelected(4) ? "primary" : "default"}`}>
                    Bares
            </Button>

            <Divider style={{margin: 16, height: 2, backgroundColor: "white"}}></Divider>
            
            {Math.round(radius) < 1000 &&
                <Typography style={{marginBottom: 10}} id="radiusId">Distancia desde aquí ({Math.round(radius)}m)</Typography>
            }
            {Math.round(radius) >= 1000 &&
                <Typography style={{marginBottom: 10}} id="radiusId">Distancia desde aquí ({Math.round(radius / 100) / 10}km)</Typography>
            }

            <div style={{padding: "0 20px"}}>
                <CustomSlider
                    value={radius >= 1000 ? 0 : radius} 
                    min={100} 
                    max={999}
                    valueLabelDisplay="auto"
                    valueLabelFormat={val => val + "m"}
                    onChange={(ev, val) => setRadius((val as number) < 100 ? 100 : (val as number))}
                    aria-labelledby="radiusId"></CustomSlider>
            </div>
            <div style={{padding: "0 20px"}}>
                <CustomSlider
                    value={radius < 1000 ? 0 : radius} 
                    min={999} 
                    max={10000}
                    step={100}
                    valueLabelDisplay="auto"
                    valueLabelFormat={val => Math.round(val / 100) / 10 + "km"}
                    onChange={(ev, val) => setRadius((val as number))}
                    aria-labelledby="radiusId"></CustomSlider>
            </div>
            <Divider></Divider>
            <Button style={{border: "1px solid white"}} onClick={() => handleState(null, handleCategorySet(), radius, state)}>
                Buscar
            </Button>
            <div className='tt-results-list js-results'></div>
            <div className='js-results-loader' hidden={true}>
                <div className='loader-center'><span className='loader'></span></div>
            </div>
            <div className='tt-tabs__placeholder js-results-placeholder -small'>
                To get instructions, please choose starting and destination points.
            </div>
        </Card>
    )
}

export default SidePanel;