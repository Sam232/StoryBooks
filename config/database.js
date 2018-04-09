module.exports = {
  mongooseConnect: (mongoose) => {
    mongoose.connect("mongodb://samuel:new_password@ds239309.mlab.com:39309/storybooks-dev").then((res) => {
      if(res){
        console.log("Connected To Production MongoDB Database Server");
      }
    })
    .catch((err) => {
      if(err){
        console.log(`Unable To Connect To The MongoDB Database Server, ${err}`);
      }
    });
  }
}