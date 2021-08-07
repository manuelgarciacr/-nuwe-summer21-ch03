import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import tt from "@tomtom-international/web-sdk-maps";
import axios from "axios";
import React, { useState } from "react";

interface IProps {
    center: tt.LngLat,
    radius: number
}

const Search = (props: IProps) => {
    const { center, radius} = props;
    const { lat, lng } = center
    const baseUrl = 'https://api.tomtom.com/search/2/poiSearch';
    // [ Restaurantes, ...[ Parques y sitios al aire libre], Bares ]
    const categprySet = ["7315", ...["9362", "9927", "9927003"], "9379004"].join(",");
    const queryString = `&limit=100&lat=${lat}&lon=${lng}&radius=${radius}&language=es-ES&categorySet=${categprySet}&key=${process.env.REACT_APP_NUWE2103_API_KEY || ""}`;
    const [options, setOptions] = useState<any[]>([])
    const [value, setValue] = useState("")

    const onSearchChange = async (query: string) => {
console.log("OICH", query)
        setValue(query);
        if (query.length < 2) {
            setOptions([]);
            return
        }
        // https://api.tomtom.com/search/2/poiSearch/pizza.json?limit=100&lat=37.337&lon=-121.89&radius=1000&key=*****
        const response = await axios.get(`${baseUrl}/${query}.json?${queryString}`);
console.log("OICH", response.data.results.length)
        setOptions(response.data.results)
    }

    return (
        <Autocomplete
            id="combo-box-search"
            noOptionsText={value.length < 2 ? "Mínimo dos caracteres" : "Sin coincidencias"}
            options={options}
            onChange={(ev, val) => console.log("OCH", val)}
            onInputChange={(ev, val) => onSearchChange(val)}
            getOptionLabel={option => option.poi.name}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
        />

    )
}

export default Search;