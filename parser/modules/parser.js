function isJsonLog(raw){
    return typeof raw==="object" && !Array.isArray(raw);
}

function extractErrorMessage(text){
    const msgRegexList = [
    /(?:ERROR|Exception|TypeError|ReferenceError|SyntaxError|NullPointerException):?(.+)/i,
    /(?<=message\s*:\s*)(.*)/i
    ];

    for(let regex of msgRegexList){
        const match=text.match(regex);
        if(match){
            return match[1].trim();
        }
    }

    return "unknown error";
}

function extractStack(text){
    const stackRegex = /(at\s.+)/gis;

    const match=text.match(stackRegex);

    if (match) return match.join("\n");

    if (match) return match.join("\n");

    // Java stack pattern
    const javaStackRegex = /(at\s[\w./$]+\(.*\))/gis;
    const javaMatch = text.match(javaStackRegex);
    if (javaMatch) return javaMatch.join("\n");

    return null;
}

function extractFileAndLine(text) {
  let jsMatch = text.match(/([\w-]+\.\w+):(\d+):(\d+)/);
  if (jsMatch)
    return { endpoint: jsMatch[1], line: jsMatch[2], col: jsMatch[3] };

  let javaMatch = text.match(/([\w/$]+\.java):(\d+)/);
  if (javaMatch)
    return { endpoint: javaMatch[1], line: javaMatch[2], col: null };

  return { endpoint: null, line: null, col: null };
}

module.exports = function parseLog(raw){
    if(isJsonLog(raw)){
        return {
        exceptionType: raw.exceptionType,
        severity: raw.severity || "ERROR",
        message: raw.message || "Unknown error",
        stack: raw.stackTrace[0] || null,
        endpoint: raw.endpoint || null,
        line: raw.lineNumber || null,
        className: raw.className,
        fileName: raw.fileName,
        methodName: raw.methodName,
        timestamp: raw.timestamp || Date.now(),
        applicationId:null
        };
    }
    
    const text=String(raw);
    const message = extractErrorMessage(text);
    const stack = extractStack(text);
    const { endpoint, line, col } = extractFileAndLine(text);

    return {
    service: "raw-upload",
    severity: "ERROR",
    message,
    stack,
    endpoint,
    line,
    col,
    timestamp: Date.now()
    };
}

