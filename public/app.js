
function getArticles() {
  $("#articles").empty();
// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class='appendedArticle'><p class='articleTitle'>" + data[i].title + "</p><p class='articleSummary'>" + data[i].summary + "</p><p class='articleLink'><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "</a></p><p class='buttonRow'><button data-id='" + data[i]._id + "' class= 'addNoteBtn' type ='button'>Note</button><button data-id='" + data[i]._id +"' class='saveArticleBtn' type='button'>Save</button><button action='#' data-id='" + data[i]._id +"' class='deleteBtn' type='button'>Delete</button></p></br></div>")
    }
  });
}

function getSavedArticles() {
  $("#articles").empty();
  $.getJSON("/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='appendedArticle'><p class='articleTitle'>" + data[i].title + "</p><p class='articleSummary'>" + data[i].summary + "</p><p class='articleLink'><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "</a></p><p class='buttonRow'><button data-id='" + data[i]._id + "' class= 'addNoteBtn' type ='button'>Note</button><button data-id='" + data[i]._id +"' class='removeArticleBtn' type='button'>Remove Article</button></p></div>")
  }
})
};

$("#getSavedArticles").click(function() {
  getSavedArticles();
});

  $(document).on("click", ".deleteBtn", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/delete/" + thisId
    })
    .done(function(data) {
      // alert("Article deleted");
      $("#articles").empty();
      getArticles();
    })
  });

  $(document).on("click", ".saveArticleBtn", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/save/" + thisId
    })
    .done(function(data) {
      alert("article saved")
    })
  });

  $(document).on("click", ".removeArticleBtn", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "POST",
      url: "/remove/" + thisId
    })
    .done(function(data) {
      // alert("Article Removed");
      getSavedArticles();
    })
  });

  $(document).on("click", ".addNoteBtn", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function(data) {
        console.log(data);
        // The title of the article
        $("#notes").append("<h3>" + data.title + "</h3>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>close</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article
    var thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  // on page load, get articles
  getArticles();
  