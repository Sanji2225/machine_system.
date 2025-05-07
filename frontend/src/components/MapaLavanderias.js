import React from 'react';

const MapaLavanderias = ({ lavanderias }) => {
  // Esta é uma representação placeholder para o mapa.
  // A integração real com Google Maps API ou OpenStreetMap exigiria
  // uma biblioteca de mapa (como react-leaflet ou @react-google-maps/api)
  // e configuração adicional.

  if (!lavanderias || lavanderias.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma lavanderia para exibir no mapa.</p>;
  }

  return (
    <div className="mt-8 p-4 border rounded-lg shadow-md bg-gray-50">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Mapa das Lavanderias (Placeholder)</h3>
      <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
        <p className="text-gray-500">[Aqui seria exibido o mapa interativo]</p>
      </div>
      <ul className="mt-4 space-y-1">
        {lavanderias.map(lavanderia => (
          <li key={lavanderia.id} className="text-sm text-gray-700">
            <strong>{lavanderia.nome}:</strong> Lat {lavanderia.latitude}, Lon {lavanderia.longitude} ({lavanderia.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapaLavanderias;

