const responseMessage = {
  CREATE: 'Created success',
  UPDATE: 'Updated success',
  REMOVE: 'Removed success',
  RESTORE: 'Restored success',
  NOT_FOUND: 'Record not found',
  NO_DATA_RESTORE: 'There are no data to restore',
  NO_FILE: 'No files were uploaded',
  SERVER_ERROR: 'Something wrong',
} as const;

export default responseMessage;
