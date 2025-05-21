import { Alert } from "react-native";

// export function extractSongIdFromUrl(url) {
//   try {
//     // Handle case where URL might have additional parameters
//     const parsedUrl = new URL(url);
    
//     // The song ID appears after "?i=" in the URL
//     const songId = parsedUrl.searchParams.get('i');
    
//     // Alternative approach if the above doesn't work:
//     // const match = url.match(/[?&]i=(\d+)/);
//     // const songId = match ? match[1] : null;
//     Alert.alert(songId.toString())
//     return songId;
//   } catch (error) {
//     console.error('Error parsing Apple Music URL:', error);
//     return null;
//   }
// }



export function extractSongIdFromUrl(url) {
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const id = lastPart.split('=')[1];
    return id;
  } catch (error) {
    console.error("Invalid URL format", error);
    return null;
  }
}