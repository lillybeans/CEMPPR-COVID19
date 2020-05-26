$(function(){

  $('#submit_survey').on("submit", function(event){
    event.preventDefault()
    var formData = $(this).serialize()

    console.log(formData)

    $.post("/submit/survey/", formData)
    .done( function(res) {
      window.location = "/submit/survey/submitted"
    })
    .fail( function() {
      alert("Submit survey failed!")
    })
  })
})
