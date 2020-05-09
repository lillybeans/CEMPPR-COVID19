function showQuestion(questionLink){
  $(questionLink).addClass("active")
  $(questionLink).removeAttr("href")

  var surveyLink = $(questionLink).siblings().first()
  $(surveyLink).removeClass("active")
  $(surveyLink).attr("href","#")
}

function showSurvey(surveyLink){
  $(surveyLink).addClass("active")
  $(surveyLink).removeAttr("href")

  var questionLink = $(surveyLink).siblings().first()
  $(questionLink).removeClass("active")
  $(questionLink).attr("href","#")

}
