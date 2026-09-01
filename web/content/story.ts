export interface Story {
  confirmed: boolean;
  questionsForFamily: string[];
  paragraphs: string[];
}

/**
 * PLACEHOLDER COPY — nothing here is confirmed (spec §5.6). Keep it visibly
 * flagged until the family answers. Do not invent replacement copy.
 */
export const story: Story = {
  confirmed: false,
  questionsForFamily: [
    "Aling Nene's full name, and what people call her",
    'Where "Tumba Tumba" comes from (the rocking chair? a spot? a nickname?)',
    "The year the kitchen started, and on what — was it the crispy pata first?",
    "Who runs it now (which generation, whose recipes)",
    "One detail only the family would know (a regular's order, a fiesta, the vat)",
  ],
  paragraphs: [
    "[Placeholder — to be replaced with the family's own account.] Aling Nene started cooking for the neighbourhood out of a small kitchen on General Kalentong. The crispy pata was the dish people came back for, and word carried down the street from there.",
    "The name Tumba Tumba comes from [the rocking chair / the story you'll tell us]. Three [or however many] generations later, the same recipes are still cooked to order — the pata scored and simmered before it ever hits the oil, the pancit tossed in a pan wide enough to feed a fiesta.",
    "Today the kitchen is run by [names, roles]. Call ahead, pull up a chair, and stay a while.",
  ],
};
