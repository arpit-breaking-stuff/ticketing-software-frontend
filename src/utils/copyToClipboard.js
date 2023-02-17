export function copyToClipboard(text){
    navigator.clipboard.writeText(text)
    alert("Copied.")
}