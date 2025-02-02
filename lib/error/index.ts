export function errorHandler(error?: any, name?: string, from?: string) {
  const logger = console.error; // Use console.error for better visibility

  logger('🚨 ERROR OCCURRED 🚨');
  logger(`🔹 Location: ${name || 'Unknown'}`);

  if (from === 'axios' && error?.isAxiosError) {
    logger('🔸 Axios Error:');

    if (error.response) {
      logger('An error occured');
      // logger(`🔹 Status: ${error.response.status}`);
      // logger('🔹 Response Data:', JSON.stringify(error.response.data, null, 2));
      // logger('🔹 Headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      logger(
        '🔹 No response received:',
        // error.request
      );
    } else {
      logger(
        '🔹 Message:',
        //  error.message
      );
    }
  } else {
    logger(
      '🔹 Error Details:',
      // typeof error === 'object' ? JSON.stringify(error, null, 2) : error,
    );
  }

  logger('⚠️ END OF ERROR LOG ⚠️');
}
