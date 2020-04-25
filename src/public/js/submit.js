$(function() {

  //if "Is this an existing survey" is answered
  $('input[name="is_existing"]').click(function() {
    var radio = $(this);
    var dropdown = $('select[name="select_existing_survey"]')
    if (radio.val() == "yes") {
      dropdown.fadeIn("fast") //prompt user to select existing survey
    } else {
      dropdown.fadeOut("fast")
      $('#did_sample_size_change_and_below').slideUp("fast") //hide all subsequent questions
    }
  });

  $('#select_existing_survey').change(function() {
    var dropdown = $(this);
    if (dropdown.val() != "") { //if user selected an existing survey
      //ask if sample size change
      $('#did_sample_size_change_and_below').slideDown("fast") //show "Did Sample Size change"
      //$("#q2no").prop("checked", true);
      $('#sample_size_textbox').fadeOut("fast")
    } else {
      $('#did_sample_size_change_and_below').slideUp("fast")
    }
  });

  $('input[name="did_ss_change"]').click(function() {
    var radio = $(this);
    var textbox = $('#sample_size_textbox')
    $('#new_survey').slideDown()
    if (radio.val() == "yes") {
      textbox.fadeIn("fast")
    } else {
      textbox.fadeOut("fast")
    }
  });
});
