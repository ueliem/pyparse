//TODO: Add tokenize strings based on multiple quotes.

var reserved_words = ["",];
var text_characters;
var special_characters = ["{", "}", "(", ")", ".", ",", "=", ":", ";", "@", "%"];

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
    var col_start = 0;
    var row_start = 0;
    var col_end = 0;
    var row_end = 0;
    current_state = statesEnum.STARTSTATE;
    var start_of_token, end_of_token = 0;

    function pushToken(token) {
        if(token !== "") {
            tokens.push(new Token(token, row_start, col_start, row_end, col_end));
            current_token = "";
            col_start = 0;
            token_start = 0;
            col_end = 0;
            token_end = 0;
        }
    }

    //Iterate through the inputted code character by character
    for (var i = 0, len = code.length; i < len; i++) {
        if (current_state == statesEnum.STARTSTATE) {
            if (special_characters.indexOf(code[i]) == -1) {
                if (code[i] == " ") {
                    pushToken(current_token);
                }
                else if (code[i] == "\"") {
                    pushToken(current_token);
                    current_token += code[i];
                    current_state = statesEnum.STRINGSTATE;
                }
                else {
                    current_token += code[i];
                }
            }
            else if (code[i] == "\n") {//TODO: Allow for statements to wrap multiple lines
                pushToken(current_token);
                current_token += code[i];
                pushToken(current_token);
            }
            else {
                pushToken(current_token);
                current_token += code[i];
                pushToken(current_token);
            }
        }
        else if (current_state == statesEnum.STRINGSTATE) {
            if (special_characters.indexOf(code[i]) == -1) {
                if (code[i] == "\"") {
                    current_token += code[i];
                    pushToken(current_token);
                    //pushToken(current_token);
                    current_state = statesEnum.STARTSTATE;
                }
                else {
                    current_token += code[i];
                }
            }
        }
    }
    //Push the final token
    pushToken(current_token);

    //console.log(tokens);
    return tokens;
}
