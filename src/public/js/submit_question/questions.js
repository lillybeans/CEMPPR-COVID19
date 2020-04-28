$(function() {

$('#questions_container').on("keydown", "input.percentage", function (e) {
  var inputValue = $(this).val();
  if(e.keyCode == 9) { //tab pressed
    var lastAnswer = $(this).closest('.answer')
    addAnswer(lastAnswer)
  }
});

})

function addAnswer(lastAnswer) {
  var lastAnswerHtml = $(lastAnswer).html()
  var nextAnswerHtml = "<div class='answer'>" + lastAnswerHtml + "</div>"

  var questionForm = $(lastAnswer).parent()
  $(questionForm).append(nextAnswerHtml)

  $(questionForm).children('.answer').last().find('.removeButton').show()
}

function removeAnswer(removeButton) {
  var answer = $(removeButton).closest('.answer')
  $(answer).remove()
}

function addQuestion(){
  var question = $('#questions').find('.question-template').first().html()
  var questionTemplate ="<div class='form-group question border border-dark rounded p-4'>\n" + question + "\n</div>"
  $('#questions').append(questionTemplate)
}