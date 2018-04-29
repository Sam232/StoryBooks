module.exports = {
  mongooseConnect: (mongoose) => {
    mongoose.connect("mongodb://SamuelKobina:newPassword1@ds261929.mlab.com:61929/storybooks-production").then((res) => {
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