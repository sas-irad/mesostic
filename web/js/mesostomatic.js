window.mesotic = function(context) {

    //initialize or overwrite public mesostomatic API
    var public = window.mesostic || {};
    var sourceArray;
    var spineArray;
    var resultObject;
    var options;

    function createSourceArray(sourceText) {

        sourceArray = ['word1', 'word2'];
    }

    function createSpineArray(sourceText, spineWord) {

        return [
            {'spineLetter': 'J', 'index': 22},
            {'spineLetter': 'J', 'index': 22}
        ];        
    }

    function parseLineWords(sourceIndex1, sourceIndex2, spineLetter1, spineLetter2) {
        return {
            'startBookend': 'J',
            'preLineBreak': 'ohn Burbank',
            //the line break of display poem    
            'postLineBreak': 'in the castl',
            'endBookend': 'E'
        };
    }

    function createLines() {
        resultArray = array();
        resultArray[0] = parseLineWords(null, 0);
        for(var i = 0; i< spineArray.length(); i++) {
            resultArray[i] = parseLineWords();
        }
        resultArray[last] = parseLineWords(last, null);
        
        return resultArray;
    }

    function createResulteObject() {
       //takes create line result and sends back nice line based objects         

    }

    function getRandomBoolean() {
        return true;
    }

    function getRandomSplit(index1, index2) {
        return Math.floor((index1 + index2)/2)
    }

    //actually do the parsing
    function doParse() {
        return {
            'parsed': true,
            'parsing': [
                {
                    'left': 'some text',
                    'spine': 'J',
                    'right': 'some text'
                },
                {
                    'left': 'some more text',
                    'spine': 'o',
                    'right': 'more text'
                }
            ]
        };
    }

    //public parse function
    public.parse= function(spineWord, sourceText, options) {
        options
        createSourceArray(sourceText);
        createSpineArray(spineWord);
        return doParse();
    }
    

    //set the mesostomatic parser to the public api
    window.mesostomatic = public;

    return public;
}(window);
