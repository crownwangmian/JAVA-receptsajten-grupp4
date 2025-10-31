import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";

// mock the recipes service
vi.mock("../services/recipes", () => ({
	getRecipes: vi.fn(),
}));
import { getRecipes } from "../services/recipes";

import Receptdetail from "./Receptdetail";

const sampleRecipes = [
	{
		id: "r1",
		_id: "r1",
		title: "Testdrink",
		imageUrl: "/test.jpg",
		timeInMins: 10,
		ingredients: ["Vodka", "Lime"],
		instructions: ["Mix", "Serve"],
		avgRating: 4.2,
	},
];

describe("Receptdetail", () => {
	beforeEach(() => {
		getRecipes.mockReset();
	});

	it("renders recipe title, time and ingredients when found", async () => {
		getRecipes.mockResolvedValue(sampleRecipes);

		render(
			<MemoryRouter initialEntries={["/recipe/r1"]}>
				<Routes>
					<Route path="/recipe/:recipeId" element={<Receptdetail />} />
				</Routes>
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
		);

		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Testdrink"
		);
		expect(screen.getByText(/Tid:/)).toBeInTheDocument();
		expect(screen.getByText(/10 min/)).toBeInTheDocument();
		expect(screen.getByText("Vodka")).toBeInTheDocument();
		expect(screen.getByText("Lime")).toBeInTheDocument();
	});

	it("shows not-found message when recipe id missing", async () => {
		getRecipes.mockResolvedValue([]);

		render(
			<MemoryRouter initialEntries={["/recipe/unknown"]}>
				<Routes>
					<Route path="/recipe/:recipeId" element={<Receptdetail />} />
				</Routes>
			</MemoryRouter>
		);

		await waitFor(() =>
			expect(screen.getByText(/Receptet hittades inte/i)).toBeInTheDocument()
		);
	});
});
