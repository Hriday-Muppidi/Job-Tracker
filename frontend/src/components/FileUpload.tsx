import { useRef, useState } from 'react';
import { api } from '../lib/api';

export function FileUpload({ onUploaded }: { onUploaded: (file: any) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    const formData = new FormData();
    formData.append('file', files[0]);
    const res = await api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    onUploaded(res.data);
  };

  return (
    <div
      className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${drag ? 'bg-gray-100' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      <div className="text-sm">Drag & drop to upload, or click to select</div>
    </div>
  );
}

