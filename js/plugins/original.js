/*:
 * @plugindesc このゲーム専用プラグイン
 * @author 作者名
 * @help ゲーム専用に作成された初期読み込み用プラグイン
 */

(function() {





    // 戦闘開始時の戦う・逃げるコマンドのスキップ
    //////戦闘中TIPSの表示///////

    var Scene_Battle_prototype_changeInputWindow = Scene_Battle.prototype.changeInputWindow;
    Scene_Battle.prototype.changeInputWindow = function() {

    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {

          // ここからTIPS改造部分


            this.startActorCommandSelection();

        } else {
            //this.startPartyCommandSelection();
            this.selectNextCommand();
        }
    } else {
        this.endCommandSelection();

    }
    };

    // ガード消す
    Window_ActorCommand.prototype.makeCommandList = function() {
    if (this._actor) {
        this.addAttackCommand();
        this.addSkillCommands();
        this.addGuardCommand();
        this.addItemCommand();
    }
	};


    // ウィンドウずらす
	Window_Message.prototype.updatePlacement = function() {
	this._positionType = $gameMessage.positionType();
	this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
	this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;

	if(this._positionType === 2) this.y = 450;
	this.x = 0;

//スタートメッセージ消す

	BattleManager.startBattle = function() {
	this._phase = 'start';
	$gameSystem.onBattleStart();
	$gameParty.onBattleStart();
	$gameTroop.onBattleStart();
	//this.displayStartMessages();　　　←これが原因なので//で消した
	};

    Scene_Map.prototype.startEncounterEffect = function(){};
    Scene_Battle.prototype.startFadeIn = function(){};

	};



//アクターコマンドの幅を変える

Window_ActorCommand.prototype.windowWidth = function() {
    return 300;
};



	//名前ゲージウィンドウ幅調整

Window_BattleStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth - 300;
};

	//名前位置調整

Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
    this.drawActorName(actor, rect.x + 0, rect.y, 150);
    this.drawActorIcons(actor, rect.x + 0, rect.y, rect.width - 0);
};

	//MPゲージ消す+HPゲージとTPゲージ調整

	Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x +20, rect.y, 150);
//    this.drawActorMp(actor, rect.x + 123, rect.y, 96);
    this.drawActorTp(actor, rect.x + 180, rect.y, 150);
	};


	//TP初期値を0に
	
Game_Battler.prototype.initTp = function() {
    0;
};


	//ダメージによるTP増加消す


Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
//    var value = Math.floor(50 * damageRate * this.tcr);
//    this.gainSilentTp(value);
    var value = 10;
    this.gainSilentTp(value);
};


Scene_Battle.prototype.updateStatusWindow = function() {
    if ($gameMessage.isBusy()) {
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    } else if (this.isActive() && !this._messageWindow.isClosing()) {
        this._statusWindow.open();
    }
};

Scene_Battle.prototype.updateWindowPositions = function() {

};

	//行動順からランダム要素消す(25%)

Game_Action.prototype.speed = function() {
    var agi = this.subject().agi;
//    var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    var speed = agi
    if (this.item()) {
        speed += this.item().speed;
    }
    if (this.isAttack()) {
        speed += this.subject().attackSpeed();
    }
    return speed;
};

	//Spellモーションをループに


Sprite_Actor.MOTIONS = {
    walk:     { index: 0,  loop: true  },
    wait:     { index: 1,  loop: true  },
    chant:    { index: 2,  loop: true  },
    guard:    { index: 3,  loop: true  },
    damage:   { index: 4,  loop: false },
    evade:    { index: 5,  loop: false },
    thrust:   { index: 6,  loop: false },
    swing:    { index: 7,  loop: false },
    missile:  { index: 8,  loop: false },
    skill:    { index: 9,  loop: false },
//    spell:    { index: 10, loop: false },
    spell:    { index: 10, loop: true },
    item:     { index: 11, loop: false },
    escape:   { index: 12, loop: true  },
    victory:  { index: 13, loop: true  },
    dying:    { index: 14, loop: true  },
    abnormal: { index: 15, loop: true  },
    sleep:    { index: 16, loop: true  },
    dead:     { index: 17, loop: true  }
};

//アクターの表示位置を変更

Sprite_Battler.prototype.updatePosition = function() {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY+70;
};



})();


