local QBCore = exports['qb-core']:GetCoreObject()

local minigameResult = nil
local isMinigameActive = false

-- NUI callback when minigame finishes
RegisterNUICallback("minigameResult", function(data, cb)
    SetNuiFocus(false, false)
    isMinigameActive = false
    minigameResult = data.success

    if data.success then
        -- TODO: Insert your success logic here (e.g., unlock door, reward player)
    else
        -- TODO: Insert your fail logic here (e.g., trigger alarm, notify police)
    end

    cb("ok")
end)

-- Export function to start minigame and wait for result
exports('StartDiamondMinigame', function(callbacks)
    if isMinigameActive then
        return false
    end

    isMinigameActive = true
    minigameResult = nil

    SetNuiFocus(true, true)
    SendNUIMessage({ action = "start" })

    local timeout = 15000
    local startTime = GetGameTimer()

    while minigameResult == nil do
        Citizen.Wait(0)
        if GetGameTimer() - startTime > timeout then
            minigameResult = false
            break
        end
    end

    SetNuiFocus(false, false)
    isMinigameActive = false

    -- Trigger callbacks
    if minigameResult and callbacks and callbacks.onSuccess then
        callbacks.onSuccess()
    elseif not minigameResult and callbacks and callbacks.onFail then
        callbacks.onFail()
    end

    return minigameResult
end)


-- Command for manual testing
RegisterCommand("startdiamondminigame", function()
    if not isMinigameActive then
        SetNuiFocus(true, true)
        SendNUIMessage({ action = "start" })
        isMinigameActive = true
    end
end, false)
