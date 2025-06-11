export const successResponse = (
  res: any,
  message: string,
  result?: any,
  statusCode: number = 200,
) => {
  res.status(statusCode).json({
    status: 'success',
    error: null,
    message,
    result,
  });
};

export const errorResponse = (
  res: any,
  error: Error | string | unknown,
  statusCode: number = 500,
) => {
  res.status(statusCode).json({
    status: 'fail',
    error:
      typeof error !== 'string'
        ? (error as any).response || (error as any).message
        : error,
    result: null,
  });
};
