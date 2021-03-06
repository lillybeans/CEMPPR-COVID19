
const helpers = {
  ifEquals: function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  },
  minus: function(a, b) {
    return  a - b
  },
  list: function(index, page){
    return (page - 1)*20 + Number(index) + 1
  },
  add: function(a, b) {
    return  Number(a) + Number(b)
  },
  shouldAddNewRow: function(currentIndex, itemsPerRow){
    return (Number(currentIndex + 1) % Number(itemsPerRow) == 0)
  },
  containsKeyword: function(a, b){
    for(i in a){
      if (a[i]["keyword"] == b) {
        return true
      }
    }
    return false
  },
  formatDate: function(dateString) {
    if (dateString == null)
      return ""
    return dateString.split(" ")[0]
  },
  recordsRange: function(page, total){
    var upper = page*20
    var lower = upper - 20 + 1
    if (upper > total){
      upper = total
    }
    return lower+"-"+upper
  },
  keywordColor: function(keyword){
    switch(keyword){
      case "Economics":
      case "Employment":
      case "Return to Normal":
      case "Politics":
        return "primary"
      case "Fear":
      case "Illness":
      case "Hospitals":
        return "danger"
      case "Trust":
      case "Healthcare":
      case "Food":
      case "Hygiene":
        return "success"
      case "Spread":
      case "Testing":
      case "Travel":
      case "Vaccine":
      case "Self-isolation":
      case "Physical Distancing":
        return "warning"
      case "News":
      case "Media":
      case "Social Media":
        return "purple-dark"
      case "Science":
        return "turqoise"
      default:
        return "secondary"
    }
  }
}

module.exports = helpers
