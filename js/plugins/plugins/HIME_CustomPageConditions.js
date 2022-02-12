/*:
-------------------------------------------------------------------------
@title Custom Page Conditions
@author Hime --> HimeWorks (http://himeworks.com)
@version 1.6
@date Aug 20, 2020
@filename HIME_CustomPageConditions.js
@url http://himeworks.com/2015/10/custom-page-conditions-mv/
-------------------------------------------------------------------------
@plugindesc v1.6 - Create your own page conditions for your events using
regular eventing!
@help 
-------------------------------------------------------------------------
== Description ==

Events are a collection of pages. Depending on which page is active,
the event will appear and behave differently. To determine which page is
active, a set of page conditions are used. If all page conditions are met,
then that page can be activated.

By default, RPG Maker provides 5 different page conditions:

- Switch is ON
- Variable is at least a certain value
- self-switch is ON
- Party has an item
- Actor is in party

But if you wanted to have a different condition, you would need to find a
way to accomplish that using only these 5 conditions. This may involve using
parallel processes to check whether conditions are met, in order to turn
on a switch or change a variable.

This plugin provides you with an easy way to define your own page
conditions without having to come up with workarounds. If you want to
check whether you have a certain weapon or armor, or whether a given
combination of actors is in the party, you can directly specify this
in your event.

By using custom page conditions, it improves productivity and makes it
easier to manage your project.

== Terms of Use ==

- Free for use in non-commercial projects with credits
- Contact me for commercial use

== Change Log ==

1.6 - Aug 20, 2020
  * support for MZ
1.5 - Apr 7, 2016
  * Fixed bug where removing conditions from troop editor caused the
    event to always run
1.4 - Feb 12, 2016
  * Fixed issue where page conditions executed before map is set up
1.3 - Dec 14, 2015
  * Fixed issue with self-switches
1.2 - Dec 5, 2015
  * Added support for custom troop page conditions
1.1 - Dec 5, 2015
  * Changed event condition processing to use an entire event list
1.0 - Oct 24, 2015
  * Initial release
 
== Usage == 

To create a custom page condition, in your event, start by creating a
comment that reads

  <page condition>
  
Then add any event commands that you would like to use as your page
condition.

In order to activate the page, you must use the plugin command

  activate_page

Finally, end your page condition with a comment.

  </page condition>

The page condition will not be executed as part of the regular event
processing.

  - Custom Troop Page Conditions --
  
You can use custom page conditions for troops as well!
The instructions are the same as for a regular event: add the start comment,
write your logic, and then add an end comment.

However, note that troop events require one of the default page conditions to
be met. If you want it to run at anytime, reserve a switch that will always
be ON and then use that as the troop page condition.
-------------------------------------------------------------------------------
@command activate_page
@desc activates the page!
-------------------------------------------------------------------------------
 */  
var TH = TH || {};
TH.CustomPageConditions = TH.CustomPageConditions || {};

function PageManager() {
  throw new Error('This is a static class');
};
  
function Game_PageInterpreter () {
  this.initialize.apply(this, arguments);
};

(function ($) {
  
  // get the last part of script URL
  var scriptName = document.currentScript.src.split("/").pop();
  var lastDot = scriptName.lastIndexOf(".")

  Game_PageInterpreter.prototype = Object.create(Game_Interpreter.prototype);
  Game_PageInterpreter.prototype.constructor = Game_PageInterpreter;

  Game_PageInterpreter.prototype.clear = function() {
    Game_Interpreter.prototype.clear.call(this);
    this._conditionsMet = false;
  };
  
  Game_PageInterpreter.prototype.execute = function() {
    while (this.isRunning()) {
      this.executeCommand();
    }
  }

  Game_PageInterpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === "activate_page") {      
      this._conditionsMet = true;
    }
  };
  
  /* For MZ. */
  if (Game_Interpreter.prototype.command357) {
    var TH_GamePageInterpreter_command357 = Game_Interpreter.prototype.command357
    Game_Interpreter.prototype.command357 = function(params) {
      if (params[1].toLowerCase() === "activate_page") {      
        this._conditionsMet = true;
      }
      return TH_GamePageInterpreter_command357.call(this, params);
    };
  }
  
  /***************************************************************************/
  
  PageManager.initialize = function() {
    this._interpreter = new Game_PageInterpreter();
  };
    
  PageManager.conditionsMet = function(list, eventId, event) {
    this._interpreter.setup(list, eventId, event);
    this._interpreter.execute();
    return this._interpreter._conditionsMet;
  };
  
  /***************************************************************************/
  
  var TH_DataManager_loadDatabase = DataManager.loadDatabase;
  DataManager.loadDatabase = function() {
    TH_DataManager_loadDatabase.call(this);
    PageManager.initialize();
  };
  
  /***************************************************************************/
  
  /*
   * Go through event commands looking for page conditions
   */
  $.loadCustomPageCondition = function(page) {
    page.customPageCondition = [];
    page.list = JsonEx.makeDeepCopy(page.list);
    var cmd, nextCmd;
    for (var i = 0, len = page.list.length; i < len; i++) {
      cmd = page.list[i];
      if (cmd.code === 108 && cmd.parameters[0].indexOf("<page condition>") > -1) {
        for (var j = i+1; j < len; j++) {
          cmd = page.list[j];          
          if (cmd.code === 108 && cmd.parameters[0].indexOf("</page condition>") > -1) {
            page.list.splice(i, j - 1);          
            return;
          }          
          page.customPageCondition.push(cmd)
        }
      }
    }
  };
  
  /***************************************************************************/
  
  var TH_GameMap_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setupEvents = function() {
    TH_GameMap_setupEvents.call(this);
    this.refresh();
  };
  
  /***************************************************************************/
  
  var TH_CustomPageConditions_Game_Event_meetsConditions = Game_Event.prototype.meetsConditions;
  Game_Event.prototype.meetsConditions = function(page) {
    var res = TH_CustomPageConditions_Game_Event_meetsConditions.call(this, page);
    if (!res) {
      return false;
    }    
    return this.meetsCustomConditions(page);
  };
  
  /*
   * Determines whether all custom page conditions have been met.
   */
  Game_Event.prototype.meetsCustomConditions = function(page) {
    if (page.customPageCondition === undefined) {
      $.loadCustomPageCondition(page);
    }
    if (page.customPageCondition.length > 0) {
      return $gameMap.event(this._eventId) && PageManager.conditionsMet(page.customPageCondition, this._eventId)
    }
    return true;
  };
  
  /***************************************************************************/
  
  var TH_GameTroop_meetsConditions = Game_Troop.prototype.meetsConditions;
  Game_Troop.prototype.meetsConditions = function(page) {
    var res = TH_GameTroop_meetsConditions.call(this, page);
    var c = page.conditions;
    // It's false, and there were valid conditions
    if (!res && (c.turnEnding || c.turnValid || c.enemyValid ||
            c.actorValid || c.switchValid)) {              
      return false;
    }
    return res && this.customPageConditionsMet(page);
  };
  
  Game_Troop.prototype.customPageConditionsMet = function(page) {
    if (page.customPageCondition === undefined) {
      $.loadCustomPageCondition(page);
    }
    if (page.customPageCondition.length > 0) {
      return PageManager.conditionsMet(page.customPageCondition, 0);
    }
    return true;    
  };
  
  /***************************************************************************/
  
  /*
   * Update methods to refresh the map
   */    
  var TH_CustomPageConditions_GameParty_gainGold = Game_Party.prototype.gainGold;
  Game_Party.prototype.gainGold = function(amount) {
    TH_CustomPageConditions_GameParty_gainGold.call(this, amount)
    $gameMap.requestRefresh();
  };
  
  var TH_CustomPageConditions_GameActor_setName = Game_Actor.prototype.setName;
  Game_Actor.prototype.setName = function(name) {  
    TH_CustomPageConditions_GameActor_setName.call(this, name)
    $gameMap.requestRefresh();
  };
  
  var TH_CustomPageConditions_GameActor_changeClass = Game_Actor.prototype.changeClass;
  Game_Actor.prototype.changeClass = function(classId, keepExp) {
    TH_CustomPageConditions_GameActor_changeClass.call(this, classId, keepExp);
    $gameMap.requestRefresh();
  };
  
  var TH_CustomPageConditions_GameActor_learnSkill = Game_Actor.prototype.learnSkill;
  Game_Actor.prototype.learnSkill = function(skillId) {
    TH_CustomPageConditions_GameActor_learnSkill.call(this, skillId);
    $gameMap.requestRefresh();
  };
  
  var TH_CustomPageConditions_GameBattler_refresh = Game_Battler.prototype.refresh;
  Game_Battler.prototype.refresh = function() {
    TH_CustomPageConditions_GameBattler_refresh.call(this);
    $gameMap.requestRefresh();
  };
})(TH.CustomPageConditions);