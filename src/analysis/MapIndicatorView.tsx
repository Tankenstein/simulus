import React, { useState } from 'react';
import MapGl, { ViewportProps, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Icon } from 'semantic-ui-react';
import { MapIndicatorConfiguration } from './Indicator';

const HANDLE_HEIGHT = 20;

const MapIndicatorView = ({
  configuration,
  size,
}: {
  configuration: MapIndicatorConfiguration;
  size: [number, number];
}) => {
  const [viewport, setViewport] = useState(viewportDefaults(configuration.startingViewport));

  return (
    <div style={{ display: 'relative' }}>
      <div className="analysis-drag-cancel">
        <MapGl
          {...viewport}
          width={size[0]}
          height={size[1] - HANDLE_HEIGHT}
          onViewportChange={state => setViewport(state as any)}
          mapboxApiAccessToken={configuration.mapBoxToken}
        >
          {configuration.markers
            ? configuration.markers.map((marker, index) => {
                const content = marker.content as any; // as we are using require at least one type
                return (
                  <Marker
                    key={index}
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    offsetLeft={marker.offsetLeft}
                    offsetTop={marker.offsetTop}
                  >
                    {content.icon ? (
                      <Icon name={content.icon.name} color={content.icon.color} />
                    ) : (
                      content.custom
                    )}
                  </Marker>
                );
              })
            : ''}
        </MapGl>
      </div>
      <div
        style={{
          display: 'absolute',
          backgroundColor: '#ccc',
          textAlign: 'center',
          height: `${HANDLE_HEIGHT}px`,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Icon name="window minimize outline" />
      </div>
    </div>
  );
};

function viewportDefaults(viewport: Partial<ViewportProps> = {}) {
  return {
    latitude: viewport.latitude || 59.437, // Tallinn
    longitude: viewport.longitude || 24.7536,
    zoom: viewport.zoom || 10,
  };
}

export default MapIndicatorView;
