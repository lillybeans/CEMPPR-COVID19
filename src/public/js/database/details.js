function showQuestion(questionLink){
  $(questionLink).addClass("active")
  $(questionLink).removeAttr("href")

  var surveyLink = $(questionLink).siblings().first()
  $(surveyLink).removeClass("active")
  $(surveyLink).attr("href","#")

  var cardBody = $(surveyLink).parentsUntil('.card-body').parent()
  var questionDetailsDiv =  $(cardBody).find('.question_details').first()
  var surveyDetailsDiv = $(cardBody).find('.survey_details').first()

  $(surveyDetailsDiv).addClass("hide")
  $(questionDetailsDiv).removeClass("hide")
}

function showSurvey(surveyLink){
  $(surveyLink).addClass("active")
  $(surveyLink).removeAttr("href")
  var surveyId = $(surveyLink).attr("data-value")

  console.log("surveyId is "+surveyId)

  var questionLink = $(surveyLink).siblings().first()
  $(questionLink).removeClass("active")
  $(questionLink).attr("href","#")

  var cardBody = $(surveyLink).parentsUntil('.card-body').parent()
  var questionDetailsDiv =  $(cardBody).find('.question_details').first()
  var surveyDetailsDiv = $(cardBody).find('.survey_details').first()

  $(questionDetailsDiv).addClass("hide")
  $(surveyDetailsDiv).removeClass("hide")

  //if we already fetched the data, don't refetch. display and return
  if($(surveyDetailsDiv).hasClass("hasFetched")){
    console.log("Already fetched this survey, skipping fetch...")
    $(surveyDetailsDiv).removeClass("hide")
    return
  }

  //Else: fetch our survey
  $.get("/database/survey_partial/"+surveyId)
    .then(function(surveyPartialHTML) {
      $(surveyDetailsDiv).html(surveyPartialHTML)
      $(surveyDetailsDiv).addClass("hasFetched")

    }).fail(function() {
      console.log("Fetching for Survey_Patial failed!")
    })

}
