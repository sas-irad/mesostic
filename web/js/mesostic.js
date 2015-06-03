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
        return spineWord.replace(/[^A-Za-z]/g,'').toLowerCase();

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
            spineLetterCount = spineLength * loops,
            found = false,
            i = 0, // spine index
            j = 0; // source index
        
        while (i < spineLetterCount) {
            var currentSpineLetter = spine[i % spineLength],
                nextSpineLetter = i === spineLetterCount - 1 ? 
                    undefined : spine[(i+1) % spineLength],
                prevSpineLetter = spine[(i-1) % spineLength],
                currentWord = sourceArray[j % sourceArray.length],
                letterIndex = currentWord.indexOf(currentSpineLetter),
                success;

            if (letterIndex > -1) { // Spine Letter is in there
                success = {'spineLetter': currentSpineLetter, 
                    'index': j % sourceArray.length,
                    'pre': letterIndex, 'post': currentWord.length - (letterIndex + 1)};
                if (rule === 'basic') {
                    currentSpineArray.push(success);
                    found = true;
                }
                else if (rule === '50') {
                    if (currentWord.indexOf(nextSpineLetter) === -1) {
                        currentSpineArray.push(success);
                        found = true;
                    }
                }
                else if (rule === '100') {
                    if (currentWord.indexOf(nextSpineLetter) === -1 && 
                        currentWord.indexOf(prevSpineLetter) === -1 &&
                       currentWord.indexOf(currentSpineLetter) ===
                       currentWord.lastIndexOf(currentSpineLetter)) {
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
                if(currentSpineArray.length > 0 ) {
                    return {parsed: false, spineArray: new Array(currentSpineArray)};
                }
                else {
                    return {parsed: false, spineArray: new Array()};
                }
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
    function parseLineWords( startSpine, endSpine, sourceArray, options) {
        var startSpineLetter,
            preLineBreak,
            postLineBreak,
            endSpineLetter,
            endWord,
            startWord,
            word,
            preBreakSearchUntil,
            postBreakSearchAfter,
            partialSpineWord;
        

        if (startSpine === null)  // looking for start of first Spine Letter Line
        {
            // no splitbreak between null letter and first letter
            endWord = sourceArray[endSpine.index];
            startSpineLetter = '';
            preLineBreak = '';
            endSpineLetter = endSpine.spineLetter;

            // no line break
            partialSpineWord = endWord.substr(0,endSpine.pre) ;  

            if (options.rule === 'basic') {
                letterRestrictions = new Array();
            }
            else if(options.rule === '50' || options.rule === '100') {
                letterRestrictions = new Array(endSpineLetter);
            } 
            // start the walk back to null
            if(endSpine.index === 0) {
                postLineBreak = partialSpineWord;
            }
            else {
                postLineBreak = selectWingWords(endSpine.index,0, partialSpineWord, letterRestrictions, sourceArray, options);
            }
        }
        else if (endSpine === null)  // looking for ending of last Spine Letter line
        {
            // no splitbreak between null letter and first letter
            startWord = sourceArray[startSpine.index];
            endSpineLetter = '';
            postLineBreak = '';
            startSpineLetter = startSpine.spineLetter;

            partialSpineWord = startWord.substr(startSpine.pre+1) ;  

            if (options.rule === 'basic' || options.rule === '50') {
                letterRestrictions = new Array();
            }
            else if(options.rule === '100') {
                letterRestrictions = new Array(startSpineLetter);
            }

            preLineBreak = selectWingWords(startSpine.index,sourceArray.length, partialSpineWord, letterRestrictions, sourceArray, options);

        }
        else  //looking for words between two spine letters 
        {
            // no splitbreak between null letter and first letter
            endWord = sourceArray[endSpine.index];
            endSpineLetter = endSpine.spineLetter;
            startWord = sourceArray[startSpine.index];
            startSpineLetter = startSpine.spineLetter;

            if (options.rule === 'basic') {
                letterRestrictions = new Array();
            }
            else if (options.rule === '50') {
                letterRestrictions = new Array(endSpineLetter);
            }
            else if(options.rule === '100') {
                letterRestrictions = new Array(endSpineLetter, startSpineLetter);
            }

            //get the midpoint between the two words to determine which goes on which lines
            //we have looped back to beginning of source text between spine Words
            if (startSpine.index >= endSpine.index) {
                preBreakSearchUntil = sourceArray.length, //look until the end of the text
                postBreakSearchAfter = -1 // look 
            }
            else {
                preBreakSearchUntil = getRandomMidpoint(startSpine.index, endSpine.index);
                postBreakSearchAfter = preBreakSearchUntil - 1;
            }
            //find the end of first line
            partialSpineWord = startWord.substr(startSpine.pre+1) ;  
            preLineBreak = selectWingWords(startSpine.index, preBreakSearchUntil, partialSpineWord, letterRestrictions, sourceArray, options);
            
            //find the beginning of the second line
            partialSpineWord = endWord.substr(0,endSpine.pre) ;  // need to chop here based on pre/post
            postLineBreak = selectWingWords(endSpine.index, postBreakSearchAfter, partialSpineWord, letterRestrictions, sourceArray, options);
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
     * Function to select random words between the two given indexes of the source
     */
    function selectWingWords(searchStartIndex, searchEndIndex, spineWordPart, letterRestrictions, sourceArray, options)
    {
        var maxLength = 45;
        var increment = searchStartIndex < searchEndIndex ? 1 : -1;
        var i,j;
        var words = spineWordPart;
        var word;
        var eligibleWords = [];
        
        //find the words that are eligible
        wordLoop:
        for(
            i = searchStartIndex + increment;
            i !== searchEndIndex && i >= 0 && i < sourceArray.length;
            i = i + increment
        ) {     
            word = sourceArray[i];
            // need to check for letterRestrictions
            for(j = 0; j < letterRestrictions.length; j++) {
                if(word.indexOf(letterRestrictions[j]) >= 0) continue wordLoop;
            } 
            eligibleWords.push(word);
        }        
        
        
        for(i = 0; i < eligibleWords.length; i++) {
            word = eligibleWords[i];
            
            //make sure word doesn't make line part too long
            if(words.length + word.length + 1 >= maxLength) continue;

            if (getRandomBoolean(options, eligibleWords.length) === false) continue;

            if(increment === 1) {
                words = words + ' ' + word;
            }
            else if(increment === -1) {
                words = word + ' ' + words;
            }
            //just in case, stop after 100 words 
            if (i++ > 100) return words;
        }

        return words;
    } 
    

    function getRandomMidpoint(min,max)
    {
        min = min + 1; //we don't want the min returned
        return Math.floor(Math.random()*(max-min+1)+min);
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
        var i,j;

        
        //create a single dimensional array to loop through spine letters
        //start with null
        var spineLetters = new Array(null);
	    // loop through each spine word(s)
        for(i = 0; i < spineArray.length; i++) {
            //loop through each spine letter
            for(j = 0; j < spineArray[i].length; j++) {
                spineLetters.push(spineArray[i][j]);
            }
        }
        //end with null
        spineLetters.push(null);

        previousPostLineBreak = '';
    for(i = 0; i < spineLetters.length -1; i++) {

            //find the words between this spine letter and the next
        parsedWords = parseLineWords(spineLetters[i], spineLetters[i+1], sourceArray, options);

        lines.push({
            preSpine: previousPostLineBreak,
            spine: parsedWords.startSpineLetter,
            postSpine: parsedWords.preLineBreak
        });

        previousPostLineBreak = parsedWords.postLineBreak;
    }

    return lines;
}

function getRandomBoolean(options, totalEligibleWords) {
    var oneChanceIn;
    var targetWords;

    switch(options.wingTextSparsity) {
        case  "very sparse":
            targetWords = 1;
            break;
        case  "sparse": //1 in 4 chance
            targetWords = 4;
            break;   
        case  "normal": //1 in 2 chance
        default:
            targetWords = 8;
    }
    //compute pecentage words that should be included
    var percentage = targetWords / totalEligibleWords;
    if (percentage > 0.80) percentage = 0.80;
    return Math.random() <= percentage;
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
    if(parsing.spineArray.length > 0) {
            resultObject.lines = createLines(parsing.spineArray, sourceArray, options);
        }
        else {
            resultObject.lines = new Array();
        }
        return resultObject;

    };

    //function to return actual text of the poem
    pub.formatText = function(resultObject, spineWords, options) {
        var text = '';
        var lines = resultObject.lines;
        var spineLength = createSpine(spineWords).length;
        var stanzaBreak;
        
        //find where the spaces are in the spine word
        if (options.stanzaBreaks === 'spineWord') {
            var modifiedSpineWords = spineWords.replace(/[^A-Za-z ]/g,'').toLowerCase().trim();
            var breakIndexes = [];
            for(var i = 0; i<modifiedSpineWords.length; i++) {
               if (modifiedSpineWords[i] === ' ') breakIndexes.push(i - breakIndexes.length);
            }
            console.log(breakIndexes);
        }

        
        for(var i = 0; i < lines.length; i++) {
            text = text + pad(lines[i]['preSpine'], 45, ' ', STR_PAD_LEFT);
            text = text + '<span class="spine">' + lines[i]['spine'] + '</span>';
            text = text + lines[i]['postSpine'] + '<br>';
            
            stanzaBreak = false;
            if (options.stanzaBreaks == 'spineWord') {
                //if not for ie < 9 we could use indexOf here to see if 
                for(j = 0; j < breakIndexes.length; j++) {
                    if(i> 0 && breakIndexes[j] == i % spineLength) {
                        stanzaBreak = true;
                        break;
                    }
                }
            }
            else if(options.stanzaBreaks == 'random' && 0 === Math.floor(Math.random() * 6)) {
                stanzaBreak = true;
            }
            if(stanzaBreak) text = text + '<br><br>';
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
