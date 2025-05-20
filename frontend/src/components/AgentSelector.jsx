import React from 'react'

const AGENTS = [
  { label: 'Tổng quan', value: 'tongquan' },
  { label: 'Hợp đồng', value: 'hopdong' },
  { label: 'Bồi thường', value: 'claim' },
  { label: 'Đào tạo', value: 'daotao' },
  { label: 'Tuyển dụng', value: 'tuyendung' },
  { label: 'Thu nhập', value: 'thunhap' },
  { label: 'Tư vấn giả lập', value: 'tuvan' },
  { label: 'Tuyển giả lập', value: 'tuyengia' },
];

const AgentSelector = ({ value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Chọn bộ phận muốn hỏi (tuỳ chọn)
      </label>
      <select
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {AGENTS.map(agent => (
          <option key={agent.value} value={agent.value}>
            {agent.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AgentSelector 