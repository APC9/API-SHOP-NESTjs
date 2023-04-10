
export const fileFilter = ( 
  req: Express.Request, 
  file: Express.Multer.File, 
  callback: Function 
  ) => {

    if (!file) return callback( new Error('File is empty'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['png', 'jpg', 'jpeg', 'gif', 'svg'];

    if ( validExtension.includes(fileExtension)) {
      return callback( null, true);
    }
    
    callback( null, false )

}