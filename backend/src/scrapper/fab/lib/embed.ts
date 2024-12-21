export function getEmbeddedContent(description?: string) {
    if (!description) {
        return [];
    }

    const matches = description.matchAll(/href="(.+?)"/g);
    return [...matches]
        .map((match) => {
            const url = match[1].replace("&#61;", "=");

            if (url.includes("youtube.com/watch")) {
                const match = url.match(/v=([a-zA-Z0-9_-]+)/);
                if (match) {
                    return `youtubeVideo:${ match[1] }`;
                }
            }

            if (url.includes("youtu.be/")) {
                const match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
                if (match) {
                    return `youtubeVideo:${ match[1] }`;
                }
            }

            if (url.includes("youtube.com/playlist")) {
                const match = url.match(/list=([a-zA-Z0-9_-]+)/);
                if (match) {
                    return `youtubePlaylist:${ match[1] }`;
                }
            }

            if (url.includes("sketchfab.com/models/")) {
                const match = url.match(/models\/([a-zA-Z0-9_-]+)/);
                if (match) {
                    return `sketchfab:${ match[1] }`;
                }
            }

            if (url.includes("sketchfab.com/3d-models/")) {
                const match = url.match(/3d-models\/[a-zA-Z0-9_-]+-([a-zA-Z0-9]{32})/);
                if (match) {
                    return `sketchfab:${ match[1] }`;
                }
            }

            return "";
        }
        )
        .filter((url) => !!url);
}
