# Vinyl Collection Archive

This project documents the process of archiving a personal vinyl record collection into a structured digital format, and provides tools to generate metadata and assets for a web-based music library.

## Overview

1. **Source**  
   The vinyl collection was downloaded in **FLAC** format using [Tidal Media Downloader](https://github.com/yaronzz/Tidal-Media-Downloader).

2. **Organization**  
   The collection was divided into three main categories:
   - **Hip Hop**
   - **Metal**
   - **Misc**

3. **Metadata**  
   Each FLAC file was scanned with [Mp3tag](https://www.mp3tag.de/), leveraging the Discogs database to enrich files with metadata such as:
   - Album title
   - Artist
   - Release year
   - Genre

4. **Data Extraction Tool**  
   A custom **C# tool** was created to:
   - Traverse the collection folders
   - Extract relevant metadata (album, artist, year, genre, category, tracks, etc.)
   - Collect album cover images and export them into an output folder (resized for web usage)
   - Generate a structured **JSON file** describing the full collection

   Example JSON structure:
   ```json
   {
     "album": "Example Album",
     "artist": "Example Artist",
     "year": 2000,
     "category": "HipHop",
     "genre": "Hip Hop, Experimental",
     "cover": "images/HipHop/Example-Artist/Example-Album/cover.jpg",
     "tracks": [
       {
         "title": "Track One",
         "track": 1,
         "length": "03:45"
       },
       {
         "title": "Track Two",
         "track": 2,
         "length": "04:12"
       }
     ]
   }
