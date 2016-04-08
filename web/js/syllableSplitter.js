var syllableSplitter = function(window, Hyphenator) {

    var container = this;
    container.language = 'en-us';
    container.splitChar = '~#!';

    //configure the hyphenator
    container.config = function(options) 
    {
        //maybe in future allow to overload options

        
        //set up the Hyphenator
        var defaultHyphenatorOptions = {
            defaultlanguage: container.language,
            minwordlength: 2,
            hyphenchar : container.splitChar,
            remoteloading: true,
            onhyphenationdonecallback: function() {
                Hyphenator.languages[container.language].rightmin = 2;
                Hyphenator.languages[container.language].leftmin = 1;
            }
        }
        Hyphenator.config(defaultHyphenatorOptions);
        
        //do this to force the loading of the language so we can modify the right/left min
        console.log(window.document.getElementsByClassName('hyphenate'));
        document.getElementsByClassName('hyphenate')[0].setAttribute('lang', container.language);
        Hyphenator.run();
    }

    //hyphenate the word then split the word into syllables
    container.splitWord = function(strToSplit) 
    {
        return Hyphenator.hyphenate(strToSplit, container.language).split(container.splitChar);
    }

    //find the syllable that contains the letter at the given position index
    container.findSyllableAtPosition = function(strToSplit, letterIndex)
    {
        var syllables = container.splitWord(strToSplit);
        var letterCount = 0;
        for(var i = 0; i < syllables.length; i++) {
            letterCount = syllables[i].length + letterCount;
            if (letterCount > letterIndex) {
                return syllables[i];
            }
        }
    }
    
    //set the language for the parser
    container.setLanguage = function(newLanguage)
    {
        container.language = newLanguage;
        container.config();
    }

    //run the config to start things off
    container.config();


    return container;

}(window, Hyphenator);
