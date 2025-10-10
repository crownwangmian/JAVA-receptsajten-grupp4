import React from "react";
import { computeDifficulty } from "../../utils/difficulty";

export default function DifficultyBadge({ timeInMins }) {
	const label = computeDifficulty(timeInMins);
	return (
		<span className="difficulty" aria-hidden>
			{label}
		</span>
	);
}
