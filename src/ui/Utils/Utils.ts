export function cancelEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
}
