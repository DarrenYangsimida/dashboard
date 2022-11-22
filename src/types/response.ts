declare global {
  type KubeRequest = {
    [params: string]: any;
  };

  type KubeResponse<T, U> = {
    Data: T;
    Message: string;
    ErrorData: U;

    data: T;
    message: string;
  };

  type KubePaginationRequest = {
    size: number;
    page: number;
    [params: string]: any;
  };

  type KubePaginationResponse<T> = {
    List: T;
    CurrentPage: number;
    CurrentSize: number;
    Total: number;

    list: T;
    page: number;
    size: number;
    total: number;
  };
}

export {};
