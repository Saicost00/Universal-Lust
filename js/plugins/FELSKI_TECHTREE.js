"use strict";
//=============================================================================
// Felskis Techtree Plugin
// FELSKI_TECHTREE.js
//=============================================================================

var Imported = Imported || {};
Imported.Felski_Techtree = true;

var Felski = Felski || {};  
Felski.Techtree = {};
Felski.Techtree.version = 1.35;

/*:
* @plugindesc v1.3.5 A techtree plugin.
* @author Felski
* @help
* This is a complex skill tree plugin for actors. The term skill tree and tech tree are both used. They refer to the same.
* Each actor can have multiple trees.
* Each node in the tree requires a specific amount of parent nodes to be 
* active in order to be unlockable. The actor learns skills on node activation.
* Additionally you can activate switches on activation.
* 
* To create a techtree you need to provide a techtrees.json file, which
* contains all techtrees. The file can be created using the treebuilder that 
* can be found in the project files.
* 
* ============================================================================
* How to install the plugin
* ============================================================================
*  - Download the demo file from https://felski.itch.io/felski-skilltree.
*  - Copy the FELSKI_TECHTREE.js into your plugin folder.
*  - Add the plugin to your game.
*  - Open the Treebuilder folder in the demo folder.
*  - Open the treebuilder.html.
*  - Use the editor to define your tree.
*  - Copy the Techtree JSON Output into a new file.
*  - Save the file as Techtrees.json into your projects data folder.
*  - Add notetags(see below) to actors or classes.
*  - Test the plugin in testplay.
*  - Enjoy!
*
* ============================================================================
* Example Techtrees.json 
* ============================================================================
* for a tree with 2 nodes:
* [
*   {
*    "uid": "HOLY",
*    "header": "Saint",
*    "tech_description": "Saint Tech Tree",
*    "icon": 70,
*    "bgimg": "Sword",
*    "nodes": [
*      {
*        "technode": {
*          "uid": "HOLY01",
*          "lane": 1,
*          "depth": 1,
*          "header": "Saint",
*          "tech_description": "Triggers the common event 5 after you close the skilltree.",
*          "bgimg": "Crystal",
*          "parents": [],
*          "neededParents": 0,
*          "visibility": {
*            "switches": []
*          },
*          "costs": {
*            "gold": 0,
*            "jp": 200,
*            "items": [],
*            "weapons": [],
*            "armors": []
*          },
*          "onActivate": {
*            "switches": [
*              {
*                "id": 5,
*                "value": true
*              }
*            ],
*            "skills": [
*              141,
*              144
*            ],
*            "commonevents": [
*              {
*                "id": 5,
*                "close": false
*              }
*            ],
*            "stats": {
*              "0": 0,
*              "1": 0,
*              "2": 0,
*              "3": 0,
*              "4": 0,
*              "5": 0,
*              "6": 0,
*              "7": 0
*            },
*            "eval": {
*              "onActivate": "",
*              "onDeactivate": ""
*            }
*          }
*        }
*      },
*      {
*        "technode": {
*          "uid": "HOLY02",
*          "lane": 1,
*          "depth": 2,
*          "header": "Holy Saint",
*          "tech_description": "Triggers the common event 6 as soon as you unlock it.",
*          "parents": [
*            {
*              "parent": "HOLY01"
*            }
*          ],
*          "neededParents": 1,
*          "visibility": {
*            "switches": []
*          },
*          "costs": {
*            "gold": 0,
*            "jp": 200,
*            "items": [],
*            "weapons": [],
*            "armors": []
*          },
*          "onActivate": {
*            "switches": [],
*            "skills": [
*              145,
*              148
*            ],
*            "commonevents": [
*              {
*                "id": 6,
*                "close": true
*              }
*            ],
*            "stats": {
*              "0": 0,
*              "1": 0,
*              "2": 0,
*              "3": 0,
*              "4": 0,
*              "5": 0,
*              "6": 0,
*              "7": 0
*            },
*            "eval": {
*              "onActivate": "",
*              "onDeactivate": ""
*            }
*          }
*        }
*      }
*    ],
*    "hideGoldCost": false,
*    "hideJPCost": false,
*    "costItems": []
*  }
* ]
* 
* ============================================================================
* Tree attributes
* ============================================================================
* - uid: unique identifier to distinguish trees. Needs to be unique.
* - header: Header line for a tree.
* - tech_description: Description text for a tree.
* - icon: icon id of the tree.
* - bgimg: name of the background image file.
* - nodes: object containing all the node data.
*  - uid: unique identifier to distinguish nodes. Needs to be unique.
*  - lane: row in the skill tree. Row 2 would appear below row 1. It
*  - defines on which line in the skilltree a node appears.
*  - depth: column in the skill tree. It defines how far into the tree a
*           node should appear. 
*  - header: Header line for a node.
*  - tech_description: Description text for a node.
*  - bgimg: name of the background image file.
*  - parents: Unique ids of the parent nodes. Used to draw arrows between
*             the nodes.
*  - neededParents: Amount of active parents needed for the node to be 
*                   unlockable.
*  - visibility: required switches for the node to be fully visible
*    - switches:
*      - id: id of the switch
*    - costs: multiple cost options like: gold, yanflys jobpoints, items,
*             weapons and armors
*  - onActivate: what should happen when the player activates this node
*    - switches: switches can be turned on and off
*      - id: id of the switch
*      - value: should the switch be set to true or false (on or off)
*    - skills: id of the skills that will be learnt on activate
*    - animation: id of the animation played when node is activated
*    - stats: adjustment to common character stats
*    - eval: run custom JS code
*    - commonevents: common events that will be triggered on activate
*      - id: id of the common event
*      - close: return to map on activate
*  - animation: id of the animation played when a node is activated
*  - hideGoldCost: should gold be hidden in the techtree menu
*  - hideJPCost: should jp be hidden in the techtree menu
*  - costItems: ids of items that are shown in the cost window
* 
* ============================================================================
* Notetags
* ============================================================================
* You can add a tree to an actor by adding the uids of the trees via notetags:
*     <techtree>
*     HOLY
*     HEALER
*     </techtree>
* 
* ============================================================================
* Controls
* ============================================================================
* Mouse:
*  - Nodes are clickable with the mouse to select them.
*  - Clicking again opens the node.
* Scrolling:
*  - Scrolling down or up is like press right or left.
* Arrowkeys:
*  - When pressing an arrow key, the cursor attempts to find a node in that
*    direction, until he hits an edge (first lane, first depth, max lane,
*    max depth). Then the cursor will turn counter clockwise and continue in
*    that new direction. The cursor will stop at the first node he finds.
* 
* ============================================================================
* Plugin Commands
* ============================================================================
* You can directly open the skill tree scene.
*  - TECHTREE [actorId]
* You can prepare the scene using the following commands:
*  - TECHTREE DISPLAYONLY
*      opens the tree in display only mode, similar to the new plugin parameter
*  - TECHTREE PRESELECT [tree uid]
*      preselects a specific tree for the actor. If the tree isnt found, the default selection is used.
*  - TECHTREE SINGLE
*      prevents the user from changing trees
*
* You can reset all techtrees for an actor. 
*  - RESETTECHTREES [actorId] [refund]
* You can reset a specific techtree for an actor by uid. Put in true or false for [refund].
*  - RESETTECHTREE [actorId] [tree uid] [refund]
* You can save the amount of active nodes in a tree by uid in a variable. Put in true or false for [refund].
*  - ACTIVENODES [actorId] [tree uid] [variable Id]
* You can add a techtree during the game:
*  - ADDTECHTREE [actorId] [tree uid]
* You can activate a specific node during the game for an actor using:
*  - ACTIVATENODE [actorId] [tree uid] [node uid]
* You can deactivate a specific node during the game for an actor using (the usually unlearn settings will be applied):
*  - DEACTIVATENODE [actorId] [tree uid] [node uid]
*
* ============================================================================
* Additional Infos
* ============================================================================
* Advices:
*  - The plugin works best with hierarchic trees.
*  - It is also adviced to keep parents and children close together.
*  - Keep the trees simple.
*  - You can add multiple trees to one actor.
* 
* First selected node:
*  - The first selected node in a tree is always the first defined node. So if
*    you define a node at 2,2 and then another at 1,1 the node at 2,2 will be
*    selected when the tree is opened.
*
* Limitations:
*  - Only left to right skilltrees can be created.
*
* Changing the system:
*  - You can alter the system look by changing the files in /img/system/techtree.
* 
* Requirements:
*  - This plugin is developed and tested in RPG Maker v1.6.1.
*  - It might work with older version, but you have to test this by yourself.
*
* Compatiblity:
*  - Yanfly's Class Change Core - http://yanfly.moe/2015/11/27/yep-32-class-change-core/ 
*  - Yanfly's Jobpoints - http://yanfly.moe/2015/11/13/yep-27-job-points/
*  - Yanfly's Load Custom Font - http://yanfly.moe/2016/07/23/yep-112-load-custom-font-rpg-maker-mv/
*
* Tested Incompatiblity:
*  - Yanfly's Subclass - http://yanfly.moe/2015/11/29/yep-34-subclass/
* There might be more incompatible plugins. You need to test this yourself.
* But anything that will changes the way characters learn skills or change classes could be incompatible.
* 
* ============================================================================
* Terms of Use
* ============================================================================
* Copyright (C) 2018 Felski
*
* These plugins may be used in free or commercial games.
* 'Felski' must be given credit in your games.
* You are allowed to edit the code.
* Do NOT claim the plugins as your own.
* Do NOT change the filename, parameters, and information of the plugin.
* You are NOT allowed to redistribute these plugins.
* You may NOT take code for your own released plugins without credit.
*
* ============================================================================
* Changelog
* ============================================================================
* V1.0.1
* - added a parameter to change the visibility of the skill tree menu in the main menu.
* - added a plugin command to reset all skill trees for an actor.
* - added a plugin command to reset a specific skill tree for an actor.
* - fixed a bug where two actors having the same tech tree would unlock the node in both trees.
* - added a javascript function to get the amount of active nodes for a skill tree.
*
* V1.0.2
* - fixed an error that the plugin wouldn't work, when a not existing tech tree was referenced in notetags.
* - added a warning when a tree is referenced in the notetags that isn't in the Techtree.json.
* - added the ability to set custom background for trees and single nodes. This is done via the Techtree.json.
* - added a folder for techtree backgrounds at ../img/system/techtree/bgimg/. All background images need to go there.
* - updated the json schema for the techtree editor for custom backgrounds.
* - added a plugin command to add a techtree to an actor.
*
* v1.1.0
* Bugfixes:
* - increased performance for the techtree windows.
* - changed how images are loaded, so they should load more consitently and without errors.
*
* Minor Changes:
* - split up the tree window into 3 windows. An info window, a header window and a window for the tree itself.
* - you can now select another tree using the header window.
* - added a parameter to toggle preloading of the tree when selecting it in the header window.
* - added font and other parameters for the header window.
* - added a parameter to change the message that is shown when an actor has no trees available.
* - added a step by step guide to the help.
*
* Major Changes:
* - you can now bind skilltrees to classes.
* - an actor can have skilltrees from himself and from his class.
* - skilltrees bound to the actor will always be available.
* - skilltrees bound to the class will only be available when the actor has the class.
* - on class change, the actor will forget all skills he learnt from the old skill tree(s). This can be changed with a plugin parameter.
* - on class change, the actor will relearn all skills from the new skill tree(s), if there are already active nodes in the tree. So switching back to a class will relearn the skills.
* - on class change, all switches that have been set on or off will be set off or on. This happend for the old and the new skill tree(s).
* - activated nodes in a skill tree will remain on class change. So when the player changes back, the nodes are still active. This can be changed with a plugin parameter.
* - on class change, the common events will not be triggered again.
* - added the above mentioned plugin parameters.
*
* v1.1.1
* Bugfixes:
* - fixed an issue with the automatic autowrap in the node confirm window.
* Changes:
* - added a parameter to change the text of a hidden node.
* - added a parameter to show/hide skill names in the node activation window.
* - added a parameter to show/hide skill descriptions in the node activation window.
* - added a parameter to show/hide skill icons in the node activation window.
*
* - added the option to play an animation when activating a node.
* - added a parameter to set a default animation when activating any node.
* - added a field in the techtree editor to set a default animation when activating any node in a specific tree.
* - added a field in the techtree editor to set a animation when activating a specific node.
* - added to offset parameters for the postion of animations.
* - this allows you to play animation effects, screen flashes and sound effect on node activation.
*
* v1.2.0
* Bugfixes:
* - fixed an autowrap bug in the tree description in the tree selecting window.
* - fixed a bug with autowrap. Autowrap now uses the fontsize for the lineheight so it properly scales different fontsizes.
* - fixed a bug where the plugin would break when a not existing parent node was referenced. A console warning is shown now instead.
*
* Major Changes:
* - added the feature to increase/decrease stats (max HP, max MP, Attack, Defense, Magic Attack, Magic Defense, Agility and Luck) on node activation.
*   - added plugin parameters for stat changes handling for class changes.
*   - added corresponding options to the techtree builder app.
*
* - added the feature to run custom javascript code on node activation and deactivation.
*   - added plugin parameters for custom javascript code handling for class changes.
*   - added corresponding options to the techtree builder app.
*
* - added a header window that shows the current amount of currency (like gold or JP).
*   - you can define up to 5 currencys that are shown here per tree.
*   - added the corresponding option to the techtree builder app for gold, jp and specific items.
*   - added a font plugin parameters for the currency window. See Header Settings. 
* 
* Minor Changes:
* - added a new parameter "Node Border Width" in the Node Visual Settings.
*   - this parameter is used for the graphical border of a node. That way overlapping text can be prevented.
*
* - added the feature to use icons in all descriptions of the plugin. This feature also works for skill descriptions.
*   - to add icons to the skill tree descriptions you need to use \\i[iconIndex] within the description.
*   - to add icons to the skill description use \i[iconIndex] within the description of the skill in the RPG Maker MV database. This only affects the skill tree windows.
*
* - added the option to show an icon for learned nodes instead of the costs.
*   - you can activate this by setting the "Node Show Learned Icon" plugin parameter to true.
*   - you can change the icon shown by changing the "Node Show Learned Icon ID" plugin parameter.
*
* - added a new parameter "Hide Node Cost" in the Node Options.
*   - with this parameter you can hide the costs in the tree overview for all nodes.
*   - the costs still appear in the confirmation window.
*
* - added the plugin command ACTIVATENODE [actorId] [tree uid] [node uid].
*   - it can be used to unlock a specific node in a tree for an actor.
*
* - added the plugin command DEACTIVATENODE [actorId] [tree uid] [node uid].
*   - it can be used to reset a specific node in a tree for an actor.
*   - all skill will be forgotton
*   - all stats removed
*   - all switches toggled
*   - onDeactivate evals will be run
*   - common events will not run again
*   - this affects deactivating nodes using plugin commands
*
* - changed the plugin command RESETTECHTREES [actorId] [refund].
*   - it now has the option to refund the costs for the actor. 
*   - you cannot use this plugin command together with class changes.
*
* - changed the plugin command RESETTECHTREE [actorId] [tree uid] [refund].
*   - it now has the option to refund the costs for the actor. 
*
* Tree Builder App Changes:
* - added Main Cost Items to the techtree builder.
*   - you can define item ids here that will be shown as currency for the tree. This is a visual thing only and doesn't affect any mechanics.
* - added "Don't show gold currency for this tree?" option to the techtree builder.
*   - you can decide wheter you want to show gold for this tree or not.
* - added "Don't show Jobpoints (JP) currency for this tree?" option to the techtree builder.
*   - you can decide wheter you want to show gold for this tree or not.
* - added "Stat Changes" to the On Activate part of a node in the techtree builder.
* 	- you can define stat increases for a node here.
* - removed some cluttering options from the tree editor. To reactivate them see options.
*
* v1.2.1
* Bugfixes:
* - fixed a bug that would prevent the plugin from working when classes have not existing trees assigned. A warning is shown instead.
*
* v1.2.2
* Bugfixes:
* - fixed a bug with nodes that use more than one of a item/weapon/armor to unlock. These nodes can now be unlocked properly.
* - fixed an error with cost info window that happend when an actor didn't have a tree assigned. This now works properly.
*
* v1.3.0
* Minor Changes:
* - added a new plugin parameter to make the skill tree scene in the menu display only.
* - added plugins commands to prepare the TECHTREE command.
*   TECHTREE DISPLAYONLY
*      opens the tree in display only mode, similar to the new plugin parameter
*   TECHTREE PRESELECT [tree uid]
*      preselects a specific tree for the actor. If the tree isnt found, the default selection is used.
*   TECHTREE SINGLE
*      prevents the user from changing trees
* 
* - these two changes can be used to make the plugin work with skill trainers.
*   Example: 
*      Enable the plugin parameter so the skill tree is only for display in the
*      menu and then add skill trainers all over the world (use the plugin command
*      TECHTREE to open the trees in change mode).
*
* - added a new plugin parameter "Update Skill Trees". With this enabled, the skill trees of saved games will update when you change the Techtrees.json file.
*   - actors will properly unlearn skills that you have removed and learn skills you've added. Stat changes will also apply properly. Switches will change accordingly and Evals will run again.
*   - Common Events will NOT run again. 
*   - this feature is experimental. Any feedback is much appreciated!
*
* - added level requirements to the skill trees. Added the corresponding field to the Tree Builder App. Actors can only unlock the node when they reached the required level.
* 
* - added a new plugin parameter "Active Nodes Are Always Visible". With this enabled, nodes that are active are visible, even when the visibility requirements are not met.
*
* v1.3.1
* - fixed the RESETTECHTREE and RESETTECHTREES refund bug. It should refund or not refund accordingly.
*
* v1.3.2
* - added support for SumRndmDde's SwipeInput Plugin. This was only tested on Windows, but should work on mobile, too. See http://sumrndm.site/swipe-input/
* - added message replace features for descriptions: \V[x] \N[x] \P[x] \G \C[x] \I[x]. They should behave similar to the RPG Maker standard feature.
*
* v1.3.3
* - added the plugin command ACTIVENODESGOLDCOST [actorId] [tree uid] [variable id].
*   - it saves the gold cost of all active nodes for an actor and a specific tree.
* - added the plugin command ACTIVENODESJPCOST [actorId] [tree uid] [variable id].
*   - it saves the JP cost of all active nodes for an actor and a specific tree.
* - added the plugin command ACTIVENODESITEMCOST [actorId] [tree uid] [item id] [variable id].
*   - it saves the item cost of a specific item of all active nodes for an actor and a specific tree.
* - added the plugin command ACTIVENODESWEAPONCOST [actorId] [tree uid] [weapon id] [variable id].
*   - it saves the weapon cost of a specific item  of all active nodes for an actor and a specific tree.
* - added the plugin command ACTIVENODESARMORCOST [actorId] [tree uid] [armor id] [variable id].
*   - it saves the armor cost of a specific item  of all active nodes for an actor and a specific tree.
*
* v1.3.4
* - fixed a bug that made the tree look wierd in certain cases.
*
* v1.3.5
* - added a plugin parameter Compact Texts which fixes makes texts use line heights based on their fontsize. This makes texts look more compact and actually adds a use to different font sizes. It is enabled by default.
* - changed the node confirmation window to properly draw all content. Be warned. Many content will still break the window.
* - fixed a bug that would cut of skill descriptions on word wrap.
* - added an option to draw a bigger window for a node. Added an option for this in the Tree Builder App. You can find it in each node.
* - fixed a bug regarding the background image in the node confirmation window. It should now display directly.
* - added the plugin command HASACTORNODEACTIVE [actorId] [tree uid] [node uid] [switch id].
*   - it checks if and actor has a specific node in a tree active or not.
* - added a warning popup on start when you have a faulty node. Currently this only alerts you of skills that dont exists.
* - you can now open trees of actors that are not in the party using the TECHTREE [actorId] plugin command
*
* ============================================================================
* END OF HELP
* ============================================================================
*
* @param General Settings
*
* @param onMap
* @parent General Settings
* @desc NOT IMPLEMENTED: Should the techtree be available on the map
* @type Boolean
* @default false
*
* @param Menu Text
* @parent General Settings
* @desc Text shown in the menu for the tech tree command
* @type String
* @default Skilltree
*
* @param Menu Visible
* @parent General Settings
* @desc Visibility of the skill tree in the main menu
* @type Boolean
* @default true
*
* @param Menu Background
* @parent General Settings
* @desc Is the custom background image visible?
* @type Boolean
* @default true
*
* @param Menu Only Display
* @parent General Settings
* @desc Skill tree in the menu is only for display. You cannot unlock nodes there.
* @type Boolean
* @default false
*
* @param Update On Header Change
* @parent Header Settings
* @desc Instant update the techtree when selecting another tree in the header window. (This might decrease performance.)
* @type Boolean
* @default false
*
* @param Menu Background Opacity
* @parent General Settings
* @desc Default opacity for menu background image
* @type Integer
* @default 192
*
* @param Confirm Background Opacity
* @parent General Settings
* @desc Default opacity for the confirm window background image
* @type Integer
* @default 192
*
* @param No Skilltree Message Format
* @parent General Settings
* @desc Format of the message, when no skilltree is found for the actor.
* %1 - Actor Name
* @type String
* @default There is no techtree maintained for %1.
*
* @param Update Skill Trees
* @parent General Settings
* @desc [EXPERIMENTAL] Update the existing skill trees when the Techtrees.json changes.
* @type Boolean
* @default false
*
*
* @param Class Change Settings
*
* @param Class Change Unlearn Skills
* @parent Class Change Settings
* @desc Will the actor forget the skills he learned from a class skilltree on class change?
* @type Boolean
* @default true
*
* @param Class Change Relearn Skills
* @parent Class Change Settings
* @desc Will the actor forget the skills he learned from a class skilltree on class change?
* @type Boolean
* @default true
*
* @param Class Change Remove Stats
* @parent Class Change Settings
* @desc Will the actor get the stats removed he gained through nodes on class change?
* @type Boolean
* @default true
*
* @param Class Change Readd Stats
* @parent Class Change Settings
* @desc Will the actor get the stats readded he gained through nodes on class change?
* @type Boolean
* @default true
*
* @param Class Change Run Deactivate Eval
* @parent Class Change Settings
* @desc Should the onDeactivate Eval be ran on class change?
* @type Boolean
* @default true
*
* @param Class Change Run Activate Eval
* @parent Class Change Settings
* @desc Should the onActivate Eval be ran on class change
* @type Boolean
* @default true
*
* @param Class Change Deactivate Nodes
* @parent Class Change Settings
* @desc Will all nodes of the skilltree be set to unactive on class change?
* @type Boolean
* @default false
*
* @param Add Skilltree Command to Change Class
* @parent Class Change Settings
* @desc Should the skilltree command be added to the change class scene
* (Requires Yanfly's Class Change Core)
* @type Boolean
* @default false
*
*
* @param Header Settings
*
* @param Header Columns
* @parent Header Settings
* @desc Instant update the techtree when selecting another tree in the header window. (This might decrease performance.)
* @type Integer
* @default 4
*
* @param Header Draw Leading Icons
* @parent Header Settings
* @desc Should there be a icon infront of the header text?
* @type Boolean
* @default true
*
* @param Header Draw Trailing Icons
* @parent Header Settings
* @desc Should there be a icon behind of the header text?
* @type Boolean
* @default true
*
* @param Currency Font
* @parent Header Settings
* @desc Name of the font used for the currency in currency window.
* @type string
* @default GameFont
*
* @param Currency Font Size
* @parent Header Settings
* @desc Size of the font used for the currency in currency window.
* @type number
* @min 1
* Default: 18
* @default 18
*
* @param Currency Font Color
* @parent Header Settings
* @desc Color of the font used for the currency in currency window.
* @type number
* @min 0
* @max 31
* @default 0
*
*
* @param Lanes Settings
*
* @param Lanes
* @parent Lanes Settings
* @desc Amount of lanes(rows) in a techtree.
* @type Integer
* @default 3
*
* @param Horizontal Lanes
* @parent Lanes Settings
* @desc (NOT IMPLEMENTED): Are the lanes(rows) show horizontally?
* @type Boolean
* @on lanes are horizonal
* @off lanes are vertical
* @default true
*
*
* @param Node Visual Settings
* @desc Settings for the nodes in the tree overview.
*
* @param Node Height
* @parent Node Visual Settings
* @desc Height of a node in the techtree.
* @type Integer
* @default 200
*
* @param Node Width
* @parent Node Visual Settings
* @desc Width of a node in the techtree. Node Width + Node Gap should be a fraction of your (Screen Width - Nodes Left Margin)
* @type Integer
* @default 300
*
* @param Node Border Width
* @parent Node Visual Settings
* @desc Width of the graphical border of a node in the tech tree. Used to prevent text overlapping.
* @type Integer
* @default 0
*
* @param Node Gap
* @parent Node Visual Settings
* @desc Gap in pixels between each node. Should be atleast 60.
* @type Integer
* @default 60
*
* @param Node Opacity
* @parent Node Visual Settings
* @desc Opacity of a node.
* @type Integer
* @min 0
* @max 255
* @default 160
*
* @param Node Cursor Size Offset
* @parent Node Visual Settings
* @desc Cursor size offset in pixel.
* @type Integer
* @default 0
*
* @param Nodes Left Margin
* @parent Node Visual Settings
* @desc Margin between first node and left window border.
* @type Integer
* @default 20
*
* @param Nodes Top Margin
* @parent Node Visual Settings
* @desc Margin between first node and header part of the techtree.
* @type Integer
* @default 20
*
*
* @param Node Options
* @desc Settings for the nodes in the tree overview.
*
* @param Hidden Icon
* @parent Node Options
* @desc Icon index of a hidden node
* @type Integer
* @default 93
*
* @param Hidden Text
* @parent Node Options
* @desc Text shown for a hidde node
* @type String
* @default This skill is hidden. You will reveal it somehow...
*
* @param Active Nodes Are Always Visible
* @parent Node Options
* @desc Any active node is always visible, even when the visiblity requirements are not met.
* @type Boolean
* @on Always visible
* @off Only when requirements are met 
* @default false
*
* @param Node Show Learned Icon
* @parent Node Options
* @desc Display an icon instead of nothing once the node is learned.
* @type Boolean
* @on Learned icon is shown
* @off Learned icon is hidden
* @default true
*
* @param Node Show Learned Icon ID
* @parent Node Options
* @desc ID of the icon shown for learned nodes.
* @type Number
* @min 1
* @default 90
*
* @param Hide Node Cost
* @parent Node Options
* @desc Hide the costs of a node in the tree overview. They are still shown in the confirmation window.
* @type Boolean
* @on Costs are hidden
* @off Costs are shown
* @default true
*
*
* @param Node Activation Settings
*
* @param Standard Animation ID
* @parent Node Activation Settings
* @desc ID of the edefault animation that is played when activating a node. Can be overwritten via the Techtrees.json for specific nodes. Set it to 0 to play no animation.
* @type Integer
* @default 15
*
* @param Animation X Offset
* @parent Node Activation Settings
* @desc X Offset for the animation position that is played when activating a node. (can be negative)
* @type Integer
* @default 20
*
* @param Animation Y Offset
* @parent Node Activation Settings
* @desc Y Offset for the animation position that is played when activating a node. (can be negative)
* @type Integer
* @default 20
*
* @param Suppress Default Unlock Sound
* @parent Node Activation Settings
* @desc Should the unlock sound in the node confirm window be suppress. (Good when you want to play your own sounds.)
* @type Boolean
* @on suppress unlock sound
* @off not suppress unlock sound
* @default false
*
*
* @param Node Text Settings
* @desc Settings confirmation window shown once you clicked on a node.
*
* @param Node Action Unlock
* @parent Node Text Settings
* @desc Text for the unlock node command
* @type String
* @default Unlock
*
* @param Node Action Cancel
* @parent Node Text Settings
* @desc Text for the cancel node command
* @type String
* @default Cancel
*
* @param Node Action Already Unlocked
* @parent Node Text Settings
* @desc Text for the already unlocked node command
* @type String
* @default Already Unlocked
*
* @param Node Action Close
* @parent Node Text Settings
* @desc Text for the close node command
* @type String
* @default Close
*
* @param Node Show Tech Description
* @parent Node Text Settings
* @desc Should the tech description in the node confirm window (the one from the techtree.js) be visible
* @type Boolean
* @on Tech description is shown
* @off Tech description is hidden
* @default true
*
* @param Node Show Skill Name
* @parent Node Text Settings
* @desc Should the skill name in the node confirm window be visible
* @type Boolean
* @on Skill name is shown
* @off Skill name is hidden
* @default true
*
* @param Node Show Skill Description
* @parent Node Text Settings
* @desc Should the skill description in the node confirm window be visible
* @type Boolean
* @on Skill description is shown
* @off Skill description is hidden
* @default true
*
* @param Node Show Skill Icon
* @parent Node Text Settings
* @desc Should the skill icon in the node confirm window be visible
* @type Boolean
* @on Skill icon is shown
* @off Skill icon is hidden
* @default true
*
*
* @param Font Settings
*
* @param Font
* @parent Font Settings
* @desc Name of the font used in the techtree.
* @type string
* @default GameFont
*
* @param Font Size
* @parent Font Settings
* @desc Size of the font used in the techtree.
* @type number
* @min 1
* Default: 28
* @default 28
*
* @param Font Color
* @parent Font Settings
* @desc Color of the font used in the techtree.
* @type number
* @min 0
* @max 31
* @default 0
*
* @param Header Font
* @parent Font Settings
* @desc Name of the font used for the header window in the techtree.
* @type string
* @default GameFont
*
* @param Header Font Size
* @parent Font Settings
* @desc Size of the font used for the header window in the techtree.
* @type number
* @min 1
* Default: 28
* @default 28
*
* @param Header Font Color
* @parent Font Settings
* @desc Color of the font used for the header window in the techtree.
* @type number
* @min 0
* @max 31
* @default 0
*
* @param Header Description Font
* @parent Font Settings
* @desc Name of the font used for the description in the header window in the techtree.
* @type string
* @default GameFont
*
* @param Header Description Font Size
* @parent Font Settings
* @desc Size of the font used for the description in the header window in the techtree.
* @type number
* @min 1
* Default: 28
* @default 28
*
* @param Header Description Font Color
* @parent Font Settings
* @desc Color of the font used for the description in the header window in the techtree.
* @type number
* @min 0
* @max 31
* @default 0
*
*
* @param Node Header Font
* @parent Font Settings
* @desc Name of the font used for the header text of nodes in the techtree.
* @type string
* @default GameFont
*
* @param Node Header Font Size
* @parent Font Settings
* @desc Size of the font used for the header text of nodes in the techtree.
* @type number
* @min 1
* Default: 28
* @default 28
*
* @param Node Header Font Color
* @parent Font Settings
* @desc Color of the font used for the header text of nodes in the techtree.
* @type number
* @min 0
* @max 31
* @default 0
*
* @param Node Header Font Color Greyed Out
* @parent Font Settings
* @desc Color of the font used for the out greyed header text of nodes in the techtree.
* @type number
* @min 0
* @max 31
* @default 8
*
* @param Node Level Requirement Font
* @parent Font Settings
* @desc Name of the font used for the level requirement of nodes in the techtree.
* @type string
* @default GameFont
*
* @param Node Level Requirement Font Size
* @parent Font Settings
* @desc Size of the font used for the level requirement of nodes in the techtree.
* @type number
* @min 1
* Default: 28
* @default 28
*
* @param Node Level Requirement Font Color
* @parent Font Settings
* @desc Color of the font used for the level requirement of nodes in the techtree.
* @type number
* @min 0
* @max 31
* @default 8
*
*
* @param Node Text Font
* @parent Font Settings
* @desc Name of the font used for the text of nodes in the techtree.
* @type string
* @default GameFont
*
* @param Node Text Font Size
* @parent Font Settings
* @desc Size of the font used for the text of nodes in the techtree.
* @type number
* @min 1
* Default: 28
* @default 28
*
* @param Node Text Font Color
* @parent Font Settings
* @desc Color of the font used for the text of nodes in the techtree.
* @type number
* @min 0
* @max 31
* @default 0
*
* @param Node Text Font Color Greyed Out
* @parent Font Settings
* @desc Color of the font used for the out greyed text of nodes in the techtree.
* @type number
* @min 0
* @max 31
* @default 8
*   
*
* @param Node Cost Font
* @parent Font Settings
* @desc Name of the font used for the cost of nodes in the techtree.
* @type string
* @default GameFont
*
* @param Node Cost Font Size
* @parent Font Settings
* @desc Size of the font used for the cost of nodes in the techtree.
* @type number
* @min 1
* Default: 28
* @default 28
*
* @param Node Cost Font Color
* @parent Font Settings
* @desc Color of the font used for the cost of nodes in the techtree.
* @type number
* @min 0
* @max 31
* @default 0
*
* @param Node Cost Font Color Greyed Out
* @parent Font Settings
* @desc Color of the font used for the cost of nodes in the techtree.
* @type number
* @min 0
* @max 31
* @default 8
*
* @param Compact Texts
* @parent General Settings
* @desc Should all texts be more compact.
* @type boolean
* @default true
*
*
*/

var $dataTechtrees = null;
DataManager._databaseFiles.push({name: '$dataTechtrees', src: 'Techtrees.json'});

var parameters = PluginManager.parameters('FELSKI_TECHTREE');

// General Settings
Felski.Techtree.onMap = false;
Felski.Techtree.horizontal = String(parameters['Horizontal Lanes'] || 'true');
Felski.Techtree.horizontal = eval(Felski.Techtree.horizontal);
Felski.Techtree.horizontal = true;
Felski.Techtree.Lanes = Number(parameters['Lanes'] || 3);
Felski.Techtree.NoTreeText = String(parameters['No Skilltree Message Format']);
Felski.Techtree.compact = String(parameters['Compact Texts'] || 'true');
Felski.Techtree.compact = eval(Felski.Techtree.compact);
//Felski.Techtree.onMap = eval(parameters['onMap'] || false);
//Felski.Techtree.horizontal = eval(parameters['Horizontal Lanes'] || true);
Felski.Techtree.menuOnlyDisplay = String(parameters['Menu Only Display'] || 'false');
Felski.Techtree.menuOnlyDisplay = eval(Felski.Techtree.menuOnlyDisplay);
Felski.Techtree.menuOnlyDisplayBuffer = false;
Felski.Techtree.preselectedTree = null;
Felski.Techtree.singleTreeView = false;
Felski.Techtree.updateTechtrees = String(parameters["Update Skill Trees"] || 'false');
Felski.Techtree.updateTechtrees = eval(Felski.Techtree.updateTechtrees);

// Class Settings
Felski.Techtree.CCUnlearn = String(parameters['Class Change Unlearn Skills'] || 'true');
Felski.Techtree.CCUnlearn = eval(Felski.Techtree.CCUnlearn);
Felski.Techtree.CCRelearn = String(parameters['Class Change Relearn Skills'] || 'true');
Felski.Techtree.CCRelearn = eval(Felski.Techtree.CCRelearn);
Felski.Techtree.CCRemoveStats = String(parameters['Class Change Remove Stats'] || 'true');
Felski.Techtree.CCRemoveStats = eval(Felski.Techtree.CCRemoveStats);
Felski.Techtree.CCReaddStats = String(parameters['Class Change Readd Stats'] || 'true');
Felski.Techtree.CCReaddStats = eval(Felski.Techtree.CCReaddStats);
Felski.Techtree.CCRunDeEval = String(parameters['Class Change Run Deactivate Eval'] || 'true');
Felski.Techtree.CCRunDeEval = eval(Felski.Techtree.CCRunDeEval);
Felski.Techtree.CCRunAcEval = String(parameters['Class Change Run Activate Eval'] || 'true');
Felski.Techtree.CCRunAcEval = eval(Felski.Techtree.CCRunAcEval);
Felski.Techtree.CCDeactive = String(parameters['Class Change Deactivate Nodes'] || 'false');
Felski.Techtree.CCDeactive = eval(Felski.Techtree.CCDeactive);
Felski.Techtree.CCCommand = String(parameters['Add Skilltree Command to Change Class'] || 'false');
Felski.Techtree.CCCommand = eval(Felski.Techtree.CCCommand);

// Main Menu Settings
Felski.Techtree.TTMenuText = String(parameters['Menu Text'] || 'Skilltree');
Felski.Techtree.TTMenuVisible = String(parameters['Menu Visible'] || 'true');
Felski.Techtree.TTMenuVisible = eval(Felski.Techtree.TTMenuVisible);

// Header Settings
Felski.Techtree.TTHeaderUpdate = String(parameters['Update On Header Change'] || 'false');
Felski.Techtree.TTHeaderUpdate = eval(Felski.Techtree.TTHeaderUpdate);
Felski.Techtree.TTHeaderCols = Number(parameters['Header Columns'] || 4);
Felski.Techtree.TTHeaderLIcons = String(parameters['Header Draw Leading Icons'] || 'true');
Felski.Techtree.TTHeaderLIcons = eval(Felski.Techtree.TTHeaderLIcons);
Felski.Techtree.TTHeaderTIcons = String(parameters['Header Draw Trailing Icons'] || 'true');
Felski.Techtree.TTHeaderTIcons = eval(Felski.Techtree.TTHeaderTIcons);
// Currency Font
Felski.Techtree.TTHeaderCurFont = String(parameters['Currency Font'] || 'GameFont');
Felski.Techtree.TTHeaderCurFontColor = Number(parameters['Currency Font Color'] || 0);
Felski.Techtree.TTHeaderCurFontSize = Number(parameters['Currency Font Size'] || 18);


// Backgrounds
Felski.Techtree.TTMenuBackground = String(parameters['Menu Background'] || 'false');
Felski.Techtree.TTMenuBackground = eval(Felski.Techtree.TTMenuBackground);
Felski.Techtree.TTMenuBackgroundOpacity = Number(parameters['Menu Background Opacity'] || 192);
Felski.Techtree.TTMenuConfirmBackgroundOpacity = Number(parameters['Confirm Background Opacity'] || 192);

// Node Settings
Felski.Techtree.HiddenIcon = Number(parameters['Hidden Icon'] || 93);
Felski.Techtree.HiddenText = String(parameters['Hidden Text'] || "This skill is hidden. You will reveal it somehow...");
Felski.Techtree.NodeHeight = Number(parameters['Node Height'] || 200);
Felski.Techtree.NodeWidth = Number(parameters['Node Width'] || 300);
Felski.Techtree.NodeBorderWidth = Number(parameters['Node Border Width'] || 0);
Felski.Techtree.NodeGap = Number(parameters['Node Gap'] || 60);
Felski.Techtree.NodeOpacity = Number(parameters['Node Opacity'] || 160);
Felski.Techtree.NodeCursorSize = Number(parameters['Node Cursor Size Offset'] || 0);
Felski.Techtree.NodesLeftMargin = Number(parameters['Nodes Left Margin'] || 20);
Felski.Techtree.NodesTopMargin = Number(parameters['Nodes Top Margin'] || 20);
Felski.Techtree.NodesLearnedIconShown = String(parameters['Node Show Learned Icon'] || 'false');
Felski.Techtree.NodesLearnedIconShown = eval(Felski.Techtree.NodesLearnedIconShown);
Felski.Techtree.NodesLearnedIconID = Number(parameters['Node Show Learned Icon ID'] || 90);
Felski.Techtree.NodesCostHidden = String(parameters['Hide Node Cost'] || 'false');
Felski.Techtree.NodesCostHidden = eval(Felski.Techtree.NodesCostHidden);
Felski.Techtree.NodesActiveVisible = String(parameters['Active Nodes Are Always Visible'] || 'false');
Felski.Techtree.NodesActiveVisible = eval(Felski.Techtree.NodesActiveVisible);

// Animation Settings
Felski.Techtree.NodeAnimDefaultID = Number(parameters['Standard Animation ID'] || 15);
Felski.Techtree.NodeAnimXOffset = Number(parameters['Animation X Offset'] || 0);
Felski.Techtree.NodeAnimYOffset = Number(parameters['Animation Y Offset'] || 0);

// Sound Settings
Felski.Techtree.suppressConfirmSound = String(parameters['Suppress Default Unlock Sound'] || 'false');
Felski.Techtree.suppressConfirmSound = eval(Felski.Techtree.suppressConfirmSound);
Felski.Techtree.NodeSoundName = String(parameters['Default Sound Name']);
Felski.Techtree.NodeSoundVolume = Number(parameters['Default Sound Volume'] || 100);
Felski.Techtree.NodeSoundPitch = Number(parameters['Default Sound Pitch'] || 100);
Felski.Techtree.NodeSoundPan = Number(parameters['Default Sound Pan'] || 0);

// Texts
Felski.Techtree.TTNShowTechDesc = String(parameters['Node Show Tech Description'] || 'true');
Felski.Techtree.TTNShowTechDesc = eval(Felski.Techtree.TTMenuBackground);

Felski.Techtree.TTNShowSkillName = String(parameters['Node Show Skill Name'] || 'true');
Felski.Techtree.TTNShowSkillName = eval(Felski.Techtree.TTNShowSkillName);

Felski.Techtree.TTNShowSkillDesc = String(parameters['Node Show Skill Description'] || 'true');
Felski.Techtree.TTNShowSkillDesc = eval(Felski.Techtree.TTNShowSkillDesc);

Felski.Techtree.TTNShowSkillIcon = String(parameters['Node Show Skill Icon'] || 'true');
Felski.Techtree.TTNShowSkillIcon = eval(Felski.Techtree.TTNShowSkillIcon);

// Fonts
// Tree
Felski.Techtree.TTFont = String(parameters['Font'] || 'GameFont');
Felski.Techtree.TTFontColor = Number(parameters['Font Color'] || 0);
Felski.Techtree.TTFontSize = Number(parameters['Font Size'] || 28);

// Header
Felski.Techtree.TTHeaderFont = String(parameters['Header Font'] || 'GameFont');
Felski.Techtree.TTHeaderFontSize = Number(parameters['Header Font Size'] || 28);
Felski.Techtree.TTHeaderFontColor = Number(parameters['Header Font Color'] || 0);

// Header Description
Felski.Techtree.TTHeaderDescFont = String(parameters['Header Description Font'] || 'GameFont');
Felski.Techtree.TTHeaderDescFontSize = Number(parameters['Header Description Font Size'] || 28);
Felski.Techtree.TTHeaderDescFontColor = Number(parameters['Header Description Font Color'] || 0);

// Node Header
Felski.Techtree.TTNHFont = String(parameters['Node Header Font'] || 'GameFont');
Felski.Techtree.TTNHFontSize = Number(parameters['Node Header Font Size'] || 28);
Felski.Techtree.TTNHFontColor = Number(parameters['Node Header Font Color'] || 0);
Felski.Techtree.TTNHFontColorGreyedOut = Number(parameters['Node Header Font Color Greyed Out'] || 8);

// Node Level Requirement
Felski.Techtree.TTLevelRequirementFont = String(parameters['Node Level Requirement Font'] || 'GameFont');
Felski.Techtree.TTLevelRequirementFontSize = Number(parameters['Node Level Requirement Font Size'] || 28);
Felski.Techtree.TTLevelRequirementFontColor = Number(parameters['Node Level Requirement Font Color'] || 8);

// Node Texts
Felski.Techtree.TTNTFont = String(parameters['Node Text Font'] || 'GameFont');
Felski.Techtree.TTNTFontSize = Number(parameters['Node Text Font Size'] || 28);
Felski.Techtree.TTNTFontColor = Number(parameters['Node Text Font Color'] || 0);
Felski.Techtree.TTNTFontColorGreyedOut = Number(parameters['Node Text Font Color Greyed Out'] || 8);

// Node Action Texts
Felski.Techtree.TTNAUnlock = String(parameters['Node Action Unlock'] || 'Unlock');
Felski.Techtree.TTNAAlreadyUnlocked = String(parameters['Node Action Already Unlocked'] || 'Already Unlocked');
Felski.Techtree.TTNAClose = String(parameters['Node Action Close'] || 'Close');
Felski.Techtree.TTNACancel = String(parameters['Node Action Cancel'] || 'Cancel');

// Cost
Felski.Techtree.TTNCFont = String(parameters['Node Cost Font'] || 'GameFont');
Felski.Techtree.TTNCFontSize = Number(parameters['Node Cost Font Size'] || 28);
Felski.Techtree.TTNCFontColor = Number(parameters['Node Cost Font Color'] || 0);
Felski.Techtree.TTNCFontColorGreyedOut = Number(parameters['Node Cost Font Color Greyed Out'] || 8);


function Scene_Techtree() {
    this.initialize.apply(this, arguments);
}

function Window_Techtree_Info() {
    this.initialize.apply(this, arguments);
}

function Window_Techtree() {
    this.initialize.apply(this, arguments);
}

function Window_Techtree_Select() {
    this.initialize.apply(this, arguments);
}

function Window_Techtree_Confirm() {
    this.initialize.apply(this, arguments);
}

function Window_Techtree_Currency() {
    this.initialize.apply(this, arguments);
}

(function() {


//************************************************************************************************
//
// Game_Interpreter
//
//************************************************************************************************
    
    Felski.Techtree.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        Felski.Techtree.Game_Interpreter_pluginCommand.call(this, command, args);
        command = command.toUpperCase(); 
        if (command === 'TECHTREE'){
        	var arg0 = args[0].toUpperCase(); 
        	if(arg0 === 'DISPLAYONLY'){
        		Felski.Techtree.menuOnlyDisplayBuffer = true;
        	}else if(arg0 === 'PRESELECT'){
        		Felski.Techtree.preselectedTree = args[1];
        	}else if(arg0 === 'SINGLE'){
        		Felski.Techtree.singleTreeView = true; 
        	}else{
        		var id = Number(args[0]);
        		SceneManager.push(Scene_Techtree);
        		SceneManager.prepareNextScene(id, Felski.Techtree.preselectedTree);
            	Felski.Techtree.preselectedTree = null;
        	}          
        }
        if (command === 'RESETTECHTREES'){ // actor
        	var bool = eval(args[1]);
            $gameActors.actor(args[0]).resetSkilltrees(bool);
        }
        if (command === 'RESETTECHTREE'){ // actor, tree uid
        	var bool = eval(args[2]);
            $gameActors.actor(args[0]).resetSkilltree(args[1], bool);
        }
        if (command === 'ACTIVENODES'){ // actor, tree uid, target variable
            $gameVariables.setValue(args[2], $gameActors.actor(args[0]).getUnlockedNodesCount(args[1]));
        }
        if (command === 'ACTIVENODESGOLDCOST'){ // actor, tree uid, target variable
            $gameVariables.setValue(args[2], $gameActors.actor(args[0]).getUnlockedNodesGoldCost(args[1]));
        }
        if (command === 'ACTIVENODESJPCOST'){ // actor, tree uid, target variable
            $gameVariables.setValue(args[2], $gameActors.actor(args[0]).getUnlockedNodesJPCost(args[1]));
        }
        if (command === 'ACTIVENODESITEMCOST'){ // actor, tree uid, item id, target variable
            $gameVariables.setValue(args[3], $gameActors.actor(args[0]).getUnlockedNodesItemCost(args[1], Number(args[2])));
        }
        if (command === 'ACTIVENODESWEAPONCOST'){ // actor, tree uid, weapon id, target variable
            $gameVariables.setValue(args[3], $gameActors.actor(args[0]).getUnlockedNodesWeaponCost(args[1], Number(args[2])));
        }
        if (command === 'ACTIVENODESARMORCOST'){ // actor, tree uid, armor id, target variable
            $gameVariables.setValue(args[3], $gameActors.actor(args[0]).getUnlockedNodesArmorCost(args[1], Number(args[2])));
        }
        if (command === 'HASACTORNODEACTIVE'){ // actor, tree uid, node uid, target switch
        	$gameSwitches.setValue(Number(args[3]), $gameActors.actor(args[0]).isNodeActive(args[1], args[2]));
        }
        if (command === 'ADDTECHTREE'){ // actor, tree uid
            $gameActors.actor(args[0]).addSkilltree(args[1]);
        }
        if (command === 'ACTIVATENODE'){ // actor, tree uid, node uid
            $gameActors.actor(args[0]).activateNode(args[1], args[2], false);
        }
        if (command === 'DEACTIVATENODE'){ // actor, tree uid, node uid
            $gameActors.actor(args[0]).deactivateNode(args[1], args[2]);
        }
    };

//************************************************************************************************
//
// Database Load
//
//************************************************************************************************

    DataManager.initTechtrees = function() {
        for (var i = 0; i < $dataTechtrees.length; i++) {
            var nodes = $dataTechtrees[i].nodes;
            for (var j = 0; j < nodes.length; j++) {
                nodes[j].active = false;                
            }
        }
    };

    Felski.Techtree.DataManager_onLoad = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        Felski.Techtree.DataManager_onLoad.call(this, object);
        if (object === $dataTechtrees ){
        	Felski.Techtree.techtreeHash = Felski.Techtree.hash(JSON.stringify($dataTechtrees));
        	DataManager.initTechtrees();
        }  
    };

    Felski.Techtree.hash = function(str){ // based on https://stackoverflow.com/a/7616484, credits to https://stackoverflow.com/users/495174/esmiralha
    	var hash = 0;
    	var i;
    	var chr;
    	if (str.length === 0) return hash;
		for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
    };


//************************************************************************************************
//
// Game Object Init
//
//************************************************************************************************
    
    Felski.Techtree.DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        Felski.Techtree.DataManager_createGameObjects.call(this);
        DataManager.readTechtreeNodes($dataActors);
        DataManager.readTechtreeNodes($dataClasses);
        DataManager.validateTechtrees();
    };

    DataManager.validateTechtrees = function(){
    	for (var i = 0; i < $dataTechtrees.length; i++) {
            var nodes = $dataTechtrees[i].nodes;
            for (var j = 0; j < nodes.length; j++) {
                nodes[j].active = false;
                // check for skill out of bounds
                for (var k = 0; k < nodes[j].technode.onActivate.skills.length; k++) {
                	if(nodes[j].technode.onActivate.skills[k] >= $dataSkills.length){
                		alert("Tree "+$dataTechtrees[i].uid+" has node "+nodes[j].technode.uid +" which has skill "+nodes[j].technode.onActivate.skills[k]+" which doesn't exist.\nYou need to either fix the node or adjust your maximum skills.\nOtherwise the game will crash.");
                	}
                }
            }
        }
    };

    DataManager.readTechtreeNodes = function(group) {
        var note1 = /<(?:techtree)>/i;
        var note2 = /<(?:\/techtree)>/i;
        var techtree = false;
        for (var i = 1; i < group.length; i++) {
            var obj = group[i];
            obj.techtrees = [];
            var notedata = obj.note.split(/[\r\n]+/);
            for (var j = 0; j < notedata.length; j++) {
                var line = notedata[j];
                if (line.match(note1)) {
                    techtree = true;
                }else if (line.match(note2)) {
                    techtree = false;
                }else if (techtree) {
                    obj.techtrees.push(line);
                }
            }
        }
    };

    DataManager.bindClassTrees = function(group) {
    	for (var i = 1; i < $dataClasses.length; i++) {
    		var techtrees = $dataClasses[i].techtrees;
	        $dataClasses[i].techtrees = [];
	        for (var j = 0; j < techtrees.length; j++) {
	            var techtreeData = $gameSystem.searchTechtrees(techtrees[j]);
	            if(techtreeData){
	            	$dataClasses[i].techtrees.push(jsonCopy(techtreeData));
	            }else{
	            	console.warn($dataClasses[i].name()+" has a techtree notetag that points to no tree in the Techtrees.json file. UID: " + techtrees[j]);
	            }
	        }
    	}      
    };

    Felski.Techtree.Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
    Scene_Boot.loadSystemImages = function() {
        Felski.Techtree.Scene_Boot_loadSystemImages.call(this);
        ImageManager.reserveTechtree('Tech_Hidden');
        ImageManager.reserveTechtree('Tech_Inactive');
        ImageManager.reserveTechtree('Tech_Unlockable');
        ImageManager.reserveTechtree('Tech_Active');
        ImageManager.reserveTechtree('Arrows');
        ImageManager.reserveTechtree('Arrows_Active');
    };

    ImageManager.reserveTechtree = function(filename, hue, reservationId) {
	    return this.reserveBitmap('img/system/techtree/', filename, hue, false, reservationId || this._systemReservationId);
	};

	ImageManager.reserveTechtreeBGIMG = function(filename, hue, reservationId) {
	    return this.reserveBitmap('img/system/techtree/bgimg/', filename, hue, false, reservationId || this._systemReservationId);
	};

	ImageManager.loadTechtree = function(filename, hue) {
	    return this.loadBitmap('img/system/techtree/', filename, hue, false);
	};

	ImageManager.loadTechtreeBGIMG = function(filename, hue) {
	    return this.loadBitmap('img/system/techtree/bgimg/', filename, hue, false);
	};


//************************************************************************************************
//
// Saving and Loading - Update Techtree
//
//************************************************************************************************

	Felski.Techtree.DataManager_makeSaveContents = DataManager.makeSaveContents;
	DataManager.makeSaveContents = function() {
        var contents = Felski.Techtree.DataManager_makeSaveContents.call(this);
        contents.techtreeHash = Felski.Techtree.techtreeHash;
        return contents;
    };

    Felski.Techtree.DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
    	Felski.Techtree.DataManager_extractSaveContents.call(this, contents);
    	if(Felski.Techtree.techtreeHash === contents.techtreeHash){
    		// same tree
    		console.log("Saved tree and tree in game files are the same.");
    	}else{
    		// new tree
    		console.warn("Loading game with different tree.");
    		if(Felski.Techtree.updateTechtrees){
    			this.updateTechtrees();
    		}
    	}
    };

    DataManager.updateTechtrees = function() {
    	for (var i = 0; i < $gameActors._data.length; i++) {
    		if($gameActors._data[i]){
    			$gameActors._data[i].updateSkilltrees();
	    	}
    	}
    };


//************************************************************************************************
//
// Game_Actor Techtree Technical Functions
//
//************************************************************************************************

    Felski.Techtree.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        Felski.Techtree.Game_Actor_initMembers.call(this);
        this._techtrees = [];
    };

    Felski.Techtree.Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        Felski.Techtree.Game_Actor_setup.call(this, actorId);
        this._classInited = [this._classId];
        var actor = $dataActors[actorId];
        this._techtrees = actor.techtrees || [];
        this.initSkilltrees();
        this.initClassSkilltrees();
    };

    Game_Actor.prototype.addSkilltree = function(uid) {
        var techtreeData = $gameSystem.searchTechtrees(uid);
        if(techtreeData){
        	this._techtrees.push(jsonCopy(techtreeData));
        }else{
        	console.warn(this.name()+" has a techtree notetag that points to no tree in the Techtrees.json file. UID: " + uid);
        }
    };

    Game_Actor.prototype.updateSkilltrees = function() {
    	for (var i = 0; i < this._techtrees.length; i++) {
    		var activeNodes = this.getActiveNodeIds(this._techtrees[i]);
    		this.resetSkilltree(this._techtrees[i].uid, false);
    		var techtreeData = $gameSystem.searchTechtrees(this._techtrees[i].uid);
	        if(techtreeData){
	        	this._techtrees[i] = jsonCopy(techtreeData);
	        	for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
	        		if(activeNodes.indexOf(this._techtrees[i].nodes[j].technode.uid) >= 0){
	        			this.activateNode(this._techtrees[i].uid, this._techtrees[i].nodes[j].technode.uid, true);
	        		}
	        	}
	        	/*
	        	// activate nodes that were active before.
	        	for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
	        		if(activeNodes.indexOf(this._techtrees[i].nodes[j].technode.uid) >= 0){
	        			this._techtrees[i].nodes[j].active = true;
	        		}
	        	}
	        	*/
	        }else{
	        	console.warn(this.name()+" loads a techtree that points to no tree in the Techtrees.json file. UID: " + this._techtrees[i].uid);
	        }
    	} 
    };

    Game_Actor.prototype.getActiveNodeIds = function(tree) {
    	var ret = [];
    	for (var i = 0; i < tree.nodes.length; i++) {
    	 	if(tree.nodes[i].active){
    	 		ret.push(tree.nodes[i].technode.uid);
    	 	}
    	}
    	return ret;
    };

    Game_Actor.prototype.onActivateTechtreeNode = function(technode, loading) {
    	// Switches
        var onActivate = technode.onActivate;
        for (var i = 0; i < onActivate.switches.length; i++) {
            var lever = onActivate.switches[i];
            $gameSwitches.setValue(lever.id, lever.value);
        }

        // Skills
        for (var i = 0; i < onActivate.skills.length; i++) {
            this.learnSkill(onActivate.skills[i]);
        }

        // Stats
        for (var i = 0; i < 8; i++) {
        	if(onActivate.stats){
        		if(onActivate.stats[i]){
        			this.addParam(i, onActivate.stats[i]);
        		}
        	}
        }

        // Eval
        if(onActivate.eval){
        	if(onActivate.eval.onActivate){
        		var code = String(onActivate.eval.onActivate);
        		try {
        			eval(code);
        		} catch (e) {
        			console.log(message);
  					console.log(code || 'NON-EXISTENT');
  					console.error(e);
        		}
        	}
        }

        // Common Events
        if(!loading){
	        for (var i = 0; i < onActivate.commonevents.length; i++) {
	            $gameTemp.reserveCommonEvent(onActivate.commonevents[i].id);
	            if(onActivate.commonevents[i].close){
	                SceneManager.goto(Scene_Map);
	            }
	        }
	    }
    };

    Game_Actor.prototype.onDeactivateTechtreeNode = function(technode) {
    	// Switches
        var onActivate = technode.onActivate;
        for (var i = 0; i < onActivate.switches.length; i++) {
            var lever = onActivate.switches[i];
            $gameSwitches.setValue(lever.id, !lever.value);
        }

        // Skills
        for (var i = 0; i < onActivate.skills.length; i++) {
            this.forgetSkill(onActivate.skills[i]);
        }

        // Stats
        for (var i = 0; i < 8; i++) {
        	if(onActivate.stats){
        		if(onActivate.stats[i]){
        			this.addParam(i, -1*onActivate.stats[i]);
        		}
        	}
        }

        // Eval
        if(onActivate.eval){
        	if(onActivate.eval.onDeactivate){
        		var code = String(onActivate.eval.onDeactivate);
        		try {
        			eval(code);
        		} catch (e) {
        			console.log(message);
  					console.log(code || 'NON-EXISTENT');
  					console.error(e);
        		}
        	}
        }
        /*
        // Common Events
        for (var i = 0; i < onActivate.commonevents.length; i++) {
            $gameTemp.reserveCommonEvent(onActivate.commonevents[i].id);
            if(onActivate.commonevents[i].close){
                SceneManager.goto(Scene_Map);
            }
        }
        */
    };

    Game_Actor.prototype.initSkilltrees = function() {
        var techtrees = this._techtrees;
        this._techtrees = [];
        for (var i = 0; i < techtrees.length; i++) {
            this.addSkilltree(techtrees[i]);
        }
    };

    Game_Actor.prototype.initClassSkilltrees = function() {
        var techtrees = $dataClasses[this._classId].techtrees;
        for (var i = 0; i < techtrees.length; i++) {
        	var techtreeData = $gameSystem.searchTechtrees(techtrees[i]);
        	if(techtreeData){
        		var data = jsonCopy(techtreeData);
	        	data.fromClass = this._classId;
	            this._techtrees.push(data);
        	}else{
            	console.warn($dataClasses[this._classId].name+" has a techtree notetag that points to no tree in the Techtrees.json file. UID: " + techtrees[i]);
            }
        }
    };

    Game_Party.prototype.techtreeMenuActor = function() {
    	var actor;
    	if(this._menuActorId === 0){
    		actor = this.members()[0];
    	}else{
    		actor = $gameActors.actor(this._menuActorId);
    	}	
	    return actor;
	};

//************************************************************************************************
//
// Plugin Command Functions
//
//************************************************************************************************

    Game_Actor.prototype.activateNode = function(treeUid, nodeUid, loading) {
    	for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === treeUid){
            	for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
            		if(this._techtrees[i].nodes[j].technode.uid === nodeUid){
            			this._techtrees[i].nodes[j].active = true;
            			this.onActivateTechtreeNode(this._techtrees[i].nodes[j].technode, loading);
            			return;
            		}
            	}
            }
        }
        console.warn("Activating node "+nodeUid+" for "+this.name()+" in tree "+treeUid+" has failed.");
    };

    Game_Actor.prototype.deactivateNode = function(treeUid, nodeUid) {
    	for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === treeUid){
            	for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
            		if(this._techtrees[i].nodes[j].technode.uid === nodeUid){
            			this._techtrees[i].nodes[j].active = false;
            			this.onDeactivateTechtreeNode(this._techtrees[i].nodes[j].technode);
            			return;
            		}
            	}
            }
        }
        console.warn("Deactivating node "+nodeUid+" for "+this.name()+" in tree "+treeUid+" has failed.");
    };

    Game_Actor.prototype.resetSkilltrees = function(refund) {
    	for (var i = 0; i < this._techtrees.length; i++) {
    		for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    			if(this._techtrees[i].nodes[j].active){
    				this._techtrees[i].nodes[j].active = false;
    				this.onDeactivateTechtreeNode(this._techtrees[i].nodes[j].technode);
    				if(refund){
    					var costs = this._techtrees[i].nodes[j].technode.costs;
    					this.refundCosts(costs);
    				}
    			}
    		}
    	}   
    };

    Game_Actor.prototype.resetSkilltree = function(uid, refund) {
        var found = false;
        for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === uid){
            	found = true;
				for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
	    			if(this._techtrees[i].nodes[j].active){
	    				this._techtrees[i].nodes[j].active = false;
	    				this.onDeactivateTechtreeNode(this._techtrees[i].nodes[j].technode);
	    				if(refund){
	    					var costs = this._techtrees[i].nodes[j].technode.costs;
	    					var classId = this._techtrees[i].fromClass;
	    					this.refundCosts(costs, classId);
	    				}
	    			}
	    		}
            }
        }
        if(!found){
        	console.warn("Resetting skilltree "+uid+" has failed for Actor "+this.name());	
        }
    };

    Game_Actor.prototype.refundCosts = function(costs, classId) {
        if(costs.gold > 0){
            $gameParty.gainGold(costs.gold);
        }
        if(costs.jp > 0 && Imported.YEP_JobPoints){
        	if(classId){
        		this.gainJp(costs.jp, classId);
        	}else{
        		this.gainJp(costs.jp);
        	}
        }
        if(costs.items.length > 0){
            for (var i = 0; i < costs.items.length; i++) {
                var item = $dataItems[costs.items[i].id];
                var cost = costs.items[i].amount;
                $gameParty.gainItem(item, cost, false);
            }
        }
        if(costs.weapons.length > 0){
            for (var i = 0; i < costs.weapons.length; i++) {
                var weapon = $dataWeapons[costs.weapons[i].id];
                var cost = costs.weapons[i].amount;
                $gameParty.gainItem(weapon, cost, false);   
            }
        }
        if(costs.armors.length > 0){
            for (var i = 0; i < costs.armors.length; i++) {
                var armor = $dataArmors[costs.armors[i].id];
                var cost = costs.armors[i].amount;
                $gameParty.gainItem(armor, cost, false);  
            } 
        }
    };

    Game_Actor.prototype.getUnlockedNodesCount = function(uid) {
        var count = 0;
        for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === uid){
                for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
                    if(this._techtrees[i].nodes[j].active) count++;
                }
            }
        }
        return count;
    };

    Game_Actor.prototype.getUnlockedNodesGoldCost = function(uid) {
        var count = 0;
        for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === uid){
                for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
                    if(this._techtrees[i].nodes[j].active){
                    	if(!isNaN(this._techtrees[i].nodes[j].technode.costs.gold)){
                    		count = count + this._techtrees[i].nodes[j].technode.costs.gold;
                    	}
                    }
                }
            }
        }
        return count;
    };

    Game_Actor.prototype.getUnlockedNodesJPCost = function(uid) {
        var count = 0;
        for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === uid){
                for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
                    if(this._techtrees[i].nodes[j].active){
                    	if(!isNaN(this._techtrees[i].nodes[j].technode.costs.jp)){
                    		count = count + this._techtrees[i].nodes[j].technode.costs.jp;
                    	}
                    }
                }
            }
        }
        return count;
    };

    Game_Actor.prototype.getUnlockedNodesItemCost = function(uid, itemId) {
        var count = 0;
        for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === uid){
                for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
                    if(this._techtrees[i].nodes[j].active){
                    	if(this._techtrees[i].nodes[j].technode.costs.items.length>0){
                    		for (var k = 0; k < this._techtrees[i].nodes[j].technode.costs.items.length; k++) {
                    			if(this._techtrees[i].nodes[j].technode.costs.items[k].id === itemId){
                    				count = count + this._techtrees[i].nodes[j].technode.costs.items[k].amount;
                    			}
                    		}
                    	}
                    }
                }
            }
        }
        return count;
    };

    Game_Actor.prototype.getUnlockedNodesWeaponCost = function(uid, itemId) {
        var count = 0;
        for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === uid){
                for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
                    if(this._techtrees[i].nodes[j].active){
                    	if(this._techtrees[i].nodes[j].technode.costs.weapons.length>0){
                    		for (var k = 0; k < this._techtrees[i].nodes[j].technode.costs.weapons.length; k++) {
                    			if(this._techtrees[i].nodes[j].technode.costs.weapons[k].id === itemId){
                    				count = count + this._techtrees[i].nodes[j].technode.costs.weapons[k].amount;
                    			}
                    		}
                    	}
                    }
                }
            }
        }
        return count;
    };

    Game_Actor.prototype.getUnlockedNodesArmorCost = function(uid, itemId) {
        var count = 0;
        for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === uid){
                for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
                    if(this._techtrees[i].nodes[j].active){
                    	if(this._techtrees[i].nodes[j].technode.costs.armors.length>0){
                    		for (var k = 0; k < this._techtrees[i].nodes[j].technode.costs.armors.length; k++) {
                    			if(this._techtrees[i].nodes[j].technode.costs.armors[k].id === itemId){
                    				count = count + this._techtrees[i].nodes[j].technode.costs.armors[k].amount;
                    			}
                    		}
                    	}
                    }
                }
            }
        }
        return count;
    };

    Game_Actor.prototype.isNodeActive = function(uid, nodeUid) {
        var count = 0;
        for (var i = 0; i < this._techtrees.length; i++) {
            if(this._techtrees[i].uid === uid){
                for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
                    if(this._techtrees[i].nodes[j].technode.uid === nodeUid){
                    	return this._techtrees[i].nodes[j].active;
                    }
                }
            }
        }
        return false;
    };

//************************************************************************************************
//
// Class Change
//
//************************************************************************************************

    Felski.Techtree.Game_Actor_changeClass = Game_Actor.prototype.changeClass;
    Game_Actor.prototype.changeClass = function(classId, keepExp) {
    	this._oldClassId = this._classId;
    	Felski.Techtree.Game_Actor_changeClass.call(this, classId, keepExp);
    	if(Felski.Techtree.CCUnlearn) this.unlearnSkilltree(classId);
    	if(Felski.Techtree.CCRemoveStats) this.removeStats(classId);
    	if(Felski.Techtree.CCRunDeEval) this.runDeactivateEval(classId);
    	this.addSkilltreeIfNeeded(classId);
    	this.toggleSkilltreeSwitches(classId);
    	if(Felski.Techtree.CCRelearn) this.relearnSkilltree(classId);
    	if(Felski.Techtree.CCReaddStats) this.reAddStats(classId);
    	if(Felski.Techtree.CCRunAcEval) this.runActivateEval(classId);
	};

	Game_Actor.prototype.addSkilltreeIfNeeded = function(classId) { //adds the new skilltree if needed
    	if(!this._classInited.includes(classId)){
    		this._classInited.push(classId);
    		var techtrees = $dataClasses[classId].techtrees;
    		if(!techtrees) return;
	    	for (var i = 0; i < techtrees.length; i++) {
	    		var techtreeData = $gameSystem.searchTechtrees(techtrees[i]);
	            var data = jsonCopy(techtreeData);
	        	data.fromClass = this._classId;
	            if(techtreeData){
	            	this._techtrees.push(data);
	            }else{
	            	console.warn(this.name()+" has a techtree notetag that points to no tree in the Techtrees.json file. UID: " + techtrees[i]);
	            }
	    	}
    	}
	};

//************************************************************************************************
//
// Class Change onActivates
//
//************************************************************************************************

	Game_Actor.prototype.unlearnSkilltree = function(classId) { //unlearns all skills/stats except the ones from classId and undefined
    	for (var i = 0; i < this._techtrees.length; i++) {
    		if(this._techtrees[i].fromClass !== classId && this._techtrees[i].fromClass !== undefined){
    			for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    				for (var k = 0; k < this._techtrees[i].nodes[j].technode.onActivate.skills.length; k++) {
    					this.forgetSkill(this._techtrees[i].nodes[j].technode.onActivate.skills[k]);
    				}
    			}
    		}
    	}
	};

	Game_Actor.prototype.relearnSkilltree = function(classId) { //relearns all skills from classId
    	for (var i = 0; i < this._techtrees.length; i++) {
    		if(this._techtrees[i].fromClass === classId && this._techtrees[i].fromClass !== undefined){
    			for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    				if(this._techtrees[i].nodes[j].active){
	    				for (var k = 0; k < this._techtrees[i].nodes[j].technode.onActivate.skills.length; k++) {
	    					this.learnSkill(this._techtrees[i].nodes[j].technode.onActivate.skills[k]);
	    				}     
    				}
    			}
    		}
    	}
	};

	Game_Actor.prototype.removeStats = function(classId) {
		if(this._oldClassId === classId) return;
		for (var i = 0; i < this._techtrees.length; i++) {
    		if(this._techtrees[i].fromClass === this._oldClassId && this._techtrees[i].fromClass !== undefined){
    			for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    				if(this._techtrees[i].nodes[j].active){
	    				if(this._techtrees[i].nodes[j].technode.onActivate.stats){
				        	for (var k = 0; k < 8; k++) {
				        		if(this._techtrees[i].nodes[j].technode.onActivate.stats[k]){
				        			this.addParam(k, -1*this._techtrees[i].nodes[j].technode.onActivate.stats[k]);
				        		}
				        	}
				        }    
    				}
    			}
    		}
    	}
	};

	Game_Actor.prototype.reAddStats = function(classId) {
		if(this._oldClassId === classId) return;
		for (var i = 0; i < this._techtrees.length; i++) {
    		if(this._techtrees[i].fromClass === classId && this._techtrees[i].fromClass !== undefined){
    			for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    				if(this._techtrees[i].nodes[j].active){
	    				if(this._techtrees[i].nodes[j].technode.onActivate.stats){
				        	for (var k = 0; k < 8; k++) {
				        		if(this._techtrees[i].nodes[j].technode.onActivate.stats[k]){
				        			this.addParam(k, this._techtrees[i].nodes[j].technode.onActivate.stats[k]);
				        		}
				        	}
				        }    
    				}
    			}
    		}
    	}
	};

	Game_Actor.prototype.runDeactivateEval = function(classId) {
		if(this._oldClassId === classId) return;
		for (var i = 0; i < this._techtrees.length; i++) {
    		if(this._techtrees[i].fromClass === this._oldClassId && this._techtrees[i].fromClass !== undefined){
    			for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    				if(this._techtrees[i].nodes[j].active){
	    				if(this._techtrees[i].nodes[j].technode.onActivate.eval){
				        	if(this._techtrees[i].nodes[j].technode.onActivate.eval.onDeactivate){
				        		var code = String(this._techtrees[i].nodes[j].technode.onActivate.eval.onDeactivate);
				        		try {
				        			eval(code);
				        		} catch (e) {
				        			console.log(message);
				  					console.log(code || 'NON-EXISTENT');
				  					console.error(e);
				        		}
				        	}
				        }    
    				}
    			}
    		}
    	}
	};

	Game_Actor.prototype.runActivateEval = function(classId) {
		if(this._oldClassId === classId) return;
		for (var i = 0; i < this._techtrees.length; i++) {
    		if(this._techtrees[i].fromClass === classId && this._techtrees[i].fromClass !== undefined){
    			for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    				if(this._techtrees[i].nodes[j].active){
	    				if(this._techtrees[i].nodes[j].technode.onActivate.eval){
				        	if(this._techtrees[i].nodes[j].technode.onActivate.eval.onActivate){
				        		var code = String(this._techtrees[i].nodes[j].technode.onActivate.eval.onActivate);
				        		try {
				        			eval(code);
				        		} catch (e) {
				        			console.log(message);
				  					console.log(code || 'NON-EXISTENT');
				  					console.error(e);
				        		}
				        	}
				        }    
    				}
    			}
    		}
    	}
	};

	Game_Actor.prototype.toggleSkilltreeSwitches = function(classId) { //toggles all switches except the ones from classId and undefined
    	for (var i = 0; i < this._techtrees.length; i++) {
    		if(this._techtrees[i].fromClass !== classId && this._techtrees[i].fromClass !== undefined){
    			for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    				for (var k = 0; k < this._techtrees[i].nodes[j].technode.onActivate.switches.length; k++) {
    					var lever = this._techtrees[i].nodes[j].technode.onActivate.switches[k];
    					$gameSwitches.setValue(lever.id, !lever.value);
    				}
    			}
    		}else{
    			for (var j = 0; j < this._techtrees[i].nodes.length; j++) {
    				for (var k = 0; k < this._techtrees[i].nodes[j].technode.onActivate.switches.length; k++) {
    					if(this._techtrees[i].nodes[j].active){
    						var lever = this._techtrees[i].nodes[j].technode.onActivate.switches[k];
    						$gameSwitches.setValue(lever.id, lever.value);
    					}
    				}
    			}
    		}
    	}
	};

//************************************************************************************************
//
// Search Functions
//
//************************************************************************************************

    Game_System.prototype.searchTechtrees = function(name) {
        var search = name;
        var obj = $dataTechtrees.filter(function ( obj ){
            return obj.uid === search;
        })[0];
        return obj;
    };

    Game_System.prototype.searchTechtree = function(tree, uid) {
        var search = uid;
        var obj = tree.nodes.filter(function ( obj ){
            return obj.technode.uid === search;
        })[0];
        return obj;
    };

    Game_System.prototype.searchTechtreeDepthLane = function(tree, depth, lane) {
        var search1 = depth;
        var search2 = lane;
        var obj = tree.nodes.filter(function ( obj ){
            return obj.technode.depth == search1 && obj.technode.lane == search2;
        })[0];
        return obj;
    };

//************************************************************************************************
//
// Menu Adjustments
//
//************************************************************************************************

    Felski.Techtree.Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
    Window_MenuCommand.prototype.addMainCommands = function() {
        Felski.Techtree.Window_MenuCommand_addMainCommands.call(this);
        var enabled = this.areMainCommandsEnabled();
        if(Felski.Techtree.TTMenuVisible){
            this.addCommand(Felski.Techtree.TTMenuText, 'skilltree', enabled);
        }
    };

    Felski.Techtree.Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        Felski.Techtree.Scene_Menu_createCommandWindow.call(this);
        if(Felski.Techtree.TTMenuVisible){
            this._commandWindow.setHandler('skilltree',     this.commandPersonal.bind(this));
        }
    };

    Felski.Techtree.Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    Scene_Menu.prototype.onPersonalOk = function() {
        Felski.Techtree.Scene_Menu_onPersonalOk.call(this);
        if(Felski.Techtree.TTMenuVisible){
            switch (this._commandWindow.currentSymbol()) {
            case 'skilltree':
                SceneManager.push(Scene_Techtree);
                break;
            }
        }
    };

/* //DEPRECATED: Moved to opening the skill tree menu instead.
    Felski.Techtree.Scene_Menu_initialize = Scene_Menu.prototype.initialize;
    Scene_Menu.prototype.initialize = function() {
    	var members = $gameParty.allMembers();
    	for (var i = 0; i < members.length; i++) {
    		if(members[i]._techtrees){
    			for (var j = 0; j < members[i]._techtrees.length; j++) {
	    			if(members[i]._techtrees[j].bgimg) ImageManager.reserveTechtreeBGIMG(members[i]._techtrees[j].bgimg);
	    			for (var h = 0; h < members[i]._techtrees[j].nodes.length; h++) {
	    				if(members[i]._techtrees[j].nodes[h].technode.bgimg) ImageManager.reserveTechtreeBGIMG(members[i]._techtrees[j].nodes[h].technode.bgimg);
	    			}
	    		}
    		}
    	}
        Felski.Techtree.Scene_Menu_initialize.call(this);     
    };
*/
    //Felski.Techtree.Scene_Class_commandLearnSkill = Scene_Class.prototype.commandLearnSkill;
if(Imported.YEP_ClassChangeCore) {
	if (Felski.Techtree.CCCommand) {
	    Scene_Class.prototype.commandLearnSkill = function() {
			SceneManager.push(Scene_Techtree);
		};

		Window_ClassCommand.prototype.addSkillLearnCommand = function() {
		    this.addCommand(Felski.Techtree.TTMenuText, 'learnSkill', true);
		};
	}
}

//************************************************************************************************
//
// Scene_Techtree 
//
//************************************************************************************************

    Scene_Techtree.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Techtree.prototype.constructor = Scene_Techtree;

    Scene_Techtree.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        this.preloadImages();
    };

    Scene_Techtree.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this); 
    };

    Scene_Techtree.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        this._activeTree = null;
        this.createTechtreeInfo();
        this.createTechtreeWindow();
        this.createTechtreeSelect();
        var x = this._window_TechtreeSelect.windowWidth() + this._window_TechtreeInfo.windowWidth();
        this.createTechtreeCurrency(x);
        this.createTechtreeConfirmWindow();
        
        if(Felski.Techtree.singleTreeView){
        	this._window_Techtree.activate();
        }else{
        	this._window_TechtreeSelect.activate();
        }
    };

    Scene_Techtree.prototype.updateActor = function() {
	    this._actor = $gameParty.techtreeMenuActor();
	};

    Scene_Techtree.prototype.preloadImages = function(){
    	var actor = $gameParty.techtreeMenuActor();
    	if(actor._techtrees){
			for (var j = 0; j < actor._techtrees.length; j++) {
    			if(actor._techtrees[j].bgimg){
    				ImageManager.reserveTechtreeBGIMG(actor._techtrees[j].bgimg);
    				console.log(actor._techtrees[j].bgimg);
    			}
    			for (var h = 0; h < actor._techtrees[j].nodes.length; h++) {
    				if(actor._techtrees[j].nodes[h].technode.bgimg){
    					ImageManager.reserveTechtreeBGIMG(actor._techtrees[j].nodes[h].technode.bgimg);
    					console.log(actor._techtrees[j].nodes[h].technode.bgimg);
    				}
    			}
    		}
		}
    };

    Scene_Techtree.prototype.prepare = function(actorId, treeId) {
        $gameParty.setMenuActor($gameActors.actor(actorId));
        this._startTreeId = treeId || false;
    };

    Scene_Techtree.prototype.createTechtreeInfo = function(){
        this._window_TechtreeInfo = new Window_Techtree_Info(0, 0, this._actor);
        this.addWindow(this._window_TechtreeInfo);
        this._window_TechtreeInfo.deactivate();
    };

    Scene_Techtree.prototype.createTechtreeSelect = function(){
    	var x = this._window_TechtreeInfo.windowWidth() || 0;
    	var h = this._window_TechtreeInfo.windowHeight() || 0;
    	var w = Graphics.width - x*2;
        this._window_TechtreeSelect = new Window_Techtree_Select(x, 0, w, h, this._actor);
        var trees = this._actor._techtrees;
        for (var i = 0; i < trees.length; i++) {
        	 this._window_TechtreeSelect.setHandler(i, this.onTechtreeSelectOk.bind(this, arguments));
        }
        this._window_TechtreeSelect.setHandler('cancel', this.onTechtreeLeave.bind(this));
        this._window_TechtreeSelect.setTechtreeWindow(this._window_Techtree);
        
        this.addWindow(this._window_TechtreeSelect);
        this._window_TechtreeSelect.select(this._window_Techtree.activeTreeIndex());
        if(Felski.Techtree.singleTreeView){
        	this._window_TechtreeSelect.deactivate();
        }else{
        	this._window_TechtreeSelect.activate();
        }
    };

    Scene_Techtree.prototype.createTechtreeWindow = function(){
    	var y = this._window_TechtreeInfo.windowHeight() || 0;
        this._window_Techtree = new Window_Techtree(0, y, y, this._actor, this._startTreeId);
        this._window_Techtree.setOkHandler(this.onTechtreeOk.bind(this, arguments));
        this._window_Techtree.setCancelHandler(this.onTechtreeCancel.bind(this));
        this.addWindow(this._window_Techtree);
        if(Felski.Techtree.singleTreeView){
        	this._window_Techtree.activate();
        }else{
        	this._window_Techtree.deactivate();
        }
    };

    Scene_Techtree.prototype.createTechtreeConfirmWindow = function(){
    	if(SceneManager._stack[SceneManager._stack.length-1] !== Scene_Map && Felski.Techtree.menuOnlyDisplay){
    		this._onlyDisplay = true;
    	}else{
    		this._onlyDisplay = Felski.Techtree.menuOnlyDisplayBuffer;
    	}
    	Felski.Techtree.menuOnlyDisplayBuffer = false;
        this._window_TechtreeConfirm = new Window_Techtree_Confirm(this._actor, this._onlyDisplay);
        this._window_TechtreeConfirm.setOkHandler(this.onTechtreeConfirmOk.bind(this, arguments));
        this._window_TechtreeConfirm.setCancelHandler(this.onTechtreeConfirmCancel.bind(this));
        this.addWindow(this._window_TechtreeConfirm);
        this._window_TechtreeConfirm.deactivate();
        this._window_TechtreeConfirm.hide();
    };


    Scene_Techtree.prototype.createTechtreeCurrency = function(x){
        this._window_TechtreeCurrency = new Window_Techtree_Currency(x, 0, this._actor);
        this._window_TechtreeSelect.setTechtreeCurrencyWindow(this._window_TechtreeCurrency);
        this.addWindow(this._window_TechtreeCurrency);
        this._window_TechtreeCurrency.deactivate();
    };


    Scene_Techtree.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        this.removeAnimation();
    };

    Scene_Techtree.prototype.onTechtreeLeave = function() {
    	Felski.Techtree.singleTreeView = false;
        SceneManager.pop();
    };

    Scene_Techtree.prototype.onTechtreeSelectOk = function(args, treeId) {
    	this._window_TechtreeSelect.deactivate();
    	this._window_TechtreeCurrency.setTree(treeId);
    	this._window_Techtree.changeTree(treeId);
    	this._window_Techtree.activate();
    };

    Scene_Techtree.prototype.onTechtreeOk = function(args, node, tree, rect) {
        this._window_Techtree.deactivate();
        this._window_TechtreeConfirm.setNode(node);
        this._window_TechtreeConfirm.setAnimationPos(rect.x, rect.y);
        this._window_TechtreeConfirm.setTree(tree);
        this._window_TechtreeConfirm.changebgimg();
        this._window_TechtreeConfirm.show();
        this._window_TechtreeConfirm.activate();
    };

    Scene_Techtree.prototype.onTechtreeCancel = function() {
    	if(Felski.Techtree.singleTreeView){
    		this.onTechtreeLeave();
    	}else{
    		this._window_Techtree.deactivate();
       		this._window_TechtreeSelect.activate();
    	}
    };

    Scene_Techtree.prototype.onTechtreeConfirmCancel = function() {
        this._window_TechtreeConfirm.deactivate();
        this._window_TechtreeConfirm.hide();
        this._window_Techtree.activate();
    };

    Scene_Techtree.prototype.onTechtreeConfirmOk = function(args, node) {
        node.active = true;
        this._window_TechtreeConfirm.deactivate();
        this._window_TechtreeConfirm.hide();
        this._window_Techtree.changed();
        this._window_Techtree.activate();
    };

    Scene_Techtree.prototype.removeAnimation = function(){
    	if(!this._activateAnimation) return;
        if(this._activateAnimation.finished()){
        	this.removeChild(this._activateAnimation);
        }
    };
    

//************************************************************************************************
//
// Window_Techtree
//
//************************************************************************************************

    Window_Techtree.prototype = Object.create(Window_Base.prototype);
    Window_Techtree.prototype.constructor = Window_Techtree;

    Window_Techtree.prototype.initialize = function(x, y, h2, actor, startTree) {
    	this._topMargin = h2 || 0;
        var width = this.windowWidth();
        var height = this.windowHeight();

        this._actor = actor;
        this._techtrees = this._actor._techtrees;
        this._activeTree;
        this._activeTreeIndex = 0;
        this._startTree = startTree || false;
        this._selectedDepth = -1;
        this._selectedLane = -1;
        this._selectedNode = null;
        this._changed = true;
		this._buttonSprites = [];
        
        this.initCursorInfos();
        this.initActiveTree();
        this.initTreeInfos();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.changebgimg();
    };

    Window_Techtree.prototype.initCursorInfos = function(){
        this._maxDepth = 0;
        this._maxLanes = 0;
        this._firstVisibleDepth = 1;
        this._firstVisibleLane = 1;
        this._lastVisibleDepth = this._firstVisibleDepth + this.visibleDepths();
        this._lastVisibleLane = this._firstVisibleLane + this.visibleLanes();
    };

    Window_Techtree.prototype.initActiveTree = function() {
    	if(this._startTree){
			for (var i = 0; i < this._techtrees.length; i++) {
	    		if(this._techtrees[i].uid === this._startTree){
	    			this._activeTree = this._techtrees[i];
	    			this._activeTreeIndex = i;
	    			return;
	    		}
	    	}
    	}
    	for (var i = 0; i < this._techtrees.length; i++) {
    		if(this._techtrees[i].fromClass === this._actor._classId || this._techtrees[i].fromClass === undefined){
    			this._activeTree = this._techtrees[i];
    			this._activeTreeIndex = i;
    			return;
    		}
    	}
    };

    Window_Techtree.prototype.initTreeInfos = function() {
        if(!this.hasTechtrees()) return;
        var lane = 0;
        var depth = 0;
        var parents;
        if(this._activeTree){
            var tree = this._activeTree;
            var nodes = tree.nodes;
            for (var i = 0; i < nodes.length; i++) { // reset children
                nodes[i].technode.children = [];
            }
            for (var i = 0; i < nodes.length; i++) { // init children, max depth and max lane
                if(nodes[i].technode.parents.length > 0){
                    parents = nodes[i].technode.parents;
                    for (var j = 0; j < parents.length; j++) {
                        var node = $gameSystem.searchTechtree(tree, parents[j].parent);
                        if(!node){
                        	console.warn("Couldn't find parent " + parents[j].parent + " for node " + nodes[i].technode.uid + "("+nodes[i].technode.header+").");
                        }else{
                        	node.technode.children.push(nodes[i].technode.uid);
                        }
                    }
                }
                if(nodes[i].technode.depth > depth){
                    depth = nodes[i].technode.depth;
                    if(this._selectedDepth === -1){
                        this._selectedDepth = depth;
                        if(depth > 1){
                            this._firstVisibleDepth = depth - 1;
                        }else{
                            this._firstVisibleDepth = depth;
                        }
                        this._lastVisibleDepth = this._firstVisibleDepth + this.visibleDepths();
                    }
                }
                if(nodes[i].technode.lane > lane){
                    lane = nodes[i].technode.lane;
                    if(this._selectedLane === -1){
                        this._selectedLane = lane;
                        if(lane > 1){
                            this._firstVisibleLane = lane - 1;
                        }else{ 
                            this._firstVisibleLane = lane;
                        }
                        this._lastVisibleLane = this._firstVisibleLane + this.visibleLanes();
                    }
                }
            }
        }
        this._maxDepth = depth;
        this._maxLanes = lane;
        this._selectedNode = $gameSystem.searchTechtreeDepthLane(this._activeTree, this._selectedDepth, this._selectedLane);
    };

    Window_Techtree.prototype.changebgimg = function() {
    	if(!Felski.Techtree.TTMenuBackground) return;
        if(this._activeTree){
        	if(this._activeTree.bgimg){
        		var bitmap = ImageManager.loadTechtreeBGIMG(this._activeTree.bgimg);
				var newWidth = Graphics.boxWidth;
				var newHeight = Graphics.boxHeight;			
				this.backOpacity = Felski.Techtree.TTMenuBackgroundOpacity;
				this._windowBackSprite.bitmap = new Bitmap(newWidth, newHeight);
				this._windowBackSprite.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, newWidth, newHeight);
        	}
        }
    };

    Window_Techtree.prototype.changed = function() {
    	this._changed = true;
    };

    Window_Techtree.prototype.changeTree = function(id) {
    	if(this._activeTree !== this._techtrees[id]){
	    	this._activeTree = this._techtrees[id];
	        this._selectedDepth = -1;
	        this._selectedLane = -1;
	        this.initCursorInfos();
	        this.initTreeInfos();
	        this.changed();
    	}
    };


//************************************************************************************************
//
// Window_Techtree // Technical Functions
//
//************************************************************************************************

    Window_Techtree.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if(this.visible){
        	var bool = false;
        	if(Imported["SumRndmDde Swipe Input"] >= 1.00){
				bool = this.processSwipe();
			}
			if(!bool){
				this.processCursorMove();
				this.processHandling();
				this.processWheel();
				this.processTouch();
			}
        	if(this._changed){
        		this.drawAll();
        		this._changed = false;
        	}
        }
    };

    Window_Techtree.prototype.show = function() {
        Window_Base.prototype.show.call(this);
    };

    Window_Techtree.prototype.windowWidth = function() {
        return Graphics.width;
    };

    Window_Techtree.prototype.windowHeight = function() {
        return Graphics.height - this._topMargin;
    };

    Window_Techtree.prototype.laneHeight = function() {
        if(Felski.Techtree.horizontal){
            return (this.windowHeight() - this.standardPadding()) / Felski.Techtree.Lanes;
        }else{
            return this.windowHeight();
        }
    };

    Window_Techtree.prototype.laneWidth = function() {
        if(Felski.Techtree.horizontal){
            return this.windowWidth();
        }else{
            return (this.windowWidth() - this.standardPadding()) / Felski.Techtree.Lanes;
        }
    };

    Window_Techtree.prototype.selectedNode = function() {
        return this._selectedNode;
    };

    Window_Techtree.prototype.indexObj = function() {
        return {"depth": this._selectedDepth, "lane": this._selectedLane};
    };

    Window_Techtree.prototype.maxDepth = function() {
        return this._maxDepth;
    };

    Window_Techtree.prototype.maxLanes = function() {
        return this._maxLanes;
    };

    Window_Techtree.prototype.firstVisibleDepth = function() {
        return this._firstVisibleDepth;
    };

    Window_Techtree.prototype.firstVisibleLane = function() {
        return this._firstVisibleLane;
    };

    Window_Techtree.prototype.lastVisibleDepth = function() {
        return this._lastVisibleDepth;
    };

    Window_Techtree.prototype.lastVisibleLane = function() {
        return this._lastVisibleLane;
    };

    Window_Techtree.prototype.visibleDepths = function() {
        return Math.floor(this.windowWidth() / (Felski.Techtree.NodeWidth + Felski.Techtree.NodeGap)) - 1;
    };

    Window_Techtree.prototype.visibleLanes = function() {
        return Felski.Techtree.Lanes - 1;
    };

    Window_Techtree.prototype.isActive = function() {
        return (this.active);
    };

    Window_Techtree.prototype.isOpenAndActive = function() {
        return this.isOpen() && this.active;
    };

    Window_Techtree.prototype.activeTreeIndex = function() {
        return this._activeTreeIndex;
    };
//************************************************************************************************
//
// Window_Techtree // Draw Functions
//
//************************************************************************************************

    Window_Techtree.prototype.drawAll = function() {
        this.contents.clear();
        if(this.hasTechtrees()){
            this.drawTechtree();
            this.updateCursor();
        }else{
            //this.drawInfo();
        }
    };

    Window_Techtree.prototype.drawInfo = function() {
        var w = this.windowWidth();
        var h = this.windowHeight();
        var x = 0;
        var y = h/3;
        var lh = this.techTreeLineHeight();    
        var text = "There is no techtree maintained for "+this._actor.name()+".";
        this.drawText(text, x, y, w, 'center');
        this.drawText(Felski.Techtree.TTNAClose, x, y+lh, w, 'center');
        this.setCursorRect(w/3, y+lh, w/3, lh);
    };

    Window_Techtree.prototype.drawActorInfo = function() {
        var w = Window_Base._faceWidth;
        var w2 = (w/4)*3 - w/4;
        var w3 = w - w/4;
        var lh = this.techTreeLineHeight();    

        var actor = this._actor;
        var name = actor.name();
        var level = actor.level;
        this.setFont(Felski.Techtree.TTFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTFontColor));
        this.setFontSize(Felski.Techtree.TTFontSize);
        this.drawActorFace(actor, 0, 0, w, w);
        this.drawText("N", w2, lh*0, w3, 'left');
        this.drawText(name, w2, lh*0, w3, 'right');
        this.drawText("L", w2, lh*1, w3, 'left');
        this.drawText(level, w2, lh*1, w3, 'right');
        this.resetFontSettings();
    };

    Window_Techtree.prototype.drawHeader = function() {
        this.clearSprites(); 
        var x = 200 + this.standardPadding();
        var y = 0;
        var y2 = this.standardPadding();
        var ip = Window_Base._iconWidth + this.standardPadding();
        var trees = this._techtrees;
        this.setFont(Felski.Techtree.TTFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTFontColor));
        this.setFontSize(Felski.Techtree.TTFontSize);
        for (var i = 0; i < trees.length; i++) {
            if(this._techtrees[i] === this._activeTree){
                this.drawIcon(trees[i].icon, x, y);
                var w = this.textWidth(trees[i].header);
                x = x + ip;
                this.drawText(trees[i].header, x, y, w, 'center');
                x = x + w;
            }else{
                var sprite = this.createButton(x, y2, i, trees[i].icon);
                this._buttonSprites.push(sprite);
            }
            x = x + ip;
        }
        this.resetFontSettings();
    };

    Window_Techtree.prototype.drawTechtree = function() {
        var techtree = this._activeTree;
        var nodes = techtree.nodes;
        for (var i = 0; i < nodes.length; i++) {
            if(nodes[i].technode.depth >= this.firstVisibleDepth() && nodes[i].technode.depth <= this.lastVisibleDepth()+1){
                if(nodes[i].technode.lane >= this.firstVisibleLane() && nodes[i].technode.lane <= this.lastVisibleLane()+1){
                    this.drawNode(nodes[i]);
                }
            }
        }
    };

    Window_Techtree.prototype.drawNode = function(nodeData) {
        var technode = nodeData.technode;
        var rect = this.getNodeRect(technode);
        var ip = Window_Base._iconWidth + this.standardPadding();
        var lh = this.techTreeLineHeight();
        var x = rect.x;
        var y = rect.y;

        this.setFont(Felski.Techtree.TTNHFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTNHFontColor));
        this.setFontSize(Felski.Techtree.TTNHFontSize);
        // Box
        if(this.isNodeVisible(nodeData)){
            //visible
            if(nodeData.active){
                var bitmap = ImageManager.loadTechtree('Tech_Active');
                this.drawBoxFrameBackgroundBitmap(x, y, rect.width, rect.height, bitmap, Felski.Techtree.NodeOpacity);
                this.drawBoxFrameBitmap(x, y, rect.width, rect.height, bitmap);
            }else if(this.isNodeUnlockable(nodeData)){
                var bitmap = ImageManager.loadTechtree('Tech_Unlockable');
                this.drawBoxFrameBackgroundBitmap(x, y, rect.width, rect.height, bitmap, Felski.Techtree.NodeOpacity);
                this.drawBoxFrameBitmap(x, y, rect.width, rect.height, bitmap);
            }else{
                var bitmap = ImageManager.loadTechtree('Tech_Inactive');
                this.drawBoxFrameBackgroundBitmap(x, y, rect.width, rect.height, bitmap, Felski.Techtree.NodeOpacity);
                this.drawBoxFrameBitmap(x, y, rect.width, rect.height, bitmap);
            }  

            // Header
            this.drawText(technode.header, x+Felski.Techtree.NodeBorderWidth, y, rect.width-Felski.Techtree.NodeBorderWidth*2, 'center');

            // onActivate
            var onActivate = technode.onActivate;
            var l = onActivate.skills.length;
            l = l*ip;
            l = l-this.standardPadding();
            l = l/2;
            x = rect.x + rect.width/2-l;
            for (var i = 0; i < onActivate.skills.length; i++) {
                var icon = $dataSkills[onActivate.skills[i]].iconIndex;
                this.drawIcon(icon, x, y+lh*1);
                x = x + ip;
            }

            // Cost
            if(!Felski.Techtree.NodesCostHidden) {
	            if(nodeData.active && Felski.Techtree.NodesLearnedIconShown){
	            	var mid = rect.x + rect.width/2;
	            	mid = mid - Window_Base._iconWidth/2;
	            	var lastLine = rect.y + rect.height - this.techTreeLineHeight() - Felski.Techtree.NodeBorderWidth;
	            	this.drawIcon(Felski.Techtree.NodesLearnedIconID, mid, lastLine);
	            }else{
	            	var costs = this.createCostArray(technode.costs);
	            	this.drawCosts(rect, costs);
	            }
	        }
            
            // Arrows
            for (var i = 0; i < technode.parents.length; i++) {
                var parent = $gameSystem.searchTechtree(this._activeTree, technode.parents[i].parent);
                if(parent){
                    var rect1 = this.getNodeRect(parent.technode);
                    var rect2 = this.getNodeRect(technode);
                    var skin;
                    if(parent.active){
                        skin = ImageManager.loadTechtree('Arrows_Active');
                    }else{
                        skin = ImageManager.loadTechtree('Arrows');
                    }
                    this.drawArrow(rect1.x+rect1.width, rect1.y+(rect1.height/2), rect2.x, rect2.y+(rect2.height/2), skin);
                }
            }
            for (var i = 0; i < technode.children.length; i++) {
                var child = $gameSystem.searchTechtree(this._activeTree, technode.children[i]);
                if(child){
                    var rect1 = this.getNodeRect(technode);
                    var rect2 = this.getNodeRect(child.technode);
                    if(nodeData.active){
                        var skin = ImageManager.loadTechtree('Arrows_Active');
                    }else{
                        var skin = ImageManager.loadTechtree('Arrows');
                    }
                    this.drawArrow(rect1.x+rect1.width, rect1.y+(rect1.height/2), rect2.x, rect2.y+(rect2.height/2), skin);
                }
            }
            this.resetFontSettings();

        }else{
            //not visible
            var bitmap = ImageManager.loadTechtree('Tech_Hidden');
            this.drawBoxFrameBackgroundBitmap(x, y, rect.width, rect.height, bitmap, Felski.Techtree.NodeOpacity);
            this.drawBoxFrameBitmap(x, y, rect.width, rect.height, bitmap);
            x = rect.x + (rect.width - Window_Base._iconWidth)/2;
            y = rect.y + (rect.height - Window_Base._iconHeight)/2;
            this.drawIcon(Felski.Techtree.HiddenIcon, x, y);

            // Arrows
            for (var i = 0; i < technode.parents.length; i++) {
                var parent = $gameSystem.searchTechtree(this._activeTree, technode.parents[i].parent);
                if(parent){
                    var rect1 = this.getNodeRect(parent.technode);
                    var rect2 = this.getNodeRect(technode);
                    if(parent.active){
                        var skin = ImageManager.loadTechtree('Arrows_Active');
                    }else{
                        var skin = ImageManager.loadTechtree('Arrows');
                    }
                    this.drawArrow(rect1.x+rect1.width, rect1.y+(rect1.height/2), rect2.x, rect2.y+(rect2.height/2), skin);
                }
            }
            for (var i = 0; i < technode.children.length; i++) {
                var child = $gameSystem.searchTechtree(this._activeTree, technode.children[i]);
                if(child){
                    var rect1 = this.getNodeRect(technode);
                    var rect2 = this.getNodeRect(child.technode);
                    if(nodeData.active){
                        var skin = ImageManager.loadTechtree('Arrows_Active');
                    }else{
                        var skin = ImageManager.loadTechtree('Arrows');
                    }
                    this.drawArrow(rect1.x+rect1.width, rect1.y+(rect1.height/2), rect2.x, rect2.y+(rect2.height/2), skin);
                }
            }
        }
    };

    Window_Techtree.prototype.drawCosts = function(rect, costs) {
        // Cost
        this.setFont(Felski.Techtree.TTNCFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTNCFontColor));
        this.setFontSize(Felski.Techtree.TTNCFontSize);
        var hp = this.standardPadding()/2;
        var ip = Window_Base._iconWidth + hp;
        var costWidth = this.measureCostArrayWidth(costs);
        var tw;
        var x = rect.x + ((rect.width/2)-(costWidth/2));
        var y = rect.y + rect.height - this.techTreeLineHeight() - hp;
        for (var i = 0; i < costs.length; i++) {
            tw = this.textWidth(costs[i].amount);
            this.drawText(costs[i].amount, x, y, tw, 'left');
            x = x+tw+hp;
            if(costs[i].icon){
                this.drawIcon(costs[i].icon, x, y);
                x = x+ip+hp;
            }else if(costs[i].text){
                tw = this.textWidth(costs[i].text);
                this.drawText(costs[i].text, x, y, tw, 'left');
                x = x+tw+hp;
            }   
        }
        this.resetFontSettings();
    };

    Window_Techtree.prototype.createCostArray = function(costsObject) {
        var costArr = [];
        var costs = costsObject;
        if(costs.gold > 0){
            var gold;
            if(Imported.YEP_CoreEngine === true){
                gold = {"icon":Yanfly.Icon.Gold, "amount":costs.gold};
            }else{
                gold = {"text":TextManager.currencyUnit, "amount":costs.gold};
            }
            costArr.push(gold);
        }
        if(costs.jp > 0 && Imported.YEP_JobPoints){
            var jp = {"icon":Yanfly.Icon.Jp, "amount":costs.jp};
            costArr.push(jp);
        }
        if(costs.items){
            for (var i = 0; i < costs.items.length; i++) {
                var item = $dataItems[costs.items[i].id];
                if(item){
                    var cost = costs.items[i].amount;
                    var itemcost = {"icon":item.iconIndex, "amount":cost};
                    costArr.push(itemcost);
                }else{
                    console.warn("There is an item cost that points to no item. Item ID: "+costs.items[i].id);
                }
            }
        }
        return costArr;
    };

    Window_Techtree.prototype.measureCostArrayWidth = function(costsArray) {
        var costs = costsArray;
        var hp = this.standardPadding()/2;
        var ip = Window_Base._iconWidth + hp;
        var amountWidth = 0;
        var textWidth = 0;
        var costWidth = 0;
        for (var i = 0; i < costs.length; i++) {
            if(costs[i].icon){
                costWidth = costWidth + ip;       
            }else if(costs[i].text){
                textWidth = this.textWidth(costs[i].text);
                costWidth = costWidth + textWidth + hp;
            }
            amountWidth = this.textWidth(costs[i].amount);
            costWidth = costWidth + amountWidth + hp;
        }
        return costWidth;
    };


//************************************************************************************************
//
// Window_Techtree // Sprite Handling
//
//************************************************************************************************

    Window_Techtree.prototype.createButton = function(x, y, id, icon) {
        var bitmap = ImageManager.loadSystem('IconSet');
        var sprite = new Sprite_FelskiButton(x, y, id);
        sprite.bitmap = bitmap;
        var frame = this.getIconFrame(icon);
        sprite.setFrame(frame.x, frame.y, frame.width, frame.height);
        sprite.setTouchHandler(this.onButtonTouch.bind(this, arguments));
        this.addChild(sprite);
        return sprite;
    };

    Window_Techtree.prototype.clearSprites = function(){
        for (var i = 0; i < this._buttonSprites.length; i++) {
            this.removeChild(this._buttonSprites[i]);
        }
        this._buttonSprites = []; 
    };


//************************************************************************************************
//
// Window_Techtree // cursorMovement
//
//************************************************************************************************
   
    Window_Techtree.prototype.cursorDown = function() {
        var node = this.selectedNode();
        var depth = node.technode.depth;
        var lane = node.technode.lane;   
        var maxLanes = this.maxLanes(); 
        if (lane < maxLanes) {
            this.select(depth, lane + 1, "down");
        }
    };

    Window_Techtree.prototype.cursorUp = function() {
        var node = this.selectedNode();
        var depth = node.technode.depth;
        var lane = node.technode.lane;   
        if (lane > 1) {
            this.select(depth, lane - 1, "up");
        }
    };

    Window_Techtree.prototype.cursorRight = function() {
        var node = this.selectedNode();
        var depth = node.technode.depth;
        var lane = node.technode.lane;   
        var maxDepth = this.maxDepth();
        if (depth < maxDepth) {
            this.select(depth + 1, lane, "right");
        }
    };

    Window_Techtree.prototype.cursorLeft = function() {
        var node = this.selectedNode();
        var depth = node.technode.depth;
        var lane = node.technode.lane;  
        if (depth > 1) {
            this.select(depth - 1, lane, "left");
        }
    };

    Window_Techtree.prototype.scrollDown = function() {
        var node = this.selectedNode();
        var depth = node.technode.depth;
        var lane = node.technode.lane;  
        var maxDepth = this.maxDepth();
        if (depth < maxDepth) {
            this.select(depth + 1, lane, "right");
        }
    };

    Window_Techtree.prototype.scrollUp = function() {
        var node = this.selectedNode();
        var depth = node.technode.depth;
        var lane = node.technode.lane;    
        if (depth > 1) {
            this.select(depth - 1, lane, "left");
        }
    };
/*
    Window_Techtree.prototype.preloadImages = function(){
    	if(this._selectedNode !== null){
    		var technode = this._selectedNode.technode;
    		ImageManager.reserveTechtreeBGIMG(technode.bgimg);
			console.log(technode.bgimg);
    	}	
    };
*/
    Window_Techtree.prototype.select = function(depth, lane, direction) {
        var oldDepth = this._selectedDepth;
        var oldLane = this._selectedLane;
        this._selectedDepth = depth;
        this._selectedLane = lane;
        this._selectedNode = $gameSystem.searchTechtreeDepthLane(this._activeTree, depth, lane);
        //this.preloadImages(); done when the scene opens
        if(this.selectedNode() === null || this.selectedNode() === undefined){
            if(direction == "right"){ // right
                if(this._selectedDepth >= this._maxDepth && this._selectedLane >= this._maxLanes){
                    this.select(this._selectedDepth - 1, this._selectedLane, "left");
                }else if(this._selectedDepth >= this._maxDepth){
                    this.select(this._maxDepth, this._selectedLane + 1, "down");
                }else{
                    this.select(this._selectedDepth + 1, this._selectedLane, "right");
                }        
            }else if(direction == "left"){ // left
                if(this._selectedDepth <= 1 && this._selectedLane <= 1){
                    this.select(2, 1, "right");
                }else if(this._selectedDepth <= 1){
                    this.select(1, this._selectedLane - 1, "up");
                }else{
                    this.select(this._selectedDepth - 1, this._selectedLane, "left");     
                }
            }else if(direction == "down"){ // down
                if(this._selectedDepth >= this._maxDepth && this._selectedLane >= this._maxLanes){
                    this.select(this._maxDepth, this._maxLanes - 1 , "up");
                }else if(this._selectedLane >= this._maxLanes){
                    this.select(this._selectedDepth + 1, this._maxLanes, "right");
                }else{
                    this.select(this._selectedDepth, this._selectedLane + 1, "down");
                }
            }else{ // up
                if(this._selectedDepth <= 1 && this._selectedLane <= 1){
                    this.select(1, 2, "down");
                }else if(this._selectedLane <= 1){
                    this.select(this._selectedDepth - 1, 1, "left");
                }else{
                    this.select(this._selectedDepth, this._selectedLane - 1, "up");
                }    
            }
        }
        this.ensureCursorVisible(direction);
        this.updateCursor();
    };

    Window_Techtree.prototype.ensureCursorVisible = function(direction) {
        var node = this.indexObj();
        if(node.lane < this.firstVisibleLane()){
            this._firstVisibleLane = node.lane;
            this._lastVisibleLane = this._firstVisibleLane + this.visibleLanes();
        }
        if(node.lane > this.lastVisibleLane()){
            this._lastVisibleLane = node.lane;
            this._firstVisibleLane = this._lastVisibleLane - this.visibleLanes();
        }
        if(node.depth < this.firstVisibleDepth()){
            this._firstVisibleDepth = node.depth;
            this._lastVisibleDepth = this._firstVisibleDepth + this.visibleDepths();
        }
        if(node.depth > this.lastVisibleDepth()){
            this._lastVisibleDepth = node.depth;
            this._firstVisibleDepth = this._lastVisibleDepth - this.visibleDepths();
        }
    };

    Window_Techtree.prototype.updateCursor = function() {
        var node = this.selectedNode();
        if(node){
            var rect = this.getNodeRect(node.technode);
            var w = rect.width + (Felski.Techtree.NodeCursorSize * 2);
            var h = rect.height + (Felski.Techtree.NodeCursorSize * 2);
            var x = rect.x + (rect.width - w)/2;
            var y = rect.y + (rect.height - h)/2;
            this.setCursorRect(x, y, w, h);
        }
    };


//************************************************************************************************
//
// Window_Techtree // onEvent Handling
//
//************************************************************************************************

    Window_Techtree.prototype.onButtonTouch = function(args, x, y, id) {
        this._activeTree = this._techtrees[id];
        this._selectedDepth = -1;
        this._selectedLane = -1;
        this.initCursorInfos();
        this.initTreeInfos();
        this.changed();
    };

    Window_Techtree.prototype.onTouch = function(triggered) {
        if(!this.hasTechtrees() && triggered) {this.processCancel(); return;}
        var lastNode = this.selectedNode();
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hitNode = this.hitTest(x, y);
        if (hitNode !== null) {
            if (hitNode === this.selectedNode()) {
                //if (triggered && this.isTouchOkEnabled()) {
                if (triggered) {
                    this.processOk();
                }
            } else {
                var depth = hitNode.technode.depth;
                var lane = hitNode.technode.lane;
                this.select(depth, lane);
            }
        } else if (this._stayCount >= 10) {
            if (y < this.padding) {
                this.cursorUp();
            } else if (y >= this.height - this.padding) {
                this.cursorDown();
            }
        }
        if (this.selectedNode() !== lastNode) {
            SoundManager.playCursor();
        }
    };


//************************************************************************************************
//
// Window_Techtree // process Input
//
//************************************************************************************************

    Window_Techtree.prototype.processCursorMove = function() {
        if (this.isOpenAndActive() && this.hasTechtrees()) {
            var lastNode = this.selectedNode();
            if (Input.isRepeated('down')) {
                this.cursorDown(Input.isTriggered('down'));
            }
            if (Input.isRepeated('up')) {
                this.cursorUp(Input.isTriggered('up'));
            }
            if (Input.isRepeated('right')) {
                this.cursorRight(Input.isTriggered('right'));
            }
            if (Input.isRepeated('left')) {
                this.cursorLeft(Input.isTriggered('left'));
            }
            /*
            if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
                this.cursorPagedown();
            }
            if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
                this.cursorPageup();
            }
            */
            if (lastNode !== this.selectedNode()) {
            	this.changed();
                SoundManager.playCursor();
            }
        }
    };

    Window_Techtree.prototype.processHandling = function() {
        if (this.isOpenAndActive()) {
            if (this.isOkTriggered()) {
                this.processOk();
            } else if (this.isCancelTriggered()) {
                this.processCancel();
            } /*else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
                this.processPagedown();
            } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
                this.processPageup();
            } */
        }
    };

    Window_Techtree.prototype.processCancel = function() {
        SoundManager.playCancel();
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    };

    Window_Techtree.prototype.processOk = function() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else if(!this.hasTechtrees()){
            SoundManager.playCancel();
            this.updateInputData();
            this.deactivate();
            this.callCancelHandler();
        } else{
            this.playBuzzerSound();
        }
    };

    Window_Techtree.prototype.processTouch = function() {
        if (this.isOpenAndActive()) {
        	var lastNode = this.selectedNode();
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                this._touching = true;
                this.onTouch(true);
            } else if (TouchInput.isCancelled()) {
                this.processCancel();
            }
            if (this._touching) {
                if (TouchInput.isPressed()) {
                    this.onTouch(false);
                } else {
                    this._touching = false;
                }
            }
            if (lastNode !== this.selectedNode()) {
	    		this.changed();
	    	}
        } else {
            this._touching = false;
        }
    };

	if(Imported["SumRndmDde Swipe Input"] >= 1.00){
		Window_Techtree.prototype.processSwipe = function() {
			var bool = false;
		    if (this.isOpenAndActive()) {
		    	var lastNode = this.selectedNode();
	            if (SwipeInput.isTriggered('left')) {
	                this.scrollDown();
	                bool = true;
	            }
	            if (SwipeInput.isTriggered('right')) {
	                this.scrollUp();
	                bool = true;
	            }
	            if (SwipeInput.isTriggered('up')) {
	                this.cursorDown();
	                bool = true;
	            }
	            if (SwipeInput.isTriggered('down')) {
	                this.cursorUp();
	                bool = true;
	            }
	            if (lastNode !== this.selectedNode()) {
		    		this.changed();
		    		SoundManager.playCursor();
		    	}
	        }
	        return bool;
		};
	}

    Window_Techtree.prototype.processWheel = function() {
        if (this.isOpenAndActive()) {
            var threshold = 20;
            var lastNode = this.selectedNode();
            if (TouchInput.wheelY >= threshold) {
                this.scrollDown();
            }
            if (TouchInput.wheelY <= -threshold) {
                this.scrollUp();
            }
            if (lastNode !== this.selectedNode()) {
	    		this.changed();
	    		SoundManager.playCursor();
	    	}
        }
    };


//************************************************************************************************
//
// Window_Techtree // Checks
//
//************************************************************************************************
 
    Window_Techtree.prototype.isNodeUnlockable = function(node) {
        if(node){
            var parents = node.technode.parents;
            var neededParents = node.technode.neededParents;
            var activeParents = 0;
            for (var i = 0; i < parents.length; i++) {
                var parent = $gameSystem.searchTechtree(this._activeTree, parents[i].parent);
                if(parent){
                    if(parent.active){
                        activeParents = activeParents + 1;
                    }
                }
            }
            if(neededParents <= activeParents){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }    
    };

    Window_Techtree.prototype.isNodeVisible = function(node) {
        if(node){
        	if(node.active && Felski.Techtree.NodesActiveVisible){
        		return true;
        	}
            var visibility = node.technode.visibility;
            var switches = visibility.switches;
            var visible = false;
            if(switches.length > 0){
                for (var i = 0; i < switches.length; i++) {
                    if(!$gameSwitches.value(switches[i].id)){
                        return false;
                    }else{
                        visible = true;
                    }
                }
                return visible;
            }else{
                return true;
            }
        }else{
            return false;
        }    
    };

    Window_Techtree.prototype.isCurrentItemEnabled = function() {
        return (!!this._selectedNode);
    };

    Window_Techtree.prototype.hasTechtrees = function() {
        return (this._activeTree);
    };

    Window_Techtree.prototype.isOkTriggered = function() {
        return Input.isRepeated('ok');
    };

    Window_Techtree.prototype.isCancelTriggered = function() {
        return Input.isRepeated('cancel');
    };

    Window_Techtree.prototype.hitTest = function(x, y) {
        if(!this.hasTechtrees()) return null;
        if (this.isContentsArea(x, y)) {
            var cx = x - this.padding;
            var cy = y - this.padding;
            var nodes = this._activeTree.nodes;
            for (var i = 0; i < nodes.length; i++) {
                var rect = this.getNodeRect(nodes[i].technode);
                var right = rect.x + rect.width;
                var bottom = rect.y + rect.height;
                if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                    return nodes[i];
                }
            }
        }
        return null;
    };

    Window_Techtree.prototype.isContentsArea = function(x, y) {
        var left = this.padding;
        var top = this.padding;
        var right = this.width - this.padding;
        var bottom = this.height - this.padding;
        return (x >= left && y >= top && x < right && y < bottom);
    };

    Window_Techtree.prototype.isTouchedInsideFrame = function() {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };


//************************************************************************************************
//
// Window_Techtree // Handler Methods
//
//************************************************************************************************

    Window_Techtree.prototype.setOkHandler = function(method) {
        this._okHandler = method;
    };

    Window_Techtree.prototype.callOkHandler = function() {
        if (this._okHandler) {
        	var rect = this.getNodeRect(this._selectedNode.technode);
        	rect.x = rect.x + Math.floor(rect.width/2);
        	rect.y = rect.y + this._topMargin + Math.floor(rect.height/2);
            this._okHandler(this._selectedNode, this._activeTree, rect);
        }
    };

    Window_Techtree.prototype.setCancelHandler = function(method) {
        this._cancelHandler = method;
    };

    Window_Techtree.prototype.callCancelHandler = function() {
        if (this._cancelHandler) {
            this._cancelHandler();
        }
    };

    Window_Techtree.prototype.updateInputData = function() {
        Input.update();
        TouchInput.update();
    };


//************************************************************************************************
//
// Window_Techtree // Sounds
//
//************************************************************************************************

    Window_Techtree.prototype.playOkSound = function() {
        SoundManager.playOk();
    };

    Window_Techtree.prototype.playBuzzerSound = function() {
        SoundManager.playBuzzer();
    };


//************************************************************************************************
//
// Window_Techtree // Helping Functions
//
//************************************************************************************************

    Window_Techtree.prototype.getIconFrame = function(iconIndex){
        var w = Window_Base._iconWidth;
        var h = Window_Base._iconHeight;
        var x = iconIndex % 16 * w;
        var y = Math.floor(iconIndex / 16) * h;
        var rect = new Rectangle(x, y, w, h);
        return rect;
    };

    Window_Techtree.prototype.getNodeRect = function(technode) {
        var depth = technode.depth - this._firstVisibleDepth;
        var lane = technode.lane - this._firstVisibleLane;
        var w = Felski.Techtree.NodeWidth;
        var h = Felski.Techtree.NodeHeight;
        var x = Felski.Techtree.NodesLeftMargin || 0;
        var y = Felski.Techtree.NodesTopMargin;
        if(Felski.Techtree.horizontal){
            x = x + (Felski.Techtree.NodeWidth + Felski.Techtree.NodeGap) * depth ;
            y = y + (Felski.Techtree.NodeHeight + this.standardPadding()) * lane;        
        }else{
            x = x + (Felski.Techtree.NodeWidth + this.standardPadding()) * lane;
            y = y + (Felski.Techtree.NodeHeight + Felski.Techtree.NodeGap) * depth ;
        }
        var rect = new Rectangle(x, y, w, h);
        return rect;
    };


//************************************************************************************************
//
// Window_Techtree_Select
//
//************************************************************************************************

	Window_Techtree_Select.prototype = Object.create(Window_HorzCommand.prototype);
	Window_Techtree_Select.prototype.constructor = Window_Techtree_Select;

	Window_Techtree_Select.prototype.initialize = function(x, y, w, h, actor) {
		this._newW = w;
		this._newH = h;
		this._actor = actor;
		this._hasTechtrees = false;
		this.hasTechtrees();
		this._firstVisibleCol = 0;
		this._lastVisibleCol = this.maxCols() - 1;
	    Window_HorzCommand.prototype.initialize.call(this, x, y);
	};

	Window_Techtree_Select.prototype.windowWidth = function() {
	    return this._newW;
	};

	Window_Techtree_Select.prototype.windowHeight = function() {
	    return this._newH;
	};

	Window_Techtree_Select.prototype.maxCols = function() {
	    return Felski.Techtree.TTHeaderCols;
	};

	Window_Techtree_Select.prototype.update = function() {
	    Window_HorzCommand.prototype.update.call(this);
	    if(this._oldIndex !== this.index()){
	    	this._oldIndex = this.index();
	    	this.refresh();
	    }
	};

	Window_Techtree_Select.prototype.setTechtreeWindow = function(techtreeWindow) {
		this._techtreeWindow = techtreeWindow;
	};

	Window_Techtree_Select.prototype.setTechtreeCurrencyWindow = function(techtreeCurrencyWindow) {
		this._techtreeCurrencyWindow = techtreeCurrencyWindow;
	};

	Window_Techtree_Select.prototype.hasTechtrees = function() {
		var trees = this._actor._techtrees;
		for (var i = 0; i < trees.length; i++) {
    		if(trees[i].fromClass === this._actor._classId || trees[i].fromClass === undefined){
    			this._hasTechtrees = true;
    			return;
    		}
    	}
    };

	Window_Techtree_Select.prototype.makeCommandList = function() {
		if(this._hasTechtrees){
			var trees = this._actor._techtrees;
			for (var i = 0; i < trees.length; i++) {			
				var tree = trees[i];
				if(tree.fromClass === this._actor._classId || tree.fromClass === undefined){
					this.addCommand(tree.header, String(i));
				}
			}
		}else{
			this.addCommand("close", "cancel", true);
		}
	};

    Window_Techtree_Select.prototype.callHandler = function(symbol) {
	    if (this.isHandled(symbol)) {
	        this._handlers[symbol](symbol);
	    }
	};

	Window_Techtree_Select.prototype.cursorDown = function(wrap) {
	    Window_Selectable.prototype.cursorRight.call(this, wrap);
	};

	Window_Techtree_Select.prototype.cursorUp = function(wrap) {
	    Window_Selectable.prototype.cursorLeft.call(this, wrap);
	};

	Felski.Techtree.Window_Selectable_drawAllItems = Window_Selectable.prototype.drawAllItems;
	Window_Techtree_Select.prototype.drawAllItems = function() {
		if(this._hasTechtrees){
			Window_Selectable.prototype.drawAllItems.call(this);
		}else{
			this.drawInfo();
		}
	};

	Felski.Techtree.Window_Selectable_itemRect = Window_Selectable.prototype.itemRect;
	Window_Techtree_Select.prototype.itemRect = function(index) {
	    if(this._hasTechtrees){
			return Felski.Techtree.Window_Selectable_itemRect.call(this, index);
		}else{
			var w = this.windowWidth();
	        var h = this.windowHeight();
	        var y = h/3;
	        var lh = this.techTreeLineHeight();
	        var rect = new Rectangle();
	        rect.width = w/3;
    		rect.height = lh;
    		rect.x = w/3;
    		rect.y = y+lh;
    		return rect;
		}
	};

    Window_Techtree_Select.prototype.drawInfo = function() {
        var w = this.windowWidth();
        var h = this.windowHeight();
        var x = 0;
        var y = h/3;
        var lh = this.techTreeLineHeight();    
        var text = Felski.Techtree.NoTreeText;
    	text = text.format(this._actor.name());
        this.drawText(text, x, y, w, 'center');
        this.drawText(Felski.Techtree.TTNAClose, x, y+lh, w, 'center');
        this.setCursorRect(w/3, y+lh, w/3, lh);
    };

	Window_Techtree_Select.prototype.drawItem = function(index) {
		if(index < 0) return;
		var symbol = this.commandSymbol(index);
		symbol = Number(symbol);
		var tree = this._actor._techtrees[symbol];
		if(this.isCommandVisible(index)) {
		    var rect = this.itemRectForText(index - this._firstVisibleCol);
		    var align = this.itemTextAlign();

		    // Header Line
		    this.resetTextColor();
		    this.changePaintOpacity(this.isCommandEnabled(index) && !Felski.Techtree.singleTreeView);
		    this.setFont(Felski.Techtree.TTHeaderFont);
			this.changeTextColor(this.textColor(Felski.Techtree.TTHeaderFontColor));
			this.setFontSize(Felski.Techtree.TTHeaderFontSize);
			if(Felski.Techtree.TTHeaderLIcons) this.drawIcon(tree.icon, rect.x, rect.y+2);
			if(Felski.Techtree.TTHeaderTIcons) this.drawIcon(tree.icon, rect.x + rect.width-Window_Base._iconWidth, rect.y+2);
		    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);

		    if(this.index() === index){
		    	var desc = tree.tech_description;
		    	this.setFont(Felski.Techtree.TTHeaderDescFont);
				this.changeTextColor(this.textColor(Felski.Techtree.TTHeaderDescFontColor));
				this.setFontSize(Felski.Techtree.TTHeaderDescFontSize);
		    	this.drawTextAutoWrap(desc, 0, rect.height, this.windowWidth() - this.standardPadding()*2);
		    }
		    this.resetTextColor();
	    }
	};

	Window_Techtree_Select.prototype.isCommandVisible = function(index) {
		return (index >= this._firstVisibleCol && index <= this._lastVisibleCol);
	};

	Window_Techtree_Select.prototype.select = function(index) {	
		if(index >= 0){
			if(index > this._lastVisibleCol){
				this._lastVisibleCol = index;
				this._firstVisibleCol = index - (this.maxCols() - 1);
			}else if(index < this._firstVisibleCol){
				this._lastVisibleCol = index + (this.maxCols() - 1);
				this._firstVisibleCol = index;
			}
			if(this._techtreeWindow){
				var symbol = this.commandSymbol(index);
				symbol = Number(symbol);
				if(Felski.Techtree.TTHeaderUpdate){
					if(this._techtreeWindow){
						this._techtreeWindow.changeTree(symbol);
					}
					if(this._techtreeCurrencyWindow){
						this._techtreeCurrencyWindow.setTree(symbol);
					}
				}
			}
		}
		Window_Selectable.prototype.select.call(this, index);
	};

	Window_Techtree_Select.prototype.reselect = function() {
	};

	Window_Techtree_Select.prototype.updateCursor = function() {
	    if (this._cursorAll) {
	        var allRowsHeight = this.maxRows() * this.itemHeight();
	        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
	        this.setTopRow(0);
	    } else if (this.isCursorVisible()) {
	        var rect = this.itemRect(this.index() - this._firstVisibleCol);
	        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
	    } else {
	        this.setCursorRect(0, 0, 0, 0);
	    }
	};


//************************************************************************************************
//
// Window_Techtree_Info
//
//************************************************************************************************

	Window_Techtree_Info.prototype = Object.create(Window_Base.prototype);
	Window_Techtree_Info.prototype.constructor = Window_Techtree_Info;

	Window_Techtree_Info.prototype.initialize = function(x, y, actor) {
		var width = this.windowWidth();
		var height = this.windowHeight();
		this._actor = actor;
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
	};

	Window_Techtree_Info.prototype.windowWidth = function() {
	    return Window_Base._faceWidth + this.standardPadding();
	};

	Window_Techtree_Info.prototype.windowHeight = function() {
	    return Window_Base._faceHeight + this.standardPadding();
	};

	Window_Techtree_Info.prototype.update = function() {
	    Window_Base.prototype.update.call(this);
	    if (this._actor) {
	    	this.refresh();
	    }
	};

	Window_Techtree_Info.prototype.refresh = function() {
	    this.contents.clear();
	    var w = Window_Base._faceWidth;
        var w2 = (w/4)*3 - w/4;
        var w3 = w - w/4;
        var lh = this.techTreeLineHeight();   

        var actor = this._actor;
        var name = actor.name();
        var level = actor.level;
        this.setFont(Felski.Techtree.TTFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTFontColor));
        this.setFontSize(Felski.Techtree.TTFontSize);
        this.drawActorFace(actor, 0, 0, w, w);
        //this.drawText("N", w2, lh*0, w3, 'left');
        this.drawText(name, 0, 0, w3, 'left');
        //this.drawText("L", w2, lh*1, w3, 'left');
        //this.drawText(level, w2, lh*1, w3, 'right');
        this.resetFontSettings(); 
	};


//************************************************************************************************
//
// Window_Techtree_Confirm
//
//************************************************************************************************

    Window_Techtree_Confirm.prototype = Object.create(Window_Base.prototype);
    Window_Techtree_Confirm.prototype.constructor = Window_Techtree_Confirm;

    Window_Techtree_Confirm.prototype.initialize = function(actor, onlyDisplay) {
        var x = Graphics.width/6;
        var y = Graphics.height/6;
        this._index = true;
        this._maxDepth = 0;
        this._maxLanes = 0;
        this._actor = actor;
        this._activeTree = null;
        this._node = null;
        this._costsArray = null;
        this._costsArrayWidth = null;
        this._buttonSprites = [];
        this._onlyDisplay = onlyDisplay || false;
        this._firstDraw = 1;
        var width = this.windowWidth();
        var height = this.windowHeight();
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
/* done when the scene opens
    Window_Techtree_Confirm.prototype.preloadImages = function(){
    	if(this._node !== null){
    		var technode = this._node.technode;
    		ImageManager.reserveTechtreeBGIMG(technode.bgimg);
			console.log(technode.bgimg);
    	}	
    };
*/
    Window_Techtree_Confirm.prototype.updateSize = function() {
    	var x = Graphics.width/6;
        var y = Graphics.height/6;
    	if(this._node !== null){
    		if(this._node.technode.bigNode){
    			x = 0;
    			y = 0;
    		}
    	}
    	var width = this.windowWidth();
        var height = this.windowHeight();
		this.move(x, y, width, height);
		this.createContents();
	};

	Window_Techtree_Confirm.prototype.show = function() {
		//this.preloadImages();
		this.updateSize();
		Window_Base.prototype.show.call(this);
		this._firstDraw = 1;
	};

    Window_Techtree_Confirm.prototype.activate = function() {
        Window_Base.prototype.activate.call(this);
        if(this.isNodeActive()){
            this._index = false;
        }else if (this.canBeUnlocked()){
            	this._index = true;      
        }else{
            this._index = false;
        }
        this.updateCursor();
    };

    Window_Techtree_Confirm.prototype.changebgimg = function() {
    	if(!Felski.Techtree.TTMenuBackground) return;
        if(this._activeTree){
        	if(this._node.technode.bgimg){
        		var bitmap = ImageManager.loadTechtreeBGIMG(this._node.technode.bgimg);
				var newWidth = Math.floor(this.windowWidth() - this.textPadding());
				var newHeight = Math.floor(this.windowHeight() - this.textPadding());
				this.backOpacity = Felski.Techtree.TTMenuConfirmBackgroundOpacity;
				this._windowBackSprite.bitmap = new Bitmap(newWidth, newHeight);
				this._windowBackSprite.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, newWidth, newHeight);
        	}else if(this._activeTree.bgimg){
        		var bitmap = ImageManager.loadTechtreeBGIMG(this._activeTree.bgimg);
				var newWidth = this.windowWidth();
				var newHeight = this.windowHeight();			
				this.backOpacity = Felski.Techtree.TTMenuBackgroundOpacity;
				this._windowBackSprite.bitmap = new Bitmap(newWidth, newHeight);
				this._windowBackSprite.bitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, newWidth, newHeight);
        	}
        }
    };


    Window_Techtree_Confirm.prototype.removeAnimation = function(){
    	if(!this._animation) return;
        if(this._animation.finished()){
        	this.removeChild(this._animation);
        }
    };

//************************************************************************************************
//
// Window_Techtree_Confirm // Technical Functions
//
//************************************************************************************************

    Window_Techtree_Confirm.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.processCursorMove();
        this.processHandling();
        this.processTouch();
        if(this.visible){
        	if(this._firstDraw > 0){
            	this.drawAll();
            	this._firstDraw = this._firstDraw - 1;
        	}
        }
        this.removeAnimation();
    };

    Window_Techtree_Confirm.prototype.windowHeight = function() {
    	if(this._node !== null){
    		if(this._node.technode.bigNode){
    			return Graphics.height;
    		}
    	}
        return (Graphics.height/3)*2;
    };

    Window_Techtree_Confirm.prototype.windowWidth = function() {
    	if(this._node !== null){
    		if(this._node.technode.bigNode){
    			return Graphics.width;
    		}
    	}
        return (Graphics.width/3)*2;
    };

    Window_Techtree_Confirm.prototype.setNode = function(node) {
        this._costsArray = this.createCostArray(node.technode.costs) || null;
        this._costsArrayWidth = this.measureCostArrayWidth(this._costsArray) || null;
        this._node = node;
    };

    Window_Techtree_Confirm.prototype.setTree = function(tree) {
        this._activeTree = tree;
    };

    Window_Techtree_Confirm.prototype.setAnimationPos = function(x, y) {
        this._animX = x;
        this._animY = y;
    };

    Window_Techtree_Confirm.prototype.index = function() {
        return this._index;
    };

//************************************************************************************************
//
// Window_Techtree_Confirm // Draw Functions
//
//************************************************************************************************

    Window_Techtree_Confirm.prototype.drawAll = function() {
        this.contents.clear();
        if(this._node){  
            if(this.isNodeVisible()){
                this.drawHeader();
                var withRequirement = this.drawRequirement();
                this.drawNodeInfo(withRequirement);
            }else{
                this.drawInfo();
            }
            this.changebgimg();
            this.drawActionTexts();
            this.updateCursor();           
        }
    };

    Window_Techtree_Confirm.prototype.drawInfo = function() {
        var w = this.windowWidth();
        var h = this.windowHeight();
        var x = 0;
        var y = (h-this.techTreeLineHeight())/2 - this.techTreeLineHeight();

        this.setFont(Felski.Techtree.TTNTFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTNTFontColor));
        this.setFontSize(Felski.Techtree.TTNTFontSize);
        this.drawText(Felski.Techtree.HiddenText, x, y, w, 'center');
    };

    Window_Techtree_Confirm.prototype.drawHeader = function() {
        var x = 0;
        var y = 0;
        var w = this.windowWidth();
        var technode = this._node.technode;

        this.setFont(Felski.Techtree.TTNHFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTNHFontColor));
        this.setFontSize(Felski.Techtree.TTNHFontSize);
        this.drawText(technode.header, x, y, w, 'center');
    };

    Window_Techtree_Confirm.prototype.drawRequirement = function() {
        var x = 0;
        var y = this.techTreeLineHeight();
        var w = this.windowWidth();
        var technode = this._node.technode;
        if(technode.levelRequirement){
        	this.setFont(Felski.Techtree.TTLevelRequirementFont);
	        this.changeTextColor(this.textColor(Felski.Techtree.TTLevelRequirementFontColor));
	        this.setFontSize(Felski.Techtree.TTLevelRequirementFontSize);
	        this.drawText("Requires Level "+technode.levelRequirement, x, y, w, 'center');
	        return true;
        }
        return false;
    };

    Window_Techtree_Confirm.prototype.drawActionTexts = function() {
        var x = 0;
        var y = this.windowHeight() - this.techTreeLineHeight() - this.standardPadding()*2;
        var w = (this.windowWidth()-this.standardPadding()*2)/2;

        this.setFont(Felski.Techtree.TTNHFont);
        this.setFontSize(Felski.Techtree.TTNHFontSize);
        if(this.canBeUnlocked() && this.canPayCost()){
            this.changeTextColor(this.textColor(Felski.Techtree.TTNHFontColor));
        }else{
            this.changeTextColor(this.textColor(Felski.Techtree.TTNHFontColorGreyedOut));
        }
        if(this.isNodeActive()){
            this.drawText(Felski.Techtree.TTNAAlreadyUnlocked, x, y, w, 'center');
            this.changeTextColor(this.textColor(Felski.Techtree.TTNHFontColor));
            this.drawText(Felski.Techtree.TTNAClose, w, y, w, 'center'); 
        }else{
            this.drawText(Felski.Techtree.TTNAUnlock, x, y, w, 'center');  
            this.changeTextColor(this.textColor(Felski.Techtree.TTNHFontColor));
            this.drawText(Felski.Techtree.TTNACancel, w, y, w, 'center');  
        }
        this.resetFontSettings();      
    };

    Window_Techtree_Confirm.prototype.drawNodeInfo = function(withRequirement) {
        var x = 0;
        var y = 0;
        var w = this.windowWidth();
        var h = this.windowHeight();     
        var ip = Window_Base._iconWidth + this.standardPadding();
        var lh = this.techTreeLineHeight();
        var technode = this._node.technode;
        var line;
        if(withRequirement){ //there is a level requirement, so we start drawing below the requirement line, not on it
        	line = 2;
        }else{
        	line = 1;
        }

        this.setFont(Felski.Techtree.TTNTFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTNTFontColor));
        this.setFontSize(Felski.Techtree.TTNTFontSize);
        // Description
        if(Felski.Techtree.TTNShowTechDesc){
        	line = line + this.drawTextAutoWrap(technode.tech_description, x, lh*line, w-this.standardPadding());
        }
        console.log(line)
        // onActivate
        line = line + 0.5; //add a gap
        var onActivate = technode.onActivate;
        for (var i = 0; i < onActivate.skills.length; i++) {
            x = 0;
            //var ih = lh*2; // item height
            var firstLine = false // maybe we need to adjust current line when we draw the first line
            var skill = $dataSkills[onActivate.skills[i]];
            if(Felski.Techtree.TTNShowSkillIcon){
            	this.drawIcon(skill.iconIndex, x, lh*line);
            	firstLine = true;
            }
            x = x + ip;
            if(Felski.Techtree.TTNShowSkillName){
            	this.drawText(skill.name, x, lh*line, (w-ip), 'left');
            	firstLine = true;
            }
            if (firstLine) line = line + 1; //adjust current line if needed
            if(Felski.Techtree.TTNShowSkillDesc) line = line + this.drawTextAutoWrap(skill.description, x, lh*line, (w-ip));
        }

        line = line + 0.5; //add a gap
        var statsX = 0;
        var statsY = lh*line;// + lh + onActivate.skills.length*lh*2;
        if(onActivate.stats){
        	var stats = onActivate.stats;
        	var statsArr = [];
        	var sign = "";
        	var count = 0;
        	var statsObj;
        	var nextLine = false;
        	for (var i = 0; i < 8; i++) {
        		if(stats[i]){
        			statsObj = {"id": i, "stat":stats[i]};
        			statsArr.push(statsObj);
        		}
        	}
        	for (var i = 0; i < statsArr.length; i++) {
        		if(statsArr[i].stat < 0){
        			sign = "-";
        		}else{
        			sign = "+";
        		}
        		var w2;
        		if(nextLine){
        			w2 = (w - this.standardPadding()) / (statsArr.length - Math.ceil(statsArr.length/2));
        		}else{
        			w2 = (w - this.standardPadding()) / Math.ceil(statsArr.length/2);
        		}
        		this.drawText(sign+statsArr[i].stat+" "+TextManager.param(statsArr[i].id), statsX+w2*(count%(Math.ceil(statsArr.length/2))), statsY, w2, 'center');	
				count++;
				if(count === Math.ceil(statsArr.length/2)){
					statsY = statsY + lh;
					nextLine = true;
				}
        	}
        }

        // Cost
        this.setFont(Felski.Techtree.TTNCFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTNCFontColor));
        this.setFontSize(Felski.Techtree.TTNCFontSize);
        if(!this._costsArray) {this._costsArray = this.createCostArray(technode.costs);}
        var costs = this._costsArray;
        this.drawCosts(costs);

        this.resetFontSettings();
    };

    Window_Techtree_Confirm.prototype.drawCosts = function(costs) {
        if(!this._costsArrayWidth) {this._costsArrayWidth = this.measureCostArrayWidth(costs);}
        this.setFont(Felski.Techtree.TTNCFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTNCFontColor));
        this.setFontSize(Felski.Techtree.TTNCFontSize);
        var hp = this.standardPadding()/2;
        var ip = Window_Base._iconWidth + hp;
        var costWidth = this._costsArrayWidth;
        var tw;
        var x = ((this.windowWidth()/2)-(costWidth/2));
        var y = this.windowHeight() - this.lineHeight()*2 - this.standardPadding()*2;
        for (var i = 0; i < costs.length; i++) {
            tw = this.textWidth(costs[i].amount);
            this.drawText(costs[i].amount, x, y, tw, 'left');
            x = x+tw+hp;
            if(costs[i].icon){
                this.drawIcon(costs[i].icon, x, y);
                x = x+ip+hp;
            }else if(costs[i].text){
                tw = this.textWidth(costs[i].text);
                this.drawText(costs[i].text, x, y, tw, 'left');
                x = x+tw+hp;
            }   
        }
        this.resetFontSettings();
    };


    Window_Techtree_Confirm.prototype.updateCursor = function() {
        var x = 0;
        var y = this.windowHeight() - this.techTreeLineHeight() - this.standardPadding()*2;
        var w = (this.windowWidth()-this.standardPadding()*2)/2;
        var h = this.techTreeLineHeight();
        if(this._index){
            this.setCursorRect(x, y, w, h);
        }else{
            this.setCursorRect(w, y, w, h);
        } 
    };


//************************************************************************************************
//
// Window_Techtree_Confirm // Cost Handling
//
//************************************************************************************************

    Window_Techtree_Confirm.prototype.createCostArray = function(costsObject) {
        var costArr = [];
        var costs = costsObject;
        if(costs.gold > 0){
            var gold;
            if(Imported.YEP_CoreEngine === true){
                gold = {"icon":Yanfly.Icon.Gold, "amount":costs.gold, "canPay": ($gameParty.gold()>=costs.gold ? true : false)};
            }else{
                gold = {"text":TextManager.currencyUnit, "amount":costs.gold, "canPay": ($gameParty.gold()>=costs.gold ? true : false)};
            }
            costArr.push(gold);
        }
        if(costs.jp > 0 && Imported.YEP_JobPoints){
            var jp = {"icon":Yanfly.Icon.Jp, "amount":costs.jp, "canPay": (this._actor.jp()>=costs.jp ? true : false)};
            costArr.push(jp);
        }
        if(costs.items){
            for (var i = 0; i < costs.items.length; i++) {
                var item = $dataItems[costs.items[i].id];
                if(item){
                    var cost = costs.items[i].amount;
                    var itemcost = {"icon":item.iconIndex, "amount":cost, "canPay": ($gameParty.numItems(item)>=cost ? true : false)};
                    costArr.push(itemcost);
                }else{
                    console.warn("There is an item cost that points to no item. Item ID: "+costs.items[i].id);
                }
            }
        }
        if(costs.weapons){
            for (var i = 0; i < costs.weapons.length; i++) {
                var weapon = $dataWeapons[costs.weapons[i].id];
                if(weapon){
                    var cost = costs.weapons[i].amount;
                    var itemcost = {"icon":weapon.iconIndex, "amount":cost, "canPay": ($gameParty.numItems(weapon)>=cost ? true : false)};
                    costArr.push(itemcost);
                }else{
                    console.warn("There is an weapon cost that points to no weapon. Weapon ID: "+costs.weapons[i].id);
                }
            }
        }
        if(costs.armors){
            for (var i = 0; i < costs.armors.length; i++) {
                var armor = $dataArmors[costs.armors[i].id];
                if(armor){
                    var cost = costs.armors[i].amount;
                    var itemcost = {"icon":armor.iconIndex, "amount":cost, "canPay": ($gameParty.numItems(armor)>=costs ? true : false)};
                    costArr.push(itemcost);
                }else{
                    console.warn("There is an armor cost that points to no armor. Armor ID: "+costs.armors[i].id);
                }
            }
        }
        return costArr;
    };

    Window_Techtree_Confirm.prototype.measureCostArrayWidth = function(costsArray) {
        var costs = costsArray;
        var hp = this.standardPadding()/2;
        var ip = Window_Base._iconWidth + hp;
        var amountWidth = 0;
        var textWidth = 0;
        var costWidth = 0;
        for (var i = 0; i < costs.length; i++) {
            if(costs[i].icon){
                costWidth = costWidth + ip;       
            }else if(costs[i].text){
                textWidth = this.textWidth(costs[i].text);
                costWidth = costWidth + textWidth + hp;
            }
            amountWidth = this.textWidth(costs[i].amount);
            costWidth = costWidth + amountWidth + hp;
        }
        return costWidth;
    };

    Window_Techtree_Confirm.prototype.canPayCost = function() {
        var costs = this._costsArray;
        var canPay = true;
        for (var i = 0; i < costs.length; i++) {
            if(!costs[i].canPay){
                canPay = false;
            }
        }
        return canPay;
    };

    Window_Techtree_Confirm.prototype.payCost = function() {
        var costs = this._node.technode.costs;
        if(costs.gold > 0){
            $gameParty.loseGold(costs.gold);
        }
        if(costs.jp > 0 && Imported.YEP_JobPoints){
            this._actor.loseJp(costs.jp);
        }
        if(costs.items.length > 0){
            for (var i = 0; i < costs.items.length; i++) {
                var item = $dataItems[costs.items[i].id];
                var cost = costs.items[i].amount;
                $gameParty.loseItem(item, cost, false);
            }
        }
        if(costs.weapons.length > 0){
            for (var i = 0; i < costs.weapons.length; i++) {
                var weapon = $dataWeapons[costs.weapons[i].id];
                var cost = costs.weapons[i].amount;
                $gameParty.loseItem(weapon, cost, false);   
            }
        }
        if(costs.armors.length > 0){
            for (var i = 0; i < costs.armors.length; i++) {
                var armor = $dataArmors[costs.armors[i].id];
                var cost = costs.armors[i].amount;
                $gameParty.loseItem(armor, cost, false);  
            } 
        }
    };

    Window_Techtree_Confirm.prototype.onActivate = function() {
    	this._actor.onActivateTechtreeNode(this._node.technode);
    	var onActivate = this._node.technode.onActivate;
        // Animation
        var animation;
        if(Felski.Techtree.NodeAnimDefaultID){
    		animation = $dataAnimations[Felski.Techtree.NodeAnimDefaultID];
    	}
    	if(this._activeTree.animation){
        	if(this._activeTree.animation.id){
        		animation = $dataAnimations[this._activeTree.animation.id];
        	}
        }
        if(onActivate.animation){
        	if(onActivate.animation.id){
        		animation = $dataAnimations[onActivate.animation.id];
        	}
        }
        if(animation){
    		this.parent._activateAnimation = new Sprite_Techtree_Animation(animation);
		    this.parent._activateAnimation.move(this._animX + Felski.Techtree.NodeAnimXOffset, this._animY + Felski.Techtree.NodeAnimYOffset);
		    this.parent.addChild(this.parent._activateAnimation);  
    	}
    };


//************************************************************************************************
//
// Window_Techtree_Confirm // Event Handling
//
//************************************************************************************************

    Window_Techtree_Confirm.prototype.processHandling = function() {
        if (this.isOpenAndActive()) {
            if (this.isOkTriggered()) {
                this.processOk();
            } else if (this.isCancelTriggered()) {
                this.processCancel();
            } /*else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
                this.processPagedown();
            } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
                this.processPageup();
            } */
        }
    };

    Window_Techtree_Confirm.prototype.processCursorMove = function() {
        if (this.isOpenAndActive()) {
            var lastIndex = this._index;
            if (Input.isRepeated('down')) {
                this.cursorMove(Input.isTriggered('down'));
            }
            if (Input.isRepeated('up')) {
                this.cursorMove(Input.isTriggered('up'));
            }
            if (Input.isRepeated('right')) {
                this.cursorMove(Input.isTriggered('right'));
            }
            if (Input.isRepeated('left')) {
                this.cursorMove(Input.isTriggered('left'));
            }
            /*
            if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
                this.cursorPagedown();
            }
            if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
                this.cursorPageup();
            }
            */
            if (this._index !== lastIndex) {
            	SoundManager.playCursor();
            }
        }
    };

    Window_Techtree_Confirm.prototype.cursorMove = function() {
        if(this._index){
            this._index = false;
        }else{
            this._index = true;
        }
    };

    Window_Techtree_Confirm.prototype.processCancel = function() {
        SoundManager.playCancel();
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    };

    Window_Techtree_Confirm.prototype.processOk = function() {
        if(this.canBeUnlocked() && this.canPayCost()){
            if(this._index){
                this.payCost();
                this.onActivate();
                if(!Felski.Techtree.suppressConfirmSound) this.playOkSound();
                this.updateInputData();
                this.deactivate();
                this.callOkHandler();
            }else{
                this.processCancel();
            } 
        }else{
            if(this._index){
                this.playBuzzerSound();
                this.updateInputData();
            }else{
                this.processCancel();
            } 
        }
    };

    Window_Techtree_Confirm.prototype.processTouch = function() {
        if (this.isOpenAndActive()) {
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                this._touching = true;
                this.onTouch(true);
            } else if (TouchInput.isCancelled()) {
                this.processCancel();
            }
            if (this._touching) {
                if (TouchInput.isPressed()) {
                    this.onTouch(false);
                } else {
                    this._touching = false;
                }
            }
        } else {
            this._touching = false;
        }
    };

    Window_Techtree_Confirm.prototype.onTouch = function(triggered) {
        var lastIndex = this.index();
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hitIndex = this.hitTest(x, y);
 
        if (hitIndex === true) {
            if (hitIndex == lastIndex) {
                if(triggered){
                    this.processOk();
                }
            } else {
            this.cursorMove();
            }
        } else if (hitIndex === false) {
            if (hitIndex == lastIndex) {
                if(triggered){
                    this.processCancel();
                }
            } else {
            this.cursorMove();
            }
        } 
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    };

    Window_Techtree_Confirm.prototype.hitTest = function(x, y) {
        if (this.isContentsArea(x, y)) {
            var cx = x - this.padding;
            var cy = y - this.padding;
            var x = 0;
            var y = this.windowHeight() - this.techTreeLineHeight() - this.standardPadding()*2;
            var w = (this.windowWidth()-this.standardPadding()*2)/2;
            var h = this.techTreeLineHeight();
            var right = x + w;
            var bottom = y + h;
            if (cx >= x && cy >= y && cx < right && cy < bottom) {
                return true;
            }
            var right = w + w;
            var bottom = y + h;
            if (cx >= x && cy >= y && cx < right && cy < bottom) {
                return false;
            }
        }
        return -1;
    };

//************************************************************************************************
//
// Window_Techtree_Confirm // Checks
//
//************************************************************************************************

    Window_Techtree_Confirm.prototype.isNodeVisible = function() {
        if(this._node){
            var switches = this._node.technode.visibility.switches;
            var visible = false;
            if(switches.length > 0){
                for (var i = 0; i < switches.length; i++) {
                    if(!$gameSwitches.value(switches[i].id)){
                        return false;
                    }else{
                        visible = true;
                    }
                }
                return visible;
            }else{
                return true;
            }
        }else{
            return false;
        }    
    };

    Window_Techtree_Confirm.prototype.isCurrentItemEnabled = function() {
        return (!!this._node);
    };

    Window_Techtree_Confirm.prototype.isNodeActive = function() {
        if(this._node){
            return this._node.active;
        }else{
            return false;    
        }
    };

    Window_Techtree_Confirm.prototype.isContentsArea = function(x, y) {
        var left = this.padding;
        var top = this.padding;
        var right = this.width - this.padding;
        var bottom = this.height - this.padding;
        return (x >= left && y >= top && x < right && y < bottom);
    };

    Window_Techtree_Confirm.prototype.isTouchedInsideFrame = function() {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };

    Window_Techtree_Confirm.prototype.canBeUnlocked = function() {
        if(!this._node){
            return false;
        }else if(this._node.active){
            return false; 
        }else if(!this.isNodeVisible()){
            return false;
        }else if(this._onlyDisplay){
            return false;
        }else if(this._actor.level < this._node.technode.levelRequirement){
            return false;
        }else{
            var parents = this._node.technode.parents;
            var neededParents = this._node.technode.neededParents;
            var activeParents = 0;
            for (var i = 0; i < parents.length; i++) {
                var parent = $gameSystem.searchTechtree(this._activeTree, parents[i].parent);
                if(parent){
                    if(parent.active){
                        activeParents = activeParents + 1;
                    }
                }
            }
            if(neededParents <= activeParents){
                return true;
            }else{
                return false;
            }
        }
    };

//************************************************************************************************
//
// Window_Techtree_Confirm // Handler Methods
//
//************************************************************************************************

    Window_Techtree_Confirm.prototype.setOkHandler = function(method) {
        this._okHandler = method;
    };

    Window_Techtree_Confirm.prototype.callOkHandler = function() {
        if (this._okHandler) {
            this._okHandler(this._node);
        }
    };

    Window_Techtree_Confirm.prototype.setCancelHandler = function(method) {
        this._cancelHandler = method;
    };

    Window_Techtree_Confirm.prototype.callCancelHandler = function() {
        if (this._cancelHandler) {
            this._cancelHandler();
        }
    };

    Window_Techtree_Confirm.prototype.isOkTriggered = function() {
        return Input.isRepeated('ok');
    };

    Window_Techtree_Confirm.prototype.isCancelTriggered = function() {
        return Input.isRepeated('cancel');
    };

    Window_Techtree_Confirm.prototype.updateInputData = function() {
        Input.update();
        TouchInput.update();
    };

    Window_Techtree_Confirm.prototype.playOkSound = function() {
        SoundManager.playOk();
    };

    Window_Techtree_Confirm.prototype.playBuzzerSound = function() {
        SoundManager.playBuzzer();
    };

    Window_Techtree_Confirm.prototype.isOpenAndActive = function() {
        return this.isOpen() && this.active;
    };


//************************************************************************************************
//
// Window_Techtree_Currency
//
//************************************************************************************************

	Window_Techtree_Currency.prototype = Object.create(Window_Base.prototype);
	Window_Techtree_Currency.prototype.constructor = Window_Techtree_Currency;

	Window_Techtree_Currency.prototype.initialize = function(x, y, actor) {
		var width = this.windowWidth();
		var height = this.windowHeight();
		this._actor = actor;
		this._techtrees = this._actor._techtrees;
		this._activeTree = this._techtrees[0];
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
	};	

	Window_Techtree_Currency.prototype.windowWidth = function() {
	    return (Window_Base._faceWidth + this.standardPadding())*1;
	};

	Window_Techtree_Currency.prototype.windowHeight = function() {
	    return Window_Base._faceHeight + this.standardPadding();
	};

	Window_Techtree_Currency.prototype.update = function() {
	    Window_Base.prototype.update.call(this);
	    if (this._actor && this._activeTree) {
	    	this.refresh();
	    }
	};

	Window_Techtree_Currency.prototype.setTree = function(treeId) {
		if(treeId >= 0 && treeId < this._techtrees.length){
			this._activeTree = this._techtrees[treeId];
		}
	};

	Window_Techtree_Currency.prototype.refresh = function() {
	    this.contents.clear();
	    var lh = this.techTreeLineHeight();
        var sp = this.standardPadding();
	    var w = Window_Base._faceWidth;
	    var x = 0;
	    var y = 0;
        var x2 = w - Window_Base._iconWidth - sp;
        var y2 = w/2 - lh/2;
        var w2 = x2;

        this.setFont(Felski.Techtree.TTHeaderCurFont);
        this.changeTextColor(this.textColor(Felski.Techtree.TTHeaderCurFontColor));
        this.setFontSize(Felski.Techtree.TTHeaderCurFontSize);

        lh = Felski.Techtree.TTHeaderCurFontSize + 4;

        var actor = this._actor;
        var classId = actor.currentClass().id;
        var tree = this._activeTree;
        var icon = 1;

        var c = 0;
        if(!tree.hideGoldCost){
        	var gold = $gameParty.gold();
        	if(Imported.YEP_CoreEngine === true){
	            icon = Yanfly.Icon.Gold;
	        }else{
	            icon = TextManager.currencyUnit;
	        }
	        this.drawText(gold, 0, y+lh*c, w2, 'right');
	        this.drawIcon(icon, w2, y+lh*c);
	        c++;
        }
        
        if(!tree.hideJPCost && Imported.YEP_JobPoints){
	        var jp = actor.jp(classId);
	        icon = Yanfly.Icon.Jp;
	        this.drawText(jp, 0, y+lh*c, w2, 'right');
        	this.drawIcon(icon, w2, y+lh*c);
        	c++;
        }
        
	    if(tree.costItems){
	    	for (var i = 0; i <= tree.costItems.length - 1; i++) {
		    	var item = $dataItems[tree.costItems[i]];
		    	if(item){
		    		var amount = $gameParty.numItems(item);
		    		var icon = item.iconIndex;
		    		this.drawText(amount, 0, y+lh*c, w2, 'right');
        			this.drawIcon(icon, w2, y+lh*c);
        			c++;
		    	}else{
		    		console.warn("Couldn't find costItem with the ID "+tree.costItems[i]+" for tree "+tree.uid+"("+tree.header+").");
		    	}
		    }
	    }
	        
        this.resetFontSettings(); 
	};


//************************************************************************************************
//
// Window_Base // Drawing Helping Functions
//
//************************************************************************************************

    Window_Base.prototype.drawBoxFrameBitmap = function(x, y, w, h, skin) {
        var m = 24;
        var bitmap = new Bitmap(w, h);
        if (w > 0 && h > 0 && skin) {
            var p = 96;
            var q = 96;
            bitmap.blt(skin, p+m, 0+0, p-m*2, m, m, 0, w-m*2, m); //upper line
            bitmap.blt(skin, p+m, 0+q-m, p-m*2, m, m, h-m, w-m*2, m); // bottom line
            bitmap.blt(skin, p+0, 0+m, m, p-m*2, 0, m, m, h-m*2); // left line
            bitmap.blt(skin, p+q-m, 0+m, m, p-m*2, w-m, m, m, h-m*2); // right line
            bitmap.blt(skin, p+0, 0+0, m, m, 0, 0, m, m); // top left corner
            bitmap.blt(skin, p+q-m, 0+0, m, m, w-m, 0, m, m); // top right corner
            bitmap.blt(skin, p+0, 0+q-m, m, m, 0, h-m, m, m); // bottom left corner
            bitmap.blt(skin, p+q-m, 0+q-m, m, m, w-m, h-m, m, m); // bottom right corner
        }
        this.contents.blt(bitmap, 0, 0, w, h, x, y);
    };

    Window_Base.prototype.drawBoxFrameBackgroundBitmap = function(x, y, w, h, skin, opacity) {
        var m = this._margin;
        //var m = this._margin;
        var w = w - m * 2;
        var h = h - m * 2;
        var opacity = opacity || 255;
        var bitmap = new Bitmap(w, h);
        if (w > 0 && h > 0 && skin) {
            var p = 96;
            bitmap.blt(skin, 0, 0, p, p, 0, 0, w, h);
            var tone = this._colorTone;
            bitmap.adjustTone(tone[0], tone[1], tone[2]);
        }
        var oldOpacity = this.contents.paintOpacity;
        this.contents.paintOpacity = opacity;
        this.contents.blt(bitmap, 0, 0, w, h, x+m, y+m);
        this.contents.paintOpacity = oldOpacity;
    };

    Window_Base.prototype.drawArrow = function(x1, y1, x2, y2, skin) {
        var sw = skin.width/4;
        var sh = skin.height/3;
        y1 = y1 - sh/2;
        y2 = y2 - sh/2;
        var tx = Math.min(x1, x2);
        var ty = Math.min(y1, y2);
        var w = x1 - x2;
        var h = y1 - y2;
        if(w<0){
            w = w * -1;
        } 
        if(h<0) { 
            h = h * -1;
        }
        h = h + sh;
        var bitmap = new Bitmap(w, h);
    /**
     * Performs a block transfer.
     *
     * @method blt
     * @param {Bitmap} source The bitmap to draw
     * @param {Number} sx The x coordinate in the source
     * @param {Number} sy The y coordinate in the source
     * @param {Number} sw The width of the source image
     * @param {Number} sh The height of the source image
     * @param {Number} dx The x coordinate in the destination
     * @param {Number} dy The y coordinate in the destination
     * @param {Number} [dw=sw] The width to draw the image in the destination
     * @param {Number} [dh=sh] The height to draw the image in the destination
     */
        if (w > 0 && h > 0 && skin) {
            if(y1 == y2){ // same height
                bitmap.blt(skin, 0, sh, sw, sh, x1-tx, y1-ty, sw, sh); //middle left
                bitmap.blt(skin, 0, sh, sw, sh, x1-tx+sw, y1-ty, w-sw*2, sh); //middle left
                bitmap.blt(skin, sw*3, sh, sw, sh, x1-tx+w-sw, y1-ty, sw, sh); //arrowhead
            }else if (y1 < y2){ // target below
                bitmap.blt(skin, 0, sh, sw, sh, x1-tx, y1-ty, sw, sh); //middle left
                bitmap.blt(skin, sw*2, 0, sw, sh, x1-tx+sw, y1-ty, sw, sh); //top right
                bitmap.blt(skin, sw, sh, sw, sh, x1-tx+sw, y1-ty+sh, sw, h-sh*2); //middle middle
                if(w>sw*3) bitmap.blt(skin, 0, sh, sw, sh, x1-tx+sw*2, y1-ty+h-sh, w-sw*3, sh); //middle left
                bitmap.blt(skin, 0, sh*2, sw, sh, x1-tx+sw, y1-ty+h-sh, sw, sh); //bottom left
                bitmap.blt(skin, sw*3, sh, sw, sh, x1-tx+w-sw, y1-ty+h-sh, sw, sh); //arrowhead
            }else if (y1 > y2){ // target above
                bitmap.blt(skin, 0, sh, sw, sh, x1-tx, y2-ty+h-sh, sw, sh); //middle left
                bitmap.blt(skin, sw*2, sh*2, sw, sh, x1-tx+sw, y2-ty+h-sh, sw, sh); //bottom right
                bitmap.blt(skin, sw, sh, sw, sh, x1-tx+sw, y2-ty+sh, sw, h-sh*2); //middle middle
                if(w>sw*3) bitmap.blt(skin, 0, sh, sw, sh, x1-tx+sw*2, y2-ty, w-sw*3, sh); //middle left
                bitmap.blt(skin, 0, 0, sw, sh, x1-tx+sw, y2-ty, sw, sh); //top left
                bitmap.blt(skin, sw*3, sh, sw, sh, x1-tx+w-sw, y2-ty, sw, sh); //arrowhead
            }else{

            }           
        }
        this.contents.blt(bitmap, 0, 0, w, h, tx, ty);
    };

    Window_Base.prototype.setFontSize = function(size) {
        this.contents.fontSize = size;
    };

    Window_Base.prototype.setFont = function(font) {
        this.contents.fontFace = font;
    };


//************************************************************************************************
//
// Sprite_FelskiButton
//
//************************************************************************************************

    function Sprite_FelskiButton() {
        this.initialize.apply(this, arguments);
    }

    Sprite_FelskiButton.prototype = Object.create(Sprite.prototype);
    Sprite_FelskiButton.prototype.constructor = Sprite_FelskiButton;

    Sprite_FelskiButton.prototype.initialize = function(x, y, id) {
        Sprite.prototype.initialize.call(this);
        this.x = x;
        this.y = y;
        this._id = id;
        this._touching = false;
        this._hovering = false;
        this._hoverHandler = null;
        this._endHoverHandler = null;
        this._rightClickHandler = null;
        this._clickHandler = null;
        this._touchHandler = null;
        this._releaseHandler = null;
    };

//************************************************************************************************
//
// Sprite_FelskiButton // Handler Methods
//
//************************************************************************************************

    Sprite_FelskiButton.prototype.setHoverHandler = function(method) {
        this._hoverHandler = method;
    };

    Sprite_FelskiButton.prototype.callHoverHandler = function() {
        if (this._hoverHandler) {
            this._hoverHandler(this.position.x, this.position.y, this._id);
        }
    };

    Sprite_FelskiButton.prototype.setEndHoverHandler = function(method) {
        this._endHoverHandler = method;
    };

    Sprite_FelskiButton.prototype.callEndHoverHandler = function() {
        if (this._endHoverHandler) {
            this._endHoverHandler(this.position.x, this.position.y, this._id);
        }
    };

    Sprite_FelskiButton.prototype.setRightClickHandler = function(method) {
        this._rightClickHandler = method;
    };

    Sprite_FelskiButton.prototype.callRightClickHandler = function() {
        if (this._rightClickHandler) {
            this._rightClickHandler(this.position.x, this.position.y, this._id);
        }
    };

    Sprite_FelskiButton.prototype.setClickHandler = function(method) {
        this._clickHandler = method;
    };

    Sprite_FelskiButton.prototype.callClickHandler = function() {
        if (this._clickHandler) {
            this._clickHandler(this.position.x, this.position.y, this._id);
        }
    };

    Sprite_FelskiButton.prototype.setTouchHandler = function(method) {
        this._touchHandler = method;
    };

    Sprite_FelskiButton.prototype.callTouchHandler = function() {
        if (this._touchHandler) {
            this._touchHandler(this.position.x, this.position.y, this._id);
        }
    };

    Sprite_FelskiButton.prototype.setReleaseHandler = function(method) {
        this._releaseHandler = method;
    };

    Sprite_FelskiButton.prototype.callReleaseHandler = function() {
        if (this._releaseHandler) {
            this._releaseHandler(this.position.x, this.position.y, this._id);
        }
    };

//************************************************************************************************
//
// Sprite_FelskiButton // Update Flow
//
//************************************************************************************************

    Sprite_FelskiButton.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.processTouch();
    };

    Sprite_FelskiButton.prototype.processTouch = function() {
        if (this.isActive()) {
            if(!this._touching){
                if(this.isSpriteHovered()){
                    this._hovering = true;
                    this.callHoverHandler();
                }else{
                    if(this._hovering === true){
                        this._hovering = false;
                        this.callEndHoverHandler();
                    }
                }
            }
            if (TouchInput.isTriggered() && this.isButtonTouched()) {
                this._touching = true;
                this.callTouchHandler();
            }
            if (this._touching) {
                if (TouchInput.isReleased()) {
                    this._touching = false;
                    if (TouchInput.isReleased()) {
                        this.callReleaseHandler();
                    }
                }else{
                }
            }
            if (TouchInput.isCancelled() && this.isButtonTouched()){
                this.callRightClickHandler();
            }
        } else {
            this._touching = false;
        }
    };

//************************************************************************************************
//
// Sprite_FelskiButton // Checks
//
//************************************************************************************************

    Sprite_FelskiButton.prototype.isActive = function() {
        var node = this;
        while (node) {
            if (!node.visible) {
                return false;
            }
            node = node.parent;
        }
        return true;
    };

    Sprite_FelskiButton.prototype.isButtonTouched = function() {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };

    Sprite_FelskiButton.prototype.isSpriteHovered = function() {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    };

//************************************************************************************************
//
// Sprite_FelskiButton // Util
//
//************************************************************************************************

    Sprite_FelskiButton.prototype.canvasToLocalX = function(x) {
        var node = this;
        while (node) {
            x -= node.x;
            node = node.parent;
        }
        return x;
    };

    Sprite_FelskiButton.prototype.canvasToLocalY = function(y) {
        var node = this;
        while (node) {
            y -= node.y;
            node = node.parent;
        }
        return y;
    };

    Sprite_FelskiButton.prototype.resetPosition = function() {
        this.position.x = this._oldPosX;
        this.position.y = this._oldPosY;
    };

//************************************************************************************************
//
// Sprite_Techtree_Animation
//
//************************************************************************************************

	function Sprite_Techtree_Animation() {
		this.initialize.apply(this, arguments);
	}

	Sprite_Techtree_Animation.prototype = Object.create(Sprite_Base.prototype);
	Sprite_Techtree_Animation.prototype.constructor = Sprite_Techtree_Animation;

	Sprite_Techtree_Animation.prototype.initialize = function(animation) {
		Sprite_Base.prototype.initialize.call(this);
		this.z = 9;
		this._realX = this.x;
		this._realY = this.y;
		this._animation = animation;
		this._hasStarted = false;
		this._hasFinished = false;
	};

	Sprite_Techtree_Animation.prototype.update = function() {
		Sprite_Base.prototype.update.call(this);
		if (!this._hasStarted && this.parent) {
			this.startAnimation(this._animation, false, 0);
			this._hasStarted = true;
		}
		if (this._hasStarted && !this.isAnimationPlaying()) {
			this._hasFinished = true;
		}
	};

	Sprite_Techtree_Animation.prototype.finished = function() {
		return this._hasFinished;
	};


//************************************************************************************************
//
// Utility Stuff
//
//************************************************************************************************

	Window_Base.prototype.drawTextAutoWrap = function (baseText, x, y, maxWidth) {
		var text = this.convertEscapeCharacters(baseText);

		const replaceRegex = /(\x1b[IC]\[\d+\])/g;
		const iconRegex = /\x1bI\[(\d+)\]/;
		const colorRegex = /\x1bC\[(\d+)\]/;
		
		const iconFix = /(\x1bI\[\d+\])(\S+)/;
		const colorFix = /(\x1bC\[\d+\])(\S+)/;
		const iconFix2 = /(\S+)(\x1bI\[\d+\])/;
		const colorFix2 = /(\S+)(\x1bC\[\d+\])/;

	    if (!text) {
	        return 0;
	    }
	    var helperWords2 = text.split(' ');
	    var helperWords = [];
	    for (var i = 0; i < helperWords2.length; i++) {
	    	let buffer = helperWords2[i].replace(replaceRegex, ',$1,')
	    	if(buffer){
	    		let bufferArray = buffer.split(',');
	    		helperWords = helperWords.concat(bufferArray);
	    	}
	    }
	    var bufferWords = []
	    for (var i = 0; i < helperWords.length; i++) {
	    	var check = helperWords[i]
	    	while(check !== ""){
	    		if(check.match(iconFix)){
	    			bufferWords.push(RegExp.$1);
		    		check = RegExp.$2;
		    	}else if(check.match(colorFix)){
		    		bufferWords.push(RegExp.$1);
		    		check = RegExp.$2;
		    	}else if(check.match(iconFix2)){
	    			bufferWords.push(RegExp.$1);
		    		check = RegExp.$2;
		    	}else if(check.match(colorFix2)){
		    		bufferWords.push(RegExp.$1);
		    		check = RegExp.$2;
		    	}else{
		    		bufferWords.push(check);
		    		check = "";
	    		}
	    	};
	    }
	    const words = bufferWords;

	    let lines = 1;
	    let x2 = x;
	    let y2 = y;
	    words.forEach((word) => {
	    	var 
	        word = this.convertEscapeCharacters(word);
	        const width = this.textWidth(word + ' ');
	        // Check for linebreak symbol '/n'
	        if (word === `\x1bn`) {
	            lines++;
	            y2 += this.techTreeLineHeight();
	            x2 = 0;
	        }
	        // Check for \I[iconIndex]
	        if(word.match(iconRegex)){
	        	if (x2 + width >= maxWidth) {
		            lines++;
		            y2 += this.techTreeLineHeight();
		            x2 = 0;
		        }
		        var iconIndex = Number(RegExp.$1);
	        	this.drawIcon(iconIndex, x+x2, y2);
	        	x2 = x2 + Window_Base._iconWidth;
	        	return;
	        }
	        // Check for \C[colorIndex]
	        if(word.match(colorRegex)){
	        	var colorIndex = Number(RegExp.$1);
	        	this.changeTextColor(this.textColor(colorIndex));
	        	return;
	        }
	        if (x2 + width >= maxWidth) {
	            lines++;
	            y2 += this.techTreeLineHeight();
	            x2 = 0;
	        }
	        this.drawText(word + ' ', x+x2, y2);
	        x2 += width;
	    });
	    return lines;
	};

	Window_Base.prototype.techTreeLineHeight = function() {
		if(Felski.Techtree.compact){
			return this.contents.fontSize+6;	
		}else{
			return this.lineHeight();
		}
	};

    function jsonCopy(src) { //Credits and thanks to Farzad YZ on medium.com
        return JSON.parse(JSON.stringify(src));
    }

})();