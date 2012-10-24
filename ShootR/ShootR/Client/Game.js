﻿/// <reference path="lib/jquery-1.6.4.js" />
/// <reference path="Ship.js" />
/// <reference path="lib/shortcut.js" />
/// <reference path="BulletManager.js" />
/// <reference path="Configuration/CanvasRenderer.js" />

function Game(connection, latencyResolver, myShipID) {
    var that = this,
        gameTime = new GameTime(),
        map = new Map();

    that.BulletManager = new BulletManager();
    that.ShipManager = new ShipManager(myShipID, gameTime);
    that.ShipManager.InitializeMyShip(that.BulletManager, connection);

    var myShip = that.ShipManager.MyShip;

    CanvasContext.Camera.Follow(myShip);

    that.HUDManager = new HUDManager(myShip, connection);

    // Ship Respawn
    $(that.ShipManager).on("Respawn", function () {
        var respawnText = $("#respawnText"),
            gameCanvas = $("#game"),
            timeLeft = $("#timeLeft");

        respawnText.css("width", gameCanvas.width());
        respawnText.css("height", gameCanvas.height());
        respawnText.css("top", gameCanvas.offset().top);
        respawnText.css("left", gameCanvas.offset().left);

        timeLeft.html(that.RESPAWN_TIMER);

        respawnText.fadeIn(2000);

        var interval = setInterval(function () {
            var left = parseInt(timeLeft.html()) - 1;
            timeLeft.html(left);

            if (left === 0) {
                clearInterval(interval);
                respawnText.fadeOut(1000);
            }
        }, 1000);
    });

    that.Update = function (payload) {
        gameTime.Update();
        CanvasContext.clear();

        map.CheckBoundaryCollisions(that.ShipManager.Ships, that.BulletManager.Bullets);

        // Move the ships on the client
        that.ShipManager.Update(gameTime);

        // Move the bullets on the client
        that.BulletManager.Update(gameTime);

        GAME_GLOBALS.AnimationManager.Update(gameTime);        

        map.Draw();
        that.ShipManager.MyShip.DrawHUD();

        CanvasContext.Render();
//        shipStats.Update(payload, latencyResolver.Latency, that.ShipManager.Ships, that.BulletManager.Bullets);

        that.HUDManager.Update();
    }
}