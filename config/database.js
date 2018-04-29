const MongoDBURI = require("./keys/keys").mongoDBURI;

module.exports = {
  mongooseConnect: (mongoose) => {
    mongoose.connect(MongoDBURI).then((res) => {
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