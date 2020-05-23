$(function(){

  $('#submit_survey').on("submit", function(event){
    event.preventDefault()
    var formData = $(this).serialize()

    console.log(formData)

    $.post("/submit/survey/", formData)
    .done( function(res) {
      $("#success_message").fadeIn(500)
    })
    .fail( function() {
      alert("Submit survey failed!")
    })
  })
})
