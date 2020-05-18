$(function() {

$('#questions_container').on("keydown", "input.tapToAdd", function (e) {
  var inputValue = $(this).val();
  if(e.keyCode == 9) { //tab pressed
    var lastAnswer = $(this).closest('.answer')
    addAnswer(lastAnswer)
  }
});

})

function onSelectSurvey(dropdown){
  var selectedOption = $(dropdown).find(":selected").first()
  var sampleSize = $(selectedOption).attr('data-sample-size')
  $("#survey_sample_size").val(sampleSize)
  $("#current_sample_size").html(sampleSize)
}

function addAnswer(lastAnswer) {
  var lastAnswerHtml = $(lastAnswer).html()
  var nextAnswerHtml = "<div class='answer'>" + lastAnswerHtml + "</div>"

  $(lastAnswer).find('input.percentage').removeClass('tapToAdd')

  var questionForm = $(lastAnswer).parent()
  $(questionForm).append(nextAnswerHtml)

  $(questionForm).children('.answer').last().find('.removeButton').show()
}

function removeAnswer(removeButton) {
  var answer = $(removeButton).closest('.answer')
  var questionForm = $(answer).parent()
  $(answer).remove()

  //add back the "tapToAdd" class to the new last answer
  $(questionForm).children('.answer').last().find('input.percentage').addClass('tapToAdd')

}

function addQuestion(){
  var question = $('#questions').find('.question-template').first().html()
  var questionTemplate ="<div class='form-group question border border-dark rounded p-4'>\n" + question + "\n</div>"
  $('#questions').append(questionTemplate)
}

$(function() {

  // If answered "Use same sample size for this question?"
  $('input[name="use_same_sample_size"]').click(function() {
    var radio = $(this);
    var textbox = $('#custom_sample_size')
    if (radio.val() == "no") {
      textbox.prop("required",true)
      textbox.fadeIn("fast") //show sample size textbox
      textbox.attr("name","sample_size")
    } else {
      textbox.prop("required",false)
      textbox.fadeOut("fast") //hide textbox
      $("#survey_sample_size").attr("name","sample_size")
    }
  });

  $('form').submit( function(event){
    event.preventDefault()

    var shouldUseSurveySampleSize = $("#use_same_sample_size :checked").val()

    if (shouldUseSurveySampleSize == "yes") { //remove custom sample size
      $("#custom_sample_size").removeAttr("name")
    } else { //remove survey sample size
      $("#survey_sample_size").removeAttr("name")
    }

    var form = $(this)
    console.log("Submitted!")
    console.log(form.serialize())
  })

});
