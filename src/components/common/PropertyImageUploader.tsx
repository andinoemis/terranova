import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  Sparkles, 
  Plus, 
  Link as LinkIcon, 
  Eye, 
  Camera 
} from 'lucide-react';

interface PropertyImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

// Preset real estate images matching high-end Honduras architecture
const PRESET_REAL_ESTATE_PHOTOS = [
  {
    title: 'Fachada Moderna Lomas',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&auto=format&fit=crop&q=80',
    category: 'Exterior'
  },
  {
    title: 'Sala Principal & Terraza',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&auto=format&fit=crop&q=80',
    category: 'Sala'
  },
  {
    title: 'Cocina Integral de Lujo',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop&q=80',
    category: 'Cocina'
  },
  {
    title: 'Habitación Máster con Balcón',
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&auto=format&fit=crop&q=80',
    category: 'Dormitorio'
  },
  {
    title: 'Baño de Lujo con Jacuzzi',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&auto=format&fit=crop&q=80',
    category: 'Baño'
  },
  {
    title: 'Jardín & Área de Piscina',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=900&auto=format&fit=crop&q=80',
    category: 'Piscina'
  },
  {
    title: 'Edificio Residencial Torre Sky',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop&q=80',
    category: 'Torre'
  },
  {
    title: 'Terreno con Vista Panorámica',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop&q=80',
    category: 'Terreno'
  }
];

export const PropertyImageUploader: React.FC<PropertyImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 8
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file uploads (files -> Base64 data URLs)
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          onChange([...images, base64]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || images.length >= maxImages) return;
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
  };

  const handleTogglePreset = (url: string) => {
    if (images.includes(url)) {
      onChange(images.filter(img => img !== url));
    } else {
      if (images.length < maxImages) {
        onChange([...images, url]);
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetAsCover = (indexToCover: number) => {
    if (indexToCover === 0) return;
    const target = images[indexToCover];
    const rest = images.filter((_, idx) => idx !== indexToCover);
    onChange([target, ...rest]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-gray-700 text-xs flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-[#2D4539]" />
          <span>Fotografías de la Propiedad ({images.length} de {maxImages})</span>
        </label>
        <span className="text-[11px] text-gray-500">
          La primera imagen será la portada oficial
        </span>
      </div>

      {/* Drag & Drop and Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-[#2D4539] bg-[#EEF5ED]' 
            : 'border-gray-300 hover:border-[#2D4539] bg-[#FAFBF9] hover:bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-gray-200 text-[#2D4539] mx-auto flex items-center justify-center mb-2">
          <Upload className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-gray-800">
          Haz clic para adjuntar imágenes desde tu dispositivo o arrástralas aquí
        </p>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Formatos compatibles: JPG, PNG, WebP. Soporta múltiples fotos simultáneas.
        </p>
      </div>

      {/* Quick URL Adder and Presets Trigger */}
      <div className="flex flex-col sm:flex-row gap-2 text-xs">
        <div className="flex-1 flex gap-1.5">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              placeholder="Pegar enlace web directo de imagen..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#CAD8C8] rounded-xl text-xs focus:ring-1 focus:ring-[#2D4539]"
            />
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!urlInput.trim() || images.length >= maxImages}
            className="px-3 py-2 bg-[#2D4539] hover:bg-[#20342A] text-white font-semibold rounded-xl disabled:opacity-50 transition-colors"
          >
            Agregar URL
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className="px-3 py-2 rounded-xl border border-[#CAD8C8] bg-white hover:bg-[#EEF5ED] text-gray-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{showPresets ? 'Ocultar Galería Modelo' : 'Fotografías Modelo (Honduras)'}</span>
        </button>
      </div>

      {/* Preset Model Gallery Picker */}
      {showPresets && (
        <div className="p-3 bg-[#EEF5ED] rounded-2xl border border-[#CAD8C8] space-y-2 animate-in fade-in">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-[#1E3628]">Selecciona fotos profesionales modelo para tu publicación:</span>
            <span className="text-[11px] text-gray-500">Haz clic para agregar/quitar</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_REAL_ESTATE_PHOTOS.map((preset, idx) => {
              const isSelected = images.includes(preset.url);
              return (
                <div
                  key={idx}
                  onClick={() => handleTogglePreset(preset.url)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-video ${
                    isSelected ? 'border-[#2D4539] shadow-md ring-2 ring-[#2D4539]/30' : 'border-transparent hover:opacity-90'
                  }`}
                >
                  <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] text-white font-medium truncate">{preset.title}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#2D4539] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Attached Images Grid */}
      {images.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] text-gray-600 font-semibold block">Fotos adjuntas ({images.length}):</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="relative group rounded-xl overflow-hidden border border-[#CAD8C8] bg-gray-100 aspect-video shadow-2xs"
              >
                <img src={img} alt={`Foto adjunta ${idx + 1}`} className="w-full h-full object-cover" />
                
                {/* Cover badge */}
                {idx === 0 ? (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#2D4539] text-white text-[9px] font-bold shadow-xs">
                    ★ Portada
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetAsCover(idx)}
                    className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 hover:bg-[#2D4539] text-white text-[9px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Definir como foto principal"
                  >
                    Hacer Portada
                  </button>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
                  title="Eliminar fotografía"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
