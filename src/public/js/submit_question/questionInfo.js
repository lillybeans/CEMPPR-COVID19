function textChanged(element){
  if($(element).attr('name') == "survey_item") {
    if ($(element).val().length >= 3) { //user entered at least 3 chars
      showNext(element)
    }
  }
}

function dropdownChanged(element){
  showNext(element)
}

function checkboxClicked(element){
  showNext(element)
}

function showNext(currentElement){
  var currentParent = $(currentElement).parent('div').parent('div')
  //first check if current parent div is the last one in the section
  if ($(currentParent).hasClass("last-questionInfo")){
    //show Question Details Section
    $('#question_details').slideDown("fast")
    return
  }

  var currentIndex = $(currentParent).attr('id').split('_')[1] //get parent div index
  var nextIndex = Number(currentIndex) + 1
  var nextSelector = "div#questionInfo_" + nextIndex
  if($(nextSelector).hasClass("hide")){
    $(nextSelector).slideDown("fast")
    $(nextSelector).removeClass("hide")
  }
}
