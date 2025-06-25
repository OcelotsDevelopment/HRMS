import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";

interface CountryMapProps {
  mapColor?: string;
  data: { nationality: string; count: number }[];
}

// type Marker = {
//   latLng: [number, number];
//   name: string;
//   style: {
//     fill: string;
//     borderWidth: number;
//     borderColor: string;
//   };
// };

const CountryMap: React.FC<CountryMapProps> = ({ data = [], mapColor }) => {


 const nationalityToLatLng: Record<string, [number, number]> = {
  india: [20.7504374, 73.7276105],
  australia: [-25.2744, 133.7751],
  usa: [37.2580397, -104.657039],
  uk: [53.613, -11.6368],
  france: [46.603354, 1.888334],
  sweden: [60.128161, 18.643501],
};



  console.log(data,"datadatadatadatadatadatadatadatadatadatadatadatadatadatadata");
  
  const markers = data
  .map((item) => {
    const key = item.nationality.toLowerCase();
    const coords = nationalityToLatLng[key];
    if (!coords) return null;
    return {
      latLng: coords,
      name: `${item.nationality} - ${item.count}`,
      style: {
        fill: "#465FFF",
        borderWidth: 1,
        borderColor: "white",
      },
    };
  })
  .filter(Boolean) as {
    latLng: [number, number];
    name: string;
    style: {
      fill: string;
      borderWidth: number;
      borderColor: string;
    };
  }[];


  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={{
        initial: { fill: "#465FFF" },
      }}
      markersSelectable={true}
      markers={markers}
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: mapColor || "#D0D5DD",
          fillOpacity: 1,
          fontFamily: "Outfit",
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#465fff",
        },
        selected: { fill: "#465FFF" },
      }}
    />
  );
};

export default CountryMap;
