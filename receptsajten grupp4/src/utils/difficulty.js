export function computeDifficulty(timeInMins) {
	if (timeInMins < 5) return "Lätt";
	if (timeInMins === 5) return "Mellan";
	return "Svår";
}
