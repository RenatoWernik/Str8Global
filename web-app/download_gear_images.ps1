$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"

$targets = @(
    @("dji-rs4", "https://www.dji.com/rs-4-pro"),
    @("flash-v480", "http://www.godox.com/product-d/V860III.html"),
    @("led-rgb", "https://neewer.com/products/neewer-ms60c-rgb-portable-led-light-66602325"),
    @("smallrig", "https://www.smallrig.com/SmallRig-RC-60B-COB-LED-Video-Light-4376.html"),
    @("camera-cooler", "https://www.ulanzi.com/products/ulanzi-camera-cooling-fan-for-sony-canon-fujifilm-c072gbb3"),
    @("dji-mini4", "https://www.dji.com/mini-4-pro"),
    @("sony-a7iv", "https://electronics.sony.com/imaging/interchangeable-lens-cameras/full-frame/p/ilce7m4-b"),
    @("sony-a6700", "https://electronics.sony.com/imaging/interchangeable-lens-cameras/aps-c/p/ilce6700-b"),
    @("dji-pocket3", "https://www.dji.com/osmo-pocket-3"),
    @("dji-action5", "https://www.dji.com/osmo-action-5-pro"),
    @("sony-20mm", "https://electronics.sony.com/imaging/lenses/all-e-mount/p/sel20f18g"),
    @("sirui-85mm", "https://store.sirui.com/products/sirui-aurora-85mm-f1-4-full-frame-lens"),
    @("samyang-35-150", "https://samyangus.com/products/af-35-150mm-f2-2-8-sony-e"),
    @("sigma-17-40", "https://www.sigmaphoto.com/18-35mm-f1-8-dc-hsm-a")
)

foreach ($t in $targets) {
    $name = $t[0]
    $url = $t[1]
    $htmlFile = "$name.html"
    
    Write-Host "Processing $name..."
    try {
        Invoke-WebRequest -Uri $url -UserAgent $ua -OutFile $htmlFile -ErrorAction Stop
        
        $content = Get-Content $htmlFile -Raw
        $imgUrl = $null
        
        # Try og:image
        if ($content -match 'property="og:image" content="([^"]+)"') {
            $imgUrl = $matches[1]
        } elseif ($content -match 'name="twitter:image" content="([^"]+)"') {
            $imgUrl = $matches[1]
        }
        
        if ($imgUrl) {
            # Fix relative URLs if needed (simple check)
            if ($imgUrl -match "^//") { $imgUrl = "https:$imgUrl" }
            if ($imgUrl -match "^/") { 
                $uri = [System.Uri]$url
                $imgUrl = "$($uri.Scheme)://$($uri.Host)$imgUrl" 
            }
            
            Write-Host "  Found image: $imgUrl"
            $ext = "jpg"
            if ($imgUrl -match "\.png") { $ext = "png" }
            if ($imgUrl -match "\.webp") { $ext = "webp" }
            
            Invoke-WebRequest -Uri $imgUrl -UserAgent $ua -OutFile "public/images/gear/$name.$ext"
            Write-Host "  Saved to public/images/gear/$name.$ext"
        } else {
            Write-Host "  No image found for $name"
        }
    } catch {
        Write-Host "  Error processing $name : $_"
    }
}
