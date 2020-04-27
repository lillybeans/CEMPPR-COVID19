function addAnswer(lastAddButton){
  var lastAnswer = $(lastAddButton).closest('.answer')
  var lastAnswerHtml = $(lastAnswer).html()

  var nextAnswerHtml = "<div class='answer'>" + lastAnswerHtml + "</div>"

  //Change this one to show remove button
  $(lastAddButton).html("<ion-icon name='remove-outline'></ion-icon>")
  $(lastAddButton).attr('onclick',"removeAnswer(this)")

  var questionForm = $(lastAnswer).parent()
  $(questionForm).append(nextAnswerHtml)
}

function removeAnswer(removeButton){
  var answer = $(removeButton).closest('.answer')
  $(answer).remove()
}
