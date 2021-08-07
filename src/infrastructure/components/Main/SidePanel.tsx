import React, { useState } from "react";

import Search from "./SearchComponent";
import CustomSlider from "./CustomSlider";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

interface IProps {
    center: tt.LngLat,
    handleSearch: (categorySet: string[], radius: number) => void
}

const SidePanel = (props: IProps) => {
    const { center, handleSearch } = props;
    const [categorySet, setCategorySet] = useState<string[]>([]);
    const [ radius, setRadius ] = useState<number>(1000)

    const isSelected = (type: string) => categorySet.indexOf(type) >= 0;
    
    const handleSelection = (type: string) => {
console.log("handleSelection")
        const idx = categorySet.indexOf(type);
        if (type === "9362") { // 9362 9927 9927003
            if (idx >= 0)
                categorySet.splice(idx, 3);
            else 
                categorySet.push(...["9362", "9927", "9927003"])
        } else { // 9379004 or 7315
            if (idx >= 0) 
                categorySet.splice(idx, 1);
            else 
                categorySet.push(type)
        }
        setCategorySet([...categorySet])
    }

    return (
        <Card style={{padding: "1rem"}}>
            <Search center={center} radius={radius}/>
            <Button onClick={() => handleSelection("7315")} 
                variant="outlined"
                color={`${isSelected("7315") ? "primary" : "default"}`}>
                    Restaurantes
            </Button>
            <Button onClick={() => handleSelection("9362")} 
                variant="outlined"
                color={`${isSelected("9362") ? "primary" : "default"}`}>
                    Parques y sitios al aire libre
            </Button>
            <Button onClick={() => handleSelection("9379004")} 
                variant="outlined"
                color={`${isSelected("9379004") ? "primary" : "default"}`}>
                    Bares
            </Button>
            {radius < 1000 &&
                <Typography id="radiusId">Distancia desde aquí ({Math.round(radius)}m)</Typography>
            }
            {radius >= 1000 &&
                <Typography id="radiusId">Distancia desde aquí ({Math.round(radius / 100) / 10}km)</Typography>
            }
            <CustomSlider
                value={radius} 
                min={100} 
                max={10000}
                onChange={(ev, val) => setRadius((val as number) < 100 ? 100 : (val as number))}
                aria-labelledby="radiusId"></CustomSlider>
            <Divider></Divider>
            <Button onClick={() => handleSearch(categorySet, radius)}>
                Buscar
            </Button>
        </Card>
    )
}

export default SidePanel;