Handlebars.registerHelper("add",function(a, b) {
    return  Number(a) + Number(b)
})

Handlebars.registerHelper("keywordColor", function(keyword){
  switch(keyword){
    case "Economics": return "primary"
    case "Fear": return "danger"
    default: return "secondary"
  }
})

function editSurvey(editButton) {
  var saveButton = $(editButton).siblings('.saveButton').first()
  var cancelButton = $(editButton).siblings('.cancelButton').first()
  var deleteButton = $(editButton).siblings('.deleteButton').first()

  $(saveButton).removeClass('hide')
  $(cancelButton).removeClass('hide')

  //Hide these buttons
  $(editButton).addClass('hide')
  $(deleteButton).addClass('hide')
  var form = $(editButton).parentsUntil('.form-container').parent().find('form').first() //parentsUntil: up to but not including matching parent

  //Change all inputs to be editable
  var inputs = $(form).find('input').removeAttr('readonly')

  //Clear Updated By so user can fill it out
  $(form).find('input[name="updated_by"]').val("")

  //remove any disabled dropdown options
  var dropdowns = $(form).find('option').removeAttr('disabled')
}

function showSurvey(button){
  var form = $(button).parentsUntil('.form-container').parent().find('form').first()

  var showQuestionsDiv = $(form).find('.show-questions').first()
  var showSurveyDiv = $(form).find('.show-survey').first()

  $(showQuestionsDiv).addClass("hide")
  $(showSurveyDiv).removeClass("hide")

  var links = $(form).find('.links')
  updateLinks(links)
}

function showSurveyQuestions(button){
  var form = $(button).parentsUntil('.form-container').parent().find('form').first()
  var showQuestionsDiv = $(form).find('.show-questions').first()
  var showSurveyDiv = $(form).find('.show-survey').first()
  var links = $(form).find('.links')

  //If we have already fetched questions details, do not refetch
  if($(showQuestionsDiv).hasClass("loaded")){
    $(showSurveyDiv).addClass("hide")
    $(showQuestionsDiv).removeClass("hide")
    updateLinks(links)
    return
  }

  var surveyId = $(form).attr('id')
  var data = ""

  //GET questions
  $.get("/database/surveys/"+surveyId+"/questions/1")
  .then(function(response) {
    data = response
    return $.get("/dynamic_views/showQuestions.hbs")
  }).then(function(src) {
    var showQuestionsHtml = Handlebars.compile(src)(data)

    $(showSurveyDiv).addClass("hide")
    $(showQuestionsDiv).addClass("loaded") //so we don't reload the questions
    $(showQuestionsDiv).html(showQuestionsHtml)

    updateLinks(links)
  }).fail( function() {
    alert("Show Questions failed!")
  })

}

//swap active and inactive
function updateLinks(links){
  var showSurveyLink = $(links).find('a.showSurveyLink').first()
  var showQuestionsLink = $(links).find('a.showQuestionsLink').first()

  if($(showSurveyLink).hasClass("active")){ //user selected "Show Questions"
    $(showSurveyLink).removeClass("active")
    $(showSurveyLink).attr("href","#")

    $(showQuestionsLink).addClass("active")
    $(showQuestionsLink).removeAttr("href")
  } else { //user selected "Show Survey"
    $(showSurveyLink).addClass("active")
    $(showSurveyLink).removeAttr("href")

    $(showQuestionsLink).removeClass("active")
    $(showQuestionsLink).attr("href","#")
  }
}

function cancelEditSurvey(cancelButton) {
  var editButton = $(cancelButton).siblings('.editButton').first()
  var saveButton = $(cancelButton).siblings('.saveButton').first()
  var deleteButton = $(cancelButton).siblings('.deleteButton').first()

  //Show these buttons
  $(editButton).removeClass('hide')
  $(deleteButton).removeClass('hide')

  $(saveButton).addClass('hide')
  $(cancelButton).addClass('hide')
  var form = $(editButton).parentsUntil('.form-container').parent().find('form').first()

  //restore all values, and change to readonly
  $(form).find('input').each(function() {
    $(this).val($(this).attr('value'))
    $(this).attr('readonly', true)
  })

  //Restore all dropdowns
  $(form).find('option').attr('disabled', true)

  $(form).find('select').each(function() {
    $(this).html($(this).html())
  })
}

function deleteSurveyWithId(id) {
  $.post("/database/delete/survey/"+id)
  .done( function(data) {
    location.reload()
  })
  .fail( function() {
    alert("Delete survey failed!")
  })
}

$(function() {

  //On Save: Submit Edit Survey
  $('form.edit.survey').submit(function(event) {
    event.preventDefault()

    console.log("form.edit_survey: on submit!")
    var surveyId = $(this).attr('id')
    var formData = $(this).serialize()

    var editButton = $(this).find('.editButton').first()
    var saveButton = $(this).find('.saveButton').first()
    var deleteButton = $(this).find('.deleteButton').first()
    var cancelButton = $(this).find('.cancelButton').first()
    var savedMessage = $(this).find('.saved-msg').first()

    var inputs = $(this).find('input')
    var options = $(this).find('option')
    var updatedAtInput = $(this).find('input[name="updated_at"]')

    $.post("/database/update/survey/"+surveyId, formData)
    .done( function(updatedAtTimestamp) {
      console.log("update successful! updatedAt "+updatedAtTimestamp)

      $(savedMessage).fadeIn(500).delay(2000).fadeOut(500)

      $(editButton).removeClass('hide')
      $(deleteButton).removeClass('hide')

      $(saveButton).addClass('hide')
      $(cancelButton).addClass('hide')

      $(updatedAtInput).val(updatedAtTimestamp)

      //Change all inputs to readonly
      $(inputs).attr('readonly', true)
      $(options).attr('disabled', true)
    })
    .fail( function() {
      alert("Update survey failed!")
    })

  })

})
