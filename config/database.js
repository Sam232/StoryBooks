const devMongoDBURI = require("./keys/keys_dev").mongoDBURI;
const prodMongoDBURI = require("./keys/keys_prod").mongoDBURI;

module.exports = {
  mongooseConnect: (mongoose) => {
    mongoose.connect(devMongoDBURI || prodMongoDBURI).then((res) => {
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