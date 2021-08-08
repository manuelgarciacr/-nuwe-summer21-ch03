import React, { useEffect, useState } from "react";

import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import tt from "@tomtom-international/web-sdk-maps";

interface IProps {
    center: tt.LngLat,
    radius: number,
    nearbyState: "idle" | "searching" | "success",
    handleAutocompleteState: (value: any, autocompleteState: "idle" | "searching" | "success") => void
}

const Search = (props: IProps) => {
    const { center, radius, nearbyState, handleAutocompleteState} = props;
    const { lat, lng } = center
    const baseUrl = 'https://api.tomtom.com/search/2/poiSearch';
    // [ Restaurantes, ...[ Parques y sitios al aire libre], Bares ]
    const categprySet = ["7315", ...["9362", "9927", "9927003"], "9379004"].join(",");
    const queryString = `limit=100&lat=${lat}&lon=${lng}&radius=${radius}&language=es-ES&categorySet=${categprySet}&key=${process.env.REACT_APP_NUWE2103_API_KEY || ""}`;
    const [options, setOptions] = useState<any[]>([])
    const [inputValue, setInputValue] = useState("")
    const [state, setState] = useState<"idle" | "searching" | "success">("idle")

    const onInputChange = async (query: string) => {
        setInputValue(query);
        
        if (state !== "searching" && query.length){
            setState("searching");
            handleAutocompleteState(null, "searching")
        }

        if (query.length < 2) {
            setOptions([]);
            return
        }

        const response = await axios.get(`${baseUrl}/${query}.json?${queryString}`);
        setOptions(response.data.results)
    }

    useEffect(() => {
        if (nearbyState !== "idle") {
            setState("idle");
            setInputValue("")
        }
    }, [nearbyState])

    return (
        <Autocomplete
            className="combo"
            id="combo-box-search"
            noOptionsText={inputValue.length < 2 ? "Mínimo dos caracteres" : "Sin coincidencias"}
            options={options.sort((a, b) => -(b.poi.categories[0]+b.poi.name).localeCompare(a.poi.categories[0]+a.poi.name))}
            onChange={(ev, val) => handleAutocompleteState(val, "success")}
            getOptionSelected={(option, value) => option.id === value.id}
            inputValue={inputValue}
            onInputChange={(ev, val) => onInputChange(val)}
            groupBy={(option) => option.poi.categories[0]}
            getOptionLabel={option => option.poi.name + ". " + option.address?.freeformAddress }
            renderInput={(params) => <TextField {...params} label="Buscar lugar" variant="outlined" />}
        />

    )
}

export default Search;