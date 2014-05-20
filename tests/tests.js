test( "Sanity test", function() {
    ok( 1 == "1", "Passed!" );
});

// test( "tokenize1", function() {
//     ok( tokenize("hello"), "hello" );
// });
//
// test( "tokenize2", function() {
//     ok( makeTreeFromTokens(tokenize("print \"hello world\"")), "print \"hello world\"");
// });
//
// test( "tokenize3", function() {
//     ok( tokenize("testvar = 15"), "testvar = 15");
// });
//
// test( "tokenize4", function() {
//     ok( tokenize("testvar=15"), "testvar=15");
// });

test( "tokenize5", function() {
    ok( makeTreeFromTokens(tokenize("testvar=15")), "testvar=15");
});

test( "tokenize6", function() {
    ok( makeTreeFromTokens(tokenize("testvar = 15")), "testvar = 15");
});

test( "tokenize7", function() {
    ok( makeTreeFromTokens(tokenize("if testvar == 1")), "if testvar == 1");
});

test( "tokenize8", function() {
    ok( makeTreeFromTokens(tokenize("if testvar<<=1\n")), "if testvar==1");
});

test( "tokenize9", function() {
    ok( makeTreeFromTokens(tokenize("print "hello world\n")), "print "hello world\n");
});
