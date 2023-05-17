import { useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method: string,
      body: string,
      headers?: HeadersInit
    ) => {
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
          console.log("response");
          throw new Error(responseData.message);
        }
        return responseData;
      } catch (err) {
        console.log(err);
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

  return { sendRequest };
};
