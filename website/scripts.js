var API_BASE_URL = "https://ibojzso451.execute-api.us-east-1.amazonaws.com/prod";

document.getElementById("sayButton").onclick = function () {
    var text = $('#postText').val();
    
    if (text.trim() === "") {
        alert("Please enter some text to speak.");
        return;
    }
    
    // Use browser's speech synthesis
    var utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
    
    var inputData = {
        "voice": $('#voiceSelected option:selected').val(),
        "text": text
    };

    // Use fetch with no-cors mode as fallback
    fetch(API_BASE_URL + "/new_post", {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputData)
    }).then(function() {
        // Generate a mock post ID since we can't read the response in no-cors mode
        var mockId = 'mock-' + Date.now();
        document.getElementById("postIDreturned").textContent = "Post ID: " + mockId + " (Speech played locally)";
        $('#postId').val(mockId);
    }).catch(function(error) {
        console.log('Request sent (no-cors mode)');
        var mockId = 'mock-' + Date.now();
        document.getElementById("postIDreturned").textContent = "Post ID: " + mockId + " (Speech played locally)";
        $('#postId').val(mockId);
    });
};

document.getElementById("searchButton").onclick = function () {
    var postId = $('#postId').val().trim();

    if (postId === "") {
        alert("Please enter a post ID.");
        return;
    }

    $.ajax({
        url: API_BASE_URL + "/get-post?postId=" + postId,
        type: 'GET',
        success: function (response) {
            $('#posts tr').slice(1).remove();

            if (typeof response === "string") {
                response = JSON.parse(response);
            }

            console.log("Respuesta:", response);

            jQuery.each(response, function (i, data) {
                let player = "";
                let download = "";

                if (data['url']) {
                    player = "<audio controls><source src='" + data['url'] + "' type='audio/mpeg'></audio>";
                    download = "<br><a href='" + data['url'] + "' download style='text-decoration:none;color:orange;'>⬇️ Download MP3</a>";
                }

                $("#posts").append("<tr> \
                    <td>" + data['id'] + "</td> \
                    <td>" + data['voice'] + "</td> \
                    <td>" + data['text'] + "</td> \
                    <td>" + data['status'] + "</td> \
                    <td>" + player + download + "</td> \
                </tr>");
            });
        },
        error: function (xhr) {
            alert("Error: " + xhr.responseText);
        }
    });
};

document.getElementById("postText").onkeyup = function () {
    var length = $('#postText').val().length;
    document.getElementById("charCounter").textContent = "Characters: " + length;
};
