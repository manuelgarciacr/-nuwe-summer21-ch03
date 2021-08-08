import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            padding: 0,
        },
        appBar: {
            
        },
        mapContainer: {
            display: "flex",
            height: "100vh"
        },
        panel: {
            flex: 1,
            flexDirection: "column",
            gap: 5,
            padding: 10,
            paddingTop: 42,
            height: "100vh",
            overflowY: "auto"
        },
        search:{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            paddingTop: 10,
            "& .combo .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-outlined.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                "transform": `translate(14px, -10px) scale(0.75)`
            },
            "& .guidance-panel": {
                backgroundColor: theme.palette.background.paper,
                "& .tt-results-list__item > div": {
                    "&:hover": {
                        backgroundColor: "gray"
                    },
                    "& .distance-wrapper": {
                        color: "silver"
                    }
                },
                "& .instruction": {
                    backgroundColor: "gray",
                    "&:hover": {
                        backgroundColor: "lightgray",
                        color: "black",
                        "& .distance-wrapper": {
                            color: "gray"
                        }
                    }
                }
            },
             "& .combo": {
            }
        },
        map: {
            flex: 2,
            paddingTop: 32
        },
        separator: {
            borderWidth: 1,
            borderStyle: "solid",
            width: "100%",
            opacity: 0.3,
            borderColor: theme.palette.primary.main,
            marginTop: theme.spacing(2),
        },
        loadingError: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
        },
        selected: {
            color: theme.palette.primary.main
        },
        customControl: {
            position: "absolute",
            backgroundColor: "white",
            zIndex: 2,
            border: "1px solid gray",
            right: 8,
            top: 220,
            minWidth: 32,
            width: 32,
            height: 32,
            padding: 0,
            "& :hover": {
                backgroundColor: "#F0F0F0",
            }
        }
    })
);

export default useStyles;
