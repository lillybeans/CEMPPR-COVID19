$(function() {
  $('input[name="is_existing"]').click(function() {
    var radio = $(this);
    var dropdown = $('select[name="select_existing_survey"]')
    if (radio.val() == "yes") {
      dropdown.show()
    } else {
      dropdown.hide()
    }
  });

  $('#select_existing_survey').change(function() {
    var dropdown = $(this);
    if (dropdown.val() != "none") {
      //ask if sample size change

    } else {
      console.log("None!")
    }
  });
});
