import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface City {
  name: string;
  lat: number;
  lng: number;
  address: string;
  contacts: string[];
  email?: string;
}

interface Country {
  code: string;
  name: string;
  lat: number;
  lng: number;
  cities: City[];
}

interface GlobalPresenceEditorProps {
  countries: Country[];
  mapEmbedUrl: string;
  onChange: (countries: Country[], mapEmbedUrl: string) => void;
}

const emptyCity = (): City => ({ name: '', lat: 0, lng: 0, address: '', contacts: [''], email: '' });
const emptyCountry = (): Country => ({ code: '', name: '', lat: 0, lng: 0, cities: [emptyCity()] });

const GlobalPresenceEditor: React.FC<GlobalPresenceEditorProps> = ({ countries, mapEmbedUrl, onChange }) => {
  const [expandedCountry, setExpandedCountry] = useState<number | null>(0);

  const updateCountry = (ci: number, field: keyof Country, value: any) => {
    const updated = countries.map((c, i) => i === ci ? { ...c, [field]: value } : c);
    onChange(updated, mapEmbedUrl);
  };

  const updateCity = (ci: number, cityIdx: number, field: keyof City, value: any) => {
    const updated = countries.map((c, i) => {
      if (i !== ci) return c;
      const cities = c.cities.map((city, j) =>
        j === cityIdx ? { ...city, [field]: field === 'lat' || field === 'lng' ? parseFloat(value) || 0 : value } : city
      );
      return { ...c, cities };
    });
    onChange(updated, mapEmbedUrl);
  };

  const addCity = (ci: number) => {
    const updated = countries.map((c, i) =>
      i === ci ? { ...c, cities: [...c.cities, emptyCity()] } : c
    );
    onChange(updated, mapEmbedUrl);
  };

  const removeCity = (ci: number, cityIdx: number) => {
    const updated = countries.map((c, i) =>
      i === ci ? { ...c, cities: c.cities.filter((_, j) => j !== cityIdx) } : c
    );
    onChange(updated, mapEmbedUrl);
  };

  const addCountry = () => {
    onChange([...countries, emptyCountry()], mapEmbedUrl);
    setExpandedCountry(countries.length);
  };

  const removeCountry = (ci: number) => {
    onChange(countries.filter((_, i) => i !== ci), mapEmbedUrl);
    setExpandedCountry(null);
  };

  return (
    <div className="space-y-4">
      {/* Map URL */}
      <div className="p-4 bg-blue-50 rounded-lg space-y-2">
        <Label className="text-sm font-semibold">Google Maps Embed URL</Label>
        <Input
          value={mapEmbedUrl}
          onChange={(e) => onChange(countries, e.target.value)}
          placeholder="https://www.google.com/maps/d/embed?..."
          className="bg-white"
        />
        <p className="text-xs text-gray-500">Paste your Google My Maps embed URL here.</p>
      </div>

      {/* Countries */}
      <div className="space-y-3">
        {countries.map((country, ci) => (
          <Card key={ci} className="border">
            <CardHeader
              className="py-3 px-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedCountry(expandedCountry === ci ? null : ci)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {country.code && (
                    <img src={`https://flagcdn.com/${country.code}.svg`} alt="" className="w-6 h-4 object-cover rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <CardTitle className="text-sm font-semibold">
                    {country.name || `Country ${ci + 1}`}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">{country.cities.length} cities</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-600 h-7 w-7 p-0"
                    onClick={(e) => { e.stopPropagation(); removeCountry(ci); }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  {expandedCountry === ci ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
              </div>
            </CardHeader>

            {expandedCountry === ci && (
              <CardContent className="px-4 pb-4 space-y-4">
                {/* Country fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-500">Country Name</Label>
                    <Input value={country.name} onChange={(e) => updateCountry(ci, 'name', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Flag Code (e.g. in, us, gb)</Label>
                    <Input value={country.code} onChange={(e) => updateCountry(ci, 'code', e.target.value)} className="mt-1" placeholder="in" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Country Latitude</Label>
                    <Input type="number" step="0.0001" value={country.lat} onChange={(e) => updateCountry(ci, 'lat', parseFloat(e.target.value) || 0)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Country Longitude</Label>
                    <Input type="number" step="0.0001" value={country.lng} onChange={(e) => updateCountry(ci, 'lng', parseFloat(e.target.value) || 0)} className="mt-1" />
                  </div>
                </div>

                {/* Cities */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Cities / Offices
                  </Label>
                  <div className="space-y-3">
                    {country.cities.map((city, cityIdx) => (
                      <div key={cityIdx} className="bg-gray-50 rounded-lg p-3 space-y-2 relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-500">Office {cityIdx + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-600 h-6 w-6 p-0"
                            onClick={() => removeCity(ci, cityIdx)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-400">City Name</Label>
                            <Input value={city.name} onChange={(e) => updateCity(ci, cityIdx, 'name', e.target.value)} className="mt-0.5 h-8 text-sm" />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Email</Label>
                            <Input value={city.email ?? ''} onChange={(e) => updateCity(ci, cityIdx, 'email', e.target.value)} className="mt-0.5 h-8 text-sm" />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Latitude</Label>
                            <Input type="number" step="0.0001" value={city.lat} onChange={(e) => updateCity(ci, cityIdx, 'lat', e.target.value)} className="mt-0.5 h-8 text-sm" />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-400">Longitude</Label>
                            <Input type="number" step="0.0001" value={city.lng} onChange={(e) => updateCity(ci, cityIdx, 'lng', e.target.value)} className="mt-0.5 h-8 text-sm" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Address</Label>
                          <Input value={city.address} onChange={(e) => updateCity(ci, cityIdx, 'address', e.target.value)} className="mt-0.5 h-8 text-sm" />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-400">Phone Numbers (one per line)</Label>
                          <Textarea
                            value={(city.contacts ?? []).join('\n')}
                            onChange={(e) => updateCity(ci, cityIdx, 'contacts', e.target.value.split('\n'))}
                            className="mt-0.5 text-sm min-h-[56px]"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => addCity(ci)} className="w-full border-dashed text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Add Office/City
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addCountry} className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-2" />
        Add Country
      </Button>
    </div>
  );
};

export default GlobalPresenceEditor;
