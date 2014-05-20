function parse(code) {
    return makeTreeFromTokens(tokenize(code));
}
