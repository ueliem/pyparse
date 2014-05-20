//TODO: Add tokenize strings based on multiple quotes.

var python_keywords = ['and', 'as', 'assert', 'break', 'class', 'continue',
    'def', 'del', 'elif', 'else', 'except', 'exec', 'finally', 'for',
    'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'not',
    'or', 'pass', 'print', 'raise', 'return', 'try', 'while', 'with', 'yield'];
var text_characters;
var special_characters = ["{", "}", "(", ")", ".", ",", ":", ";", "@"];
var followed_by_equals = ["=", "!", "%", "*", "/", "+", "-", "<", ">"];

statesEnum = Object.freeze({
    STARTSTATE : 0,
    EQUALSSTATE : 1,
    STRINGSTATE : 2,
    LINECOMMSTATE : 3
});

//This function will split a string of python code into tokens
function tokenize(code) {
    var current_state;
    var tokens = [];
    var current_token = "";
    var col_start = 0;
    var row_start = 0;
    var col_end = 0;
    var row_end = 0;
    var token_type;
    current_state = statesEnum.STARTSTATE;
    var start_of_token, end_of_token = 0;
    var indent_depth_current;
    var indent_depth_previous;

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
            if (code[i] == "\t") {
                current_token += code[i];
                pushToken(current_token);
                indent_depth_current++;
            }
            else {//Something other than a tab or whitespace beginning a line
                current_token += code[i];
                current_state = statesEnum.MIDSTATE;
            }
        }
        else if (current_state == statesEnum.MIDSTATE) {
            if (special_characters.indexOf(code[i]) == -1) {
                if (code[i] == " ") {
                    pushToken(current_token);
                }
                else if (code[i] == "\"") {
                    pushToken(current_token);
                    //current_token += code[i];
                    current_state = statesEnum.STRINGSTATE;
                }
                else if (code[i] == "\t") {
                    pushToken(current_token);
                    current_token += code[i];
                    pushToken(current_token);
                }
                else if (code[i] == "\n") {//TODO: Allow for statements to wrap multiple lines
                    pushToken(current_token);
                    current_token += code[i];
                    pushToken(current_token);
                    current_state = statesEnum.STARTSTATE;
                }
                else if (followed_by_equals.indexOf(code[i]) != -1) {
                    console.log("EQUALS");
                    pushToken(current_token);
                    current_token += code[i];
                    current_state = statesEnum.EQUALSSTATE;
                }
                else if (code[i] == "#") {
                    pushToken(current_token);
                    current_state = statesEnum.LINECOMMSTATE;
                }
                else {
                    current_token += code[i];
                }
            }
            else {
                pushToken(current_token);
                current_token += code[i];
                pushToken(current_token);
            }
        }
        else if (current_state == statesEnum.EQUALSSTATE) {
            if(code[i] == "=") {
                current_token += code[i];
                pushToken(current_token);
                current_state = statesEnum.MIDSTATE;
            }
            else {
                pushToken(current_token);
                if (code[i] != " ") {
                    current_token += code[i];
                }
                current_state = statesEnum.MIDSTATE;
            }
        }
        else if (current_state == statesEnum.STRINGSTATE) {
            if (special_characters.indexOf(code[i]) == -1) {
                if (code[i] == "\"") {
                    //current_token += code[i];
                    pushToken(current_token);
                    //pushToken(current_token);
                    current_state = statesEnum.MIDSTATE;
                }
                else {
                    current_token += code[i];
                }
            }
        }
        else if (current_state == statesEnum.LINECOMMSTATE) {
            if(code[i] == "\n") {
                current_state = statesEnum.MIDSTATE;
            }
            else {
                //Do nothing, its a comment.
            }
        }
    }
    //Push the final token
    pushToken(current_token);

    console.log("DONE");
    return tokens;
}
