function editSurvey(editButton) {
  var saveButton = $(editButton).siblings('.saveButton').first()
  var cancelButton = $(editButton).siblings('.cancelButton').first()

  $(saveButton).removeClass('hide')
  $(cancelButton).removeClass('hide')
  $(editButton).addClass('hide')
  var form = $(editButton).parent().parent()

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

  $(editButton).removeClass('hide')
  $(saveButton).addClass('hide')
  $(cancelButton).addClass('hide')
  var form = $(editButton).parent().parent()

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

$(function() {

  //On submit: Submit Edit Survey
  $('form.edit_survey').submit(function(event) {
    event.preventDefault()

    var surveyId = $(this).attr('id')
    var formData = $(this).serialize()
    var editButton = $(this).find('.editButton').first()
    var saveButton = $(this).find('.saveButton').first()
    var cancelButton = $(this).find('.cancelButton').first()
    var inputs = $(this).find('input')
    var options = $(this).find('option')
    var updatedAtInput = $(this).find('input[name="updated_at"]')

    $.post("/update/survey/"+surveyId, formData)
    .done( function(updatedAtTimestamp) {
      console.log("update successful! updatedAt "+updatedAtTimestamp)

      $(editButton).removeClass('hide')
      $(saveButton).addClass('hide')
      $(cancelButton).addClass('hide')

      $(updatedAtInput).val(updatedAtTimestamp)

      //Change all inputs to readonly
      $(inputs).attr('readonly', true)
      $(options).attr('disabled', true)
    })
    .fail( function() {
      alert("Survey update failed!")
    })

  })

})
