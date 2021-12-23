import { useState } from "react";
import {
    Button,
    FormControlLabel, Checkbox, RadioGroup, Radio
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from "react";
import { ToggleButton } from "@material-ui/lab";
import CheckIcon from '@material-ui/icons/Check';
import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import bordersData from './borders.json';

const useStyles = makeStyles((theme) => ({
    root: {
        textAlign: "center",
        height: "100vh",
    },
    radio: {
        display: "inline-block",
    }
}));

function NorthSouthMap() {
    const classes = useStyles();
    const [position, setPosition] = useState({
        lat: 34,
        lng: 134,
    });
    const [zoom, setZoom] = useState(1);
    const [mode, setMode] = useState("FLIP_LAT");
    const flipLat = mode === "FLIP_LAT" || mode === "ANTIPODE";
    const slideLng = mode === "ANTIPODE";

    const polys = bordersData;
    const flippedPolys = polys.map(poly => poly.map(([lat, lng]) => [lat * (flipLat ? -1 : 1), lng + (slideLng ? 180 : 0)]));
    return <div className={classes.root}>
        <RadioGroup
            defaultValue="FLIP_LAT"
            value={mode}
            row
            onChange={(event) => setMode(event.target.value)}
        >
            <FormControlLabel key="FLIP_LAT" value="FLIP_LAT" control={<Radio />} label="緯度反転" />
            <FormControlLabel key="ANTIPODE" value="ANTIPODE" control={<Radio />} label="地球の反対側" />
            <FormControlLabel key="NORMAL" value="NORMAL" control={<Radio />} label="通常" />
        </RadioGroup >

        <MapContainer center={position} zoom={zoom} style={{ height: "100%" }}>
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright";>OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {flippedPolys.map((poly, idx) => <Polyline key={`poly_${idx}`} positions={poly} color="red" fill="red" />)}
        </MapContainer>
    </div >;
}
NorthSouthMap.path = "northsouthmap";
NorthSouthMap.title = "北半球と南半球を一緒に見る";
export default NorthSouthMap;
