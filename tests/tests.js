/**
 * Unit tests for mesostic function
 */

//#########################createSourceArray testing ##############
QUnit.test( "createSourceArray", function( assert ) {
    var testFunc = mesostic._createSourceArray;
    var sourceText;
    var sourceArray;
    var expectedResult = ['here', 'is', 'the', 'source', 'text'];
    var options = {
        stripPunctuation: true,
    };
    
    //test vanilla example
    sourceText = 'here is the source text';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'test vanilla')

    //test capitalization example
    sourceText = 'here Is the SouRce text';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'test capitalization')

    //test some double spaces
    sourceText = ' Here   is     the source  text ';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'ignore double spaces');
    
    //test some line breaks
    sourceText = 'Here\nis the \n source\n\ntext\n';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'ignore line breaks');
    
    //test some tabs
    sourceText = '\tHere\tis the \t source\n\t\ntext\n';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'ignore tabs');
    
    //test some punctuation
    sourceText = 'Here! is. the?  source "text"';
    sourceArray = testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'strip punctuation');

    //Try leaving in an apostrophe
    expectedResult = ['here', 'is', 'bob\'s', 'text'];
    sourceText = 'Here is Bob\'s text!';
    sourceArray= testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'leave an apostrophe');

    //try leaving in punctuation
    options.stripPunctuation = false;
    expectedResult = ['here!', 'is,', 'bob\'s,', '!text'];
    sourceText = 'Here! is, Bob\'s, !text';
    sourceArray= testFunc(sourceText, options);
    assert.deepEqual(sourceArray, expectedResult, 'don\'t strip punctuation');
});


//#########################createSpineArray Testing ######################Y
QUnit.test( "createSpineArray", function( assert ) {
  
    var testFunc = mesostic._createSpineArray;
    var spineWord;
    var spineArray;
    var sourceArray;
    var expectedResult;
    var options = {
        stripPunctuation: true,
        rule: "basic",
        spineLoops: 1
    };

    spineWord = 'slot';
    sourceArray = [
        'Here',       //0
        'is',         //1 - 's' for basic, 50, 100
        'a',          //2
        'lovely',     //3 first 'l' for basic and 50, throw out for 100
        'silver',     //4 throw out for 100
        'alive',      //5 'l' for 100
        'source',     //6 'o' for basic, 50, 100
        'array',      //7
        'their',      //8 't' for basic, 50
        'itches',     //9 
        'into',       //10 't' for 100 (2 loops)
        'the',        //11
        'summer',     //12
        'nightlife',  //13
        'over',       //14
        'cancun'      //15
    ];
    
    //basic one loop
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [[
        {spineLetter: 's', index:1, pre:1, post:0},//is
        {spineLetter: 'l', index:3, pre:0, post:5},//lovely
        {spineLetter: 'o', index:6, pre:1, post:4},//source
        {spineLetter: 't', index:8, pre:0, post:4},//their
    ]]};
    assert.deepEqual(spineArray, expectedResult, 'basic 1 loop');

    //50% one loop
    options.rule = "50";
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [[
        {spineLetter: 's', index:1, pre:1, post:0},//is
        {spineLetter: 'l', index:4, pre:2, post:3},//silver
        {spineLetter: 'o', index:6, pre:1, post:4},//source
        {spineLetter: 't', index:8, pre:0, post:4},//their
    ]]};
    assert.deepEqual(spineArray, expectedResult, '50% 1 loop');
    
    //100% one loop
    options.rule = "100";
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [[
        {spineLetter: 's', index:1, pre:1, post:0},//is
        {spineLetter: 'l', index:5, pre:1, post:3},//alive
        {spineLetter: 'o', index:6, pre:1, post:4},//source
        {spineLetter: 't', index:8, pre:0, post:4},//their
    ]]};
    assert.deepEqual(spineArray, expectedResult, '100% 1 loop');

    //100% one loop 0 no parse
    options.rule = "100";
    spineArray = testFunc(sourceArray, 'slotq', options);
    expectedResult = {parsed: false, spineArray: [[
        {spineLetter: 's', index:1, pre:1, post:0},//is
        {spineLetter: 'l', index:5, pre:1, post:3},//alive
        {spineLetter: 'o', index:6, pre:1, post:4},//source
        {spineLetter: 't', index:8, pre:0, post:4},//their
    ]]};
    assert.deepEqual(spineArray, expectedResult, '100% 1 loop unparseable');

    //50% three loop
    options.rule = "50";
    options.spineLoops = 3;
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [
        [{spineLetter: 's', index:1, pre:1, post:0},//is
        {spineLetter: 'l', index:4, pre:2, post:3},//silver
        {spineLetter: 'o', index:6, pre:1, post:4},//source
        {spineLetter: 't', index:8, pre:0, post:4}],//their
        [{spineLetter: 's', index:9, pre:5, post:0},//itches
        {spineLetter: 'l', index:13, pre:5, post:3},//nightlife
        {spineLetter: 'o', index:14, pre:0, post:3},//over
        {spineLetter: 't', index:8, pre:0, post:4}],//their
        [{spineLetter: 's', index:9, pre:5, post:0},//itches
        {spineLetter: 'l', index:13, pre:5, post:3},//nightlife
        {spineLetter: 'o', index:14, pre:0, post:3},//over
        {spineLetter: 't', index:8, pre:0, post:4}],//their
    ]};
    assert.deepEqual(spineArray, expectedResult, '50% 3 loops');

    //100% two loop
    options.rule = "100";
    options.spineLoops = 2;
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [[
        {spineLetter: 's', index:1, pre:1, post:0},//is
        {spineLetter: 'l', index:5, pre:1, post:3},//alive
        {spineLetter: 'o', index:6, pre:1, post:4},//source
        {spineLetter: 't', index:8, pre:0, post:4}],//their
        [{spineLetter: 's', index:12, pre:0, post:5},//summer
        {spineLetter: 'l', index:13, pre:5, post:3},//nightlife
        {spineLetter: 'o', index:14, pre:0, post:3},//over
        {spineLetter: 't', index:8, pre:0, post:4},//their
    ]]};
    assert.deepEqual(spineArray, expectedResult, '100% 2 loops');

    //test double letter in spine word 50%
    options.rule = "50";
    spineWord = 'ill';
    options.spineLoops = 1;
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [[
        {spineLetter: 'i', index:1, pre:0, post:1},// is
        {spineLetter: 'l', index:4, pre:2, post:3},// silver 
        {spineLetter: 'l', index:5, pre:1, post:3},// alive
    ]]};
    assert.deepEqual(spineArray, expectedResult, '50% spine word with double letter');

    //test double letter in spine word 100%
    options.rule = "100";
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [[
        {spineLetter: 'i', index:1, pre:0, post:1},// is
        {spineLetter: 'l', index:4, pre:2, post:3},// silver 
        {spineLetter: 'l', index:5, pre:1, post:3},// alive
    ]]};
    assert.deepEqual(spineArray, expectedResult, '100% spine word with double letter');

    // Test behavior with double-letters in a word, spine wrapping
    spineWord = 'flu';
    sourceArray = [
        'forget', // 'f' for both
        'lovely', // 'l' for 50
        'lazy', // 'l' for 100
        'fun' // 'u' for both
    ];

    options.rule = "50";
    options.spineLoops = 1;
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [[
        {spineLetter: 'f', index:0, pre:0, post:5},// forget
        {spineLetter: 'l', index:1, pre:0, post:5},// lovely
        {spineLetter: 'u', index:3, pre:1, post:1},// fun
    ]]};
    assert.deepEqual(spineArray, expectedResult, '50% double spine letter');

    options.rule = "100";
    spineArray = testFunc(sourceArray, spineWord, options);
    expectedResult = {parsed: true, spineArray: [[
        {spineLetter: 'f', index:0, pre:0, post:5},// forget
        {spineLetter: 'l', index:2, pre:0, post:3},// lazy 
        {spineLetter: 'u', index:3, pre:1, post:1},// fun
    ]]};
    assert.deepEqual(spineArray, expectedResult, '100% double spine letter');

});


//#########################Parse Line Words Testing ######################Y
QUnit.test('parseLineWords', function(assert) {
    var testFunc = mesostic._parseLineWords;
    
    var parsed;
    var spineArray = [
        {spineLetter: 's', index:1, pre:1, post:0},//is
        {spineLetter: 'l', index:5, pre:1, post:3},//alive
        {spineLetter: 'o', index:6, pre:1, post:4},//source
        {spineLetter: 't', index:9, pre:1, post:4},//itches
    ];
    var sourceArray = [
        'here',       //0
        'is',         //1 - 's' for basic, 50, 100
        'a',          //2
        'lovey',      //3 'l' for basic 
        'silver',     //4 'l' for 50
        'alive',      //5 'l' for  100
        'source',     //6 'o' for basic, 50, 100
        'array',      //7
        'rattle',     //8 't' for basic, 50
        'itches',     //9 't' for 100 (1 loop)
        'into',       //10 't' for 100 (2 loops)
        'the',        //11
        'summer',     //12
        'nightlife',  //13
        'over',       //14
        'cancun'      //15
    ];
    var options = {
        rule: "basic",
        wingTextSparsity: "normal"       
    };

    parsed = testFunc(null,spineArray[0], sourceArray, options);
    assert.equal(parsed.startSpineLetter,'', 'check empty start spine letter'); 
    console.log(parsed);

    parsed = testFunc(spineArray[3], null,  sourceArray, options);
    assert.equal(parsed.endSpineLetter,'', 'check empty end spine letter'); 
    console.log(parsed);    
    
    parsed = testFunc(spineArray[2],spineArray[3], sourceArray, options);
    assert.equal(parsed.startSpineLetter, 'o','check start spine letter');
    assert.equal(parsed.endSpineLetter, 't', 'check end spine letter');
    assert.equal(parsed.preLineBreak.substr(0,4), 'urce', 'check preline break');

    assert.equal(parsed.postLineBreak.substr(parsed.postLineBreak.length - 1), 'i', 'check postline break');
});


