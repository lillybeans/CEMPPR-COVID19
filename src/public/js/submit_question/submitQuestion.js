$(function() {

// Toggling the option from the "Select Survey" dropdown
  $('#select_survey').change(function() {
    var dropdown = $(this);
    if (dropdown.val() != "") { //if user selected a survey
      showUseSameSampleSize()
    } else {
      hideUseSameSampleSize()
      hideNewSurvey()
    }
  });

  // If answered "Use same sample size for this question?"
  $('input[name="use_same_sample_size"]').click(function() {
    var radio = $(this);
    var textbox = $('#sample_size_textbox')
    showQuestionInfo()
    if (radio.val() == "no") {
      textbox.prop("required",true)
      textbox.fadeIn("fast") //show sample size textbox
    } else {
      textbox.prop("required",false)
      textbox.fadeOut("fast") //hide textbox
    }
  });
});

$(function() {
  $('form').submit( function(){
    var form = $(this)
    console.log("Submitted!")
    console.log(form.serialize())
  })

});

function showSelectSurveyDropdown(){
  var dropdown = $('select[name="select_survey"]')
  //add 'required' to dropdown
  dropdown.prop("required", true)
  dropdown.fadeIn("fast")
}

function hideSelectSurveyDropdown(){
  var dropdown = $('select[name="select_survey"]')
  //remove 'requied' on dropdown
  dropdown.prop("required", false)
  dropdown.fadeOut("fast")
}

function showUseSameSampleSize(){
  $('#use_same_sample_size').slideDown("fast") //show "Did Sample Size change"
  $('#q2no').prop('checked', false);
  $('#q2yes').prop('checked', false);
}

function hideUseSameSampleSize(){
  $('#sample_size_textbox').prop("required",false) //make sure we remove this property
  $('#use_same_sample_size').slideUp("fast")
}

function showNewSurvey(){
  $('#new_survey').slideDown("fast")
  hideQuestionDetails()
}

function hideNewSurvey(){
  $('#new_survey').slideUp("fast")
  hideQuestionDetails()
}

function showQuestionInfo(){
  $('#question_info').slideDown("fast")
}

function hideQuestionInfo(){
  $('#question_info').slideUp("fast")
}

function showQuestionDetails(){
  $('#question_details').slideDown("fast")
}

function hideQuestionDetails(){
  $('#question_details').slideUp("fast")
}