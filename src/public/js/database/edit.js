function editQuestion(editButton) {
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
  $(form).find('.answers input').removeAttr('readonly')

  //Add a remove button to all the answers that can be removed
  $(form).find('.answer').each(function() {
    if($(this).hasClass('canRemove')){
      $(this).find('button.removeButton').removeClass("hide")
    }
  })

  //Clear Updated By so user can fill it out
  $(form).find('input[name="updated_by"]').val("")

  //remove any disabled dropdown options
  var dropdowns = $(form).find('option').removeAttr('disabled')
}


function addAnswer(lastAnswer) {
  var lastAnswerClone = $(lastAnswer).clone()
  $(lastAnswerClone).find('input').attr('value','') //clear inputs of the clone to provide a blank slate
  var nextAnswerHtml = "<div class='answer inserted row my-2'>" + $(lastAnswerClone).html() + "</div>"

  $(lastAnswer).find('input.percentage').removeClass('tapToAdd')

  var questionForm = $(lastAnswer).parent()
  $(questionForm).append(nextAnswerHtml)

  $(questionForm).children('.answer').last().find('.removeButton').show()
}

function removeAnswer(removeButton) {
  var answer = $(removeButton).closest('.answer')
  var answers = $(answer).parent()
  $(answer).remove()

  //add back the "tapToAdd" class to the new last answer
  $(answers).children('.answer').last().find('input.percentage').addClass('tapToAdd')

}

function cancelEditQuestion(cancelButton) {
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

/** survey **/

function editSurvey(editButton) {
  var saveButton = $(editButton).siblings('.saveButton').first()
  var cancelButton = $(editButton).siblings('.cancelButton').first()
  var deleteButton = $(editButton).siblings('.deleteButton').first()

  $(saveButton).removeClass('hide')
  $(cancelButton).removeClass('hide')

  //Hide these buttons
  $(editButton).addClass('hide')
  $(deleteButton).addClass('hide')
  var form = $(editButton).parentsUntil('form.edit.survey').parent().first() //parentsUntil: up to but not including matching parent

  //Change all inputs to be editable
  var inputs = $(form).find('input').removeAttr('readonly')

  //Clear Updated By so user can fill it out
  $(form).find('input[name="updated_by"]').val("")

  //remove any disabled dropdown options
  var dropdowns = $(form).find('option').removeAttr('disabled')
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
  var form = $(editButton).parentsUntil('form.edit.survey').parent().first()

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

//SAVE FUNCTIONS
$(function() {

  //These functions below must be dynamically bound because user could edit from search results

  //Save Question after Edit
  $('.questions_page').on("submit", "form.edit.question", function() {
    event.preventDefault()

    var questionId = $(this).attr('id')
    var formData = $(this).serialize()

    var editButton = $(this).find('.editButton').first()
    var saveButton = $(this).find('.saveButton').first()
    var deleteButton = $(this).find('.deleteButton').first()
    var cancelButton = $(this).find('.cancelButton').first()
    var savedMessage = $(this).find('.saved-msg').first()

    var inputs = $(this).find('input')
    var options = $(this).find('option')
    var updatedAtInput = $(this).find('input[name="updated_at"]')

    $.post("/database/update/question/"+questionId, formData)
    .done( function(updatedAtTimestamp) {
      console.log("Success! updated question with questionId="+ questionId + ", updatedAt "+updatedAtTimestamp)
+
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


  //Save Survey after Edit
  $('.questions_page').on("submit", "form.edit.survey", function() {
    event.preventDefault()

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
      console.log("Success! updated survey with surveyId="+ surveyId + ", updatedAt "+updatedAtTimestamp)
+
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

  //Question: add answer

  $('.answers').on("keydown", "input.tapToAdd", function (e) {
    console.log(".answers Tapped!")
    var inputValue = $(this).val();
    if(e.keyCode == 9) { //tab pressed
      var lastAnswer = $(this).closest('.answer')
      addAnswer(lastAnswer)
    }
  })

})
