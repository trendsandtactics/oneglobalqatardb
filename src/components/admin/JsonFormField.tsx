import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import ImagePickerField from './ImagePickerField';

interface JsonFormFieldProps {
  data: any;
  path: string;
  onFieldChange: (path: string, value: any) => void;
}

const formatLabel = (key: string) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

const isImageField = (key: string, value: any): boolean => {
  if (typeof value !== 'string') return false;
  const keyLower = key.toLowerCase();
  const imageKeywords = ['image', 'img', 'src', 'photo', 'banner', 'logo', 'background', 'thumbnail', 'picture', 'flag'];
  if (imageKeywords.some(k => keyLower.includes(k))) return true;
  if (typeof value === 'string' && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(value)) return true;
  return false;
};

const isLongText = (key: string, value: any) =>
  typeof value === 'string' && (
    value.length > 80 ||
    key.toLowerCase().includes('description') ||
    key.toLowerCase().includes('content') ||
    key.toLowerCase().includes('introduction') ||
    key.toLowerCase().includes('intro') ||
    key.toLowerCase().includes('text')
  );

const JsonFormField: React.FC<JsonFormFieldProps> = ({ data, path, onFieldChange }) => {
  const renderField = (key: string, value: any, currentPath: string) => {
    const fieldId = `field-${currentPath}-${key}`;
    const fieldPath = `${currentPath}.${key}`;

    if (typeof value === 'string') {
      if (isImageField(key, value)) {
        return (
          <ImagePickerField
            key={fieldId}
            label={formatLabel(key)}
            value={value}
            onChange={(v) => onFieldChange(fieldPath, v)}
          />
        );
      }
      if (isLongText(key, value)) {
        return (
          <div key={fieldId} className="mb-4">
            <Label htmlFor={fieldId} className="text-sm font-medium text-gray-700">{formatLabel(key)}</Label>
            <Textarea
              id={fieldId}
              value={value}
              onChange={(e) => onFieldChange(fieldPath, e.target.value)}
              className="mt-1 min-h-[80px] resize-y"
              rows={3}
            />
          </div>
        );
      }
      return (
        <div key={fieldId} className="mb-4">
          <Label htmlFor={fieldId} className="text-sm font-medium text-gray-700">{formatLabel(key)}</Label>
          <Input
            id={fieldId}
            type="text"
            value={value}
            onChange={(e) => onFieldChange(fieldPath, e.target.value)}
            className="mt-1"
          />
        </div>
      );
    }

    if (typeof value === 'number') {
      return (
        <div key={fieldId} className="mb-4">
          <Label htmlFor={fieldId} className="text-sm font-medium text-gray-700">{formatLabel(key)}</Label>
          <Input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => onFieldChange(fieldPath, parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      if (value.every((v) => typeof v === 'string')) {
        return (
          <div key={fieldId} className="mb-4">
            <Label className="text-sm font-medium text-gray-700">{formatLabel(key)}</Label>
            <div className="mt-1 space-y-2">
              {value.map((item: string, index: number) => (
                <div key={`${fieldId}-${index}`} className="flex gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const updated = [...value];
                      updated[index] = e.target.value;
                      onFieldChange(fieldPath, updated);
                    }}
                    placeholder={`Item ${index + 1}`}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => onFieldChange(fieldPath, value.filter((_, i) => i !== index))}
                    className="text-red-400 hover:text-red-600 text-xs px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onFieldChange(fieldPath, [...value, ''])}
                className="text-xs text-brand-navy underline"
              >
                + Add item
              </button>
            </div>
          </div>
        );
      }

      return (
        <div key={fieldId} className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm font-semibold text-gray-700">{formatLabel(key)}</Label>
            <Badge variant="secondary" className="text-xs">{value.length} items</Badge>
          </div>
          <div className="space-y-3 pl-3 border-l-2 border-gray-200">
            {value.map((item: any, index: number) => (
              <div key={`${fieldId}-${index}`} className="bg-gray-50 rounded-lg p-3 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-400 font-medium">Item {index + 1}</div>
                  <button
                    type="button"
                    onClick={() => onFieldChange(fieldPath, value.filter((_: any, i: number) => i !== index))}
                    className="text-red-400 hover:text-red-600 text-xs"
                  >
                    Remove
                  </button>
                </div>
                <JsonFormField
                  data={item}
                  path={`${fieldPath}.${index}`}
                  onFieldChange={onFieldChange}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const sample = value[0];
                let newItem: any = '';
                if (sample && typeof sample === 'object') {
                  newItem = Object.fromEntries(
                    Object.keys(sample).map(k => {
                      const v = sample[k];
                      if (Array.isArray(v)) return [k, []];
                      if (typeof v === 'number') return [k, 0];
                      if (typeof v === 'object' && v !== null) return [k, {}];
                      return [k, ''];
                    })
                  );
                }
                onFieldChange(fieldPath, [...value, newItem]);
              }}
              className="text-xs text-brand-navy underline block mt-1"
            >
              + Add item
            </button>
          </div>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null) {
      return (
        <div key={fieldId} className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2 pb-1 border-b">{formatLabel(key)}</div>
          <div className="pl-3 border-l-2 border-gray-200">
            <JsonFormField data={value} path={fieldPath} onFieldChange={onFieldChange} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>{Object.entries(data).map(([key, value]) => renderField(key, value, path))}</>
  );
};

export default JsonFormField;
