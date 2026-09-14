import type { StyleSpecification } from "maplibre-gl";

/**
 * Free raster basemap with no API key.
 * Esri World Street Map (ArcGIS Online) — z/y/x tile order.
 */
export const FREE_MAP_STYLE: StyleSpecification = {
  version: 8,
  name: "Esri World Street Map",
  sources: {
    esri: {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom",
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: "esri-streets",
      type: "raster",
      source: "esri",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};
