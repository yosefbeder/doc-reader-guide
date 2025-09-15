import React from "react";
import Toggle from "./Toggle";
import Button from "./Button";

export default function QuestionsListToolbar({
  questionsOpen,
  toggleQuestionsOpen,
  selectedQuestions,
  isDeleting,
  allSelected,
  handleCopy,
  handleDelete,
  handleSelectAll,
}: {
  questionsOpen: boolean;
  toggleQuestionsOpen: () => void;
  selectedQuestions: number[];
  isDeleting: boolean;
  allSelected: boolean;
  handleCopy: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleSelectAll: () => void;
}) {
  return (
    <>
      <div className="mb-4">
        <Toggle
          label="Open all questions"
          checked={questionsOpen}
          onChange={toggleQuestionsOpen}
        />
      </div>
      <div className="mb-4 flex gap-2 items-center">
        <Button onClick={handleCopy} disabled={selectedQuestions.length === 0}>
          Copy
        </Button>
        <Button
          color="rose"
          onClick={handleDelete}
          disabled={selectedQuestions.length === 0}
          isLoading={isDeleting}
        >
          Delete
        </Button>
        <Button onClick={handleSelectAll}>
          {allSelected ? "Deselect All" : "Select All"}
        </Button>
        <span className="text-xs text-slate-500">
          {selectedQuestions.length} selected
        </span>
      </div>
    </>
  );
}
