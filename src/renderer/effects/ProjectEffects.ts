import { createEffect } from "effector";

export const fetchProjectsSumUp = createEffect(() => window.projectManagement.getProjectsSumUp());