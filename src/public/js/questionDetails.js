function searchQuestion(input) {
  var text = $(input).val()
  var searchResultsDiv = $(input).parentsUntil('.table').parent().find('.search_results').first()
  var questionsListDiv = $(input).parentsUntil('.table').parent().find('.questions_list').first()

  if (text == "") {
    $(searchResultsDiv).addClass("hide")
    $(questionsListDiv).removeClass("hide")
  } else {
    //SEARCH
    $.post("/database/search/questions/1", {"text":text})
      .then(function(response) {
        data = response
        return $.get("/dynamic_views/searchQuestionResults.hbs")
      }).then(function(src) {
        var searchQuestionResultsHtml = Handlebars.compile(src)(data)
        console.log("html is:"+searchQuestionResultsHtml)

        $(questionsListDiv).addClass("hide")
        $(searchResultsDiv).removeClass("hide")
        $(searchResultsDiv).html(searchQuestionResultsHtml)

      }).fail(function() {
        console.log("Search Questions failed!")
      })
  }

}

function searchSurvey(input) {
  let text = $(input).val()
  console.log("search for: " + text)
}
