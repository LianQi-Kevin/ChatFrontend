// const exampleString: string = "<ref>击掌</ref><box>(534,508),(582,604)</box>";
const exampleString: string = "<ref> A woman</ref><box>(448,381),(726,797)</box> playing with<ref> her dog</ref><box>(219,427),(580,891)</box> on the beach";

interface matchBoxType {
    name: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

function getMatches(String: string) {
    const regex: RegExp = /<ref>\s*(.*?)\s*<\/ref><box>\s*\((\d+),(\d+)\),\((\d+),(\d+)\)\s*<\/box>/g;
    const matches: matchBoxType[] = [];
    let match;
    while ((match = regex.exec(exampleString)) !== null) {
        matches.push({
            name: match[1],
            x1: parseInt(match[2], 10),
            y1: parseInt(match[3], 10),
            x2: parseInt(match[4], 10),
            y2: parseInt(match[5], 10)
        });
    }
    return matches;
}

function PlotImg(Box: matchBoxType[]){

}

export function main() {
    const matches = getMatches(exampleString);
    console.log(matches);
}