const moment = require("moment");

module.exports = {
  truncate: (str, len) => {
    if(str.length > len){
      newStr = str.substring(0, len);
      return newStr+"...";
    }
    return str;
  },
  stripTags: (body) => {
    return body.replace(/<(?:.|\n)*?>/gm, " ");
  },
  formatDate: (date, format) => {
    return moment(date).format(format);
  },
  select: (selected, options) => {
    return options.fn(this).replace(new RegExp('value=\"'+selected+'\"'), '$& selected="selected"')
    .replace(new RegExp('>'+selected+'</option>'), 'selected=selected"$&"');
  },
  editIcon: (storyUserId, loggedUserId, storyId, floating = true) => {
    var userId = loggedUserId ? loggedUserId.toHexString() : null;

    if(storyUserId.toHexString() === userId){
      if(floating){
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab"><i class="fa fa-edit"></i></a>`;
      }
      else{
        return `<a href="/stories/edit/${storyId}"><i class="fa fa-edit"></i></a>`;
      }
    }
    else{
      return "";                                                          
    }    
  }                                           
}