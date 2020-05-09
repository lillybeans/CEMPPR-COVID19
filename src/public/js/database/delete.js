function deleteQuestionWithId(id){
  console.log("Deleting question with id:"+id)

  $.post("/database/delete/question/"+id)
  .done( function(data) {
    location.reload()
  })
  .fail( function() {
    alert("Delete survey failed!")
  })

}

function deleteSurveyWithId(id) {
  console.log("Deleting survey with id:"+id)
  $.post("/database/delete/survey/"+id)
  .done( function(data) {
    location.reload()
  })
  .fail( function() {
    alert("Delete survey failed!")
  })
}
