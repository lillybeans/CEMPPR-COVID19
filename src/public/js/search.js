function searchQuestion(input) {
  var questionSearchText = $(input).val()
  var surveySearchText = $(input).parentsUntil('.header').find('.search.survey').first().val()

  search(questionSearchText, surveySearchText, input)
}

function searchSurvey(input) {
  var surveySearchText = $(input).val()
  var questionSearchText = $(input).parentsUntil('.header').find('.search.question').first().val()

  search(questionSearchText, surveySearchText, input)
}

function search(questionText, surveyText, input) {
  var searchResultsDiv = $(input).parentsUntil('.table').parent().find('.search_results').first()
  var questionsResultsDiv = $(input).parentsUntil('.table').parent().find('.questions_results').first()

  if (questionText == "" && surveyText == "") {
    $(searchResultsDiv).addClass("hide")
    $(questionsResultsDiv).removeClass("hide")
  } else {
    //SEARCH
    $.post("/database/search/questions/1", {
        "question": questionText,
        "survey": surveyText
      })
      .then(function(searchHTML) {

        console.log("searchHTML is:"+searchHTML)
        $(questionsResultsDiv).addClass("hide")
        $(searchResultsDiv).removeClass("hide")
        $(searchResultsDiv).html(searchHTML)

      }).fail(function() {
        console.log("Search Questions failed!")
      })
  }
}
