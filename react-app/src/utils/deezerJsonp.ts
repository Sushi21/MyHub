import type { DeezerResponse } from '@/types/album';

// Extend Window interface to support dynamic JSONP callbacks
declare global {
  interface Window {
    [key: string]: unknown;
  }
}

export function fetchDeezerPreview(query: string): Promise<DeezerResponse> {
  return new Promise((resolve, reject) => {
    const callbackName = `deezer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error('Request timeout'));
    }, 10000);

    const cleanup = () => {
      clearTimeout(timeoutId);
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    window[callbackName] = (data: DeezerResponse) => {
      cleanup();
      resolve(data);
    };

    const script = document.createElement('script');
    script.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&output=jsonp&callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      reject(new Error('Script load error'));
    };
    document.body.appendChild(script);
  });
}
