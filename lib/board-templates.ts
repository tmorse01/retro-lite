export type BoardTemplate = {
  id: string;
  name: string;
  columns: string[];
};

export const BOARD_TEMPLATES: Record<string, BoardTemplate> = {
  default: {
    id: "default",
    name: "Default",
    columns: ["What went well", "What didn't go well", "What should we start"],
  },
  // Future templates can be added here
  // classic: {
  //   id: "classic",
  //   name: "Classic",
  //   columns: ["Went Well", "Needs Improvement", "Action Items"],
  // },
};

export const DEFAULT_TEMPLATE = BOARD_TEMPLATES.default;
