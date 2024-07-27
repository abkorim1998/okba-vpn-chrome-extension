import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl';
import { CountriesLatLang } from '../countries/country-codes-lat-long-alpha3';

// const winH = window.innerHeight;
// const shiftFactor = 0.6;
// const shiftAmmount = shiftFactor * winH;
// const height = winH + shiftAmmount;
const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="#ccc" cx="14" cy="14" r="7"></circle>
</svg>`;


export default function MyGlobe() {
    const globeEl = useRef<any>();
    const [places, setPlaces] = useState([]);
    const [hoveredPolygon, setHoveredPolygon] = useState<any>();
    const [marker, setMarker] = useState({
        lat: 35,
        lng: 105
    })

    useEffect(() => {
        fetch('/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(({ features }) => setPlaces(features));
    }, []);

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.pointOfView({
                lat: marker.lat,
                lng: marker.lng,
                altitude: 3.5
            }, 400);
        }
    }, [marker])


    function getCountryLatLan(countryCode: any) {
        var lat = CountriesLatLang.find((country: any) => country.alpha2 === countryCode)?.latitude;
        var lng = CountriesLatLang.find((country: any) => country.alpha2 === countryCode)?.longitude;
        if (lat && lng) {
            return {
                lat,
                lng
            };
        } else {
            return null;
        }
    }

    return (
        <Globe
            ref={globeEl}
            polygonsData={places}
            polygonAltitude={d => d === hoveredPolygon ? 0.12 : 0.06}
            polygonCapColor={d => d === hoveredPolygon ? 'steelblue' : '#ccc'}
            polygonSideColor={d => d === hoveredPolygon ? 'steelblue' : 'rgba(0, 0, 0, 0.2)'}
            polygonStrokeColor={() => '#111'}
            polygonLabel={(d: any) => `<b style="background:rgba(0, 0, 0, 0.5); color:#fff; padding:3px; border-radius:3px;">${d.ADMIN} (${d.ISO_A2})</b>`}
            onPolygonHover={setHoveredPolygon}
            polygonsTransitionDuration={300}
            onPolygonClick={(d: any) => {
                console.log(d);
                var latLng = getCountryLatLan(d.ISO_A2);
                if (latLng) {
                    setMarker({
                        lat: latLng.lat,
                        lng: latLng.lng
                    })
                }
            }}

            globeImageUrl="/bg1.png"
            backgroundColor='#fff'
            showGlobe={true}
            showAtmosphere={false}
            width={window.innerWidth}
            height={window.innerHeight}
            htmlElementsData={[marker]}
            htmlElement={d => {
                const el = document.createElement<any>('div');
                el.innerHTML = markerSvg;
                el.style.color = '#341d33';
                el.style.width = '25px';
                el.style['pointer-events'] = 'auto';
                el.style.cursor = 'pointer';
                el.onclick = () => console.info(d);
                return el;
            }}
        />

    )
}
