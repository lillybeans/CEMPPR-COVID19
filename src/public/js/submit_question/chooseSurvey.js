$(function() {

  // If answered "Use same sample size for this question?"
  $('input[name="use_same_sample_size"]').click(function() {
    var radio = $(this);
    var textbox = $('#sample_size_textbox')
    if (radio.val() == "no") {
      textbox.prop("required",true)
      textbox.fadeIn("fast") //show sample size textbox
    } else {
      textbox.prop("required",false)
      textbox.fadeOut("fast") //hide textbox
    }
  });

  $('.last-in-questionInfo')

});

$(function() {
  $('form').submit( function(){
    var form = $(this)
    console.log("Submitted!")
    console.log(form.serialize())
  })

});

function textChanged(text){
  console.log("Text changed!" + text)
}
