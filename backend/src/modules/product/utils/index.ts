export function makeSlug(text: string) {
    return text.toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function getAuthor(text: string) {
    let author;

    text = text.replaceAll(/author:"(.+)"/g, (_substring, matchedAuthor) => {
        author = matchedAuthor;
        return "";
    });

    text = text.replaceAll(/author:(\S+)/g, (_substring, matchedAuthor) => {
        author = matchedAuthor;
        return "";
    });

    text = text.replaceAll(/\s+/g, " ");

    return {
        text,
        author
    };
}
