import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            padding: 0,
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
            right: 48,
            top: 240,
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
