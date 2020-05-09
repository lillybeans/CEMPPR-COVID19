var currentPage = 1 //update this

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
  var searchResultsNavDiv = $(searchResultsDiv).parentsUntil('.questions_page').parent().find('nav').find('.search_results_nav').first()
  var questionsResultsNavDiv = $(searchResultsDiv).parentsUntil('.questions_page').parent().find('nav').find('.questions_results_nav').first()

  if (questionText == "" && surveyText == "") {
    console.log("Clearing both!")
    currentPage = 1
    $(searchResultsNavDiv).addClass("hide")
    $(searchResultsDiv).addClass("hide")

    $(questionsResultsNavDiv).removeClass("hide")
    $(questionsResultsDiv).removeClass("hide")
  } else {
    //SEARCH
    $.post("/database/search/questions/"+currentPage, {
        "question": questionText,
        "survey": surveyText
      })
      .then(function(searchHTML) {

        //Hide question nav + results
        $(questionsResultsNavDiv).addClass("hide") //hide question results
        $(questionsResultsDiv).addClass("hide")

        $(searchResultsNavDiv).removeClass("hide")
        $(searchResultsDiv).removeClass("hide")
        $(searchResultsDiv).html(searchHTML)

        //Render Search Page Navigation HTML, which is hidden inside the Search Results Template
        var searchResultsNavTemplateHtml = $(searchResultsDiv).find('.search_results_nav_template').first().html()
        $(searchResultsNavDiv).html(searchResultsNavTemplateHtml)



      }).fail(function() {
        console.log("Search Questions failed!")
      })
  }
}


function searchPage(pageNumber){
  var questionSearchText = $('input.search.question').first().val()
  var surveySearchText = $('input.search.survey').first().val()
  var input = $('input.search.question').first()

  currentPage = pageNumber
  search(questionSearchText, surveySearchText, input)
}
