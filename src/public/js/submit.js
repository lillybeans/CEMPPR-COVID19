$(function() {

  //if "Is this an existing survey" is answered
  $('input[name="is_existing"]').click(function() {
    var radio = $(this);
    var dropdown = $('select[name="select_existing_survey"]')
    if (radio.val() == "yes") {
      dropdown.fadeIn("fast") //prompt user to select existing survey
      hideNewSurvey()
    } else {
      dropdown.fadeOut("fast")
      hideDidSampleSizeChange()
      showNewSurvey()
    }
  });

// Toggling "Select Existing Survey" dropdown
  $('#select_existing_survey').change(function() {
    var dropdown = $(this);
    if (dropdown.val() != "") { //if user selected an existing survey
      showDidSampleSizeChange()
    } else {
      hideDidSampleSizeChange()
      hideNewSurvey()
    }
  });

  // If answered "Did sample size change for this question"
  $('input[name="did_ss_change"]').click(function() {
    var radio = $(this);
    var textbox = $('#sample_size_textbox')
    showQuestionDetails()
    if (radio.val() == "yes") {
      textbox.fadeIn("fast") //show sample size textbox
    } else {
      textbox.fadeOut("fast") //hide textbox
    }
  });
});

function showDidSampleSizeChange(){
  $('#did_sample_size_change').slideDown("fast") //show "Did Sample Size change"
  $('#q2no').prop('checked', false);
  $('#q2yes').prop('checked', false);
}

function hideDidSampleSizeChange(){
  $('#did_sample_size_change').slideUp("fast")
}

function showNewSurvey(){
  $('#new_survey').slideDown("fast")
  hideQuestionDetails()
}

function hideNewSurvey(){
  $('#new_survey').slideUp("fast")
  hideQuestionDetails()
}

function showQuestionDetails(){
  $('#question_details').slideDown("fast")
}

function hideQuestionDetails(){
  $('#question_details').slideUp("fast")
}
