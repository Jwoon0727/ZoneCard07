'use client'

import { useState } from 'react';

export default function ImgUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const res = await fetch('/api/awsUpload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: reader.result,
        }),
      });

      const data = await res.json();
      if (data.url) {
        alert('File uploaded successfully: ' + data.url);
      } else {
        alert('File upload failed');
      }
    };
  };

  return (
    <div>
      <h1>AWS S3 Image Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
}
