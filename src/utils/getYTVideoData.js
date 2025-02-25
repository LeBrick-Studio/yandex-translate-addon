import { detect } from "tinyld/light";

// Get the language code from the response or the text
function getLanguage(response, title, description, author) {
  // Check if there is an automatic caption track in the response
  const captionTracks =
    response?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (captionTracks?.length) {
    const autoCaption = captionTracks.find((caption) => caption.kind === "asr");
    if (autoCaption) {
      return autoCaption.languageCode;
    }
  }
  // If there is no caption track, use detect to get the language code from the text
  const text = [title, description, author].join(" ");
  // Remove anything that is not a letter or a space in any language
  const cleanText = text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{L}\s]/gu, "")
    .slice(0, 250);
  return detect(cleanText);
}

// Get the video data from the player
function getYTVideoData() {
  const player = document.querySelector("#movie_player");
  const data = player.getVideoData();
  const response = player.getPlayerResponse();
  const { isLive, isPremiere, title, author } = data;
  const { shortDescription: description } = response?.videoDetails ?? {};
  const videoData = {
    isLive,
    isPremiere,
    title,
    description,
    author,
    detectedLanguage: getLanguage(response, title, description, author),
  };
  console.log("VOT Detected language: ", videoData.detectedLanguage);
  return videoData;
}

export { getYTVideoData };
