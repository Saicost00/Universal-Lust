//-----------------------------------------------------------------------------
//  Galv's Weapon Proficiency
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  Galv_WeaponProf.js
//-----------------------------------------------------------------------------
//  2017-08-19 - Version 1.4 - Updated for compatibility with plugins that
//                             overwrite draw item name function
//  2017-08-08 - Version 1.3 - Fixed bug that allowed non-physical skills to
//                             earn proficiency xp
//  2017-04-26 - Version 1.2 - Added script commands to get actor proficiency
//                           - values
//  2017-03-16 - Version 1.1 - now only shows weapon types that characters are
//                             capable of equipping in the menus.
//  2016-12-20 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_WeaponProf = true;

var Galv = Galv || {};                  // Galv's main object
Galv.WPROF = Galv.WPROF || {};          // Galv's stuff

// Galv Notetag setup (Add notes required for this plugin if not already added)
Galv.noteFunctions = Galv.noteFunctions || [];       // Add note function to this.

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.4) Actors can be more effective when using weapon types they are proficient in.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Hit Bonus Per Point
 * @desc How much hit % increases per point of weapon proficiency
 * @default 1
 *
 * @param Crit Bonus Per Point
 * @desc How much crit % increases per point of weapon proficiency
 * @default 0.1
 *
 * @param Default Max Value
 * @desc The maximum value a weapon proficiency can be.
 * @default 100
 *
 * @param XP Per Hit
 * @desc The amount of proficiency XP gained when hitting with a weapon
 * @default 1
 *
 * @param XP Per Miss
 * @desc The amount of proficiency XP gained when missing with a weapon
 * @default 1
 *
 * @param XP Required For Level
 * @desc The base amount of XP required to raise a weapon proficiency each level
 * @default 10
 *
 * @param Additional XP Per Level
 * @desc An additional amount of XP required multiplied by the current weapon proficiency level
 * @default 1
 *
 * @param Weapon Type Icons
 * @desc A list of icon id's ordered like Weapon Types in your database, the first being unarmed.
 * @default 77,96,97,98,99,100,101,102,103,104,105,106,107
 *
 * @param Prof Up Animation
 * @desc Animation id played on sideview actor when their weapon proficiency is raised during battle
 * @default 2
 *
 * @param Unarmed Name
 * @desc Text for unarmed weapon type 0.
 * @default Unarmed
 *
 * @param Skill Category
 * @desc The name for weapon proficiency skill category in menus
 * @default Proficiency
 *
 * @param Default Skill Menu
 * @desc true or false to add to the skill menu or not if it is installed.
 * @default true
 *
 * @param Yanfly Status Menu
 * @desc true or false to add to Yanfly's status menu or not if it is installed.
 * @default false
 *
 *
 * @help
 *   Galv's Weapon Proficiency
 * ----------------------------------------------------------------------------
 * Actors will have a new value for each weapon type in your project. These
 * values represent their proficiency with each weapon and can give a bonus to
 * their hit chance and critical rate when wielding them. (Note, critical rate
 * bonus only applies to skills that can crit).
 * You can also add code to skill damage formulas to take the actor's weapon
 * proficiency of the currently equipped weapon into account and use it in the
 * equation.
 *
 * The actor can increase their weapon proficiencies during the game. A class
 * can have an inate weapon proficiency as well, but it never changes and will
 * get added to the actor's proficiency during equations.
 *
 * Enemies can also each have a single weapon proficiency value for use in any
 * skill formula calculations.
 *
 * Raising Weapon Proficiency
 * --------------------------
 * Proficiency is raised by an actor using their weapon in combat. Every hit or
 * miss can add weapon proficiency xp to their currently wielded weapon type
 * and when they reach the required weapon proficiency XP their proficiency
 * will increase and an animation will play on the actor. The amount of XP
 * gained per hit and miss and the amount required per level can be changed in
 * the plugin settings.
 *
 * NOTE: a skill must be set to Hit Type 'Phyiscal Attack' to gain prof xp or
 * have an effect on crit/hit chance.
 *
 * Show proficiencies in menu
 * --------------------------
 * There are two plugin settings to show the actor's weapon proficiencies. One
 * of them adds a new category to the default Skills menu, and the other adds a
 * new category to Yanfly's Status menu (if you have that installed).
 * Any other menus will require javascript knowledge in order to add.
 * Only weapon types that the actor has a trait allowing them to equip will
 * appear in the menu.
 * 
 * ----------------------------------------------------------------------------
 *   NOTE TAG for ACTORS or CLASSES
 * ----------------------------------------------------------------------------
 * 
 *  <prof:id|x|x2,id|x|x2>  // id = weapon type id (from database)
 *                          //      0 is for unarmed proficiency
 *                          //  x = the weapon proficiency value an actor/class
 *                          //      has with the weapon type. If no tag exists
 *                          //      or not weapon types are added to this list
 *                          //      the weapon proficiency will be 0
 *                          // x2 = the maximum value a weapon proficiency can
 *                          //      be for that actor or class. The actor max
 *                          //      takes priority over the class max.
 *                          //      leave out the |x2 to use the default max
 *                          //      value specified in the pluin settings
 *
 * EXAMPLES
 * <prof:1|20>            // set weapon type 1 (Default is dagger) to 20.
 * <prof:1|20,2|30>       // same as above but also added weapon type 2 to 30.
 * <prof:1|20,2|30,0|10>  // same as above but also adds 10 to ALL weapon types
 *                        // as well as the other values
 * <prof:1|0|100>         // set weapon type 1 to 0 with a max possible of 100
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 *   NOTE TAG for ENEMIES
 * ----------------------------------------------------------------------------
 *  <prof:x>     // a single value for the enemy's weapon proficiency. Enemies
 *               // can not have equips so they only use this one value.
 *               // if no tag exists, it will be 0
 * ----------------------------------------------------------------------------
 *   DAMAGE FORMULA
 * ----------------------------------------------------------------------------
 * You can use battler's currently equipped weapon proficiency in damage
 * formula. This can be done by referring to a (attacker) or b (the target)
 * and using wProf(). For example:
 * a.wProf()
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT CALL
 * ----------------------------------------------------------------------------
 *
 *   $gameActors.actor(x).gainWProfXp(amount,wTypeId);
 *
 *   // adds amount of proficiency exp to wTypeId on actor x. Leave wTypeId
 *   // blank if you want to add proficiency exp to currently equipped weapon
 *   // type the actor is using.
 *
 * ----------------------------------------------------------------------------
 *   SCRIPT for CONTROL VARIABLES
 * ----------------------------------------------------------------------------
 *
 *     Galv.WPROF.value(aId,wId);   // return an actor's weapon proficiency.
 *                                  // aId = actor id, wId = weapon type id
 *                                  // leave wId out to get currently equipped
 *                                  // weapon id.
 *                                  // use in control variables in SCRIPT
 *
 * ----------------------------------------------------------------------------
 */



//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {

Galv.WPROF.hitBonus = Number(PluginManager.parameters('Galv_WeaponProf')["Hit Bonus Per Point"]);
Galv.WPROF.critBonus = Number(PluginManager.parameters('Galv_WeaponProf')["Crit Bonus Per Point"]);
Galv.WPROF.maxProf = Number(PluginManager.parameters('Galv_WeaponProf')["Default Max Value"]);
Galv.WPROF.skillCat = PluginManager.parameters('Galv_WeaponProf')["Skill Category"];
Galv.WPROF.unarmedName = PluginManager.parameters('Galv_WeaponProf')["Unarmed Name"];

Galv.WPROF.addYanflyStatus = PluginManager.parameters('Galv_WeaponProf')["Yanfly Status Menu"].toLowerCase() === 'true' ? true : false;
Galv.WPROF.addSkillMenu = PluginManager.parameters('Galv_WeaponProf')["Default Skill Menu"].toLowerCase() === 'true' ? true : false;


Galv.WPROF.profUpAnim = Number(PluginManager.parameters('Galv_WeaponProf')["Prof Up Animation"]);


Galv.WPROF.icons = [];
var txt = PluginManager.parameters('Galv_WeaponProf')["Weapon Type Icons"];
txt = txt.split(',');
for (var i = 0; i < txt.length; i++) {
	Galv.WPROF.icons[i] = Number(txt[i]);
};

Galv.WPROF.hitXp = Number(PluginManager.parameters('Galv_WeaponProf')["XP Per Hit"]);
Galv.WPROF.missXp = Number(PluginManager.parameters('Galv_WeaponProf')["XP Per Miss"]);
Galv.WPROF.baseXp = Number(PluginManager.parameters('Galv_WeaponProf')["XP Required For Level"]);
Galv.WPROF.levelXp = Number(PluginManager.parameters('Galv_WeaponProf')["Additional XP Per Level"]);

Galv.WPROF.value = function(actorId,wTypeId) {
	var actor = $gameActors.actor(actorId);
	var wTypeId = wTypeId != undefined ? wTypeId : actor.equippedWType()
	return actor.getWProf(wTypeId);
};


//-----------------------------------------------------------------------------
//  NOTE TAGS
//-----------------------------------------------------------------------------

if (!Galv.notetagAlias) {   // Add alias only if not added by another Galv plugin
	Galv.WPROF.Scene_Boot_start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function() {	
		for (var i = 0;i < Galv.noteFunctions.length; i++) {
			Galv.noteFunctions[i]();	
		};
		Galv.WPROF.Scene_Boot_start.call(this);
	};
	Galv.notetagAlias = true;
};

Galv.WPROF.doNotes = function(obj) {
	for (var i = 1; i < obj.length; i++) {
		var note = obj[i].note.toLowerCase().match(/<prof:(.*)>/i);		
		obj[i].weaponProf = {};
		obj[i].weaponProfMax = {};
		if (note) {
			var array = note[1].split(",");		
			for (var w = 0; w < array.length; w++) {
				var a2 = array[w].split("|");
				obj[i].weaponProf[Number(a2[0])] = Number(a2[1]); // starting weapon prof.
				if (a2[2] != undefined) obj[i].weaponProfMax[Number(a2[0])] = Number(a2[2]); // max weapon prof if set.
			}
		}
	};
};

Galv.WPROF.notetags = function() {
	Galv.WPROF.doNotes($dataActors);
	Galv.WPROF.doNotes($dataClasses);
	// enemies
	var obj = $dataEnemies;
	for (var i = 1; i < obj.length; i++) {
		var note = obj[i].note.toLowerCase().match(/<prof:(.*)>/i);		
		obj[i].weaponProf = 0;
		if (note) {
			obj[i].weaponProf = Number(note[1]);
		}
	};
};

Galv.noteFunctions.push(Galv.WPROF.notetags);


//-----------------------------------------------------------------------------
//  GAME ACTOR
//-----------------------------------------------------------------------------

Galv.WPROF.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
	this._wProf = {};
	this._wProfMax = {};
	this._wProfXp = {};
	Galv.WPROF.Game_Actor_initMembers.call(this);
};

Galv.WPROF.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
	this.initWeaponProf(actorId);
	Galv.WPROF.Game_Actor_setup.call(this,actorId);
};

Game_Actor.prototype.initWeaponProf = function(actorId) {
	var wp = $dataActors[actorId].weaponProf;
	for (var w in wp) {
		this._wProf[w] = Number(wp[w]);
		if ($dataActors[actorId].weaponProfMax[w]) this._wProfMax[w] = Number($dataActors[actorId].weaponProfMax[w]);
	}
};

Game_Actor.prototype.equippedWType = function() {
	var wType = 0; // 0 is no weapon
	var weapons = this.weapons();
	for (var i = 0; i < weapons.length; i++) {
		if (weapons[i]) {
			wType = weapons[i].wtypeId;
			break;
		}
	}
	return wType;
};

Game_Actor.prototype.wProf = function() {
	return this.getWProf(this.equippedWType());
};

Game_Actor.prototype.getWProf = function(wType) {
	// return actor + class weapon proficiencies
	var classSkill = $dataClasses[this._classId].weaponProf[wType] || 0;
	var weaponSkill = this._wProf[wType] || 0;
	var maxSkill = this.getWProfMax();
	return Math.min(weaponSkill + classSkill, maxSkill);
};

Game_Actor.prototype.getWProfMax = function(wType) {
	var classMax = $dataClasses[this._classId].weaponProfMax[wType] != undefined ? $dataClasses[this._classId].weaponProfMax[wType] : -1;
	var actorMax = this._wProfMax[wType] != undefined ? this._wProfMax[wType] : -1;
	var profMax = actorMax >= 0 ? actorMax : classMax,actorMax;
	return profMax >= 0 ? profMax : Galv.WPROF.maxProf;
};

Game_Actor.prototype.gainWProfXp = function(amount,wType) {
	// get current wielded weapon type if none specified
	var wType = wType || this.equippedWType();
	this._wProf[wType] = this._wProf[wType] || 0;
	// Check WP levels
	var currentWp = this.getWProf(wType);
	var maxWp = this.getWProfMax(wType);
	if (currentWp >= maxWp) return; // At max, don't gain xp
	// Add xp
	this._wProfXp[wType] = this._wProfXp[wType] || 0;
	this._wProfXp[wType] += amount;
	// Check for level
	var xpRequired = Galv.WPROF.baseXp + (Galv.WPROF.levelXp * currentWp);
	if (this._wProfXp[wType] >= xpRequired) {
		// gain a weapon proficiency point.
		this._wProf[wType] += 1;
		// set xp for next WP level up
		this._wProfXp[wType] -= xpRequired;
		// play animation of gaining weapon proficiency
		if (SceneManager._scene.constructor.name == 'Scene_Battle') this.startAnimation(Galv.WPROF.profUpAnim, false, 0)
	}
};


//-----------------------------------------------------------------------------
//  GAME ENEMY
//-----------------------------------------------------------------------------

Game_Enemy.prototype.wProf = function() {
	return this.enemy().weaponProf;
};

Game_Enemy.prototype.getWProf = function() {
	return this.wProf();
};

//-----------------------------------------------------------------------------
//  GAME ACTION
//-----------------------------------------------------------------------------

// Hit Chance
if (Galv.WPROF.hitBonus) {
	Galv.WPROF.Game_Action_itemHit = Game_Action.prototype.itemHit;
	Game_Action.prototype.itemHit = function(target) {
		var result = Galv.WPROF.Game_Action_itemHit.call(this,target);
		if (this.isPhysical()) {
			var prof = this.subject().wProf() * (Galv.WPROF.hitBonus * 0.01);
			result += prof;
		}
		return result;
	};
}

// Critical Chance
if (Galv.WPROF.critBonus) {
	Galv.WPROF.Game_Action_itemCri = Game_Action.prototype.itemCri;
	Game_Action.prototype.itemCri = function(target) {
		var result = Galv.WPROF.Game_Action_itemCri.call(this,target);
		if (this.isPhysical() && this.item().damage.critical) {
			var prof = this.subject().wProf();
			result += prof * (Galv.WPROF.critBonus * 0.01);
		}
		return result;
	};
}

Galv.WPROF.Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
	Galv.WPROF.Game_Action_apply.call(this,target);
	if (this.isPhysical()) {
		var subject = this.subject();
		if (target.result().isHit()) {
			if (subject.isActor()) subject.gainWProfXp(Galv.WPROF.hitXp);
		} else {
			if (subject.isActor()) subject.gainWProfXp(Galv.WPROF.missXp);
		}
	}
};


//-----------------------------------------------------------------------------
//  WINDOW BASE
//-----------------------------------------------------------------------------

Window_Base.prototype.makeWeaponProfList = function(list) {
	this[list] = [];
	if (this._actor) {
		// get list of weapon types
		var types = $dataSystem.weaponTypes;
		// add unarmed
		this[list][0] = {name:Galv.WPROF.unarmedName,id:0,iconIndex:Galv.WPROF.icons[0] || 0,meta:{},note:"",description:""};
		// add rest
		for (var i = 1; i < types.length; i++) {
			var name = types[i];
			var canEquip = this._actor.isEquipWtypeOk(i);
			if (canEquip) this[list].push({name:name,id:i,iconIndex:Galv.WPROF.icons[i] || 0,meta:{},note:"",description:""});
		}
	}
};

Window_Base.prototype.drawWeaponProf = function(index,rect) {
	var skill = this._data[index];
	if (skill) {
		var costWidth = 60;
		var rect = rect || this.itemRect(index);
		rect.width -= this.textPadding();
		this.changePaintOpacity(1);
		console.log(skill);
		this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
		this.drawWeaponProfValues(skill, rect.x, rect.y, rect.width);
	}
};

Window_Base.prototype.drawWeaponProfValues = function(skill, x, y, width) {
	var wProf = Math.floor(this._actor.getWProf(skill.id));
	var wProfMax = this._actor.getWProfMax(skill.id);
	this.drawText(wProf + '/' + wProfMax, x, y, width, 'right');
};


//-----------------------------------------------------------------------------
//  ADD WEAPON PROF MENU TO SKILLS
//-----------------------------------------------------------------------------

if (Galv.WPROF.addSkillMenu) {
	// SCENE_SKILL
	Galv.WPROF.Scene_Skill_createSkillTypeWindow = Scene_Skill.prototype.createSkillTypeWindow;
	Scene_Skill.prototype.createSkillTypeWindow = function() {
		Galv.WPROF.Scene_Skill_createSkillTypeWindow.call(this);
		this._skillTypeWindow.setHandler('weaponProf',    this.commandWeaponProf.bind(this));
	};
	
	Scene_Skill.prototype.commandWeaponProf = function() {
		this._itemWindow.activate();
		this._itemWindow.selectLast();
	};
	
	// WINDOW_SKILLTYPE
	Galv.WPROF.Window_SkillType_makeCommandList = Window_SkillType.prototype.makeCommandList;
	Window_SkillType.prototype.makeCommandList = function() {
		Galv.WPROF.Window_SkillType_makeCommandList.call(this);
		this.addCommand(Galv.WPROF.skillCat, 'weaponProf', true, -1);
	};
	
	// WINDOW_SKILLLIST
	Galv.WPROF.Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
	Window_SkillList.prototype.makeItemList = function() {
		if (this._stypeId === -1) {
			this.makeWeaponProfList('_data');
		} else {
			Galv.WPROF.Window_SkillList_makeItemList.call(this);
		}
	};
	
	Galv.WPROF.Window_SkillList_drawItem = Window_SkillList.prototype.drawItem;
	Window_SkillList.prototype.drawItem = function(index) {
		if (this._stypeId === -1) {
			this.drawWeaponProf(index);
		} else {
			Galv.WPROF.Window_SkillList_drawItem.call(this,index);
		}
	};
};


//-----------------------------------------------------------------------------
//  ADD WEAPON PROF MENU TO 
//-----------------------------------------------------------------------------

if (Galv.WPROF.addYanflyStatus && Imported.YEP_StatusMenuCore) {
	
	Galv.WPROF.Window_StatusCommand_addCustomCommands = Window_StatusCommand.prototype.addCustomCommands;
	Window_StatusCommand.prototype.addCustomCommands = function(command) {
		Galv.WPROF.Window_StatusCommand_addCustomCommands.call(this,command);
		this.addCommand(Galv.WPROF.skillCat, 'weaponProf', true);
	};
	
	Galv.WPROF.Window_StatusInfo_drawInfoContents = Window_StatusInfo.prototype.drawInfoContents;
	Window_StatusInfo.prototype.drawInfoContents = function(symbol) {
		if (symbol === 'weaponProf') {
			this.drawWeaponProficiencies();
		} else {
			Galv.WPROF.Window_StatusInfo_drawInfoContents.call(this, symbol);
		}
	};
	
	Window_StatusInfo.prototype.drawWeaponProficiencies = function() {
		this.makeWeaponProfList('_data');
		this.drawWeaponProfList();
	};
	
	Window_StatusInfo.prototype.wProfRect = function(x,y,w,h) {
		var rect = new Rectangle();
		rect.x = x;
		rect.y = y;
		rect.width = w;
		return rect;
	};
	
	Window_StatusInfo.prototype.drawWeaponProfList = function() {
		this.resetFontSettings();
		var dx = this.getArrayX();
		var dy = this.getArrayY();
		var dw = this.getArrayDW(2);
		var dh = this.lineHeight();
		var pad = this.standardPadding();

		for (var i = 0; i < this._data.length; i++) {
			var even = i % 2 == 0;
			if (even) {
				// even
				var ax = dx;
			} else {
				// odd
				var ax = dx + dw + pad;
			}

			this.drawDarkRect(ax, dy, dw, dh);
			var rect = this.wProfRect(ax,dy,dw,dh);
			this.drawWeaponProf(i,rect);
			
			if (!even) dy += dh;
		}
	};
}

})();
