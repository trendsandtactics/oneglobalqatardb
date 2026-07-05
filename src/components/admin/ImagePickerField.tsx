import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Image, Check, X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthHeaders } from '@/pages/api';

const PUBLIC_IMAGES = [
  '/About01.png', '/abouthero.jpg', '/about-bg.webp',
  '/airfreight.jpg', '/seafreight.jpg', '/roadfreight.jpg', '/roadfreight01.jpg',
  '/Customsclearance.jpg', '/Warehousing.jpg', '/Projectlogistics.jpg',
  '/port.jpg', '/ship.png', '/Hero01.jpg', '/cargo-ship.png',
  '/onegloballogo.png',
  '/ae.svg', '/au.svg', '/bd.svg', '/cn.svg', '/gb.svg', '/id.svg', '/in.svg',
  '/lk.svg', '/mm.svg', '/my.svg', '/pk.svg', '/qa.svg', '/sa.svg', '/sg.svg',
  '/th.svg', '/us.svg',
];

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [serverImages, setServerImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load uploaded images from server when dialog opens
  useEffect(() => {
    if (!open) return;
    fetch('/api/uploads')
      .then(r => r.json())
      .then(d => setServerImages(d.files ?? []))
      .catch(() => {});
  }, [open]);

  const allImages = [...serverImages, ...PUBLIC_IMAGES];
  const filtered = allImages.filter(img =>
    img.toLowerCase().includes(search.toLowerCase())
  );

  const select = (src: string) => {
    onChange(src);
    setOpen(false);
    setSearch('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Please use an image under 10MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', headers: getAuthHeaders(), body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      onChange(url);
      setServerImages(prev => [url, ...prev]);
      toast.success(`"${file.name}" uploaded successfully.`);
    } catch {
      toast.error('Upload failed. Make sure the server is running.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="mb-4">
      <Label className="text-sm font-medium text-gray-700 block mb-1">{label}</Label>

      {/* Preview */}
      {value && (
        <div className="relative w-full h-28 rounded-lg overflow-hidden bg-gray-100 border mb-2">
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/your-image.jpg or /api/image/1"
          className="flex-1 text-sm"
        />

        {/* Upload from computer */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          title="Upload from computer"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4 mr-1" />Upload</>}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Browse gallery */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="shrink-0">
              <Image className="h-4 w-4 mr-1" />
              Browse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Select Image</DialogTitle>
            </DialogHeader>

            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Search images..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4 mr-1" />Upload New</>}
              </Button>
            </div>

            {serverImages.length > 0 && (
              <p className="text-xs text-gray-400 mb-2">
                {serverImages.length} uploaded · {PUBLIC_IMAGES.length} site images
              </p>
            )}

            <ScrollArea className="h-[420px]">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pr-2">
                {filtered.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => select(src)}
                    className={`relative group rounded-lg overflow-hidden border-2 transition-all aspect-square bg-gray-100 ${
                      value === src ? 'border-brand-navy' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                      }}
                    />
                    {value === src && (
                      <div className="absolute inset-0 bg-brand-navy/30 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                    {(src.startsWith('/uploads/') || src.startsWith('/api/image/')) && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-[8px] px-1 rounded">
                        uploaded
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] p-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {src.split('/').pop()}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImagePickerField;
