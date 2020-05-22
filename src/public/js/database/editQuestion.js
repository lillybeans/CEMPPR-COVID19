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
  var nextAnswerHtml = "<div class='answer row my-2' name='inserted'>" + $(lastAnswerClone).html() + "</div>"

  $(lastAnswer).find('input.percentage').removeClass('tapToAdd')

  var questionForm = $(lastAnswer).parent()
  $(questionForm).append(nextAnswerHtml)

  $(questionForm).children('.answer').last().find('.removeButton').show()
}

function removeAnswer(removeButton) {
  var answerToRemove = $(removeButton).closest('.answer')
  var answers = $(answerToRemove).parent()

  if ($(answerToRemove).attr('name') == "inserted"){ //user added option: just remove it
    $(answerToRemove).remove()
  } else { //existing option: do not remove it, hide it, we need it for the database update
    if ($(answerToRemove).attr('name','updated')){
      $(answerToRemove).removeAttr('updated')
    }
    $(answerToRemove).attr('name', 'deleted')
    $(answerToRemove).addClass("hide")
  }

  //add back the "tapToAdd" class to the new last answer
  $(answers).children(".answer[name!='deleted']").last().find('input.percentage').addClass('tapToAdd')

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
  $(form).find(".answer[name='inserted']").remove()

  //Restore all deleted Answers
  $(form).find(".answer[name='deleted']").removeClass("hide")
  $(form).find(".answer[name='deleted']").attr("name", "original")

  //Restore all updated answers
  $(form).find(".answer[name='updated']").attr("name", "original")

  //Restore all dropdowns
  $(form).find('option').attr('disabled', true)

  $(form).find('select').each(function() {
    $(this).html($(this).html())
  })

  //undo Keywords

  //remove all added keywords
  $(form).find(".allKeywords :checkbox.inserted").each(function(){
    $(this).prop("checked", false)
    $(this).removeClass("inserted")
  })

  //restore all deleted keywords
  $(form).find(".allKeywords :checkbox.deleted").each(function(){
    $(this).prop("checked", true)
    $(this).removeClass("deleted")
  })

  $(form).find(".allKeywords").addClass("hide")
  $(form).find(".questionKeywords").removeClass("hide")
}

//SAVE FUNCTIONS
$(function() {

  //These functions below must be dynamically bound because user could edit from search results

  //Save Question after Edit
  $('.questions_page').on("submit", "form.edit.question", function() {
    event.preventDefault()

    var questionId = $(this).attr('id').split('_')[1] //editQuestion_qid

    //Update each Option and Percentage to either: original, deleted, inserted or updated
    var inputs = $(this).find(".answer input").each(function(){
      var answer = $(this).parentsUntil(".answer").parent()
      var inputType = $(this).attr("name") //option or percentage
      var answerState = $(answer).attr("name")

      var name = inputType + "_" + answerState

      if (answerState != "inserted") {
        var optionId = $(answer).attr("id").split("_")[1]
        name += "_" + optionId
      }

      $(this).attr("name", name)
    })

    //Update each Keyword to be either: original, inserted, deleted
    var keywords = $(this).find(".allKeywords :checkbox").each(function(){
      if ($(this).hasClass("deleted")){
        $(this).attr("name", "keyword_deleted_" + $(this).attr('id'))
      } else if ($(this).hasClass("inserted")) {
        $(this).attr("name", "keyword_inserted_" + $(this).attr('id'))
      } else if ($(this).hasClass("original")) {
        $(this).attr("name", "keyword_original")
      }
    })

    var formData = $(this).serialize()

    var editButton = $(this).find('.editButton').first()
    var saveButton = $(this).find('.saveButton').first()
    var deleteButton = $(this).find('.deleteButton').first()
    var cancelButton = $(this).find('.cancelButton').first()
    var savedMessage = $(this).find('.saved-msg').first()

    var inputs = $(this).find('input')
    var options = $(this).find('option')
    var updatedAtInput = $(this).find('input[name="updated_at"]')

    console.log(formData)

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

  //Question: add answer

  $('.questions_page').on("keydown", "input.tapToAdd", function (e) {
    var inputValue = $(this).val();
    if(e.keyCode == 9) { //tab pressed
      var lastAnswer = $(this).closest(".answer[name!='deleted']")
      addAnswer(lastAnswer)
    }
  })

  //detect question options update
  $('.questions_page').on("input", ".answer[name!='inserted']", function (e) {
    console.log("Original answer updated")
    var answer = $(this).closest('.answer')
    if ($(answer).attr('name') != "inserted"){ //make sure we are not updating an inserted answer
      $(answer).attr("name", "updated")
    }
  })

  //Keywords
  $('.questions_page').on("change", ":checkbox", function (e) {
    if($(this).hasClass("original")) {
      if ($(this).prop('checked') == false) {
        $(this).addClass("deleted")

        //Create a deleted clone that is checked so the form can submit it
        var deletedClone = $(this).clone()
        $(deletedClone).prop("checked", true)
        $(deletedClone).attr("hidden", true)
        $(this).parent().append(deletedClone)
      } else {
        $(this).removeClass("deleted")
        $(this).siblings("input").first().remove()
      }
    } else {
      if ($(this).prop('checked') == true) {
        $(this).addClass("inserted")
      } else {
        $(this).removeClass("inserted")
      }
    }
  })

})
