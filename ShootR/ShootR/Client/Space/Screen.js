﻿function Screen(gameCanvas, gameWrapper, popUpHolder, connection) {
    var that = this,
        gameHUD;

    // Set by configuration
    that.SCREEN_BUFFER_AREA;

    // Initially set to really high, this will be changed by the configuration
    Screen.prototype.MAX_SCREEN_WIDTH = 10000;
    Screen.prototype.MAX_SCREEN_HEIGHT = 10000;

    that.Initialize = function (gamehud) {
        gameHUD = gamehud;
        UpdateScreen();
    }    

    that.TopOffset = function () {
        return 0;
    };

    that.BottomOffset = function () {
        return 0;
    };

    that.UpdateViewport = function () {
        return {
            Width: Math.max(Math.min($(window).width(), that.MAX_SCREEN_WIDTH),1),
            Height: Math.max(Math.min($(window).height(), that.MAX_SCREEN_HEIGHT) - that.TopOffset() - that.BottomOffset(), 1)
        };
    }

    that.Viewport = that.UpdateViewport();

    function UpdateGameCanvas() {
        gameCanvas.attr("width", that.Viewport.Width);
        gameCanvas.attr("height", that.Viewport.Height);
        gameWrapper.css("width", that.Viewport.Width);
        gameWrapper.css("height", that.Viewport.Height);

        if (popUpHolder) {
            popUpHolder.css("width", that.Viewport.Width);
            popUpHolder.css("height", that.Viewport.Height);
        }        
    }

    function UpdateGameCamera() {
        CanvasContext.Camera.View.WIDTH = $(gameCanvas).width() + that.SCREEN_BUFFER_AREA;
        CanvasContext.Camera.View.HEIGHT = $(gameCanvas).height() + that.SCREEN_BUFFER_AREA;
    }

    that.SendNewViewportToServer = function() {
        connection.server.changeViewport(that.Viewport.Width, that.Viewport.Height);
    }

    function UpdateScreen() {
        that.Viewport = that.UpdateViewport();

        UpdateGameCanvas();
        UpdateGameCamera();
        CanvasContext.UpdateSize(that.Viewport);

        that.SendNewViewportToServer();

        if (gameHUD) {
            gameHUD.OnScreenResize(that.Viewport);
        }

        $(that).triggerHandler("UpdateScreen");
    }

    $(window).resize(function () {
        // Wait till window has officially finished resizing (wait a quarter second).
        delay(function () {
            UpdateScreen();            
        }, 250);
    });
}