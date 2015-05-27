window.mesostic = function() {

    /**
     * Array of words from the source text formatted according to options
     */
    var sourceArray;
    
    /**
     * Array of spineWords that were identified in the following form
     * {
     *    spineLetter: "J", (the spine letter)
     *    index: 32, (the index of the source word)
     *    pre: 3, (number of letters preceding spine letter in source word)
     *    post: 4, (number of letters following spine letter in source word)
     */ 
    var spineArray; 

    /**
     * Result of the parsing in the following form
     * {
     *     parsed: true, (boolean indicating if parsing was successful)
     *     lines: [
     *         {preSpine: "let us ma", spine: "K", postSpine: "e glad"},
     *         {preSpine: "of th", spine: "I", postSpine: "s again for"},
     *         {preSpine: "", spine: "", postSpine: ""}, (empty line)
     *         {preSpine: "of the o", spine: "N", postSpine: "e thing too"}
     *     ]
     * }
     */
    var resultObject;
    
    /**
     * The Array of options to be set for parsing
     * {
     *      rule: "basic"|"50"|"100", (rule of picking spine word - defaults to 50)
     *      spineLoops: 1, (number of time to loop through spine word - defaults to 1),
     *      stripPunctuation: true, (flag to remove punctuation from the source text or not)
     *      stanzaBreaks: "spineWord"|"random"|[0-9]+, (when to make stanza breaks, defaults to spineWord)
     *      wingTextSparsity: "normal"|"sparse"|"very sparse"
     * }
     */
    var options = {};


    /**
     * The public object that will be returned
     */
    var pub = {}; 

    /**
     * Creates an array of source words out of a source text
     *
     * @param  string sourceText 
     *
     * @TODO Make sure double spaces " " get stripped out
     */
    function createSourceArray(sourceText, options) {
        var sourceArray = sourceText.split(/\s+/),
            returnArray = new Array(),
            returnWord;
        for (var i = 0, len = sourceArray.length; i < len; i++) {
            returnWord = sourceArray[i].toLowerCase().trim();
            if (returnWord.length > 0) {  // No empty words
                if (options.stripPunctuation === true) {
                    returnWord = returnWord.replace(/[^a-z0-9']/g,'');
                }
                returnArray.push(returnWord);
            }
        }
        return returnArray;
    }

    /**
     * function that takes a spineWord and strips out anything that isn't a letter
     */
    function createSpine(spineWord, options)
    {
        return spineWord.replace(/[^A-Za-z]/g,'');

    }    
    /**
     * Steps through the sourceArray and looks for spine word letters and saves in spineArray
     *
     * @return boolean  True if able to create / False if not
     *
     * @TODO Figure out how to handle punctuation and spaces in spine word
     */
    function createSpineArray(sourceArray, spineWord, options) {

        var spine = createSpine(spineWord).split(""),
            spineLength = spine.length,
            currentSpineArray = new Array(), // Working Spine word
            resultArray = new Array(), // Only full spine words
            rule = options.rule || '50',
            loops = options.spineLoops || 1,
            found = false,
            i = 0, // spine index
            j = 0; // source index
        
        while (i < spineLength * loops) {
            var currentSpineLetter = spine[i % spineLength],
                nextSpineLetter = spine[(i+1) % spineLength],
                prevSpineLetter = spine[(i-1) % spineLength],
                currentWord = sourceArray[j % sourceArray.length],
                letterIndex = currentWord.indexOf(currentSpineLetter),
                success;

            if (letterIndex > -1) { // Spine Letter is in there
                success = {'spineLetter': currentSpineLetter, 'index': j,
                    'pre': letterIndex, 'post': currentWord.length - (letterIndex + 1)};
                if (rule === 'basic') {
                    currentSpineArray.push(success);
                    found = true;
                }
                else if (rule === '50') {
                    if (currentWord.indexOf(nextSpineLetter === -1)) {
                        currentSpineArray.push(success);
                        found = true;
                    }
                }
                else if (rule === '100') {
                    if (currentWord.indexOf(nextSpineLetter) === -1 && 
                        currentWord.indexOf(prevSpineLetter) === -1) {
                            currentSpineArray.push(success);
                            found = true;
                    }
                }
            }
            if (found) {
                i++;
                if (i % spineLength === 0) {
                    resultArray.push(currentSpineArray);
                    currentSpineArray = new Array();
                }
                found = false;
            }
            j++;

            //give up after 10 tries through the source text if you haven't found one yet 
            if (j > sourceArray.length * 10 && resultArray.length == 0) {
                return {parsed: false, spineArray: new Array(currentSpineArray)};
            }
        }
        return {
            parsed: true,
            spineArray: resultArray
        };
       
    }


    /**
     * Function to take two spine letters and find the words that should occur between them
     *
     * What the function will return is all the necessary parts of the text in the following form  
     *
     * @param integer spineArraySlot1 - the index of the beginning spine letter
     * @param integer spineArraySlot2 - the index of the end spine letter
     * @param Array   spineArray      - the Array of spineLetters
     * @param Array   sourceArray     - the Array of sourceWords
     * @param object  options         - options
     *
     * @return object - in the following form  {
     *     'startSpineLetter': 'J',
     *     'preLineBreak': 'ohn Burbank',
     *      //the line break of display poem    
     *     'postLineBreak': 'in the castl',
     *     'endSpineLetter': 'E'
     * };
     */
    function parseLineWords( spineArraySlot1, spineArraySlot2, spineArray, sourceArray, options) {
        var startSpineLetter, preLineBreak, postLineBreak, endSpineLetter;
        

        if (spineArraySlot1 == null)  // first letter in spine array
        {
            // no splitbreak between null letter and first letter
            var endSpine = spineArray[spineArraySlot2];
            var endWord = sourceArray[endSpine.index];
            
            startSpineLetter = '';
            preLineBreak = '';

            // no line break
            postLineBreak = endWord.substr(0,endSpine.pre) ;  // need to chop here based on pre/post
            endSpineLetter = endSpine.spineLetter;
            count = 0;
            count = count + spineArray[spineArraySlot2].pre;

            // start the walk back to null
            for ($i = spineArray[spineArraySlot2].index-1; $i >= 0; $i--) {

                var word = sourceArray[$i];

                console.log(word);
                //check if the word is too long
                if(postLineBreak.length + word.length + 1 >= 45) continue;

                // need to check for 0/50/100 rule
                if (options.rule === 'basic') {}
                else if(options.rule === '50' || options.rule === '100') {
                    if(word.indexOf(endSpineLetter) >= 0) continue;
                } 

                if (getRandomBoolean(options) === false) continue;

                postLineBreak = word + ' ' + postLineBreak;

            }
        }
        else if (spineArraySlot2 === null)  // last letter in spine array
        {
	    // no splitbreak between last letter and null letter

            // no splitbreak between null letter and first letter
            var startSpine = spineArray[spineArraySlot1];
            var startWord = sourceArray[startSpine.index];
            
            endSpineLetter = '';
            postLineBreak = '';

            // no line break
            preLineBreak = startWord.substr(startSpine.pre + 1) ;  // need to chop here based on pre/post
            startSpineLetter = startSpine.spineLetter;

            // start the walk back to null
            for ($i = spineArray[spineArraySlot1].index+1; $i < sourceArray.length; $i++) {


                var word = sourceArray[$i];
                console.log(word);
                //check if the word is too long
                if(preLineBreak.length + word.length + 1 >= 45) continue;

                // need to check for 0/50/100 rule
                if (options.rule === 'basic' || options.rule === '50') {}
                else if(options.rule === '100') {
                    if(word.indexOf(startSpineLetter) >= 0) continue;
                } 

                if (getRandomBoolean(options) === false) continue;

                preLineBreak += ' ' + word;

            }
        }
        else  // everything in between
        {
            // no splitbreak between null letter and first letter
            var endSpine = spineArray[spineArraySlot2];
            var endWord = sourceArray[endSpine.index];
            var startSpine = spineArray[spineArraySlot1];
            var startWord = sourceArray[startSpine.index];
            
            startSpineLetter = '';
            preLineBreak = '';

            postLineBreak = endWord.substr(0,endSpine.pre) ;  // need to chop here based on pre/post
            endSpineLetter = endSpine.spineLetter;

            preLineBreak = startWord.substr(startSpine.pre + 1) ;  // need to chop here based on pre/post
            startSpineLetter = startSpine.spineLetter;
        }


        return {
            'startSpineLetter': startSpineLetter,
            'preLineBreak': preLineBreak,
            //the line break of display poem    
            'postLineBreak': postLineBreak,
            'endSpineLetter': endSpineLetter
        };
    }


    /**
     * Function which uses the the spineArray and sourceArray to create the actual lines of the poem
     * 
     * @param Array spineArray   The array of spine letters
     * @param Array sourceArray  The Array of source words
     * @param Object options     Object containing options
     *
     * @TODO implement stanza break oprions
     */

    function createLines(spineArray, sourceArray, options) {
        var previousPostLineBreak; //the postLineBreak text retrieved from previous parsed words
        var lines = [];
        var parsedWords;
        
	    //special case - first element of spineArray
        parsedWords = parseLineWords(null, 0, spineArray, sourceArray, options);
	    previousPostLineBreak = parsedWords.postLineBreak;
        
	    // loop through each spine letter and get corresponding line
        for(var i = 0; i < spineArray.length-1; i++) {
            
            //find the words between this spine letter and the next
            parsedWords = parseLineWords(i, i+1, spineArray, sourceArray, options);

            lines.push({
                preSpine: previousPostLineBreak,
                spine: parsedWords.startSpineLetter,
                postSpine: prasedWords.preLineBreak
            });

            previousPostLineBreak = parsedWords.postLineBreak;
        }

	    // special case - last element of spineArray
	    parsedWords = parseLineWords(spineArray.length-1, null, spineArray, sourceArray, options)
        lines.push({
            preSpine: previousPostLineBreak,
            spine: parsedWords.startSpineLetter,
            postSpine: parsedWords.preLineBreak 
        });


        return lines;
    }

    function getRandomBoolean() {
        return true;
    }

    function getRandomSplit(index1, index2) {
        return Math.floor((index1 + index2)/2)
    }

    //public parse function
    pub.parse = function(spineWord, sourceText, myOptions) {
        options = myOptions;

        //create source array
        var sourceArray = createSourceArray(sourceText, options);

        //parse for spine word
        var parsing  = createSpineArray(sourceArray, spineWord, options);
    
        var resultObject = {parsed: parsing.parsed};

        //create and return ResultObject
        resultObject.lines = createLines(parsing.spineArray, sourceArray, options);
        return resultObject;

    };

    //function to return actual text of the poem
    pub.formatText = function(resultObject, formatType) {
        var text = '';
        var lines = resultObject.lines;
        for(var i = 0; i < lines.length; i++) {
            text = text + pad(lines[i]['preSpine'], 45, ' ', STR_PAD_LEFT);
            text = text + '<span class="spine">' + lines[i]['spine'] + '</span>';
            text = text + pad(lines[i]['postSpine'], 45, ' ', STR_PAD_RIGHT);
        }    
        return text;
    };

    /* test-code */
    //These added so internal methods can be tested
    pub._createSourceArray = createSourceArray;
    pub._createLines = createLines;
    pub._createSpineArray = createSpineArray;
    pub._parseLineWords = parseLineWords;
    /* end-test-code */

    //set the mesostomatic parser to the public api
    return pub;

}();
