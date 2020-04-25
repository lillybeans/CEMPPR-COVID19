$(function() {
  $('input[name="is_existing"]').click(function() {
    var radio = $(this);
    var dropdown = $('select[name="select_existing_survey"]')
    if (radio.val() == "yes") {
      dropdown.show() //prompt user to select existing survey
    } else {
      dropdown.hide()
      $('#did_sample_size_change').hide() //hide all subsequent questions
    }
  });

  $('#select_existing_survey').change(function() {
    var dropdown = $(this);
    if (dropdown.val() != "none") { //if user selected an existing survey
      //ask if sample size change
      $('#did_sample_size_change').show() //show "Did Sample Size change"
      $("#q2no").prop("checked", true);
    } else {
      $('#did_sample_size_change').hide()
    }
  });

  $('input[name="did_ss_change"]').click(function() {
    var radio = $(this);
    var textbox = $('#sample_size_textbox')
    if (radio.val() == "yes") {
      textbox.show()
    } else {
      textbox.hide()
    }
  });
});
