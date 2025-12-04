# Create Supabase Storage Bucket via API
$SUPABASE_URL = "https://dtuzljwxuqqlehkrcvnj.supabase.co"
$SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dXpsand4dXFxbGVoa3Jjdm5qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMTgwMCwiZXhwIjoyMDgwMjc3ODAwfQ.dESOT2q1jx6BhKhBbDg9MTDEnp4xIyiLmeWnjqxzIXY"

$body = @{
    name = "media"
    public = $true
    file_size_limit = 52428800
    allowed_mime_types = @("image/jpeg", "image/png", "image/gif", "image/webp")
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $SERVICE_KEY"
    "Content-Type" = "application/json"
    "apikey" = $SERVICE_KEY
}

Write-Host "Creating 'media' storage bucket..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod `
        -Uri "$SUPABASE_URL/storage/v1/bucket" `
        -Method Post `
        -Headers $headers `
        -Body $body

    Write-Host "✅ Storage bucket 'media' created successfully!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "✅ Bucket 'media' already exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
