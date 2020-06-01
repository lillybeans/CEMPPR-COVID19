function deleteUsers(){
  const checkboxes = $('table input:checked')
  var ids = []

  for(var i=0; i<checkboxes.length; i++){
    var checkbox = checkboxes[i]
    ids.push($(checkbox).attr('name'))
  }
  $.post("/users/delete/", {"ids": ids})
  .done( function(res) {
    window.location = "/users/approved"
  })
  .fail( function() {
    alert("Delete users failed!")
  })
}

$(function(){

  $('form#pending_users').on("submit", function(event){
    event.preventDefault()
    var formData = $(this).serialize()

    $.post("/users/approve/", formData)
    .done( function(res) {
      window.location = "/users/pending"
    })
    .fail( function() {
      alert("Approve users failed!")
    })
  })
})
