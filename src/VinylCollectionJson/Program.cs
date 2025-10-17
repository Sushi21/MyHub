using SixLabors.ImageSharp.Formats.Jpeg;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using VinylCollectionJson;
using System;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.Linq;

string rootFolder = @"C:\Users\YannickDufils\Desktop\Music\Vinyl Collection";
string outputFolder = @"C:\Users\YannickDufils\Desktop\Music";
string outputJson = Path.Combine(outputFolder, "collection.json");

string imagesRoot = Path.Combine(outputFolder, "images");
Directory.CreateDirectory(imagesRoot);

var albumList = new List<AlbumInfo>();

foreach (var categoryFolder in Directory.GetDirectories(rootFolder))
{
    string categoryName = Path.GetFileName(categoryFolder);

    foreach (var artistFolder in Directory.GetDirectories(categoryFolder))
    {
        string artistName = Path.GetFileName(artistFolder);

        foreach (var albumFolder in Directory.GetDirectories(artistFolder))
        {
            string albumName = Path.GetFileName(albumFolder);
            string coverPath = Path.Combine(albumFolder, "cover.jpg");

            string? flacFile = Directory.EnumerateFiles(albumFolder, "*.flac", SearchOption.AllDirectories)
                .FirstOrDefault();

            if (flacFile == null)
            {

                flacFile = Directory.EnumerateFiles(albumFolder, "*.m4a", SearchOption.AllDirectories)
                    .FirstOrDefault();

                if (flacFile == null)
                {
                    Console.WriteLine($"[Warning] No FLAC found in '{albumFolder}' – skipping.");
                    Console.WriteLine($"Trying to get m4a instead");
                    continue;
                }
            }

            try
            {
                var file = TagLib.File.Create(flacFile);

                // Build relative path inside images folder
                string relativeImagePath = Path.Combine("images",
                    SanitizeForUrl(categoryName),
                    SanitizeForUrl(artistName),
                    SanitizeForUrl(albumName),
                    "cover.jpg");
                string destCoverPath = Path.Combine(imagesRoot,
                    SanitizeForUrl(categoryName),
                    SanitizeForUrl(artistName),
                    SanitizeForUrl(albumName),
                    "cover.jpg");

                if (System.IO.File.Exists(coverPath))
                {
                    Directory.CreateDirectory(Path.GetDirectoryName(destCoverPath) ?? ".");
                    ResizeImage(coverPath, destCoverPath, 640, 640); // ✅ only resize the copy
                }
                else
                {
                    Console.WriteLine($"[Warning] No cover.png found for '{albumFolder}'");
                }

                var albumInfo = new AlbumInfo
                {
                    Album = file.Tag.Album ?? albumName,
                    Artist = file.Tag.FirstPerformer ?? artistName,
                    Year = file.Tag.Year,
                    Category = categoryName,
                    Genre = string.Join(", ", file.Tag.Genres ?? Array.Empty<string>()),
                    Cover = relativeImagePath.Replace("\\", "/"),
                    Tracks = new List<TrackInfo>()
                };

                // Get all supported audio files (flac + m4a + mp3)
                var allTracks = Directory.EnumerateFiles(albumFolder, "*.*", SearchOption.AllDirectories)
                    .Where(f => f.EndsWith(".flac", StringComparison.OrdinalIgnoreCase)
                             || f.EndsWith(".m4a", StringComparison.OrdinalIgnoreCase)
                             || f.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase))
                    .OrderBy(f => f) // So tracks are consistent
                    .ToList();

                foreach (var trackPath in allTracks)
                {
                    try
                    {
                        var trackFile = TagLib.File.Create(trackPath);

                        string title = trackFile.Tag.Title ?? Path.GetFileNameWithoutExtension(trackPath);
                        uint trackNum = trackFile.Tag.Track;
                        TimeSpan duration = trackFile.Properties.Duration;

                        albumInfo.Tracks.Add(new TrackInfo
                        {
                            Title = title,
                            TrackNumber = trackNum,
                            Length = $"{(int)duration.TotalMinutes:D2}:{duration.Seconds:D2}"
                        });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[Warning] Could not read track '{trackPath}': {ex.Message}");
                    }
                }

                albumList.Add(albumInfo);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Error] Could not read '{flacFile}': {ex.Message}");
            }
        }
    }
}

albumList = albumList
    .GroupBy(a => new { a.Category, a.Artist })
    .SelectMany(g => g.OrderBy(a => a.Year))
    .ToList();

var options = new JsonSerializerOptions { WriteIndented = true, Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping };
string json = JsonSerializer.Serialize(albumList, options);
File.WriteAllText(outputJson, json);

Console.WriteLine($"✅ Done! JSON written to {outputJson}");
Console.WriteLine($"✅ Covers copied to {imagesRoot}");

string SanitizeForUrl(string input)
{
    string sanitized = input;

    // Remove characters unsafe for file systems and URLs
    sanitized = sanitized.Replace("'", "");    // 👈 remove apostrophes
    sanitized = sanitized.Replace("[", "").Replace("]", "");

    // Replace spaces with hyphen (for nice URLs)
    sanitized = sanitized.Replace(" ", "-");

    // Normalize accents (é -> e)
    sanitized = sanitized.Normalize(NormalizationForm.FormD);
    sanitized = new string(sanitized
        .Where(c => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) != System.Globalization.UnicodeCategory.NonSpacingMark)
        .ToArray());

    return sanitized;
}

void ResizeImage(string inputPath, string outputPath, int maxWidth, int maxHeight)
{
    using var image = Image.Load(inputPath); // requires SixLabors.ImageSharp

    image.Mutate(x => x.Resize(new ResizeOptions
    {
        Mode = ResizeMode.Max, // keep aspect ratio
        Size = new Size(maxWidth, maxHeight)
    }));

    image.Save(outputPath, new JpegEncoder { Quality = 90 });
}

namespace VinylCollectionJson
{
    class AlbumInfo
    {
        [JsonPropertyName("album")]
        public required string Album { get; set; }

        [JsonPropertyName("artist")]
        public required string Artist { get; set; }

        [JsonPropertyName("year")]
        public uint Year { get; set; }

        [JsonPropertyName("category")]
        public required string Category { get; set; }

        [JsonPropertyName("genre")]
        public required string Genre { get; set; }

        [JsonPropertyName("cover")]
        public required string Cover { get; set; }

        [JsonPropertyName("tracks")]
        public List<TrackInfo> Tracks { get; set; } = new List<TrackInfo>();
    }

    class TrackInfo
    {
        [JsonPropertyName("title")]
        public required string Title { get; set; }

        [JsonPropertyName("track")]
        public uint TrackNumber { get; set; }

        [JsonPropertyName("length")]
        public required string Length { get; set; } // We'll format as mm:ss
    }
}
