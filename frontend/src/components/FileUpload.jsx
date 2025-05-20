import React, { useRef, useState } from 'react';
import api from '../services/api';

const AGENTS = [
  { label: 'Agent A', value: 'agent_a' },
  { label: 'Agent B', value: 'agent_b' },
  // Thay thế bằng danh sách agent thực tế nếu có
];

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [agent, setAgent] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = async (file) => {
    setSelectedFile(file);
    setResponse(null);
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (agent) formData.append('agent', agent);
      const res = await api.post('/upload/parse', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Đã xảy ra lỗi khi upload file.');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setResponse(null);
    setError(null);
    fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-4 max-w-xl mx-auto">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Chọn Agent (tùy chọn):</label>
        <select
          className="border rounded px-2 py-1 w-full"
          value={agent}
          onChange={e => setAgent(e.target.value)}
        >
          <option value="">-- Không chọn --</option>
          {AGENTS.map(a => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </select>
      </div>
      {!selectedFile ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer hover:bg-gray-50"
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="hidden"
            ref={fileInputRef}
            onChange={onFileInputChange}
          />
          <p className="text-gray-500">Kéo-thả hoặc bấm để chọn file (ảnh, PDF, Excel...)</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="mb-2 text-sm text-gray-700">Đã chọn: <b>{selectedFile.name}</b></div>
          {loading && <div className="text-blue-500">Đang gửi file...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {response && (
            <div className="bg-gray-100 rounded p-2 mt-2 w-full text-left">
              <div className="font-semibold mb-1">Phản hồi AI:</div>
              <pre className="whitespace-pre-wrap break-words text-sm">{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
          <button
            className="mt-3 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            onClick={reset}
            disabled={loading}
          >
            Gửi file khác
          </button>
        </div>
      )}
    </div>
  );
} 