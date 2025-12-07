import { SelectHTMLAttributes, ReactNode, useId } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({
  label,
  error,
  className = '',
  children,
  id,
  ...props
}: SelectProps) {
  const selectId = id || useId();
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        style={{
          color: props.value ? '#111827' : '#111827',
          fontWeight: props.value ? '600' : '600',
        }}
        {...props}
      >
        {children}
      </select>
      <style jsx global>{`
        select option {
          color: #1f2937;
          font-weight: 500;
          background-color: white;
        }
        select option:checked {
          background-color: #3b82f6;
          color: white;
          font-weight: 600;
        }
      `}</style>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

