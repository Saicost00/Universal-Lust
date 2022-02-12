//-----------------------------------------------------------------------------
//  Galv's Dynamic Traits
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  Galv_DynamicTraits.js
//-----------------------------------------------------------------------------
//  2016-10-30 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_DynamicTraits = true;

var Galv = Galv || {};                  // Galv's main object
Galv.DTRAITS = Galv.DTRAITS || {};          // Galv's stuff

// Galv Notetag setup (Add notes required for this plugin if not already added)
Galv.noteFunctions = Galv.noteFunctions || [];       // Add note function to this.

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.0) Add traits to an actor during game or gain traits on level up.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Display Trait On Level
 * @desc true or false if trait gains are displayed in default level up message
 * @default true
 *
 * @param Trait Gained Text
 * @desc The text displayed before gaining a trait on level up
 * @default Gained Trait:
 *
 *
 * @help
 *   Galv's Dynamic Traits
 * ----------------------------------------------------------------------------
 * This plugin allows you to manually add new traits to actors during the game
 * or to set up actors and classes to give new traits when actors level up.
 * Actors and classes have notetags that control which traits will be gained
 * when reaching certain levels and a notification of traits gained can be
 * added to the level up message if desired.
 *
 * Customizing the trait level-up text more in detail is possible but must be
 * done by editing the plugin file and requires a little bit of javascript
 * understanding to see how it works. Please do not ask Galv to teach you this.
 *
 * ----------------------------------------------------------------------------
 *   NOTE TAG for ACTORS and CLASSES
 * ----------------------------------------------------------------------------
 * Traits gained at level
 * ----------------------
 * Actors and classes can be tagged with the following note tag to specify a
 * list of traits that will be gained on each designated level-up. You can have
 * as many lvl,code,id,val traits each separated by |.
 *
 *       <traits:lvl,code,id,val|lvl,code,id,val|lvl,code,id,val>
 *
 * lvl is the level that the trait will be aquired at
 * code, id and val settings can be seen in the below table.
 *
 * TRAIT                      CODE         ID               VAL
 * ------------------         -------      -----------      -------------
 * Element Rate               11           elementId        % as decimal
 * Debuff Rate                12           paramId*         % as decimal
 * State Rate                 13           stateId          % as decimal
 * State Resist               14           stateId          N/A
 *
 * Parameter                  21           paramId*         % as decimal
 * Ex-Parameter               22           ExParamId*       % as decimal
 * Sp-Parameter               23           SpParamId*       % as decimal
 *
 * Attack Element             31           elementId        N/A
 * Attack State               32           stateId          % as decimal
 * Attack Speed               33           integer          N/A
 * Attack Times +             34           0                integer
 *
 * Add Skill Type             41           skillTypeId      N/A
 * Seal Skill Type            42           skillTypeId      N/A
 * Add Skill                  43           skillId          N/A
 * Seal Skill                 44           skillId          N/A
 *
 * Equip Weapon               51           weaponTypeId     N/A
 * Equip Armor                52           armorTypeId      N/A     
 * Lock Equip                 53           equipTypeId      N/A
 * Seal Equip                 54           equipTypeId      N/A  
 * Slot Type                  55           0 norm 1 dual    N/A
 *
 * Action Times +             61           0                % as decimal
 * Special Flag               62           flagId*          N/A
 * Collapse Effect            63           collapseId*      N/A
 * Party Ability              64           partyAbilityId*  N/A
 * ----------------------------------------------------------------------------
 * NOTES:
 *   ID's generally start at 1 for values that can be seen in the database.
 *   Where there is a * above, the first id in their list is 0 instead of 1.
 *
 *   Where VAL is N/A, simply put 0 in the val position of the notetag/script
 *
 *   Actors will use the highest level trait if multiple level ups have the
 *   same trait (same trait code).
 *   Classes will use the highest level trait if multiple level ups have the
 *   same trait (same trait code).
 *   This means that if an actor has the same trait code as class class's trait
 *   then the actor will use BOTH traits but only the highest from each.
 * ----------------------------------------------------------------------------
 * 
 * ----------------------------------------------------------------------------
 *  SCRIPT CALLS
 * ----------------------------------------------------------------------------
 * Actors can have traits added to them manually via script calls. Script calls
 * can also be used to remove these added traits from the actor again (but it
 * cannot remove traits added via level or from actors/items/states/etc/ from
 * the database).
 * Adding traits using this method will replace any previous traits also added
 * by this method that have the same code. (So only one of each trait can exist
 * on an actor from these manually added traits).
 *
 *    Galv.DTRAITS.addTrait(actorId,code,id,value);
 *
 *    Galv.DTRAITS.removeTrait(actorId,code);
 *
 * ----------------------------------------------------------------------------
 */



//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

//-----------------------------------------------------------------------------
//  LEVEL UP TEXT
//-----------------------------------------------------------------------------
// Below is a list of traits and how the text displays in the level up message.
// To make a trait not display in level up txt, make the name an empty string ''

Galv.DTRAITS.names = {
// integer: {name: 'string', d: 'eval string', v 'string', message: 'level up message'},

	11: {name: 'Element Rate',		d: '$dataSystem.elements[#1]',		v:'#1%',		message:'#n #d #v'},	// Element Rate
	12: {name: 'Debuff Rate',		d: '$dataSystem.terms.params[#1]',	v:'#1%',		message:'#n #d #v'},	// Debuff Rate
	13: {name: 'State Rate',		d: '$dataStates[#1].name',			v:'#1%',		message:'#n #d #v'},	// State Rate
	14: {name: 'State Resist',		d: '$dataStates[#1].name',			v:'',			message:'#n #d'},		// State Resist
	
	21: {name: 'Parameter',			d: '$dataSystem.terms.params[#1]',	v:'#1%',		message:'#d #v'},	// Parameter
	22: {name: 'Ex-Parameter',		d: 'Galv.DTRAITS.xparams[#1]',		v:'#1%',		message:'#d #v'},	// Ex-Params
	23: {name: 'Sp-Parameter',		d: 'Galv.DTRAITS.sparams[#1]',		v:'#1%',		message:'#d #v'},	// Sp-Params
	
	31: {name: 'Attack Element',	d: '$dataSystem.elements[#1]',		v:'',			message:'#n #d'},		// Attack Element
	32: {name: 'Attack State',		d: '$dataSystem.elements[#1]',		v:'',			message:'#n #d'},		// Attack State
	33: {name: 'Attack Speed',		d: '#1',							v:'',			message:'#n #d'},		// Attack Speed
	34: {name: 'Attack Times +',	d: '#1',							v:'',			message:'#n #d'},		// Attack Times +
	
	41: {name: 'Add Skill Type',	d:'$dataSystem.skillTypes[#1]',		v:'',			message:'#n #d'},		// Add Skill Type
	42: {name: 'Seal Skill Type',	d:'$dataSystem.skillTypes[#1]',		v:'',			message:'#n #d'},		// Seal Skill Type
	43: {name: 'Add Skill',			d:'$dataSkills[#1].name',			v:'',			message:'#n #d'},		// Add Skill
	44: {name: 'Seal Skill',		d:'$dataSkills[#1].name',			v:'',			message:'#n #d'},		// Seal Skill
	
	51: {name: 'Equip Weapon',		d:'$dataSystem.weaponTypes[#1]',	v:'',			message:'#n #d'},		// Equip Weapon (Type)
	52: {name: 'Equip Armor',		d:'$dataSystem.armorTypes[#1]',		v:'',			message:'#n #d'},		// Equip Armor (Type)
	53: {name: 'Lock Equip',		d:'$dataSystem.equipTypes[#1]',		v:'',			message:'#n #d'},		// Lock Equip (Type)
	54: {name: 'Seal Equip',		d:'$dataSystem.equipTypes[#1]',		v:'',			message:'#n #d'},		// Seal Equip (Type)
	55: {name: 'Slot Type',			d:'#1 == 1 ? "Dual Wield" : ""',	v:'',			message:'#n #d'},		// Slot Type (0 norm, 1 dual wield)
	
	61: {name: 'Action Times +',	d:'',								v:'',			message:'#n'},			// Ation Times +
	62: {name: 'Special Flag',		d:'Galv.DTRAITS.sFlags[#1]',		v:'',			message:'#d'},		// Special Flag
	63: {name: '',					d:'',								v:'',			message:'#n'},			// Collapse Effect
	64: {name: 'Party Ability',		d:'Galv.DTRAITS.pAbility[#1]',		v:'',			message:'#d'},		// Party Ability
};

Galv.DTRAITS.xparams = {
	0: 'Hit rate',
	1: 'Evasion rate',
	2: 'Critical rate',
	3: 'Critical Evasion rate',
	4: 'Magic Evasion rate',
	5: 'Magic Reflection rate',
	6: 'Counter attack rate',
	7: 'Hp Regeneration rate',
	8: 'Mp Regeneration rate',
	9: 'Tp Regeneration rate',
};

Galv.DTRAITS.sparams = {
	0: 'Target Rate',
	1: 'Guard effect rate',
	2: 'Recovery effect rate',
	3: 'Pharmacology',
	4: 'Mp Cost Rate',
	5: 'Tp Charge Rate',
	6: 'Physical Damage Rate',
	7: 'Magical Damage Rate',
	8: 'Floor Damage Rate',
	9: 'Experience Rate',
};

Galv.DTRAITS.sFlags = {
	0: 'Auto Battle',
	1: 'Guard',
	2: 'Substitute',
	3: 'Preserve Tp'
};

Galv.DTRAITS.pAbility = {
	0: 'Encounter Half',
	1: 'Encounter None',
	2: 'Cancel Surprise',
	3: 'Raise Pre-emptive',
	4: 'Gold Double',
	5: 'Drop Item Double'
};


//-----------------------------------------------------------------------------
//  OTHER STUFF
//-----------------------------------------------------------------------------

Galv.DTRAITS.displayLevel = PluginManager.parameters('Galv_DynamicTraits')["Display Trait On Level"].toLowerCase() === 'true' ? true : false;
Galv.DTRAITS.gainTxt = PluginManager.parameters('Galv_DynamicTraits')["Trait Gained Text"];

Galv.DTRAITS.createTrait = function(code,id,value) {
	return {code: Number(code), dataId: Number(id), value: Number(value)};
};

Galv.DTRAITS.addTrait = function(actorId,code,id,value) {
	var actor = $gameActors.actor(actorId);
	if (actor) actor._dTraits[code] = Galv.DTRAITS.createTrait(code,id,value);
};

Galv.DTRAITS.removeTrait = function(actorId,code) {
	var actor = $gameActors.actor(actorId);
	if (actor) delete(actor._dTraits[code]);
};

Galv.DTRAITS.traitTxt = function(trait) {
	var c = trait.code;
	var d = trait.dataId;
	var v = trait.value;

	if (!Galv.DTRAITS.names[trait.code].name) return null;
	
	// #n
	var name = Galv.DTRAITS.names[trait.code].name;
	
	// #d
	var data = Galv.DTRAITS.names[trait.code].d;
	data = data.replace('#1',d);
	data = eval(data) || '';
	
	// #v
	var value = Galv.DTRAITS.names[trait.code].v;
	if (value.contains('%')) v = Number(v * 100);
	value = value.replace('#1',v);
	
	var text = Galv.DTRAITS.names[trait.code].message;
	text = text.replace('#n', name);
	text = text.replace('#d', data);
	text = text.replace('#v', value);
	
	return Galv.DTRAITS.gainTxt + ' ' + text;
};


//-----------------------------------------------------------------------------
//  NOTE TAGS
//-----------------------------------------------------------------------------

if (!Galv.notetagAlias) {   // Add alias only if not added by another Galv plugin
	Galv.DTRAITS.Scene_Boot_start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function() {	
		for (var i = 0;i < Galv.noteFunctions.length; i++) {
			Galv.noteFunctions[i]();	
		};
		Galv.DTRAITS.Scene_Boot_start.call(this);
	};
	Galv.notetagAlias = true;
};

Galv.DTRAITS.notetags = function() {
	// Class
	for (var i = 1;i < $dataClasses.length;i++) {
		$dataClasses[i].traitsByLvl = {};
		var note = $dataClasses[i].note.toLowerCase().match(/<traits:(.*)>/i)
		if (note) {
			note = note[1].split('|');
			
			for (var t = 0; t < note.length; t++) {
				var data = note[t].split(',');
				var lvl = Number(data[0]);
				var code = Number(data[1]);
				if (!$dataClasses[i].traitsByLvl[lvl]) $dataClasses[i].traitsByLvl[lvl] = {};
				$dataClasses[i].traitsByLvl[lvl][code] = Galv.DTRAITS.createTrait(data[1],data[2],data[3]);
			}
		}
	};
	
	// Actor
	for (var i = 1;i < $dataActors.length;i++) {
		$dataActors[i].traitsByLvl = {};
		var note = $dataActors[i].note.toLowerCase().match(/<traits:(.*)>/i)
		if (note) {
			note = note[1].split('|');
			
			for (var t = 0; t < note.length; t++) {
				var data = note[t].split(',');
				var lvl = Number(data[0]);
				var code = Number(data[1]);
				if (!$dataActors[i].traitsByLvl[lvl]) $dataActors[i].traitsByLvl[lvl] = {};
				$dataActors[i].traitsByLvl[lvl][code] = Galv.DTRAITS.createTrait(data[1],data[2],data[3]);
			}
		}
	};
};

Galv.noteFunctions.push(Galv.DTRAITS.notetags);


//-----------------------------------------------------------------------------
//  GAME ACTOR
//-----------------------------------------------------------------------------

Galv.DTRAITS.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
	Galv.DTRAITS.Game_Actor_initMembers.call(this);
	this._dTraits = {};
};

Galv.DTRAITS.Game_Actor_allTraits = Game_Actor.prototype.allTraits;
Game_Actor.prototype.allTraits = function() {
	var traits = Galv.DTRAITS.Game_Actor_allTraits.call(this);

	var cTraits = [];  // class traits by level
	var aTraits = [];  // actor traits by level
	
	for (var lvl = 1; lvl < this._level + 1; lvl++) {
		// class
		var clvlTraits = $dataClasses[this._classId].traitsByLvl[lvl];
		if (clvlTraits) {
			for (var trait in clvlTraits) {
				var code = clvlTraits[trait].code
				cTraits[code] = clvlTraits[trait];
			}
		}
		
		// actor
		var alvlTraits = $dataActors[this._actorId].traitsByLvl[lvl];
		if (alvlTraits) {
			for (var trait in alvlTraits) {
				var code = alvlTraits[trait].code
				aTraits[code] = alvlTraits[trait];
			}
		}
	}
	
	// ACTOR MANUALLY ADDED TRAITS
	for (var trait in this._dTraits) {
		traits.push(this._dTraits[trait]);
	}
	
	// MERGE TRAIT ARRAYS
	traits = traits.concat(aTraits,cTraits);

	return traits;
};


// display in level up?
if (Galv.DTRAITS.displayLevel) {

	Galv.DTRAITS.Game_Actor_changeExp = Game_Actor.prototype.changeExp;
	Game_Actor.prototype.changeExp = function(exp, show) {
		if (show) this._tempLastTraits = this.allTraits();
		Galv.DTRAITS.Game_Actor_changeExp.call(this,exp,show);
	};
	
	Galv.DTRAITS.Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
	Game_Actor.prototype.displayLevelUp = function(newSkills) {
		Galv.DTRAITS.Game_Actor_displayLevelUp.call(this,newSkills);
		this.displayLevelTraits();
	};
	
	Game_Actor.prototype.findNewTraits = function() {
		var newTraits = this.allTraits();

		if (this._tempLastTraits) {
			for (var i = 0; i < this._tempLastTraits.length; i++) {
				var index = newTraits.indexOf(this._tempLastTraits[i]);
				if (index >= 0) {
					newTraits.splice(index, 1);
				}
			}
		}
		return newTraits;
	};
	
	Game_Actor.prototype.displayLevelTraits = function() {
		var newTraits = this.findNewTraits();
		
		newTraits.forEach(function(trait) {
			var txt = Galv.DTRAITS.traitTxt(trait);
			if (txt) $gameMessage.add(txt);
		});
		
		this._tempLastTraits = null;
	};
}

})();
