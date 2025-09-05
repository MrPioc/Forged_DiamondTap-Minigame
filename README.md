exports['diamond_minigame']:StartDiamondMinigame({
    onSuccess = function()
        print("Player cracked the safe!")
        QBCore.Functions.Notify("You cracked the safe!", "success")
        -- Add your reward logic here, e.g. TriggerServerEvent("myScript:rewardPlayer")
    end,
    onFail = function()
        print("Player failed the minigame!")
        QBCore.Functions.Notify("You failed!", "error")
        -- Add failure logic here, e.g., trigger police alert
    end
})
