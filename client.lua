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
exports('StartDiamondMinigame', function()
    if isMinigameActive then
        return false -- already running
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
            -- timeout
            minigameResult = false
            isMinigameActive = false
            SetNuiFocus(false, false)
            break
        end
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
