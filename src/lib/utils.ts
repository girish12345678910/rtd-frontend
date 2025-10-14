import { type ClassValue } from 'clsx';

// Simple className merger (we'll use this for dynamic styles)
export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

// Format date helper
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format time helper
export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}
    