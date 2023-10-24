"use client";

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { checkAddressStatus, submitAddressRequest } from './api';
import { Loader } from "@googlemaps/js-api-loader";

const App: React.FC = () => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [waypoints, setWaypoints] = useState<string[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wayPointError, setWayPointError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let labelIndex = 0;
  const loader = new Loader({
    apiKey: process.env.MAP_API_KEY ?? '',
    version: 'weekly',
    libraries: ['places'],
  });

  const loadMap = useCallback(async () => {
    const { Map } = await loader.importLibrary("maps")
    const { Autocomplete } = await loader.importLibrary("places")

    const mapElement = document.getElementById('map') as HTMLElement;
    mapRef.current = new Map(mapElement, {
      center: { lat: 22.4168936, lng: 113.9326371 },
      zoom: 10,
    });

    const pickupInput = document.getElementById('pickup-input') as HTMLInputElement;
    const dropoffInput = document.getElementById('dropoff-input') as HTMLInputElement;

    pickupAutocompleteRef.current = new Autocomplete(pickupInput);
    dropoffAutocompleteRef.current = new Autocomplete(dropoffInput);

    pickupAutocompleteRef.current.addListener('place_changed', () => {
      const place = pickupAutocompleteRef.current!.getPlace();
      if (place.formatted_address) {
        setPickupAddress(place.formatted_address);
      }
    });

    dropoffAutocompleteRef.current.addListener('place_changed', () => {
      const place = dropoffAutocompleteRef.current!.getPlace();
      if (place.formatted_address) {
        setDropoffAddress(place.formatted_address);
      }
    });
  }, []);

  const renderMapWaypoints = useCallback(async () => {
    const map = mapRef.current;

    if (map && waypoints.length > 0) {
      const { LatLngBounds, LatLng } = await loader.importLibrary("core")
      const { Marker } = await loader.importLibrary("marker")
      const bounds = new LatLngBounds();

      waypoints.forEach((waypoint) => {
        const latLng = new LatLng(
          parseFloat(waypoint[0]),
          parseFloat(waypoint[1])
        );

        bounds.extend(latLng);

        const marker = new Marker({
          position: latLng,
          map: map,
          label: labels[labelIndex++ % labels.length],
        });
        const tempMarkers = markers
        tempMarkers.push(marker);
        setMarkers(tempMarkers);
      });

      map.fitBounds(bounds);
    }
  }, [waypoints]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      setWayPointError(null);
      const addressRequest = await submitAddressRequest(pickupAddress, dropoffAddress);
      const token = addressRequest;

      const addressStatus = await checkAddressStatus(token);
      const { status, path, error } = addressStatus;
      labelIndex = 0;
      if (markers.length > 0) {
        markers.forEach((x) => x.setMap(null));
        setMarkers([])
      }
      if (status === 'success') {
        setWaypoints(path);
      } else {
        setWaypoints([])
        setWayPointError(error);
        console.log(error)
        setIsLoading(false);

      }
    } catch (error) {
      const err = error as AggregateError
      if (markers.length > 0) {
        markers.forEach((x) => x.setMap(null));
        setMarkers([])
      }
      setWaypoints([])
      setWayPointError(err.message);
      console.log(err.message);
      setIsLoading(false);

    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadMap();
  }, [loadMap]);

  useEffect(() => {
    renderMapWaypoints();
  }, [waypoints, renderMapWaypoints]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 lg:pr-4">
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Pickup Address:</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="pickup-input"
                value={pickupAddress}
                name="pickupAddress"
                onChange={(e) => setPickupAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Drop-off Address:</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="dropoff-input"
                value={dropoffAddress}
                name="dropoffAddress"
                onChange={(e) => setDropoffAddress(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </form>
          <h2 className="text-2xl font-bold mb-2">Waypoints:</h2>
          {wayPointError !== null ? (
            <h2>{wayPointError}</h2>
          ) : (
            <ul className="list-disc pl-6 mb-4">
              {waypoints.map((waypoint, index) => (
                <li key={index}>{`${waypoint[0]}, ${waypoint[1]}`}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:w-1/2 h-1/2 lg:h-auto" style={{ height: '70vh' }}>
          <div id="map" style={{ height: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default App;