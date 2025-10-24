import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";

import Receptdetail from "./Receptdetail";
import * as recipes from "../services/recipes";

describe("Receptdetail basic behaviors", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("shows an error message when recipes cannot be loaded", async () => {
		vi.spyOn(recipes, "getRecipes").mockRejectedValue(
			new Error("Network error")
		);

		render(
			<MemoryRouter initialEntries={["/recipe/abc"]}>
				<Routes>
					<Route path="/recipe/:recipeId" element={<Receptdetail />} />
				</Routes>
			</MemoryRouter>
		);

		const el = await screen.findByText(/Error: Network error/i);
		expect(el).toBeTruthy();
	});

	it("calls postRating and locks stars after click", async () => {
		const fakeRecipe = {
			_id: "r1",
			title: "Test Drink",
			imageUrl: "/img.jpg",
			timeInMins: 5,
			ingredients: ["a"],
			instructions: ["do it"],
			avgRating: [3],
		};

		vi.spyOn(recipes, "getRecipes").mockResolvedValue([fakeRecipe]);
		const postSpy = vi
			.spyOn(recipes, "postRating")
			.mockResolvedValue({ avgRating: 4 });

		render(
			<MemoryRouter initialEntries={["/recipe/r1"]}>
				<Routes>
					<Route path="/recipe/:recipeId" element={<Receptdetail />} />
				</Routes>
			</MemoryRouter>
		);

		await screen.findByText(/Test Drink/i);

		const stars = screen.getAllByText("☆");
		expect(stars.length).toBeGreaterThanOrEqual(5);

		fireEvent.click(stars[3]);

		await waitFor(() => expect(postSpy).toHaveBeenCalledTimes(1));
		expect(postSpy).toHaveBeenCalledWith("r1", 4);

		const thankYou = await screen.findByText(
			/Tack! Du har betygsatt detta recept./i
		);
		expect(thankYou).toBeTruthy();

		const maybeStar = screen.queryByText("☆");
		if (maybeStar) {
			fireEvent.click(maybeStar);
		}
		expect(postSpy).toHaveBeenCalledTimes(1);
	});
});

// Additional basic tests kept from previous suite
describe("Receptdetail (legacy/basic)", () => {
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

	beforeEach(() => {
		// ensure getRecipes is reset between tests
		if (recipes.getRecipes && recipes.getRecipes.mockReset) {
			recipes.getRecipes.mockReset();
		}
	});

	it("renders recipe title, time and ingredients when found", async () => {
		vi.spyOn(recipes, "getRecipes").mockResolvedValue(sampleRecipes);

		render(
			<MemoryRouter initialEntries={["/recipe/r1"]}>
				<Routes>
					<Route path="/recipe/:recipeId" element={<Receptdetail />} />
				</Routes>
			</MemoryRouter>
		);

		// heading level 1 is the hero title
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
		vi.spyOn(recipes, "getRecipes").mockResolvedValue([]);

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
