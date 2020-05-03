function editSurvey(editButton){
  var saveButton = $(editButton).siblings('.saveButton').first()
  $(saveButton).removeClass('hide')
  $(editButton).addClass('hide')
  var form = $(editButton).parent().parent()

  //Change all inputs to be editable
  var inputs = $(form).find('input').removeAttr('readonly')
  var dropdowns = $(form).find('option').removeAttr('disabled')
}

function isValidForm(form){
  var emptyRequiredInputs = $(form).find('input[required]').filter(function() { return $(this).val() == "" })
  if (emptyRequiredInputs.length > 0){
    console.log("one or more required inputs there are " + emptyRequiredInputs.length)
    return false
  }
  return true
}

$(function(){

  $('form.edit_survey').submit(function(event){
    event.preventDefault()

    var form = this

    if (isValidForm($(form))) {
      var editButton = $(form).find('.editButton').first()
      var saveButton = $(form).find('.saveButton').first()
      $(editButton).removeClass('hide')
      $(saveButton).addClass('hide')

      //Change all inputs to readonly
      var inputs = $(form).find('input').attr('readonly', true)
      var dropdowns = $(form).find('option').attr('disabled', true)
    }
    console.log('submit clicked!!!!! :)')
  })

})
