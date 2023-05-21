import { useCallback, useRef, useEffect, useState } from "react";

export const useHttpClient = () => {
  const activeHttpRequests = useRef<AbortController[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendRequest = useCallback(
    async (
      url: string,
      method: string | undefined,
      body: string | null,
      headers?: HeadersInit
    ) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      try {
        // for (const key of body.entries()) {
        //   console.log(key[0] + ", " + key[1]);
        // }
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal,
        });
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        // console.log("error");
        alert(err);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { sendRequest, isLoading };
};
