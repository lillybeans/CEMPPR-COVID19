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

  console.log("next html is "+nextAnswerHtml)

  var removeButtonHtml = "<button type='button' tabindex=-1 class='btn btn-dark pb-1' onclick='removeAnswer(this)'>\n"+
                      "<ion-icon name='remove-outline'></ion-icon></button>"
  $(questionForm).children('.answer').last().find('.button_container').html(removeButtonHtml)
}

function removeAnswer(removeButton) {
  var answer = $(removeButton).closest('.answer')
  $(answer).remove()
}
