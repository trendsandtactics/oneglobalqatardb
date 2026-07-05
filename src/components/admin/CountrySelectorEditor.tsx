import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface CountryItem {
  country: string;
  company: string;
  website: string;
  flag?: string;
  priority: number;
}

interface CountrySelectorEditorProps {
  items: CountryItem[];
  onChange: (items: CountryItem[]) => void;
}

const FLAG_SVGS = [
  '/sg.svg', '/my.svg', '/id.svg', '/th.svg', '/mm.svg', '/au.svg',
  '/in.svg', '/bd.svg', '/lk.svg', '/pk.svg', '/qa.svg', '/sa.svg',
  '/us.svg', '/gb.svg', '/ae.svg', '/cn.svg',
];

const emptyItem = (priority: number): CountryItem => ({
  country: '', company: '', website: '', flag: '', priority,
});

const CountrySelectorEditor: React.FC<CountrySelectorEditorProps> = ({ items, onChange }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const update = (idx: number, field: keyof CountryItem, value: any) => {
    onChange(items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const remove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
    setExpanded(null);
  };

  const add = () => {
    const newItems = [...items, emptyItem(items.length + 1)];
    onChange(newItems);
    setExpanded(newItems.length - 1);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 mb-3">These are the countries shown in the "Switch Country" dropdown in the header. Each country links to its regional website.</p>

      {items.map((item, idx) => (
        <Card key={idx} className="border">
          <CardContent className="p-0">
            {/* Row header */}
            <div
              className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
              {item.flag && (
                <img src={item.flag} alt="" className="w-6 h-4 object-cover rounded-sm shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.country || `Country ${idx + 1}`}</div>
                <div className="text-xs text-gray-400 truncate">{item.company} — {item.website || 'no URL'}</div>
              </div>
              <Button
                type="button" variant="ghost" size="sm"
                className="text-red-400 hover:text-red-600 h-7 w-7 p-0 shrink-0"
                onClick={(e) => { e.stopPropagation(); remove(idx); }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Expanded edit */}
            {expanded === idx && (
              <div className="px-4 pb-4 pt-1 border-t bg-gray-50 grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-500">Country Name</Label>
                  <Input value={item.country} onChange={(e) => update(idx, 'country', e.target.value)} className="mt-1 h-8 text-sm" placeholder="QATAR" />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Company</Label>
                  <Input value={item.company} onChange={(e) => update(idx, 'company', e.target.value)} className="mt-1 h-8 text-sm" placeholder="ONE GLOBAL" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-gray-500">Website URL</Label>
                  <Input value={item.website} onChange={(e) => update(idx, 'website', e.target.value)} className="mt-1 h-8 text-sm" placeholder="https://..." />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Flag SVG Path</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={item.flag ?? ''} onChange={(e) => update(idx, 'flag', e.target.value)} className="h-8 text-sm flex-1" placeholder="/qa.svg" />
                    {item.flag && <img src={item.flag} alt="" className="h-8 w-10 object-cover rounded border"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {FLAG_SVGS.map(f => (
                      <button key={f} type="button" onClick={() => update(idx, 'flag', f)}
                        className={`rounded border p-0.5 ${item.flag === f ? 'border-brand-navy' : 'border-gray-200'}`}
                        title={f}
                      >
                        <img src={f} alt={f} className="w-6 h-4 object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Sort Priority (lower = first)</Label>
                  <Input type="number" value={item.priority} onChange={(e) => update(idx, 'priority', parseInt(e.target.value) || 0)} className="mt-1 h-8 text-sm" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={add} className="w-full border-dashed mt-2">
        <Plus className="h-4 w-4 mr-2" />
        Add Country
      </Button>
    </div>
  );
};

export default CountrySelectorEditor;
