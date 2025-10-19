import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, beforeEach, expect } from "vitest";

// mock the recipes service
vi.mock("../services/recipes", () => ({
	getRecipes: vi.fn(),
}));
import { getRecipes } from "../services/recipes";

import Startsida from "./Startsida";
import { categories } from "../data/categories";

const sampleRecipes = [
	{
		id: "r1",
		title: "Gin Fizz",
		imageUrl: "/gin.jpg",
		timeInMins: 5,
		ingredients: ["Gin", "Lime"],
	},
	{
		id: "r2",
		title: "Rum Punch",
		imageUrl: "/rum.jpg",
		timeInMins: 12,
		ingredients: ["Rom", "Orange"],
	},
];

describe("Startsida", () => {
	beforeEach(() => {
		getRecipes.mockReset();
	});

	it("renders category buttons and recipe list", async () => {
		getRecipes.mockResolvedValue(sampleRecipes);

		render(
			<MemoryRouter initialEntries={["/"]}>
				<Routes>
					<Route path="/" element={<Startsida />} />
				</Routes>
			</MemoryRouter>
		);

		// categories from data should be rendered as buttons
		for (const c of categories) {
			expect(await screen.findByText(c.name)).toBeInTheDocument();
		}

		// recipe titles should appear
		expect(await screen.findByText("Gin Fizz")).toBeInTheDocument();
		expect(await screen.findByText("Rum Punch")).toBeInTheDocument();
	});

	it("applies ?q= search filter from URL", async () => {
		getRecipes.mockResolvedValue(sampleRecipes);

		// initial URL contains a query that should match only the Gin Fizz
		render(
			<MemoryRouter initialEntries={["/?q=gin"]}>
				<Routes>
					<Route path="/" element={<Startsida />} />
				</Routes>
			</MemoryRouter>
		);

		// Gin Fizz should be present, Rum Punch should not
		expect(await screen.findByText("Gin Fizz")).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.queryByText("Rum Punch")).not.toBeInTheDocument();
		});
	});
});
