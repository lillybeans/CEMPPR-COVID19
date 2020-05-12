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
  $(form).find('input').removeAttr('readonly')

  //Add a remove button to all the answers that can be removed
  $(form).find('.answer').each(function() {
    if($(this).hasClass('canRemove')){
      $(this).find('button.removeButton').removeClass("hide")
    }
  })

  //Clear Updated By so user can fill it out
  $(form).find('input[name="updated_by"]').val("")

  //Enabling dropdowns: remove any disabled dropdown options
  var dropdowns = $(form).find('option').removeAttr('disabled')

  //update Keywords
  $(form).find(".allKeywords").removeClass("hide")
  $(form).find(".questionKeywords").addClass("hide")
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
  var answerToRemove = $(removeButton).closest('.answer')
  var answers = $(answerToRemove).parent()

  if ($(answerToRemove).hasClass('inserted')){ //user added option: just remove it
    $(answerToRemove).remove()
  } else { //existing option: do not remove it, hide it, we need it for the database update
    if ($(answerToRemove).hasClass('updated')){
      $(answerToRemove).removeClass('updated')
    }
    $(answerToRemove).addClass("deleted")
    $(answerToRemove).addClass("hide")
  }

  //add back the "tapToAdd" class to the new last answer
  $(answers).children('.answer:not(.deleted)').last().find('input.percentage').addClass('tapToAdd')

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

  //hide all remove buttons
  $(form).find('.answer .removeButton').addClass("hide")

  //Delete all inserted answers
  $(form).find('.answer.inserted').remove()

  //Restore all deleted Answers
  $(form).find('.answer.deleted').removeClass("hide deleted")

  //Restore all updated answers
  $(form).find('.answer.updated').removeClass("updated")

  //Restore all dropdowns
  $(form).find('option').attr('disabled', true)

  $(form).find('select').each(function() {
    $(this).html($(this).html())
  })

  //undo Keywords
  $(form).find(".allKeywords").addClass("hide")
  $(form).find(".questionKeywords").removeClass("hide")
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

    //Get latest options
    var insertedOptions = [] // [ {option:option, percentage: percentage} ]
    var deletedOptionIds = [] // [id]
    var updatedOptions = [] // [ {id:id, option:option, percentage: percentage} ]

    $(this).find(".answer.inserted").each(function(){
      var insertedAnswer = $(this)
      var option = $(insertedAnswer).find("input[name='option']").first().val()
      var percentage = $(insertedAnswer).find("input[name='percentage']").first().val()
      insertedOptions.push({"option": option,
                            "percentage": percentage})
    })

    $(this).find(".answer.deleted").each(function(){
      var deletedAnswer = $(this)
      var deletedId = $(deletedAnswer).attr('id').split("_")[1]
      deletedOptionIds.push(deletedId)
    })

    $(this).find(".answer.updated").each(function(){
      var updatedAnswer = $(this)
      var id = $(updatedAnswer).attr('id').split("_")[1]
      var option = $(updatedAnswer).find("input[name='option']").first().val()
      var percentage = $(updatedAnswer).find("input[name='percentage']").first().val()
      updatedAnswer.push({"id":id,
                          "option": option,
                          "percentage": percentage})
    })


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
      alert("Update question failed!")
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

    console.log("formData is: "+formData)

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

  $('.questions_page').on("keydown", "input.tapToAdd", function (e) {
    var inputValue = $(this).val();
    if(e.keyCode == 9) { //tab pressed
      var lastAnswer = $(this).closest('.answer:not(.deleted)')
      addAnswer(lastAnswer)
    }
  })

  //detect update
  $('.questions_page').on("input", ".answer:not(.inserted,.deleted) input", function (e) {
    console.log("Original answer updated")
    var answer = $(this).closest('.answer')
    if (!$(answer).hasClass("updated")){
      $(answer).addClass("updated")
    }
  })

  //Detect dropdown changes
  
})
