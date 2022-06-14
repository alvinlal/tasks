import { useState } from 'react';

type SendFn = (url: string, options: RequestInit) => Promise<any>;

interface UseSend {
  (): [SendFn, boolean, boolean | Error];
}

// sends data to server using a method and body
const useSend: UseSend = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<boolean | Error>(false);

  const send = async (url: string, options: RequestInit) => {
    const defaultOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include',
    };
    try {
      setIsLoading(true);
      const res = await fetch(url, {
        ...defaultOptions,
        ...options,
      });

      setIsLoading(false);
      return await res.json();
    } catch (error: any) {
      setError(error);
      //show toast
      alert('something went wrong, please try again later');
      return { data: null };
    } finally {
      setIsLoading(false);
    }
  };

  return [send, isLoading, error];
};

export default useSend;
