# Create Super Admin User via Supabase Admin API
$SUPABASE_URL = "https://dtuzljwxuqqlehkrcvnj.supabase.co"
$SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dXpsand4dXFxbGVoa3Jjdm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMTgwMCwiZXhwIjoyMDgwMjc3ODAwfQ.dESOT2q1jx6BhKhBbDg9MTDEnp4xIyiLmeWnjqxzIXY"

$headers = @{
    "Authorization" = "Bearer $SERVICE_KEY"
    "Content-Type" = "application/json"
    "apikey" = $SERVICE_KEY
}

# Create user
$createUserBody = @{
    email = "brent@creativestate.com"
    password = "R!FF7177"
    email_confirm = $true
} | ConvertTo-Json

Write-Host "Creating user..." -ForegroundColor Yellow

try {
    $userResponse = Invoke-RestMethod `
        -Uri "$SUPABASE_URL/auth/v1/admin/users" `
        -Method Post `
        -Headers $headers `
        -Body $createUserBody `
        -ErrorAction Stop

    $userId = $userResponse.id
    Write-Host "✅ User created: $($userResponse.email)" -ForegroundColor Green
    Write-Host "   User ID: $userId" -ForegroundColor Gray

    # Update profile to super_admin
    Start-Sleep -Seconds 2

    $updateProfileBody = @{
        role = "super_admin"
        name = "Brent Lollis"
    } | ConvertTo-Json

    $profileResponse = Invoke-RestMethod `
        -Uri "$SUPABASE_URL/rest/v1/profiles?id=eq.$userId" `
        -Method Patch `
        -Headers $headers `
        -Body $updateProfileBody `
        -ErrorAction Stop

    Write-Host "✅ Profile updated to super_admin" -ForegroundColor Green
    Write-Host "`n🎉 Super admin user created successfully!" -ForegroundColor Green
    Write-Host "   Email: brent@creativestate.com"
    Write-Host "   Login at: http://34.29.234.193:4000"

} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Red

    if ($_.ErrorDetails.Message -match "duplicate") {
        Write-Host "`n💡 User may already exist. Run this SQL to make them super_admin:" -ForegroundColor Yellow
        Write-Host "UPDATE profiles SET role = 'super_admin', name = 'Brent Lollis' WHERE id = (SELECT id FROM auth.users WHERE email = 'brent@creativestate.com');" -ForegroundColor Cyan
    }
}
