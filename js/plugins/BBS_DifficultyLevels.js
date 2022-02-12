//=============================================================================
// Bluebooth Plugins - Difficulty Levels
// BBS_DifficultyLevels.js
//=============================================================================

//=============================================================================
 /*:
 * @title Difficulty Levels
 * @author Michael Morris (https://www.patreon.com/bluebooth)
 * @date May 4, 2017
 * @filename BBS_DifficultyLevels.js
 * If you enjoy my work, consider supporting me on Patreon!
 *
 * https://www.patreon.com/bluebooth
 *
 * @plugindesc v1.03a Adds support for multiple battle and riddle difficulty levels!
 * UI functions based on Atreyo Ray's ARP_InGameManual.js
 * Special Thanks to Tsukihime for all the help.
 * Special Thanks to 'Ramza' Michael Sweeney for all the support.
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *  - Free for use in non-commercial projects with credits
 *  - Free for commercial use with credits
 * 
 * ============================================================================
 * Parameters
 * ============================================================================
 * @param === DIFFICULTY CORE ===
 * @param Difficulty Json File
 * @desc Name of an external difficulty file to load at game start. Default: data/difficulty.json
 * @default data/difficulty.json
 * 
 * @param Battle Difficulty Game Variable Index
 * @desc Choose the game variable ID that stores the current Battle Difficulty.
 * 
 * @param Puzzle Difficulty Game Variable Index
 * @desc Choose the game variable ID that stores the current Puzzle Difficulty.
 * 
 * @param Ironman Mode Game Variable Index
 * @desc Choose the game variable ID that stores the ironman mode setting.  -1 not to use.
 * Default: -1
 * @default -1
 * 
 * @param Perma-Death Game Variable Index
 * @desc Choose the game variable ID that stores the permadeath mode setting.  -1 not to use.
 * Default: -1
 * @default -1
 * 
 * @param Death State
 * @desc The state ID of your death/dying state.  Perma-death will lock characters with this
 * state, only if the Perma-Death mode is set for difficulty the player selects.
 * @default 1
 * 
 * @param Default Battle Difficulty
 * @desc Default battle difficulty.  Must be the name of a battle difficulty in difficulty.json.
 * Default: medium
 * @default medium
 *
 * @param Default Puzzle Difficulty
 * @desc Default puzzle difficulty.  Must be the name of a puzzle difficulty in difficulty.json.
 * Default: medium
 * @default medium
 *
 * @param Show Tutorials Option Label
 * @desc Text to show for the Show Tutorials Option in the Options Menu.
 * Default: Show Tutorials?
 * @default Show Tutorials?
 * 
 * @param Default Show Tutorials Value
 * @desc true or false.  Default value of Show Tutorials in options menu.
 * Default: true
 * @default true
 * 
 * @param === BACKGROUNDS ===
 * @param Custom Background
 * @desc Custom background image (.png format) (don't write extension here).
 * Place image file inside 'img/system' folder.
 * @default

 * @param Title Windowskin
 * @desc Custom windowskin file (.png format) for the navigation window.
 * Place windowskin file inside 'img/system' folder.  Leave blank for default 
 * @default

 * @param Difficulty List Windowskin
 * @desc Custom windowskin file (.png format) for the entry list window.
 * Place windowskin file inside 'img/system' folder.  Leave blank for default
 * @default

 * @param Difficulty Details Windowskin
 * @desc Custom windowskin file (.png format) for the details window.
 * Place windowskin file inside 'img/system' folder.  Leave blank for default
 * @default
 * 
 * @param === TITLE WINDOW ===
 * 
 * @param Title Window Height
 * @desc Height of the difficulty scene title window.
 * Default: 64
 * @default 64
 * 
 * @param Title Window Font
 * @desc Font face used for the title window. Leave blank to use default.
 * @default
 * 
 * @param Battle Difficulty Title
 * @desc Title text to show for battle difficulty selection.
 * Default: Battle Difficulty Selection
 * @default Battle Difficulty Selection
 * 
 * @param Puzzle Difficulty Title
 * @desc Title text to show for puzzle difficulty selection.
 * Default: Puzzle Difficulty Selection
 * @default Puzzle Difficulty Selection
 * 
 * @param Title Window Font Size
 * @desc Font size used for the title window.
 * Default: 28
 * @default 28
 * 
 * @param Title Window Font Color
 * @desc Font color used for the title window
 * Use color index (see windowskin)
 * @default 0
 * 
 * @param Title Window Outline Color
 * @desc Text Outline color for the title window. Use CSS Format or leave blank to use standard.
 * @default
 * 
 * @param === DIVIDING LINE ===
 * 
 * @param Line Center Color
 * @desc Center color of the gradient line below the title. 
 * Use CSS format.    Default: rgba(255,255,255,1)
 * @default rgba(255,255,255,1)
 * 
 * @param Line Border Color
 * @desc Border color of the gradient line below the title.
 * Use CSS format.    Default: rgba(255,255,255,0)
 * @default rgba(255,255,255,0)
 * 
 * @param === ENTRY LIST ===
 * 
 * @param Difficulty List Width
 * @desc Width of the window that lists difficulties.
 * Default: 320
 * @default 320
 * 
 * @param Difficulty List Font
 * @desc Font face used in the difficulty list. Leave blank to use default.
 * @default
 * 
 * @param Difficulty List Font Size
 * @desc Font size used in the difficulty list.
 * Default: 28
 * @default 28
 * 
 * @param Difficulty List Font Color
 * @desc Font color used in the difficulty list
 * Use color index (see windowskin)
 * @default 0
 * 
 * @param Difficulty List Outline Color
 * @desc Text Outline color. Use CSS Format or leave blank to use standard.
 * @default
 * 
 * @param === DIFFICULTY NAME ===
 * 
 * @param Difficulty Name Font
 * @desc Font face for the difficulty name. Leave blank to use standard. See help.
 * @default
 * 
 * @param Difficulty Name Font Size
 * @desc Font size for the difficulty name in the details window.
 * Default: 38
 * @default 38
 * 
 * @param Difficulty Name Italic?
 * @desc Difficulty name font in Italic.      YES: true      NO: false 
 * Default: false
 * @default false
 * 
 * @param Difficulty Name Font Color
 * @desc Difficulty name font color
 * Use color index (see windowskin)
 * @default 0
 * 
 * @param Difficulty Name Outline Color
 * @desc Difficulty name outline color. Use CSS format or leave
 * blank to use standard.
 * @default 
 * 
 * @param === DIFFICULTY DESCRIPTION ===
 * 
 * @param Description Font
 * @desc Font face for the description text. Leave blank to use standard. See help.
 * @default
 * 
 * @param Description Font Size
 * @desc Size of the font for the description text
 * Default: 18
 * @default 18
 * 
 * @param Description Italic?
 * @desc Difficulty description font in Italic?      YES: true      NO: false 
 * Default: false
 * @default false
 *  
 * @param Description Font Color
 * @desc Color of the font for the description text
 * Use color index (see windowskin)
 * @default 0
 * 
 * @param Description OL Color
 * @desc Description text outline color. Use CSS format or
 * leave blank to use standard.
 * @default
 *
 * @param === DIFFICULTY DETAILS ===
 * 
 * @param Details Font
 * @desc Font face for all other difficulty details. Leave blank to use standard. See help.
 * @default
 * 
 * @param Details Font Size
 * @desc Size of the font for all other difficulty details
 * Default: 28
 * @default 28
 * 
 * @param Details Italic?
 * @desc Difficulty details font in Italic?      YES: true      NO: false 
 * Default: false
 * @default false
 * 
 * @param Details Font Color
 * @desc Color of the font for all other difficulty details
 * Use color index (see windowskin)
 * @default 0
 * 
 * @param Details Outline Color
 * @desc Difficulty details text outline color. Use CSS format or
 * leave blank to use standard.
 * @default
 *
 * @param === DEBUGGING ===
 * 
 * @param Debug Mode
 * @desc Enable to activate console variable logging.  Use for debugging odd behaviour.
 * true to enable console variable logging.
 * @default false
 * 
 * @help
 * ============================================================================
 * Description
 * ============================================================================
 *
 * Adds support for multiple battle and puzzle difficulty levels!  Note that this
 * plugin focuses on providing a framework for battle and puzzle difficulty levels,
 * and scenes for selecting the difficulty level (Options menu was way too simple).
 * Difficulties can set switches and variables to specific values, permadeath and
 * ironman support is built-in to the plugin.  Unlockable difficulty levels are
 * also supported.
 *  
 * With no additional code, battle difficulties will not actually affect combat.
 * But, when combined with custom states, this can be used to set passive states
 * that activate when a given battle difficulty is active to modify player or monster
 * stats.
 * 
 * For puzzles, you will need to manually specify how puzzle difficulty conditions
 * affect your puzzles and hints.  This is left for manual use because of the sheer
 * range of possibilities.
 * 
 * GameSwitches and GameVariables can be used to restrict the attacks monsters use
 * for lower difficulty levels.  Naturally, as with all other variables and switches
 * the limit of their potential uses is up to you.
 * 
 * When specifying game switches/variables in the JSON file, use the format:
 *  INDEX, VALUE; INDEX, VALUE; ... for as many switches/variables you need.
 * ============================================================================
 * Script Access
 * ============================================================================
 * Access difficulty levels via:
 *  ConfigManager.battleDifficulty()
 *  ConfigManager.puzzleDifficulty()
 * 
 * Call the difficulty selection scene via:
 *  SceneManager.openDifficultySelection("battle"); or 
 *  SceneManager.openDifficultySelection("puzzle");
 * ============================================================================
 * Change Log
 * ============================================================================
 * 1.04 - Fixed bug where deceased check prevented dying state from being complied.
 *		- Fixed game switches and variables not setting.  Use format: INDEX, VALUE; INDEX, VALUE; ...
 *		- Option label and death state variables were used inconsistently; now fixed.
 * 1.03a- Fixed bug that happens when no gameSwitches/Variables are set for difficulty.
 * 1.03 - Difficulty system overhauled to allow for custom selection menu instead
 *        going through options.  It doesn't look good using choice command.
 *		- Tons more customizibility now available.
 *		- Solved problem of displaying difficulty selection at start of game.  
 *		- Added picture options.
 *		- Difficulties can now set switches and variables directly.
 *		- Added ironman and permadeath support.
 *		- hidden / unlockable difficulties are now supported.
 *		- Removed pos options.
 * 1.02 - Options area overhauled to support custom difficulty levels and names.
 * 1.01 - Plugin finished.
 * 
 */
//=============================================================================

//=============================================================================
var Imported = Imported || {} ;
var BBS = BBS || {};
Imported.DifficultyLevels = 1;
BBS.DifficultyLevels = BBS.DifficultyLevels || {};

(function() {

	var _sceneDifficulties = {};		// Subset of difficulties.
	var _difficulties;
	
	// Really only used when making and loading config data.
	var _battleDifficulty = pDefBattleDifficulty;
	var _puzzleDifficulty = pDefPuzzleDifficulty;
	var _difficultyType = "battle";
	
	//=============================================================================
	// Parameter Variables
	//=============================================================================
	// This plugin has a few variables...
	var parameters = PluginManager.parameters('BBS_DifficultyLevels');
	var pDifficultyJsonFile		 		= String(parameters['Difficulty Json File'] || 'data/difficulty.json');
	var pBattleDifficultyIndex	 		= Number(parameters['Battle Difficulty Game Variable Index'] || -1);
	var pPuzzleDifficultyIndex	 		= Number(parameters['Puzzle Difficulty Game Variable Index'] || -1);
	var pIronmanModeIndex	 			= Number(parameters['Ironman Mode Game Variable Index'] || -1);
	var pPermaDeathIndex				= Number(parameters['Perma-Death Mode Game Variable Index'] || -1);
	var pDeathStateIndex				= Number(parameters['Death State'] || 1);
	
	var pDefBattleDifficulty 	 		= String(parameters['Default Battle Difficulty'] || 'medium');
	var pDefPuzzleDifficulty 	 		= String(parameters['Default Puzzle Difficulty'] || 'medium');
	var pShowTutorialsLabel		 		= String(parameters['Show Tutorials Option Label'] || 'Show Tutorials?');
	var pDefShowTutorials	 	 		= String(parameters['Default Show Tutorials Value'] || 'true');
	
	var pCustomBackground				= String(parameters['Custom Background'] || '').trim();
	var pCustomTitleWindowskin			= String(parameters['Title Windowskin'] || '').trim();
	var pCustomListWindowskin			= String(parameters['Difficulty List Windowskin'] || '').trim();
	var pCustomDetailsWindowskin		= String(parameters['Difficulty Details Windowskin'] || '').trim();

	var pTitleWindowHeight				= Number(parameters['Title Window Height'] || 64);	
	var pBattleTitleText				= String(parameters['Battle Difficulty Title'] || 'Battle Difficulty Selection').trim();
	var pPuzzleTitleText				= String(parameters['Puzzle Difficulty Title'] || 'Puzzle Difficulty Selection').trim();
	var pTitleTextFont					= String(parameters['Title Font'] || '').trim();
	var pTitleTextSize					= Number(parameters['Title Font Size'] || 38);
	var pTitleTextItalic				= eval(String(parameters['Title Italic?'] || 'false'));
	var pTitleTextColor					= String(parameters['Title Font Color'] || '0').trim();
	var pTitleTextOutlineColor			= String(parameters['Title Outline Color'] || '').trim();	
	
	var pGradientLineColorCenter		= String(parameters['Line Center Color'] || 'rgba(255,255,255,1)').trim();
	var pGradientLineColorBorder		= String(parameters['Line Border Color'] || 'rgba(255,255,255,0)').trim();
	
	var pDifficultyListWindowWidth		= Number(parameters['Difficulty List Width'] || 180);
	var pDifficultyListTextFont			= String(parameters['Difficulty List Font Size'] || '').trim();
	var pDifficultyListTextSize			= Number(parameters['Difficulty List Font Size'] || 28);
	var pDifficultyListTextItalic		= eval(String(parameters['Difficulty List Italic?'] || 'false'));
	var pDifficultyListTextColor		= String(parameters['Difficulty List Font Color'] || '0').trim();
	var pDifficultyListTextOutlineColor	= String(parameters['Difficulty List Outline Color'] || '').trim();
	
	var pNameTextFont					= String(parameters['Difficulty Name Font'] || '').trim();
	var pNameTextSize					= Number(parameters['Difficulty Name Font Size'] || 28);
	var pNameTextItalic					= eval(String(parameters['Difficulty Name Italic?'] || 'false'));
	var pNameTextColor					= String(parameters['Difficulty Name Font Color'] || '0').trim();
	var pNameTextOutlineColor			= String(parameters['Difficulty Name Outline Color'] || '').trim();

	var pDescriptionTextFont			= String(parameters['Description Font'] || '').trim();	
	var pDescriptionTextSize			= Number(parameters['Description Font Size'] || 18);
	var pDescriptionTextItalic			= eval(String(parameters['Description Italic?'] || 'false'));
	var pDescriptionTextColor			= String(parameters['Description Font Color'] || '0').trim();
	var pDescriptionTextOutlineColor	= String(parameters['Description Outline Color'] || '').trim();
	var pDescriptionTextPos				= String(parameters['Description Text Alignment'] || 'center').trim();
	
	var pDetailsTextFont				= String(parameters['Details Font'] || '').trim();
	var pDetailsTextFontSize			= Number(parameters['Details Font Size'] || 28);
	var pDetailsTextItalic				= eval(String(parameters['Details Italic?'] || 'false'));
	var pDetailsTextColor				= String(parameters['Details Font Color'] || '0').trim();
	var pDetailsTextOutlineColor		= String(parameters['Details Outline Color'] || '').trim();

	var pDebugging	  					= eval(String(parameters['Debug Mode'] || 'false'));
	
	// Make things a bit more user friendly and avoid breaking everything.
	if (pBattleDifficultyIndex < 0) {
		throw "ERROR: Battle Difficulty Game Variable not specified.  Cannot continue.";
	}
	if (pPuzzleDifficultyIndex < 0) {
		throw "ERROR: Puzzle Difficulty Game Variable not specified.  Cannot continue.";
	}	

	// Set later once Graphics.Box variables are available.
	var menuWidthRatio = 0;
	var menuHeightRatio = 0;
	var menuWidth = 0;
	var menuHeight = 0;
	
	var firstColumnWidth = 0;
	var secondColumnWidth = 0;
	
    dataFileName = function () {
		return pDifficultyJsonFile;
    };	

	//=============================================================================
    // Scene_Boot
    //=============================================================================
	var BBS_DL_Scene_Boot_create = Scene_Boot.prototype.create;
	Scene_Boot.prototype.create = function() {
        BBS_DL_Scene_Boot_create.call(this);
        this._loadFile(dataFileName(), _create);
    };
	
    Scene_Boot.prototype._loadFile = function(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.overrideMimeType('application/json');
        request.onload = function() { callback(JSON.parse(request.responseText)); }
        request.onerror = function() { throw new Error('There was an error loading the file ' + url); }
        request.send();
    };
	
	var BBS_DL_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
    Scene_Boot.prototype.isReady = function() {
        return !!_difficulties && BBS_DL_Scene_Boot_isReady.call(this);
    };
	
	//=============================================================================
	// Difficulty
	//============================================================================
	function Difficulty() {
		this.initialize.apply(this, arguments);
	};
	
	Difficulty.prototype.initialize = function(data) {
		console.log(data);
		
		this._name = String(data.name);						// ie. easy
		this._desc = String(data.description);				// ie. A challenge for new warriors
		this._effects = String(data.effects);				// ie. Stronger heroes, less EXP, gold, item drops than Normal
		this._warning = String(data.warning);				// ie. Recommended only for Res Judicata veterans
		this._image = String(data.image);					// ie. A shield
		this._type = String(data.type);						// battle or puzzle
		this._ironman = eval(String(data.ironman));			// If true, saving is disabled completely.
		this._permadeath = eval(String(data.permadeath));	// If true, characters are permanently killed once state 1 is applied.						
		
		// Set provided switch indices to the specified values.
		this._switches = String(data.switches || '').split(';');
		for(var i = 0; i < this._switches.length; i++){
			var sn = this._switches[i].split(',');
			this._switches[i] = {};
			if (sn.length >= 2) {
				this._switches[i].index = Number(sn[0].trim());
				this._switches[i].value = eval(String(sn[1].trim()));
			}
		}
		
		// Set provided variable indices to the specified values.
		this._variables = String(data.variables || '').split(';');
		for(var i = 0; i < this._variables.length; i++){
			var sn = this._variables[i].split(',');
			this._variables[i] = {};
			if (sn.length >= 2) {
				this._variables[i].index = Number(sn[0].trim());
				this._variables[i].value = Number(sn[1].trim());
			}
		}
	};
	
	Difficulty.prototype = Object.create(Difficulty.prototype);
	Difficulty.prototype.constructor = Difficulty;
	
	/**
     * Creates rumors from the given data and loads their current state, afterwards.
     */
    var _create = function(data) {
		if (pDebugging) {
			console.log(data);
		}
		
        var temp = [];
        for(var i = 0, max = data.battleDifficulties.length; i < max; ++i) {
            entry = data.battleDifficulties[i];
            temp.push(new Difficulty(entry));
        }
		for(var i = 0, max = data.puzzleDifficulties.length; i < max; ++i) {
            entry = data.puzzleDifficulties[i];
            temp.push(new Difficulty(entry));
        }
		
        _difficulties = temp;
		
		if (pDebugging) {
			console.log(_difficulties);
		}
    };
	
	var _getIndex = function(difficultyName) {
		if (pDebugging) {
			console.log(difficultyName);
			console.log(_difficulties);
		}
		
		for(var i = 0; i < _difficulties.length; i++) {
			if(_difficulties[i]._name === difficultyName) {
				return i;
			}
		}
		
		return -1;
	};
	
	var _getSceneIndex = function(difficultyName) {
		if (pDebugging) {
			console.log(difficultyName);
			console.log(_sceneDifficulties);
		}
		
		for(var i = 0; i < _sceneDifficulties.length; i++) {
			if(_sceneDifficulties[i]._name === difficultyName) {
				return i;
			}
		}
		
		return -1;
	};
	
	var _getDifficulty = function(difficultyName) {
		for(var i = 0; i < _difficulties.length; i++) {
			if(_difficulties[i]._name === difficultyName) {
				return _difficulties[i];
			}
		}
		
		return null;
	};
	
	// Thanks to Atreyo Ray
	var hiddenDifficulties = function() {
		if ($gameVariables.hiddenDifficulties === undefined){
			$gameVariables.hiddenDifficulties = [];
		}
		return $gameVariables.hiddenDifficulties;
	}


	var isHidden = function(difficultyName) {
		return hiddenDifficulties().contains(difficultyName);
	};

	var hideEntry = function(difficultyName) {
		if (!isHidden(difficultyName)) {
			hiddenDifficulties().push(difficultyName);
		}
	};

	//=============================================================================
	// Scene_DifficultySelect
	//=============================================================================
	function Scene_DifficultySelect() {
		
		_sceneDifficulties = [];
		
		// Filter a subset of difficulties for our scene to display.
		for(var i = 0; i < _difficulties.length; i++) {
			if(_difficulties[i]._type === _difficultyType) {
				_sceneDifficulties.push(_difficulties[i]);
			}
		}
		
		if (_sceneDifficulties.length === 0) {
			throw "ERROR: No difficulties of type " + _difficultyType + "!";
		}
	
		this.initialize.apply(this, arguments);
	}

	Scene_DifficultySelect.prototype = Object.create(Scene_Base.prototype);
	Scene_DifficultySelect.prototype.constructor = Scene_DifficultySelect;

	Scene_DifficultySelect.prototype.initialize = function() {
		Scene_Base.prototype.initialize.call(this);
	};

	Scene_DifficultySelect.prototype.create = function() {
		Scene_Base.prototype.create.call(this);
		this.createBackground();
		this.createWindowLayer();
		this.createTitleWindow();
		this.createDifficultyListWindow();
		this.createDifficultyDetailsWindow();
		
		this._currentDifficultyIndex = -1; //to force details update
	};

	Scene_DifficultySelect.prototype.createBackground = function() {
		this._backgroundSprite = new Sprite();
		if (pCustomBackground === '') {
			this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
		} else {
			this._backgroundSprite.bitmap = Bitmap.load('img/system/' + pCustomBackground + '.png');
		}
		
		this.addChild(this._backgroundSprite);
	};

	Scene_DifficultySelect.prototype.createTitleWindow = function() {
		this._difficultyTitleWindow = new Window_DifficultyTitle();
		this.addWindow(this._difficultyTitleWindow);
	};
	
	Scene_DifficultySelect.prototype.createDifficultyListWindow = function() {
		this._difficultyListWindow = new Window_DifficultyEntryList();
		this._difficultyListWindow.setHandler('ok',     this.onEntryOk.bind(this));
		this.addWindow(this._difficultyListWindow);
	};

	Scene_DifficultySelect.prototype.createDifficultyDetailsWindow = function() {
		this._difficultyDetailsWindow = new Window_DifficultyEntryDetails();
		this.addWindow(this._difficultyDetailsWindow);
	};

	Scene_DifficultySelect.prototype.update = function() {
		Scene_Base.prototype.update.call(this);
		
		if (this._difficultyListWindow.index() !== this._currentDifficultyIndex) {
			var currentDifficulty = this._difficultyListWindow.currentExt();
			if (currentDifficulty !== null){
				this._difficultyDetailsWindow.setDifficulty(currentDifficulty);	
			}
			this._currentDifficultyIndex = this._difficultyListWindow.index();
		}
	};
		 
	Scene_DifficultySelect.prototype.onEntryOk = function() {		
		var selectedDifficulty = this._difficultyListWindow.currentExt();
		
		// Handle type-specific settings first.
		if (_difficultyType === "battle") {
			ConfigManager.setBattleDifficulty(selectedDifficulty._name);
			
			// Handle setting special flags - for battle only.
			ConfigManager.setIronmanMode(selectedDifficulty._ironman);
			ConfigManager.setPermaDeathMode(selectedDifficulty._permadeath);
		}
		if (_difficultyType === "puzzle") {
			ConfigManager.setPuzzleDifficulty(selectedDifficulty._name);
		}
		
		// Now set all type-shared settings.
		console.log(selectedDifficulty._switches);

		if (typeof selectedDifficulty._switches[0].index !== 'undefined') {
			// Set all switches
			for(var i = 0; i < selectedDifficulty._switches.length; i++) {
				$gameSwitches.setValue(selectedDifficulty._switches[i].index, selectedDifficulty._switches[i].value);
				console.log("Set difficulty switch; $gameSwitches[" + selectedDifficulty._switches[i].index + "] = " + selectedDifficulty._switches[i].value);
			}
		}
			
		// Set all variables
		if (typeof selectedDifficulty._variables[0].index !== 'undefined') {
			for(var i = 0; i < selectedDifficulty._variables.length; i++) {
				$gameVariables.setValue(selectedDifficulty._variables[i].index, selectedDifficulty._variables[i].value);
				console.log("Set difficulty variable; $gameVariables[" + selectedDifficulty._variables[i].index + "] = " + selectedDifficulty._variables[i].value);
			}
		}

		SceneManager.pop();
		return;
	};
	
	//=============================================================================
	// Window_DifficultyTitle
	//=============================================================================
	function Window_DifficultyTitle() {
		this.initialize.apply(this, arguments);
	}

	Window_DifficultyTitle.prototype = Object.create(Window_Base.prototype);
	Window_DifficultyTitle.prototype.constructor = Window_DifficultyTitle;

	Window_DifficultyTitle.prototype.initialize = function() {
		// Done here because DifficultyTitle initializes first.
		menuWidthRatio = (Graphics.boxWidth / 10);
		menuHeightRatio = (Graphics.boxHeight / 10);
		menuWidth = menuWidthRatio * 8;
		menuHeight = menuHeightRatio * 8;
	
		firstColumnWidth = 3 * menuWidthRatio;
		secondColumnWidth = menuWidth - firstColumnWidth;
		
		var width = menuWidth;
		var height = pTitleWindowHeight;
		var x = menuWidthRatio;
		var y = menuHeightRatio;
		
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		if (pCustomBackground !== '') {
			this.opacity = 0;
		}
		
		if (pCustomTitleWindowskin !== '') {
			this.windowskin = ImageManager.loadSystem(pCustomTitleWindowskin);
		}
		
		this.refresh();
		
	};

	Window_DifficultyTitle.prototype.refresh = function() {
		this.contents.clear();
		var contentsW = this.width - this.textPadding() - this.standardPadding()*2;
		var contentsX = this.textPadding();
		var y = 2;
		
		// Title
		this.resetFontSettings();
		this.contents.fontSize = pTitleTextSize;
		this.contents.fontItalic = pTitleTextItalic;
		if(pTitleTextFont !== '') {
			this.contents.fontFace = pTitleTextFont;	
		}
		
		this.textColor(pTitleTextColor);
		
		if(pTitleTextOutlineColor !== '') {
			this.contents.outlineColor = pTitleTextOutlineColor;
		}
		
		var drawText = "";
		if(_difficultyType === "battle") {
			drawText = pBattleTitleText;
		}
		else {
			drawText = pPuzzleTitleText;
		}
		
		this.drawText(drawText, contentsX, y, contentsW, 'center');
		this.changeTextColor(this.normalColor());
	};

	//=============================================================================
	// Window_DifficultyEntryList
	//=============================================================================
	function Window_DifficultyEntryList() {
		this.initialize.apply(this, arguments);
	}

	Window_DifficultyEntryList.prototype = Object.create(Window_Command.prototype);
	Window_DifficultyEntryList.prototype.constructor = Window_DifficultyEntryList;

	Window_DifficultyEntryList.prototype.initialize = function() {
		var x = menuWidthRatio;
		var y = menuHeightRatio + pTitleWindowHeight;	
		Window_Command.prototype.initialize.call(this, x, y);
		// Override default width, height, etc.
		this.width = firstColumnWidth;
		this.height = menuHeight - pTitleWindowHeight;
		
		if (pCustomBackground !== '') {
			this.opacity = 0;
		}
		
		if (pCustomListWindowskin !== '') {
			this.windowskin = ImageManager.loadSystem(pCustomListWindowskin);
		}
	
		if (_difficultyType === "battle") {
			this.select(_getSceneIndex(pDefBattleDifficulty));
		} else {
			this.select(_getSceneIndex(pDefPuzzleDifficulty));
		}
		
		this.activate();
	};

	Window_DifficultyEntryList.prototype.windowWidth = function() {
		return firstColumnWidth;
	};

	Window_DifficultyEntryList.prototype.windowHeight = function() {
		return menuHeight - pTitleWindowHeight;
	};

	Window_DifficultyEntryList.prototype.makeCommandList = function() {
		console.log(_sceneDifficulties);
		for (var i = 0; i < _sceneDifficulties.length; i++) {
			var name = _sceneDifficulties[i]._name;
			var symbol = name;
			var enabled = true;
			try {
			  var ext = _getDifficulty(name);
			}
			catch (e){
				console.error(e);
			}
			if (!isHidden(name)) {
				console.log(name + ", " + symbol + ", " + enabled + ", " + ext);
				this.addCommand(name, symbol, enabled, ext);
			}
		}
	};

	Window_DifficultyEntryList.prototype.drawItem = function(index) {
		var rect = this.itemRectForText(index);
		var align = 'left';
		this.resetTextColor();
		this.changePaintOpacity(this.isCommandEnabled(index));
		
		this.resetFontSettings();
		if(pDifficultyListTextFont !== '') {
			this.contents.fontFace = pDifficultyListTextFont;
		}
		
		console.log(pDifficultyListTextSize);
		this.contents.fontSize = pDifficultyListTextSize;
		this.textColor(pDifficultyListTextColor);
		
		if(pDifficultyListTextOutlineColor !== '') {
			this.contents.outlineColor = pDifficultyListTextOutlineColor;
		}
		
		console.log(rect);
		console.log(this.commandName(index));
		this.drawTextEx(this.commandName(index), rect.x, rect.y, rect.width, align);
		this.changeTextColor(this.normalColor());
	};

	Window_DifficultyEntryList.prototype.processOk = function() {
		if (this.isCurrentItemEnabled()) {
			var index = this.index();
			this.playOkSound();  

			this.updateInputData();
			//this.deactivate();
			this.callOkHandler();
		} else {
			this.playBuzzerSound();
		}
	};

	//=============================================================================
	// Window_DifficultyEntryDetails
	//=============================================================================
	function Window_DifficultyEntryDetails() {
		this.initialize.apply(this, arguments);
	}

	Window_DifficultyEntryDetails.prototype = Object.create(Window_Base.prototype);
	Window_DifficultyEntryDetails.prototype.constructor = Window_DifficultyEntryDetails;

	Window_DifficultyEntryDetails.prototype.initialize = function() {
		var width = secondColumnWidth;
		var height = menuHeight - pTitleWindowHeight;
		
		this.yThird = height / 3;
		
		var x = menuWidthRatio + firstColumnWidth;
		var y = menuHeightRatio + pTitleWindowHeight;
		
		Window_Base.prototype.initialize.call(this, x, y, width, height);
		if (pCustomBackground !== '') {
			this.opacity = 0;
		}
		
		if (pCustomDetailsWindowskin !== '') {
			this.windowskin = ImageManager.loadSystem(pCustomDetailsWindowskin);
		}
		
		this.images = [];
		for (var i = 0; i < _sceneDifficulties.length; i++) {
			this.images.push(ImageManager.loadPicture(_sceneDifficulties[i]._image, 0));
		}
		
		this.active = true;
		this._touching = false;
		this._wordWrap = true;
		
		this._difficulty = null;
		this._name = '';
		this._description = '';
		this._effects = '';
		this._warning = '';
		this._pictureSrc = null;
		
		this.index = 0;
	};

	Window_DifficultyEntryDetails.prototype.setDifficultyDetails = function() {	
		if (this._difficulty === undefined) {
			this._name = '';
			this._description = '';
			this._effects = '';
			this._warning = '';
			this._pictureSrc = null;
			this.refresh();
		} 
		else {
			this._name = this._difficulty._name;
			this._description = this._difficulty._desc;
			this._effects = this._difficulty._effects;
			this._warning = this._difficulty._warning;
			this._pictureSrc = this._difficulty._image;
			this.index = _getSceneIndex(this._name);
			this.refresh();
		}
	};

	Window_DifficultyEntryDetails.prototype.clear = function() {
		this.setDetails();
	};

	Window_DifficultyEntryDetails.prototype.setDifficulty = function(difficulty) {	
		this._difficulty = difficulty;
		this.setDifficultyDetails();
	};

	Window_DifficultyEntryDetails.prototype.refresh = function() {
		this.contents.clear();
		var contentsW = this.width - this.textPadding() - this.standardPadding()*2;
		var contentsX = this.textPadding();
		var y = 2;
		
		// Name
		this.resetFontSettings();
		this.contents.fontSize = pNameTextSize;
		this.contents.fontItalic = pNameTextItalic;
		if(pNameTextFont !== '') {
			this.contents.fontFace = pNameTextFont;	
		}
		
		this.textColor(pNameTextColor);
		
		if(pNameTextOutlineColor !== '') {
			this.contents.outlineColor = pNameTextOutlineColor;
		}
		
		console.log(this._name);
		this.drawText(this._name, contentsX, y, contentsW, 'center');
		this.changeTextColor(this.normalColor());
		
		// Gradient Line
		y += this.lineHeight() + 10;
		this.drawGradientLine(y, contentsW);
		y += 10;
			
		if (this._difficulty != undefined) {
			// Description
			if (this._description.trim() !== '') {
				this.resetFontSettings();
				this.contents.fontSize = pDescriptionTextSize;
				this.contents.fontItalic = pDescriptionTextItalic;
				if(pDescriptionTextFont !== '') {
					this.contents.fontFace = pDescriptionTextFont;	
				}

				this.textColor(pDescriptionTextColor);
				
				if(pDescriptionTextOutlineColor !== '') {
					this.contents.outlineColor = pDescriptionTextOutlineColor;
				}
				
				this.drawText(this._warning, contentsX, y, contentsW, pDescriptionTextPos);
				this.changeTextColor(this.normalColor());
				y += this.lineHeight() + 10;
			}
		}
		
		// Jump to second third
		y = this.yThird * 1;
		
		//Picture
		var pic = this.images[this.index];
		if (pic !== null) {
			var sw = pic.width;
			var sh = pic.height;
			var dy = y;

			var dx = (contentsW / 2) - (pic.width / 2);
			this.contents.blt(pic, 0, 0, sw, sh, dx, dy);
			y += pic.height + 10;
		}
		
		// Jump to last third
		y = this.yThird * 2;
		
		// Effects
		this.resetFontSettings();
		if(pDetailsTextFont !== '') {
			this.contents.fontFace = pDetailsTextFont;	
		}
	
		this.contents.fontItalic = pDetailsTextItalic;
		if(pDetailsTextOutlineColor !== '') {
			this.contents.outlineColor = pDetailsTextOutlineColor;
		}
		
		this.textColor(pDetailsTextColor);
		
		if (this._effects !== '') {
			this.contents.fontSize = pDetailsTextFontSize;
			var drawText = '<WordWrap>' + this._effects;
			
			this.saveCurrentWindowSettings();
			this.drawTextEx(drawText, 0, y);
			this.restoreCurrentWindowSettings();
		}
		this.changeTextColor(this.normalColor());
	};

		
	Window_DifficultyEntryDetails.prototype.standardFontSize = function() {
		return pDetailsTextFontSize;
	};
	
	Window_DifficultyEntryDetails.prototype.drawGradientLine = function(y,w) {
		var ctx = this.contents.context;
		var lw = w * 2/3;
		var lx = (w - w * 2/3)/2;
		var lineargradient1 = ctx.createLinearGradient(lx,0,w/2,0);
		lineargradient1.addColorStop(0, pGradientLineColorBorder);
		lineargradient1.addColorStop(1, pGradientLineColorCenter);
		ctx.fillStyle = lineargradient1;
		ctx.fillRect(lx, y, lw/2, 2);
		
		var lineargradient2 = ctx.createLinearGradient(w/2,0,lx+lw,0);
		lineargradient2.addColorStop(0, pGradientLineColorCenter);
		lineargradient2.addColorStop(1, pGradientLineColorBorder);
		ctx.fillStyle = lineargradient2;
		ctx.fillRect(w/2, y, lw/2, 2);
	};

	Window_DifficultyEntryDetails.prototype.drawDetailsTextEx = function(text, x, y, textPos) {
		if (text) {
			var textState = { index: 0, x: x, y: y, left: x };
			textState.text = this.convertEscapeCharacters(text);
			textState.height = this.calcTextHeight(textState, false);
			while (textState.index < textState.text.length) {
				this.processCharacter(textState);
			}
			return textState.x - x;
		} else {
			return 0;
		}
	};

	//=============================================================================
	// Window_Options
	//=============================================================================
	getDefaultShowTutorialsOption = function() {
		if (pDefShowTutorials.match(/true/i)) {
		  return true;
		} else if (pDefShowTutorials.match(/false/i)) {
		  return false;
		} else {
		  return Utils.isNwjs();
		}
	};

	ConfigManager.showTutorials = getDefaultShowTutorialsOption();
	
	var bbs_dl_Window_Options_addGeneralOptions =
		Window_Options.prototype.addGeneralOptions;
	Window_Options.prototype.addGeneralOptions = function() {
		bbs_dl_Window_Options_addGeneralOptions.call(this);
		this.addCommand(pShowTutorialsLabel, 'showTutorials');
	};
	
	//=============================================================================
	// ConfigManager
	//=============================================================================
	var bbs_dl_Configmanager_makeData = ConfigManager.makeData;
	ConfigManager.makeData = function() {
		var config = bbs_dl_Configmanager_makeData.call(this);
		config.showTutorials = this.showTutorials;
		return config;
	};

	var bbs_dl_Configmanager_applyData = ConfigManager.applyData;
	ConfigManager.applyData = function(config) {
		bbs_dl_Configmanager_applyData.call(this, config);
		this.showTutorials = this.readShowTutorials(config, 'showTutorials');
	};
	
	ConfigManager.readShowTutorials = function(config, name) {
		var value = config[name];
		if (value !== undefined) {
			return value;
		} else {
			return getDefaultShowTutorialsOption();
		}
	};
	
	ConfigManager.battleDifficulty = function() {
		return $gameVariables.value(pBattleDifficultyIndex);
	};
	
	ConfigManager.puzzleDifficulty = function() {
		return $gameVariables.value(pPuzzleDifficultyIndex);
	};
	
	ConfigManager.setBattleDifficulty = function(difficultyName) {
		$gameVariables.setValue(pBattleDifficultyIndex, difficultyName);
	};
	
	ConfigManager.setPuzzleDifficulty = function(difficultyName) {
		$gameVariables.setValue(pPuzzleDifficultyIndex, difficultyName);
	};
	
	ConfigManager.ironmanMode = function() {
		if (pIronmanModeIndex > 0) {
			return $gameSwitches.value(pIronmanModeIndex);
		}
		
		return false;
	};
	
	ConfigManager.permaDeath = function() {
		if (pPermaDeathModeIndex > 0) {
			return $gameSwitches.value(pPermaDeathModeIndex);
		}
		
		return false;
	};
	
	ConfigManager.setIronmanMode = function(ironmanMode) {
		if (pIronmanModeIndex > 0) {
			$gameSwitches.setValue(pIronmanModeIndex, ironmanMode);
		}
	};
	
	ConfigManager.setPermaDeathMode = function(permaDeathMode) {
		if (pPermaDeathIndex > 0) {
			$gameSwitches.setValue(pPermaDeathIndex, permaDeathMode);
		}
	};
	
	//=============================================================================
	// SceneManager
	//=============================================================================	
	SceneManager.openDifficultySelection = function(difficultyType) {
		_difficultyType = difficultyType;
		SceneManager.push(Scene_DifficultySelect);
	};

	//=============================================================================
	// Window_MenuCommand
	//=============================================================================		
	var BBS_DL_Window_MenuCommand_isSaveEnabled = Window_MenuCommand.prototype.isSaveEnabled;
	Window_MenuCommand.prototype.isSaveEnabled = function() {
		// Ironman mode means no saving, ever.
		return !ConfigManager.ironmanMode() && BBS_DL_Window_MenuCommand_isSaveEnabled.call(this);
	};
	
	//=============================================================================
	// Scene_Map
	//=============================================================================
	var BBS_DL_Scene_Map_autosave = Scene_Map.prototype.autosave;
	Scene_Map.prototype.autosave = function() {
		// Autosaves don't happen for ironman mode!
		if (ConfigManager.ironmanMode() === false) {
			BBS_DL_Scene_Map_autosave.call(this);
		}
	}

	//=============================================================================
	// Scene_Menu
	//=============================================================================
	var BBS_DL_Scene_Menu_commandSave = Scene_Menu.prototype.commandSave;
	Scene_Menu.prototype.commandSave = function() {
		// Ironman mode means no save for you!
		if (ConfigManager.ironmanMode() === false) {
			BBS_DL_Scene_Menu_commandSave.call(this);
		}
	};
	
	//=============================================================================
	// Game_Battler
	//=============================================================================
	var BBS_DL_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
	Game_Battler.prototype.initMembers = function() {
		BBS_DL_Game_Battler_initMembers.call(this);
		this.setDeceased(false);
	};
	
	var BBS_DL_Game_Battler_addState = Game_Battler.prototype.addState;
	Game_Battler.prototype.addState = function(stateId) {
		
		// Don't prevent adding death state (oops) - MM 5/25/17
		if (stateId === pDeathStateIndex) {
			BBS_DL_Game_Battler_addState.call(this, stateId);
			return;
		}
		
		// States cannot be added when Perma-Dead either.
		if (this.isDeceased() === false) {
			var deathState = (stateId === pDeathStateIndex);
			var lifeState = this.isAlive();
			
			
			BBS_DL_Game_Battler_addState.call(this, stateId);
			
			if (deathState && lifeState !== this.isAlive()) {
				this.setDeceased(true);
			}
		}
	};
	
	// Prevent deceased state from being removed by any means.  Perma-Death is permanent.
	// This means commands like RestoreParty can still be used without reviving
	// Perma-Dead characters.  Simple but effective.
	var BBS_DL_Game_Battler_removeState = Game_Battler.prototype.removeState;
	Game_Battler.prototype.removeState = function(stateId) {
		if (this.isDeceased() === false) {
			BBS_DL_Game_Battler_removeState.call(this, stateId);
		}
	};
	
	Game_Battler.prototype.isDeceased = function() {
		return this._deceased;
	};
	
	Game_Battler.prototype.setDeceased = function(deceased) {
		if(this._deceased === undefined) { this._deceased = false; }
		
		// Prevent accidentally resurrecting perma-Dead characters.
		if(this._deceased === true) { return; }
		
		// Otherwise the deceased flag can be set freely.
		this._deceased = deceased;
	};
	
	// Add buff / debuff only applies to alive battlers, deathState means battler is not alive.

})(BBS.DifficultyLevels);
//=============================================================================
// End of File
//=============================================================================