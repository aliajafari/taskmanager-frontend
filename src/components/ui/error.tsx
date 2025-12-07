interface ErrorProps {
  message?: string;
}

export function Error({ message = 'An error occurred' }: ErrorProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {message}
    </div>
  );
}

