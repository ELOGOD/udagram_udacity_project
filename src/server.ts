import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */


  app.get( "/filteredimage/", async ( req:express.Request, res:express.Response ) => {
    let { image_url } : {image_url: string} = req.query;
    // 1. Validating image query
    if ( !image_url ) {
      return res.status(400)
                .send(`Image URL is required, please try GET /filteredimage?image_url={{}}`);
    }
    if (image_url.slice(-4) != ('.jpg' || '.png')) {
      
      return res.status(500).send("your url is incorrect, please try again with a correct url");
    }
    try{
      //2. Filtering image via provided url
        const result : string = await filterImageFromURL(image_url);
      
        //3. sending resulting file in response
        return res.status(200)
        .sendFile(result, setTimeout(()=>{
                                // 4. deletes file on server on finish of the response in 10secs
                                deleteLocalFiles([result])}, 10000));
    }
    catch(error){
      return res.status(404).send(`Error: ${error} occured, try using url as https://i.pinimg.com/736x/f9/96/8d/f9968df268c7dab39bef20cff0a058cf.jpg , or another valid image url`);
    }
  } );
    

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (  req:express.Request, res:express.Response  ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();