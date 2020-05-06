function searchQuestion(input) {
  var text = $(input).val()
  var searchResultsDiv = $(input).parentsUntil('.table').parent().find('.search_results').first()
  var questionsListDiv = $(input).parentsUntil('.table').parent().find('.questions_list').first()

  if (text == "") {
    $(searchResultsDiv).addClass("hide")
    $(questionsListDiv).removeClass("hide")
  } else {
    //SEARCH
    $.post("/database/search/questions", text)
      .then(function(response) {
        data = response
        return $.get("/dynamic_views/searchQuestionResults.hbs")
      }).then(function(src) {
        var searchQuestionResultsHtml = Handlebars.compile(src)(data)

        $(questionsListDiv).addClass("hide")
        $(searchResultsDiv).html(searchQuestionResultsHtml)

      }).fail(function() {
        alert("Search Questions failed!")
      })
  }

}

function searchSurvey(input) {
  let text = $(input).val()
  console.log("search for: " + text)
}
