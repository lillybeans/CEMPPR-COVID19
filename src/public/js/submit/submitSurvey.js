$(function(){

  $('#submit_survey').on("submit", function(event){
    event.preventDefault()
    var formData = $(this).serialize()

    console.log(formData)

    $.post("/submit/survey/", formData)
    .done( function(res) {
      location.reload()
    })
    .fail( function() {
      alert("Submit survey failed!")
    })
  })
})
