function showQuestion(questionLink){
  $(questionLink).addClass("active")
  $(questionLink).removeAttr("href")

  var surveyLink = $(questionLink).siblings().first()
  $(surveyLink).removeClass("active")
  $(surveyLink).attr("href","#")

  var form = $(surveyLink).parentsUntil('form').parent()
  var questionDetailsDiv =  $(form).find('.question_details').first()
  var surveyDetailsDiv = $(form).find('.survey_details').first()

  $(surveyDetailsDiv).addClass("hide")
  $(questionDetailsDiv).removeClass("hide")
}

function showSurvey(surveyLink){
  $(surveyLink).addClass("active")
  $(surveyLink).removeAttr("href")

  var questionLink = $(surveyLink).siblings().first()
  $(questionLink).removeClass("active")
  $(questionLink).attr("href","#")

  var form = $(surveyLink).parentsUntil('form').parent()
  var questionDetailsDiv =  $(form).find('.question_details').first()
  var surveyDetailsDiv = $(form).find('.survey_details').first()

  $(questionDetailsDiv).addClass("hide")

  //if we already fetched the data, don't refetch. display and return
  if(surveyDetailsDiv.hasClass("hasFetched")){
    $(surveyDetailsDiv).removeClass("hide")
    return
  }

  //Else: fetch our survey

}
