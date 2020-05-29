$(function(){

  $('form').on("submit", function(event){
    event.preventDefault()
    var formData = $(this).serialize()

    $.post("/register/", formData)
    .done( function(res) {
      window.location = "/login"
    })
    .fail( function(error) {
      $('#errorMsg').html(error.responseText).show()
    })
  })
})
