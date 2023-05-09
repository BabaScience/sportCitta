import { useState, useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
/* @ts-ignore */
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
/* @ts-ignore */
import ImageryLayer from "@arcgis/core/layers/ImageryLayer"
import GraphicLayer from "@arcgis/core/layers/GraphicsLayer"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"

/* Widgets */
import BaseMapGallery from "@arcgis/core/widgets/BasemapGallery"
import Expand from "@arcgis/core/widgets/Expand"
import Sketch from "@arcgis/core/widgets/Sketch"

import './App.css'

const MyMap = () => {
  const mapDiv = useRef(null);
  // const bsWidget = useRef(null);

  const [map, setMap] = useState(null)
  const [view, setView] = useState(null)

  // On Reloaded
  useEffect(() => {
    // Create a new Map object
    const _map = new Map({
      basemap: "dark-gray"
    });
    /* @ts-ignore */
    setMap(_map)
  }, []);

  // When Map is changed
  useEffect(() => {
    if(map){
      console.log(`Map is setted! - Map:`, map)
      // Create a new MapView object
      const _view = new MapView({
        /* @ts-ignore */
        container: mapDiv.current,
        map: map,
        center: [12.644307, 41.935115], // Los Angeles
        zoom: 10
      });
      /* @ts-ignore */
      setView(_view)
    }
  }, [map])

  // When View is changed
  useEffect(() => {
    if (view){
      console.log(`View is Ready! - View:`, view)
      /* const tiledLayer = new WebTileLayer({
        urlTemplate: "http://{subDomain}.tile.openweathermap.org/map/pressure_new/{level}/{col}/{row}.png?appid=06aac0fd4ba239a20d824ef89602f311",
        subDomains: ["a", "b", "c", "d"]
      }); */

      /* const imgLayer = new ImageryLayer({
        url: "https://image.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2018_WM/MapServer"
      }) */

      const sportLayer = new FeatureLayer({
        url: "https://portalgislnx.wheretech.it/server/rest/services/Hosted/sport_in_citta/FeatureServer/0"
      })
      const publicTransportLayer = new FeatureLayer({
        url: "https://portalgislnx.wheretech.it/server/rest/services/Hosted/sport_in_citta/FeatureServer/1"
      })

      const baseMapGalleryWidget = new BaseMapGallery({
        view: view,
        // container: bsWidget.current
      })

      const graphicLayer = new GraphicLayer()

      const filterSketch = new Sketch({
        layer: graphicLayer,
        view: view
      })

      const bsExpand = new Expand({
        expandIconClass: "esri-icon-layer-list",
        view: view,
        content: baseMapGalleryWidget
      })

      const filterExpand = new Expand({
        expandIconClass: "esri-icon-layer-list",
        view: view,
        content: filterSketch
      })

      // Set the state to indicate that the map has been loaded
      /* @ts-ignore */
      view.when(() => {
        console.log("View Ready")

        /* @ts-ignore */
        map.addMany([sportLayer, publicTransportLayer /* tiledLayer */])
        
        /* @ts-ignore */
        view.ui.add(bsExpand, "top-left")
        /* @ts-ignore */
        view.ui.add(filterExpand, "top-left")
      
        
      }).catch(() => {
        console.log("Failed to load ViewMap")
      })
    }
  }, [view])


  return (
    <div className="map-container">
      {!map && <span>Loading map...</span>}
      {/* <h1>Hello World</h1> */}
      {map && 
        <>
          <div className="map" ref={mapDiv}>
          </div>
        </>
      }
    </div>
  );
};

export default MyMap;
