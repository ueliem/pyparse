var reserved_words = ["",];
var text_characters;
var special_characters = ["{", "}", "(", ")", ".", ",", "=", ":", ";"];

statesEnum = Object.freeze({
    STARTSTATE : 0,
    OUTERSTATE : 1,
    STRINGSTATE : 2
});

var indent_count = 0;
var current_state;

//This function will split a string of python code into tokens
function tokenize(code) {
    var tokens = [];
    var current_token = "";
    current_state = statesEnum.STARTSTATE;
    var start_of_token, end_of_token = 0;

    //Iterate through the inputted code character by character
    for (var i = 0, len = code.length; i < len; i++) {
        if (current_state == statesEnum.STARTSTATE) {
            if (special_characters.indexOf(code[i]) == -1) {
                if (code[i] == " ") {
                    //console.log(current_token);
                    if (current_token !== "") {
                        tokens.push(current_token);
                    }
                    current_token = "";
                }
                else if (code[i] == "\"") {
                    //console.log(current_token);
                    if (current_token !== "") {
                        tokens.push(current_token);
                    }
                    current_token = "";
                    current_token += code[i];
                    // console.log(current_token);
                    // if (current_token !== "") {
                    //     tokens.push(current_token);
                    // }
                    // current_token = "";
                    current_state = statesEnum.STRINGSTATE;
                }
                else {
                    current_token += code[i];
                }
            }
            else {
                if (current_token !== "") {
                    tokens.push(current_token);
                }
                current_token = "";
                current_token += code[i];
                if (current_token !== "") {
                    tokens.push(current_token);
                }
                current_token = "";
            }
        }
        else if (current_state == statesEnum.STRINGSTATE) {
            if (special_characters.indexOf(code[i]) == -1) {
                if (code[i] == "\"") {
                    //console.log(current_token);
                    current_token += code[i];
                    if (current_token !== "") {
                        tokens.push(current_token);
                    }
                    current_token = "";
                    //console.log(current_token);
                    if (current_token !== "") {
                        tokens.push(current_token);
                    }
                    current_token = "";
                    current_state = statesEnum.STARTSTATE;
                }
                else {
                    current_token += code[i];
                }
            }
        }
    }
    //console.log(current_token);
    //Push the final token
    if(current_token !== "") {
        tokens.push(current_token);
    }
    current_token = "";

    console.log(tokens);
    return tokens;
}
